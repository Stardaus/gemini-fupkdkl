import { useState, useCallback } from 'react';
import { WifiOff, Loader2, RefreshCw } from 'lucide-react';

export interface InitialLoadScreenProps {
  onRetry: () => Promise<void>;
}

export function InitialLoadScreen({ onRetry }: InitialLoadScreenProps) {
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    setErrorMessage(null);
    try {
      await onRetry();
    } catch {
      setErrorMessage('Unable to download dataset. Please check your connection and try again.');
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-700/80 transition-colors">
        <div className="mx-auto w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5 border border-brand-200/50 dark:border-brand-700/50">
          <WifiOff className="size-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2.5">
          Internet Connection Required
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          An active internet connection is required to download the clinical formulary database for initial setup. Once loaded, the data will be available offline.
        </p>

        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md shadow-brand-600/20"
        >
          {isRetrying ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Downloading Database...</span>
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              <span>Load Data</span>
            </>
          )}
        </button>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-medium border border-red-200 dark:border-red-800/50">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
