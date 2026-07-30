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
      // Focus search input when pressing '/' key outside inputs
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
        <Search className="size-5" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search medications"
        className="w-full pl-11 pr-12 py-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all text-sm sm:text-base shadow-sm dark:shadow-inner"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
        {!value && (
          <kbd
            title="Press / to search"
            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600/50 rounded select-none pointer-events-none"
          >
            /
          </kbd>
        )}
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all active:scale-90"
          >
            <X className="size-5 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 rounded-full" />
          </button>
        )}
      </div>
    </div>
  );
}
