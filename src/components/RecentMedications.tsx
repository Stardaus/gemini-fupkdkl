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
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
          <Clock className="size-4" />
          <span>Recent Searches</span>
        </div>
        <button
          type="button"
          onClick={onClearRecent}
          aria-label="Clear recent search history"
          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-all active:scale-95 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/40"
        >
          <Trash2 className="size-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentMeds.map((med) => (
          <button
            key={med.id}
            type="button"
            onClick={() => onSelectMedication(med)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 hover:border-brand-500/50 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-all active:scale-95 text-left shadow-sm group"
          >
            <span className="truncate max-w-[200px]">{med.name}</span>
            <ChevronRight className="size-3.5 text-slate-400 group-hover:text-brand-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
