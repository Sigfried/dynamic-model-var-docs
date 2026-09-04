/**
 * OwnershipGraphView — the layered ownership DAG (docs/EXPLORE_VIZ.md).
 *
 * Bindings over graph-core: HTML entity nodes (title + attribute rows) are
 * absolutely positioned over an SVG edge layer. Layout and edge routing are
 * both ELK's (layered, orthogonal). An edge joins an ATTRIBUTE on one class to
 * another class AS A WHOLE, so its two ends are not alike:
 *  - the ATTRIBUTE END attaches to a fixed-position ELK port at its slot's own
 *    row, and is the only end that names a slot;
 *  - the ENTITY END attaches to a header-level port on the target class, so
 *    edges "point at the entity name". ONE exception since 2026-09-02: a
 *    slot_usage-narrowed edge arriving at a merged box lands on the CHILD
 *    HEADER row matching its range, because pointing at the box header would
 *    say only "an Observation" — the one thing the narrowing refines. See
 *    childHeaderTarget.
 * Routing therefore sees the real attach points.
 *
 * Channel rules:
 *  - ownership: solid, in P2's Blues ramp (own-fwd darker than own-bkwd),
 *    drawn owner → member (normalized). Flipped
 *    storage direction is marked at the member end: the arrowhead points
 *    BACK toward the owner (the member stores the FK).
 *  - association: dashed, the lightest step of the same ramp, drawn in FK
 *    direction. The dashes carry the distinction, not faintness.
 *  - is-a: never an arrow in the ownership plane. Rendered as ADJACENCY —
 *    siblings sharing a parent collapse into one box titled by that parent,
 *    parent rows in the default color and bolder, each sibling's own rows in
 *    the color of what they point at (see siblingMerge.ts). Toggleable; off
 *    leaves the is-a chips.
 *  - self-loops: ⟲ marker on the slot's own row, not a routed edge.
 *
 * Row policy: by default a node shows the rows that carry a drawn edge
 * (plus ⟲ self-loops); a "+N more" footer expands to ALL entity-ranged
 * slots (dimmed rows = ranges not on canvas; future expand-on-demand).
 *
 * Talks to services/DataService only (per app architecture rules);
 * graph-core is pure layout code with zero app imports.
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  AttributeSummary,
  DataService, OwnershipSubgraph, OwnershipSubgraphEdge, OwnershipSubgraphNode,
  RelationEntry, RelationPosition,
} from '../services/DataService';
import {
  cardinalityLabel, SKIP_SUBCLASS_EXPANSION,
  relationPositionLabel, RELATION_POSITION_ORDER,
} from '../services/DataService';
import { EDGE_COLORS, RANGE_COLORS, SIBLING_HEADER_TEXT } from '../config/appConfig';
import {
  useGraphLayout, useZoomPan, roundedPath, sectionPoints, mergeTail,
  smoothStepPath,
  arrowPath,
} from './graph-core';
import type { EdgeSection, GraphSpec, GraphSpecPort, PlacedNode, Point } from './graph-core';
import {
  groupSiblings, isMergedId, mergedIdFor, siblingColor, withChildHeaders,
} from './siblingMerge';
import type { MergedMember, SiblingColor } from './siblingMerge';
import { RelationBar, type RelationRowVM } from './RelationBar';
import {
  rememberPreference,
  type Direction, type MergeMode,
} from './exploreState';

/** Where a convergence group's single arrowhead sits: `base` is the centre of
 *  its base (every merging edge terminates there, none draws a head of its own)
 *  and `dir` is the unit vector it points along. */
type MergeTarget = { base: Point; dir: Point };

const NODE_W = 240;
const HEADER_H = 30;
const ROW_H = 20;
/**
 * How many attribute rows a COLLAPSED box shows before it offers a footer.
 *
 * Replaces "show only the connected rows" (Siggie, 2026-08-28), which hid too
 * much: Person has one connected attribute, so a collapsed Person was a single
 * row plus `+ 8 more attributes`. The point of collapsing is to cap tall boxes
 * like Observation, not to reduce every box to its edges.
 *
 * Connected rows are never cut even when they alone exceed this — see the note
 * at the call site.
 */
const ROW_BUDGET = 6;
/**
 * The relation-menu trigger band: ONE line, always, on any box with relations.
 *
 * This replaced two `flex-wrap` chip strips whose heights were *estimated in
 * JS* while the browser did the real wrapping. The two necessarily diverged —
 * ELK reserved N lines and the browser drew N+1 — so the rows below overlapped
 * the chips. Observation (13 owners over three wrapped lines) was the worst
 * case. A fixed-height trigger makes box height deterministic by construction,
 * which is why the strips were replaced rather than the estimator patched.
 */
const RELATIONS_BAND_H = 22;
const FOOTER_H = 18;
const PAD = 28;


export interface RowVM {
  slot: string;
  range: string;
  /** 'plain' = scalar/enum-valued attribute — listed when expanded, never an edge. */
  channel: 'ownership' | 'reference' | 'plain';
  flipped: boolean;
  cardinality: string;
  isLoop: boolean;
  /** Carries a drawn edge (or is a self-loop) — rendered with full emphasis. */
  connected: boolean;
  /**
   * Merged boxes only: the siblings that declare this row themselves. Empty
   * means the row comes from the parent and is shared by every sibling, which
   * is why absence — not a flag — is the "shared" signal.
   */
  owners?: MergedMember[];
  /**
   * Merged boxes only: set on a synthetic row that introduces the block of
   * rows belonging to one child. Carries no slot and never anchors an edge —
   * `rowY` skips it by name, since no edge names a header.
   */
  header?: MergedMember;
  /**
   * Merged boxes only: the class whose definition this row shows. A merged box
   * can hold SEVERAL rows with one slot name — the parent's `value` plus each
   * child's narrowed override — so a name alone no longer identifies a row,
   * and edges anchor via (declaringClass, slot).
   */
  declaringClass?: string;
  /**
   * P1: the color of the row's RANGE KIND — entity, value set, data type.
   *
   * The dot and the range label both carry it. It answers "what KIND of thing
   * is at the other end?", which is a different question from WHICH thing is
   * at the other end (P3, on the slot name) or what kind of relation it is
   * (P2, on the edge).
   */
  rangeColor: string;
  /**
   * P3: the ink of the class this row POINTS AT, when that class has a sibling
   * color of its own. Undefined for a plain row, and for a row whose target
   * takes the default — there is nothing to track TO in either case.
   *
   * Set on EVERY box, not only merged ones. Specimen is in no merged box, but
   * its `quality_measure` row still points at SpecimenQualityObservation, and
   * drawing that row in that class's color is the whole point: it is how the
   * eye gets from a row to the box it means. Restricting this to merged boxes
   * made two rules out of one and left every unmerged box's rows uniform.
   */
  targetColor?: SiblingColor;
}

/** One related class as the menu shows it: name, why, and whether it is drawn. */
export interface RelationItemVM {
  other: string;
  /** The slots that put it in this position (several when a class reaches the
   *  same neighbour more than one way). Shown as the item's subtitle. */
  slots: string[];
  /** On the canvas right now — the item toggles it OFF rather than on. */
  drawn: boolean;
}

/** One branch of the cascade: a position, its label, and its members. */
export interface RelationGroupVM {
  position: RelationPosition;
  label: string;
  items: RelationItemVM[];
}

/**
 * Group a node's relations by position and mark which are drawn.
 *
 * `visible` is the id set actually on the canvas. Drawn-ness has to be
 * computed here rather than in the model because a merged box changes what is
 * "on the canvas" — its members are absorbed into one id.
 */
export function buildRelationGroups(
  relations: readonly RelationEntry[],
  visible: (id: string) => boolean,
  exclude: (id: string) => boolean = () => false,
): RelationGroupVM[] {
  /*
   * FIVE branches, one per RelationPosition. Siggie's original sketch named
   * four, folding the two `I belong to` positions together, and that is how
   * this shipped first; asked directly on 2026-08-27 he chose five, with the
   * declaring side named in the label rather than only in the slot subtitle.
   */
  const byPosition = new Map<RelationPosition, Map<string, string[]>>();
  for (const r of relations) {
    if (exclude(r.other)) continue;
    const pos = r.position;
    const byOther = byPosition.get(pos) ?? new Map<string, string[]>();
    const slots = byOther.get(r.other) ?? [];
    if (!slots.includes(r.slot)) slots.push(r.slot);
    byOther.set(r.other, slots);
    byPosition.set(pos, byOther);
  }

  return RELATION_POSITION_ORDER
    .filter(p => byPosition.has(p))
    .map((position): RelationGroupVM => {
      const items = [...byPosition.get(position)!]
        .map(([other, slots]): RelationItemVM => ({ other, slots, drawn: visible(other) }))
        .sort((a, b) => a.other.localeCompare(b.other));
      // Label agrees with the branch's own count, so a one-entity branch reads
      // "1 belongs to me by my attribute" rather than "1 belong to me…".
      return { position, label: relationPositionLabel(position, items.length), items };
    });
}

/**
 * Flatten a node's relations into one row per EDGE, for the RelationBar
 * popovers.
 *
 * Deliberately not a reshaping of `buildRelationGroups`: that dedupes to one
 * item per (position, class) and keeps only the slot NAMES, because the
 * cascading menu listed classes. The popover lists relationships — it shows
 * the declaring class and the cardinality per row — so it needs the entries
 * themselves. Two consumers, two shapes, one source.
 *
 * `exclude` drops self-loops and, on a merged box, anything folded into it,
 * matching the grouped builder.
 */
export function buildRelationRows(
  relations: readonly RelationEntry[],
  visible: (id: string) => boolean,
  exclude: (id: string) => boolean = () => false,
): RelationRowVM[] {
  const seen = new Set<string>();
  const out: RelationRowVM[] = [];
  for (const r of relations) {
    if (exclude(r.other)) continue;
    // One class can reach another through the same slot twice once a merged
    // box unions its members' relations; the popover should show it once.
    const key = `${r.declaredBy}.${r.slot}->${r.other}:${r.position}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      other: r.other,
      position: r.position,
      slot: r.slot,
      declaredBy: r.declaredBy,
      cardinality: r.cardinality,
      drawn: visible(r.other),
    });
  }
  return out;
}

export interface NodeVM extends OwnershipSubgraphNode {
  isaParents: string[];
  subclassCount: number;
  /** Set on a merged sibling box: the classes folded into it, in colour order.
   *  Empty on an ordinary node. */
  members: MergedMember[];
  /**
   * Owners of this class that aren't drawn — the "what uses this?" answer
   * path-to-root gives by drawing the entire upstream graph. Empty when
   * pathToRoot is on, since those owners are then real nodes.
   */
  hiddenOwners: string[];
  /** What this class owns that is NOT on the canvas — the downward chips. */
  hiddenOwned: string[];
  /**
   * Related classes grouped by position, each tagged with whether it is
   * currently on the canvas — the relation menu's contents.
   *
   * Replaces the two chip strips. The strips could only express two of the
   * five positions (and neither showed associations), and they were what made
   * box height non-deterministic; see RELATIONS_BAND_H.
   */
  relationGroups: RelationGroupVM[];
  /** The same relations, one row per edge — what the RelationBar popovers show. */
  relationRows: RelationRowVM[];
  /** Distinct related classes across every group — the "N related" count. */
  relatedCount: number;
  /** How many of those are on the canvas — the trigger's "M shown". */
  shownCount: number;
  /** Rows currently displayed (connected first; all when expanded). */
  rows: RowVM[];
  hiddenCount: number;
  expanded: boolean;
  height: number;
  /**
   * Every row this node could show, connected and hidden alike, in display
   * order. `rows` is the currently-visible slice of it. Kept because the
   * sibling merge has to re-derive the visible/hidden split across several
   * members and cannot do that from an already-filtered `rows`.
   */
  allRows: RowVM[];
}

export interface ViewModel {
  nodes: NodeVM[];
  /** Routed edges: ownership + reference, minus self-loops (row ⟲ markers). */
  edges: OwnershipSubgraphEdge[];
  /**
   * Edge id → the colour of the merged-box child that declares the slot the
   * edge is anchored on. Only edges touching a merged box appear. Drawn
   * instead of the channel colour so a line can be traced back to the child
   * block it leaves (Siggie, 2026-08-25: "colour the edges from any slot with
   * their owners").
   */
  edgeColors: Map<string, SiblingColor>;
}

/** The node whose attribute row stores the slot (edge anchor side). */
function hostOf(e: OwnershipSubgraphEdge): string {
  return e.storageDirection === 'flipped' ? e.target : e.source;
}

/**
 * An edge inside a merged box, tagged with the class whose row it anchors on.
 * Only edges rewritten by `mergeSiblings` carry the tag.
 */
type AnchoredEdge = OwnershipSubgraphEdge & {
  anchorClass?: string;
  /**
   * The class at the ENTITY end before merging rewrote the endpoint to a box
   * id. Set only when that class was absorbed into a merged box, which is
   * exactly when an edge can be pointed at a child header instead of the box
   * header (see childHeaderTarget).
   */
  entityMember?: string;
};

/**
 * The class whose ROW an edge attaches to. For an ordinary node this is just
 * the host; inside a merged box it is the class that DECLARES the slot, since
 * the box can hold a parent row and several child overrides sharing one name.
 */
function anchorOf(e: AnchoredEdge): string {
  return e.anchorClass ?? hostOf(e);
}

export function buildViewModel(
  sub: OwnershipSubgraph,
  expandedNodes: Set<string>,
  plainSlotsFor: (id: string) => AttributeSummary[],
  /** P1: the color for a range's KIND. See RowVM.rangeColor. */
  rangeColorOf: (range: string) => string,
  /** P3: the ink of a class the row points at. See RowVM.targetColor. */
  targetColorOf: (range: string) => SiblingColor | undefined,
): ViewModel {
  const isaParents = new Map<string, string[]>();
  const subclassCount = new Map<string, number>();
  const edges: OwnershipSubgraphEdge[] = [];
  const drawn = new Set<string>();

  for (const e of sub.edges) {
    if (e.type === 'isa') {
      isaParents.set(e.target, [...(isaParents.get(e.target) ?? []), e.source]);
      subclassCount.set(e.source, (subclassCount.get(e.source) ?? 0) + 1);
    } else if (!e.isLoop) {
      edges.push(e);
      drawn.add(`${hostOf(e)}|${e.slotName}`);
    }
  }

  // What is on the canvas, for the relation menu's drawn/undrawn state. The
  // menu's items toggle: a drawn one removes, an undrawn one adds.
  const visible = new Set(sub.nodes.map(n => n.id));

  const nodes = sub.nodes.map((n): NodeVM => {
    // Schema order. The subgraph's slot lists come out in graph-insertion
    // order (collectNodeSlots walks the edge set, and the edges come from
    // graphology's outbound iteration), which is arbitrary — it put date_ended
    // before date_started and valid_to before valid_from. getClassSummary
    // lists every attribute of the class in the order bdchm declares them, so
    // it is the authoritative index; anything missing from it sorts last
    // rather than disappearing.
    const schemaOrder = new Map(
      plainSlotsFor(n.id).map((s, i) => [s.name, i] as const),
    );
    const bySchema = (a: { slot: string }, b: { slot: string }) =>
      (schemaOrder.get(a.slot) ?? Number.MAX_SAFE_INTEGER)
      - (schemaOrder.get(b.slot) ?? Number.MAX_SAFE_INTEGER);

    const entityRows = n.slots.map((s): RowVM => ({
      ...s,
      connected: s.isLoop || drawn.has(`${n.id}|${s.slot}`),
      rangeColor: rangeColorOf(s.range),
      targetColor: targetColorOf(s.range),
    })).sort(bySchema);
    const entityNames = new Set(entityRows.map(r => r.slot));
    // Scalar/enum-valued attributes: everything getClassSummary lists that
    // isn't already an entity-ranged row.
    const plainRows = plainSlotsFor(n.id)
      .filter(s => !entityNames.has(s.name))
      .map((s): RowVM => ({
        slot: s.name, range: s.range, channel: 'plain',
        // Same label drawn edges use. These rows have no edge to carry it —
        // scalar/enum ranges are never drawn — but the cardinality is a fact
        // about the attribute, not about whether it happens to be drawn.
        flipped: false, cardinality: cardinalityLabel(s.required, s.multivalued),
        isLoop: false, connected: false,
        rangeColor: rangeColorOf(s.range),
      }));
    const connected = entityRows.filter(r => r.connected);
    // Entity-ranged and plain rows interleave by schema order once hidden,
    // rather than showing all the entity ones then all the scalars.
    const hidden = [...entityRows.filter(r => !r.connected), ...plainRows]
      .sort(bySchema);
    /*
     * A collapsed box shows up to ROW_BUDGET rows, not just its connected ones.
     *
     * Connected-only was the rule until 2026-08-28 and it hid too much: Person
     * has one connected attribute, so a collapsed Person was a single row and
     * `+ 8 more attributes` — a box that showed almost nothing about the class
     * it names (Siggie, screenshot). The budget exists to cap tall boxes like
     * Observation, so it should CAP them, not reduce every box to its edges.
     *
     * Connected rows fill the budget FIRST and are never cut, even when they
     * alone exceed it: an edge arriving at a row that is not drawn has nothing
     * to point at (see the "Row not currently displayed" case in the edge
     * anchoring below). The remainder fills with unconnected and scalar rows in
     * schema order.
     *
     * `forced` is now just "nothing is hidden": with the budget, a box whose
     * rows all fit has no collapsed state to return to, so a "− fewer" footer
     * there would be a control that does nothing. That subsumes the old
     * all-scalars case (BodySite: id/qualifier/site) — it is force-expanded now
     * because 3 ≤ 6, not because it has no edges.
     */
    const budgeted = [...connected, ...hidden].slice(0, Math.max(ROW_BUDGET, connected.length));
    const forced = budgeted.length === connected.length + hidden.length;
    const expanded = expandedNodes.has(n.id) || forced;
    const rows = expanded ? [...connected, ...hidden] : budgeted;
    const footerCount = forced ? 0 : connected.length + hidden.length - budgeted.length;
    const owners = sub.hiddenOwners.get(n.id) ?? [];
    const owned = sub.hiddenOwned.get(n.id) ?? [];
    const relationGroups = buildRelationGroups(
      n.relations, id => visible.has(id), id => id === n.id,
    );
    const relationRows = buildRelationRows(
      n.relations, id => visible.has(id), id => id === n.id,
    );
    return {
      ...n,
      isaParents: isaParents.get(n.id) ?? [],
      subclassCount: subclassCount.get(n.id) ?? 0,
      members: [],
      hiddenOwners: owners,
      hiddenOwned: owned,
      relationGroups,
      relationRows,
      ...countsOf(relationGroups),
      rows,
      allRows: [...connected, ...hidden],
      // Forced expansion has no collapsed state to return to, so offering a
      // "− fewer" footer there would be a control that does nothing.
      hiddenCount: footerCount,
      expanded,
      // The footer count must be the SAME one the render uses, or the box
      // reserves height for a footer it never draws.
      height: nodeHeight(rows.length, footerCount, relationGroups.length > 0),
    };
  });

  /*
   * An edge takes the color of the class it POINTS AT — the same rule, and the
   * same color, as the row it leaves (RowVM.targetColor). That is what makes
   * a row, its line and the box at the far end read as one thing.
   *
   * Done here rather than only in mergeSiblings, which used to be the only
   * writer: its map is per-merged-box, so every edge leaving an UNMERGED box
   * fell through to the P2 kind color. Specimen's three measure rows were
   * drawn red/purple/orange while the lines leaving them were all blue.
   *
   * The entity end is the one that is not the host: the host is where the
   * slot is stored, so the other end is what the slot names.
   */
  const edgeColors = new Map<string, SiblingColor>();
  for (const e of edges) {
    const entity = hostOf(e) === e.source ? e.target : e.source;
    const c = targetColorOf(entity);
    if (c) edgeColors.set(e.id, c);
  }

  return { nodes, edges, edgeColors };
}

/**
 * Distinct related classes across every group, and how many of them are on the
 * canvas — the trigger's "N related · M shown".
 *
 * Counted over NAMES, not entries: a class can occupy two positions at once
 * (each end declaring a slot at the other), and "N related" has to match the
 * number of distinct names the menu can reach, not the number of branch rows.
 *
 * `shown` counts related classes only. The box's own class is excluded from
 * its relations upstream, so a lone Organization reads "13 related · 0 shown"
 * rather than counting itself (Siggie, 2026-08-27).
 */
function countsOf(
  groups: readonly RelationGroupVM[],
): { relatedCount: number; shownCount: number } {
  const drawn = new Map<string, boolean>();
  for (const g of groups) for (const i of g.items) {
    drawn.set(i.other, (drawn.get(i.other) ?? false) || i.drawn);
  }
  return {
    relatedCount: drawn.size,
    shownCount: [...drawn.values()].filter(Boolean).length,
  };
}

/**
 * Box height. Shared by the plain build and the sibling merge so the two
 * cannot drift.
 *
 * The relation band is a FIXED one-line height, unlike the chip strips it
 * replaced: those wrapped in the browser while their height was estimated in
 * JS, so the reserved band and the drawn band diverged and the rows below
 * overlapped them. Nothing here estimates text any more.
 */
function nodeHeight(
  rowCount: number, hiddenCount: number, hasRelations: boolean,
): number {
  return HEADER_H + (hasRelations ? RELATIONS_BAND_H : 0)
    + rowCount * ROW_H + (hiddenCount ? FOOTER_H : 0) + (rowCount ? 5 : 0);
}

/**
 * Fold sibling classes into one box per shared parent.
 *
 * Row policy inside a merged box, in display order:
 *   1. rows the PARENT declares (the default color — shared by every sibling);
 *   2. rows a SIBLING declares itself, colored by what the row POINTS AT.
 * A row several siblings declare independently is drawn once and lists its
 * other owners in the tooltip rather than being duplicated: it is one
 * attribute name at one anchor point, and duplicating it would give rowY two
 * candidate rows for one slot.
 *
 * Edges are rewritten to the merged id at whichever end was a member. An edge
 * BETWEEN two siblings of the same parent becomes a self-loop on the merged
 * box and is dropped from routing — the box already shows both of its ends.
 */
export function mergeSiblings(
  vm: ViewModel,
  parentOf: (id: string) => string | undefined,
  isMergeableParent: (parent: string) => boolean,
  /**
   * Whose row a slot is, inside a merged box. Returns the PARENT when the
   * child's definition is identical to what it inherited, and the CHILD when
   * the child redefines it (`slot_usage` narrowing a range, changing
   * cardinality, and so on) — a redefinition is a fact about that child and
   * has to keep its own row and its own edge.
   */
  declaringClassOf: (classId: string, slot: string) => string | undefined,
  /** The parent's own identity. It is usually NOT a node in the subgraph —
   *  only selected classes are — so it cannot be read off vm.nodes. */
  describeClass: (id: string) => { description: string; abstract: boolean },
  /** Position of a slot in a class's declared attribute order; MAX_SAFE_INTEGER
   *  when the class does not list it, so unknowns sort last rather than first. */
  schemaIndexOf: (classId: string, slot: string) => number,
  /**
   * A class's stable P3 color index — its position among ALL its schema
   * siblings, 0 for a parent or a class in no mergeable family.
   *
   * Whole-schema rather than per-canvas, and that is the whole point: indexing
   * by position among the SELECTED siblings meant unselecting one shifted
   * every later sibling's color.
   */
  colorIndexOf: (classId: string) => number,
): ViewModel {
  const groups = groupSiblings(vm.nodes.map(n => n.id), parentOf, isMergeableParent);
  if (!groups.size) return vm;

  const byId = new Map(vm.nodes.map(n => [n.id, n]));
  /** The PRE-merge canvas, for relation drawn-ness: a class folded into a box
   *  is still on the canvas, so its menu item must read as drawn. */
  const vmVisible = new Set(vm.nodes.map(n => n.id));
  /** member class id → merged box id */
  const absorbed = new Map<string, string>();
  const merged: NodeVM[] = [];
  /** `${mergedId}|${declaringClass}|${slot}` → the row's P3 color. */
  const slotColor = new Map<string, SiblingColor>();

  for (const [parent, memberIds] of groups) {
    const id = mergedIdFor(parent);
    // Position among ALL schema siblings, not among the ones on canvas: an
    // unselected sibling must not shift the colors of the ones that remain.
    const members: MergedMember[] = memberIds.map((mid) => ({
      id: mid,
      label: byId.get(mid)?.label ?? mid,
      color: siblingColor(colorIndexOf(mid)),
    }));
    for (const m of members) absorbed.set(m.id, id);
    // The parent itself may be ON canvas (selected in its own right). It is the
    // same class the box is titled by, so leaving it as a separate node draws
    // Observation twice. Absorb it: its rows are the shared ones by
    // definition, and its edges belong on the merged box.
    const parentOnCanvas = byId.has(parent);
    if (parentOnCanvas) absorbed.set(parent, id);
    const byColor = new Map(members.map(m => [m.id, m]));

    /**
     * Union the members' FULL row sets, not their displayed ones: the merged
     * box makes its own visible/hidden decision, and a row hidden on every
     * member can still be worth showing once (or hiding once) here.
     *
     * A row is the parent's when the class that DECLARES it is an ancestor
     * rather than the member itself — `inheritedFrom` already carries that, so
     * nothing re-derives the hierarchy. Parent rows own no colour; sibling
     * rows carry the declaring sibling(s).
     */
    /**
     * Keyed by DECLARING CLASS + slot name, not by name alone.
     *
     * A child that redefines an inherited slot needs its own row alongside the
     * parent's: QuestionnaireResponseValue's five children each narrow `value`
     * to a different type (boolean / decimal / integer / TimePoint), which is
     * the entire reason those five classes exist. Keyed by name, they collapse
     * into one row reporting `string` and the distinction vanishes.
     *
     * Rows whose definition is unchanged still key on the parent, so the
     * shared ones merge exactly as before.
     */
    const rows = new Map<string, RowVM>();
    const sources = parentOnCanvas ? [parent, ...memberIds] : memberIds;
    for (const mid of sources) {
      const node = byId.get(mid);
      if (!node) continue;
      const isParent = mid === parent;
      for (const r of node.allRows) {
        // declaringClassOf already accounts for slot_usage: a child that
        // NARROWS an inherited slot is returned as the declarer, so its
        // redefined row stays its own rather than merging into the parent's.
        const declaredBy = declaringClassOf(mid, r.slot);
        const inherited = declaredBy !== undefined && declaredBy !== mid;
        const key = `${isParent || inherited ? declaredBy ?? parent : mid}|${r.slot}`;
        const prev = rows.get(key);
        const owner = byColor.get(mid);
        // Rows reached via the parent node are shared by construction.
        const owners = (isParent || inherited)
          ? (prev?.owners ?? [])
          : [...(prev?.owners ?? []), ...(owner ? [owner] : [])];
        rows.set(key, {
          // A row connected on ANY member is connected on the box: it carries
          // a drawn edge, whichever sibling stores it.
          ...(prev ?? r),
          connected: (prev?.connected ?? false) || r.connected,
          owners,
          declaringClass: key.slice(0, key.indexOf('|')),
        });
      }
    }
    /**
     * A row's color is its TARGET's, not its declarer's.
     *
     * This is what lets the eye track from a slot row to the box it points at:
     * `SdohObservationSet.observations` is drawn in the color `SdohObservation`
     * wears in its own box, so the row and its destination are visibly the same
     * thing seen twice. Coloring by declarer instead only restated what the
     * child header above the row already says.
     *
     * A row whose target is in no mergeable family (or is a parent) gets index
     * 0, the default — correct, because there is nothing to track TO: the
     * target's box is not a merged box and wears the default itself.
     */
    /**
     * A container borrows its contents' color.
     *
     * `SdohObservationSet` is the box that holds `SdohObservation`s, so it
     * should be the same color as them — otherwise the pair that most needs
     * to read as a pair is the one place the color system says nothing. When
     * a child's own row points at a colored target, that color becomes the
     * child's, overriding its position-derived one.
     *
     * Only a child's OWN rows can do this. A row inherited from the parent is
     * shared by every sibling, so letting it recolor one of them would hand
     * that sibling a color on the strength of something it does not uniquely
     * have.
     *
     * `targetColor` is already on the row (buildViewModel sets it for every
     * box); this only has to decide who borrows from whom.
     */
    const borrowed = new Map<string, SiblingColor>();
    for (const r of rows.values()) {
      if (!r.targetColor) continue;
      for (const o of r.owners ?? []) {
        if (!borrowed.has(o.id)) borrowed.set(o.id, r.targetColor);
      }
    }
    for (const m of members) {
      const b = borrowed.get(m.id);
      if (b) m.color = b;
    }
    for (const [key, r] of rows) {
      // `key` is already `declaringClass|slot`, the same pair edges resolve by.
      if (r.targetColor) slotColor.set(`${id}|${key}`, r.targetColor);
    }
    const all = [...rows.values()];
    /**
     * Sort by the DECLARING class's own schema order — the same rule an
     * unmerged box uses, so merging never reshuffles a class's attributes
     * relative to how the schema lists them. (Siggie: "i have no idea how
     * slots are sorted"; before this, rows inside a block kept map insertion
     * order, which is member-iteration order and reads as random.)
     *
     * Grouping into shared-then-per-child blocks is NOT done here —
     * `withChildHeaders` regroups by owner so that every member gets a header
     * even when it owns no rows. This sort only has to make each block's
     * internal order meaningful.
     */
    const declOrder = (r: RowVM) => {
      // Shared rows are ordered by the parent's declaration, a child's own
      // rows by that child's.
      const owner = r.owners?.length ? r.owners[0].id : parent;
      return schemaIndexOf(owner, r.slot);
    };
    all.sort((a, b) => declOrder(a) - declOrder(b));
    /**
     * A merged box shows EVERY row, always — no connected/hidden split and no
     * "+N more" footer (Siggie, 2026-08-25: "i think there are more slots.
     * show all of them. let the box flow over bottom of page if needed").
     *
     * The collapse exists on ordinary boxes to keep a canvas of many classes
     * readable. A merged box is the opposite situation: you selected these
     * classes to compare them, so hiding the rows that differ defeats the
     * point — and worse, a child whose only rows were unconnected showed an
     * empty block under its header, which reads as "adds nothing" when it
     * actually means "hidden".
     */
    const rowList = withChildHeaders(
      all, members,
      (child): RowVM => ({
        slot: `::hdr:${child.id}`, range: '', channel: 'plain',
        flipped: false, cardinality: '', isLoop: false, connected: false,
        // A header row has no range, so no P1 color; it never draws a dot.
        rangeColor: '',
        header: child,
      }),
    );

    const notSelfOrMember = (o: string) => !absorbed.has(o) && !sources.includes(o);
    const hiddenOwners = [...new Set(
      sources.flatMap(mid => byId.get(mid)?.hiddenOwners ?? []),
    )].filter(notSelfOrMember);
    // Drawn owners union the same way. A box's own members are never chips on
    // it, and neither is a class absorbed into some other merged box.
    const hiddenOwned = [...new Set(
      sources.flatMap(mid => byId.get(mid)?.hiddenOwned ?? []),
    )].filter(notSelfOrMember);
    const mergedRelations = buildRelationGroups(
      sources.flatMap(mid => byId.get(mid)?.relations ?? []),
      id => vmVisible.has(id),
      id => !notSelfOrMember(id),
    );
    const mergedRelationRows = buildRelationRows(
      sources.flatMap(mid => byId.get(mid)?.relations ?? []),
      id => vmVisible.has(id),
      id => !notSelfOrMember(id),
    );
    const first = byId.get(memberIds[0]);
    // The box IS the parent, so its identity — name, description, abstractness
    // — must be the parent's. Spreading a member and forgetting to override
    // these showed the first sibling's description on the box's tooltip.
    const parentInfo = describeClass(parent);

    merged.push({
      ...(first as NodeVM),
      id,
      label: parent,
      description: parentInfo.description,
      abstract: parentInfo.abstract,
      slots: [],
      members,
      // The box stands for its members, so it is selected if any member is.
      role: sources.some(mid => byId.get(mid)?.role === 'selected')
        ? 'selected' : 'context',
      // Layering: the shallowest member, so the box sits where the earliest of
      // its siblings would have.
      layer: Math.min(...sources.map(mid => byId.get(mid)?.layer ?? 0)),
      isaParents: [],
      subclassCount: members.length,
      hiddenOwners,
      hiddenOwned,
      /*
       * The merged box's relations are the UNION of its members' — it stands
       * for all of them — minus anything folded into this same box, which is
       * inside it rather than related to it. `notSelfOrMember` also drops
       * classes absorbed into some OTHER merged box, matching how the chips
       * behaved; those are reachable from that box instead.
       *
       * Drawn-ness is asked of the pre-merge node set, so an item is "drawn"
       * when the class is on the canvas in any form, merged or not.
       */
      relationGroups: mergedRelations,
      relationRows: mergedRelationRows,
      ...countsOf(mergedRelations),
      rows: rowList,
      allRows: all,
      // Nothing is ever hidden on a merged box, so there is no footer to
      // offer and no collapsed state to return to.
      hiddenCount: 0,
      expanded: true,
      // rowList already includes the child header rows, each one line tall.
      height: nodeHeight(rowList.length, 0, mergedRelations.length > 0),
    });
  }

  const nodes = [
    ...vm.nodes.filter(n => !absorbed.has(n.id)),
    ...merged,
  ];
  /**
   * Inside a merged box a child does not have its parent's slots — the PARENT
   * has them, and the child is shown as the delta. An inherited slot therefore
   * carries ONE edge for the whole box, not one per child: five siblings all
   * declaring `associated_visit` fanned five lines into a single anchor row.
   *
   * But it must be one, not zero. An earlier version dropped every child's
   * copy on the theory that "the parent's own copy survives" — which is false
   * whenever the parent is not itself on the canvas. Selecting
   * DimensionalObservation alone drew Organization, Participant and Visit as
   * unconnected boxes: their edges were the parent's, and no parent was there
   * to contribute them.
   *
   * So: keep the FIRST edge per (box, anchor row, other end, direction) and
   * drop the rest. A child's genuine override anchors on its own row, so it
   * has a different key and always survives — the case dedup-by-value would
   * have got wrong.
   */
  const seenEdge = new Set<string>();
  const edges = vm.edges
    .map(e => ({
      ...e,
      source: absorbed.get(e.source) ?? e.source,
      target: absorbed.get(e.target) ?? e.target,
      // The class at the ENTITY end, captured BEFORE the rewrite above loses
      // it. Only set when that class was absorbed — i.e. when the box it
      // arrives at holds it as a member, which is what lets the edge land on
      // that member's header row instead of the box header.
      entityMember: (() => {
        const entity = hostOf(e) === e.source ? e.target : e.source;
        return absorbed.has(entity) ? entity : undefined;
      })(),
      // Which row inside the box this edge anchors on. A merged box can hold
      // several rows with one slot name (the parent's, plus each child's
      // override), so the slot name alone is not a unique anchor.
      anchorClass: absorbed.has(hostOf(e))
        ? declaringClassOf(hostOf(e), e.slotName) ?? hostOf(e)
        : hostOf(e),
    }))
    .filter(e => {
      const host = hostOf(e);
      if (!isMergedId(host)) return true;          // untouched by merging
      const other = host === e.source ? e.target : e.source;
      const key = `${host}|${e.anchorClass}|${e.slotName}|${other}|${e.storageDirection}`;
      if (seenEdge.has(key)) return false;
      seenEdge.add(key);
      return true;
    })
    // Both ends in the same box: the relationship is inside the box now.
    .filter(e => e.source !== e.target);

  /*
   * Merging can move an edge's anchor, so re-resolve the ones it touched. The
   * base map (buildViewModel) already colored every edge by the class it
   * points at; this only corrects edges whose anchor row is now inside a
   * merged box, where `slotColor` knows the row's own color.
   *
   * Edges the merge did not touch keep their base color — that is what stops
   * unmerged boxes falling back to the P2 kind color.
   */
  const edgeColors = new Map<string, SiblingColor>(vm.edgeColors);
  for (const e of edges) {
    const c = slotColor.get(`${hostOf(e)}|${anchorOf(e)}|${e.slotName}`);
    if (c) edgeColors.set(e.id, c);
  }

  return { nodes, edges, edgeColors };
}

/** Self-loop marker: SVG so size/alignment don't depend on font metrics. */
function LoopIcon({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="false"
      className="shrink-0" style={{ color: RANGE_COLORS.entity }}>
      <title>{title}</title>
      {/* 300° arc with a 60° gap on the right; arrowhead at the top end
          pointing into the gap, so the loop reads as an arrow, not an O */}
      <path d="M12.33 10.5 A5 5 0 1 1 12.33 5.5" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.7 7.9 L10.6 6.7 L13.7 4.2 Z" fill="currentColor" />
    </svg>
  );
}

/** Top of the row list: below the header, and below the owners strip if shown.
 *  A merged box needs no extra band — its children are introduced by header
 *  ROWS inside the list, which are ordinary rows as far as geometry cares. */
function rowsTop(node: NodeVM): number {
  return HEADER_H + (node.relationGroups.length > 0 ? RELATIONS_BAND_H : 0);
}

/**
 * y-center of a slot's displayed row, relative to the node's top-left.
 *
 * `declaringClass` disambiguates a merged box holding several rows with one
 * slot name (the parent's, plus each child's override). Matching on the name
 * alone anchored every child's edge on the parent's row.
 */
function rowY(node: NodeVM, slot: string, declaringClass?: string): number {
  const idx = node.rows.findIndex(r =>
    r.slot === slot && !r.header
    && (!declaringClass || !r.declaringClass || r.declaringClass === declaringClass));
  if (idx < 0) throw new Error(`No displayed row for ${slot} on ${node.id}`);
  return rowsTop(node) + idx * ROW_H + ROW_H / 2;
}

/**
 * y-center of the CHILD HEADER row naming `member` inside a merged box, or
 * undefined when the box has no such header.
 *
 * Separate from `rowY`, which skips headers by design (`!r.header`): a header
 * carries no slot name, so nothing that resolves by slot can ever want one.
 * This resolves by member id instead — the only thing a header has.
 */
function headerRowY(node: NodeVM, member: string): number | undefined {
  const idx = node.rows.findIndex(r => r.header?.id === member);
  if (idx < 0) return undefined;
  return rowsTop(node) + idx * ROW_H + ROW_H / 2;
}

/**
 * The merged-box member an edge should land ON, rather than on the box header.
 *
 * An edge earns this when the class it POINTS AT was absorbed into the box it
 * now arrives at: `MeasurementObservationSet.observations` is narrowed by
 * `slot_usage` to `MeasurementObservation`, so landing it on the box's own
 * header says only "an Observation", which is the one thing the narrowing
 * exists to refine.
 *
 * Only a narrowed slot can pose the question. Without `slot_usage` a child's
 * slot is identical to the inherited one, so it merges onto the PARENT's row
 * and there is no child-specific edge to redirect.
 *
 * The member is read off `entityMember`, which mergeSiblings records before
 * rewriting the endpoint: once the endpoint is the merged box id, the class
 * the slot actually named is no longer recoverable from the edge.
 *
 * Undefined for a flipped edge — those end at their own attribute row, which
 * already carries the row meaning this is trying to add.
 */
function childHeaderTarget(
  e: AnchoredEdge, free: NodeVM,
): string | undefined {
  if (e.storageDirection === 'flipped' || !free.members.length) return undefined;
  const m = e.entityMember;
  return m && free.members.some(x => x.id === m) ? m : undefined;
}

/** Gap between adjacent entity-end ports (px). Small on purpose: the fan is a
 *  routing device, not a visual one — see buildSpec. */
const ENTITY_FAN_GAP = 4;

/** Corner radius for orthogonal edges. Large enough that a tight fan of
 *  converging edges sweeps into the header rather than meeting it at hard
 *  right angles; 0 would render exactly like the old square-cornered mode. */
const CORNER_R = 10;

/** Entity title font size (px). The node body is Tailwind `text-xs`, and the
 *  title span inherits it, so 1em at the title is 12px. The single convergence
 *  arrowhead is sized off this so it reads as belonging to the name it points
 *  at, rather than to an arbitrary px scale. */
const TITLE_EM = 12;

/** The one arrowhead per convergence, sized off the title text: ~1em across the
 *  BASE, ~1.5em from base to point. In LR the arrow points along x, so the base
 *  is vertical (span = height, len = along x); for TB the arrow points down and
 *  the two swap — handled at draw time, not here. */
const ARROW_SPAN = TITLE_EM;        // base width, ~1em
const ARROW_LEN = TITLE_EM * 1.5;   // base → point, ~1.5em

/** Gap between a node's border and the arrowhead TIP, so the whole head is
 *  visible against the canvas rather than half-buried in the border. */
const ARROW_GAP = 0;

/** Reference edges are secondary; their heads are a touch smaller. */
const REF_SCALE = 0.85;


/** Edge stroke widths. Kept here rather than inline because the hover value is
 *  applied by direct DOM styling in the RAF pass, far from the render that sets
 *  the default — as literals the two silently drift apart. References stay
 *  proportionally lighter than ownership.
 *
 *  Thicker than the 0.8/0.54 these replace: a hairline cannot carry a color at
 *  all, whatever the palette. This was originally justified by P2's one-step
 *  Blues gap, which 2026-09-04 replaced with three distinct hues — the width
 *  still earns its keep, since the point is that the stroke reads AS a color. */
const STROKE_OWN = 1.4;
const STROKE_OWN_HOVER = 2.6;
const STROKE_REF = STROKE_OWN * 0.75;
const STROKE_REF_HOVER = STROKE_OWN_HOVER * 0.75;

/**
 * The P2 color for an edge: what KIND of relation it is.
 *
 * Three kinds, named for the classifier's verdicts rather than for a
 * direction. "Outgoing"/"incoming" would be wrong: they imply a point of view,
 * and with nothing hovered the canvas has none. See EDGE_COLORS.
 */
function edgeKindColor(isOwn: boolean, flipped: boolean): string {
  if (!isOwn) return EDGE_COLORS.association;
  return flipped ? EDGE_COLORS.ownBkwd : EDGE_COLORS.ownFwd;
}

/**
 * Where converging edges stop being separate lines and become one.
 * Four candidates, switchable in the toolbar so they can be compared on real
 * data. Kept deliberately: Siggie wants to see all four rendered with the
 * single convergence arrowhead before one is settled on. Until then, do not
 * delete the losers — there is no winner yet.
 *  - 'near'  ~40px: parallel and distinct until close to the node, then sweep
 *            together. Each edge stays traceable to its owner.
 *  - 'far'   ~120px: converge early, so the approach reads as one trunk that
 *            splits back to its sources. Quieter near the node, harder to trace.
 *  - 'bend'  at ELK's last corner: adaptive per edge, but the distance then
 *            varies between nodes and layouts.
 *  - 'off'   no merging — every edge runs to its own fanned port.
 */

/** Merge distance in px for a mode, given the edge's routed points. */
function mergeDistFor(mode: MergeMode, pts: Point[]): number {
  if (mode === 'off' || pts.length < 2) return 0;
  if (mode === 'near') return 40;
  if (mode === 'far') return 120;
  // 'bend': distance from the end back to the last routed corner.
  //
  // NB: cutting exactly here puts the corner at the seam between the routed
  // head and the merge curve, and roundedPath cannot round a seam corner (it
  // rounds only corners with segments on BOTH sides). That is why this mode
  // shows hard right angles. Overshooting by CORNER_R*1.5 to swallow the
  // corner was tried on 2026-08-19 and is WORSE: when the last segment is
  // short the cut lands past the corner, onto the long run before it, so the
  // approaches get replaced by curve far too early and bunch into a cramped
  // parallel bundle. Fix the rounding at the seam, not the cut distance.
  const end = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  return Math.hypot(end.x - prev.x, end.y - prev.y);
}

/** Per-edge offset for a fan of `total` ports, shrunk to stay inside `limit`
 *  px overall however many edges converge. */
function fanSpread(total: number, limit: number): number {
  if (total < 2) return 0;
  return Math.min(ENTITY_FAN_GAP, limit / (total - 1));
}

/**
 * ELK spec. Each drawn edge gets a fixed-position port at its slot's row on
 * the ATTRIBUTE-end node (east when that node is the drawn source, west when
 * it receives) — the end that genuinely names a slot. The ENTITY end (the peer
 * class, which has no corresponding row) gets a header-level port, tightly
 * fanned, so edges land on the entity name rather than beside an unrelated
 * attribute row.
 */
export function buildSpec(vm: ViewModel, direction: Direction): GraphSpec {
  const portsByNode = new Map<string, GraphSpecPort[]>();
  const addPort = (node: NodeVM, id: string, x: number, y: number): string => {
    const ports = portsByNode.get(node.id) ?? [];
    if (!ports.some(p => p.id === id)) {
      ports.push({ id, x, y });
      portsByNode.set(node.id, ports);
    }
    return id;
  };

  const nodeById = new Map(vm.nodes.map(n => [n.id, n]));

  /**
   * Entity-end ports fan out instead of all sharing one header point: six
   * edges converging on BodySite through a single ::hdr:in port produced
   * overlapping orthogonal runs that read as an edge between two unrelated
   * owners. One port per edge, ordered, keeps ELK's runs distinct.
   *
   * The fan is deliberately TIGHT (ENTITY_FAN_GAP px apart, centred on the
   * header) — it exists only so ELK routes the approach lanes separately, not
   * as a visual feature. An earlier version spread ports over the whole header
   * band and spilled below it, so arrows landed beside attribute rows and
   * falsely implied "this edge is about that row". Only the ATTRIBUTE end
   * carries row meaning; the entity end points at the class as a whole.
   */
  /**
   * An edge landing on a CHILD HEADER row takes no fan lane: it has its own
   * arrival point further down the box, so counting it here would reserve a
   * lane nothing uses and mis-centre every edge that does. Both passes —
   * this count and the slot assignment below — must agree on the exclusion.
   */
  const rowTargeted = (e: AnchoredEdge) => {
    const free = nodeById.get(hostOf(e) === e.source ? e.target : e.source);
    return !!free && childHeaderTarget(e, free) !== undefined;
  };

  const freeEndTotal = new Map<string, number>();
  for (const e of vm.edges) {
    if (rowTargeted(e)) continue;
    const freeId = hostOf(e) === e.source ? e.target : e.source;
    const side = `${freeId}|${freeId === e.source ? 'out' : 'in'}`;
    freeEndTotal.set(side, (freeEndTotal.get(side) ?? 0) + 1);
  }

  /**
   * NB: fan slot index here is just a distinct lane per edge — it deliberately
   * carries NO ordering meaning. Ordering the ports by any pre-layout proxy
   * (row y, owner name) is guesswork, because which approach arrives from where
   * is ELK's decision and is not known until after layout. An attempt to sort
   * by row y made things worse (2026-08-20): it gave the top row the straight
   * shot and forced every lower one to climb over it.
   *
   * Re-ordering the approaches at render time by where each routed path
   * arrives from was also tried and reverted: it spread the arrival points
   * across the arrowhead base, which is not what was wanted. The lanes are
   * therefore unordered, and ELK decides which approach uses which.
   */
  const freeEndSlot = new Map<string, number>();

  const edges = vm.edges.map(e => {
    const host = nodeById.get(hostOf(e));
    const free = nodeById.get(hostOf(e) === e.source ? e.target : e.source);
    if (!host || !free) throw new Error(`Edge ${e.id} endpoint missing from subgraph`);
    const flipped = e.storageDirection === 'flipped';
    const y = rowY(host, e.slotName, anchorOf(e));
    /**
     * The port id must key on the same (anchor class, slot) pair `rowY`
     * resolves by. Keyed on the slot NAME alone, a merged box holding several
     * rows with one name — the parent's plus each child's override — gave
     * every one of those edges the SAME port id, and `addPort` keeps the
     * first registration per id. The correctly-computed y of every later edge
     * was silently discarded, so all of them left whichever row happened to be
     * enumerated first: with Observation selected they all left the parent's
     * `observations` row, without it they all left DimensionalObservationSet's.
     * Same bug `rowY`'s own comment warns about, missed one line later.
     */
    const rowPort = addPort(
      host, `${host.id}::row:${anchorOf(e)}|${e.slotName}`,
      flipped ? 0 : NODE_W, y,
    );
    const freeIsSource = free.id === e.source;
    const side = `${free.id}|${freeIsSource ? 'out' : 'in'}`;
    /*
     * A narrowed edge lands on the CHILD HEADER matching its range, not on the
     * box header: all three `…ObservationSet.observations` edges otherwise
     * arrive at the merged Observation box's header, which hides the entire
     * point of the narrowing — each set holds its OWN kind of observation.
     *
     * The port id carries the MEMBER, for the same reason the row port carries
     * the anchor class: `addPort` keeps the first registration per id, so two
     * edges sharing an id would silently share one y.
     *
     * These edges take no fan lane (see rowTargeted) and draw their own
     * arrowhead — under the current schema no member has more than one inbound
     * edge, so there is nothing for them to converge with. The guard test in
     * mergedEdges.test.ts is what detects that changing.
     */
    const member = childHeaderTarget(e, free);
    const memberY = member !== undefined ? headerRowY(free, member) : undefined;
    let headerPort: string;
    if (member !== undefined && memberY !== undefined) {
      headerPort = addPort(
        free, `${free.id}::mhdr:${freeIsSource ? 'out' : 'in'}:${member}`,
        direction === 'RIGHT' ? (freeIsSource ? NODE_W : 0) : NODE_W / 2,
        direction === 'RIGHT' ? memberY : (freeIsSource ? free.height : 0),
      );
    } else {
      const total = freeEndTotal.get(side) ?? 1;
      const idx = freeEndSlot.get(side) ?? 0;
      freeEndSlot.set(side, idx + 1);
      // Tight fan centred on the header: just enough separation for ELK to route
      // each approach in its own lane, never spilling past the header band.
      const spread = fanSpread(total, HEADER_H - 4);
      const offset = HEADER_H / 2 + (idx - (total - 1) / 2) * spread;
      headerPort = direction === 'RIGHT'
        ? addPort(free, `${free.id}::hdr:${freeIsSource ? 'out' : 'in'}:${idx}`,
            freeIsSource ? NODE_W : 0, offset)
        : addPort(free, `${free.id}::hdr:${freeIsSource ? 'out' : 'in'}:${idx}`,
            NODE_W / 2 + (idx - (total - 1) / 2) * fanSpread(total, NODE_W / 2),
            freeIsSource ? free.height : 0);
    }
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      sourcePort: flipped ? headerPort : rowPort,
      targetPort: flipped ? rowPort : headerPort,
    };
  });

  return {
    nodes: vm.nodes.map(n => ({
      id: n.id,
      width: NODE_W,
      height: n.height,
      partition: n.layer,
      ports: portsByNode.get(n.id),
    })),
    edges,
  };
}

/** Pull the routed end back along its final segment (so back-pointing
 *  arrowheads don't abut the node border). */
function trimSectionsEnd(sections: EdgeSection[] | undefined, dist: number): EdgeSection[] | undefined {
  if (!sections?.length) return sections;
  const s = sections[0];
  const prev = s.bendPoints?.length ? s.bendPoints[s.bendPoints.length - 1] : s.startPoint;
  const dx = s.endPoint.x - prev.x;
  const dy = s.endPoint.y - prev.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return sections;
  const k = Math.min(dist, len * 0.8) / len;
  const endPoint = { x: s.endPoint.x - dx * k, y: s.endPoint.y - dy * k };
  return [{ ...s, endPoint }, ...sections.slice(1)];
}

/** The mirror of trimSectionsEnd, for the START vertex.
 *
 *  Only association edges need it, because only they carry a markerStart.
 *  arrow-assoc uses refX=0, which puts the marker's BASE on the path vertex and
 *  its tip ARROW_LEN beyond — and since the node boxes are opaque divs stacked
 *  ON TOP of this SVG layer, a tip that overshoots the border is painted over
 *  and the arrowhead simply vanishes. (It showed up only when hovering a dimmed
 *  box, which is translucent.) Pulling the start back by the head's own length
 *  puts the tip on the border instead of behind it. */
function trimSectionsStart(sections: EdgeSection[] | undefined, dist: number): EdgeSection[] | undefined {
  if (!sections?.length) return sections;
  const s = sections[0];
  const next = s.bendPoints?.length ? s.bendPoints[0] : s.endPoint;
  const dx = next.x - s.startPoint.x;
  const dy = next.y - s.startPoint.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return sections;
  const k = Math.min(dist, len * 0.8) / len;
  const startPoint = { x: s.startPoint.x + dx * k, y: s.startPoint.y + dy * k };
  return [{ ...s, startPoint }, ...sections.slice(1)];
}

export default function OwnershipGraphView({
  dataService,
  selectedIds,
  onNodeClick,
  onAdd,
  onRemove,
  pathToRoot = false,
  onTogglePathToRoot,
  direction,
  setDirection,
  mergeMode,
  setMergeMode,
  mergeSibs,
  setMergeSibs,
}: {
  dataService: DataService;
  selectedIds: Set<string>;
  onNodeClick?: (id: string) => void;
  /**
   * Put a class on the canvas — from an attribute row or a relation-menu item.
   * Adding IS selecting (2026-08-27), so this ticks the left panel's checkbox;
   * there is no longer a second, dimmer way for a class to be here.
   */
  onAdd?: (classId: string) => void;
  /** Take a class off the canvas. The exact inverse of `onAdd`. */
  onRemove?: (classId: string) => void;
  /** Draw each selected class's ownership ancestors as dimmed context nodes. */
  pathToRoot?: boolean;
  /** Layout direction: LR or TB. */
  direction: Direction;
  setDirection: (d: Direction) => void;
  /** How converging edges merge before their target. */
  mergeMode: MergeMode;
  setMergeMode: (m: MergeMode) => void;
  /**
   * Merge sibling classes into one box per shared parent (docs/EXPLORE_VIZ.md
   * "inheritance as adjacency"). On by default: with it off, inheritance is
   * invisible in the diagram entirely.
   */
  mergeSibs: boolean;
  setMergeSibs: (v: boolean) => void;
  onTogglePathToRoot?: () => void;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const markerId = (name: string) => `${name}-${uid}`;

  // Toolbar settings are owned by ExploreApp so they can live in the URL and
  // travel in a shared link; see explore/exploreState.ts. This component used
  // to hold them in localStorage-backed useState, which is exactly why a link
  // rendered with the recipient's settings rather than the sender's.
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());



  const subgraph = useMemo(
    () => dataService.getOwnershipSubgraph([...selectedIds].sort(), { pathToRoot }),
    [dataService, selectedIds, pathToRoot],
  );
  /* Each end of a relation row wears its own class's P3 colour — the same one
     that class's header and rows wear on the canvas, so a row can be matched
     to a box by colour. Same accessor the rows themselves use. */
  const targetColorOf = useCallback(
    (classId: string) => dataService.getTargetColor(classId),
    [dataService],
  );
  const plainSlots = useMemo(
    () => new Map(subgraph.nodes.map(n =>
      [n.id, dataService.getClassSummary(n.id)?.slots ?? []] as const)),
    [dataService, subgraph],
  );
  const baseVm = useMemo(
    () => buildViewModel(
      subgraph, expandedNodes, id => plainSlots.get(id) ?? [],
      range => dataService.getRangeColor(range),
      range => dataService.getTargetColor(range),
    ),
    [subgraph, expandedNodes, plainSlots, dataService],
  );
  /**
   * Per-class parent and per-slot declaring class, for the sibling merge.
   * Read from the same getClassSummary already fetched for plainSlots, so the
   * merge costs no extra model work.
   */
  const summaries = useMemo(
    () => new Map(subgraph.nodes.map(n =>
      [n.id, dataService.getClassSummary(n.id)] as const)),
    [dataService, subgraph],
  );
  const vm = useMemo(() => {
    if (!mergeSibs) return baseVm;
    const parentOf = (id: string) => summaries.get(id)?.parentId;
    // `Entity` is excluded for the same reason it carries no is-a edges: a box
    // holding 37 classes is the crowding it was supposed to remove.
    const isMergeableParent = (parent: string) =>
      !SKIP_SUBCLASS_EXPANSION.has(parent);
    /**
     * Whose slot is this, for merging purposes?
     *
     * `inheritedFrom` alone is NOT enough, and assuming it was would have been
     * a silent bug: all four Observation children report `observation_type` as
     * inheritedFrom Observation, yet each NARROWS its range (
     * MeasurementObservationTypeEnum / SdohEnum / BaseEnum). That is
     * `slot_usage`, and a narrowed slot is genuinely the child's — it needs its
     * own row and its own edge, not a shared one that would misreport three of
     * the four ranges.
     *
     * So: inherited AND identical to the parent's version → the parent's.
     * Anything else → the child's.
     *
     * (Goes through dataService, not `summaries`: that map holds only subgraph
     * NODES, and the parent is usually not one — it is the box's title.)
     */
    // `required` is deliberately NOT compared. Every class in the schema
    // reports inherited `id` as required while Entity declares it optional
    // (LinkML derives required from identifier:true at the inherited site) —
    // comparing it would mark `id` as redefined on all 53 classes and give
    // every child an `id` row of its own. Range and multivalued are the
    // differences that actually change what is drawn.
    const sameDef = (a: AttributeSummary, b: AttributeSummary) =>
      a.range === b.range && a.multivalued === b.multivalued;
    const declaringClassOf = (classId: string, slot: string) => {
      const own = dataService.getClassSummary(classId)?.slots
        .find(a => a.name === slot);
      if (!own) return undefined;
      if (!own.inheritedFrom) return classId;
      const inh = dataService.getClassSummary(own.inheritedFrom)?.slots
        .find(a => a.name === slot);
      return inh && sameDef(own, inh) ? own.inheritedFrom : classId;
    };
    const describeClass = (id: string) => {
      const sum = dataService.getClassSummary(id);
      return { description: sum?.description ?? '', abstract: sum?.isAbstract ?? false };
    };
    // Position in the class's declared attribute order. getClassSummary lists
    // attributes in the order bdchm declares them, which is the authoritative
    // index the unmerged boxes already sort by.
    // NB: goes through dataService, not `summaries` — that map holds only
    // subgraph NODES, and the parent whose order we need is usually not one
    // (it is the box's title, not a selected class). Reading it from the
    // wrong map returned MAX_SAFE_INTEGER for every shared row, which sorts
    // them all last and looks exactly like no sort at all.
    const schemaIndexOf = (classId: string, slot: string) => {
      const i = dataService.getClassSummary(classId)?.slots
        .findIndex(a => a.name === slot) ?? -1;
      return i < 0 ? Number.MAX_SAFE_INTEGER : i;
    };
    return mergeSiblings(
      baseVm, parentOf, isMergeableParent, declaringClassOf, describeClass,
      schemaIndexOf,
      id => dataService.siblingColorIndexOf(id),
    );
  }, [baseVm, summaries, mergeSibs, dataService]);
  const [nudges, setNudges] = useState<Map<string, { dx: number; dy: number }>>(new Map());
  /**
   * Nodes moved by a completed drag, id → offset from ELK's placement. The
   * node STAYS where it was dropped and its edges are re-routed by our own
   * geometry (see dragRoutes); ELK is not re-run.
   *
   * Feeding the dropped coordinates back to ELK was tried on 2026-08-20 and
   * does not work. Honouring supplied x/y needs the INTERACTIVE layering /
   * crossing-minimisation strategies, and those read coordinates as ORDERING
   * HINTS, not positions: ELK infers which layer and what sequence the node
   * belongs in, then re-places it wherever that layer falls. Dropping BodySite
   * at the far right moved it somewhere else entirely, and on one graph the
   * layout hung. ELK is a batch layouter; it has no "keep this here" mode.
   */
  const [pins, setPins] = useState<Map<string, { dx: number; dy: number }>>(new Map());

  const spec = useMemo(() => buildSpec(vm, direction), [vm, direction]);

  const { layout, inProgress } = useGraphLayout(spec, {
    direction,
    usePartitions: true,
    nodeSpacing: 28,
    layerSpacing: 72,
    extraLayoutOptions: {
      'elk.spacing.edgeNode': '18',
      'elk.spacing.edgeEdge': '12',
      'elk.layered.spacing.edgeNodeBetweenLayers': '18',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '10',
    },
  });

  const zp = useZoomPan();
  const contentW = (layout?.width ?? 0) + PAD * 2;
  const contentH = (layout?.height ?? 0) + PAD * 2;
  useEffect(() => {
    if (!layout) return;
    zp.setContentSize(contentW, contentH);
    // Default to fit-to-view: re-fit whenever a new layout lands, until the
    // user takes manual zoom control (a +/−/1:1 click or ctrl+wheel), after
    // which their chosen level is left alone.
    if (zp.isAutoFit()) zp.zoomToFit();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- zp fns are stable
  }, [layout, contentW, contentH]);

  /**
   * Manual node nudges, id → {dx, dy}, applied on top of ELK's placement.
   *
   * A probe, not a feature: ELK's routing choices depend on where the boxes
   * sit, and dragging one is the only way to see WHICH choice changes without
   * re-running a whole selection. Edges keep ELK's original routing, so a
   * dragged box shows its edges leaving from the old geometry — that mismatch
   * is the point (it is exactly what ELK decided, unsmoothed).
   */

  // The in-flight delta is spent once it becomes a pin; pins themselves
  // survive re-layouts of the same selection.
  useEffect(() => setNudges(new Map()), [layout]);
  // Selection changes invalidate pins: the node may not even be on canvas.
  useEffect(() => setPins(new Map()), [subgraph]);

  const placedRef = useRef<Map<string, PlacedNode>>(new Map());
  // Set when a drag actually moved something, so the click that ends the drag
  // does not also open the drawer (dragging a node popped it up in the detail
  // pane, 2026-08-20).
  const draggedRef = useRef(false);
  const nudgesRef = useRef(nudges);
  nudgesRef.current = nudges;
  const placed = useMemo(() => {
    const m = new Map((layout?.nodes ?? []).map(n => [n.id, n]));
    // A dropped pin and an in-flight drag are the same kind of offset; the
    // live one wins while the pointer is down.
    const offsets = new Map(pins);
    for (const [id, o] of nudges) offsets.set(id, o);
    for (const [id, { dx, dy }] of offsets) {
      const n = m.get(id);
      if (n) m.set(id, { ...n, x: n.x + dx, y: n.y + dy });
    }
    placedRef.current = m;
    return m;
  }, [layout, nudges, pins]);

  /**
   * Drag a node box. Pointer capture keeps the drag alive when the cursor
   * leaves the box; the delta is divided by zoom so a drag tracks the cursor
   * at any zoom level.
   */
  const startDrag = useCallback((id: string, ev: React.PointerEvent) => {
    if (ev.button !== 0) return;
    // Only drag from inert parts of the box. Starting a drag on a chip, an
    // "add all" link, a row or the × swallowed their click: pointerdown fires
    // first, and capturing the pointer here meant the later click never
    // reached them (2026-08-20).
    if ((ev.target as HTMLElement).closest('button, a, [role="button"], [data-no-drag]')) return;
    ev.stopPropagation();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const z = zp.getZoom() || 1;
    const base = nudges.get(id) ?? { dx: 0, dy: 0 };
    const el = ev.currentTarget as HTMLElement;
    el.setPointerCapture(ev.pointerId);
    let moved = false;
    const move = (e: PointerEvent) => {
      const dx = (e.clientX - startX) / z;
      const dy = (e.clientY - startY) / z;
      if (!moved && Math.hypot(dx, dy) < 3) return;  // let a click stay a click
      moved = true;
      draggedRef.current = true;
      setNudges(prev => new Map(prev).set(id, { dx: base.dx + dx, dy: base.dy + dy }));
    };
    const up = (e: PointerEvent) => {
      el.releasePointerCapture(e.pointerId);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      // Drop keeps the node where it was left. The offset persists across
      // re-layouts of the same selection, so the arrangement is yours to keep.
      if (moved) {
        const n = nudgesRef.current.get(id);
        if (n) setPins(prev => new Map(prev).set(id, n));
      }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- zp is a stable ref holder
  }, [nudges]);
  const roles = useMemo(
    () => new Map(vm.nodes.map(n => [n.id, n.role])),
    [vm],
  );
  const edgeById = useMemo(
    () => new Map(vm.edges.map(e => [e.id, e])),
    [vm],
  );

  /**
   * One arrowhead per convergence: the shared arrival point per (node, side).
   *
   * Edges do NOT carry markers of their own — N stacked markers were the blobby
   * wedge this replaces. Instead every edge in a group terminates at the CENTRE
   * OF THE BASE of a single arrowhead, which is drawn once per group (see
   * `arrowPath`). So the point recorded here is the base centre, which sits
   * ARROW_LEN further out from the border than the tip: tip at ARROW_GAP off
   * the border, base a whole arrow-length beyond that.
   *
   * `dir` is the unit vector the arrow points along (tipward). In LR that is
   * ±x with a vertical base; in TB it is ±y with a horizontal base, which is
   * what swaps the arrow's span/length axes.
   *
   * Keyed the same way buildSpec keys its fan, so a group merges iff ELK fanned
   * it. Only ENTITY-end arrivals merge — the attribute end is anchored at its
   * slot's own row and must stay there.
   *
   * ---------------------------------------------------------------------
   * Child-header arrivals do NOT merge.
   *
   * An edge from a slot_usage-narrowed slot lands on the CHILD header matching
   * its range rather than on the box header (see childHeaderTarget). Those
   * arrivals are skipped here entirely and draw their own arrowhead at their
   * own port: the ObservationSet case spreads over FOUR arrival rows — the
   * three children plus Observation itself, which carries
   * ObservationSet.observations on the parent row — with exactly one edge
   * each, so there is nothing to converge.
   *
   * That is a fact about the CURRENT schema, not an invariant: measured
   * 2026-08-31 and re-measured 2026-09-02, no member or parent of any
   * multi-child family has more than one inbound edge. `mergedEdges.test.ts`
   * asserts it. If that guard ever fails it does NOT mean the code broke — it
   * means the schema grew a second slot narrowing to the same child, the
   * no-merge shortcut no longer holds, and this map must become row-aware
   * (key on arrival row, position from the row's y instead of HEADER_H/2).
   * Do not just delete the assertion.
   *
   * The HEADER_H/2 geometry below therefore still applies only to box-header
   * arrivals, which is all that reaches it.
   * ---------------------------------------------------------------------
   */
  /**
   * Edge ids that land on a CHILD HEADER row rather than the box header.
   *
   * One set, three consumers — `mergeTargets` (must not register one), the
   * arrowhead pass and the render (must not let one JOIN a convergence). They
   * key convergence by entity, and a row-targeted edge shares that key with
   * its box-header siblings, so "skip it" has to be asked per EDGE, not per
   * key. Re-deriving the predicate at each site is how they drift apart.
   */
  const rowTargetedEdges = useMemo(() => {
    const byId = new Map(vm.nodes.map(n => [n.id, n]));
    return new Set(vm.edges.filter(e => {
      const free = byId.get(hostOf(e) === e.source ? e.target : e.source);
      return !!free && childHeaderTarget(e, free) !== undefined;
    }).map(e => e.id));
  }, [vm]);

  const mergeTargets = useMemo(() => {
    const byKey = new Map<string, MergeTarget>();
    if (!layout) return byKey;
    for (const e of vm.edges) {
      const entityId = hostOf(e) === e.source ? e.target : e.source;
      const node = placed.get(entityId);
      if (!node) continue;
      // Child-header arrivals draw their own head at their own row; they must
      // not register a box-header convergence point.
      if (rowTargetedEdges.has(e.id)) continue;
      const entityIsSource = entityId === e.source;
      const key = `${entityId}|${entityIsSource ? 'out' : 'in'}`;
      if (byKey.has(key)) continue;
      // Which BORDER the head sits on, and which way it POINTS, are separate
      // questions — conflating them drew every merged head backwards.
      //
      // Side: an edge drawn out of the entity leaves by the far border (east in
      // LR, south in TB); one drawn into it arrives at the near border.
      //
      // Direction: ALWAYS into the node. This head terminates edges landing on
      // the class, so it points at the class whichever end the edge was drawn
      // from — inward from the border it sits on, i.e. the opposite of the
      // outward offset. Hence `dir` is the negation of the side sign.
      const farSide = entityIsSource;
      const back = ARROW_GAP + ARROW_LEN;
      byKey.set(key, direction === 'RIGHT'
        ? {
            // base sits `back` OUTSIDE the border; the tip is ARROW_LEN inward
            // from there, landing ARROW_GAP off the border.
            base: {
              x: farSide ? node.x + NODE_W + back : node.x - back,
              y: node.y + HEADER_H / 2,
            },
            dir: { x: farSide ? -1 : 1, y: 0 },
          }
        : {
            base: {
              x: node.x + NODE_W / 2,
              y: farSide ? node.y + node.height + back : node.y - back,
            },
            dir: { x: 0, y: farSide ? -1 : 1 },
          });
    }
    return byKey;
  }, [vm, placed, layout, direction, rowTargetedEdges]);

  /**
   * Synthesised routes for edges touching a nudged node, id → points.
   *
   * ELK's bendpoints describe where the boxes WERE, so a dragged box leaves
   * its edges stranded. ELK cannot be re-run per frame — it is a batch
   * layouter, and it would re-place every other node, destroying the
   * comparison. React Flow's dagre/elk examples hit the same wall and answer
   * it the same way: the engine places nodes once, and edge paths are
   * recomputed from current positions on every render (their edges are
   * `SmoothStep`, which is what `smoothStepPath` reproduces).
   *
   * Only edges with a nudged endpoint are rerouted; everything else keeps
   * ELK's real routing, so the canvas stays mostly authentic.
   */
  const dragRoutes = useMemo(() => {
    const byEdge = new Map<string, Point[]>();
    const dbg = new URLSearchParams(window.location.search).has('dbg');
    const moved = new Set([...pins.keys(), ...nudges.keys()]);
    if (!layout || moved.size === 0) return byEdge;
    if (dbg) console.log(`[drag] moved: ${[...moved].join(', ')}`);
    const nodeVm = new Map(vm.nodes.map(n => [n.id, n]));
    for (const e of vm.edges) {
      const hostId = hostOf(e);
      const entityId = hostId === e.source ? e.target : e.source;
      if (!moved.has(hostId) && !moved.has(entityId)) continue;
      const host = placed.get(hostId);
      const entity = placed.get(entityId);
      const hostVm = nodeVm.get(hostId);
      if (!host || !entity || !hostVm) continue;
      const flipped = e.storageDirection === 'flipped';
      const lr = direction === 'RIGHT';
      // Attribute end: the slot's own row. Entity end: the header.
      let y: number;
      try {
        y = rowY(hostVm, e.slotName);
      } catch {
        // Row not currently displayed (collapsed node): there is no anchor to
        // route from, so the edge keeps ELK's stale route. Logged because a
        // silent skip here looks identical to "reroute is broken".
        if (dbg) console.log(`   SKIP ${hostId}.${e.slotName}: row not displayed`);
        continue;
      }
      const attrAt = lr
        ? { x: host.x + (flipped ? 0 : NODE_W), y: host.y + y }
        : { x: host.x + NODE_W / 2, y: host.y + y };
      const attrDir = lr
        ? { x: flipped ? -1 : 1, y: 0 }
        : { x: 0, y: 1 };
      // The entity end meets the near border at header height.
      const entityIsSource = entityId === e.source;
      const entAt = lr
        ? {
            x: entityIsSource ? entity.x + NODE_W : entity.x,
            y: entity.y + HEADER_H / 2,
          }
        : {
            x: entity.x + NODE_W / 2,
            y: entityIsSource ? entity.y + entity.height : entity.y,
          };
      const entDir = lr
        ? { x: entityIsSource ? 1 : -1, y: 0 }
        : { x: 0, y: entityIsSource ? 1 : -1 };
      byEdge.set(e.id, smoothStepPath(attrAt, entAt, attrDir, entDir));
      if (dbg) console.log(`   reroute ${hostId}.${e.slotName} -> ${entityId}`);
    }
    if (dbg) console.log(`[drag] rerouted ${byEdge.size} edge(s)`);
    return byEdge;
  }, [layout, nudges, pins, vm, placed, direction]);

  /**
   * TEMPORARY probe (2026-08-20): dump what ELK actually routed for each
   * convergence, so the "why is one approach a bare diagonal" question can be
   * answered from real bend points instead of inferred. Enable with ?dbg=1.
   * Remove once the diagonal is understood.
   */
  useEffect(() => {
    if (!layout || !new URLSearchParams(window.location.search).has('dbg')) return;
    const groups = new Map<string, string[]>();
    for (const e of layout.edges) {
      const spec = edgeById.get(e.id);
      if (!spec) continue;
      const pts = sectionPoints(e.sections);
      if (pts.length < 2) continue;
      const entityId = hostOf(spec) === spec.source ? spec.target : spec.source;
      // Count real direction changes, and flag a segment that is neither
      // horizontal nor vertical — a bare diagonal ELK chose not to step.
      let bends = 0;
      let diagonals = 0;
      for (let i = 1; i < pts.length; i++) {
        const dx = Math.abs(pts[i].x - pts[i - 1].x);
        const dy = Math.abs(pts[i].y - pts[i - 1].y);
        if (dx > 0.5 && dy > 0.5) diagonals++;
        if (i > 1) bends++;
      }
      const from = hostOf(spec);
      groups.set(entityId, [
        ...(groups.get(entityId) ?? []),
        `${from}.${spec.slotName}  pts=${pts.length} bends=${bends}`
        + `${diagonals ? ` DIAGONAL x${diagonals}` : ''}`
        + `  start=(${Math.round(pts[0].x)},${Math.round(pts[0].y)})`
        + ` end=(${Math.round(pts[pts.length - 1].x)},${Math.round(pts[pts.length - 1].y)})`,
      ]);
    }
    for (const [entity, lines] of groups) {
      if (lines.length < 2) continue;
      console.log(`\n=== approaches to ${entity} (${lines.length}) ===`);
      const node = placed.get(entity);
      if (node) console.log(`   box at (${Math.round(node.x)},${Math.round(node.y)}) h=${Math.round(node.height)}`);
      lines.forEach(l => console.log('   ' + l));
    }
  }, [layout, edgeById, placed]);

  /**
   * The arrowheads actually drawn: one per convergence group that has at least
   * one merging edge. A group whose edges all fall back to their own markers
   * (merge off, or flipped edges that keep their attribute-row anchor) must NOT
   * get a head here, or it would float unattached beside the node.
   *
   * Kind and dimming come from the group's edges: a mixed group renders as
   * ownership if any ownership edge arrives, since ownership is the stronger
   * signal.
   */
  const arrowheads = useMemo(() => {
    const heads = new Map<
      string,
      MergeTarget & {
        isOwn: boolean; dimmed: boolean; edgeIds: string[];
        /** Set only when EVERY edge merging into this head shares one child's
         *  P3 color. A head serving several children has no honest color and
         *  falls back to the edge kind's. */
        color?: SiblingColor;
      }
    >();
    if (!layout) return heads;
    for (const e of layout.edges) {
      const spec = edgeById.get(e.id);
      if (!spec || spec.storageDirection === 'flipped') continue;
      if (rowTargetedEdges.has(e.id)) continue;
      if (mergeDistFor(mergeMode, sectionPoints(e.sections)) <= 0) continue;
      const entityId = hostOf(spec) === spec.source ? spec.target : spec.source;
      const key = `${entityId}|${entityId === spec.source ? 'out' : 'in'}`;
      const t = mergeTargets.get(key);
      if (!t) continue;
      const isOwn = spec.type === 'ownership';
      const dimmed =
        roles.get(spec.source) === 'context' || roles.get(spec.target) === 'context';
      const color = vm.edgeColors.get(e.id);
      const prev = heads.get(key);
      heads.set(key, prev
        ? {
            ...prev,
            isOwn: prev.isOwn || isOwn,
            dimmed: prev.dimmed && dimmed,
            edgeIds: [...prev.edgeIds, e.id],
            ...(prev.color?.text === color?.text ? {} : { color: undefined }),
          }
        : { ...t, isOwn, dimmed, edgeIds: [e.id], ...(color ? { color } : {}) });
    }
    return heads;
  }, [layout, edgeById, mergeTargets, mergeMode, roles, vm, rowTargetedEdges]);

  /**
   * A row is an expand-on-demand affordance when it points at an entity that
   * isn't on the canvas yet. Plain (scalar/enum) rows have no node to add, and
   * self-loops point back at their own node, so neither is expandable.
   */
  const onCanvas = useMemo(() => new Set(vm.nodes.map(n => n.id)), [vm]);
  const isExpandable = useCallback(
    (r: RowVM) =>
      !!onAdd && r.channel !== 'plain' && !r.isLoop && !onCanvas.has(r.range),
    [onAdd, onCanvas],
  );

  // --- Hover emphasis (icd11 pattern: RAF-throttled direct DOM styling,
  // no React state, so rapid mouse movement can't cause render storms) ---
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoverRafRef = useRef<number | null>(null);
  const pendingHoverRef = useRef<{ kind: 'node' | 'edge'; id: string } | null | undefined>(undefined);
  const adjacency = useMemo(() => {
    const nodeEdges = new Map<string, string[]>();
    const edgeEnds = new Map<string, [string, string]>();
    for (const e of vm.edges) {
      edgeEnds.set(e.id, [e.source, e.target]);
      for (const nid of [e.source, e.target]) {
        nodeEdges.set(nid, [...(nodeEdges.get(nid) ?? []), e.id]);
      }
    }
    return { nodeEdges, edgeEnds };
  }, [vm]);
  const adjacencyRef = useRef(adjacency);
  adjacencyRef.current = adjacency;

  const applyHover = useCallback((target: { kind: 'node' | 'edge'; id: string } | null) => {
    pendingHoverRef.current = target;
    if (hoverRafRef.current !== null) return;
    hoverRafRef.current = requestAnimationFrame(() => {
      hoverRafRef.current = null;
      const t = pendingHoverRef.current;
      pendingHoverRef.current = undefined;
      const svg = svgRef.current;
      const wrapper = zp.wrapperRef.current;
      if (t === undefined || !svg || !wrapper) return;

      let edgeSet: Set<string> | null = null;
      let nodeSet: Set<string> | null = null;
      if (t) {
        const { nodeEdges, edgeEnds } = adjacencyRef.current;
        if (t.kind === 'node') {
          edgeSet = new Set(nodeEdges.get(t.id) ?? []);
          nodeSet = new Set([t.id]);
          for (const eid of edgeSet) {
            for (const nid of edgeEnds.get(eid) ?? []) nodeSet.add(nid);
          }
        } else {
          edgeSet = new Set([t.id]);
          nodeSet = new Set(edgeEnds.get(t.id) ?? []);
        }
      }

      svg.querySelectorAll<SVGPathElement>('path[data-edge-id]').forEach(p => {
        const id = p.dataset.edgeId ?? '';
        if (!edgeSet) {
          p.style.opacity = '';
          p.style.strokeWidth = '';
        } else if (edgeSet.has(id)) {
          p.style.opacity = '1';
          // Thicken relative to this edge's own channel, so a hovered dashed
          // reference doesn't jump to ownership weight.
          p.style.strokeWidth = String(
            p.dataset.channel === 'reference' ? STROKE_REF_HOVER : STROKE_OWN_HOVER,
          );
        } else {
          p.style.opacity = '0.38'; // [sg] changed this...needs to live in config
          p.style.strokeWidth = '';
        }
      });
      // A convergence arrowhead belongs to a GROUP of edges, so it stays lit
      // while any one of them is highlighted and dims only when none is —
      // otherwise hovering one edge of a merge left its head greyed out.
      svg.querySelectorAll<SVGPathElement>('path[data-arrowhead]').forEach(p => {
        const ids = (p.dataset.arrowhead ?? '').split(' ');
        if (!edgeSet) p.style.opacity = '';
        else p.style.opacity = ids.some(id => edgeSet.has(id)) ? '1' : '0.08';
      });
      wrapper.querySelectorAll<HTMLElement>('[data-node-id]').forEach(el => {
        const id = el.dataset.nodeId ?? '';
        el.style.opacity = !nodeSet ? '' : nodeSet.has(id) ? '1' : '0.25';
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- zp.wrapperRef is a stable ref
  }, []);

  // Clear stale inline hover styles when the graph changes under the cursor.
  useEffect(() => applyHover(null), [vm, layout, applyHover]);

  const toggleExpanded = (id: string) =>
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /*
   * A deliberate toolbar click both changes the state AND records it as this
   * browser's preference. Following a link does NOT: readExploreState only
   * reads localStorage, so a visitor who opens `?sibs=0` sees that link's
   * setting without it becoming their default for every later visit.
   */
  const setDir = (d: Direction) => { rememberPreference('dir', d); setDirection(d); };
  const setMerge = (m: MergeMode) => { rememberPreference('merge', m); setMergeMode(m); };
  const toggleSibs = () => {
    rememberPreference('sibs', !mergeSibs);
    setMergeSibs(!mergeSibs);
  };

  const attributesWord = dataService.getConceptLabel('attribute', true).toLowerCase();

  const toolBtn = (active: boolean) =>
    `px-2 py-0.5 text-xs rounded border ${active
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'}`;

  return (
    <div className="relative w-full h-full">
      {/* Toolbar */}
      <div data-pan-ignore className="absolute top-2 right-2 z-10 flex gap-1 items-center">
        {onTogglePathToRoot && (
          <>
            <button
              className={toolBtn(pathToRoot)}
              title={pathToRoot
                ? 'Hide owners: show only what you selected'
                : 'Show every owner up to the root (can pull in most of the schema)'}
              onClick={onTogglePathToRoot}
            >
              ⇱ roots
            </button>
            <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
          </>
        )}
        <button className={toolBtn(mergeSibs)}
          data-help-id="toolbar-siblings"
          title={mergeSibs
            ? 'Siblings merged: classes sharing a parent share one box'
            : 'Siblings separate: no inheritance shown'}
          onClick={toggleSibs}>⑃ siblings</button>
        <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
        <button className={toolBtn(direction === 'RIGHT')} title="Layout left to right"
          onClick={() => setDir('RIGHT')}>LR</button>
        <button className={toolBtn(direction === 'DOWN')} title="Layout top down"
          onClick={() => setDir('DOWN')}>TB</button>
        <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
        {/* Merge-point comparison — temporary, for picking one by eye. */}
        <button className={toolBtn(mergeMode === 'near')}
          title="Merge converging edges near the node (~40px)"
          onClick={() => setMerge('near')}>⋙</button>
        <button className={toolBtn(mergeMode === 'far')}
          title="Merge converging edges early (~120px)"
          onClick={() => setMerge('far')}>⋙⋙</button>
        <button className={toolBtn(mergeMode === 'bend')}
          title="Merge at ELK's last corner"
          onClick={() => setMerge('bend')}>⌙</button>
        <button className={toolBtn(mergeMode === 'off')}
          title="No merging — every edge runs to its own port"
          onClick={() => setMerge('off')}>≡</button>
        <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
        {([
          ['+', () => zp.zoomBy(1.3), 'Zoom in'],
          ['−', () => zp.zoomBy(1 / 1.3), 'Zoom out'],
          ['1:1', () => zp.applyZoom(1), 'Reset zoom'],
          ['⛶', () => zp.zoomToFit(), 'Fit to view'],
        ] as const).map(([txt, fn, title]) => (
          <button key={txt} onClick={fn} title={title} className={toolBtn(false)}>
            {txt}
          </button>
        ))}
      </div>

      {inProgress && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-400 bg-white/50 dark:bg-slate-900/50">
          Computing layout…
        </div>
      )}

      {/* Direction is published on the DOM so the help package can place the
          tour popover on the axis the diagram does NOT grow along (LR grows
          rightwards, so the popover goes below; TB grows down, so it goes
          beside). HelpLayer is host-agnostic and has no access to Explore's
          state — the same reason anchors are resolved through data attributes
          and the resolver table rather than passed as props. */}
      <div ref={zp.containerRef} data-graph-direction={direction}
           className="w-full h-full overflow-auto cursor-grab">
        <div ref={zp.spacerRef}>
          <div ref={zp.wrapperRef} className="relative">
            {layout && (
              <>
                <svg
                  ref={svgRef}
                  className="absolute top-0 left-0 pointer-events-none"
                  width={contentW}
                  height={contentH}
                >
                  {/*
                    Markers here are ONLY for edges that do not converge: an
                    edge arriving at a merge group carries no marker at all and
                    stops at the shared arrowhead's base, which is drawn once per
                    group below. Stacking a marker on every edge of a group was
                    the blobby wedge this replaces — ~6 identical heads piled up.

                    markerUnits="userSpaceOnUse": without it markers scale by
                    strokeWidth, so a 9-unit marker on a 1.8px ownership stroke
                    rendered ~16px wide. refX=0 keeps the TIP at the path's end.
                  */}
                  <defs>
                    {/* An edge that does NOT converge (merge off, or the only
                        edge of its group) still needs a head of its own. */}
                    <marker id={markerId('arrow-own')} viewBox="0 0 10 7" refX="0" refY="3.5"
                      markerWidth={ARROW_SPAN} markerHeight={ARROW_SPAN * 0.75}
                      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill={EDGE_COLORS.ownFwd} />
                    </marker>
                    {/* flipped storage: the head sits at the ATTRIBUTE end (its
                        own row, never merged) and points BACK toward the owner,
                        because the member stores the FK. */}
                    <marker id={markerId('arrow-own-back')} viewBox="0 0 10 7" refX="10" refY="3.5"
                      markerWidth={ARROW_SPAN} markerHeight={ARROW_SPAN * 0.75}
                      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                      <path d="M10,0L0,3.5L10,7Z" fill={EDGE_COLORS.ownBkwd} />
                    </marker>
                    {/* association: no ownership claim, so BOTH ends are
                        arrowed, each head pointing INTO the entity it sits next
                        to. Slate rather than the old #9ca3af, which was too
                        faint to see against the background.

                        ONE marker serves both ends: that is what
                        orient="auto-start-reverse" is for. On markerEnd its +x
                        axis runs forward along the path; on markerStart the
                        "-start-reverse" half turns it 180deg so +x runs
                        backward, out of the source node. A forward-pointing
                        glyph (tip at x=10) therefore points outward at BOTH
                        ends, and refX=0 keeps the base on the path vertex with
                        the tip overshooting into the node, exactly as for
                        arrow-own.

                        The previous arrow-assoc-start reversed twice - the
                        marker by auto-start-reverse AND the glyph by drawing
                        the tip at x=0 - so the two cancelled and the start head
                        pointed back down the edge instead of into its node. */}
                    <marker id={markerId('arrow-assoc')} viewBox="0 0 10 7" refX="0" refY="3.5"
                      markerWidth={ARROW_SPAN * REF_SCALE} markerHeight={ARROW_SPAN * 0.75 * REF_SCALE}
                      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill={EDGE_COLORS.association} />
                    </marker>
                  </defs>
                  <g transform={`translate(${PAD}, ${PAD})`}>
                    {/* The one arrowhead per convergence. Drawn before the edges
                        so a stroke that overshoots its base by a fraction of a
                        px is covered by the head rather than crossing it. */}
                    {[...arrowheads].map(([key, a]) => (
                      <path
                        key={`head-${key}`}
                        data-arrowhead={a.edgeIds.join(' ')}
                        d={arrowPath(a.base, a.dir, ARROW_SPAN, ARROW_LEN)}
                        /* Flipped edges never converge (they end at their own
                           attribute row), so a shared head is always forward. */
                        fill={a.color?.text ?? edgeKindColor(a.isOwn, false)}
                        opacity={a.dimmed ? 0.4 : 1}
                        style={{ transition: 'opacity 120ms' }}
                      />
                    ))}
                    {layout.edges.map(e => {
                      const spec = edgeById.get(e.id);
                      if (!spec) throw new Error(`Routed edge ${e.id} missing from view model`);
                      const flipped = spec.storageDirection === 'flipped';
                      // Merge the entity-end tail into the group's shared
                      // arrival point (see mergeTargets). Flipped edges end at
                      // an attribute row, which must keep its own anchor.
                      const entityId = hostOf(spec) === spec.source ? spec.target : spec.source;
                      const target = flipped || rowTargetedEdges.has(e.id)
                        ? undefined
                        : mergeTargets.get(`${entityId}|${entityId === spec.source ? 'out' : 'in'}`);
                      // A merging edge stops at the shared arrowhead's BASE and
                      // draws no head of its own, so its own tail needs no trim
                      // — mergeTail replaces it wholesale. A non-merging edge
                      // still carries a marker, so trim back far enough for the
                      // head to sit on the canvas rather than in the border.
                      // A dragged node's edges use the synthesised route; the
                      // rest keep ELK's real bendpoints.
                      const dragged = dragRoutes.get(e.id);
                      const willMerge = !!target
                        && mergeDistFor(mergeMode, dragged ?? sectionPoints(e.sections)) > 0;
                      const isAssoc = spec.type !== 'ownership';
                      const trimmedEnd = willMerge
                        ? e.sections
                        : trimSectionsEnd(
                            e.sections, ARROW_SPAN + ARROW_GAP + (flipped ? 2 : 0),
                          );
                      // Associations are arrowed at BOTH ends, so both ends
                      // need clearance from the opaque node box.
                      const sections = isAssoc
                        ? trimSectionsStart(trimmedEnd, ARROW_LEN + ARROW_GAP)
                        : trimmedEnd;
                      const pts = dragged ?? sectionPoints(sections);
                      const render = (p: Point[]) => roundedPath(p, CORNER_R);
                      const dist = mergeDistFor(mergeMode, pts);
                      const d = target && dist > 0
                        ? mergeTail(pts, target.base, dist, render)
                        : render(pts);
                      if (!d) return null;
                      const isOwn = spec.type === 'ownership';
                      const dimmed =
                        roles.get(e.source) === 'context' || roles.get(e.target) === 'context';
                      // No marker on a merged edge: the group's one arrowhead is
                      // drawn separately. Flipped edges head back at their own
                      // attribute row; references keep their smaller head.
                      const marker = willMerge
                        ? undefined
                        : isOwn ? (flipped ? 'arrow-own-back' : 'arrow-own') : 'arrow-assoc';
                      return (
                        <g key={e.id}>
                          <path
                            data-edge-id={e.id}
                            data-channel={isOwn ? 'ownership' : 'reference'}
                            d={d}
                            fill="none"
                            opacity={dimmed ? 0.4 : 1}
                            /* P3 overrides P2 on edges whose row is colored,
                               so the line can be traced back to the block it
                               leaves. The `text` step, not `fill`: a stroke is
                               ink, and a pale band tint vanishes at 1.4px. */
                            stroke={vm.edgeColors.get(e.id)?.text
                              ?? edgeKindColor(isOwn, flipped)}
                            strokeWidth={isOwn ? STROKE_OWN : STROKE_REF}
                            strokeDasharray={isOwn ? undefined : '5 4'}
                            markerEnd={marker ? `url(#${markerId(marker)})` : undefined}
                            markerStart={!isOwn && !willMerge ? `url(#${markerId('arrow-assoc')})` : undefined}
                            style={{ transition: 'opacity 120ms, stroke-width 120ms' }}
                          />
                          {/* invisible fat hit area for edge hover */}
                          <path
                            d={d}
                            fill="none"
                            stroke="transparent"
                            strokeWidth={11}
                            style={{ pointerEvents: 'stroke' }}
                            onMouseEnter={() => applyHover({ kind: 'edge', id: e.id })}
                            onMouseLeave={() => applyHover(null)}
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {vm.nodes.map(n => {
                  const p = placed.get(n.id);
                  if (!p) return null;
                  const context = n.role === 'context';
                  return (
                    <div
                      key={n.id}
                      data-node-id={n.id}
                      data-pan-ignore
                      data-pinned={pins.has(n.id) ? '' : undefined}
                      onPointerDown={ev => startDrag(n.id, ev)}
                      onDoubleClick={ev => {
                        // Double-click releases a pin, so a drag is undoable
                        // without clearing the whole selection.
                        if (!pins.has(n.id)) return;
                        ev.stopPropagation();
                        setPins(prev => {
                          const next = new Map(prev);
                          next.delete(n.id);
                          return next;
                        });
                      }}
                      onClick={() => {
                        if (draggedRef.current) { draggedRef.current = false; return; }
                        // A merged box has a synthetic id; the class it stands
                        // for is the parent it is titled by, and that is what
                        // the detail drawer must be asked for.
                        onNodeClick?.(n.members.length ? n.label : n.id);
                      }}
                      onMouseEnter={() => applyHover({ kind: 'node', id: n.id })}
                      onMouseLeave={() => applyHover(null)}
                      className={`absolute rounded-md text-xs bg-white dark:bg-slate-800 ${
                        nudges.has(n.id) ? '' : '[transition:transform_300ms,opacity_120ms]'
                      } cursor-pointer ${context
                        ? 'opacity-60 border border-dashed border-gray-400 dark:border-slate-500'
                        : pins.has(n.id)
                          ? 'border-2 border-amber-500 dark:border-amber-400 shadow-md'
                          : 'border-2 border-slate-500 dark:border-slate-400 shadow-md'}`}
                      style={{
                        width: NODE_W,
                        height: n.height,
                        transform: `translate(${p.x + PAD}px, ${p.y + PAD}px)`,
                      }}
                    >
                      <div
                        className="flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-700 dark:bg-slate-700 text-white border-b border-slate-800 dark:border-slate-600"
                        style={{ height: HEADER_H }}
                      >
                        <span className={`font-semibold truncate ${n.abstract ? 'italic' : ''}`} title={n.description || n.id}>
                          {n.label}
                        </span>
                        <span className="ml-auto flex gap-1 shrink-0">
                          {n.members.length > 0 && (
                            <span title={`${n.members.length} classes that are a ${n.label}, merged into one box`}
                              className="text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                              ⑃ {n.members.length}
                            </span>
                          )}
                          {n.isaParents.map(parent => (
                            <span key={parent} title={`is-a ${parent}`}
                              className="text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                              ⊳ {parent}
                            </span>
                          ))}
                          {/* On a MERGED box this is identical to ⑃ by
                              construction (mergeSiblings sets subclassCount =
                              members.length), so it was the same number twice
                              and cost header room the relation trigger now
                              needs. On an ordinary box it still means
                              something different — drawn is-a out-edges — so
                              it is suppressed rather than removed. */}
                          {n.subclassCount > 0 && n.members.length === 0 && (
                            <span title={`${n.subclassCount} subclasses shown`}
                              className="text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                              ▷ {n.subclassCount}
                            </span>
                          )}
                          {/*
                            Dismiss. Every box gets one now (Siggie: "Boxes
                            should also have close icons") — previously only
                            EXPANDED, unmerged nodes did, so a selected class
                            or a capped-in owner could be shown and never hidden.

                            A merged box removes every selected member at once.
                            A path-to-root context node has no ✕: it is implied
                            by the selection, so there is nothing to remove.
                          */}
                          {(() => {
                            const memberIds = n.members.length
                              ? n.members.map(m => m.id) : [n.id];
                            const selectedHere = memberIds.filter(id => selectedIds.has(id));
                            if (!selectedHere.length) return null;
                            return (
                            <button
                              data-dismiss={n.id}
                              data-help-id="node-dismiss" 
                              title={selectedHere.length > 1
                                ? `Remove all ${selectedHere.length} selected classes in ${n.label}`
                                : `Remove ${n.label} from the canvas`}
                              onClick={ev => {
                                ev.stopPropagation();
                                selectedHere.forEach(id => onRemove?.(id));
                              }}
                              className="text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
                            >
                              ✕
                            </button>
                            );
                          })()}
                        </span>
                      </div>
                      {/*
                        The relation band: a fixed-height trigger opening the
                        cascading menu, in place of the two wrapped chip strips.

                        The strips were `flex-wrap` with a height estimated in
                        JS while the browser did the real wrapping, so the band
                        ELK reserved and the band drawn diverged and the rows
                        below overlapped them (Observation, 13 owners over three
                        wrapped lines). One line, always, removes the estimate
                        from the geometry entirely -- see RELATIONS_BAND_H.

                        It also carries what the strips could not: all four
                        ownership positions instead of two, and associations,
                        which appeared in neither strip.
                      */}
                      {n.relationGroups.length > 0 && (
                        <div
                          data-help-id="relation-bar"
                          className="flex items-center gap-1 px-2 border-b overflow-hidden
                                     border-gray-200 dark:border-slate-600
                                     bg-sky-50/60 dark:bg-sky-950/30"
                          style={{ height: RELATIONS_BAND_H }}
                        >
                          <RelationBar
                            label={n.label}
                            rows={n.relationRows}
                            onAdd={id => onAdd?.(id)}
                            onRemove={id => onRemove?.(id)}
                            onInspect={onNodeClick}
                            colorOf={targetColorOf}
                          />
                        </div>
                      )}
                      {n.rows.map(r => r.header ? (
                        /* Child header: introduces the block of rows that
                           child declares. Colour is the same one its edges
                           are drawn in, so the block and its lines match. */
                        <div
                          key={r.slot}
                          data-no-drag
                          title={`${r.header.label} — is a ${n.label}; click for details`}
                          onClick={ev => { ev.stopPropagation(); onNodeClick?.(r.header!.id); }}
                          className="flex items-center px-2 text-[10px] font-semibold
                                     cursor-pointer hover:brightness-110"
                          style={{
                            height: ROW_H,
                            // `fill` is the band; its text is dark, because
                            // every fill is a pale Pastel1 tint. See
                            // SiblingColor.
                            background: r.header.color.fill,
                            color: SIBLING_HEADER_TEXT,
                          }}
                        >
                          <span className="truncate">{r.header.label}</span>
                        </div>
                      ) : (
                        <div
                          key={r.declaringClass ? `${r.declaringClass}|${r.slot}` : r.slot}
                          data-row={r.slot}
                          /* A merged box holds several rows with the same slot
                             name — the parent's and each child's override — so
                             `data-row` alone is not unique there. The declaring
                             class is what `slot-row:<Entity>.<slot>` resolves
                             against, and it is the same pair edges anchor by
                             (see `rowY`). Absent on an unmerged box, where the
                             box's own `data-node-id` already says it. */
                          data-declaring-class={r.declaringClass}
                          data-expandable={isExpandable(r) ? '' : undefined}
                          data-no-drag={isExpandable(r) ? '' : undefined}
                          title={(r.channel === 'plain'
                            ? `${r.slot}: ${r.range}`
                            : `${r.slot} → ${r.range} (${r.cardinality})${r.flipped ? ' — owner side' : ''}` +
                              (isExpandable(r) ? ` — click to add ${r.range}` : ''))
                            // A slot several children declare independently is
                            // drawn once, in the first one's colour; the rest
                            // are named here rather than by a second color.
                            + ((r.owners?.length ?? 0) > 1
                              ? `\nalso declared by ${r.owners!.slice(1).map(o => o.label).join(', ')}`
                              : '')}
                          onClick={isExpandable(r)
                            ? ev => { ev.stopPropagation(); onAdd?.(r.range); }
                            : undefined}
                          className={`flex items-center gap-1.5 px-2 text-[11px] ${
                            r.targetColor ? '' : r.connected
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'text-gray-400 dark:text-gray-500'} ${isExpandable(r)
                              ? 'cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300'
                              : ''}`}
                          style={{
                            height: ROW_H,
                            /*
                              A colored row is set in the ink of the class it
                              POINTS AT, which is also the color of that
                              class's header band and of the edge between them
                              — so the row, its destination and the line are
                              one thing.

                              `text`, not `fill`: this is ink on the box's
                              light background. The header band uses the pale
                              `fill` step of the same entry.

                              No opacity fade for unconnected rows. It was
                              0.55, and against the FULL-strength gray of the
                              plain rows beside them the colored ones read as
                              broken rather than as secondary — most of a
                              merged box's rows are unconnected, so most of its
                              color was washed out. The hollow dot already says
                              "no edge drawn", and says it without making the
                              row harder to read.
                            */
                            ...(r.targetColor
                              ? { color: r.targetColor.text }
                              : {}),
                          }}
                        >
                          {/*
                            P1: the dot is the range KIND — entity, value set,
                            data type — not the channel. The channel (ownership
                            vs association) is the EDGE's business and is
                            already said in P2 on the line itself; saying it
                            again here spent the row's one color slot on a
                            fact the reader can already see, and left "what
                            kind of thing is this?" unanswered.

                            An unconnected row is hollow rather than faint: it
                            still has a range kind, and a filled-but-dimmed dot
                            reads as a weaker version of the same thing rather
                            than as a different state.
                          */}
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0 border"
                            style={{
                              borderColor: r.rangeColor,
                              background: r.connected ? r.rangeColor : 'transparent',
                            }}
                          />
                          <span className={`truncate ${
                            // Shared (parent) rows in a merged box are bolded
                            // to read as the box's own. The gray goes with it
                            // ONLY when the row has no target color of its
                            // own, or it would override the inline color.
                            n.members.length && !r.owners?.length
                              ? `font-semibold ${r.targetColor ? '' : 'text-gray-900 dark:text-gray-100'}`
                              : ''}`}>{r.slot}</span>
                          {r.isLoop && (
                            <LoopIcon title={`self-referential: a ${r.range} can own another ${r.range} via ${r.slot}`} />
                          )}
                          {/* P1 again: the range label names the thing the dot
                              colors, so the two agree. Cardinality is not a
                              range kind and stays neutral. */}
                          <span className="ml-auto text-[9px] truncate max-w-[90px]">
                            <span style={{ color: r.rangeColor }}>{r.range}</span>
                            <span className="text-gray-400 dark:text-gray-500"> {r.cardinality}</span>
                          </span>
                        </div>
                      ))}
                      {n.hiddenCount > 0 && (
                        <button
                          className="w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline"
                          style={{ height: FOOTER_H }}
                          title={`${attributesWord} without an edge on the current canvas, plus plain (non-entity) ${attributesWord}`}
                          onClick={ev => {
                            ev.stopPropagation();
                            toggleExpanded(n.id);
                          }}
                        >
                          {n.expanded ? `− fewer ${attributesWord}` : `+ ${n.hiddenCount} more ${attributesWord}`}
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
