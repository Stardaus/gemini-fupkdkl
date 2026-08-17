import { describe, it, expect } from 'vitest';
import {
  isAntibioticMedication,
  getRelatedNagPathways,
  FUKKM_ANTIBACTERIAL_SYSTEM_GROUP,
} from './antibioticClassifier';
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

  it('returns false for non-antibiotic medications or empty inputs', () => {
    expect(isAntibioticMedication(null)).toBe(false);
    expect(isAntibioticMedication(undefined)).toBe(false);
    expect(isAntibioticMedication(baseMed)).toBe(false);
    expect(getRelatedNagPathways(baseMed)).toEqual([]);
  });

  it('identifies antibiotics by FUKKM System & Group value', () => {
    const amoxMed = {
      ...baseMed,
      name: 'Amoxicillin 500mg Capsule',
      fukkmSystemGroup: FUKKM_ANTIBACTERIAL_SYSTEM_GROUP,
    };
    expect(isAntibioticMedication(amoxMed)).toBe(true);

    const pathways = getRelatedNagPathways(amoxMed);
    expect(pathways.length).toBeGreaterThan(0);
    expect(pathways.some((p) => p.code === 'C1')).toBe(true); // Bronchitis/Pneumonia
    expect(pathways.some((p) => p.code === 'C2')).toBe(true); // AOM
    expect(pathways.some((p) => p.code === 'C3')).toBe(true); // Pharyngitis
  });

  it('returns all 9 Section C pathways as reference when formulation is in group without specific sub-pathway', () => {
    const genericAntibacterial = {
      ...baseMed,
      name: 'Novel Antibacterial Formulation 200mg',
      fukkmSystemGroup: 'Antiinfectives for Systemic Use > Antibacterials for Systemic Use',
    };
    expect(isAntibioticMedication(genericAntibacterial)).toBe(true);

    const pathways = getRelatedNagPathways(genericAntibacterial);
    expect(pathways.length).toBe(9);
  });

  it('correctly maps specific antibiotic classes to relevant pathways', () => {
    const cloxaMed = {
      ...baseMed,
      name: 'Cloxacillin 500mg Capsule',
      fukkmSystemGroup: 'Antiinfectives for Systemic Use > Antibacterials for Systemic Use',
    };
    const pathways = getRelatedNagPathways(cloxaMed);
    expect(pathways.some((p) => p.code === 'C6')).toBe(true); // Skin and Soft Tissue

    const nitroMed = {
      ...baseMed,
      name: 'Nitrofurantoin 100mg Tablet',
      fukkmSystemGroup: 'Antiinfectives for Systemic Use > Antibacterials for Systemic Use',
    };
    const nitroPathways = getRelatedNagPathways(nitroMed);
    expect(nitroPathways.some((p) => p.code === 'C7')).toBe(true); // UTI Non-Pregnancy
    expect(nitroPathways.some((p) => p.code === 'C8')).toBe(true); // UTI Pregnancy Asymptomatic
  });
});
