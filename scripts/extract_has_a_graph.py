#!/usr/bin/env python3
"""
Extract the has-a (composition) graph from bdchm.yaml for the has-a mockup.

Each class has slots; slots have ranges. When a slot's range is another class,
that's a has-a edge: {owner_class} -- via {slot_name} -- {range_class}.

Output JSON shape:
  {
    "nodes": [
      {"id": "ClassName", "label": "ClassName", "abstract": false, "description": "..."},
      ...
    ],
    "edges": [
      {
        "id": "edge-0",
        "source": "OwnerClass",
        "target": "RangeClass",
        "label": "slot_name",
        "cardinality": "1" | "*" | "0..1",
        "multivalued": true | false,
        "required": true | false,
        "inherited": false
      },
      ...
    ]
  }

Usage:
  uv run python scripts/extract_has_a_graph.py
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import yaml


def load_schema(path: Path) -> dict[str, Any]:
    with path.open() as f:
        return yaml.safe_load(f)


def resolve_slot_cardinality(slot_def: dict[str, Any]) -> tuple[str, bool, bool]:
    """Return (cardinality_label, multivalued, required)."""
    multivalued = bool(slot_def.get("multivalued", False))
    required = bool(slot_def.get("required", False))
    if multivalued:
        label = "+" if required else "*"
    else:
        label = "1" if required else "0..1"
    return label, multivalued, required


def get_all_slots(
    class_name: str,
    classes: dict[str, Any],
    slots_defs: dict[str, Any],
    _seen: set[str] | None = None,
) -> dict[str, tuple[dict[str, Any], str]]:
    """
    Return {slot_name: (slot_def, source_class)} including inherited.
    source_class is the class where the slot was defined (for marking inherited edges).
    """
    if _seen is None:
        _seen = set()
    if class_name in _seen:
        return {}
    _seen.add(class_name)

    cls = classes.get(class_name) or {}
    result: dict[str, tuple[dict[str, Any], str]] = {}

    # Inherited slots from parent
    parent = cls.get("is_a")
    if parent and parent in classes:
        result.update(get_all_slots(parent, classes, slots_defs, _seen))
        # Tag inherited slots: they came from an ancestor, but the "source_class"
        # in the recursive result is already the defining class. Keep it.

    # Global slots listed in `slots:` block
    for sname in cls.get("slots", []) or []:
        sdef = slots_defs.get(sname) or {}
        result[sname] = (sdef, class_name)  # owned by this class (from global list)

    # Own attributes block — these are THIS class's own definitions
    for aname, adef in (cls.get("attributes") or {}).items():
        result[aname] = (adef or {}, class_name)

    return result


def build_graph(schema: dict[str, Any]) -> dict[str, Any]:
    classes = schema.get("classes") or {}
    slots_defs = schema.get("slots") or {}

    nodes: list[dict[str, Any]] = []
    for name, cls in classes.items():
        cls = cls or {}
        desc = (cls.get("description") or "").strip()
        nodes.append(
            {
                "id": name,
                "label": name,
                "abstract": bool(cls.get("abstract", False)),
                "is_a": cls.get("is_a"),
                "description": desc,
            }
        )

    edges: list[dict[str, Any]] = []
    edge_idx = 0
    for cname, cls in classes.items():
        if cls is None:
            continue
        # We track slots on THIS class (its own + inherited). For inherited,
        # we walk the is_a chain to determine whether the slot was defined here
        # or inherited from an ancestor.
        own_slots: set[str] = set()
        own_slots.update((cls.get("attributes") or {}).keys())
        own_slots.update(cls.get("slots", []) or [])

        all_slots = get_all_slots(cname, classes, slots_defs)
        for sname, (sdef, _src) in all_slots.items():
            rng = (sdef or {}).get("range", "string")
            if rng not in classes:
                continue
            inherited = sname not in own_slots
            card, multivalued, required = resolve_slot_cardinality(sdef)
            edges.append(
                {
                    "id": f"edge-{edge_idx}",
                    "source": cname,
                    "target": rng,
                    "label": sname,
                    "cardinality": card,
                    "multivalued": multivalued,
                    "required": required,
                    "inherited": inherited,
                }
            )
            edge_idx += 1

    return {"nodes": nodes, "edges": edges}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        default="public/source_data/HM/bdchm.yaml",
        help="Path to bdchm.yaml",
    )
    parser.add_argument(
        "--output",
        default="public/has-a-graph.json",
        help="Output JSON path",
    )
    args = parser.parse_args()

    schema_path = Path(args.input)
    out_path = Path(args.output)

    if not schema_path.exists():
        print(f"error: schema not found at {schema_path}", file=sys.stderr)
        return 1

    schema = load_schema(schema_path)
    graph = build_graph(schema)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w") as f:
        json.dump(graph, f, indent=2)

    print(f"wrote {out_path}: {len(graph['nodes'])} nodes, {len(graph['edges'])} edges")
    return 0


if __name__ == "__main__":
    sys.exit(main())
