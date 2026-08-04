import { useEffect, useState } from 'react';
import { TourStep } from '../types/tour';
import { ChevronLeft, ChevronRight, X, Sparkles, Touchpad as TouchApp } from 'lucide-react';

interface TourTooltipProps {
  step: TourStep;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export function TourTooltip({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onComplete,
}: TourTooltipProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!step.targetSelector) {
      setStyle({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(step.targetSelector!);
      if (!el) {
        setStyle({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        });
        return;
      }

      const rect = el.getBoundingClientRect();
      const margin = 16;
      const tooltipWidth = Math.min(window.innerWidth - 32, 340);

      let top = rect.bottom + margin;
      let left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 16));

      if (step.placement === 'top' && rect.top > 200) {
        top = Math.max(16, rect.top - 200);
      } else if (top + 200 > window.innerHeight) {
        top = Math.max(16, rect.top - 200);
      }

      setStyle({
        top: `${top}px`,
        left: `${left}px`,
        width: `${tooltipWidth}px`,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [step]);

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;
  const isActionGated = step.advanceOn === 'action';

  return (
    <div
      role="dialog"
      aria-label={`Tour step: ${step.title}`}
      className="fixed z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-brand-500/30 dark:border-brand-400/30 shadow-2xl text-slate-900 dark:text-slate-100 transition-all duration-200 animate-in fade-in zoom-in-95"
      style={style}
    >
      {/* Step Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
          <Sparkles className="size-4" aria-hidden="true" />
          <span>
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        <button
          type="button"
          onClick={onSkip}
          aria-label="Close tour"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Step Content */}
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
        {step.title}
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
        {step.description}
      </p>

      {/* Action Hint Banner for Action-Gated Steps */}
      {isActionGated && step.actionHint && (
        <div className="mb-3 p-2 bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-brand-700 dark:text-brand-300 animate-pulse">
          <TouchApp className="size-4 shrink-0" aria-hidden="true" />
          <span>{step.actionHint}</span>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 min-h-[44px] px-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer"
        >
          Skip Tour
        </button>

        <div className="flex items-center gap-1.5">
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer"
            >
              <ChevronLeft className="size-3.5" aria-hidden="true" />
              <span>Back</span>
            </button>
          )}

          {!isActionGated && (
            <button
              type="button"
              onClick={isLast ? onComplete : onNext}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 min-h-[44px] px-4 rounded-xl shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer"
            >
              <span>{isLast ? 'Done' : 'Next'}</span>
              {!isLast && <ChevronRight className="size-3.5" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
