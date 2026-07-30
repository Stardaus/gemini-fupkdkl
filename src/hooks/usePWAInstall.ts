import { useState, useEffect, useCallback } from 'react';

const DISMISSED_KEY = 'formulary_install_dismissed_at';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Detect if app is already running in standalone display mode
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMedia || isIOSStandalone);
    };

    // Detect iOS devices
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      const isTouchMac = navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /macintosh/.test(userAgent);
      setIsIOS(Boolean(isIOSDevice || isTouchMac));
    };

    checkStandalone();
    checkIOS();

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);

      // Check auto-prompt dismissal cooldown (7 days)
      const dismissedAt = localStorage.getItem(DISMISSED_KEY);
      const now = Date.now();
      const isCoolingDown = dismissedAt && now - Number(dismissedAt) < SEVEN_DAYS_MS;

      if (!isCoolingDown && !isStandalone) {
        // Auto-show banner after 3 second delay
        setTimeout(() => {
          setIsBannerVisible(true);
        }, 3000);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsBannerVisible(false);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsBannerVisible(false);
      }
    } else if (isIOS) {
      setIsIOSModalOpen(true);
    }
  }, [deferredPrompt, isIOS]);

  const dismissBanner = useCallback(() => {
    setIsBannerVisible(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  }, []);

  const closeIOSModal = useCallback(() => {
    setIsIOSModalOpen(false);
  }, []);

  const isInstallable = Boolean(deferredPrompt || (isIOS && !isStandalone));

  return {
    isInstallable,
    isStandalone,
    isIOS,
    isBannerVisible,
    isIOSModalOpen,
    promptInstall,
    dismissBanner,
    closeIOSModal,
  };
}
