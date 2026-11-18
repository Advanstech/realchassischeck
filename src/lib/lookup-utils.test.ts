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

  it('renders preview expiry in GMT', () => {
    expect(formatPreviewExpiry('2026-11-19T12:00:00.000Z')).toContain('GMT');
  });
});
