/** Longest hold, in px, that a hero sample card may be offset from its layout slot. */
export const HOLD_LIMIT = 320;
/** Below this the effect is invisible, so it is switched off rather than half-done. */
export const HOLD_MINIMUM = 24;

/**
 * How far the sample card lags its layout position at a given scroll.
 * Phase 1 (0…pin) tracks the scroll 1:1 so the card appears pinned while the
 * lookup card rises to its line; phase 2 rests for 55% of the pin; phase 3
 * eases the offset back to zero so the section continues in normal flow.
 */
export function holdOffset(scroll: number, pin: number) {
  if (pin <= 0 || scroll <= 0) return 0;
  if (scroll < pin) return scroll;
  const released = scroll - pin - pin * 0.55;
  if (released <= 0) return pin;
  const span = pin * 2.4;
  if (released >= span) return 0;
  const t = released / span;
  return pin * (1 - t * t * (3 - 2 * t));
}
