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

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useHelp } from './helpContext';
import type { HelpAnchor, Offset, PopoverSide } from './parseHelpContent';
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
  /**
   * A markdown blockquote is the popover's ALERT.
   *
   * Chosen over a new `Alert:` entry field on purpose: an alert is a bit of a
   * step's prose, not a property of the step, so it has to be placeable
   * *within* a description or a beat -- before the text, after it, or as the
   * whole of it. A field can only ever sit in one fixed slot, and every beat
   * would have needed its own copy of the field to say anything urgent.
   * `>` costs the author one character and works in every markdown block the
   * popover renders.
   *
   * Styled unlike the `Action:` band, which is also a tinted rule-left box:
   * that one is the tour reporting what it just did to the app, this one is
   * the tour telling you something you need to know. Amber vs. blue, and a
   * `!` rather than a `✓`.
   */
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <div className="help-popover-alert" role="note">
      <span className="help-popover-alert-mark" aria-hidden="true">!</span>
      <div>{children}</div>
    </div>
  ),
};

/**
 * localStorage, defensively.
 *
 * Duplicated from `explore/exploreState.ts` rather than imported: `src/help/`
 * is written to be liftable into its own package (see the header of
 * `help.css`, which is plain CSS for the same reason), and a two-line helper
 * is a cheaper dependency to keep than a cross-package import. It can throw in
 * private mode or with site data disabled, and a dismissed-note preference is
 * never worth breaking a popover over.
 */
function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* best-effort */ }
}

/** Namespace for `Once:` keys, so a help preference is identifiable in a
 *  storage inspector and cannot collide with the app's own `bdchm-*`. */
const ONCE_PREFIX = 'help-once-';

/**
 * Drop every blockquote line from a markdown block.
 *
 * How a dismissed `Once:` alert stops appearing. Done on the TEXT rather than
 * by rendering nothing from the `blockquote` component, because react-markdown
 * would still have parsed the quote and the surrounding paragraphs would be
 * left with the alert's blank-line separators around a hole. Removing the
 * lines first leaves a block that reads as though the alert had never been
 * written.
 *
 * Blockquote continuation ("lazy") lines are NOT handled: a quote whose second
 * line omits its `>` would leave that line behind. The spec tells authors to
 * prefix every line, and the test pins that.
 */
export function stripAlerts(block: string): string {
  return block
    .split('\n')
    .filter(line => !/^\s{0,3}>/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function isDismissedOnce(key: string): boolean {
  return lsGet(ONCE_PREFIX + key) === '1';
}
export function dismissOnce(key: string): void {
  lsSet(ONCE_PREFIX + key, '1');
}

/**
 * The markdown component table for an entry that carries `Once:`.
 *
 * Same as the default, except every alert grows a "Don't show this again"
 * checkbox. Built per entry rather than at module scope because the storage
 * key and the dismiss callback are both per entry — the alternative was a
 * context just to thread two values through react-markdown, which is more
 * machinery than one `useMemo`.
 */
function markdownComponentsWithOnce(onDismiss: () => void) {
  return {
    ...MARKDOWN_COMPONENTS,
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <div className="help-popover-alert" role="note">
        <span className="help-popover-alert-mark" aria-hidden="true">!</span>
        <div>
          {children}
          {/*
            An explicit control, not a silent show-once counter. Silent is
            worse in both directions: a viewer who wanted to reread the note
            cannot get it back, and one who never read it has already spent
            their single showing. A checkbox says what is about to happen and
            leaves the choice with them.
          */}
          <label className="help-popover-alert-once">
            <input type="checkbox" onChange={onDismiss} />
            Don't show this again
          </label>
        </div>
      </div>
    ),
  };
}

export default function HelpLayer() {
  const {
    helpMode, tourIndex, position, positions, stepCount, content, activeId,
    dismissEntry, nextStep, prevStep, endTour, showEntry, resolveAnchor, centerRect,
    showAddresses,
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
  /*
   * `Highlight: none` still RESOLVES the anchor -- it only stops it being
   * drawn. That is the point of the field: the anchor keeps positioning the
   * popover while the step declines to seize the element visually. Only the
   * tour honours it; help mode's job is to point at things.
   */
  const highlight = (inTour ? position?.highlight : entry?.highlight) ?? 'dim';

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
   * `Once:` — an entry whose alerts the viewer may put away for good.
   *
   * Read at render, not once at mount, because the key is the entry's and the
   * entry changes as the tour moves. The counter is the re-render trigger and
   * nothing else -- hence the discarded value: the checkbox writes to
   * localStorage, which React cannot observe, so ticking it has to bump some
   * state for the alert to actually disappear.
   */
  const [, setOnceTick] = useState(0);
  const onceKey = entry?.once;
  const onceDone = onceKey !== undefined && isDismissedOnce(onceKey);
  const markdownComponents = useMemo(
    () => (onceKey === undefined ? MARKDOWN_COMPONENTS : markdownComponentsWithOnce(() => {
      dismissOnce(onceKey);
      setOnceTick(n => n + 1);
    })),
    // onceTick is a dependency in spirit: after a dismissal the table is dead
    // anyway, since `onceDone` strips the alert before it can render.
    [onceKey],
  );

  /*
   * The blocks the body will render, resolved ONCE so the width and the render
   * cannot disagree about what is showing. A dismissed `Once:` alert is
   * stripped here as it is there — a step whose text is mostly a note the
   * reader has already dismissed should not keep that note's width.
   */
  const bodyBlocks = (inTour ? position?.blocks ?? [] : [entry?.description ?? ''])
    .map(b => (onceDone ? stripAlerts(b) : b))
    .filter(Boolean);

  /*
   * `Width:` wins; otherwise the width follows the text. An authored width is
   * a deliberate statement about the picture the step is building (and is
   * sticky across beats), so it is never second-guessed here.
   */
  const width = (inTour ? position?.width : undefined) ?? autoWidth(bodyBlocks.join('\n\n'));

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
   * Wait for a step's `Change:` to land before showing the popover.
   *
   * The visible bug (Siggie, 2026-08-28): on a step that ticks something, the
   * popover appeared FIRST -- centred, because its anchor did not exist yet --
   * then the checkbox and the Person box appeared, then the popover jumped to
   * the box. Three separate movements for one `next`.
   *
   * The cause is the order the effects run in: `showPopover` is gated on
   * `entry`, which is set the instant the position changes, while `rect` is
   * only filled in once the anchor element EXISTS, which takes the app a
   * render (or a canvas relayout) after the change is pushed. So the popover
   * necessarily rendered against a stale measurement.
   *
   * Held hidden here until `rect` arrives, which collapses that to one
   * movement: the app changes, then the popover appears where it belongs.
   *
   * **Narrowly scoped, on purpose.** Only a position that both pushes a
   * `Change:` and names a resolvable anchor waits at all. `Anchor: none` (step
   * 1) and any step whose anchor is already on screen show immediately, as
   * they always did -- there is nothing to wait for, and a blanket delay would
   * put lag on every `next` in the tour to fix the few that need it.
   *
   * Siggie's ideal is a staged reveal -- checkbox, then 250ms, then the box,
   * then the popover -- which needs the Person box's appearance detached from
   * the checkbox state. Explicitly deferred as too much work for now; this is
   * the part of it that does not need that refactor.
   */
  const WAIT_MS = 600;
  const waitsForChange = inTour
    && position?.change != null
    && anchor !== undefined
    && anchor.kind !== 'none';
  const [changeSettled, setChangeSettled] = useState(false);
  useEffect(() => {
    if (!waitsForChange) { setChangeSettled(true); return; }
    setChangeSettled(false);
    /*
     * A cap, not just a rect check. An anchor whose ARGUMENT is wrong
     * (`entity-row:Participnt`) resolves to null forever -- the known
     * untestable failure in this format -- and without the timeout that step
     * would show no popover at all, which is far worse than showing it
     * centred. Failing back to the old behaviour is the right failure.
     */
    const t = window.setTimeout(() => setChangeSettled(true), WAIT_MS);
    return () => window.clearTimeout(t);
  }, [waitsForChange, tourIndex]);
  const ready = changeSettled || rect !== null;

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
    if (entry && ready) {
      if (!el.matches(':popover-open')) el.showPopover();
    } else if (el.matches(':popover-open')) {
      el.hidePopover();
    }
  }, [entry, ready]);

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
      {rect && activeId && highlight !== 'none' && (
        <div
          className={`help-spotlight${highlight === 'ring' ? ' help-spotlight-ring' : ''}`}
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
        /* `bodyBlocks` feeds BOTH the width and the height estimate: they are
           the same question asked twice, and answering them from different
           text would place the popover for a size it never has. */
        style={popoverPosition(rect, inTour ? position?.position : undefined,
                               inTour ? position?.offsetX : undefined,
                               width,
                               rect ? null : centerRect(),
                               bodyBlocks.join('\n\n'))}
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
              AUTHORING WARNING, dev-only, shown on the same switch as the
              content ids (`showAddresses`).
              *
              A step that changes the canvas without an `Action:` is the bug
              this format exists to fix, but it used to be enforced ONLY by a
              test — so an author working in the app hit it at commit time,
              away from the step they were writing. Here it is attached to the
              popover that has the problem, while they are looking at it.
              *
              An EMPTY change is exempt: it draws nothing, so there is no
              transition to narrate. See `helpContent.test.ts`, which encodes
              the same rule, and delete both together if the rule goes.
            */}
            {inTour && showAddresses && position?.change && !position.action && (
              <div className="help-popover-action" style={{ opacity: 0.85 }}>
                <span className="help-popover-action-mark" aria-hidden="true">⚠</span>
                <div>
                  <em>Authoring:</em> this position changes the app
                  (<code>{position.change}</code>) but has no <code>Action:</code>.
                </div>
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
            {bodyBlocks.length > 0 && (
              <div className="help-popover-body">
                {/* Resolved above, next to the width that was measured from it:
                    alerts already stripped if `Once:` was dismissed, and empty
                    blocks already dropped — a block that was NOTHING BUT a
                    dismissed alert would otherwise leave a dimmed blank gap
                    where the note used to be. */}
                {bodyBlocks
                  /*
                   * Beats REPLACE by default, so `all` is usually one block
                   * and nothing is dimmed. Only a `Keep: true` beat produces
                   * more than one, and there the earlier blocks dim so the
                   * reader can see which part just arrived.
                   */
                  .map((block, i, all) => (
                    <div
                      key={i}
                      className={i === all.length - 1 ? undefined : 'help-beat-past'}
                    >
                      <Markdown components={markdownComponents}>{block}</Markdown>
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
                {/*
                  The keyboard bindings are announced HERE because nothing else
                  announces them. `←` / `→` / `Esc` have all worked since the
                  tour shipped (see the keydown handler in HelpProvider), but a
                  viewer had no way to find that out -- the buttons looked like
                  the only way to move.
                */}
                <button
                  onClick={prevStep}
                  disabled={tourIndex === 0}
                  title="Previous (← arrow key)"
                >← back</button>
                <button onClick={nextStep} className="help-tour-next" title="Next (→ arrow key)">
                  {tourIndex! + 1 === positions.length ? 'done' : 'next →'}
                </button>
                <button onClick={endTour} title="End the tour and undo what it added (Esc)">✕</button>
              </div>
            ) : (
              <div className="help-tour-nav">
                <span className="help-tour-spacer" />
                <button onClick={() => { setPinned(false); dismissEntry(); }}>close</button>
              </div>
            )}

            {/*
              TEMPORARY authoring aid (docs/TASKS.md item 3c) -- where this
              popover is WRITTEN, so an author who sees something wrong on
              screen can find the block that produced it. Off unless the Help
              menu's `Show content ids` is on, and that item only exists in a
              dev build (`ADDRESS_TOGGLE_ENABLED`).

              Outside a tour the address is just the entry's own id: a
              help-only entry is one `###` block with no beats.

              Delete this along with the rest of the toggle once the tours are
              written.
            */}
            {showAddresses && (
              <AddressTag
                address={inTour ? position?.address : entry.id}
                searchFor={inTour ? position?.searchFor : `### ${entry.id}`}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

/**
 * TEMPORARY authoring aid (docs/TASKS.md item 3c): the popover's address in
 * help-content.md, click-to-copy.
 *
 * It SHOWS the address (`relationship-kinds \u25b82`) and COPIES the markdown
 * header (`### relationship-kinds`) -- different strings for different jobs.
 * The shown one carries the beat ordinal, which is what tells you where you
 * are; the copied one is what pastes into a file search and matches exactly
 * one line. A bare `relationship-kinds` would also hit every prose mention of
 * it, and appending the ordinal would match nothing at all.
 *
 * Siggie, 2026-09-07, on both halves: *"just give me the beat number. it's
 * easy enough to count the beat bullets by eye"*, and *"what you should copy
 * to clipboard, say for id==entities is `### entities`"*.
 *
 * `navigator.clipboard` is absent on an insecure origin and can reject when
 * the document is not focused, so the failure is swallowed and the tag simply
 * does not confirm. Selecting the text by hand still works either way.
 *
 * Delete this with the rest of the toggle once the tours are written.
 */
function AddressTag({ address, searchFor }: {
  address: string | undefined;
  searchFor: string | undefined;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  if (!address || !searchFor) return null;
  return (
    <button
      type="button"
      className="help-popover-address"
      title={`Copy \u201c${searchFor}\u201d \u2014 search help-content.md for it`}
      onClick={() => {
        navigator.clipboard?.writeText(searchFor).then(
          () => setCopied(true),
          () => { /* insecure origin or unfocused document: no confirmation */ },
        );
      }}
    >
      {address}{copied ? ' \u2713' : ''}
    </button>
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
/**
 * Default popover width, used only when nothing better can be worked out —
 * a step with no text at all. `Width:` overrides it, and so does `autoWidth`.
 */
const POPOVER_W = 320;

/**
 * The band `autoWidth` picks from.
 *
 * The floor is the OLD flat default, deliberately: auto width replaces a
 * constant 320, and a step that used to get 320 must not come out narrower
 * than it was. 800 is the widest any authored step asks for.
 *
 * (300 was tried as the floor first. Every existing unauthored step is short
 * enough to land on the floor, so it just narrowed all fifteen of them —
 * a change with no upside.)
 */
const AUTO_MIN = 320;
const AUTO_MAX = 800;

/**
 * Rough px of horizontal room one character of body text occupies, and the
 * line height that goes with it.
 *
 * Sized for the ~16px body dmvd actually renders (`--help-font-size` in
 * `explore/helpTheme.css`), not the package's 13px default: a lowercase
 * average runs a bit over half the em. A host that sets a very different
 * font size gets a proportionally wrong estimate — acceptable, because these
 * only ever feed a CLAMPED square root, so being off by a fifth moves the
 * result by a tenth and the floor and ceiling absorb the rest. Measuring the
 * real text would mean rendering it twice and a layout pass per beat.
 */
const CHAR_W = 8;
const LINE_H = 24;
/**
 * Wideness knob: how much wider than tall the text block is aimed to be.
 *
 * Tuned against the resulting HEIGHT rather than by eye, since height is the
 * thing that actually goes wrong, and then against LINE COUNT once real model
 * descriptions started arriving.
 *
 * Raised from 2.0 to 3.0 on 2026-09-08 (Siggie, of a 435-character class
 * description: "i think that popover should have been wider anyway"). At 2.0
 * that paragraph got a 409px column and ran to ten lines — a narrow, tall
 * block for one paragraph of prose. At 3.0 it is 501px and eight lines, while
 * the short authored beats are untouched: they were already sitting on the 320
 * floor and stay there (17 of the 33 real blocks measured, against 20 at 2.0).
 *
 * 1.2 was the first attempt and far too timid; 4.0+ starts widening text short
 * enough not to need it.
 */
const ASPECT = 3.0;

/**
 * Pick a width from how much text there is.
 *
 * **Why area rather than length buckets.** The popover's real problem is
 * HEIGHT: text that overflows gets clamped by `maxHeight` and scrolls, or
 * shoves the popover away from the thing it is pointing at. Width is the only
 * lever that trades height away. So the question is not "is this text long"
 * but "how wide must this be to stay under a sane height", which is an area
 * problem: `chars × CHAR_W × LINE_H` is roughly the area the text needs, and
 * for a box of that area with aspect ratio `ASPECT` the width is its square
 * root. That is smooth — one character more never jumps the width 150px the
 * way a bucket boundary does — and it has one tunable instead of three
 * thresholds.
 *
 * **Markdown is counted, not stripped.** Syntax characters (`**`, `- `, `|`)
 * cost width in a table or a list even though they are not rendered as text,
 * so counting them is closer to right than not, and stripping markdown here
 * would mean parsing it twice.
 *
 * **Beats are not smoothed.** With `Keep:` the blocks grow as beats reveal, so
 * this recomputes and the popover can widen mid-step. Deliberate for now
 * (Siggie, 2026-09-08: "let's see how it works without worrying about width
 * changes across beats"); if it reads as jumpy the fix is to take the max over
 * the step's positions rather than to reintroduce buckets.
 */
export function autoWidth(text: string): number {
  const chars = text.trim().length;
  if (chars === 0) return POPOVER_W;
  return Math.round(
    Math.min(AUTO_MAX, Math.max(AUTO_MIN, Math.sqrt(chars * CHAR_W * LINE_H * ASPECT))),
  );
}

/**
 * Roughly how tall the popover will be, at a given width.
 *
 * Used ONLY to decide placement — whether there is room below a box, and how
 * far up a low-anchored popover has to slide to fit. The browser still does
 * the real layout, and `maxHeight` still catches whatever this gets wrong.
 *
 * The same character metrics as `autoWidth`, plus a fixed allowance for the
 * furniture every popover carries whatever its text: title, the tour's
 * back/next row, and the padding around both. Without it a one-line step
 * estimates at ~24px and reads as fitting anywhere.
 */
const CHROME_H = 130;

export function estHeight(text: string, width: number): number {
  const chars = text.trim().length;
  const lines = Math.ceil((chars * CHAR_W) / Math.max(1, width - 40));
  return CHROME_H + lines * LINE_H;
}

export function popoverPosition(
  r: DOMRect | null,
  side?: PopoverSide,
  offsetX?: Offset,
  width?: number,
  region?: DOMRect | null,
  /** The text the popover will show, for estimating its height. See `onScreen`. */
  text = '',
): React.CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // An authored width is capped to the viewport: a step should be able to ask
  // for a wide popover, not for one that does not fit on the screen.
  const W = Math.min(width ?? POPOVER_W, vw - 16);
  const GAP = 12;

  /*
   * No anchor: centre it, BOTH ways.
   *
   * This used to subtract a hardcoded `EST_H = 260` from the viewport height,
   * which is only correct for a popover that happens to be 260px tall. The
   * tour's intro step is nearer 670 and sat visibly low (Siggie, 2026-08-28).
   *
   * A `-50%` translate centres on the popover's REAL height, which the browser
   * knows and this function does not — no measurement, no re-render, exact at
   * any height. `maxHeight` keeps a very tall one on screen, and the body
   * scrolls inside it.
   *
   * Centred on the HOST'S REGION when it named one (`centerOn`), not the
   * viewport: an unanchored step centred on the whole window sits half over
   * the left panel, which is usually what the step is talking about. Falls
   * back to the viewport when no region is named or it is not mounted.
   */
  if (!r) {
    const box = region ?? new DOMRect(0, 0, vw, vh);
    /*
     * Clamped to the VIEWPORT, not to the region. A narrow region would
     * otherwise push a wide popover off-screen, and a popover taller than the
     * region should overflow it rather than be squeezed — the region says
     * where to centre, not how big the popover may be.
     */
    const cx = box.left + box.width / 2;
    /*
     * Vertically the region is IGNORED and the viewport's midline used.
     *
     * The popover's height is unknown here — that is what the `-50%` translate
     * buys — so a centre near the top or bottom of a short region cannot be
     * clamped without it. The viewport midline is the one line that is safe at
     * every height, and the panels this centres over are full-height anyway,
     * so their midline IS the viewport's. Horizontal is where the difference
     * actually lay.
     */
    return {
      left: Math.max(8, Math.min(cx - W / 2, vw - W - 8)),
      top: '50%',
      transform: 'translateY(-50%)',
      maxHeight: `${vh - 16}px`,
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
  /*
   * A GUESS at the popover's height, used only to CHOOSE between placements —
   * "is there room below this box", "roughly centre on the anchor". It is not
   * a promise about the height, and nothing may clamp to it as though it were:
   * that was the bug (Siggie, 2026-09-08, "popover getting cut off again").
   *
   * A step whose text comes from the model can be far taller than any constant
   * — `{{model-description:ResearchStudy}}` alone is a 400-character paragraph
   * — and clamping `top` to `vh - EST_H` reserved 260px for a popover needing
   * 500, so the rest hung off the bottom of the screen with no `maxHeight` to
   * stop it. The unanchored branch above never had this problem because it
   * sets `maxHeight` and lets the browser size the box.
   */
  const EST_H = 260;

  /*
   * What this particular popover is likely to need, rather than the constant.
   * Falls back to `EST_H` when the caller passes no text — every existing
   * caller in a test does, and their expectations should not move.
   */
  const wantH = text ? estHeight(text, W) : EST_H;

  /**
   * Finish an anchored placement: keep it on screen vertically, and CAP its
   * height so a tall popover scrolls inside itself instead of off the bottom.
   *
   * The height is genuinely unknown here — that is the whole reason `EST_H` is
   * a guess — so rather than clamp against a made-up number this gives the
   * popover all the room between its top and the bottom margin. The browser
   * then sizes it: short popovers are unaffected, and only one that really is
   * too tall starts scrolling.
   *
   * `top` is still pulled up when it sits below the fold, so a popover anchored
   * to something near the bottom does not start at `vh - 8` with 8px to live
   * in. `MIN_H` is the least it may be squeezed to before it is moved up
   * instead.
   */
  const onScreen = (
    style: { left: number; top: number; width: number },
    /*
     * Roughly how tall this popover wants to be. Estimated from the TEXT, the
     * same way `autoWidth` picks the width, because the two questions are the
     * same one asked twice: at width `W`, this much text takes about this many
     * lines. Still an estimate — the browser does the real layout — but an
     * estimate that TRACKS the content instead of a constant that does not.
     */
    wantH = EST_H,
  ) => {
    /*
     * Move it UP to fit before squeezing it.
     *
     * Clamping alone put a 500px popover at `top: 712` in a 900px viewport and
     * capped it to 180px — a sliver, with two thirds of the screen empty above
     * it. A tall popover anchored low should slide up the screen; only one
     * that cannot fit anywhere gets capped.
     */
    const room = vh - 16;
    const top = Math.max(8, Math.min(style.top, vh - Math.min(wantH, room) - 8));
    return { ...style, top, maxHeight: `${vh - top - 8}px` };
  };

  /*
   * Prefer the axis the DIAGRAM DOES NOT GROW ALONG (Siggie, 2026-08-28).
   *
   * Beside-the-anchor is the wrong default when the anchor is a node box: in
   * LR the graph grows rightwards, so the popover sitting on the right is
   * standing exactly where the next box will be laid out. Clicking
   * `cause_of_death` on step 2 put the new box under it twice running, once
   * from a clean start.
   *
   * So in LR the popover goes BELOW the box and in TB it goes BESIDE it —
   * across the growth axis either way. This only applies when the anchor is
   * inside the canvas; the selection tree and toolbar are not laid out by ELK
   * and keep the beside-with-more-room rule that was chosen for them.
   */
  /*
   * An authored `Position:` beats every automatic rule below (Siggie,
   * 2026-08-28). The automatic rules are about the diagram's growth axis and
   * the emptier half of the viewport; neither can know that a step is about to
   * open a menu into the space it just chose. This is the escape hatch for
   * that, and it is still CLAMPED to the viewport -- an override should be
   * able to pick a bad side, not push the popover off-screen.
   */
  if (side) {
    const place = {
      right: { left: r.right + GAP, top: r.top },
      left: { left: r.left - W - GAP, top: r.top },
      bottom: { left: r.left, top: r.bottom + GAP },
      top: { left: r.left, top: r.top - EST_H - GAP },
    }[side];
    return withOffset(onScreen({
      left: Math.max(8, Math.min(place.left, vw - W - 8)),
      top: place.top,
      width: W,
    }, wantH), r, offsetX, vw);
  }

  const canvas = document.querySelector('[data-graph-direction]');
  const dir = canvas?.getAttribute('data-graph-direction');
  const inCanvas = !!canvas && overlaps(r, canvas.getBoundingClientRect());

  if (inCanvas && dir === 'RIGHT') {
    // Below the box, left-aligned with it, both clamped on screen.
    const below = r.bottom + GAP;
    // No room underneath (a box near the bottom) — fall through to beside.
    if (below + wantH <= vh - 8) {
      return withOffset(onScreen({
        left: Math.max(8, Math.min(r.left, vw - W - 8)),
        top: below,
        width: W,
      }, wantH), r, offsetX, vw);
    }
  }

  const roomRight = vw - r.right - GAP;
  const roomLeft = r.left - GAP;
  const left = roomRight >= roomLeft
    ? Math.min(r.right + GAP, vw - W - 8)
    : Math.max(8, r.left - W - GAP);

  // Vertically: centre on the anchor where possible, so a short anchor does
  // not get a popover hanging far below it. Height is unknown before render,
  // so this uses a generous estimate rather than measuring and re-rendering.
  const top = r.top + r.height / 2 - EST_H / 3;
  return withOffset(onScreen({ left: Math.max(8, left), top, width: W }, wantH), r, offsetX, vw);
}

/**
 * Apply an authored `OffsetX:` to a placement, re-clamping afterwards.
 *
 * `anchor.width * 1.3` is the form Siggie asked for and the reason the offset
 * is relative rather than a constant: every entity box is the same width, so
 * that clears one box plus a gutter and leaves room for the box the step is
 * about to add -- and it stays correct if NODE_W changes.
 */
function withOffset(
  style: { left: number; top: number; width: number },
  r: DOMRect,
  offsetX: Offset | undefined,
  vw: number,
): React.CSSProperties {
  if (!offsetX) return style;
  const dx = 'px' in offsetX
    ? offsetX.px
    : (offsetX.of === 'width' ? r.width : r.height) * offsetX.times;
  return { ...style, left: Math.max(8, Math.min(style.left + dx, vw - style.width - 8)) };
}

/** Do two viewport rects intersect at all? */
function overlaps(a: DOMRect, b: DOMRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
