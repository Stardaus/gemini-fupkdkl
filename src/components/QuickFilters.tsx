import { ShieldAlert, Pill } from 'lucide-react';
import { FilterCategory } from '../types/formulary';

export interface QuickFiltersProps {
  activeFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  totalCount: number;
  quotaCount: number;
}

export function QuickFilters({
  activeFilter,
  onSelectFilter,
  totalCount,
  quotaCount,
}: QuickFiltersProps) {
  return (
    <div
      role="region"
      aria-label="Medication category filters"
      className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none"
      data-tour="quick-filters"
    >
      <button
        type="button"
        onClick={() => onSelectFilter('ALL')}
        aria-pressed={activeFilter === 'ALL'}
        className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          activeFilter === 'ALL'
            ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-900/30'
            : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <Pill className="size-4" aria-hidden="true" />
        <span>All Medications</span>
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-bold tabular-nums ${
            activeFilter === 'ALL'
              ? 'bg-brand-700/60 text-white'
              : 'bg-slate-100 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200'
          }`}
        >
          {totalCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter('QUOTA_ONLY')}
        aria-pressed={activeFilter === 'QUOTA_ONLY'}
        className={`min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          activeFilter === 'QUOTA_ONLY'
            ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/30'
            : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <ShieldAlert
          className={`size-4 ${
            activeFilter === 'QUOTA_ONLY' ? 'text-white' : 'text-amber-500'
          }`}
          aria-hidden="true"
        />
        <span>Quota Drugs</span>
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-bold tabular-nums ${
            activeFilter === 'QUOTA_ONLY'
              ? 'bg-amber-700/60 text-white'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
          }`}
        >
          {quotaCount}
        </span>
      </button>
    </div>
  );
}
