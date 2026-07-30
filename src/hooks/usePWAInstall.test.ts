import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePWAInstall, BeforeInstallPromptEvent } from './usePWAInstall';

describe('usePWAInstall hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with default non-installable state in normal desktop browser', () => {
    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isStandalone).toBe(false);
    expect(result.current.isBannerVisible).toBe(false);
    expect(result.current.isIOSModalOpen).toBe(false);
  });

  it('captures beforeinstallprompt event and marks app as installable', async () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const mockEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
    mockEvent.prompt = mockPrompt;
    mockEvent.userChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    expect(result.current.isInstallable).toBe(true);

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(mockPrompt).toHaveBeenCalled();
  });

  it('dismisses banner and sets 7-day cooldown timestamp in localStorage', () => {
    const { result } = renderHook(() => usePWAInstall());

    act(() => {
      result.current.dismissBanner();
    });

    expect(result.current.isBannerVisible).toBe(false);
    expect(localStorage.getItem('formulary_install_dismissed_at')).not.toBeNull();
  });

  it('opens iOS instructions modal when promptInstall is triggered on iOS Safari', () => {
    const originalUserAgent = window.navigator.userAgent;
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      configurable: true,
    });

    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.isIOS).toBe(true);
    expect(result.current.isInstallable).toBe(true);

    act(() => {
      result.current.promptInstall();
    });

    expect(result.current.isIOSModalOpen).toBe(true);

    act(() => {
      result.current.closeIOSModal();
    });

    expect(result.current.isIOSModalOpen).toBe(false);

    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });
});
