import { ShieldAlert, ChevronRight, FileText, Bookmark } from 'lucide-react';
import { Medication } from '../types/formulary';

export interface MedicationCardProps {
  medication: Medication;
  onSelect: (medication: Medication) => void;
}

export function MedicationCard({ medication, onSelect }: MedicationCardProps) {
  const { name, isQuota, prescriberCategory, mdc } = medication;

  const containerClasses = isQuota
    ? 'group relative w-full text-left bg-amber-50/50 dark:bg-slate-800/90 border-l-4 border-l-amber-500 border-y border-r border-amber-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.12)] hover:shadow-[0_0_22px_rgba(245,158,11,0.25)] hover:border-l-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'
    : 'group relative w-full text-left bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/70 hover:border-brand-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';

  return (
    <button
      type="button"
      onClick={() => onSelect(medication)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(medication);
        }
      }}
      aria-label={`View details for ${name}`}
      className={containerClasses}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold text-base sm:text-lg transition-colors truncate ${
                isQuota
                  ? 'text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400'
              }`}
            >
              {name}
            </h3>

            {isQuota && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 shadow-xs shrink-0">
                <ShieldAlert className="size-3.5 text-slate-950" aria-hidden="true" />
                Quota Control
              </span>
            )}

            {prescriberCategory && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700/90 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600/60 shrink-0">
                <Bookmark className="size-3 mr-1 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                Cat {prescriberCategory}
              </span>
            )}
          </div>

          {mdc && (
            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 font-mono tabular-nums truncate font-medium">
              <FileText className="size-3.5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />
              <span>MDC: {mdc}</span>
            </p>
          )}
        </div>

        <div
          className={`transition-colors p-1 rounded-lg shrink-0 self-center ${
            isQuota
              ? 'text-amber-500/80 group-hover:text-amber-500'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-500'
          }`}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </div>
      </div>
    </button>
  );
}
