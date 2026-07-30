export interface Medication {
  id: string;
  name: string;
  malBrands: string;
  fukkmSystemGroup: string;
  mdc: string;
  neml: string;
  methodOfPurchase: string;
  prescriberCategory: string;
  indications: string;
  prescribingRestrictions: string;
  dosage: string;
  adverseReaction: string;
  contraindications: string;
  interactions: string;
  precautions: string;
  isQuota: boolean;
}

export interface VersionInfo {
  version: string;
  contentHash?: string;
  lastChecked: number;
}

export type FilterCategory = 'ALL' | 'QUOTA_ONLY';
