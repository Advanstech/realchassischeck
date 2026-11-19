import { describe, expect, it } from 'vitest';
import { HOLD_LIMIT, HOLD_MINIMUM, holdOffset } from './hero-hold';

const PIN = 127;
const END = PIN + PIN * 0.55 + PIN * 2.4;

describe('holdOffset', () => {
  it('is off when disabled, above the fold, or scrolled back to the top', () => {
    expect(holdOffset(300, 0)).toBe(0);
    expect(holdOffset(0, PIN)).toBe(0);
    expect(holdOffset(-40, PIN)).toBe(0);
  });

  it('tracks the scroll 1:1 until the cards are level, so the card looks pinned', () => {
    for (const scroll of [1, 40, 90, PIN - 1]) {
      expect(holdOffset(scroll, PIN)).toBeCloseTo(scroll, 6);
    }
    expect(holdOffset(PIN, PIN)).toBe(PIN);
  });

  it('rests at the pin for a beat, then eases back to the layout slot', () => {
    expect(holdOffset(PIN + 10, PIN)).toBe(PIN);
    expect(holdOffset(PIN + PIN * 0.5, PIN)).toBe(PIN);
    expect(holdOffset(END, PIN)).toBe(0);
    expect(holdOffset(END + 400, PIN)).toBe(0);
  });

  it('never overshoots the pin, never goes negative, and never reverses in the release', () => {
    let previous = holdOffset(0, PIN);
    for (let scroll = 0; scroll <= END + 100; scroll += 1) {
      const value = holdOffset(scroll, PIN);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(PIN);
      if (scroll > PIN + PIN * 0.55) expect(value).toBeLessThanOrEqual(previous + 1e-9);
      previous = value;
    }
  });

  it('keeps the shipped limits sane', () => {
    expect(HOLD_MINIMUM).toBeLessThan(HOLD_LIMIT);
    expect(holdOffset(10, HOLD_LIMIT)).toBe(10);
  });
});
