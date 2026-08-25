#!/usr/bin/env python3
"""
Transform bdchm.yaml into bdchm.processed.json (optimized for our app).

Input: bdchm.yaml, read through LinkML's own SchemaView (see induced_schema.py).
- SchemaView resolves imports and merges inherited slots itself, so the
  gen-linkml step and the bdchm.expanded.json artifact are both gone.
- `induced_class(c).attributes[a]` IS the per-class slot definition. The
  transform no longer reconstructs it, which is what used to go wrong.

Output: bdchm.processed.json
- Computed inherited_from for all attributes
- Slot instances for slot_usage overrides (ID: {slotName}-{ClassName})
- Streamlined structure (removed redundancy)
- Smaller file size

Usage:
  python transform_schema.py [--input PATH] [--output PATH]

  --input is bdchm.yaml (was bdchm.expanded.json).
"""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, Optional, Set
from urllib import request
from urllib.error import URLError, HTTPError

from induced_schema import build_expanded


# Delimiter for override slot IDs: "{slotName}-{ClassName}" e.g., "category-SdohObservation"
SLOT_OVERRIDE_DELIMITER = '-'

# Delimiter for qualified slot IDs: "{slotName}-{ClassName}".
#
# A FLAT slot index cannot hold two different definitions under one bare name,
# so sites whose definitions differ get qualified ids. Note this is now a
# property of the *index*, not of the data: the real per-class definition lives
# on the class, and this index is derived from it. See docs/TASKS.md.
SLOT_OVERRIDE_DELIMITER = '-'

# Fields whose disagreement means two sites are not the same slot, so they
# cannot share one entry in the flat index.
#
# Deliberately short. An earlier (Dec 2025) attempt compared nearly every field,
# including `description` and `owner`, qualified ~109 of 260 slots, and was
# abandoned. Cosmetic disagreement is not a conflict.
LOAD_BEARING_SLOT_FIELDS = ('range', 'multivalued', 'required')


def _load_bearing_signature(attr_def: Dict[str, Any]) -> tuple:
    """The part of a slot definition that must match for two sites to share an id.

    `None` and `False` normalize together: LinkML omits `multivalued` rather than
    writing `false`, so a missing key and an explicit false are the same
    statement and must not read as a conflict.
    """
    return tuple(
        (field, False if attr_def.get(field) in (None, False) else attr_def.get(field))
        for field in LOAD_BEARING_SLOT_FIELDS
    )


def resolve_slot_ids(expanded_classes: Dict[str, Any]) -> Dict[tuple, str]:
    """Decide the flat-index id for every (class, attribute) site.

    One rule, no exceptions: **if two sites disagree on a load-bearing field
    they are not the same slot**, so every site of that name is qualified and
    none keeps the bare id. A name whose sites all agree keeps its bare id.

    This is now purely an indexing concern. The definitions themselves come from
    `induced_class` and are already correct per class; nothing here decides what
    a slot MEANS, only what to call it in the derived flat index.
    """
    sites: Dict[str, Dict[str, Any]] = {}
    for class_name, class_def in expanded_classes.items():
        for attr_name, attr_def in (class_def.get('attributes') or {}).items():
            sites.setdefault(attr_name, {})[class_name] = attr_def

    slot_ids: Dict[tuple, str] = {}
    for attr_name, per_class in sites.items():
        signatures = {_load_bearing_signature(d) for d in per_class.values()}
        divergent = len(signatures) > 1
        for class_name in per_class:
            slot_ids[(class_name, attr_name)] = (
                f"{attr_name}{SLOT_OVERRIDE_DELIMITER}{class_name}" if divergent else attr_name
            )
    return slot_ids


def iter_range_sites(expanded: Dict[str, Any]):
    """Yield (label, def_dict) for every place a range can appear."""
    for cname, cdef in expanded.get('classes', {}).items():
        for section in ('attributes', 'slot_usage'):
            for aname, adef in (cdef.get(section) or {}).items():
                if isinstance(adef, dict):
                    yield f"{cname}.{aname}" + (" (slot_usage)" if section == 'slot_usage' else ""), adef
    for sname, sdef in expanded.get('slots', {}).items():
        if isinstance(sdef, dict):
            yield f"global slot {sname}", sdef


def find_dangling_ranges(expanded: Dict[str, Any]) -> list:
    """Ranges that resolve to no known class/enum/type — they would crash the app's graph builder.

    (Has happened: upstream deleted BaseObservationTypeEnum but left range
    references to it — RTIInternational/NHLBI-BDC-DMC-HM#240.)
    """
    known = set(expanded.get('classes', {})) | set(expanded.get('enums', {})) | set(expanded.get('types', {}))
    return [f"{label} → {d['range']}"
            for label, d in iter_range_sites(expanded)
            if d.get('range') and d['range'] not in known]

# Track invalid prefixes encountered during URI expansion
invalid_prefixes: Set[str] = set()
# Track which prefixes have been validated
validated_prefixes: Dict[str, bool] = {}  # prefix -> is_valid


def validate_url(url: str, timeout: int = 3) -> bool:
    """
    Test if a URL is accessible via HTTP HEAD request.

    Args:
        url: URL to validate
        timeout: Request timeout in seconds

    Returns:
        True if URL is accessible (status 200-399), False otherwise
    """
    try:
        req = request.Request(url, method='HEAD')
        req.add_header('User-Agent', 'LinkML-Schema-Validator/1.0')
        with request.urlopen(req, timeout=timeout) as response:
            return 200 <= response.status < 400
    except (URLError, HTTPError, TimeoutError, Exception):
        return False


def expand_uri(uri: str, prefixes: Dict[str, Any], validate: bool = False) -> Optional[str]:
    """
    Expand a prefixed URI (e.g., 'schema:Text') to full URL using prefixes.

    Args:
        uri: Prefixed URI string (e.g., 'schema:Text', 'DUO:0000042')
        prefixes: Prefix mapping from schema
        validate: If True, validate the URL resolves (first time for each prefix)

    Returns:
        Full URL if prefix is valid, None otherwise

    Side effects:
        Adds invalid prefixes to global invalid_prefixes set
        Caches validation results in global validated_prefixes dict
    """
    if not uri or ':' not in uri:
        return None

    try:
        prefix, code = uri.split(':', 1)

        if prefix not in prefixes:
            invalid_prefixes.add(prefix)
            return None

        # Get prefix_reference from the prefix definition
        prefix_def = prefixes.get(prefix)
        if not prefix_def or 'prefix_reference' not in prefix_def:
            invalid_prefixes.add(prefix)
            return None

        base_url = prefix_def['prefix_reference']
        expanded_url = base_url + code

        # Validate URL if requested and not already validated
        if validate and prefix not in validated_prefixes:
            is_valid = validate_url(expanded_url)
            validated_prefixes[prefix] = is_valid
            if not is_valid:
                print(f"  ⚠ Prefix '{prefix}' URL validation failed: {expanded_url}", file=sys.stderr)

        return expanded_url

    except Exception:
        return None


def find_slot_usage(class_name: str, attr_name: str, classes: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """The class's slot_usage entry for this attribute, if it has one."""
    class_def = classes.get(class_name)
    if not class_def:
        return None
    return (class_def.get('slot_usage') or {}).get(attr_name)


def transform_classes(
    expanded_classes: Dict[str, Any],
    prefixes: Dict[str, Any],
    global_slots: Dict[str, Any],
    slot_ids: Dict[tuple, str]
) -> Dict[str, Any]:
    """Transform classes to streamlined format with slot references (no duplication)."""
    processed = {}

    for class_name, class_def in expanded_classes.items():
        # Build slots array with references only (no duplicated slot data)
        slots = []
        class_attrs = class_def.get('attributes', {})

        for attr_name, attr_def in class_attrs.items():
            # `inherited_from` is computed once, in induced_schema.defining_class,
            # and travels on the attribute definition. It used to be re-derived
            # here by walking gen-linkml's already-merged attributes, which finds
            # the topmost class that HAS the attribute rather than the one that
            # DECLARED it.
            inherited_from = attr_def.get('inherited_from')

            # Check for slot_usage override
            slot_usage_override = find_slot_usage(class_name, attr_name, expanded_classes)

            # Determine slot ID. A slot_usage override always gets its own
            # instance id; otherwise use the shared decision from
            # resolve_slot_ids, which qualifies sites whose load-bearing fields
            # diverge from the majority. Both branches must agree with
            # transform_slots or the class would reference a slot id that has no
            # entry in `slots`.
            if slot_usage_override:
                # Has override - use instance ID
                slot_id = f"{attr_name}{SLOT_OVERRIDE_DELIMITER}{class_name}"
            else:
                slot_id = slot_ids.get((class_name, attr_name), attr_name)

            # Build slot reference (minimal - just id and inherited_from if present)
            slot_ref: Dict[str, Any] = {'id': slot_id}
            if inherited_from is not None:
                slot_ref['inherited_from'] = inherited_from

            slots.append(slot_ref)

        # Build processed class
        processed_class = {
            'id': class_name,
            'name': class_name,
            'parent': class_def.get('is_a'),
            'abstract': class_def.get('abstract', False),
            'slots': slots  # Array of slot references
        }

        # Add optional fields
        if class_def.get('description'):
            processed_class['description'] = class_def['description']

        # Expand class_uri if present
        if class_def.get('class_uri'):
            expanded_url = expand_uri(class_def['class_uri'], prefixes, validate=True)
            if expanded_url:
                processed_class['class_url'] = expanded_url

        processed[class_name] = processed_class

    return processed


def transform_slots(
    schema_slots: Dict[str, Any],
    schema_classes: Dict[str, Any],
    prefixes: Dict[str, Any],
    slot_ids: Dict[tuple, str]
) -> Dict[str, Any]:
    """Build the flat slot index.

    DERIVED, NOT THE SOURCE OF TRUTH. Each class carries its own slot
    definitions (from `induced_class`); this flattens them into the one-entry-
    per-distinct-definition index that Kitchen Sink, `SlotCollection`,
    `getClassesUsingSlot` and `elementLookup` are keyed on. See the `_comment`
    written into this section in transform_schema().
    """
    processed: Dict[str, Any] = {}

    # Pass 1: one entry per distinct definition, plus a slot_usage instance for
    # every class that overrides. `name` stays BARE — it is what the user reads,
    # while `id` is what lookups join on.
    for class_name, class_def in schema_classes.items():
        for attr_name, attr_def in (class_def.get('attributes') or {}).items():
            entry = {k: v for k, v in attr_def.items() if k != 'inherited_from'}

            if find_slot_usage(class_name, attr_name, schema_classes):
                instance_id = f"{attr_name}{SLOT_OVERRIDE_DELIMITER}{class_name}"
                processed[instance_id] = {
                    'id': instance_id,
                    'name': attr_name,
                    'overrides': attr_name,
                    **entry,
                }
                continue

            slot_id = slot_ids.get((class_name, attr_name), attr_name)
            if slot_id in processed:
                existing = processed[slot_id]
                # Two sites share an id, which resolve_slot_ids only allows when
                # the load-bearing fields agree. If they don't, they are out of
                # sync — a real bug, not a cosmetic diff.
                if _load_bearing_signature(existing) != _load_bearing_signature(entry):
                    print(
                        f"  ⚠ Warning: slot '{slot_id}' has conflicting load-bearing "
                        f"definition in class '{class_name}' "
                        f"({_load_bearing_signature(entry)} vs {_load_bearing_signature(existing)})",
                        file=sys.stderr,
                    )
                continue

            processed[slot_id] = {'id': slot_id, 'name': attr_name, **entry}

    # Pass 2: identity metadata from the schema's `slots:` section.
    #
    # Runs AFTER every entry exists, including slot_usage instances. It used to
    # run in between, so a slot declared ONLY as an override — `observations`,
    # `value` — was invisible to it and silently lost both `global` and
    # `slot_url`, as did every override instance of a global slot. That also
    # produced a bogus "global slot is not used by any class" warning.
    for slot_name, global_slot_def in schema_slots.items():
        entries = [d for d in processed.values() if d.get('name') == slot_name]
        if not entries:
            print(f"  ⚠ Warning: global slot '{slot_name}' is not used by any class", file=sys.stderr)
            continue

        expanded_url = None
        if global_slot_def.get('slot_uri'):
            expanded_url = expand_uri(global_slot_def['slot_uri'], prefixes, validate=True)

        for entry in entries:
            # Identity metadata belongs to the slot NAME, so every site gets it.
            entry['global'] = True
            if expanded_url:
                entry['slot_url'] = expanded_url

    return processed


def transform_enums(expanded_enums: Dict[str, Any], prefixes: Dict[str, Any]) -> Dict[str, Any]:
    """Transform enums - keep structure and expand URIs in permissible_values and reachable_from."""
    processed = {}

    for enum_name, enum_def in expanded_enums.items():
        processed_enum = {
            'id': enum_name,
            'name': enum_name
        }

        # Add optional fields
        if enum_def.get('description'):
            processed_enum['description'] = enum_def['description']
        if enum_def.get('comments'):
            processed_enum['comments'] = enum_def['comments']
        if enum_def.get('see_also'):
            processed_enum['see_also'] = enum_def['see_also']

        # Enum inheritance
        if enum_def.get('is_a'):
            processed_enum['parent'] = enum_def['is_a']
        if enum_def.get('inherits'):
            processed_enum['inherits'] = enum_def['inherits']
        if enum_def.get('include'):
            processed_enum['include'] = enum_def['include']

        # Transform permissible_values to expand meaning URIs
        if enum_def.get('permissible_values'):
            processed_pv = {}
            for pv_key, pv_value in enum_def['permissible_values'].items():
                processed_pv_value = dict(pv_value)  # Copy value

                # Expand meaning URI if present
                if pv_value.get('meaning'):
                    expanded_url = expand_uri(pv_value['meaning'], prefixes, validate=True)
                    if expanded_url:
                        processed_pv_value['meaning_url'] = expanded_url

                processed_pv[pv_key] = processed_pv_value

            processed_enum['permissible_values'] = processed_pv

        # Transform reachable_from - it's an object with source_nodes and relationship_types
        if enum_def.get('reachable_from'):
            reachable = dict(enum_def['reachable_from'])
            processed_reachable = {}

            # Copy simple fields
            if reachable.get('source_ontology'):
                processed_reachable['source_ontology'] = reachable['source_ontology']
            if reachable.get('include_self') is not None:
                processed_reachable['include_self'] = reachable['include_self']

            # Expand source_nodes URIs
            if reachable.get('source_nodes'):
                processed_reachable['source_nodes'] = reachable['source_nodes']
                expanded_nodes = []
                for node_uri in reachable['source_nodes']:
                    expanded_url = expand_uri(node_uri, prefixes, validate=True)
                    if expanded_url:
                        expanded_nodes.append(expanded_url)
                if expanded_nodes:
                    processed_reachable['source_nodes_urls'] = expanded_nodes

            # Expand relationship_types URIs
            if reachable.get('relationship_types'):
                processed_reachable['relationship_types'] = reachable['relationship_types']
                expanded_rels = []
                for rel_uri in reachable['relationship_types']:
                    expanded_url = expand_uri(rel_uri, prefixes, validate=True)
                    if expanded_url:
                        expanded_rels.append(expanded_url)
                if expanded_rels:
                    processed_reachable['relationship_types_urls'] = expanded_rels

            processed_enum['reachable_from'] = processed_reachable

        processed[enum_name] = processed_enum

    return processed


def collect_used_types(classes: Dict[str, Any], slots: Dict[str, Any], expanded_types: Dict[str, Any]) -> Set[str]:
    """
    Collect all type names that are actually used as ranges in classes or slots.

    Returns:
        Set of type names that are referenced
    """
    used = set()

    # Collect from class attributes
    for class_def in classes.values():
        attributes = class_def.get('attributes', {})
        for attr_def in attributes.values():
            range_val = attr_def.get('range')
            if range_val and range_val in expanded_types:
                used.add(range_val)

    # Collect from global slots
    for slot_def in slots.values():
        range_val = slot_def.get('range')
        if range_val and range_val in expanded_types:
            used.add(range_val)

    return used


def transform_types(expanded_types: Dict[str, Any], prefixes: Dict[str, Any], used_types: Set[str]) -> Dict[str, Any]:
    """Transform types - keep minimal structure and expand URIs. Only include types that are actually used."""
    processed = {}

    for type_name, type_def in expanded_types.items():
        # Skip types that are never used as ranges
        if type_name not in used_types:
            continue

        processed_type = {
            'id': type_name,
            'name': type_name
        }

        # Add optional fields
        if type_def.get('description'):
            processed_type['description'] = type_def['description']
        if type_def.get('base'):
            processed_type['base'] = type_def['base']

        # Expand type URI if present
        if type_def.get('uri'):
            processed_type['uri'] = type_def['uri']  # Keep original
            expanded_url = expand_uri(type_def['uri'], prefixes, validate=True)
            if expanded_url:
                processed_type['uri_url'] = expanded_url

        # Expand exact_mappings if present
        if type_def.get('exact_mappings'):
            processed_type['exact_mappings'] = type_def['exact_mappings']  # Keep originals
            expanded_mappings = []
            for mapping in type_def['exact_mappings']:
                expanded_url = expand_uri(mapping, prefixes, validate=True)
                if expanded_url:
                    expanded_mappings.append(expanded_url)
            if expanded_mappings:
                processed_type['exact_mappings_urls'] = expanded_mappings

        processed[type_name] = processed_type

    return processed


def transform_schema(expanded_path: Path, output_path: Path) -> bool:
    """
    Transform bdchm.yaml to bdchm.processed.json.

    Returns:
        True if successful, False otherwise
    """
    try:
        # Reset trackers
        global invalid_prefixes, validated_prefixes
        invalid_prefixes = set()
        validated_prefixes = {}

        print(f"Loading {expanded_path.name} via SchemaView...")
        expanded = build_expanded(expanded_path)
        print(f"  ✓ Loaded ({expanded_path.stat().st_size:,} bytes of YAML)")

        # Refuse to ship a schema with dangling ranges — the app's graph
        # builder throws on them at load time, so fail here (in the sync run)
        # with a readable message instead.
        dangling = find_dangling_ranges(expanded)
        if dangling:
            print(f"  ✗ {len(dangling)} dangling range(s) — needs an upstream fix:", file=sys.stderr)
            for entry in dangling:
                print(f"      {entry}", file=sys.stderr)
            return False

        # Extract prefixes
        prefixes = expanded.get('prefixes', {})
        print(f"  ✓ {len(prefixes)} prefixes loaded")

        classes = expanded.get('classes', {})
        print(f"  ✓ {len(classes)} classes")

        # Get global slots for inline flag computation
        expanded_slots = expanded.get('slots', {})

        # Decide slot ids ONCE, so transform_classes and transform_slots cannot
        # disagree about which sites are qualified.
        slot_ids = resolve_slot_ids(classes)
        qualified = sorted({sid for sid, v in slot_ids.items() if v != sid[1]})
        if qualified:
            print(f"  ✓ {len(qualified)} attribute sites qualified (divergent slot definitions)")

        # Transform each section (passing prefixes for URI expansion)
        print("Transforming classes...")
        processed_classes = transform_classes(classes, prefixes, expanded_slots, slot_ids)
        print(f"  ✓ {len(processed_classes)} classes processed")

        print("Transforming slots...")
        processed_slots = transform_slots(expanded_slots, classes, prefixes, slot_ids)
        print(f"  ✓ {len(processed_slots)} slots indexed")

        # JSON has no comments, so leave the note as a field. This section is
        # derived; the class definitions are the source of truth.
        processed_slots = {
            '_comment': (
                'DERIVED INDEX — not the source of truth. Every slot definition '
                'lives on its class (classes.*.attributes), which is where '
                'SchemaView.induced_class puts it. This flat section exists only '
                'because Kitchen Sink, SlotCollection, getClassesUsingSlot and '
                'elementLookup are still keyed on slot ids. Stop generating it '
                'once those are refactored to read induced slots off the class.'
            ),
            **processed_slots,
        }

        print("Transforming enums...")
        expanded_enums = expanded.get('enums', {})
        processed_enums = transform_enums(expanded_enums, prefixes)
        print(f"  ✓ {len(processed_enums)} enums processed")

        print("Collecting used types...")
        expanded_types = expanded.get('types', {})
        used_types = collect_used_types(classes, expanded_slots, expanded_types)
        print(f"  ✓ {len(used_types)} of {len(expanded_types)} types are used")

        print("Transforming types...")
        processed_types = transform_types(expanded_types, prefixes, used_types)
        print(f"  ✓ {len(processed_types)} types processed (filtered from {len(expanded_types)})")

        # Build processed schema
        processed = {
            'prefixes': prefixes,  # Include prefixes in output
            'classes': processed_classes,
            'slots': processed_slots,
            'enums': processed_enums,
            'types': processed_types
        }

        # Copy variables as-is if present
        if 'variables' in expanded:
            processed['variables'] = expanded['variables']

        # Write output
        print(f"Writing {output_path.name}...")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(processed, f, indent=2)

        processed_size = output_path.stat().st_size
        print(f"  ✓ Written ({processed_size:,} bytes)")

        # Report prefix validation results
        print(f"\nPrefix URL Validation Results:")
        if validated_prefixes:
            valid_prefixes = [p for p, v in validated_prefixes.items() if v]
            failed_prefixes = [p for p, v in validated_prefixes.items() if not v]

            print(f"  ✓ {len(valid_prefixes)} prefix(es) validated successfully")
            if failed_prefixes:
                print(f"  ✗ {len(failed_prefixes)} prefix(es) failed validation:")
                for prefix in sorted(failed_prefixes):
                    prefix_def = prefixes.get(prefix, {})
                    base_url = prefix_def.get('prefix_reference', 'unknown')
                    print(f"    - {prefix}: {base_url}")
        else:
            print("  (No URIs found to validate)")

        # Report invalid prefixes encountered
        if invalid_prefixes:
            print(f"\n⚠ Warning: {len(invalid_prefixes)} invalid prefix(es) encountered during URI expansion:")
            for prefix in sorted(invalid_prefixes):
                print(f"  - {prefix}")
            print("These prefixes are not defined in the schema prefixes section.")

        return True

    except FileNotFoundError as e:
        print(f"  ✗ File not found: {e}", file=sys.stderr)
        return False
    except json.JSONDecodeError as e:
        print(f"  ✗ JSON decode error: {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"  ✗ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return False


def main():
    """Transform expanded schema to processed format."""
    parser = argparse.ArgumentParser(
        description="Transform bdchm.yaml to optimized bdchm.processed.json",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python transform_schema.py
  python transform_schema.py --input public/source_data/HM/bdchm.yaml
        """
    )
    parser.add_argument(
        '--input',
        type=Path,
        default=None,
        help='Path to bdchm.yaml (default: public/source_data/HM/bdchm.yaml)'
    )
    parser.add_argument(
        '--output',
        type=Path,
        default=None,
        help='Path to output bdchm.processed.json (default: public/source_data/HM/bdchm.processed.json)'
    )
    args = parser.parse_args()

    # Determine paths
    project_root = Path(__file__).parent.parent

    if args.input:
        input_path = args.input
    else:
        input_path = project_root / 'public' / 'source_data' / 'HM' / 'bdchm.yaml'

    if args.output:
        output_path = args.output
    else:
        output_path = project_root / 'public' / 'source_data' / 'HM' / 'bdchm.processed.json'

    # Check input exists
    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}", file=sys.stderr)
        print("Run 'python download_source_data.py' first to generate it.", file=sys.stderr)
        return 1

    # Transform
    print("="*60)
    if transform_schema(input_path, output_path):
        print("="*60)
        return 0
    else:
        print("="*60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
