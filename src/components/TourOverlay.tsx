import { TargetRect, ViewportSize } from '../hooks/useTargetBoundingRect';

interface TourOverlayProps {
  rect: TargetRect | null;
  viewport: ViewportSize;
  isActive: boolean;
}

const SPOTLIGHT_PADDING = 6;
const SPOTLIGHT_SIZE_EXPANSION = 12;

export function TourOverlay({ rect, viewport, isActive }: TourOverlayProps) {
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

  const paddedRect = {
    top: Math.max(0, rect.top - SPOTLIGHT_PADDING),
    left: Math.max(0, rect.left - SPOTLIGHT_PADDING),
    width: rect.width + SPOTLIGHT_SIZE_EXPANSION,
    height: rect.height + SPOTLIGHT_SIZE_EXPANSION,
  };

  const topHeight = Math.max(0, paddedRect.top);
  const bottomTop = paddedRect.top + paddedRect.height;
  const bottomHeight = Math.max(0, viewport.height - bottomTop);
  const leftWidth = Math.max(0, paddedRect.left);
  const rightLeft = paddedRect.left + paddedRect.width;
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
      style: { top: `${paddedRect.top}px`, left: 0, width: `${leftWidth}px`, height: `${paddedRect.height}px` },
    },
    {
      id: 'right',
      style: { top: `${paddedRect.top}px`, right: 0, width: `${rightWidth}px`, height: `${paddedRect.height}px` },
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
          top: `${paddedRect.top}px`,
          left: `${paddedRect.left}px`,
          width: `${paddedRect.width}px`,
          height: `${paddedRect.height}px`,
        }}
      />
    </div>
  );
}
