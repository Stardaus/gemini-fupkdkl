import { useState, useCallback } from 'react';

const DISCLAIMER_KEY = 'formulary_disclaimer_accepted';

export function useDisclaimer() {
  const [hasAccepted, setHasAccepted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(DISCLAIMER_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const acceptDisclaimer = useCallback(() => {
    setHasAccepted(true);
    try {
      localStorage.setItem(DISCLAIMER_KEY, 'true');
    } catch {
      // Ignored
    }
  }, []);

  return { hasAccepted, acceptDisclaimer };
}
