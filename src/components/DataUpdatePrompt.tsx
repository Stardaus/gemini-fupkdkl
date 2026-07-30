import { useState } from 'react';
import { Database, RefreshCw, X } from 'lucide-react';

export interface DataUpdatePromptProps {
  isVisible: boolean;
  version: string | null;
  onUpdate: () => Promise<void>;
  onDismiss: () => void;
}

export function DataUpdatePrompt({
  isVisible,
  version,
  onUpdate,
  onDismiss,
}: DataUpdatePromptProps) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!isVisible) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92vw] bg-white/95 dark:bg-slate-900/95 border-2 border-brand-500 text-slate-900 dark:text-slate-100 shadow-2xl rounded-2xl p-4 backdrop-blur-md transition-all duration-300 animate-slide-down"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-brand-500/20 text-brand-600 dark:text-brand-300 rounded-xl shrink-0 mt-0.5 border border-brand-500/40">
            <Database className="size-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-brand-600 dark:text-brand-300 flex items-center gap-1.5">
              Formulary Data Update Available
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              New medication data {version ? `(v${version})` : ''} is ready. Tap to download latest formulary changes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss data update notification"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90 shrink-0"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium rounded-lg transition-all active:scale-95"
        >
          Later
        </button>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isUpdating}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`size-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Updating Data...' : 'Update Data Now'}
        </button>
      </div>
    </div>
  );
}
