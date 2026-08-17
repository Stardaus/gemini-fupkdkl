import { useState, useEffect } from 'react';
import { Sun, Moon, Wifi, WifiOff, Download, Settings, BookOpen, ShieldCheck } from 'lucide-react';
import { Theme } from '../hooks/useTheme';
import { MOH_NAG_SECTION_C_URL } from '../data/nagSectionC';

export interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  isInstallable?: boolean;
  isStandalone?: boolean;
  onInstallApp?: () => void;
  onOpenSettings?: () => void;
  onOpenIntro?: () => void;
  onOpenNag?: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  isInstallable,
  isStandalone = false,
  onInstallApp,
  onOpenSettings,
  onOpenIntro,
  onOpenNag,
}: HeaderProps) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800/80">
      <div className="flex items-center gap-3.5">
        <div className="p-1 bg-brand-500/10 dark:bg-brand-500/15 rounded-2xl border border-brand-500/25 shadow-sm shrink-0 overflow-hidden flex items-center justify-center">
          <img
            src={`${import.meta.env.BASE_URL}icon-192.png`}
            alt="PKDKL Formulary Logo"
            className="size-9 sm:size-10 object-contain rounded-xl"
          />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 text-balance tracking-tight">
            District Drug Formulary <span className="text-brand-600 dark:text-brand-400">PKD Kuala Langat</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Pejabat Kesihatan Daerah Kuala Langat
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Offline / Online Status Indicator */}
        <span
          aria-label={isOnline ? 'Online' : 'Offline'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-colors ${
            isOnline
              ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border-brand-500/25'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25'
          }`}
        >
          <span className={`size-2 rounded-full ${isOnline ? 'bg-brand-500 animate-pulse' : 'bg-amber-500'}`} />
          {isOnline ? (
            <>
              <Wifi className="size-3.5 text-brand-600 dark:text-brand-400" />
              <span className="hidden sm:inline">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>Offline</span>
            </>
          )}
        </span>

        {/* Guide & Info Link (visible in browser mode, hidden in installed standalone app mode) */}
        {!isStandalone && onOpenIntro && (
          <button
            type="button"
            onClick={onOpenIntro}
            aria-label="Open App Overview and Installation Guide"
            title="Overview & Guide"
            className="min-h-[44px] min-w-[44px] p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 rounded-xl transition-all active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer flex items-center justify-center"
          >
            <BookOpen className="size-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          </button>
        )}

        {/* NAG Section C Guideline Link */}
        <a
          href={MOH_NAG_SECTION_C_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onOpenNag}
          aria-label="Open MOH National Antibiotic Guideline Section C in Primary Care"
          title="MOH NAG Section C (Primary Care Clinical Pathways)"
          className="min-h-[44px] px-2.5 sm:px-3 py-2 bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl transition-all active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer flex items-center gap-1.5"
        >
          <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span className="text-xs font-bold">NAG</span>
        </a>

        {/* Install App Button */}
        {isInstallable && (
          <button
            type="button"
            onClick={onInstallApp}
            aria-label="Install Formulary App"
            title="Install Formulary App"
            className="min-h-[44px] px-3 py-2 bg-brand-500/10 dark:bg-brand-500/20 hover:bg-brand-500/20 dark:hover:bg-brand-500/30 border border-brand-500/30 text-brand-700 dark:text-brand-300 rounded-xl transition-all active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer flex items-center gap-1.5"
          >
            <Download className="size-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <span className="hidden md:inline text-xs font-bold">Install App</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="min-h-[44px] min-w-[44px] p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 rounded-xl transition-all active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun className="size-5 text-amber-500" aria-hidden="true" />
          ) : (
            <Moon className="size-5 text-indigo-500" aria-hidden="true" />
          )}
        </button>

        {/* Settings Dialog Trigger Button */}
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open Settings and System Information"
            title="Settings & System Info"
            className="min-h-[44px] min-w-[44px] p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 rounded-xl transition-all active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer flex items-center justify-center"
          >
            <Settings className="size-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}
