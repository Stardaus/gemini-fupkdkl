import { Medication } from '../types/formulary';
import { NAG_SECTION_C_PATHWAYS, NagPathway } from '../data/nagSectionC';

export const FUKKM_ANTIBACTERIAL_SYSTEM_GROUP =
  'Antiinfectives for Systemic Use > Antibacterials for Systemic Use';

/**
 * Evaluates whether a medication belongs to the FUKKM Antibacterials system group
 * ("Antiinfectives for Systemic Use > Antibacterials for Systemic Use").
 */
export function isAntibioticMedication(
  medication: Partial<Medication> | null | undefined
): boolean {
  if (!medication || !medication.fukkmSystemGroup) return false;

  const systemGroup = medication.fukkmSystemGroup.toLowerCase();

  return (
    systemGroup.includes('antibacterials for systemic use') ||
    systemGroup.includes('antiinfectives for systemic use') ||
    systemGroup.includes('antibacterial')
  );
}

/**
 * Returns relevant NAG Section C primary care clinical pathways (C1–C9)
 * for an antibiotic formulation based on its generic name, or all Section C
 * pathways as clinical reference if no specific sub-pathway matches.
 */
export function getRelatedNagPathways(
  medication: Partial<Medication> | null | undefined
): NagPathway[] {
  if (!medication || !isAntibioticMedication(medication)) {
    return [];
  }

  const name = (medication.name || '').toLowerCase();

  const directMatches = NAG_SECTION_C_PATHWAYS.filter((pathway) =>
    pathway.relatedMedications.some((relMed) =>
      name.includes(relMed.toLowerCase())
    )
  );

  return directMatches.length > 0 ? directMatches : NAG_SECTION_C_PATHWAYS;
}
