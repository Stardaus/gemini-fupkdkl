import { Download, X } from 'lucide-react';

export interface InstallBannerProps {
  isVisible: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallBanner({ isVisible, onInstall, onDismiss }: InstallBannerProps) {
  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Install App Banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 p-4 bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md rounded-2xl border border-brand-500/30 shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="p-2.5 bg-brand-500/20 text-brand-400 rounded-xl border border-brand-500/30 shrink-0">
          <Download className="size-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold truncate">Install Formulary App</h3>
          <p className="text-xs text-slate-300 truncate">
            Add to home screen for instant offline access
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onInstall}
          className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          Install
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss install banner"
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
