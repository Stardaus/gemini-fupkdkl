import { describe, it, expect } from 'vitest';
import { createSearchIndex, searchMedications } from './searchEngine';
import { Medication } from '../types/formulary';

const mockMeds: Medication[] = [
  {
    id: 'med-1',
    name: 'Amlodipine Besilate 5mg',
    malBrands: 'MAL19984123A (Norvasc)',
    fukkmSystemGroup: 'Cardiovascular',
    mdc: 'MDC00123',
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
  },
  {
    id: 'med-2',
    name: 'Perindopril Erbumine 4mg',
    malBrands: 'MAL20010111A (Coversyl)',
    fukkmSystemGroup: 'Cardiovascular',
    mdc: 'MDC00155',
    neml: 'Yes',
    methodOfPurchase: 'APPL',
    prescriberCategory: 'B',
    indications: 'Hypertension, Heart Failure',
    prescribingRestrictions: 'Kawalan Kuota PKD',
    dosage: '4mg daily',
    adverseReaction: 'Cough',
    contraindications: 'Angioedema',
    interactions: 'NSAIDs',
    precautions: 'Renal',
    isQuota: true,
  },
];

describe('searchEngine service', () => {
  it('returns all medications when query is empty', () => {
    const index = createSearchIndex(mockMeds);
    const results = searchMedications(index, mockMeds, '');
    expect(results).toHaveLength(2);
  });

  it('matches medication by generic name with fuzzy typo tolerance', () => {
    const index = createSearchIndex(mockMeds);
    // Typo: 'amlodpine' instead of 'amlodipine'
    const results = searchMedications(index, mockMeds, 'amlodpine');
    expect(results).toHaveLength(1);
    expect(results[0].name).toContain('Amlodipine');
  });

  it('matches medication by MAL brand or indication', () => {
    const index = createSearchIndex(mockMeds);
    const resultsMAL = searchMedications(index, mockMeds, 'Norvasc');
    expect(resultsMAL).toHaveLength(1);
    expect(resultsMAL[0].id).toBe('med-1');

    const resultsIndication = searchMedications(index, mockMeds, 'Heart Failure');
    expect(resultsIndication).toHaveLength(1);
    expect(resultsIndication[0].id).toBe('med-2');
  });
});
