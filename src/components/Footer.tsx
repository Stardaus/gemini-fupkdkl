import { ShieldCheck, Settings } from 'lucide-react';
import { VersionInfo } from '../types/formulary';

export interface CheckUpdateResult {
  hasUpdate?: boolean;
  isOffline?: boolean;
  error?: boolean;
}

export interface FooterProps {
  versionInfo?: VersionInfo | null;
  onCheckUpdate?: () => Promise<CheckUpdateResult | void> | void;
  onOpenSettings?: () => void;
}

export function Footer({ onOpenSettings }: FooterProps) {
  return (
    <footer className="shrink-0 mt-4 sm:mt-8 pt-3 sm:pt-4 pb-4 sm:pb-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <img
            src={`${import.meta.env.BASE_URL}icon-192.png`}
            alt="PKDKL Logo"
            className="size-4 rounded object-contain inline-block"
          />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            © Pejabat Kesihatan Daerah Kuala Langat
          </span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-600">•</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="size-3 text-brand-600 dark:text-brand-400 shrink-0" />
            Official Clinical Reference Guide
          </span>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors cursor-pointer min-h-[32px] px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Settings className="size-3" />
            <span>Settings & Info</span>
          </button>
        )}
      </div>
    </footer>
  );
}
