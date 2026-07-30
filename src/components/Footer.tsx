import { useState } from 'react';
import { RefreshCw, Database, ShieldCheck, Cpu } from 'lucide-react';
import { VersionInfo } from '../types/formulary';

export interface FooterProps {
  versionInfo: VersionInfo | null;
  onCheckUpdate: () => void;
}

export function Footer({ versionInfo, onCheckUpdate }: FooterProps) {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const dataVersion = versionInfo?.version || '2.0.0';
  const buildId = __APP_BUILD_ID__;
  const buildTime = __APP_BUILD_TIME__;

  const handleCheck = () => {
    setIsChecking(true);
    onCheckUpdate();
    const globalCheck = (window as unknown as { checkPWAUpdate?: () => void }).checkPWAUpdate;
    if (globalCheck) {
      globalCheck();
    }
    setTimeout(() => setIsChecking(false), 1200);
  };

  const lastCheckedDate = versionInfo?.lastChecked
    ? new Date(versionInfo.lastChecked).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <footer className="shrink-0 mt-2 sm:mt-10 pt-2.5 sm:pt-6 pb-2 sm:pb-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <span>District Drug Formulary PKD Kuala Langat</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            Official Clinical Reference Guide • Pejabat Kesihatan Daerah Kuala Langat
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 shadow-sm">
            <Database className="size-3.5 text-brand-600 dark:text-brand-400" />
            <span className="tabular-nums">Data: v{dataVersion}</span>
            {lastCheckedDate && (
              <span className="text-slate-400 dark:text-slate-500 text-[10px] tabular-nums">({lastCheckedDate})</span>
            )}
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 shadow-sm"
            title={`App Shell Build Time: ${buildTime}`}
          >
            <Cpu className="size-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="tabular-nums">Build: {buildId}</span>
          </div>

          <button
            type="button"
            onClick={handleCheck}
            disabled={isChecking}
            aria-label="Check for updates"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 hover:bg-brand-500/20 dark:hover:bg-brand-500/30 border border-brand-500/30 text-brand-700 dark:text-brand-300 transition-all active:scale-95 font-semibold text-[11px] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw className={`size-3 text-brand-600 dark:text-brand-400 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Updates'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
