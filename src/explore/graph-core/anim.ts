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
 * Fades (hover dimming, opacity) are deliberately NOT on this knob — they are
 * feedback, not movement, and want to stay quick regardless.
 */

/** Currently raised for debugging; production value is 300. */
export const ANIM_MS = 3000;

/**
 * Fades, as a fraction of `ANIM_MS`. Edges and departing boxes use this.
 * Short on purpose: a box that is leaving should clear the space the staying
 * boxes are moving into, rather than lingering translucently on top of them.
 */
export const FADE_FRACTION = 0.1;

/**
 * How long an ARRIVING box waits before fading in, as a fraction of `ANIM_MS`.
 *
 * 1 means "after the movers have arrived". A box appearing in a spot that
 * another box is still sliding through reads as a collision, so entering boxes
 * wait for the space to be vacated. Tune by eye — this is a judgement call, not
 * a derived number.
 */
export const ENTER_DELAY_FRACTION = .1;

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

/** `ANIM_MS`, or 0 when the user has asked for reduced motion. */
export const animMs = (): number => (prefersReducedMotion() ? 0 : ANIM_MS);
