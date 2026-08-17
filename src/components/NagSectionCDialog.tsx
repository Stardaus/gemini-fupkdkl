import { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Search,
  BookOpen,
  Activity,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
} from 'lucide-react';
import {
  NAG_SECTION_C_DATA,
  NAG_CATEGORIES,
  NagCategory,
  NagCondition,
} from '../data/nagSectionC';

export interface NagSectionCDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialConditionId?: string | null;
  onSelectMedicationName?: (medName: string) => void;
}

export function NagSectionCDialog({
  isOpen,
  onClose,
  initialConditionId,
  onSelectMedicationName,
}: NagSectionCDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NagCategory>('All');
  const [expandedConditionId, setExpandedConditionId] = useState<string | null>(
    initialConditionId || null
  );

  useEffect(() => {
    if (initialConditionId) {
      setExpandedConditionId(initialConditionId);
    }
  }, [initialConditionId]);

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

  const filteredConditions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return NAG_SECTION_C_DATA.filter((cond) => {
      const matchCategory =
        selectedCategory === 'All' || cond.category === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;

      const matchSyndrome = cond.syndrome.toLowerCase().includes(q);
      const matchPathogens = cond.commonPathogens.toLowerCase().includes(q);
      const matchFirstLine = cond.firstLine.some(
        (r) =>
          r.drug.toLowerCase().includes(q) ||
          r.doseAdult.toLowerCase().includes(q) ||
          (r.note && r.note.toLowerCase().includes(q))
      );
      const matchAlt = cond.alternative.some(
        (r) =>
          r.drug.toLowerCase().includes(q) ||
          r.doseAdult.toLowerCase().includes(q) ||
          (r.note && r.note.toLowerCase().includes(q))
      );
      const matchRemarks = cond.clinicalRemarks.some((r) =>
        r.toLowerCase().includes(q)
      );

      return (
        matchSyndrome ||
        matchPathogens ||
        matchFirstLine ||
        matchAlt ||
        matchRemarks
      );
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="nag-dialog-title"
      className="fixed inset-0 m-auto z-50 w-[94vw] max-w-4xl h-[90vh] max-h-[850px] flex flex-col p-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/30">
            <BookOpen className="size-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                id="nag-dialog-title"
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100"
              >
                National Antibiotic Guideline (NAG)
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 rounded-md border border-brand-500/30">
                Section C: Primary Care
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Empirical Outpatient Antimicrobial Recommendations — Ministry of Health Malaysia (KKM)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close antibiotic guidelines"
          className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* CONTROLS: SEARCH & CATEGORY CHIPS */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 shrink-0">
        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="size-4" aria-hidden="true" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clinical syndrome, pathogen, or antibiotic name (e.g. AOM, Amoxicillin, UTI, Cellulitis)..."
            aria-label="Search National Antibiotic Guideline Section C"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear guideline search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {NAG_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer border ${
                selectedCategory === category
                  ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* BODY: SYNDROME ACCORDIONS */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5">
        {filteredConditions.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <AlertCircle className="size-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching clinical guidelines found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try searching with a different generic antibiotic name (e.g. Amoxicillin, Cloxacillin) or infection term.
            </p>
          </div>
        ) : (
          filteredConditions.map((cond: NagCondition) => {
            const isExpanded =
              expandedConditionId === cond.id || filteredConditions.length === 1;

            return (
              <div
                key={cond.id}
                id={cond.id}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-xl overflow-hidden transition-all shadow-xs"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedConditionId(isExpanded ? null : cond.id)
                  }
                  aria-expanded={isExpanded}
                  className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-700 dark:text-brand-300 rounded border border-brand-500/20">
                        {cond.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                        {cond.syndrome}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      <strong className="text-slate-600 dark:text-slate-300 font-semibold">Pathogens:</strong>{' '}
                      {cond.commonPathogens}
                    </p>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="p-3.5 sm:p-5 border-t border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900/60 space-y-4">
                    {/* First Line Section */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                        <ShieldCheck className="size-4" />
                        <span>FIRST-LINE ANTIMICROBIAL REGIMEN</span>
                      </div>
                      <div className="space-y-2">
                        {cond.firstLine.map((reg, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-1">
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {reg.drug}
                              </span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                                {reg.duration}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                              <div>
                                <span className="font-semibold text-slate-500 dark:text-slate-400">Adult:</span>{' '}
                                {reg.doseAdult}
                              </div>
                              {reg.dosePaed && (
                                <div>
                                  <span className="font-semibold text-slate-500 dark:text-slate-400">Paediatric:</span>{' '}
                                  {reg.dosePaed}
                                </div>
                              )}
                            </div>
                            {reg.note && (
                              <p className="text-[11px] text-emerald-700 dark:text-emerald-300/90 font-medium italic pt-1">
                                Note: {reg.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alternative Section */}
                    {cond.alternative.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                          <Activity className="size-4" />
                          <span>ALTERNATIVE / PENICILLIN-ALLERGIC REGIMEN</span>
                        </div>
                        <div className="space-y-2">
                          {cond.alternative.map((reg, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1.5"
                            >
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                  {reg.drug}
                                </span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300">
                                  {reg.duration}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <div>
                                  <span className="font-semibold text-slate-500 dark:text-slate-400">Adult:</span>{' '}
                                  {reg.doseAdult}
                                </div>
                                {reg.dosePaed && (
                                  <div>
                                    <span className="font-semibold text-slate-500 dark:text-slate-400">Paediatric:</span>{' '}
                                    {reg.dosePaed}
                                </div>
                              )}
                            </div>
                            {reg.note && (
                              <p className="text-[11px] text-amber-700 dark:text-amber-300/90 font-medium italic pt-1">
                                Note: {reg.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clinical Remarks & Pearls */}
                  {cond.clinicalRemarks.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        <Info className="size-4 text-brand-500 shrink-0" />
                        <span>Clinical Pearls & When to Refer</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1 leading-relaxed">
                        {cond.clinicalRemarks.map((remark, idx) => (
                          <li key={idx}>{remark}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cross Links to Formulary Medications */}
                  {onSelectMedicationName && cond.relatedMedications.length > 0 && (
                    <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        Formulary Lookups:
                      </span>
                      {cond.relatedMedications.map((medName) => (
                        <button
                          key={medName}
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectMedicationName(medName);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-500/10 hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/25 transition-all cursor-pointer"
                        >
                          <span>{medName}</span>
                          <FileText className="size-3 text-brand-600 dark:text-brand-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>

    {/* FOOTER */}
    <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <AlertCircle className="size-4 text-amber-500 shrink-0" />
        <span>Source: National Antimicrobial Guideline Malaysia (Section C Primary Care).</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://www.pharmacy.gov.my"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 border border-brand-500/20 transition-colors"
        >
          <span>Official MOH Portal</span>
          <ExternalLink className="size-3.5" />
        </a>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </dialog>
  );
}
