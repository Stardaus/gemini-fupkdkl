import { renderHook, act } from '@testing-library/react';
import { useOrientationLock } from './useOrientationLock';

describe('useOrientationLock', () => {
  let originalScreen: Screen;

  beforeEach(() => {
    localStorage.clear();
    originalScreen = window.screen;
    // Mock window.screen.orientation
    Object.defineProperty(window, 'screen', {
      writable: true,
      value: {
        orientation: {
          lock: vi.fn().mockResolvedValue(undefined),
          unlock: vi.fn(),
        },
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      value: originalScreen,
    });
    vi.clearAllMocks();
  });

  it('initializes to true (locked) by default', () => {
    const { result } = renderHook(() => useOrientationLock());
    expect(result.current.isPortraitLocked).toBe(true);
    expect(window.screen.orientation.lock).toHaveBeenCalledWith('portrait');
  });

  it('reads from localStorage if set', () => {
    localStorage.setItem('fupkdkl_portrait_lock', 'false');
    const { result } = renderHook(() => useOrientationLock());
    expect(result.current.isPortraitLocked).toBe(false);
    expect(window.screen.orientation.unlock).toHaveBeenCalled();
  });

  it('toggles lock state and updates localStorage', () => {
    const { result } = renderHook(() => useOrientationLock());
    expect(result.current.isPortraitLocked).toBe(true);
    
    act(() => {
      result.current.togglePortraitLock();
    });

    expect(result.current.isPortraitLocked).toBe(false);
    expect(localStorage.getItem('fupkdkl_portrait_lock')).toBe('false');
    expect(window.screen.orientation.unlock).toHaveBeenCalled();

    act(() => {
      result.current.togglePortraitLock();
    });

    expect(result.current.isPortraitLocked).toBe(true);
    expect(localStorage.getItem('fupkdkl_portrait_lock')).toBe('true');
    expect(window.screen.orientation.lock).toHaveBeenCalledWith('portrait');
  });

  it('handles gracefully when screen.orientation is missing', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      value: {}, // no orientation
    });

    const { result } = renderHook(() => useOrientationLock());
    expect(result.current.isPortraitLocked).toBe(true);
    
    expect(() => {
      act(() => {
        result.current.togglePortraitLock();
      });
    }).not.toThrow();
  });
});
