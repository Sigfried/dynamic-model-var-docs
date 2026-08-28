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
 * revised): the resolvers for `entity-row`, `slot-row` and friends point at
 * rows created and destroyed as the diagram redraws, and those elements do not
 * carry `data-help-id` — so a blanket `[data-help-id] { anchor-name: ... }`
 * rule would not cover them, and migrating before the anchor model settled
 * meant doing it twice.
 *
 * The previously recorded reason — "assigning per-anchor `anchor-name` from
 * script is not obviously simpler than measuring" — was weaker than it looked:
 * a single CSS rule can assign anchor names for the tagged case without any
 * script. That is not the blocker; the resolver-backed anchors are.
 *
 * **Those resolvers now exist** (S3b, 2026-08-27; `explore/helpResolvers.ts`),
 * so the sequencing reason is discharged and the migration is unblocked — it
 * is task 11 in docs/TASKS.md. What it must handle: the rows the resolvers
 * find are marked with `data-class-row` / `data-entity-row` / `data-row` /
 * `data-node-id`, so it needs anchor-name rules per attribute rather than one,
 * and `slot-row` picks its element by a PAIR of attributes, which no single
 * `anchor-name` rule expresses. The popover already uses the **Popover API**
 * for top-layer rendering, which is the part that removes the portal.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useHelp } from './helpContext';
import type { HelpAnchor } from './parseHelpContent';
import './help.css';

/**
 * Markdown link handling for every popover.
 *
 * Links in a `Description:` are references out to the LinkML schema, the BDCHM
 * docs and so on. Following one in the same tab would leave the app, and the
 * tour's state stack goes with it -- so they open in a new tab, with the
 * `noreferrer` that `target="_blank"` needs to not hand the opened page a
 * handle on this one.
 */
const MARKDOWN_COMPONENTS = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noreferrer">{children}</a>
  ),
};

export default function HelpLayer() {
  const {
    helpMode, tourIndex, position, positions, stepCount, content, activeId,
    dismissEntry, nextStep, prevStep, endTour, showEntry, resolveAnchor,
  } = useHelp();

  const inTour = tourIndex !== null;
  const entry = activeId ? content.entries.get(activeId) : undefined;

  /**
   * Resolve an anchor to its element and to where it currently sits.
   *
   * Resolution itself lives in the provider, which holds the host's resolver
   * table -- `help-id` is built in, `entity-row` and friends are dmvd's. The
   * layer only measures what comes back.
   */
  const elementFor = resolveAnchor;
  const rectOf = useCallback(
    (a: HelpAnchor | undefined) => elementFor(a)?.getBoundingClientRect() ?? null,
    [elementFor],
  );

  /**
   * What the popover points at. During a tour this is the POSITION's anchor,
   * so a beat can override its step's; outside one it is the entry's own.
   * Entries authored without `Anchor:` parse to `help-id:<own id>`, which is
   * the pre-S3a behaviour exactly.
   */
  const anchor = inTour ? position?.anchor : entry?.anchor;

  /**
   * `4.2 / 6` — step number, then beat within it, against the number of
   * STEPS. A beatless step reads plain `4`, so the sub-number appears only
   * where it means something. The denominator deliberately counts steps and
   * not positions: "4.2 / 11" would be arithmetic nobody can follow.
   */
  /*
   * The counter always counts STEPS -- `2 / 6` for the whole of step 2,
   * however many beats it has. Beat progress is shown separately as reveal
   * dots, because a fraction that mixes the two scales cannot be read: Siggie,
   * 2026-08-28, on `2.1 / 2` and `2.1 / 2.2` -- "neither of those are very
   * clear". A step number that changes meaning halfway through a step is worse
   * than a second widget.
   */
  const beatDots = () => {
    if (!position || position.beatCount === 0) return null;
    // beatIndex -1 is the opening position: nothing revealed yet.
    const revealed = position.beatIndex + 1;
    return (
      <span
        className="help-tour-dots"
        title={`Beat ${revealed} of ${position.beatCount} in this step`}
      >
        {Array.from({ length: position.beatCount }, (_, i) => (
          <span
            key={i}
            className={i < revealed ? 'help-dot help-dot-on' : 'help-dot'}
          />
        ))}
      </span>
    );
  };

  const [rect, setRect] = useState<DOMRect | null>(null);
  /** A hovered entry is transient; a clicked one stays until dismissed. */
  const [pinned, setPinned] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  /*
   * Scroll the anchor into view BEFORE measuring, or the popover lands where
   * the element used to be.
   *
   * Retried until the element turns up, not done once: a step applies its
   * `State:` and the row it points at is created by the render that state
   * causes, so at the moment this effect first runs the element frequently
   * does not exist yet. Scrolling once and giving up left row anchors
   * unscrolled and, on a long tree, off screen. Scrolls only the FIRST time
   * an anchor resolves, so the poll below cannot keep yanking the view back
   * while the viewer is reading.
   */
  const scrolledFor = useRef<Element | null>(null);
  useEffect(() => { scrolledFor.current = null; }, [activeId, anchor]);

  useLayoutEffect(() => {
    if (!activeId) { setRect(null); return; }
    const measure = () => {
      const el = elementFor(anchor);
      if (el && scrolledFor.current !== el) {
        scrolledFor.current = el;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      setRect(el?.getBoundingClientRect() ?? null);
    };
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
  }, [activeId, anchor, elementFor]);

  /*
   * Popover API: showPopover puts it in the top layer, above every z-index and
   * overflow:hidden ancestor.
   *
   * Shown whenever there is an entry to show, NOT only when its anchor
   * resolved. `Anchor: none` is a deliberate authoring choice -- step 1 uses
   * it -- and gating on `rect` made those steps show nothing at all. An
   * unresolved anchor centres the popover instead; see `popoverPosition`.
   */
  useEffect(() => {
    const el = popRef.current;
    if (!el) return;
    if (entry) {
      if (!el.matches(':popover-open')) el.showPopover();
    } else if (el.matches(':popover-open')) {
      el.hidePopover();
    }
  }, [entry]);

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
        style={popoverPosition(rect)}
      >
        {entry && (
          <>
            <h4 className="help-popover-title">{entry.title}</h4>

            {/*
              The ACTION band: what the tour just did, in its own voice.

              This is gap 1 of S3b and the bug that made Siggie misread step 2
              entirely -- the tour ticked Participant, the canvas changed, and
              the popover read as a description of whatever had appeared. It
              gets its own band, above the body and visually unlike it, because
              "what I did" and "what you are looking at" are different kinds of
              sentence and running them together is exactly the confusion.
            */}
            {inTour && position?.action && (
              <div className="help-popover-action">
                <span className="help-popover-action-mark" aria-hidden="true">✓</span>
                <div><Markdown>{position.action}</Markdown></div>
              </div>
            )}

            {/*
              In a tour the BODY is everything the position has revealed so far:
              the step's description, then each beat, oldest first. Beats ADD
              rather than replace (2026-08-28), so the earlier blocks stay on
              screen -- dimmed, with only the block that just appeared at full
              strength, which is what makes a reveal read as "and now this".

              Outside a tour it is the entry's description, unchanged: one
              block, nothing dimmed.
            */}
            {(inTour ? position?.blocks.some(Boolean) : entry.description) && (
              <div className="help-popover-body">
                {(inTour ? position!.blocks : [entry.description])
                  .map((block, i, all) => (
                    <div
                      key={i}
                      className={i === all.length - 1 ? undefined : 'help-beat-past'}
                    >
                      <Markdown components={MARKDOWN_COMPONENTS}>{block}</Markdown>
                    </div>
                  ))}
              </div>
            )}

            {/*
              Interactions, shortcut and context used to be gated on `!inTour`:
              help furniture for an element you are inspecting, which during a
              tour would bury the step's own text.
              **Ungated 2026-08-27.** With help mode switched off
              (HELP_MODE_ENABLED), `!inTour` never holds, so the gate made
              every `Interactions:`, `Shortcut:` and `Context:` in the file
              dead content — authored, parsed, tested, and rendered nowhere.
              Siggie asked why interactions appear in help but not the tour;
              the honest answer is that the tour is exactly where someone is
              learning what they can do, so withholding "here is what you can
              do here" was backwards even before the mode went away.
              If a step's popover grows too long, the fix is to shorten that
              entry, not to hide a field the author deliberately wrote.
            */}
            {entry.interactions.length > 0 && (
              <ul className="help-popover-interactions">
                {entry.interactions.map((it, i) => <li key={i}><Markdown components={MARKDOWN_COMPONENTS}>{it}</Markdown></li>)}
              </ul>
            )}
            {entry.shortcut && (
              <p className="help-popover-shortcut">Shortcut: <kbd>{entry.shortcut}</kbd></p>
            )}
            {entry.context && (
              <div className="help-popover-context"><Markdown>{entry.context}</Markdown></div>
            )}

            {/*
              There used to be a "your changes will be discarded" warning here.
              It is gone with the thing it warned about: a step no longer sets
              the whole world absolutely, so a mid-tour edit of the viewer's
              simply survives (docs/TASKS.md item 2).
            */}
            {inTour ? (
              <div className="help-tour-nav">
                <span className="help-tour-count" title={`Position ${tourIndex! + 1} of ${positions.length}`}>
                  {position?.step} / {stepCount}
                </span>
                {beatDots()}
                <span className="help-tour-spacer" />
                <button onClick={prevStep} disabled={tourIndex === 0}>← back</button>
                <button onClick={nextStep} className="help-tour-next">
                  {tourIndex! + 1 === positions.length ? 'done' : 'next →'}
                </button>
                <button onClick={endTour} title="End the tour and undo what it added">✕</button>
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
 *
 * A null rect means the anchor is `none` or did not resolve; the popover is
 * centred instead, which is what `Anchor: none` is authored to mean.
 */
function popoverPosition(r: DOMRect | null): React.CSSProperties {
  const W = 320;
  const GAP = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!r) {
    const EST_H = 260;
    return {
      left: Math.max(8, (vw - W) / 2),
      top: Math.max(8, (vh - EST_H) / 2),
      width: W,
    };
  }

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
