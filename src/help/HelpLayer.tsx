/**
 * Everything the help/tour system draws: hint dots, the popover, and the tour's
 * prev/next chrome.
 *
 * Positioning is done with `getBoundingClientRect` against the live anchor
 * rather than CSS anchor positioning (`anchor-name` / `position-anchor`,
 * Baseline 2026). CSS anchoring remains the right end state and would delete
 * real code: the resize/scroll listeners AND the 250ms polling interval below,
 * the flip/clamp in `placePopover`, its `EST_H` *estimate* of the popover's own
 * height, and the smooth-scroll settling race.
 *
 * It is deferred for a SEQUENCING reason, not a technical one (2026-08-27,
 * revised): S3b is about to add resolvers for `entity-row`, `slot-row` and
 * friends, which point at rows created and destroyed as the diagram redraws.
 * Those elements do not carry `data-help-id`, so a blanket
 * `[data-help-id] { anchor-name: ... }` rule would not cover them, and
 * migrating positioning before the anchor model settles means doing it twice.
 *
 * The previously recorded reason — "assigning per-anchor `anchor-name` from
 * script is not obviously simpler than measuring" — was weaker than it looked:
 * a single CSS rule can assign anchor names for the tagged case without any
 * script. That is not the blocker; the resolver-backed anchors are.
 *
 * Migrate once S3b's resolvers exist. The popover already uses the **Popover
 * API** for top-layer rendering, which is the part that removes the portal.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useHelp } from './helpContext';
import type { HelpAnchor } from './parseHelpContent';
import './help.css';

/**
 * Resolve a parsed anchor to the element it points at.
 *
 * Only the built-in `help-id` kind is handled here. The dmvd-specific kinds
 * (`entity-row`, `slot-row`, ...) need host-registered resolvers, which is
 * S3b's work -- until those exist they resolve to null, which degrades to a
 * centered, unringed popover rather than a crash.
 */
function elementFor(anchor: HelpAnchor | undefined): Element | null {
  if (!anchor || anchor.kind === 'none') return null;
  if (anchor.kind === 'help-id') {
    return document.querySelector(`[data-help-id="${CSS.escape(anchor.arg)}"]`);
  }
  return null;
}

/** Where an anchor currently sits, or null when it is not on screen. */
function rectOf(anchor: HelpAnchor | undefined): DOMRect | null {
  const el = elementFor(anchor);
  return el ? el.getBoundingClientRect() : null;
}

export default function HelpLayer() {
  const {
    helpMode, tourStep, steps, content, activeId, dismissEntry,
    nextStep, prevStep, endTour, showEntry,
  } = useHelp();

  const inTour = tourStep !== null;
  const entry = activeId ? content.entries.get(activeId) : undefined;
  /**
   * What the popover points at. Taken from the entry's `Anchor:` rather than
   * from its id, so an entry's identity no longer has to double as a DOM
   * selector. Entries authored without `Anchor:` parse to `help-id:<own id>`,
   * which is the previous behaviour exactly.
   */
  const anchor = entry?.anchor;
  const [rect, setRect] = useState<DOMRect | null>(null);
  /** A hovered entry is transient; a clicked one stays until dismissed. */
  const [pinned, setPinned] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  // Scroll the tour's anchor into view BEFORE measuring, or the popover lands
  // where the element used to be.
  useEffect(() => {
    if (!activeId) return;
    elementFor(anchor)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeId, anchor]);

  useLayoutEffect(() => {
    if (!activeId) { setRect(null); return; }
    const measure = () => setRect(rectOf(anchor));
    measure();
    // The anchor moves when the canvas relayouts, the window resizes, or a
    // smooth scroll settles. Re-measuring on all three is cheaper than trying
    // to predict which one applies.
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    const t = window.setInterval(measure, 250);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      window.clearInterval(t);
    };
  }, [activeId, anchor]);

  // Popover API: showPopover puts it in the top layer, above every z-index and
  // overflow:hidden ancestor.
  useEffect(() => {
    const el = popRef.current;
    if (!el) return;
    if (entry && rect) {
      if (!el.matches(':popover-open')) el.showPopover();
    } else if (el.matches(':popover-open')) {
      el.hidePopover();
    }
  }, [entry, rect]);

  // Leaving help mode, or starting a tour, drops any pin -- otherwise a
  // previously pinned popover outlives the mode that produced it.
  useEffect(() => {
    if (!helpMode || inTour) setPinned(false);
  }, [helpMode, inTour]);

  // One hint per entry whose anchor is currently on screen. Keyed by entry id
  // but resolved through the anchor, so an entry pointing at another element
  // still gets its dot -- and an anchorless one correctly gets none.
  const hintIds = helpMode && !inTour
    ? [...content.entries.values()].filter(e => rectOf(e.anchor)).map(e => e.id)
    : [];

  return (
    <>
      {/*
        Ring around the current anchor. Without it the tour reads as a popover
        appearing in space -- Siggie: "getting no highlighting or indication of
        what's going on between steps". Drawn as a fixed overlay rather than by
        restyling the anchor, so it cannot disturb the app's own layout.
      */}
      {rect && activeId && (
        <div
          className="help-spotlight"
          style={{
            left: rect.left - 4, top: rect.top - 4,
            width: rect.width + 8, height: rect.height + 8,
          }}
        />
      )}

      {/* Hints: one dot per tagged element, so help mode SHOWS what is
          helpable instead of relying on swapped native tooltips. */}
      {hintIds.map(id => {
        const r = rectOf(content.entries.get(id)?.anchor);
        if (!r) return null;
        return (
          <button
            key={id}
            className="help-hint"
            title={content.entries.get(id)?.title ?? id}
            style={{ left: r.right - 6, top: r.top - 6 }}
            /*
             * Hover previews, click pins (Siggie: "when hovering over ? icons
             * would be nice to show popover, then click to make it stay").
             * A previewed entry is dismissed on mouse-out; a pinned one is not,
             * so moving the mouse away to read it does not close it.
             */
            onMouseEnter={() => { if (!pinned) showEntry(id); }}
            onMouseLeave={() => { if (!pinned) dismissEntry(); }}
            onClick={ev => { ev.stopPropagation(); setPinned(true); showEntry(id); }}
          >
            ?
          </button>
        );
      })}

      <div
        ref={popRef}
        popover="manual"
        data-help-popover=""
        className="help-popover"
        style={rect ? popoverPosition(rect) : undefined}
      >
        {entry && (
          <>
            <h4 className="help-popover-title">{entry.title}</h4>
            {entry.description && (
              <div className="help-popover-body"><Markdown>{entry.description}</Markdown></div>
            )}
            {entry.interactions.length > 0 && (
              <ul className="help-popover-interactions">
                {entry.interactions.map((it, i) => <li key={i}><Markdown>{it}</Markdown></li>)}
              </ul>
            )}
            {entry.shortcut && (
              <p className="help-popover-shortcut">Shortcut: <kbd>{entry.shortcut}</kbd></p>
            )}
            {entry.context && (
              <div className="help-popover-context"><Markdown>{entry.context}</Markdown></div>
            )}

            {inTour ? (
              <div className="help-tour-nav">
                <span className="help-tour-count">{tourStep! + 1} / {steps.length}</span>
                <span className="help-tour-spacer" />
                <button onClick={prevStep} disabled={tourStep === 0}>← back</button>
                <button onClick={nextStep} className="help-tour-next">
                  {tourStep! + 1 === steps.length ? 'done' : 'next →'}
                </button>
                <button onClick={endTour} title="End the tour">✕</button>
              </div>
            ) : (
              <div className="help-tour-nav">
                <span className="help-tour-spacer" />
                <button onClick={() => { setPinned(false); dismissEntry(); }}>close</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

/**
 * Place the popover beside its anchor, flipping and clamping to stay on
 * screen. Fixed positioning, so these are viewport coordinates — the same
 * frame `getBoundingClientRect` reports in.
 */
function popoverPosition(r: DOMRect): React.CSSProperties {
  const W = 320;
  const GAP = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  /*
   * Pick the side with more room, rather than defaulting to the right and
   * flipping only when it would overflow. A tall anchor on the LEFT of the
   * screen (the selection tree) left just enough room on the right for the
   * popover to fit while still covering the diagram it was describing --
   * Siggie: "in img-2 it should be on right".
   *
   * Measuring both gaps and taking the larger one puts the popover in the
   * empty half of the screen, which is where it belongs regardless of which
   * side the anchor is on.
   */
  const roomRight = vw - r.right - GAP;
  const roomLeft = r.left - GAP;
  const left = roomRight >= roomLeft
    ? Math.min(r.right + GAP, vw - W - 8)
    : Math.max(8, r.left - W - GAP);

  // Vertically: centre on the anchor where possible, so a short anchor does
  // not get a popover hanging far below it. Height is unknown before render,
  // so this uses a generous estimate rather than measuring and re-rendering.
  const EST_H = 260;
  const top = Math.max(8, Math.min(r.top + r.height / 2 - EST_H / 3, vh - EST_H));
  return { left: Math.max(8, left), top, width: W };
}
