import { useEffect, useRef } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export interface DisclaimerDialogProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function DisclaimerDialog({ isOpen, onAccept }: DisclaimerDialogProps) {
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

    const handleCancel = (e: Event) => {
      // Prevent closing modal via ESC before explicit agreement
      e.preventDefault();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 m-auto z-50 w-[92vw] max-w-lg p-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/90 text-slate-900 dark:text-slate-100 shadow-2xl backdrop:bg-slate-950/85 backdrop:backdrop-blur-md overflow-hidden"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="p-2.5 bg-brand-500/10 text-brand-500 rounded-xl border border-brand-500/20 shrink-0">
            <AlertCircle className="size-6" />
          </div>
          <div>
            <h2
              id="disclaimer-title"
              className="text-lg font-bold text-brand-600 dark:text-brand-300"
            >
              Medical Disclaimer & Terms of Use
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              District Drug Formulary PKD Kuala Langat v2
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 max-h-[50vh] overflow-y-auto">
          <p>
            This application is provided specifically as a reference guide and quick lookup tool for Medical Officers, Pharmacists, and Healthcare Personnel at Pejabat Kesihatan Daerah (PKD) Kuala Langat.
          </p>
          <p>
            Prescribing information, dosages, and drug quota restrictions are subject to current updates from the State Health Director Directives and the District Drug Committee.
          </p>
          <p className="text-amber-700 dark:text-amber-300/90 font-medium">
            Users are fully responsible for professionally verifying drug indications and dosages based on individual patient clinical conditions.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onAccept}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-900/40 focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
          >
            <ShieldCheck className="size-5" />
            I Understand & Agree
          </button>
        </div>
      </div>
    </dialog>
  );
}
