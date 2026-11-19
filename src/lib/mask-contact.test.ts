import { describe, expect, it } from 'vitest';
import { maskContact } from './mask-contact';

describe('maskContact', () => {
  it('masks a local Ghanaian number as in the design mockup', () => {
    expect(maskContact('0241234567')).toBe('024 ••• 4567');
  });

  it('normalises +233 to a local 0-prefixed mask', () => {
    expect(maskContact('+233 24 123 4567')).toBe('024 ••• 4567');
    expect(maskContact('+233241234567')).toBe('024 ••• 4567');
  });

  it('masks other international numbers by their own prefix', () => {
    expect(maskContact('+15551234567')).toBe('155 ••• 4567');
  });

  it('keeps emails readable', () => {
    expect(maskContact('root@realchassischeck.local')).toBe('root@realchassischeck.local');
  });

  it('keeps short or non-numeric values as they are', () => {
    expect(maskContact('12345')).toBe('12345');
    expect(maskContact('—')).toBe('—');
  });
});
