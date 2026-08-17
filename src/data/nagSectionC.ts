export const MOH_NAG_SECTION_C_URL =
  'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care?authuser=0';

export interface NagPathway {
  code: string;
  title: string;
  description: string;
  commonPathogens?: string;
  url: string;
  relatedMedications: string[];
}

export const NAG_SECTION_C_PATHWAYS: NagPathway[] = [
  {
    code: 'C1',
    title: 'Acute Bronchitis and Pneumonia',
    description: 'Outpatient clinical pathway for acute lower respiratory tract infections and community-acquired pneumonia.',
    commonPathogens: 'Streptococcus pneumoniae, Mycoplasma pneumoniae, H. influenzae',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Amoxicillin',
      'Amoxicillin / Clavulanate',
      'Augmentin',
      'Azithromycin',
      'Erythromycin',
      'Doxycycline',
      'Cefuroxime',
    ],
  },
  {
    code: 'C2',
    title: 'Acute Otitis Media',
    description: 'Empirical antimicrobial regimen and watchful waiting criteria for acute middle ear infections.',
    commonPathogens: 'Streptococcus pneumoniae, Haemophilus influenzae, Moraxella catarrhalis',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Amoxicillin',
      'Amoxicillin / Clavulanate',
      'Augmentin',
      'Cefuroxime',
      'Azithromycin',
      'Erythromycin',
    ],
  },
  {
    code: 'C3',
    title: 'Acute Pharyngitis',
    description: 'Centor criteria assessment and antibiotic recommendations for Group A Streptococcal tonsillopharyngitis.',
    commonPathogens: 'Streptococcus pyogenes (Group A Streptococcus)',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Phenoxymethylpenicillin',
      'Penicillin V',
      'Amoxicillin',
      'Erythromycin',
      'Azithromycin',
      'Cephalexin',
    ],
  },
  {
    code: 'C4',
    title: 'Acute Rhinosinusitis',
    description: 'Management algorithm differentiating viral upper respiratory infections from acute bacterial rhinosinusitis.',
    commonPathogens: 'Streptococcus pneumoniae, Haemophilus influenzae, Moraxella catarrhalis',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Amoxicillin',
      'Amoxicillin / Clavulanate',
      'Augmentin',
      'Doxycycline',
      'Cefuroxime',
    ],
  },
  {
    code: 'C5',
    title: 'Acute Gastroenteritis',
    description: 'Primary rehydration therapy and selective antibiotic indications for severe invasive bacterial enteritis.',
    commonPathogens: 'Campylobacter, Shigella, Salmonella, Vibrio cholerae',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Azithromycin',
      'Ciprofloxacin',
      'Cotrimoxazole',
      'Trimethoprim',
      'Metronidazole',
    ],
  },
  {
    code: 'C6',
    title: 'Skin and Soft Tissue Infection',
    description: 'Clinical pathways for impetigo, folliculitis, cellulitis, erysipelas, abscesses, and animal/human bites.',
    commonPathogens: 'Staphylococcus aureus, Streptococcus pyogenes, Pasteurella multocida',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Cloxacillin',
      'Cephalexin',
      'Amoxicillin / Clavulanate',
      'Augmentin',
      'Mupirocin',
      'Fusidic Acid',
      'Erythromycin',
      'Clindamycin',
      'Doxycycline',
      'Metronidazole',
    ],
  },
  {
    code: 'C7',
    title: 'Urinary Tract Infection in Non-Pregnancy',
    description: 'Empirical treatment protocols for acute uncomplicated lower cystitis and mild outpatient pyelonephritis.',
    commonPathogens: 'Escherichia coli, Klebsiella pneumoniae, Proteus mirabilis',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Nitrofurantoin',
      'Pivmecillinam',
      'Fosfomycin',
      'Cotrimoxazole',
      'Trimethoprim',
      'Cephalexin',
      'Ciprofloxacin',
      'Amoxicillin / Clavulanate',
    ],
  },
  {
    code: 'C8',
    title: 'Urinary Tract Infection in Pregnancy (Asymptomatic Bacteriuria)',
    description: 'Screening and safe antimicrobial treatment regimens for asymptomatic bacteriuria during antenatal care.',
    commonPathogens: 'Escherichia coli, Group B Streptococcus, Klebsiella pneumoniae',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Nitrofurantoin',
      'Cephalexin',
      'Amoxicillin / Clavulanate',
      'Augmentin',
      'Amoxicillin',
    ],
  },
  {
    code: 'C9',
    title: 'Urinary Tract Infection in Pregnancy (Symptomatic)',
    description: 'Safe empirical prescribing for acute symptomatic cystitis and pyelonephritis in pregnant women.',
    commonPathogens: 'Escherichia coli, Klebsiella pneumoniae, Proteus mirabilis',
    url: MOH_NAG_SECTION_C_URL,
    relatedMedications: [
      'Cephalexin',
      'Amoxicillin / Clavulanate',
      'Augmentin',
      'Nitrofurantoin',
      'Cefuroxime',
    ],
  },
];
