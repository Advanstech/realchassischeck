import { describe, expect, it } from 'vitest';
import { formatMoney, formatPreviewExpiry, normaliseIdentifier } from './lookup-utils';

describe('lookup presentation helpers', () => {
  it('normalises pasted VIN and chassis input without changing hyphens', () => {
    expect(normaliseIdentifier(' 1m8gdm9ax kp042788\n')).toBe('1M8GDM9AXKP042788');
    expect(normaliseIdentifier('nze141-1234567')).toBe('NZE141-1234567');
  });

  it('formats integer pesewas without floating-point money arithmetic', () => {
    expect(formatMoney(14_900, 'GHS')).toBe('GH₵149.00');
    expect(formatMoney(135, 'GHS')).toBe('GH₵1.35');
  });

  it('renders preview expiry in GMT without locale-dependent formatting', () => {
    // The preview page is SSR-ed and hydrated, so the exact string is the contract:
    // any `Intl` drift between Node and the browser shows up as a hydration mismatch.
    expect(formatPreviewExpiry('2026-11-19T12:00:00.000Z')).toBe('19 Nov 2026 at 12:00 PM GMT');
    expect(formatPreviewExpiry('2026-11-20T18:18:00.000Z')).toBe('20 Nov 2026 at 6:18 PM GMT');
    expect(formatPreviewExpiry('2027-01-01T00:05:00.000Z')).toBe('1 Jan 2027 at 12:05 AM GMT');
  });
});
