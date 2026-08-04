import { useEffect, useRef, useState } from 'react';
import {
  X,
  Settings,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  ShieldCheck,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
} from 'lucide-react';
import { VersionInfo } from '../types/formulary';
import { Theme } from '../hooks/useTheme';
import { CheckUpdateResult } from './Footer';

export interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  versionInfo: VersionInfo | null;
  onCheckUpdate: () => Promise<CheckUpdateResult | void> | void;
  theme: Theme;
  onToggleTheme: () => void;
  isPortraitLocked: boolean;
  onTogglePortraitLock: () => void;
}

type CheckState = 'idle' | 'checking' | 'up-to-date' | 'error';

export function SettingsDialog({
  isOpen,
  onClose,
  versionInfo,
  onCheckUpdate,
  theme,
  onToggleTheme,
  isPortraitLocked,
  onTogglePortraitLock,
}: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [checkState, setCheckState] = useState<CheckState>('idle');
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      document.body.style.overflow = '';
      onClose();
    };

    dialog.addEventListener('close', handleNativeClose);
    return () => {
      dialog.removeEventListener('close', handleNativeClose);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleCheck = async () => {
    if (checkState === 'checking') return;
    setCheckState('checking');

    try {
      const globalCheck = (window as unknown as { checkPWAUpdate?: () => void }).checkPWAUpdate;
      if (globalCheck) {
        globalCheck();
      }

      const result = await onCheckUpdate();

      if (result?.isOffline || result?.error) {
        setCheckState('error');
        setTimeout(() => setCheckState('idle'), 3000);
      } else if (result?.hasUpdate) {
        setCheckState('idle');
      } else {
        setCheckState('up-to-date');
        setTimeout(() => setCheckState('idle'), 2500);
      }
    } catch {
      setCheckState('error');
      setTimeout(() => setCheckState('idle'), 3000);
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isOpen) return null;

  const dataVersion = versionInfo?.version || '2.0.0';
  const buildId = typeof __APP_BUILD_ID__ !== 'undefined' ? __APP_BUILD_ID__ : 'dev';
  const buildTime = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : 'N/A';

  const lastCheckedDate = versionInfo?.lastChecked
    ? new Date(versionInfo.lastChecked).toLocaleString([], {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 m-auto z-50 w-[92vw] max-w-lg h-auto max-h-[85vh] flex flex-col p-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl">
            <Settings className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="settings-dialog-title"
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              Settings & System Information
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Manage preferences and system updates
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm">
        {/* Network & Theme Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Theme Toggle Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Appearance
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">
                {theme} Mode
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-all active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="size-5 text-amber-500" aria-hidden="true" />
              ) : (
                <Moon className="size-5 text-indigo-500" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Network Status Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Connection Status
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isOnline ? 'Online (Live Sync)' : 'Offline (Cached)'}
              </span>
            </div>
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              }`}
            >
              {isOnline ? <Wifi className="size-5" /> : <WifiOff className="size-5" />}
            </div>
          </div>

          {/* Portrait Lock Toggle Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between sm:col-span-2">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Portrait Orientation Lock
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isPortraitLocked ? 'Locked (Recommended)' : 'Unlocked'}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
                Prevents the app from auto-rotating in PWA mode.
              </p>
            </div>
            <button
              type="button"
              onClick={onTogglePortraitLock}
              aria-label={`Toggle portrait orientation lock (currently ${isPortraitLocked ? 'locked' : 'unlocked'})`}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all active:scale-95 min-w-[44px] min-h-[44px] cursor-pointer shadow-xs shrink-0 ${
                isPortraitLocked
                  ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border-brand-500/30'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {isPortraitLocked ? <Lock className="size-5" /> : <Unlock className="size-5" />}
            </button>
          </div>
        </div>

        {/* Database & App Version Information */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/40 pb-2.5">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Formulary Data Version
              </span>
            </div>
            <span className="font-mono text-xs font-extrabold bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2.5 py-0.5 rounded-full border border-brand-500/20">
              v{dataVersion}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/40 pb-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-brand-600 dark:text-brand-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">App Build ID</span>
            </div>
            <span className="font-mono text-slate-600 dark:text-slate-400">{buildId}</span>
          </div>

          {lastCheckedDate && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Last data update check: <span className="font-mono">{lastCheckedDate}</span>
            </p>
          )}

          {buildTime !== 'N/A' && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              App Shell Build Date: <span className="font-mono">{buildTime}</span>
            </p>
          )}
        </div>

        {/* Check for Updates Action Card */}
        <div className="p-4 bg-brand-50/50 dark:bg-brand-500/5 border border-brand-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Check System Updates
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Check for new Google Sheets formulary datasets & PWA code updates.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCheck}
            disabled={checkState === 'checking'}
            aria-label="Check for updates"
            className={`min-h-[44px] px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed ${
              checkState === 'up-to-date'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                : checkState === 'error'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20'
            }`}
          >
            {checkState === 'checking' && (
              <>
                <RefreshCw className="size-4 animate-spin" />
                <span>Checking...</span>
              </>
            )}
            {checkState === 'up-to-date' && (
              <>
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Up to Date ✓</span>
              </>
            )}
            {checkState === 'error' && (
              <>
                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                <span>Offline / Error</span>
              </>
            )}
            {checkState === 'idle' && (
              <>
                <RefreshCw className="size-4" />
                <span>Check Updates Now</span>
              </>
            )}
          </button>
        </div>

        {/* Disclaimer / App Info */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="size-3.5 text-brand-600 dark:text-brand-400" />
            Pejabat Kesihatan Daerah Kuala Langat
          </p>
          <p className="text-[11px]">Official Clinical Medication Reference PWA</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 flex justify-end shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          Done
        </button>
      </div>
    </dialog>
  );
}
