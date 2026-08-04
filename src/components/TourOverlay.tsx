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
          top: r.top - 6,
          left: r.left - 6,
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

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* SVG Mask Overlay for Spotlight Cutout */}
      <svg className="w-full h-full text-slate-950/75 dark:text-slate-950/85 transition-colors">
        <defs>
          <mask id="spotlight-mask">
            {/* White background = dim layer */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black rectangle = transparent cutout hole */}
            {rect && (
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx="12"
                ry="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="currentColor"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Highlighting Border Ring over Target */}
      {rect && (
        <div
          aria-hidden="true"
          className="fixed pointer-events-none rounded-xl border-2 border-brand-500 shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all duration-200"
          style={{
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }}
        />
      )}
    </div>
  );
}
