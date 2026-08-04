import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTour } from './useTour';
import { TOUR_STEPS } from '../config/tourSteps';

describe('useTour hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('indicates shouldAutoStart true when localStorage key is absent', () => {
    const { result } = renderHook(() => useTour());
    expect(result.current.shouldAutoStart).toBe(true);
    expect(result.current.isActive).toBe(false);
  });

  it('starts tour at index 0 when start() is called', () => {
    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep?.id).toBe(TOUR_STEPS[0].id);
  });

  it('navigates next and back correctly', () => {
    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.next();
    });
    expect(result.current.currentStepIndex).toBe(1);

    act(() => {
      result.current.back();
    });
    expect(result.current.currentStepIndex).toBe(0);

    // Clamp back at 0
    act(() => {
      result.current.back();
    });
    expect(result.current.currentStepIndex).toBe(0);
  });

  it('persists completion key and deactivates on skip()', () => {
    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.skip();
    });

    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem('fupkdkl_tour_completed')).toBe('true');
  });

  it('persists completion key and deactivates on complete()', () => {
    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.complete();
    });

    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem('fupkdkl_tour_completed')).toBe('true');
  });
});
