import { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

export interface TourInviteBannerProps {
  isVisible: boolean;
  onStartTour: () => void;
  onDismiss: () => void;
}

export function TourInviteBanner({
  isVisible,
  onStartTour,
  onDismiss,
}: TourInviteBannerProps) {
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // Auto-dismiss timer (10 seconds)
    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss();
      setIsDismissing(false);
    }, 300);
  };

  const handleStart = () => {
    onStartTour();
  };

  return (
    <div
      role="region"
      aria-label="Interactive feature tour invitation"
      className={`relative w-full overflow-hidden bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 rounded-2xl p-3.5 sm:p-4 text-slate-900 dark:text-slate-100 shadow-md transition-all duration-300 ${
        isDismissing ? 'opacity-0 scale-95 -translate-y-2' : 'animate-in fade-in slide-in-from-top-2 duration-300'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-brand-600 text-white rounded-xl shrink-0 shadow-sm">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-brand-700 dark:text-brand-300 truncate">
              New to Formulari PKD Kuala Langat?
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 truncate">
              Take a quick 1-minute interactive tour to explore key features.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer min-h-[36px]"
          >
            <span>Start Tour</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss tour prompt"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
