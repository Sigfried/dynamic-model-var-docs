/**
 * Everything the help/tour system draws: hint dots, the popover, and the tour's
 * prev/next chrome.
 *
 * Positioning is done with `getBoundingClientRect` against the live anchor
 * rather than CSS anchor positioning. The plan prefers `anchor-name` /
 * `position-anchor` (Baseline 2026), and that is the right end state — but it
 * needs a CSS property set on each ANCHOR, and the anchors here are ordinary
 * app elements tagged only with `data-help-id`. Assigning per-anchor
 * `anchor-name` values from script is not obviously simpler than measuring, so
 * this takes the measured route and leaves the CSS-anchor migration for when
 * the package is extracted. The popover still uses the **Popover API** for
 * top-layer rendering, which is the part that removes the portal.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useHelp } from './helpContext';
import './help.css';

/** Where an anchor currently sits, or null when it is not on screen. */
function rectOf(id: string): DOMRect | null {
  const el = document.querySelector(`[data-help-id="${CSS.escape(id)}"]`);
  return el ? el.getBoundingClientRect() : null;
}

export default function HelpLayer() {
  const {
    helpMode, tourStep, steps, content, activeId, dismissEntry,
    nextStep, prevStep, endTour, showEntry,
  } = useHelp();

  const inTour = tourStep !== null;
  const entry = activeId ? content.entries.get(activeId) : undefined;
  const [rect, setRect] = useState<DOMRect | null>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // Scroll the tour's anchor into view BEFORE measuring, or the popover lands
  // where the element used to be.
  useEffect(() => {
    if (!activeId) return;
    const el = document.querySelector(`[data-help-id="${CSS.escape(activeId)}"]`);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeId]);

  useLayoutEffect(() => {
    if (!activeId) { setRect(null); return; }
    const measure = () => setRect(rectOf(activeId));
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
  }, [activeId]);

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

  const hintIds = helpMode && !inTour
    ? [...content.entries.keys()].filter(id => rectOf(id))
    : [];

  return (
    <>
      {/* Hints: one dot per tagged element, so help mode SHOWS what is
          helpable instead of relying on swapped native tooltips. */}
      {hintIds.map(id => {
        const r = rectOf(id);
        if (!r) return null;
        return (
          <button
            key={id}
            className="help-hint"
            title={content.entries.get(id)?.title ?? id}
            style={{ left: r.right - 6, top: r.top - 6 }}
            onClick={ev => { ev.stopPropagation(); showEntry(id); }}
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
                <button onClick={dismissEntry}>close</button>
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
  const GAP = 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = r.right + GAP;
  if (left + W > vw - 12) left = r.left - W - GAP;   // flip to the other side
  left = Math.max(8, Math.min(left, vw - W - 8));
  // Height is unknown before render, so clamp against a generous estimate
  // rather than measuring and re-rendering.
  const top = Math.max(8, Math.min(r.top, vh - 240));
  return { left, top, width: W };
}
