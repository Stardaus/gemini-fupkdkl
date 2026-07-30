import { Clock, Trash2, ChevronRight } from 'lucide-react';
import { Medication } from '../types/formulary';

export interface RecentMedicationsProps {
  recentMeds: Medication[];
  onSelectMedication: (medication: Medication) => void;
  onClearRecent: () => void;
}

export function RecentMedications({
  recentMeds,
  onSelectMedication,
  onClearRecent,
}: RecentMedicationsProps) {
  if (!recentMeds || recentMeds.length === 0) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2.5 sm:p-3 space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
          <Clock className="size-3.5" />
          <span>Recent Searches</span>
          <span className="px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 font-mono text-[10px] lowercase tracking-normal font-bold">
            {recentMeds.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClearRecent}
          aria-label="Clear recent search history"
          className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-all active:scale-95 px-1.5 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/40 cursor-pointer"
        >
          <Trash2 className="size-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 snap-x min-w-0">
        {recentMeds.map((med) => (
          <button
            key={med.id}
            type="button"
            onClick={() => onSelectMedication(med)}
            className="shrink-0 snap-start inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800/90 hover:bg-brand-500/10 dark:hover:bg-brand-500/20 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500/40 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-full transition-all active:scale-95 text-left shadow-sm group cursor-pointer"
          >
            <span className="truncate max-w-[130px] sm:max-w-[170px]">{med.name}</span>
            <ChevronRight className="size-3 text-slate-400 group-hover:text-brand-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
