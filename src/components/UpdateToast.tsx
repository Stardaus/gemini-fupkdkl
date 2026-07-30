import { RefreshCw, X, CheckCircle2 } from 'lucide-react';

export interface UpdateToastProps {
  isVisible: boolean;
  version: string | null;
  onDismiss: () => void;
}

export function UpdateToast({ isVisible, version, onDismiss }: UpdateToastProps) {
  if (!isVisible) return null;

  const isInvalidVersion = !version || version.startsWith('<') || version.length > 50;
  const displayVersion = isInvalidVersion ? null : version;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white/95 dark:bg-slate-800/95 border border-brand-500/40 text-slate-900 dark:text-slate-100 shadow-xl rounded-xl p-4 backdrop-blur-md transition-all duration-300 animate-slide-up"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-500/10 text-brand-500 rounded-lg shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-brand-600 dark:text-brand-300 flex items-center gap-1.5">
              Formulary Updated
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-500" />
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Latest formulary data {displayVersion ? `(v${displayVersion})` : ''} has been downloaded and saved automatically.
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
