import { describe, it, expect } from 'vitest';
import { isNoneRestriction } from './restrictionUtils';

describe('isNoneRestriction', () => {
  it('returns true for undefined or null', () => {
    expect(isNoneRestriction(undefined)).toBe(true);
    expect(isNoneRestriction(undefined as unknown as string)).toBe(true);
  });

  it('returns true for empty or whitespace-only strings', () => {
    expect(isNoneRestriction('')).toBe(true);
    expect(isNoneRestriction('   ')).toBe(true);
  });

  it('returns true for non-restrictive text variations', () => {
    expect(isNoneRestriction('None')).toBe(true);
    expect(isNoneRestriction('none')).toBe(true);
    expect(isNoneRestriction('Tiada')).toBe(true);
    expect(isNoneRestriction('tiada')).toBe(true);
    expect(isNoneRestriction('N/A')).toBe(true);
    expect(isNoneRestriction('n/a')).toBe(true);
    expect(isNoneRestriction('-')).toBe(true);
    expect(isNoneRestriction('nil')).toBe(true);
  });

  it('handles surrounding whitespace gracefully', () => {
    expect(isNoneRestriction('  None  ')).toBe(true);
    expect(isNoneRestriction('\tTiada\n')).toBe(true);
  });

  it('returns false for actual restrictions', () => {
    expect(isNoneRestriction('PKD Quota Control')).toBe(false);
    expect(isNoneRestriction('Requires Specialist Approval')).toBe(false);
    expect(isNoneRestriction('Kawalan Kuota')).toBe(false);
  });
});
