#!/usr/bin/env python3
"""
Transform bdchm.expanded.json (from gen-linkml) into bdchm.processed.json (optimized for our app).

Input: bdchm.expanded.json
- Contains classes, enums, slots, types from gen-linkml
- Inherited slots merged into class.attributes
- Has slot_usage for overrides
- Lacks inherited_from metadata
- Has redundant data

Output: bdchm.processed.json
- Computed inherited_from for all attributes
- Slot instances for slot_usage overrides (ID: {slotName}-{ClassName})
- Streamlined structure (removed redundancy)
- Smaller file size

Usage:
  python transform_schema.py [--input PATH] [--output PATH]
"""

import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, Optional, Set
from urllib import request
from urllib.error import URLError, HTTPError


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


def build_class_hierarchy(classes: Dict[str, Any]) -> Dict[str, Optional[str]]:
    """Build map of class_name -> parent_name."""
    hierarchy = {}
    for class_name, class_def in classes.items():
        # is_a is the LinkML field for inheritance
        parent = class_def.get('is_a')
        hierarchy[class_name] = parent
    return hierarchy


def get_defining_class(
    class_name: str,
    attr_name: str,
    classes: Dict[str, Any],
    hierarchy: Dict[str, Optional[str]]
) -> Optional[str]:
    """
    Walk up class hierarchy to find which ancestor originally defined this attribute.

    Returns:
    - None if attribute is defined on this class (not inherited)
    - ancestor_name if attribute was inherited from ancestor
    """
    # Check parent chain
    current = class_name
    parent = hierarchy.get(current)

    if parent is None:
        # No parent - this is the root, attribute must be defined here
        return None

    # Walk up to find where attribute was first defined
    # If attribute exists on parent, it's inherited from parent (or higher)
    while parent is not None:
        parent_def = classes.get(parent)
        if parent_def is None:
            break

        parent_attrs = parent_def.get('attributes', {})
        if attr_name in parent_attrs:
            # Found in parent, keep walking to find original definer
            current = parent
            parent = hierarchy.get(current)
        else:
            # Not in parent, so current was the original definer
            break

    # If we found it in an ancestor, current is the definer
    if current != class_name:
        return current

    return None


def find_slot_usage(class_name: str, attr_name: str, classes: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Check if this class has a slot_usage override for this attribute.

    Returns:
    - slot_usage dict if override exists
    - None otherwise
    """
    class_def = classes.get(class_name)
    if not class_def:
        return None

    slot_usage = class_def.get('slot_usage', {})
    return slot_usage.get(attr_name)


def transform_classes(
    expanded_classes: Dict[str, Any],
    hierarchy: Dict[str, Optional[str]],
    prefixes: Dict[str, Any],
    global_slots: Dict[str, Any]
) -> Dict[str, Any]:
    """Transform classes to streamlined format with computed inherited_from and inline flag."""
    processed = {}

    for class_name, class_def in expanded_classes.items():
        # Build attributes with inherited_from computed
        attributes = {}
        class_attrs = class_def.get('attributes', {})

        for attr_name, attr_def in class_attrs.items():
            # Compute inherited_from
            inherited_from = get_defining_class(class_name, attr_name, expanded_classes, hierarchy)

            # Check for slot_usage override
            slot_usage_override = find_slot_usage(class_name, attr_name, expanded_classes)

            # Determine slot ID
            if slot_usage_override:
                # Has override - create instance ID
                slot_id = f"{attr_name}-{class_name}"
            else:
                # No override - use base slot name
                slot_id = attr_name

            # Determine if inline (not in global slots) or referenced (in global slots)
            # Note: base slot name (before any override) is what we check
            inline = attr_name not in global_slots

            # Build processed attribute
            processed_attr = {
                'slotId': slot_id,
                'range': attr_def.get('range'),
                'inline': inline
            }

            # Add optional fields
            if attr_def.get('required') is not None:
                processed_attr['required'] = attr_def['required']
            if attr_def.get('multivalued') is not None:
                processed_attr['multivalued'] = attr_def['multivalued']
            if inherited_from is not None:
                processed_attr['inherited_from'] = inherited_from

            attributes[attr_name] = processed_attr

        # Build processed class
        processed_class = {
            'id': class_name,
            'name': class_name,
            'parent': class_def.get('is_a'),
            'abstract': class_def.get('abstract', False),
            'attributes': attributes
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
    expanded_slots: Dict[str, Any],
    expanded_classes: Dict[str, Any],
    prefixes: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Transform slots to include base definitions and override instances.

    Creates slot instances for each slot_usage override with ID {slotName}-{ClassName}.
    """
    processed = {}

    # Add base slot definitions
    for slot_name, slot_def in expanded_slots.items():
        processed_slot = {
            'id': slot_name,
            'name': slot_name,
            'range': slot_def.get('range')
        }

        # Add optional fields
        if slot_def.get('description'):
            processed_slot['description'] = slot_def['description']
        if slot_def.get('required') is not None:
            processed_slot['required'] = slot_def['required']
        if slot_def.get('multivalued') is not None:
            processed_slot['multivalued'] = slot_def['multivalued']

        # Expand slot_uri if present
        if slot_def.get('slot_uri'):
            expanded_url = expand_uri(slot_def['slot_uri'], prefixes, validate=True)
            if expanded_url:
                processed_slot['slot_url'] = expanded_url

        processed[slot_name] = processed_slot

    # Create override instances for slot_usage
    for class_name, class_def in expanded_classes.items():
        slot_usage = class_def.get('slot_usage', {})

        for slot_name, usage_override in slot_usage.items():
            # Get merged attribute definition from class (includes slot_usage overrides)
            class_attrs = class_def.get('attributes', {})
            merged_attr = class_attrs.get(slot_name)

            if not merged_attr:
                print(f"  ⚠ Warning: slot_usage for '{slot_name}' in class '{class_name}' not found in attributes", file=sys.stderr)
                continue

            # Get base slot definition (may be in global slots or only in class attributes)
            base_slot = expanded_slots.get(slot_name)

            # Create override slot instance
            instance_id = f"{slot_name}-{class_name}"
            override_slot = {
                'id': instance_id,
                'name': slot_name,  # Display name (same as base)
                'range': merged_attr.get('range'),
                'overrides': slot_name  # Reference to base slot
            }

            # Copy other fields from merged attribute
            if merged_attr.get('description'):
                override_slot['description'] = merged_attr['description']
            if merged_attr.get('required') is not None:
                override_slot['required'] = merged_attr['required']
            if merged_attr.get('multivalued') is not None:
                override_slot['multivalued'] = merged_attr['multivalued']

            processed[instance_id] = override_slot

            # Also ensure base slot exists in processed slots
            # (may not be in global slots if only defined as class attribute)
            if slot_name not in processed:
                # Need to create base slot definition
                # Walk up hierarchy to find original definition (before this override)
                parent_name = class_def.get('is_a')
                base_attr = None

                while parent_name:
                    parent_class = expanded_classes.get(parent_name)
                    if not parent_class:
                        break

                    parent_attrs = parent_class.get('attributes', {})
                    if slot_name in parent_attrs:
                        # Found it - use parent's definition as base
                        base_attr = parent_attrs[slot_name]
                        # Check if parent also has slot_usage for this slot
                        parent_slot_usage = parent_class.get('slot_usage', {})
                        if slot_name in parent_slot_usage:
                            # Parent also overrides, keep walking up
                            parent_name = parent_class.get('is_a')
                            continue
                        else:
                            # Parent doesn't override - this is the base definition
                            break

                    parent_name = parent_class.get('is_a')

                if base_attr:
                    # Create base slot from found definition
                    base_slot_def = {
                        'id': slot_name,
                        'name': slot_name,
                        'range': base_attr.get('range')
                    }
                    if base_attr.get('description'):
                        base_slot_def['description'] = base_attr['description']
                    if base_attr.get('required') is not None:
                        base_slot_def['required'] = base_attr['required']
                    if base_attr.get('multivalued') is not None:
                        base_slot_def['multivalued'] = base_attr['multivalued']
                    processed[slot_name] = base_slot_def

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
    Transform bdchm.expanded.json to bdchm.processed.json.

    Returns:
        True if successful, False otherwise
    """
    try:
        # Reset trackers
        global invalid_prefixes, validated_prefixes
        invalid_prefixes = set()
        validated_prefixes = {}

        print(f"Loading {expanded_path.name}...")
        with open(expanded_path, 'r') as f:
            expanded = json.load(f)

        expanded_size = expanded_path.stat().st_size
        print(f"  ✓ Loaded ({expanded_size:,} bytes)")

        # Extract prefixes
        prefixes = expanded.get('prefixes', {})
        print(f"  ✓ {len(prefixes)} prefixes loaded")

        # Build class hierarchy
        print("Building class hierarchy...")
        classes = expanded.get('classes', {})
        hierarchy = build_class_hierarchy(classes)
        print(f"  ✓ {len(hierarchy)} classes")

        # Get global slots for inline flag computation
        expanded_slots = expanded.get('slots', {})

        # Transform each section (passing prefixes for URI expansion)
        print("Transforming classes...")
        processed_classes = transform_classes(classes, hierarchy, prefixes, expanded_slots)
        print(f"  ✓ {len(processed_classes)} classes processed")

        print("Transforming slots...")
        processed_slots = transform_slots(expanded_slots, classes, prefixes)
        print(f"  ✓ {len(processed_slots)} slots processed ({len(expanded_slots)} base + {len(processed_slots) - len(expanded_slots)} overrides)")

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
        reduction = ((expanded_size - processed_size) / expanded_size) * 100
        print(f"  ✓ Written ({processed_size:,} bytes)")
        print(f"  ✓ Size reduction: {reduction:.1f}%")

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
        description="Transform bdchm.expanded.json to optimized bdchm.processed.json",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python transform_schema.py
  python transform_schema.py --input public/source_data/HM/bdchm.expanded.json
        """
    )
    parser.add_argument(
        '--input',
        type=Path,
        default=None,
        help='Path to bdchm.expanded.json (default: public/source_data/HM/bdchm.expanded.json)'
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
        input_path = project_root / 'public' / 'source_data' / 'HM' / 'bdchm.expanded.json'

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
