import { Medication } from '../types/formulary';
import { NAG_SECTION_C_PATHWAYS, NagPathway } from '../data/nagSectionC';

const ANTIBIOTIC_SYSTEM_GROUPS = [
  'anti-infective',
  'anti infective',
  'antibacterial',
  'antibiotic',
  'antimicrobial',
  'anti-infeksi',
  'anti infeksi',
];

const KNOWN_ANTIBIOTIC_PATTERNS = [
  'amoxicillin',
  'ampicillin',
  'augmentin',
  'penicillin',
  'cloxacillin',
  'cephalexin',
  'cefaclor',
  'cefuroxime',
  'ceftriaxone',
  'cefotaxime',
  'ceftazidime',
  'cefepime',
  'cefixime',
  'azithromycin',
  'erythromycin',
  'clarithromycin',
  'doxycycline',
  'tetracycline',
  'minocycline',
  'ciprofloxacin',
  'levofloxacin',
  'moxifloxacin',
  'ofloxacin',
  'gentamicin',
  'amikacin',
  'tobramycin',
  'nitrofurantoin',
  'metronidazole',
  'tinidazole',
  'clindamycin',
  'lincomycin',
  'cotrimoxazole',
  'trimethoprim',
  'sulfamethoxazole',
  'fosfomycin',
  'pivmecillinam',
  'mupirocin',
  'fusidic acid',
  'chloramphenicol',
  'vancomycin',
  'polymyxin',
  'neomycin',
  'bacitracin',
];

export function isAntibioticMedication(medication: Partial<Medication> | null | undefined): boolean {
  if (!medication) return false;

  const systemGroup = (medication.fukkmSystemGroup || '').toLowerCase();
  const name = (medication.name || '').toLowerCase();

  // Check 1: System Group contains anti-infective / antibacterial indicators
  const isAntiInfectiveGroup = ANTIBIOTIC_SYSTEM_GROUPS.some((g) =>
    systemGroup.includes(g)
  );

  // Check 2: Name contains known antibiotic molecule patterns
  const hasAntibioticName = KNOWN_ANTIBIOTIC_PATTERNS.some((pattern) =>
    name.includes(pattern)
  );

  return isAntiInfectiveGroup || hasAntibioticName;
}

export function getRelatedNagPathways(medication: Partial<Medication> | null | undefined): NagPathway[] {
  if (!medication || !isAntibioticMedication(medication)) {
    return [];
  }

  const name = (medication.name || '').toLowerCase();

  const directMatches = NAG_SECTION_C_PATHWAYS.filter((pathway) =>
    pathway.relatedMedications.some((relMed) =>
      name.includes(relMed.toLowerCase())
    )
  );

  // If specific pathways match, return them; otherwise return all Section C pathways as reference
  return directMatches.length > 0 ? directMatches : NAG_SECTION_C_PATHWAYS;
}
