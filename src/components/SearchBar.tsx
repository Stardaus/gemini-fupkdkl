import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search medication name, MAL number, MDC code, or indication...',
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash =
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA';

      if (isCmdK || isSlash) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <form
      role="search"
      aria-label="Medication search form"
      onSubmit={(e) => e.preventDefault()}
      className="relative w-full group"
    >
      <label htmlFor="medication-search-input" className="sr-only">
        Search medications by name, MDC code, or indication
      </label>

      {/* Hero Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-600 dark:text-brand-400 transition-transform group-focus-within:scale-110">
        <Search className="size-5 sm:size-6" aria-hidden="true" />
      </div>

      {/* Hero Search Input */}
      <input
        id="medication-search-input"
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search medications by name, MDC code, or indication"
        aria-describedby="search-keyboard-hint"
        className="w-full pl-12 sm:pl-13 pr-14 py-3.5 sm:py-4 bg-white dark:bg-slate-800/95 border-2 border-slate-300 dark:border-slate-700/90 group-hover:border-brand-500/50 dark:group-hover:border-brand-500/50 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-base font-medium shadow-md group-focus-within:shadow-xl group-focus-within:border-brand-500 dark:group-focus-within:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 transition-all"
      />

      {/* Right Controls: Keyboard Shortcut / Clear Button */}
      <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center gap-1.5">
        {!value && (
          <div
            id="search-keyboard-hint"
            aria-label="Press Command K or Slash to search"
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600/80 rounded-lg select-none pointer-events-none shadow-xs"
          >
            <kbd className="font-sans">⌘</kbd>
            <kbd>K</kbd>
            <span className="text-slate-400 dark:text-slate-500">or</span>
            <kbd>/</kbd>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search query"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl transition-colors active:scale-95 cursor-pointer"
          >
            <X className="size-5 bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 rounded-full" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );
}
