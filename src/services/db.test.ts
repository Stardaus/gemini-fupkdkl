import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllMedications,
  saveMedications,
  getStoredVersion,
  saveStoredVersion,
  clearDB,
} from './db';
import { Medication, VersionInfo } from '../types/formulary';

const mockMed: Medication = {
  id: 'med-1-amlodipine',
  name: 'Amlodipine 5mg',
  malBrands: 'MAL12345678A',
  fukkmSystemGroup: 'Cardiovascular',
  mdc: 'MDC001',
  neml: 'Yes',
  methodOfPurchase: 'APPL',
  prescriberCategory: 'B',
  indications: 'Hypertension',
  prescribingRestrictions: 'None',
  dosage: '5mg daily',
  adverseReaction: 'Edema',
  contraindications: 'Hypotension',
  interactions: 'CYP3A4',
  precautions: 'Hepatic',
  isQuota: false,
};

describe('db service', () => {
  beforeEach(async () => {
    await clearDB();
  });

  it('saves and retrieves medications', async () => {
    await saveMedications([mockMed]);
    const meds = await getAllMedications();
    expect(meds).toHaveLength(1);
    expect(meds[0].name).toBe('Amlodipine 5mg');
  });

  it('saves and retrieves version info', async () => {
    const version: VersionInfo = { version: '2.1.0', lastChecked: 10002000 };
    await saveStoredVersion(version);
    const retrieved = await getStoredVersion();
    expect(retrieved).toEqual(version);
  });
});
