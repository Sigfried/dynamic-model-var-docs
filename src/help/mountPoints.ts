/**
 * Where a popover MOUNTS, as opposed to where it is placed.
 *
 * The popover used to live in the browser's top layer, which put it in a
 * different coordinate system from the thing it points at: a top-layer element
 * neither scales with an ancestor's transform nor scrolls with its container,
 * so a popover pointing at a node box inside a zoomed, scrollable canvas was
 * tied to that box only by CSS anchor positioning. Two coordinate systems
 * bridged by anchor positioning is the machinery that kept producing
 * surprises. See docs/BACKLOG.md §Placement.
 *
 * So the popover now mounts INSIDE whatever container holds its target, and
 * scales and scrolls with it for free. That container differs per popover, not
 * per application: `relation-bar` is inside a node box and so inside the
 * canvas; `entity-row` is on a panel and is not. A single app-level mount
 * point cannot serve both.
 *
 * THE SEAM. The package must not learn what a canvas is. So the host REGISTERS
 * candidate mount points and the package WALKS UP from the anchor element to
 * the nearest registered ancestor. All the package knows is "mount points
 * exist; find the enclosing one". A host that registers none gets the old
 * behaviour — body-level, viewport coordinates — which is also what an
 * `Anchor: none` step gets, since it has no element to walk up from.
 */

/**
 * Marks a registered SCOPE in the DOM — the container whose coordinate system
 * a popover anchored inside it should share.
 *
 * ⚠️ The scope is not the element the popover mounts INTO. A host's help layer
 * is normally a sibling of the content it overlays, not an ancestor of it (in
 * dmvd, the node boxes and the help div are both children of the zoomed
 * wrapper). So the walk-up has to find a container that ENCLOSES the anchor,
 * and the host says separately which of its children to render into. Measured
 * 2026-09-19: registering the help div itself resolved nothing, because
 * `closest()` from a node box walks straight past its sibling.
 */
export const MOUNT_ATTR = 'data-help-scope';

/** Scope element → the child to render into. */
const mounts = new Map<HTMLElement, HTMLElement>();

/**
 * Register `scope` as a container whose enclosed anchors want their popover in
 * `into` — a descendant of `scope`, typically an overlay div sharing its
 * coordinate system. Returns the unregister function, so a host can call this
 * straight from a `useEffect`.
 *
 * Passing one element for both is legitimate and means "render into the scope
 * itself". Idempotent: re-registering a scope replaces its target.
 */
export function registerMountPoint(
  scope: HTMLElement | null,
  into: HTMLElement | null = scope,
): () => void {
  if (!scope || !into) return () => {};
  mounts.set(scope, into);
  scope.setAttribute(MOUNT_ATTR, '');
  return () => {
    mounts.delete(scope);
    scope.removeAttribute(MOUNT_ATTR);
  };
}

/**
 * Where a popover anchored on `anchorEl` should mount, or null for none —
 * which means body-level, the behaviour a host that registers nothing keeps,
 * and what an `Anchor: none` step gets for want of an element to walk up from.
 *
 * `closest()` rather than comparing rects: the question is "is this element
 * inside that container", which the tree answers exactly, and which stays
 * right for a box scrolled out of view. The same reasoning is why
 * `anchorSide` asks `closest('[data-graph-direction]')`.
 */
export function mountFor(anchorEl: Element | null | undefined): HTMLElement | null {
  if (!anchorEl) return null;
  const scope = anchorEl.closest(`[${MOUNT_ATTR}]`);
  return scope instanceof HTMLElement ? mounts.get(scope) ?? null : null;
}
