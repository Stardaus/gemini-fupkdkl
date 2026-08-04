import { ShieldCheck, Settings } from 'lucide-react';

export interface FooterProps {
  onOpenSettings?: () => void;
}

const ResponsiveLabel = ({ full, short }: { full: string; short: string }) => (
  <>
    <span className="hidden sm:inline">{full}</span>
    <span className="sm:hidden">{short}</span>
  </>
);

export function Footer({ onOpenSettings }: FooterProps) {
  return (
    <footer className="shrink-0 py-1.5 px-3 sm:px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10 w-full text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
      <div className="flex flex-row items-center justify-between gap-2 w-full max-w-4xl mx-auto">
        <div className="flex flex-row items-center justify-start gap-1.5 overflow-hidden whitespace-nowrap">
          <img
            src={`${import.meta.env.BASE_URL}icon-192.png`}
            alt="PKDKL Logo"
            className="size-3.5 sm:size-4 rounded object-contain shrink-0"
          />
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px] sm:max-w-none">
            © Pejabat Kesihatan Daerah Kuala Langat
          </span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-600 shrink-0">•</span>
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <ShieldCheck className="size-3 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <ResponsiveLabel full="Official Clinical Reference Guide" short="Official" />
          </span>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            data-tour="footer-settings"
            className="shrink-0 inline-flex items-center gap-1 font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors cursor-pointer min-h-[44px] px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <Settings className="size-3" aria-hidden="true" />
            <ResponsiveLabel full="Settings & Info" short="Settings" />
          </button>
        )}
      </div>
    </footer>
  );
}
