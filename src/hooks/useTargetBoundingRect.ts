import { useState, useEffect } from 'react';

export interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

const POLL_INTERVAL_MS = 300;

export function useTargetBoundingRect(targetSelector: string | null, isActive: boolean) {
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [viewport, setViewport] = useState<ViewportSize>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    if (!isActive) {
      setRect(null);
      return;
    }

    const updateRectAndViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      if (!targetSelector) {
        setRect(null);
        return;
      }

      const el = document.querySelector(targetSelector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({
          top: Math.max(0, r.top),
          left: Math.max(0, r.left),
          width: r.width,
          height: r.height,
        });
      } else {
        setRect(null);
      }
    };

    updateRectAndViewport();
    const interval = setInterval(updateRectAndViewport, POLL_INTERVAL_MS);
    window.addEventListener('resize', updateRectAndViewport);
    window.addEventListener('scroll', updateRectAndViewport, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRectAndViewport);
      window.removeEventListener('scroll', updateRectAndViewport, true);
    };
  }, [targetSelector, isActive]);

  return { rect, viewport };
}
