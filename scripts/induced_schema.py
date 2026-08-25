#!/usr/bin/env python3
"""Build the transform's input from bdchm.yaml via LinkML's own SchemaView.

Replaces the gen-linkml subprocess + bdchm.expanded.json artifact. `SchemaView`
resolves imports and merges inherited slots itself, so this produces the same
shape gen-linkml did — verified equal on classes (54), enums (52), types (19),
global slots (7) and every class's attribute set (0/54 differ).

Why this exists at all: `transform_schema.py` used to re-derive per-class slot
definitions by hand, and got them wrong. `SchemaView.induced_class(c)` gives the
fully-merged per-class definition natively, which is what the hand-rolled merge
was approximating. Cases it fixes, all previously wrong or fragile:

    Questionnaire.items          -> QuestionnaireItem
    QuestionnaireResponse.items  -> QuestionnaireResponseItem
    QuestionnaireItem.part_of    -> QuestionnaireItem (not ResearchStudy)
    ObservationSet.focus         -> Entity, multivalued
    Observation.focus            -> Entity, single-valued
    Entity.id / Person.id        -> required correctly derived from `identifier`

See docs/TASKS.md, "move slot storage into the class definitions".
"""

from typing import Any, Dict, Optional

from linkml_runtime.utils.schemaview import SchemaView

# Fields copied off an induced attribute onto its slot entry. Everything the app
# whitelists in dataLoader.ts EXPECTED_SLOT_FIELDS, minus the ones it derives.
_ATTR_FIELDS = (
    'range', 'description', 'required', 'multivalued', 'identifier',
    'inlined', 'inlined_as_list', 'comments', 'examples', 'unit',
    'slot_uri', 'alias', 'pattern', 'minimum_value', 'maximum_value',
    'any_of', 'exactly_one_of', 'none_of', 'all_of', 'structured_pattern',
)

_CLASS_FIELDS = ('description', 'class_uri', 'abstract', 'is_a', 'mixin', 'mixins')


def _plain(value: Any) -> Any:
    """JSON-safe copy of a linkml_runtime value.

    Their objects are JsonObj/extended_str subclasses: they serialize, but as
    opaque wrappers rather than plain dicts/strings, so normalize here.
    """
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        return str(value)
    if isinstance(value, (list, tuple)):
        return [_plain(v) for v in value]
    if hasattr(value, 'items'):
        return {str(k): _plain(v) for k, v in value.items()}
    if hasattr(value, '__dict__'):
        return {str(k): _plain(v) for k, v in vars(value).items()
                if not str(k).startswith('_') and v is not None}
    return str(value)


def _as_dict(obj: Any, fields: tuple) -> Dict[str, Any]:
    out: Dict[str, Any] = {}
    for f in fields:
        v = getattr(obj, f, None)
        if v is None or v == [] or v == {}:
            continue
        out[f] = _plain(v)
    return out


def declares(sv: SchemaView, cls: str, attr: str) -> bool:
    """Does `cls` itself declare `attr`?

    Two ways to declare one: inline under `attributes:`, or by naming a global
    slot under `slots:`. Missing the second reads every global slot (`id`,
    `identity`, ...) as undeclared, which silently breaks inherited_from.
    """
    raw = sv.get_class(cls)
    if raw is None:
        return False
    if raw.attributes and attr in raw.attributes:
        return True
    if raw.slots and attr in raw.slots:
        return True
    return False


def defining_class(sv: SchemaView, cls: str, attr: str) -> Optional[str]:
    """The class that originally defined `attr`, or None if `cls` defines it.

    Walks ancestors and keeps the LAST (topmost) declarer, not the first: with
    `Person is_a Entity` and `id` declared on Entity, the origin is Entity even
    though nearer ancestors also carry the merged attribute.

    NOTE: this is deliberately not `domain_of`. `domain_of` lists *every* class
    declaring the attribute, not the defining ancestor — 54 of 432 sites
    disagree. See docs/TASKS.md.
    """
    origin = None
    for ancestor in sv.class_ancestors(cls):
        if declares(sv, ancestor, attr):
            origin = ancestor
    if origin is None or origin == cls:
        return None
    return origin


def build_expanded(yaml_path) -> Dict[str, Any]:
    """Produce the `expanded`-shaped dict the transform consumes.

    Same top-level keys gen-linkml emitted (`prefixes`, `classes`, `slots`,
    `enums`, `types`), so every downstream stage — dangling-range check, enum
    and type transforms — keeps working untouched.
    """
    sv = SchemaView(str(yaml_path))

    prefixes = {
        str(p): {'prefix_prefix': str(p), 'prefix_reference': str(v.prefix_reference)}
        for p, v in sv.schema.prefixes.items()
    }

    classes: Dict[str, Any] = {}
    for cname in sv.all_classes():
        induced = sv.induced_class(cname)
        raw = sv.get_class(cname)

        attributes: Dict[str, Any] = {}
        for aname, adef in (induced.attributes or {}).items():
            attr = _as_dict(adef, _ATTR_FIELDS)
            # The whole point of the migration: the per-class definition is
            # recorded here, not reconstructed later from a shared slot entry.
            origin = defining_class(sv, cname, aname)
            if origin:
                attr['inherited_from'] = origin
            attributes[str(aname)] = attr

        cdef = _as_dict(raw, _CLASS_FIELDS)
        cdef['attributes'] = attributes
        if raw.slot_usage:
            cdef['slot_usage'] = {str(k): _as_dict(v, _ATTR_FIELDS)
                                  for k, v in raw.slot_usage.items()}
        classes[str(cname)] = cdef

    slots = {str(n): _as_dict(s, _ATTR_FIELDS)
             for n, s in sv.all_slots(attributes=False).items()}

    enums: Dict[str, Any] = {}
    for ename in sv.all_enums():
        enums[str(ename)] = _plain(sv.get_enum(ename))

    types: Dict[str, Any] = {}
    for tname in sv.all_types():
        types[str(tname)] = _plain(sv.get_type(tname))

    return {
        'prefixes': prefixes,
        'classes': classes,
        'slots': slots,
        'enums': enums,
        'types': types,
    }
