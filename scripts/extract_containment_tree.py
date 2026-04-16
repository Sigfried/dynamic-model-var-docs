#!/usr/bin/env python3
"""
Extract containment relationships from bdchm.yaml and produce an indented
tree (as JSON) suitable for rendering in an interactive HTML mockup.

Containment heuristic:
  - Multi-valued slots pointing to classes → forward containment (already correct)
  - Single-valued slots pointing to value objects → forward containment
  - Single-valued slots pointing to other entities → FK-style back-reference → FLIP
    (the target "contains" the source)
  - Override list for edges that shouldn't flip despite being single→entity

Cycles (self-references, recursive hierarchies) are detected and marked
rather than infinitely expanded.

Output JSON: a list of root nodes, each with recursive children:
  [
    {
      "id": "ResearchStudyCollection",
      "label": "ResearchStudyCollection",
      "description": "...",
      "abstract": false,
      "children": [
        {
          "id": "ResearchStudy",
          "slot": "entries",          // slot that creates this containment
          "cardinality": "*",
          "flipped": false,           // true if we inverted the FK direction
          "inherited": false,
          "children": [...]
        }
      ]
    }
  ]

Usage:
  uv run python scripts/extract_containment_tree.py
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

import yaml


# Value-object classes: slots pointing to these are forward containment
# even when single-valued
VALUE_OBJECTS = {
    "Quantity", "TimePoint", "TimePeriod", "BodySite", "CauseOfDeath",
    "QuestionnaireResponseValue",
    "QuestionnaireResponseValueDecimal", "QuestionnaireResponseValueBoolean",
    "QuestionnaireResponseValueInteger", "QuestionnaireResponseValueTimePoint",
    "QuestionnaireResponseValueString",
    "Substance", "BiologicProduct",
}

# Classes whose subclasses should NOT be expanded inline (too many to be useful)
SKIP_SUBCLASS_EXPANSION = {
    "Entity",  # 34 direct subclasses — would duplicate entire model
}

# Classes to exclude as has-a targets (abstract refs that don't point to
# a specific class — they'd appear everywhere and add noise)
EXCLUDE_HAS_A_TARGETS = {
    "Entity",  # focus → Entity, associated_evidence → Entity are too abstract
}

# Single-valued slots that should NOT be flipped despite pointing to entities.
# These are associational references, not containment back-references.
NO_FLIP_SLOTS = {
    "performed_by",       # who did it — reference, not containment
    "originating_site",   # site — reference
    "associated_assay",   # method metadata
    "transport_origin",   # reference to org
    "transport_destination",
    "focus",              # abstract ref to Entity — too generic
    "related_imaging_study",  # cross-reference
    "document",           # questionable; keep unflipped for now
    "associated_person",  # Participant references Person — forward containment
    "creation_activity",  # Specimen has-a creation activity — forward containment
    "contained_in",       # Specimen contained-in SpecimenContainer — forward
    "dimensional_measures",  # Specimen has dimensional measures — forward
    "related_questionnaire_item",  # SdohObservation references a QItem — cross-ref, not containment
}


def load_schema(path: Path) -> dict[str, Any]:
    with path.open() as f:
        return yaml.safe_load(f)


def get_all_slots(
    class_name: str,
    classes: dict[str, Any],
    slots_defs: dict[str, Any],
    _seen: set[str] | None = None,
) -> dict[str, tuple[dict[str, Any], bool]]:
    """Return {slot_name: (slot_def, inherited)}."""
    if _seen is None:
        _seen = set()
    if class_name in _seen:
        return {}
    _seen.add(class_name)

    cls = classes.get(class_name) or {}
    result: dict[str, tuple[dict[str, Any], bool]] = {}

    parent = cls.get("is_a")
    if parent and parent in classes:
        for sname, (sdef, _) in get_all_slots(parent, classes, slots_defs, _seen).items():
            result[sname] = (sdef, True)  # inherited

    for sname in cls.get("slots", []) or []:
        sdef = slots_defs.get(sname) or {}
        result[sname] = (sdef, False)

    for aname, adef in (cls.get("attributes") or {}).items():
        result[aname] = (adef or {}, False)

    return result


def build_containment_edges(schema: dict[str, Any]) -> list[dict[str, Any]]:
    """
    Return list of containment edges:
      {parent, child, slot, cardinality, flipped, inherited}
    """
    classes = schema.get("classes") or {}
    slots_defs = schema.get("slots") or {}
    edges = []

    for cname in classes:
        cls = classes.get(cname)
        if cls is None:
            continue
        all_slots = get_all_slots(cname, classes, slots_defs)
        for sname, (sdef, inherited) in all_slots.items():
            rng = (sdef or {}).get("range", "string")
            if rng not in classes:
                continue
            if rng in EXCLUDE_HAS_A_TARGETS:
                continue
            multivalued = bool((sdef or {}).get("multivalued", False))
            required = bool((sdef or {}).get("required", False))
            if multivalued:
                card = "+" if required else "*"
            else:
                card = "1" if required else "0..1"

            is_value_obj = rng in VALUE_OBJECTS
            should_flip = (
                not multivalued
                and not is_value_obj
                and sname not in NO_FLIP_SLOTS
            )

            if should_flip:
                parent, child = rng, cname
            else:
                parent, child = cname, rng

            edges.append({
                "parent": parent,
                "child": child,
                "slot": sname,
                "cardinality": card,
                "flipped": should_flip,
                "inherited": inherited,
            })

    return edges


def build_tree(
    schema: dict[str, Any],
    edges: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Build the containment tree(s).

    - Nodes can appear under multiple parents (polyhierarchy).
    - Inherited has-a edges are NOT duplicated onto subclasses. Instead,
      subclasses appear as a separate kind of child ("kind": "subclass")
      under their parent class, and only show their OWN (non-inherited)
      has-a edges.
    - This eliminates massive duplication (e.g., every Observation subclass
      repeating focus, performed_by, value_quantity, etc.).
    """
    classes = schema.get("classes") or {}

    # --- Build is-a index: parent_class → [direct subclasses] ---
    subclasses_of: dict[str, list[str]] = defaultdict(list)
    for cname, cls in classes.items():
        if cls and cls.get("is_a") and cls["is_a"] in classes:
            subclasses_of[cls["is_a"]].append(cname)

    # --- Build has-a index, excluding inherited edges ---
    # Only non-inherited edges: these are the slots the class defines itself
    children_of: dict[str, list[dict[str, Any]]] = defaultdict(list)
    has_parent: set[str] = set()

    seen = set()
    for e in edges:
        if e["inherited"]:
            continue  # skip — subclasses will be shown via is-a nesting
        key = (e["parent"], e["child"], e["slot"])
        if key in seen:
            continue
        seen.add(key)
        children_of[e["parent"]].append(e)
        has_parent.add(e["child"])

    # Also mark classes that are subclasses as "having a parent" for root detection
    for parent, subs in subclasses_of.items():
        for s in subs:
            has_parent.add(s)

    # Classes that participate in at least one edge OR have subclasses
    has_any_edge = (
        has_parent
        | set(children_of.keys())
        | set(subclasses_of.keys())
    )

    # Roots: classes with no incoming containment, but only if they
    # participate in at least one edge. Exclude classes in
    # SKIP_SUBCLASS_EXPANSION that have no has-a edges of their own
    # (they'd render as empty stubs).
    roots = [
        n for n in classes
        if (
            n not in has_parent
            and n in has_any_edge
            and not (n in SKIP_SUBCLASS_EXPANSION and n not in children_of)
        )
    ]

    def make_node(
        class_name: str,
        edge_info: dict[str, Any] | None,
        ancestors: frozenset[str],
        kind: str = "has-a",  # "has-a" or "subclass"
    ) -> dict[str, Any]:
        cls = classes.get(class_name) or {}
        node: dict[str, Any] = {
            "id": class_name,
            "label": class_name,
            "description": (cls.get("description") or "").strip(),
            "abstract": bool(cls.get("abstract", False)),
            "kind": kind,
        }
        if edge_info:
            node["slot"] = edge_info["slot"]
            node["cardinality"] = edge_info["cardinality"]
            node["flipped"] = edge_info["flipped"]

        # Check for cycle
        if class_name in ancestors:
            node["cycle"] = True
            node["children"] = []
            return node

        new_ancestors = ancestors | {class_name}

        # Has-a children (own slots only, not inherited)
        has_a_kids = children_of.get(class_name, [])
        has_a_sorted = sorted(has_a_kids, key=lambda e: e["slot"])

        children: list[dict[str, Any]] = [
            make_node(e["child"], e, new_ancestors, "has-a")
            for e in has_a_sorted
        ]

        # Subclass children (via is-a), unless this class has too many
        if class_name not in SKIP_SUBCLASS_EXPANSION:
            subs = subclasses_of.get(class_name, [])
            for sub_name in sorted(subs):
                children.append(
                    make_node(sub_name, None, new_ancestors, "subclass")
                )

        node["children"] = children
        return node

    tree = [
        make_node(r, None, frozenset())
        for r in sorted(roots)
    ]
    return tree


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input", default="public/source_data/HM/bdchm.yaml",
    )
    parser.add_argument(
        "--output", default="public/containment-tree.json",
    )
    args = parser.parse_args()

    schema_path = Path(args.input)
    if not schema_path.exists():
        print(f"error: {schema_path} not found", file=sys.stderr)
        return 1

    schema = load_schema(schema_path)
    edges = build_containment_edges(schema)
    tree = build_tree(schema, edges)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w") as f:
        json.dump(tree, f, indent=2)

    # Stats
    unique_edges = set()
    for e in edges:
        unique_edges.add((e["parent"], e["child"], e["slot"]))
    root_names = [n["id"] for n in tree]
    print(f"wrote {out_path}: {len(tree)} roots, {len(unique_edges)} unique containment edges")
    print(f"roots: {', '.join(root_names)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
