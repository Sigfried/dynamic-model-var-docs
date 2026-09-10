/**
 * Everything the help/tour system draws: hint dots, the popover, and the tour's
 * prev/next chrome.
 *
 * **Positioning is CSS anchor positioning** (`anchor-name` / `position-anchor`,
 * Baseline January 2026). Nothing here reads a screen position to set another
 * element's: the browser holds the anchor relationship and keeps it true through
 * scrolls, resizes and canvas relayouts, with no listener, no timer and no
 * re-render. Siggie, 2026-09-08, on why: *"finding the screen position of one
 * thing and then using that to set the position of another thing is kludgy and
 * css should make it so we don't have to do that."*
 *
 * **How the active anchor is named.** `position-anchor` names ONE anchor, but a
 * step's anchor is dynamic — whichever element `resolveAnchor` returns. So the
 * ACTIVE element is tagged `data-help-anchor` as the step changes, and one rule
 * in `help.css` gives that attribute `anchor-name: --help-anchor`; the popover
 * and the spotlight both point at `--help-anchor`.
 *
 * That is a WRITE to one element per step, not a per-frame read of positions,
 * which is why it does not reintroduce what this replaced. It is also why there
 * are no per-kind `anchor-name` rules: the element is looked up once per step by
 * its `data-help-id` and then tagged, so `help-id`, `node-box`, `slot-row` and
 * any kind a future host invents all work the same way, and `src/help/` knows
 * none of their names.
 *
 * Hint dots are the exception, and need per-element names: many are on screen at
 * once, each anchored to a different element. They get `--help-hint-<n>`, from
 * the same one write per element.
 *
 * What stays numeric here is the popover's OWN size — `autoWidth`, `navMinWidth`
 * and the `CHAR_W`/`LINE_H` metrics they share. Those are choices about how wide
 * prose should be, not measurements of anything on screen, and CSS anchoring
 * does not answer them. (`EST_H`/`estHeight`, which guessed the popover's own
 * height in order to place it, are gone: `position-try-fallbacks` and
 * `position-area` use the real one.)
 *
 * The popover also uses the **Popover API** for top-layer rendering, which is
 * what removes the portal.
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { useHelp } from './helpContext';
import { useDragged } from './useDragged';
import type { Offset, PopoverSide } from './parseHelpContent';
import TourMap from './TourMap';
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
 * The attribute that marks the CURRENT anchor, and the anchor name `help.css`
 * gives it. Paired here so the two cannot drift apart.
 *
 * One name, moved from element to element, rather than a name per element.
 * `position-anchor` takes a single `<dashed-ident>` and the step's anchor is
 * dynamic, so something has to say WHICH element is the current one; moving a
 * well-known name is one attribute write per step. The alternative -- a
 * generated `--help-<id>` on every taggable element, with the popover's
 * `position-anchor` set inline -- needs a name for elements that are looked up
 * at runtime and would put the whole scheme behind whether `position-anchor`
 * accepts `var()`. Nothing needs two popovers anchored at once, so the extra
 * generality buys nothing. (Hint dots DO need many at once; see `HINT_NAME`.)
 */
const ANCHOR_ATTR = 'data-help-anchor';

/**
 * Hint dots need the OTHER shape: a name per element, because every dot is on
 * screen at once pointing somewhere different, so there is nothing to move.
 *
 * The attribute carries the name (`data-help-hint="--help-hint-3"`) and
 * `help.css` declares one `anchor-name` rule per index. A fixed run of rules is
 * the price of `anchor-name` being a CSS value rather than something an
 * attribute can supply -- `attr()` is not usable here -- and `HINT_MAX` is that
 * run's length. It is generous: help mode shows one dot per help ENTRY whose
 * element is on screen, which is a dozen or so in practice.
 */
const HINT_ATTR = 'data-help-hint';
const HINT_NAME = '--help-hint';
const HINT_MAX = 40;

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
    showAddresses, tourName, tourMeta,
  } = useHelp();

  /*
   * The tour a step belongs to, shown before its title (TASKS 1c). Siggie,
   * 2026-09-09: *"Tour steps don't tell you what tour you're on."* `TourAbbr:`
   * in the tour's metadata replaces the full name when one is authored.
   */
  const tourLabel = tourName === undefined
    ? undefined
    : tourMeta.get(tourName)?.abbr ?? tourName;

  const [mapOpen, setMapOpen] = useState(false);

  const inTour = tourIndex !== null;
  /*
   * The map does not outlive the tour it maps. The layer stays mounted across
   * tours, so without this a map left open at exit (the ✕, `?`, "done") came
   * back up with the next tour (Siggie, 2026-09-10).
   */
  useEffect(() => { if (!inTour) setMapOpen(false); }, [inTour]);
  const entry = activeId ? content.entries.get(activeId) : undefined;

  /**
   * The popover is draggable by its title (§1b of docs/HELP_PACKAGE_PLAN.md),
   * which §1 is what made possible: nothing recomputes its position any more, so
   * a dragged coordinate has nothing to stomp it.
   *
   * RESET on every step and entry change, below. A dragged position is an answer
   * to "this one is covering the thing I want to see", and the next step points
   * somewhere else -- carrying the coordinate over would strand the popover
   * across the screen from its own anchor, with no visible cause.
   */
  const drag = useDragged();

  /**
   * Resolve an anchor to its element.
   *
   * Resolution itself lives in the provider, which is one `querySelector` for
   * the anchor's `data-help-id`. The layer only tags what comes back; where it
   * SITS is the browser's problem.
   */
  const elementFor = resolveAnchor;

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
    /* "beat" is the content file's FIELD NAME, not a word to put in front of a
       viewer (Siggie, 2026-09-08: "don't use the term 'beats'"). The dots
       count screens within the step, and the opening position is one of them
       -- hence the +1, which also makes this agree with the map's badge. */
    return (
      <span
        className="help-tour-dots"
        title={`Screen ${revealed + 1} of ${position.beatCount + 1} in this step`}
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

  /*
   * Whether the step's anchor RESOLVED -- the one bit of the old `rect` state
   * that is still anyone's business.
   *
   * `rect` carried two things: where the anchor is (now the browser's, via
   * `--help-anchor`) and whether there is one at all. Only the second is a
   * decision this component makes: an unresolved anchor means `Anchor: none`
   * or a row that is not on screen, and the popover centres instead of
   * pointing. A boolean, not a rect, because nothing here needs the numbers.
   */
  const [anchored, setAnchored] = useState(false);
  /** Preferred side for an anchored popover: `'below'` in an LR diagram, where
   *  the graph grows rightwards. Published by the tagging effect. */
  const [anchorSide, setAnchorSide] = useState<'below' | undefined>(undefined);
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
  const width = (inTour ? position?.width : undefined)
    ?? Math.max(
      autoWidth(bodyBlocks.join('\n\n')),
      inTour ? navMinWidth() : 0,
    );

  /** Whether this step has already scrolled its anchor into view. Reset when
   *  the step (or its anchor) changes, so each one scrolls exactly once. */
  const scrolled = useRef(false);
  useEffect(() => { scrolled.current = false; }, [activeId, anchor]);

  /* A dragged popover goes back to its anchor when the step or entry changes.
   * Keyed on the STEP, not on `anchor` like the scroll above: a relayout can
   * hand back a new anchor object for the same step, and snapping the popover
   * home under the reader's cursor mid-drag is exactly what that would do.
   *
   * `resetDrag` is pulled out because it is the only part of `drag` this
   * depends on -- it is a `useCallback([])`, so it never changes, while `drag`
   * itself is a new object every render. */
  const resetDrag = drag.reset;
  useEffect(() => { resetDrag(); }, [activeId, tourIndex, resetDrag]);

  /*
   * Tag the step's element as THE anchor, and scroll it into view.
   *
   * This is the one imperative line the migration keeps, and it is a WRITE to
   * one element when the step changes -- not a read of anything's position, and
   * not per frame. From here the browser owns the relationship: the popover and
   * the ring name `--help-anchor` in CSS and track it through scrolls, resizes
   * and canvas relayouts on their own.
   *
   * Doing it by ATTRIBUTE rather than by per-kind `anchor-name` rules in the
   * stylesheet is what keeps the package seam intact. The element is whatever
   * carries the anchor's own `data-help-id`, so this works identically for every
   * kind -- including any a host invents later -- without `src/help/` learning
   * one of their names.
   *
   * RE-RESOLVED as the DOM changes, not tagged once. Two things make that
   * necessary:
   *
   *  - the element often does not exist yet when this first runs. A step
   *    applies its `State:` and the row it points at is created by the render
   *    that state causes, so tagging once and giving up left row anchors
   *    untagged and, on a long tree, off screen;
   *  - a box LEAVES the document when the selection changes under the step, and
   *    a tag written on it goes with it.
   *
   * A relayout alone does NOT need re-tagging: boxes are `key={n.id}`, so React
   * moves the same element rather than replacing it.
   *
   * A `MutationObserver` rather than the timer this replaced, because the
   * question is now "has the element been replaced" -- an event the DOM
   * announces -- and not "where is it now", which was only ever answerable by
   * asking again and again. Between mutations there is nothing to do, which is
   * the difference from a poll that had to run whether or not anything moved.
   */
  useLayoutEffect(() => {
    if (!activeId) { setAnchored(false); setAnchorSide(undefined); return; }
    let tagged: Element | null = null;
    const sync = () => {
      const el = elementFor(anchor);
      if (el === tagged) return;
      tagged?.removeAttribute(ANCHOR_ATTR);
      tagged = el;
      setAnchored(!!el);
      /*
       * The preferred side is published from here rather than computed in a
       * memo, because it asks "is this element inside an LR canvas" -- a
       * question about the ELEMENT, which does not exist when a step opens: the
       * box arrives with the render the step's `Change:` causes. A memo keyed on
       * the step answered it too early and cached `undefined`.
       *
       * It is only a PREFERENCE. Nothing depends on it being right; see
       * `help.css` for the fallbacks, which is where placement is actually
       * guaranteed.
       */
      setAnchorSide(el?.closest('[data-graph-direction]')
        ?.getAttribute('data-graph-direction') === 'RIGHT' ? 'below' : undefined);
      if (!el) return;
      el.setAttribute(ANCHOR_ATTR, '');
      /*
       * Scrolled into view only the FIRST time an anchor resolves, so a
       * relayout that swaps the box out cannot keep yanking the view back
       * while the viewer is reading. Nothing waits on the scroll settling any
       * more -- the popover is attached to the element, so it travels with it
       * rather than being placed where it used to be.
       */
      if (!scrolled.current) {
        scrolled.current = true;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };
    sync();
    const obs = new MutationObserver(sync);
    /*
     * `childList` plus `data-help-id` ONLY.
     *
     * The two cases that matter are node insertions and removals: the row that
     * did not exist yet, and the box ELK replaced. The attribute filter is the
     * third: an element that stays put and RETAGS itself -- a box whose class
     * changes under it -- which `childList` alone cannot see.
     *
     * The filter is possible now because there is one universal attribute to
     * name. It used to be `childList` only, since filtering meant naming dmvd's
     * `data-node-id` / `data-class-row` in package code (see §2's seam);
     * `data-help-id` is the package's own attribute, so naming it costs nothing.
     * `ANCHOR_ATTR` is deliberately NOT in the filter -- this effect's own tag
     * write would otherwise wake it, harmless (`el === tagged` short-circuits)
     * but pointless.
     */
    obs.observe(document.body, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['data-help-id'],
    });
    return () => {
      obs.disconnect();
      tagged?.removeAttribute(ANCHOR_ATTR);
      setAnchored(false);
      setAnchorSide(undefined);
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
   * `entry`, which is set the instant the position changes, while the anchor
   * element only EXISTS a render (or a canvas relayout) after the change is
   * pushed. So the popover necessarily appeared before there was anything to
   * attach it to.
   *
   * Held hidden here until the anchor resolves, which collapses that to one
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
     * A cap, not just a did-it-resolve check. An anchor whose ARGUMENT is wrong
     * (`entity-row:Participnt`) resolves to null forever -- the known
     * untestable failure in this format -- and without the timeout that step
     * would show no popover at all, which is far worse than showing it
     * centred. Failing back to the old behaviour is the right failure.
     */
    const t = window.setTimeout(() => setChangeSettled(true), WAIT_MS);
    return () => window.clearTimeout(t);
  }, [waitsForChange, tourIndex]);
  const ready = changeSettled || anchored;

  /*
   * Popover API: showPopover puts it in the top layer, above every z-index and
   * overflow:hidden ancestor.
   *
   * Shown whenever there is an entry to show, NOT only when its anchor
   * resolved. `Anchor: none` is a deliberate authoring choice -- step 1 uses
   * it -- and gating on a resolved anchor made those steps show nothing. An
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

  /*
   * One hint per entry whose anchor is currently on screen, and a per-element
   * anchor NAME for each -- the one place a single moved name will not do,
   * since every dot is on screen at once pointing somewhere different.
   *
   * The names are positional (`--help-hint-0`, `--help-hint-1`, ...) rather
   * than derived from the entry id: `anchor-name` takes a `<dashed-ident>`, so
   * an id would have to be sanitised into one, and the index is already unique
   * across a single pass. `help.css` declares a fixed run of them, which is
   * what caps the dot count -- see `HINT_MAX` there.
   *
   * Recomputed on every render of a help-mode pass, as before. That is one
   * `querySelector` per entry, not a measurement: it asks whether the element
   * EXISTS, and the browser places the dot on it from there.
   */
  const hints = useMemo(
    () => (helpMode && !inTour
      ? [...content.entries.values()]
        .filter(e => elementFor(e.anchor))
        .slice(0, HINT_MAX)
        .map((e, i) => ({ id: e.id, title: e.title, name: `${HINT_NAME}-${i}` }))
      : []),
    [helpMode, inTour, content, elementFor],
  );

  /*
   * Is this step's anchor a box inside the canvas, and which way does the
   * diagram grow? The one input `popoverPosition` still needs about the app.
   *
   * Siggie, 2026-08-28: prefer the axis the DIAGRAM DOES NOT GROW ALONG.
   * Beside-the-anchor is the wrong default for a node box -- in LR the graph
   * grows rightwards, so a popover on the right stands exactly where the next
   * box will be laid out. Clicking `cause_of_death` on step 2 put the new box
   * under it twice running.
   *
   * Note what this is NOT: it used to ask whether the anchor's rect OVERLAPPED
   * the canvas's, which is a measurement of two elements to decide about a
   * third. The question was only ever "is this element in the canvas", and
   * `closest()` answers that from the tree -- no rects, and correct for a box
   * scrolled out of view, which the overlap test got wrong.
   */
  /* Set by the tagging effect above, which re-resolves as the DOM changes. */

  /*
   * Tag each hinted element with its dot's anchor name. Same shape as the
   * active-anchor effect above and for the same reason: a write per element
   * when the set changes, after which the browser keeps every dot on its own
   * element with no further involvement from here.
   *
   * This is what kills the STALE HINT bug rather than patching it. Dots went
   * stale because React owned their repositioning and only did it on re-render,
   * so a dot sat where its element used to be until something else re-rendered
   * the layer. A dot that is anchored does not have a position of its own to go
   * stale.
   */
  useLayoutEffect(() => {
    const tagged = hints
      .map(h => {
        const el = elementFor(content.entries.get(h.id)?.anchor);
        el?.setAttribute(HINT_ATTR, h.name);
        return el;
      })
      .filter(Boolean) as Element[];
    return () => tagged.forEach(el => el.removeAttribute(HINT_ATTR));
  }, [hints, content, elementFor]);

  return (
    <>
      {/*
        Ring around the current anchor. Without it the tour reads as a popover
        appearing in space -- Siggie: "getting no highlighting or indication of
        what's going on between steps". Drawn as a fixed overlay rather than by
        restyling the anchor, so it cannot disturb the app's own layout.

        Its whole geometry is four `anchor()`/`anchor-size()` calls in
        `help.css` -- no inline style, and nothing here to recompute. The 9999px
        scrim needs nothing either: it is painted relative to the ring's own
        box, so it follows for free.
      */}
      {anchored && activeId && highlight !== 'none' && (
        <div
          className={`help-spotlight${highlight === 'ring' ? ' help-spotlight-ring' : ''}`}
        />
      )}

      {/* Hints: one dot per tagged element, so help mode SHOWS what is
          helpable instead of relying on swapped native tooltips. */}
      {hints.map(({ id, title, name }) => {
        return (
          <button
            key={id}
            className="help-hint"
            title={title ?? id}
            /* The ONE thing the dot must say for itself: which of the declared
               hint anchors is its own. Everything else about its placement is
               in `help.css`, off this name. */
            style={{ positionAnchor: name } as React.CSSProperties}
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
        /* Scopes the anchor machinery in `help.css` -- `position-anchor` and
           `position-try-fallbacks` apply ONLY here. An unanchored step is placed
           by the inline style below, and a `--help-shift` fallback would beat
           that inline style outright. See the rule's own comment. */
        data-anchored={anchored ? '' : undefined}
        className="help-popover"
        style={{
          ...popoverPosition(anchored, inTour ? position?.position : undefined,
                             inTour ? position?.offsetX : undefined,
                             width,
                             anchored ? null : centerRect(),
                             anchorSide),
          /*
           * DRAGGED: viewport coordinates ON TOP of the ordinary placement, so
           * the width, `maxHeight` and everything else that placement decided
           * still apply -- only WHERE it sits changes.
           *
           * `positionArea: 'none'` has to go with them. Left set, the browser
           * keeps aligning the box within its anchor cell, so an explicit `left`
           * is measured from that cell and not from the viewport: the popover
           * lands somewhere other than where it was dropped. `margin: 0` and
           * `transform: none` for the same reason -- the 12px anchor gap and the
           * unanchored branch's centring translate are both offsets from a
           * placement this box no longer has.
           */
          ...(drag.offset ? {
            positionArea: 'none',
            left: drag.offset.left,
            top: drag.offset.top,
            right: 'auto',
            bottom: 'auto',
            margin: 0,
            transform: 'none',
          } : {}),
        }}
      >
        {entry && (
          <>
            {/* The title is the drag handle (§1b). It is the one element that is
                always there, always at the top, and carries no control of its
                own — and the reader's eye is already on it. */}
            <h4
              className="help-popover-title"
              onPointerDown={drag.onPointerDown}
              style={{ cursor: drag.offset ? 'grabbing' : 'grab', userSelect: 'none' }}
              title="Drag to move"
            >
              {inTour && tourLabel && (
                <span className="help-popover-tour">{tourLabel}</span>
              )}
              {entry.title}
            </h4>

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
                {/*
                  The way OUT of the tour's linear path: where am I, what is
                  coming, let me skip ahead. On the counter line because it is
                  a bigger version of the counter, and quiet because it is not
                  a step in the walk.
                */}
                <button
                  className="help-tour-map-btn"
                  onClick={() => setMapOpen(v => !v)}
                  aria-expanded={mapOpen}
                  title="Show the tour outline"
                >⊞</button>
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
      {/* Rendered beside the popover rather than inside it: it is a panel, and
          nesting it in the card is exactly the cramped thing it exists to
          avoid. Only in a tour — outside one there is no outline to show. */}
      {mapOpen && inTour && <TourMap scope="tour" onClose={() => setMapOpen(false)} />}
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
 * The width the tour's nav ROW needs, which is not a function of the text.
 *
 * `autoWidth` sizes the popover from its prose and can legitimately land on
 * the 320 floor for a one-line beat. The row underneath carries a fixed set of
 * controls — counter, reveal dots, the map ⊞, back, next, ✕ — that do not
 * shrink with the text, and at 320 it mangled: Siggie, 2026-09-08, of the
 * 11-screen `admin-study` step, *"too narrow popover mangling the status
 * line"*.
 *
 * Measured at dmvd's 16px base, the CONTROLS come to roughly 295px — they
 * just fit at 320. **It was the dots that broke it**, and that is what decides
 * the design here: the dots are the one elastic part, they WRAP
 * (`.help-tour-dots` in help.css), and the popover is not widened to keep them
 * on one line. A progress hint must not drive the layout — Siggie, same day:
 * *"i don't know about limiting the dot number. better might be to allow the
 * dots to wrap"*.
 *
 * So the floor buys the controls their room plus a short first run of dots,
 * and anything past that wraps onto a second line:
 *
 * | part | px |
 * |---|---|
 * | counter, ⊞, three buttons, gaps | 295 |
 * | popover horizontal padding | 28 |
 * | room for a first line of dots | 70 |
 *
 * (A first version added ~8px of floor per dot and capped the total at twelve.
 * Two mechanisms for one job: wrapping already handles any count, so the
 * per-dot floor only widened popovers that did not need it and the cap was an
 * arbitrary number covering for it.)
 *
 * Deliberately an ESTIMATE in the same spirit as `CHAR_W` — the real fix for
 * both is measuring, which costs a second layout pass per position. Being a
 * little generous is cheap: it only ever raises a floor, and a step whose
 * prose already wants more is untouched.
 */
export function navMinWidth(): number {
  return 295 + 28 + 70;
}

/**
 * The popover's style: its WIDTH, and either "centre it here" or "let CSS
 * anchor it".
 *
 * There is no arithmetic about the anchor left in here, because there is no
 * anchor rect to do arithmetic with. When the step has an anchor, everything
 * about where the popover goes -- which side, flipping when that side does not
 * fit, staying on screen, tracking the element through scrolls and relayouts --
 * is `position-anchor` / `position-area` / `position-try-fallbacks` in
 * `help.css`, and all this returns is the couple of values CSS cannot know:
 * how wide the author wants the box, and which side to prefer.
 *
 * The two branches are more alike than they look, and the UNANCHORED one is
 * the model: `top: 50%` plus a `-50%` translate centres on the popover's real
 * height, which the browser knows and this function does not. The anchored
 * branch now says the same kind of thing about both axes at once.
 */
export function popoverPosition(
  anchored: boolean,
  side?: PopoverSide,
  offsetX?: Offset,
  width?: number,
  region?: DOMRect | null,
  /** `'below'` when the anchor is a box in an LR diagram; see `anchorSide`. */
  growth?: 'below',
): React.CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // An authored width is capped to the viewport: a step should be able to ask
  // for a wide popover, not for one that does not fit on the screen.
  const W = Math.min(width ?? POPOVER_W, vw - 16);

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
  if (!anchored) {
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
   * Anchored. `position-area` picks the side; the rest is in `help.css`.
   *
   * An authored `Position:` beats the automatic rule (Siggie, 2026-08-28): the
   * automatic rule knows about the diagram's growth axis, and cannot know that
   * a step is about to open a menu into the space it just chose. It is still
   * only a PREFERENCE -- `position-try-fallbacks` will flip out of it rather
   * than let the popover hang off the screen, which is the same "an override
   * should be able to pick a bad side, not push it off-screen" the clamp used
   * to enforce by hand.
   *
   * `span-*` on the cross axis rather than plain `block-start` etc: it lets the
   * popover extend along the anchor from wherever it is aligned, instead of
   * being confined to the one cell beside it.
   */
  const area = side
    ? {
      right: 'inline-end span-block-end',
      left: 'inline-start span-block-end',
      top: 'block-start span-inline-end',
      bottom: 'block-end span-inline-end',
    }[side]
    /*
     * No authored side. In LR the diagram grows rightwards, so go BELOW the
     * box; otherwise beside it. `position-try-fallbacks` supplies the "and if
     * there is no room there" half that used to be an explicit `below + wantH
     * <= vh - 8` test.
     */
    : growth === 'below' ? 'block-end span-inline-end' : 'inline-end span-block-end';

  return {
    positionArea: area,
    width: W,
    ...offsetStyle(offsetX),
  } as React.CSSProperties;
}

/**
 * An authored `OffsetX:`, as a margin.
 *
 * `anchor.width * 1.3` is the form Siggie asked for and the reason the offset
 * is relative rather than a constant: every entity box is the same width, so
 * that clears one box plus a gutter and leaves room for the box the step is
 * about to add -- and it stays correct if NODE_W changes.
 *
 * `anchor-size()` states that relationship directly, where the old code had to
 * read `r.width` off a measurement to multiply it. A margin rather than an
 * adjusted `left`, because the popover no longer HAS a `left` to adjust: it is
 * placed by `position-area`, and a margin nudges it within that placement --
 * and, unlike the old code, keeps working when a fallback flips it.
 */
function offsetStyle(offsetX: Offset | undefined): React.CSSProperties {
  if (!offsetX) return {};
  const dx = 'px' in offsetX
    ? `${offsetX.px}px`
    : `calc(anchor-size(${offsetX.of}) * ${offsetX.times})`;
  return { marginLeft: dx };
}
