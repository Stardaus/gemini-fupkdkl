import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fupkdkl_portrait_lock';

export function useOrientationLock() {
  const [isPortraitLocked, setIsPortraitLocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === 'true' : true;
  });

  const togglePortraitLock = useCallback(() => {
    setIsPortraitLocked((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof screen === 'undefined' || !screen.orientation) return;

    if (isPortraitLocked) {
      if (typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('portrait').catch((e) => {
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
