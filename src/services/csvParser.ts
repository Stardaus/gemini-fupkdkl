import Papa from 'papaparse';
import { Medication } from '../types/formulary';

export function parseFormularyCSV(csvText: string): Medication[] {
  if (!csvText || !csvText.trim()) {
    return [];
  }

  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors && result.errors.length > 0 && result.data.length === 0) {
    return [];
  }

  return result.data
    .filter((row) => row && Object.keys(row).length > 0)
    .map((row, index) => sanitizeMedicationRow(row, index));
}

function sanitizeMedicationRow(
  row: Record<string, string>,
  index: number
): Medication {
  const getVal = (...keys: string[]): string => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) {
        return row[key].trim();
      }
      // Case insensitive fallback
      const foundKey = Object.keys(row).find(
        (k) => k.toLowerCase() === key.toLowerCase()
      );
      if (foundKey && row[foundKey] !== undefined) {
        return row[foundKey].trim();
      }
    }
    return '';
  };

  const name = getVal('Generic Name', 'Name', 'Medication Name', 'Nama Generik');
  const malBrands = getVal(
    'MAL Registration / Brand Names',
    'MAL_Brands',
    'MAL Brands',
    'MAL Registration Number',
    'MAL Number',
    'Jenama MAL'
  );
  const restrictions = getVal(
    'Prescribing Restrictions',
    'Restrictions',
    'Sekatan Preskripsi'
  );
  const quotaRaw = getVal('is_quota', 'Quota Control', 'Is Quota', 'Kawalan Kuota');

  const isQuota = checkIsQuota(quotaRaw, restrictions, name);

  return {
    id: `med-${index}-${slugify(name || 'drug')}`,
    name: name || 'Unknown Medication',
    malBrands: malBrands || 'N/A',
    fukkmSystemGroup: getVal(
      'FUKKM System/Group',
      'FUKKM System Group',
      'System Group',
      'Kumpulan Sistem'
    ),
    mdc: getVal('MDC Code', 'MDC', 'Kod MDC'),
    neml: getVal('NEML', 'Status NEML'),
    methodOfPurchase: getVal('Method of Purchase', 'Cara Pembelian'),
    prescriberCategory: getVal(
      'Prescriber Category',
      'Category',
      'Kategori Preskriber'
    ),
    indications: getVal('Clinical Indications', 'Indications', 'Indikasi Klinikal'),
    prescribingRestrictions: restrictions,
    dosage: getVal('Dosage', 'Dosage / Administration', 'Dos'),
    adverseReaction: getVal('Adverse Reaction', 'Adverse Reactions', 'Kesan Sampingan'),
    contraindications: getVal('Contraindications', 'Kontraindikasi'),
    interactions: getVal('Interactions', 'Drug Interactions', 'Interaksi Ubat'),
    precautions: getVal('Precautions', 'Langkah Berjaga-jaga'),
    isQuota,
  };
}

function checkIsQuota(quotaRaw: string, restrictions: string, name: string): boolean {
  const combined = `${quotaRaw} ${restrictions} ${name}`.toLowerCase();
  if (
    quotaRaw.toLowerCase() === 'yes' ||
    quotaRaw.toLowerCase() === 'true' ||
    quotaRaw === '1'
  ) {
    return true;
  }
  return (
    combined.includes('kawalan kuota') ||
    combined.includes('kuota pkd') ||
    combined.includes('quota control')
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
