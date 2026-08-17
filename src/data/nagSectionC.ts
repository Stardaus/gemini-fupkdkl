export interface NagRegimen {
  drug: string;
  doseAdult: string;
  dosePaed?: string;
  duration: string;
  note?: string;
}

export interface NagCondition {
  id: string;
  category: string;
  syndrome: string;
  commonPathogens: string;
  firstLine: NagRegimen[];
  alternative: NagRegimen[];
  clinicalRemarks: string[];
  relatedMedications: string[];
}

export const NAG_CATEGORIES = [
  'All',
  'Respiratory & ENT',
  'Skin & Soft Tissue',
  'Urinary Tract',
  'Gastrointestinal',
  'Sexually Transmitted',
  'Dental & Oral',
] as const;

export type NagCategory = (typeof NAG_CATEGORIES)[number];

export const NAG_SECTION_C_DATA: NagCondition[] = [
  {
    id: 'nag-pharyngitis',
    category: 'Respiratory & ENT',
    syndrome: 'Acute Pharyngitis / Tonsillitis (Group A Streptococcus)',
    commonPathogens: 'Streptococcus pyogenes (Group A Beta-hemolytic Streptococcus)',
    firstLine: [
      {
        drug: 'Phenoxymethylpenicillin (Penicillin V)',
        doseAdult: '500 mg QID (or 1000 mg BD)',
        dosePaed: '25-50 mg/kg/day in 3-4 divided doses',
        duration: '10 days',
        note: 'Complete 10-day course to prevent Acute Rheumatic Fever',
      },
      {
        drug: 'Amoxicillin',
        doseAdult: '500 mg TDS (or 1000 mg BD)',
        dosePaed: '50 mg/kg/day in 2-3 divided doses',
        duration: '10 days',
      },
    ],
    alternative: [
      {
        drug: 'Erythromycin Ethylsuccinate (EES)',
        doseAdult: '400-800 mg QID',
        dosePaed: '30-50 mg/kg/day in 4 divided doses',
        duration: '10 days',
        note: 'For Penicillin-allergic patients',
      },
      {
        drug: 'Azithromycin',
        doseAdult: '500 mg OD',
        dosePaed: '10-12 mg/kg/day OD',
        duration: '5 days',
        note: 'Alternative macrolide for compliance',
      },
      {
        drug: 'Cephalexin',
        doseAdult: '500 mg BD or QID',
        dosePaed: '25-50 mg/kg/day in 2-4 divided doses',
        duration: '10 days',
        note: 'For non-severe penicillin allergy only',
      },
    ],
    clinicalRemarks: [
      'Most pharyngitis cases are viral (Rhinovirus, Adenovirus, EBV). Antibiotics only indicated if Centor criteria >= 3 or confirmed GAS.',
      'Centor Criteria: Tonsillar exudates, Tender anterior cervical adenopathy, History of fever, Absence of cough.',
      'Symptomatic relief with Paracetamol / NSAIDs and warm saline gargle is primary management for viral presentations.',
    ],
    relatedMedications: [
      'Amoxicillin',
      'Phenoxymethylpenicillin',
      'Erythromycin',
      'Azithromycin',
      'Cephalexin',
    ],
  },
  {
    id: 'nag-otitis-media',
    category: 'Respiratory & ENT',
    syndrome: 'Acute Otitis Media (AOM)',
    commonPathogens: 'Streptococcus pneumoniae, Haemophilus influenzae, Moraxella catarrhalis',
    firstLine: [
      {
        drug: 'Amoxicillin',
        doseAdult: '500-875 mg TDS (High dose: up to 1000 mg TDS)',
        dosePaed: '80-90 mg/kg/day in 2-3 divided doses',
        duration: '5-7 days (10 days in children <2 years or severe disease)',
      },
    ],
    alternative: [
      {
        drug: 'Amoxicillin / Clavulanate (Augmentin)',
        doseAdult: '625 mg TDS (or 1000 mg BD)',
        dosePaed: '45-90 mg/kg/day (amoxicillin component) in 2 divided doses',
        duration: '7-10 days',
        note: 'If no clinical response within 48-72 hours or recent amoxicillin in past 30 days',
      },
      {
        drug: 'Cefuroxime Axetil',
        doseAdult: '500 mg BD',
        dosePaed: '30 mg/kg/day in 2 divided doses',
        duration: '5-7 days',
        note: 'For non-type 1 penicillin allergic patients',
      },
      {
        drug: 'Azithromycin',
        doseAdult: '500 mg on Day 1, then 250 mg OD for Days 2-5',
        dosePaed: '10 mg/kg on Day 1, then 5 mg/kg OD for Days 2-5',
        duration: '5 days',
      },
    ],
    clinicalRemarks: [
      'In mild AOM in children >=2 years without severe otalgia or fever >=39°C, watchful waiting with analgesia for 48 hours is acceptable.',
      'Immediate antibiotics indicated if age <6 months, bilateral AOM in age <2 years, or presence of otorrhea.',
    ],
    relatedMedications: [
      'Amoxicillin',
      'Amoxicillin / Clavulanate',
      'Cefuroxime',
      'Azithromycin',
    ],
  },
  {
    id: 'nag-sinusitis',
    category: 'Respiratory & ENT',
    syndrome: 'Acute Bacterial Rhinosinusitis (ABRS)',
    commonPathogens: 'Streptococcus pneumoniae, Haemophilus influenzae, Moraxella catarrhalis',
    firstLine: [
      {
        drug: 'Amoxicillin / Clavulanate',
        doseAdult: '625 mg TDS (or 1000 mg BD)',
        dosePaed: '45 mg/kg/day in 2 divided doses',
        duration: '5-7 days for adults (10 days for children)',
      },
      {
        drug: 'Amoxicillin',
        doseAdult: '500-875 mg TDS',
        dosePaed: '80-90 mg/kg/day in 2-3 divided doses',
        duration: '5-7 days',
      },
    ],
    alternative: [
      {
        drug: 'Doxycycline',
        doseAdult: '100 mg BD',
        duration: '5-7 days',
        note: 'For Penicillin-allergic adults (contraindicated in pregnancy & children <8y)',
      },
      {
        drug: 'Cefuroxime Axetil',
        doseAdult: '500 mg BD',
        dosePaed: '30 mg/kg/day in 2 divided doses',
        duration: '5-7 days',
      },
    ],
    clinicalRemarks: [
      'Differentiate viral from bacterial: Bacterial suspected if symptoms persist >10 days without improvement, severe onset (fever >=39°C + purulent nasal discharge for 3-4 days), or "double status" (worsening after initial recovery).',
      'Nasal saline irrigation and intranasal corticosteroids provide adjunct symptomatic relief.',
    ],
    relatedMedications: [
      'Amoxicillin',
      'Amoxicillin / Clavulanate',
      'Doxycycline',
      'Cefuroxime',
    ],
  },
  {
    id: 'nag-cap-outpatient',
    category: 'Respiratory & ENT',
    syndrome: 'Community-Acquired Pneumonia (CAP - Mild / Outpatient)',
    commonPathogens: 'Streptococcus pneumoniae, Mycoplasma pneumoniae, Chlamydia pneumoniae, H. influenzae',
    firstLine: [
      {
        drug: 'Amoxicillin',
        doseAdult: '1000 mg TDS (High dose)',
        dosePaed: '80-90 mg/kg/day in 2-3 divided doses',
        duration: '5 days',
        note: 'For previously healthy patients without comorbidities',
      },
      {
        drug: 'Amoxicillin / Clavulanate',
        doseAdult: '625 mg TDS (or 1000 mg BD)',
        duration: '5-7 days',
        note: 'For patients with comorbidities (DM, COPD, CKD, heart disease)',
      },
    ],
    alternative: [
      {
        drug: 'Azithromycin',
        doseAdult: '500 mg OD',
        dosePaed: '10 mg/kg/day OD',
        duration: '3-5 days',
        note: 'Add to beta-lactam if atypical pneumonia suspected, or standalone if penicillin allergic',
      },
      {
        drug: 'Doxycycline',
        doseAdult: '100 mg BD',
        duration: '5-7 days',
        note: 'For penicillin-allergic adults without comorbidities',
      },
    ],
    clinicalRemarks: [
      'Assess severity using CRB-65 score: Confusion, Respiratory rate >= 30, Blood pressure (SBP <90 or DBP <=60), Age >= 65.',
      'CRB-65 = 0: Suitable for outpatient oral treatment.',
      'CRB-65 >= 1 or SpO2 < 95% on room air: Refer to hospital emergency department for admission assessment.',
    ],
    relatedMedications: [
      'Amoxicillin',
      'Amoxicillin / Clavulanate',
      'Azithromycin',
      'Doxycycline',
    ],
  },
  {
    id: 'nag-impetigo',
    category: 'Skin & Soft Tissue',
    syndrome: 'Impetigo & Ecthyma',
    commonPathogens: 'Staphylococcus aureus (MSSA), Streptococcus pyogenes',
    firstLine: [
      {
        drug: 'Topical Mupirocin 2% Ointment / Cream',
        doseAdult: 'Apply to affected lesions TDS',
        dosePaed: 'Apply to affected lesions TDS',
        duration: '5 days',
        note: 'For localized mild non-bullous lesions',
      },
      {
        drug: 'Cloxacillin',
        doseAdult: '500 mg QID (taken on empty stomach)',
        dosePaed: '50 mg/kg/day in 4 divided doses',
        duration: '7 days',
        note: 'For widespread, multiple, or bullous lesions',
      },
      {
        drug: 'Cephalexin',
        doseAdult: '500 mg QID (or BD)',
        dosePaed: '25-50 mg/kg/day in 2-4 divided doses',
        duration: '7 days',
      },
    ],
    alternative: [
      {
        drug: 'Erythromycin / Azithromycin',
        doseAdult: 'Erythromycin 400-800 mg QID or Azithromycin 500 mg OD',
        dosePaed: 'Standard paediatric dosing',
        duration: '5-7 days',
        note: 'For Penicillin-allergic individuals',
      },
    ],
    clinicalRemarks: [
      'Soak crusts with warm water or chlorhexidine before applying topical ointment.',
      'Good personal hygiene, regular hand washing, and keeping towels/clothes separate to prevent household transmission.',
    ],
    relatedMedications: [
      'Cloxacillin',
      'Cephalexin',
      'Erythromycin',
      'Azithromycin',
    ],
  },
  {
    id: 'nag-cellulitis',
    category: 'Skin & Soft Tissue',
    syndrome: 'Cellulitis & Erysipelas (Mild / Non-purulent Outpatient)',
    commonPathogens: 'Streptococcus pyogenes, Staphylococcus aureus',
    firstLine: [
      {
        drug: 'Cloxacillin',
        doseAdult: '500 mg - 1000 mg QID',
        dosePaed: '50-100 mg/kg/day in 4 divided doses',
        duration: '5-7 days',
        note: 'Take 1 hour before or 2 hours after meals for optimal absorption',
      },
      {
        drug: 'Cephalexin',
        doseAdult: '500 mg QID',
        dosePaed: '25-50 mg/kg/day in 4 divided doses',
        duration: '5-7 days',
      },
    ],
    alternative: [
      {
        drug: 'Amoxicillin / Clavulanate',
        doseAdult: '625 mg TDS',
        duration: '5-7 days',
        note: 'Preferred if bite-related, water exposure, or diabetic foot involvement',
      },
      {
        drug: 'Clindamycin',
        doseAdult: '300-450 mg TDS or QID',
        dosePaed: '10-20 mg/kg/day in 3-4 divided doses',
        duration: '5-7 days',
        note: 'For severe Penicillin allergy',
      },
    ],
    clinicalRemarks: [
      'Mark the border of erythema with a surgical marker pen to objectively monitor progression or resolution.',
      'Elevate the affected limb to reduce dependent edema.',
      'Red flags for urgent hospital transfer: Systemic toxicity, hypotension, crepitus, rapid progression, bullae, severe out-of-proportion pain (suspect Necrotizing Fasciitis).',
    ],
    relatedMedications: [
      'Cloxacillin',
      'Cephalexin',
      'Amoxicillin / Clavulanate',
      'Clindamycin',
    ],
  },
  {
    id: 'nag-bites',
    category: 'Skin & Soft Tissue',
    syndrome: 'Animal & Human Bites (Prophylaxis & Treatment)',
    commonPathogens: 'Pasteurella multocida (cats/dogs), Eikenella corrodens (humans), Capnocytophaga, Anaerobes, Staph/Strep',
    firstLine: [
      {
        drug: 'Amoxicillin / Clavulanate',
        doseAdult: '625 mg TDS (or 1000 mg BD)',
        dosePaed: '45-90 mg/kg/day (amoxicillin) in 2 divided doses',
        duration: '3-5 days for prophylaxis; 7-10 days for established infection',
      },
    ],
    alternative: [
      {
        drug: 'Doxycycline + Metronidazole',
        doseAdult: 'Doxycycline 100 mg BD + Metronidazole 400 mg TDS',
        duration: '7-10 days',
        note: 'For Penicillin-allergic adults (Pasteurella + Anaerobe coverage)',
      },
      {
        drug: 'Ciprofloxacin + Metronidazole',
        doseAdult: 'Ciprofloxacin 500 mg BD + Metronidazole 400 mg TDS',
        duration: '7-10 days',
        note: 'Alternative combination for adults',
      },
    ],
    clinicalRemarks: [
      'Thorough high-pressure wound irrigation with normal saline or potable water is the most critical intervention.',
      'Avoid primary closure/suturing of bite wounds except on face/cosmetic areas.',
      'Check Tetanus toxoid vaccination status and consider Rabies post-exposure prophylaxis based on animal risk assessment.',
    ],
    relatedMedications: [
      'Amoxicillin / Clavulanate',
      'Doxycycline',
      'Metronidazole',
      'Ciprofloxacin',
    ],
  },
  {
    id: 'nag-uti-cystitis',
    category: 'Urinary Tract',
    syndrome: 'Acute Uncomplicated Cystitis (Females)',
    commonPathogens: 'Escherichia coli, Staphylococcus saprophyticus, Klebsiella pneumoniae, Proteus mirabilis',
    firstLine: [
      {
        drug: 'Nitrofurantoin (Macrobid / Monohydrate)',
        doseAdult: '100 mg BD (or 50 mg QID for microcrystals)',
        duration: '5 days',
        note: 'Avoid if eGFR < 30 mL/min or in 3rd trimester pregnancy near term',
      },
      {
        drug: 'Fosfomycin Trometamol',
        doseAdult: '3 g Single Sachet Dose',
        duration: 'Single dose',
        note: 'Dissolve in cold water before oral ingestion',
      },
    ],
    alternative: [
      {
        drug: 'Cotrimoxazole (Trimethoprim / Sulfamethoxazole 160/800 mg)',
        doseAdult: '1-2 tablets BD',
        duration: '3 days',
        note: 'Only if local E. coli resistance is known to be < 20%',
      },
      {
        drug: 'Cephalexin',
        doseAdult: '500 mg BD to TDS',
        dosePaed: '25-50 mg/kg/day in 2-3 divided doses',
        duration: '5-7 days',
        note: 'Safe in pregnancy',
      },
      {
        drug: 'Amoxicillin / Clavulanate',
        doseAdult: '625 mg BD',
        duration: '5-7 days',
      },
    ],
    clinicalRemarks: [
      'Routine urine culture is not mandatory for initial uncomplicated lower UTI in non-pregnant females.',
      'Always perform urine dipstick and urine culture for pregnant females, men, recurrent UTI, or treatment failures.',
      'Encourage adequate fluid intake and complete voiding.',
    ],
    relatedMedications: [
      'Nitrofurantoin',
      'Cotrimoxazole',
      'Cephalexin',
      'Amoxicillin / Clavulanate',
    ],
  },
  {
    id: 'nag-acute-pyelo',
    category: 'Urinary Tract',
    syndrome: 'Acute Uncomplicated Pyelonephritis (Mild / Outpatient)',
    commonPathogens: 'Escherichia coli, Klebsiella pneumoniae, Proteus mirabilis',
    firstLine: [
      {
        drug: 'Ciprofloxacin',
        doseAdult: '500 mg BD',
        duration: '7 days',
        note: 'Use with caution; avoid in pregnancy and children',
      },
      {
        drug: 'Amoxicillin / Clavulanate',
        doseAdult: '625 mg - 1000 mg TDS',
        duration: '10-14 days',
      },
    ],
    alternative: [
      {
        drug: 'Cefuroxime Axetil',
        doseAdult: '500 mg BD',
        duration: '10-14 days',
      },
      {
        drug: 'Cotrimoxazole (Trimethoprim / Sulfamethoxazole)',
        doseAdult: '2 tablets (160/800 mg) BD',
        duration: '14 days',
      },
    ],
    clinicalRemarks: [
      'Send urine microscopy and culture & sensitivity BEFORE starting empirical antibiotics.',
      'Outpatient management is only appropriate for mild cases without nausea/vomiting, hemodynamically stable, and with reliable follow-up.',
      'Refer to hospital if: high fever, vomiting, dehydration, pregnancy, solitary kidney, male patient, or toxic appearance.',
    ],
    relatedMedications: [
      'Ciprofloxacin',
      'Amoxicillin / Clavulanate',
      'Cefuroxime',
      'Cotrimoxazole',
    ],
  },
  {
    id: 'nag-ge-infectious',
    category: 'Gastrointestinal',
    syndrome: 'Infectious Diarrhoea / Acute Gastroenteritis',
    commonPathogens: 'Campylobacter jejuni, Shigella spp., Salmonella enterica, E. coli (ETEC/EPEC), Vibrio cholerae',
    firstLine: [
      {
        drug: 'Oral Rehydration Salts (ORS) + Fluid Therapy',
        doseAdult: 'Ad libitum to match fluid loss',
        dosePaed: '10-20 mL/kg per loose stool',
        duration: 'Ongoing until resolution',
        note: 'Primary cornerstone of management. Antibiotics NOT routinely indicated for uncomplicated watery diarrhoea.',
      },
      {
        drug: 'Azithromycin (When dysentery / severe bacterial confirmed)',
        doseAdult: '500 mg OD for 3 days (or 1000 mg single dose for cholera)',
        dosePaed: '10 mg/kg/day for 3 days',
        duration: '3 days',
        note: 'First-line antimicrobial if bloody diarrhoea / severe febrile dysentery',
      },
    ],
    alternative: [
      {
        drug: 'Ciprofloxacin',
        doseAdult: '500 mg BD',
        duration: '3 days',
        note: 'Alternative in non-pregnant adults with severe bacterial enteritis',
      },
      {
        drug: 'Cotrimoxazole',
        doseAdult: '2 tablets BD',
        dosePaed: 'Standard weight-based dosing',
        duration: '3-5 days',
      },
    ],
    clinicalRemarks: [
      'Most acute diarrhoea cases are viral (Rotavirus, Norovirus) and self-limiting within 3-5 days.',
      'Antibiotics indicated only for: Grossly bloody stools with fever (dysentery), suspected Cholera with severe dehydration, immunocompromised hosts, or specific culture confirmation.',
      'Avoid antimotility agents (Loperamide) in children and in acute invasive dysentery.',
    ],
    relatedMedications: [
      'Azithromycin',
      'Ciprofloxacin',
      'Cotrimoxazole',
      'Metronidazole',
    ],
  },
  {
    id: 'nag-sti-urethritis',
    category: 'Sexually Transmitted',
    syndrome: 'Urethritis & Cervicitis (Gonococcal & Chlamydia)',
    commonPathogens: 'Neisseria gonorrhoeae, Chlamydia trachomatis, Mycoplasma genitalium',
    firstLine: [
      {
        drug: 'Ceftriaxone (IM) + Azithromycin (Oral)',
        doseAdult: 'Ceftriaxone 500 mg IM stat (single dose) PLUS Azithromycin 1 g Oral stat',
        duration: 'Single dose combination',
        note: 'Dual therapy provides coverage for Gonorrhoea and Chlamydia',
      },
    ],
    alternative: [
      {
        drug: 'Cefixime + Doxycycline',
        doseAdult: 'Cefixime 400 mg Oral stat PLUS Doxycycline 100 mg BD for 7 days',
        duration: 'Cefixime stat + Doxycycline 7 days',
        note: 'Oral alternative if IM Ceftriaxone is unavailable',
      },
      {
        drug: 'Azithromycin (High dose)',
        doseAdult: '2 g Oral single dose',
        duration: 'Single dose',
        note: 'For severe beta-lactam / cephalosporin allergy',
      },
    ],
    clinicalRemarks: [
      'Treat all sexual partners within the past 60 days concurrently.',
      'Counsel patient to abstain from sexual intercourse for 7 days post-treatment and until partners are fully treated.',
      'Screen for other STIs including HIV, Syphilis (VDRL/TPHA), and Hepatitis B.',
    ],
    relatedMedications: [
      'Ceftriaxone',
      'Azithromycin',
      'Doxycycline',
      'Cefixime',
    ],
  },
  {
    id: 'nag-dental-abscess',
    category: 'Dental & Oral',
    syndrome: 'Acute Odontogenic / Dental Abscess & Periapical Infection',
    commonPathogens: 'Streptococcus viridans group, Peptostreptococcus, Fusobacterium, Prevotella',
    firstLine: [
      {
        drug: 'Amoxicillin',
        doseAdult: '500 mg TDS',
        dosePaed: '25-50 mg/kg/day in 3 divided doses',
        duration: '5 days',
      },
      {
        drug: 'Amoxicillin + Metronidazole',
        doseAdult: 'Amoxicillin 500 mg TDS PLUS Metronidazole 400 mg TDS',
        duration: '5 days',
        note: 'For severe, spreading, or foul-smelling anaerobic infections',
      },
    ],
    alternative: [
      {
        drug: 'Amoxicillin / Clavulanate',
        doseAdult: '625 mg TDS',
        duration: '5 days',
      },
      {
        drug: 'Erythromycin + Metronidazole',
        doseAdult: 'Erythromycin 400-800 mg QID + Metronidazole 400 mg TDS',
        duration: '5 days',
        note: 'For Penicillin-allergic individuals',
      },
      {
        drug: 'Clindamycin',
        doseAdult: '300 mg TDS',
        duration: '5 days',
      },
    ],
    clinicalRemarks: [
      'Definitive treatment requires dental intervention (drainage of abscess, root canal therapy, or tooth extraction).',
      'Antibiotics alone without surgical/dental drainage are insufficient for enclosed abscesses.',
      'Refer urgently to Oral Surgery if airway compromise, trismus, Ludwig angina, or orbital extension is observed.',
    ],
    relatedMedications: [
      'Amoxicillin',
      'Metronidazole',
      'Amoxicillin / Clavulanate',
      'Erythromycin',
      'Clindamycin',
    ],
  },
];

export function findNagConditionsForMedication(medName: string): NagCondition[] {
  if (!medName) return [];
  const normalized = medName.toLowerCase();
  return NAG_SECTION_C_DATA.filter((cond) =>
    cond.relatedMedications.some((relMed) =>
      normalized.includes(relMed.toLowerCase())
    )
  );
}
