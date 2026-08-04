import { useState, useEffect, useCallback } from 'react';

declare global {
  interface ScreenOrientation {
    lock(orientation: string): Promise<void>;
  }
}

const STORAGE_KEY = 'fupkdkl_portrait_lock';

export function useOrientationLock() {
  const [isPortraitLocked, setIsPortraitLocked] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  const togglePortraitLock = useCallback(() => {
    setIsPortraitLocked((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!screen.orientation) return;

    if (isPortraitLocked) {
      if (typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('portrait').catch((e: unknown) => {
          // Silently fail if lock is not supported or rejected (e.g., not in PWA standalone mode)
          console.debug('Orientation lock failed or unsupported:', e);
        });
      }
    } else {
      if (typeof screen.orientation.unlock === 'function') {
        try {
          screen.orientation.unlock();
        } catch (e) {
          console.debug('Orientation unlock failed:', e);
        }
      }
    }
  }, [isPortraitLocked]);

  return {
    isPortraitLocked,
    togglePortraitLock,
  };
}
