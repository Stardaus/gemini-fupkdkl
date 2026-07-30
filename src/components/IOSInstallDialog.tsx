import { Share, PlusSquare, X, Smartphone } from 'lucide-react';

export interface IOSInstallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallDialog({ isOpen, onClose }: IOSInstallDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-install-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-slate-900 dark:text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close install guide"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Dialog Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-500/20 shrink-0">
            <Smartphone className="size-6" />
          </div>
          <div>
            <h2 id="ios-install-title" className="text-lg font-bold tracking-tight">
              Install on iOS Safari
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Add District Drug Formulary to your Home Screen for instant offline access
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5 pt-1">
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-center size-7 bg-brand-500/15 text-brand-700 dark:text-brand-300 font-bold rounded-xl text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                Tap the Share button <Share className="size-4 text-brand-500 inline" />
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                In Safari's bottom toolbar (or top right on iPad).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-center size-7 bg-brand-500/15 text-brand-700 dark:text-brand-300 font-bold rounded-xl text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                Select &quot;Add to Home Screen&quot; <PlusSquare className="size-4 text-brand-500 inline" />
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Scroll down the action sheet menu to find it.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-center size-7 bg-brand-500/15 text-brand-700 dark:text-brand-300 font-bold rounded-xl text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Tap &quot;Add&quot; in the top-right corner
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                The Formulary app icon will be added to your device home screen.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
