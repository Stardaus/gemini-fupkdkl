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
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        type="button"
        onClick={() => onSelectFilter('ALL')}
        aria-pressed={activeFilter === 'ALL'}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap border ${
          activeFilter === 'ALL'
            ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-900/30'
            : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <Pill className="size-4" />
        <span>All Medications</span>
        <span className={`px-2 py-0.5 text-xs rounded-full font-semibold tabular-nums ${
          activeFilter === 'ALL'
            ? 'bg-brand-700/50 text-white'
            : 'bg-slate-100 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200'
        }`}>
          {totalCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter('QUOTA_ONLY')}
        aria-pressed={activeFilter === 'QUOTA_ONLY'}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap border ${
          activeFilter === 'QUOTA_ONLY'
            ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/30'
            : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
      >
        <ShieldAlert className={`size-4 ${activeFilter === 'QUOTA_ONLY' ? 'text-white' : 'text-amber-500'}`} />
        <span>Quota Drugs</span>
        <span className={`px-2 py-0.5 text-xs rounded-full font-semibold tabular-nums ${
          activeFilter === 'QUOTA_ONLY'
            ? 'bg-amber-700/50 text-white'
            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200'
        }`}>
          {quotaCount}
        </span>
      </button>
    </div>
  );
}
