import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useDisclaimer } from './useDisclaimer';

describe('useDisclaimer hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('manages disclaimer acceptance state', () => {
    const { result } = renderHook(() => useDisclaimer());

    expect(result.current.hasAccepted).toBe(false);

    act(() => {
      result.current.acceptDisclaimer();
    });

    expect(result.current.hasAccepted).toBe(true);
    expect(localStorage.getItem('formulary_disclaimer_accepted')).toBe('true');
  });
});
