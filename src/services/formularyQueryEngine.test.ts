import { describe, it, expect } from 'vitest';
import { FormularyQueryEngine } from './formularyQueryEngine';
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
    prescribingRestrictions: '',
    dosage: '5mg daily',
    adverseReaction: '',
    contraindications: '',
    interactions: '',
    precautions: '',
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
    indications: 'Hypertension',
    prescribingRestrictions: 'PKD Quota Control',
    dosage: '4mg daily',
    adverseReaction: '',
    contraindications: '',
    interactions: '',
    precautions: '',
    isQuota: true,
  },
];

describe('FormularyQueryEngine deep query engine', () => {
  it('returns all medications and correct counts when query is empty', () => {
    const engine = new FormularyQueryEngine(mockMeds);
    const result = engine.query('', 'ALL');

    expect(result.displayed).toHaveLength(2);
    expect(result.totalCount).toBe(2);
    expect(result.quotaCount).toBe(1);
  });

  it('filters by search term using MiniSearch fuzzy matching', () => {
    const engine = new FormularyQueryEngine(mockMeds);
    const result = engine.query('Amlodipine', 'ALL');

    expect(result.displayed).toHaveLength(1);
    expect(result.displayed[0].name).toBe('Amlodipine Besilate 5mg');
  });

  it('filters by QUOTA_ONLY filter category', () => {
    const engine = new FormularyQueryEngine(mockMeds);
    const result = engine.query('', 'QUOTA_ONLY');

    expect(result.displayed).toHaveLength(1);
    expect(result.displayed[0].name).toBe('Perindopril Erbumine 4mg');
  });
});
