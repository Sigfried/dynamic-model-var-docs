/**
 * One knob for every MOVEMENT animation on the graph canvas.
 *
 * The node boxes translate to their new ELK positions while the wrapper
 * rescales and the scroll container re-fits. If those three durations
 * disagree, the boxes finish sliding inside a frame that is still moving —
 * which is exactly how "the animation isn't happening" looked before
 * 2026-09-09: the boxes really were transitioning, but an INSTANT rescale of
 * their container swamped it. Keeping them on one constant makes that class
 * of mismatch unrepresentable.
 *
 * ⚠️ FADES ARE NOT MOVEMENT, and expressing them as a fraction of `ANIM_MS`
 * was a mistake (2026-09-09, corrected same day). It meant raising the move
 * duration for debugging silently stretched every fade with it, so a fade
 * could never be judged against a move — which is how the fades came to look
 * wrong. Movement and fades are set independently below.
 *
 * A third kind, not here: the 120ms hover fades (dimming, stroke-width) are
 * FEEDBACK rather than transition, want to stay quick regardless, and keep
 * their own inline literals.
 */

/**
 * Every animation duration on the graph canvas, in one place.
 *
 * ⚠️ NOTHING here may be expressed as a fraction of anything else, and no
 * duration belongs inline at a call site. Both mistakes were made and both
 * caused the same failure (2026-09-09): fades were fractions of ANIM_MS, so
 * raising the move duration to watch it silently stretched every fade too, and
 * a fade could never be judged against a move. Siggie: *"constants should
 * basically never be inline literals. i want to be able to play with those as
 * well."* Each knob below is independent and turnable on its own.
 *
 * SCOPE: the Explorer's ownership canvas. The PREVIOUS app (previous.html)
 * keeps its own timings in `src/config/appConfig.ts` under `timing` — the two
 * apps share this repo and src/, but not their animation constants, and
 * neither reads the other's.
 *
 * ONE exception to independence, and it is a real constraint rather than a
 * convenience: the three MOVEMENT durations (boxes sliding, wrapper rescaling,
 * fit scrolling) must agree, or the boxes finish sliding inside a frame that is
 * still moving. That is what "the animation isn't happening" turned out to be —
 * the boxes were transitioning under an INSTANT container rescale. They share
 * ANIM_MS for that reason.
 */

/** Boxes sliding to new positions; the wrapper rescale and fit scroll match. */
export const ANIM_MS = 3000;

/** A box fading in on arrival or out on departure. */
export const BOX_FADE_MS = 1000;

/**
 * How long an arriving box waits before it starts fading in.
 *
 * A box appearing where another is still sliding through reads as a collision,
 * so arrivals can wait for the space to be vacated. How much of the movement
 * should finish first is a judgement call to tune by eye.
 */
export const ENTER_DELAY_MS = 500;

/** An edge fading in or out. Independent of the box fade. */
export const EDGE_FADE_MS = 1000;

/**
 * How long after a new layout lands before the edges start arriving.
 *
 * ⚠️ Deliberately NOT gated on the box animation finishing. Siggie,
 * 2026-09-09: *"i want to control when they arrive -- not gated on box
 * animation finishing."* Edges cannot slide (an edge is a `d` recomputed per
 * layout, so it snaps), so this only decides WHEN the snap is revealed.
 */
export const EDGE_ARRIVE_MS = 600;

/**
 * Hover feedback: dimming a box, thickening an edge under the cursor.
 *
 * A different KIND of animation from the rest of this file — feedback on a
 * pointer, not a transition between two layouts — so it is short and does not
 * track the others. It lives here anyway because it is still a duration worth
 * being able to turn.
 */
export const HOVER_MS = 120;

/**
 * How long a layout must be pending before the canvas admits it is working.
 *
 * Siggie, 2026-09-09, on a fast machine: *"the times are still short enough
 * that i barely see the computing layout overlay, but maybe worthwhile for
 * slower machines."* So: silent for the common fast case, visible when a
 * machine or a graph is actually slow. Revisit against temp/elk-timings.jsonl.
 */
export const SPINNER_DELAY_MS = 200;

/**
 * Grace period before a faded-out box is unmounted, on top of its fade.
 *
 * A timer and a CSS transition are not the same clock; retiring the box at
 * exactly BOX_FADE_MS can cut the last frame. Not a knob worth tuning — it
 * just needs to be non-zero.
 */
export const FADE_RETIRE_SLACK_MS = 50;

/**
 * True when the OS asks for reduced motion (macOS Accessibility → Display →
 * Reduce motion, and equivalents). Read live rather than cached: the setting
 * can be toggled while the app is open, and every caller is in an effect or
 * an event handler, so there is no render to invalidate.
 *
 * Guarded for jsdom, where `matchMedia` is not implemented.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * Each duration, or 0 under reduced motion — which cuts straight to the end
 * state rather than animating toward it.
 */
const still = (ms: number) => (): number => (prefersReducedMotion() ? 0 : ms);

export const animMs = still(ANIM_MS);
export const fadeMs = still(BOX_FADE_MS);
export const enterDelayMs = still(ENTER_DELAY_MS);
export const edgeFadeMs = still(EDGE_FADE_MS);
export const edgeArriveMs = still(EDGE_ARRIVE_MS);
/** Hover feedback is not motion in the vestibular sense, so it is not stilled. */
export const hoverMs = (): number => HOVER_MS;
