import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes theme and toggles between light and dark modes', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem('formulary_theme')).toBe('light');
  });

  it('restores stored light theme preference from localStorage on mount', () => {
    localStorage.setItem('formulary_theme', 'light');
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });
});
