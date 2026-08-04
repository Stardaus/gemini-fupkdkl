import { useEffect, useState } from 'react';

interface TourOverlayProps {
  targetSelector: string | null;
  isActive: boolean;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourOverlay({ targetSelector, isActive }: TourOverlayProps) {
  const [rect, setRect] = useState<TargetRect | null>(null);

  useEffect(() => {
    if (!isActive) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      if (!targetSelector) {
        setRect(null);
        return;
      }

      const el = document.querySelector(targetSelector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({
          top: Math.max(0, r.top - 6),
          left: Math.max(0, r.left - 6),
          width: r.width + 12,
          height: r.height + 12,
        });
      } else {
        setRect(null);
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 300);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [targetSelector, isActive]);

  if (!isActive) return null;

  // Fallback when target element is not found or no target: full screen backdrop (blocks events)
  if (!rect) {
    return (
      <div
        data-testid="tour-overlay-fallback"
        className="fixed inset-0 z-50 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-xs transition-opacity duration-200 pointer-events-auto"
      />
    );
  }

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

  const topHeight = Math.max(0, rect.top);
  const bottomTop = rect.top + rect.height;
  const bottomHeight = Math.max(0, screenHeight - bottomTop);
  const leftWidth = Math.max(0, rect.left);
  const rightLeft = rect.left + rect.width;
  const rightWidth = Math.max(0, screenWidth - rightLeft);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 4 Dimming Backdrop Regions around Target Rect (pointer-events-auto) */}
      {/* Top Block */}
      <div
        className="fixed left-0 right-0 top-0 bg-slate-950/75 dark:bg-slate-950/85 transition-all duration-150 pointer-events-auto"
        style={{ height: `${topHeight}px` }}
      />

      {/* Bottom Block */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-slate-950/75 dark:bg-slate-950/85 transition-all duration-150 pointer-events-auto"
        style={{ top: `${bottomTop}px`, height: `${bottomHeight}px` }}
      />

      {/* Left Block */}
      <div
        className="fixed left-0 bg-slate-950/75 dark:bg-slate-950/85 transition-all duration-150 pointer-events-auto"
        style={{ top: `${rect.top}px`, height: `${rect.height}px`, width: `${leftWidth}px` }}
      />

      {/* Right Block */}
      <div
        className="fixed right-0 bg-slate-950/75 dark:bg-slate-950/85 transition-all duration-150 pointer-events-auto"
        style={{ top: `${rect.top}px`, height: `${rect.height}px`, width: `${rightWidth}px` }}
      />

      {/* Highlighting Border Ring over Target Cutout (pointer-events-none allows clicks to pass through!) */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none rounded-xl border-2 border-brand-500 shadow-[0_0_20px_rgba(20,184,166,0.6)] transition-all duration-150"
        style={{
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        }}
      />
    </div>
  );
}
