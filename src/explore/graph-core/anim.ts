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
export const ANIM_MS = 1000;

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
