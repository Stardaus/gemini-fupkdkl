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

  it('starts tour at index 0 and clears completion key when start() is called', () => {
    localStorage.setItem('fupkdkl_tour_completed', 'true');
    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep?.id).toBe(TOUR_STEPS[0].id);
    expect(localStorage.getItem('fupkdkl_tour_completed')).toBeNull();
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

  it('dynamically filters steps when isVisible returns false', () => {
    // When recent-meds is absent from DOM, totalSteps should be 6 instead of 7
    // and advancing next from step 0 ('search-bar') should go to 'quick-filters'
    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.start();
    });

    expect(result.current.totalSteps).toBe(6);
    expect(result.current.currentStep?.id).toBe('search-bar');

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStep?.id).toBe('quick-filters');
  });

  it('includes step when element is present in DOM', () => {
    const el = document.createElement('div');
    el.setAttribute('data-tour', 'recent-meds');
    document.body.appendChild(el);

    const { result } = renderHook(() => useTour());

    act(() => {
      result.current.start();
    });

    expect(result.current.totalSteps).toBe(7);
    expect(result.current.currentStep?.id).toBe('search-bar');

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStep?.id).toBe('recent-meds');

    document.body.removeChild(el);
  });
});
