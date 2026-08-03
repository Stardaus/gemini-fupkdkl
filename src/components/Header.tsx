import { useState, useEffect } from 'react';
import { Sun, Moon, Wifi, WifiOff, Download } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

export interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  isInstallable?: boolean;
  onInstallApp?: () => void;
}

export function Header({ theme, onToggleTheme, isInstallable, onInstallApp }: HeaderProps) {
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
            src="/icon-192.png"
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

        {/* Install App Button */}
        {isInstallable && (
          <button
            type="button"
            onClick={onInstallApp}
            aria-label="Install Formulary App"
            title="Install Formulary App"
            className="p-2 bg-brand-500/10 dark:bg-brand-500/20 hover:bg-brand-500/20 dark:hover:bg-brand-500/30 border border-brand-500/30 text-brand-700 dark:text-brand-300 rounded-xl transition-all active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer flex items-center gap-1.5"
          >
            <Download className="size-5 text-brand-600 dark:text-brand-400" />
            <span className="hidden md:inline text-xs font-bold">Install App</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 rounded-xl transition-all active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="size-5 text-amber-500" />
          ) : (
            <Moon className="size-5 text-indigo-500" />
          )}
        </button>
      </div>
    </header>
  );
}
