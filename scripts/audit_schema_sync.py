#!/usr/bin/env python3
"""Audit an upstream schema sync for the failures that don't announce themselves.

The vitest suite already catches uncategorized classes and stale category
entries. This script covers what nothing else does:

  1. Class/slot adds, drops and renames between two processed.json snapshots.
  2. Hand-curated override sets in src/models/containmentGraph.ts whose members
     no longer exist in the schema (they are keyed by slot NAME, and a rename
     removes them silently -- no error, no test failure).
  3. Slots whose range or multivalued flag changed, since both are inputs to
     the ownership classifier: the same slot can flip own-fwd <-> own-bkwd
     without the slot itself appearing in any diff you'd think to read.
  4. Classes with zero inbound ownership edges ("false roots"). This is the
     2026-08-31 failure mode: widening associated_artifact's range to Entity
     stranded Assay as a root. No config was stale and no test went red; the
     diagram just quietly got worse.

Ownership verdicts come from the REAL classifier in
src/models/containmentGraph.ts, via scripts/dump_classifier.test.ts -- not from
a Python copy of its rules. That means this script needs node_modules present
(`npm ci`), which is the price of not having two copies of the rules drift.

Usage:
    audit_schema_sync.py                  # working tree vs. merge-base with main
    audit_schema_sync.py --base main --head schema-sync/upstream-update
    audit_schema_sync.py --base-file old.json --head-file new.json

Exit codes: 0 = nothing needing judgment, 1 = review items found, 2 = error.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PROCESSED = "public/source_data/HM/bdchm.processed.json"

# Ownership override sets to check for stale members. Names must match the
# exported `const` identifiers in containmentGraph.ts; a set that gets renamed
# there shows up here as "not found in containmentGraph.ts" rather than being
# skipped silently.
OVERRIDE_SETS = [
    ("SINGLE_VALUE_OWNER_TARGETS", "class"),
    ("ASSOCIATION_SLOTS", "slot"),
    ("CARDINALITY_SPLIT_OWN_FWD", "slot"),
    ("BACKWARD_DESPITE_MULTIVALUED", "slot"),
    ("SKIP_SUBCLASS_EXPANSION", "class"),
]

ENTITY_ROOT = "Entity"


# --------------------------------------------------------------------------
# loading
# --------------------------------------------------------------------------

def git_show(ref: str, path: str) -> dict:
    """Read a JSON file as of a git ref."""
    try:
        blob = subprocess.run(
            ["git", "show", f"{ref}:{path}"],
            cwd=REPO_ROOT, capture_output=True, text=True, check=True,
        ).stdout
    except subprocess.CalledProcessError as exc:
        die(f"could not read {path} at {ref}: {exc.stderr.strip()}")
    return json.loads(blob)


def merge_base(ref: str) -> str:
    try:
        return subprocess.run(
            ["git", "merge-base", "HEAD", ref],
            cwd=REPO_ROOT, capture_output=True, text=True, check=True,
        ).stdout.strip()
    except subprocess.CalledProcessError:
        die(f"no merge base between HEAD and {ref}")


def die(msg: str) -> None:
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(2)


# --------------------------------------------------------------------------
# model helpers
# --------------------------------------------------------------------------

def slot_sites(schema: dict) -> dict[tuple[str, str], dict]:
    """Map (class, slot name) -> slot definition, resolving each class's refs.

    Keyed by (class, slot) rather than slot name because the override sets are
    keyed by name alone -- which is the latent bug they carry, so the audit has
    to be able to see how many sites a name actually covers.
    """
    flat = schema.get("slots", {})
    sites: dict[tuple[str, str], dict] = {}
    for cls_name, cls in schema.get("classes", {}).items():
        for ref in cls.get("slots", []) or []:
            sid = ref.get("id") if isinstance(ref, dict) else ref
            defn = flat.get(sid)
            if defn:
                sites[(cls_name, defn.get("name", sid))] = defn
    return sites


def class_ancestors(schema: dict, name: str) -> set[str]:
    seen, cur = set(), schema.get("classes", {}).get(name)
    while cur and cur.get("parent"):
        parent = cur["parent"]
        if parent in seen:
            break
        seen.add(parent)
        cur = schema["classes"].get(parent)
    return seen


def run_classifier(schema: dict, label: str) -> dict:
    """Run the REAL classifier (src/models/containmentGraph.ts) over a schema.

    Deliberately NOT reimplemented here. An earlier draft of this script
    retyped the seven ownership rules in Python and got their order wrong; two
    copies of one decision procedure drift silently, which is exactly the
    failure this whole script exists to catch. scripts/dump_classifier.test.ts
    imports classifySlotEdgeExplained and writes its verdicts as JSON.

    Driven through vitest because the project already depends on it and it
    resolves the TS + import paths with no extra tooling.
    """
    with tempfile.TemporaryDirectory() as tmp:
        in_path = Path(tmp) / "schema.json"
        out_path = Path(tmp) / "verdicts.json"
        in_path.write_text(json.dumps(schema))
        proc = subprocess.run(
            ["./node_modules/.bin/vitest", "run",
             "scripts/dump_classifier.test.ts", "--reporter=dot"],
            cwd=REPO_ROOT,
            capture_output=True, text=True,
            env={**os.environ,
                 "CLASSIFIER_INPUT": str(in_path),
                 "CLASSIFIER_OUTPUT": str(out_path)},
        )
        if not out_path.exists():
            die(
                f"could not run the ownership classifier for {label}.\n"
                f"  tried: npx vitest run scripts/dump_classifier.test.ts\n"
                f"  is node_modules installed? (npm ci)\n\n"
                f"{proc.stdout[-1500:]}{proc.stderr[-1500:]}"
            )
        return json.loads(out_path.read_text())


def owned_classes(schema: dict, verdicts: dict, *,
                  any_edge: bool = False) -> set[str]:
    """Classes that something points at, so the diagram has somewhere to put them.

    Two notions, because they catch different regressions:

    `any_edge=False` -- the owned end of an ownership edge. own-fwd A.s -> B
    owns B; own-bkwd A.s -> B means B owns A.

    `any_edge=True` -- referenced by ANY class-ranged slot, whatever the
    verdict. This is the one that catches the Assay regression: Assay's only
    inbound slot was single-valued and non-Entity-ranged, hence own-bkwd, so
    Assay never counted as "owned" even while the edge existed. Losing that
    edge left it with no inbound reference at all -- invisible to the stricter
    measure, obvious to this one.
    """
    classes = schema.get("classes", {})
    owned: set[str] = set()
    for site in verdicts["sites"]:
        cls, rng, verdict = site["class"], site["range"], site["verdict"]
        if any_edge:
            owned.add(rng)
            continue
        if verdict == "own-fwd":
            owned.add(rng)
        elif verdict == "own-bkwd":
            owned.add(cls)
    # Inheritance: a subclass is placed if a *proper* ancestor is owned. Entity
    # is excluded -- it is the universal root, so every class descends from it
    # and counting it would mark the whole schema owned, hiding every root.
    inherited = {
        name for name in classes
        if (class_ancestors(schema, name) - {ENTITY_ROOT}) & owned
    }
    return (owned | inherited) - {ENTITY_ROOT}


# --------------------------------------------------------------------------
# reporting
# --------------------------------------------------------------------------

class Report:
    def __init__(self) -> None:
        self.sections: list[tuple[str, list[str], bool]] = []

    def add(self, title: str, lines: list[str], needs_review: bool = True) -> None:
        self.sections.append((title, lines, needs_review))

    @property
    def review_count(self) -> int:
        return sum(1 for _, lines, needs in self.sections if lines and needs)

    def render(self) -> str:
        out = []
        for title, lines, needs in self.sections:
            mark = "!" if lines and needs else "."
            out.append(f"[{mark}] {title}")
            for line in (lines or ["    (none)"]):
                out.append(f"    {line}")
            out.append("")
        return "\n".join(out)


def rename_pairs(added: set[str], removed: set[str], old: dict, new: dict) -> list[str]:
    """Guess renames by matching descriptions, which survive a rename."""
    pairs = []
    by_desc = {}
    for name in removed:
        desc = (old.get(name) or {}).get("description")
        if desc:
            by_desc.setdefault(desc, []).append(name)
    for name in sorted(added):
        desc = (new.get(name) or {}).get("description")
        for cand in by_desc.get(desc, []):
            pairs.append(f"{cand} -> {name}  (identical description)")
    return pairs


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default="origin/main",
                    help="git ref for the pre-sync schema (default: origin/main)")
    ap.add_argument("--head", default=None,
                    help="git ref for the post-sync schema (default: working tree)")
    ap.add_argument("--base-file", type=Path, help="read the pre-sync schema from a file")
    ap.add_argument("--head-file", type=Path, help="read the post-sync schema from a file")
    args = ap.parse_args()

    if args.base_file:
        old = json.loads(args.base_file.read_text())
        base_label = str(args.base_file)
    else:
        base_ref = merge_base(args.base)
        old = git_show(base_ref, PROCESSED)
        base_label = f"{args.base} ({base_ref[:7]})"

    if args.head_file:
        new = json.loads(args.head_file.read_text())
        head_label = str(args.head_file)
    elif args.head:
        new = git_show(args.head, PROCESSED)
        head_label = args.head
    else:
        new = json.loads((REPO_ROOT / PROCESSED).read_text())
        head_label = "working tree"

    old_v = run_classifier(old, base_label)
    new_v = run_classifier(new, head_label)
    ov = {k: set(v) for k, v in new_v['sets'].items()}
    old_verdict = {(s["class"], s["slot"]): s["verdict"] for s in old_v["sites"]}
    new_verdict = {(s["class"], s["slot"]): s["verdict"] for s in new_v["sites"]}
    rep = Report()

    print(f"Schema sync audit\n  base: {base_label}\n  head: {head_label}\n")

    # 1. classes ------------------------------------------------------------
    old_cls, new_cls = set(old["classes"]), set(new["classes"])
    added_c, removed_c = new_cls - old_cls, old_cls - new_cls
    lines = [f"+ {c}" for c in sorted(added_c)] + [f"- {c}" for c in sorted(removed_c)]
    lines += [f"~ {p}" for p in rename_pairs(added_c, removed_c, old["classes"], new["classes"])]
    if lines:
        lines.append("-> categorize each new class in src/config/entityCategories.ts")
        lines.append("   (or record it in UNCATEGORIZED_BY_DESIGN); `npm run test:sync` enforces this")
    rep.add("Classes added / removed", lines)

    # 2. slot sites ---------------------------------------------------------
    old_sites, new_sites = slot_sites(old), slot_sites(new)
    added_s, removed_s = set(new_sites) - set(old_sites), set(old_sites) - set(new_sites)
    lines = [f"+ {c}.{s}" for c, s in sorted(added_s)] + [f"- {c}.{s}" for c, s in sorted(removed_s)]
    rep.add("Slot sites added / removed", lines, needs_review=bool(lines))

    # 3. stale override members --------------------------------------------
    lines = []
    for name, kind in OVERRIDE_SETS:
        members = ov.get(name)
        if members is None:
            lines.append(f"{name}: NOT FOUND in containmentGraph.ts (renamed? update OVERRIDE_SETS here)")
            continue
        known = new_cls if kind == "class" else {s for _, s in new_sites}
        for m in sorted(members - known):
            lines.append(f"{name}: '{m}' no longer exists in the schema -- stale override")
    if lines:
        lines.append("-> a stale member is a silent no-op; the slot it guarded now takes the default verdict")
    rep.add("Hand-curated override sets vs. schema", lines)

    # 3b. multi-site names --------------------------------------------------
    site_count: dict[str, list[str]] = {}
    for cls, slot in new_sites:
        site_count.setdefault(slot, []).append(cls)
    lines = []
    for name, kind in OVERRIDE_SETS:
        if kind != "slot":
            continue
        for m in sorted(ov.get(name, ())):
            sites = site_count.get(m, [])
            if len(sites) > 1:
                lines.append(f"{name}: '{m}' now occurs at {len(sites)} classes ({', '.join(sorted(sites))})")
    if lines:
        lines.append("-> override sets are keyed by slot NAME, so this applies at every site")
    rep.add("Override slots that now occur at multiple classes", lines)

    # 4. classifier-relevant changes ---------------------------------------
    lines = []
    for key in sorted(set(old_sites) & set(new_sites)):
        o, n = old_sites[key], new_sites[key]
        changes = []
        if o.get("range") != n.get("range"):
            changes.append(f"range {o.get('range')} -> {n.get('range')}")
        if bool(o.get("multivalued")) != bool(n.get("multivalued")):
            changes.append(f"multivalued {bool(o.get('multivalued'))} -> {bool(n.get('multivalued'))}")
        if not changes:
            continue
        cls, slot = key
        before, after = old_verdict.get(key), new_verdict.get(key)
        # A verdict is absent when the range isn't a class (e.g. it widened
        # from a class to a primitive), which is itself worth showing.
        flip = ""
        if before != after:
            flip = f"  [ownership {before or 'non-class range'} -> {after or 'non-class range'}]"
        lines.append(f"{cls}.{slot}: {', '.join(changes)}{flip}")
    if lines:
        lines.append("-> range and multivalued are the classifier's inputs; a flip changes the diagram")
    rep.add("Range / cardinality changes on existing slots", lines)

    # 5. false roots --------------------------------------------------------
    old_owned, new_owned = owned_classes(old, old_v), owned_classes(new, new_v)
    old_roots = {c for c in old_cls if c not in old_owned and c != ENTITY_ROOT}
    new_roots = {c for c in new_cls if c not in new_owned and c != ENTITY_ROOT}
    gained = new_roots - old_roots
    lines = [f"{c}: had inbound ownership before this sync, has none now" for c in sorted(gained)]
    if lines:
        lines.append("-> check whether a slot's range widened or the slot went away")
    rep.add("Classes that BECAME ownership roots", lines)
    rep.add(
        "Pre-existing ownership roots (informational)",
        sorted(new_roots & old_roots) or [],
        needs_review=False,
    )

    # 5b. lost every inbound reference ------------------------------------
    # The Assay case: its one inbound slot classified own-bkwd, so it was never
    # "owned" and section 5 stays silent. Nothing pointed at it afterwards.
    old_ref = owned_classes(old, old_v, any_edge=True)
    new_ref = owned_classes(new, new_v, any_edge=True)
    lines = []
    for c in sorted((new_cls & old_cls) - new_ref):
        if c in old_ref and c != ENTITY_ROOT:
            lines.append(f"{c}: was referenced by a class-ranged slot before this sync, now by none")
    if lines:
        lines.append("-> this is the Assay/associated_artifact failure mode: it renders as a")
        lines.append("   false root with no inbound edge. Usually a range widened to Entity.")
    rep.add("Classes that lost every inbound reference", lines)

    print(rep.render())

    if rep.review_count:
        print(f"{rep.review_count} section(s) need your judgment.")
        print("Ownership verdicts are a human call -- see docs/OWNERSHIP_CLASSIFICATION.md.")
        return 1
    print("No schema changes that touch categorization or ownership.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
