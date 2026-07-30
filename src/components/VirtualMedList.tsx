import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Medication } from '../types/formulary';
import { MedicationCard } from './MedicationCard';
import { SearchX } from 'lucide-react';

export interface VirtualMedListProps {
  medications: Medication[];
  onSelectMedication: (medication: Medication) => void;
}

export function VirtualMedList({
  medications,
  onSelectMedication,
}: VirtualMedListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: medications.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 110,
    overscan: 5,
  });

  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl space-y-3 my-4">
        <div className="p-3 bg-slate-100 dark:bg-slate-700/40 text-slate-400 rounded-full">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-300">
          No Medications Found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
          Please verify generic name spelling, MAL number, or clinical indication keywords.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      role="region"
      aria-label="Medication list"
      className="h-[60vh] min-h-[400px] overflow-y-auto pr-1 space-y-2 rounded-xl focus:outline-none"
    >
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const med = medications[virtualRow.index];
          return (
            <div
              key={med.id || virtualRow.index}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: '8px',
              }}
            >
              <MedicationCard
                medication={med}
                onSelect={onSelectMedication}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
