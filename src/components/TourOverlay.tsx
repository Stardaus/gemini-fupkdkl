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

interface ViewportSize {
  width: number;
  height: number;
}

export function TourOverlay({ targetSelector, isActive }: TourOverlayProps) {
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
          top: Math.max(0, r.top - 6),
          left: Math.max(0, r.left - 6),
          width: r.width + 12,
          height: r.height + 12,
        });
      } else {
        setRect(null);
      }
    };

    updateRectAndViewport();
    const interval = setInterval(updateRectAndViewport, 300);
    window.addEventListener('resize', updateRectAndViewport);
    window.addEventListener('scroll', updateRectAndViewport, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRectAndViewport);
      window.removeEventListener('scroll', updateRectAndViewport, true);
    };
  }, [targetSelector, isActive]);

  if (!isActive) return null;

  // Fallback when target element is missing or not provided
  if (!rect) {
    return (
      <div
        data-testid="tour-overlay-fallback"
        className="fixed inset-0 z-50 bg-slate-950/75 dark:bg-slate-950/85 transition-opacity duration-200 pointer-events-auto"
      />
    );
  }

  const topHeight = Math.max(0, rect.top);
  const bottomTop = rect.top + rect.height;
  const bottomHeight = Math.max(0, viewport.height - bottomTop);
  const leftWidth = Math.max(0, rect.left);
  const rightLeft = rect.left + rect.width;
  const rightWidth = Math.max(0, viewport.width - rightLeft);

  const backdropBlocks = [
    {
      id: 'top',
      style: { top: 0, left: 0, right: 0, height: `${topHeight}px` },
    },
    {
      id: 'bottom',
      style: { top: `${bottomTop}px`, left: 0, right: 0, height: `${bottomHeight}px` },
    },
    {
      id: 'left',
      style: { top: `${rect.top}px`, left: 0, width: `${leftWidth}px`, height: `${rect.height}px` },
    },
    {
      id: 'right',
      style: { top: `${rect.top}px`, right: 0, width: `${rightWidth}px`, height: `${rect.height}px` },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 4 Dimming Backdrop Regions around Target Rect (pointer-events-auto) */}
      {backdropBlocks.map((block) => (
        <div
          key={block.id}
          className="fixed bg-slate-950/75 dark:bg-slate-950/85 transition-all duration-150 pointer-events-auto"
          style={block.style}
        />
      ))}

      {/* Highlighting Border Ring over Target Cutout (pointer-events-none allows clicks to pass through) */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none rounded-xl border-2 border-brand-500 shadow-lg shadow-brand-500/60 transition-all duration-150"
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
