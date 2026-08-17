import { describe, it, expect } from 'vitest';
import { isAntibioticMedication, getRelatedNagPathways } from './antibioticClassifier';
import { Medication } from '../types/formulary';

describe('antibioticClassifier utility', () => {
  const baseMed: Medication = {
    id: 'med-1',
    name: 'Amlodipine Besilate 5mg Tablet',
    malBrands: 'MAL19984123A',
    fukkmSystemGroup: 'Cardiovascular System',
    mdc: 'MDC001',
    neml: 'Yes',
    methodOfPurchase: 'APPL',
    prescriberCategory: 'B',
    indications: 'Hypertension',
    prescribingRestrictions: '',
    dosage: '5mg OD',
    adverseReaction: '',
    contraindications: '',
    interactions: '',
    precautions: '',
    isQuota: false,
  };

  it('returns false for non-antibiotic medications', () => {
    expect(isAntibioticMedication(null)).toBe(false);
    expect(isAntibioticMedication(undefined)).toBe(false);
    expect(isAntibioticMedication(baseMed)).toBe(false);
    expect(getRelatedNagPathways(baseMed)).toEqual([]);
  });

  it('identifies antibiotics by generic name pattern', () => {
    const amoxMed = { ...baseMed, name: 'Amoxicillin 500mg Capsule' };
    expect(isAntibioticMedication(amoxMed)).toBe(true);

    const pathways = getRelatedNagPathways(amoxMed);
    expect(pathways.length).toBeGreaterThan(0);
    expect(pathways.some((p) => p.code === 'C1')).toBe(true); // Bronchitis/Pneumonia
    expect(pathways.some((p) => p.code === 'C2')).toBe(true); // AOM
    expect(pathways.some((p) => p.code === 'C3')).toBe(true); // Pharyngitis
  });

  it('identifies antibiotics by FUKKM System Group', () => {
    const antiInfectiveMed = {
      ...baseMed,
      name: 'Special Formulation Tablet',
      fukkmSystemGroup: 'Anti-Infective Drugs (Systemic)',
    };
    expect(isAntibioticMedication(antiInfectiveMed)).toBe(true);

    const pathways = getRelatedNagPathways(antiInfectiveMed);
    expect(pathways.length).toBe(9); // Fallback returns all 9 Section C pathways
  });

  it('correctly maps specific antibiotic classes to relevant pathways', () => {
    const cloxaMed = { ...baseMed, name: 'Cloxacillin 500mg Capsule' };
    const pathways = getRelatedNagPathways(cloxaMed);
    expect(pathways.some((p) => p.code === 'C6')).toBe(true); // Skin and Soft Tissue

    const nitroMed = { ...baseMed, name: 'Nitrofurantoin 100mg Tablet' };
    const nitroPathways = getRelatedNagPathways(nitroMed);
    expect(nitroPathways.some((p) => p.code === 'C7')).toBe(true); // UTI Non-Pregnancy
    expect(nitroPathways.some((p) => p.code === 'C8')).toBe(true); // UTI Pregnancy Asymptomatic
  });
});
