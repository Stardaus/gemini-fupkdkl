import { useEffect, useRef } from 'react';
import {
  X,
  ShieldAlert,
  FileText,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Stethoscope,
  Info,
  Bookmark,
} from 'lucide-react';
import { Medication } from '../types/formulary';
import { Quest3Link } from './Quest3Link';

export interface MedicationDetailDialogProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MedicationDetailDialog({
  medication,
  isOpen,
  onClose,
}: MedicationDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  if (!medication) return null;

  const {
    name,
    isQuota,
    prescriberCategory,
    malBrands,
    fukkmSystemGroup,
    mdc,
    neml,
    methodOfPurchase,
    indications,
    dosage,
    adverseReaction,
    contraindications,
    interactions,
    precautions,
    prescribingRestrictions,
  } = medication;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="dialog-title"
      className="fixed inset-0 m-auto z-50 w-[92vw] max-w-2xl max-h-[85vh] p-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm overflow-hidden"
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 shrink-0">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="dialog-title"
                className={`text-lg sm:text-xl font-bold text-balance ${
                  isQuota
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                {name}
              </h2>
              {isQuota && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 border border-amber-400 shadow-sm">
                  <ShieldAlert className="size-3.5 text-slate-950" />
                  PKD Quota Control
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {prescriberCategory && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  <Bookmark className="size-3 mr-1 text-brand-500" />
                  Category {prescriberCategory}
                </span>
              )}
              {fukkmSystemGroup && (
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                  {fukkmSystemGroup}
                </span>
              )}
              {mdc && (
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono tabular-nums text-slate-600 dark:text-slate-400">
                  MDC: {mdc}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close medication details"
            className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* MAL Registration & Metadata */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <FileText className="size-4 text-brand-500" />
                MAL Registration No. / Commercial Brands:
              </span>
              <Quest3Link malString={malBrands} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/40 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">NEML Status: </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{neml || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Method of Purchase: </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{methodOfPurchase || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* 7 Conditional Clinical Detail Sections */}

          {indications && (
            <Section title="Clinical Indications" icon={<Stethoscope className="size-4 text-brand-500" />}>
              <p className="text-slate-800 dark:text-slate-200 text-pretty leading-relaxed">{indications}</p>
            </Section>
          )}

          {dosage && (
            <Section title="Dosage & Administration" icon={<Activity className="size-4 text-emerald-500" />}>
              <p className="text-slate-800 dark:text-slate-200 text-pretty leading-relaxed whitespace-pre-line">{dosage}</p>
            </Section>
          )}

          {prescribingRestrictions && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="size-4 text-amber-500" />
                Prescribing Restrictions / Quota Control
              </h3>
              <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3.5">
                <p className="text-amber-900 dark:text-amber-200 text-pretty leading-relaxed font-medium">{prescribingRestrictions}</p>
              </div>
            </div>
          )}

          {adverseReaction && (
            <Section title="Adverse Reactions" icon={<AlertTriangle className="size-4 text-rose-500" />}>
              <p className="text-slate-800 dark:text-slate-200 text-pretty leading-relaxed">{adverseReaction}</p>
            </Section>
          )}

          {contraindications && (
            <Section title="Contraindications" icon={<X className="size-4 text-red-500" />}>
              <p className="text-slate-800 dark:text-slate-200 text-pretty leading-relaxed">{contraindications}</p>
            </Section>
          )}

          {interactions && (
            <Section title="Drug Interactions" icon={<Info className="size-4 text-sky-500" />}>
              <p className="text-slate-800 dark:text-slate-200 text-pretty leading-relaxed">{interactions}</p>
            </Section>
          )}

          {precautions && (
            <Section title="Precautions" icon={<CheckCircle2 className="size-4 text-purple-500" />}>
              <p className="text-slate-800 dark:text-slate-200 text-pretty leading-relaxed">{precautions}</p>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 rounded-xl p-3.5">
        {children}
      </div>
    </div>
  );
}
