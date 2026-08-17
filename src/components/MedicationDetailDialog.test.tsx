import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MedicationDetailDialog } from './MedicationDetailDialog';
import { Medication } from '../types/formulary';

const mockMed: Medication = {
  id: 'med-1',
  name: 'Amlodipine Besilate 5mg Tablet',
  malBrands: 'MAL19984123A (Norvasc)',
  fukkmSystemGroup: 'Cardiovascular System',
  mdc: 'MDC00123',
  neml: 'Yes',
  methodOfPurchase: 'Centralized Contract',
  prescriberCategory: 'B',
  indications: 'Hypertension, Angina',
  prescribingRestrictions: 'PKD Quota Control',
  dosage: '5mg once daily',
  adverseReaction: 'Peripheral edema',
  contraindications: 'Severe hypotension',
  interactions: 'CYP3A4 inhibitors',
  precautions: 'Severe hepatic impairment',
  isQuota: true,
};

describe('MedicationDetailDialog component', () => {
  it('renders medication detail modal with clinical sections when open', () => {
    const handleClose = vi.fn();
    render(
      <MedicationDetailDialog
        medication={mockMed}
        isOpen={true}
        onClose={handleClose}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Amlodipine Besilate 5mg Tablet' })
    ).toBeInTheDocument();
    expect(screen.getByText('Clinical Indications')).toBeInTheDocument();
    expect(screen.getByText('Hypertension, Angina')).toBeInTheDocument();
    expect(screen.getByText('Dosage & Administration')).toBeInTheDocument();
    expect(screen.getByText('Adverse Reactions')).toBeInTheDocument();
    expect(screen.getByText('Contraindications')).toBeInTheDocument();
    expect(screen.getByText('Drug Interactions')).toBeInTheDocument();
    expect(screen.getByText('Precautions')).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <MedicationDetailDialog
        medication={mockMed}
        isOpen={true}
        onClose={handleClose}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /Close medication details/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders prescribing restrictions neutrally if value is "None"', () => {
    const handleClose = vi.fn();
    const mockNoneMed = { ...mockMed, prescribingRestrictions: 'None', isQuota: false };
    
    render(
      <MedicationDetailDialog
        medication={mockNoneMed}
        isOpen={true}
        onClose={handleClose}
      />
    );

    // Should NOT have the amber warning header
    expect(screen.queryByText('Prescribing Restrictions / Quota Control')).not.toBeInTheDocument();
    
    // Should render the neutral header
    expect(screen.getByText('Prescribing Restrictions')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('renders amber warning for active prescribing restrictions', () => {
    const handleClose = vi.fn();
    
    render(
      <MedicationDetailDialog
        medication={mockMed} // mockMed has 'PKD Quota Control' and isQuota: true
        isOpen={true}
        onClose={handleClose}
      />
    );

    // Should have the amber warning header
    expect(screen.getByText('Prescribing Restrictions / Quota Control')).toBeInTheDocument();
    expect(screen.queryByText('Prescribing Restrictions', { exact: true })).not.toBeInTheDocument();
  });

  it('handles backdrop click and native close event to trigger onClose', () => {
    const handleClose = vi.fn();
    const { container, rerender } = render(
      <MedicationDetailDialog
        medication={mockMed}
        isOpen={true}
        onClose={handleClose}
      />
    );

    const dialog = container.querySelector('dialog');
    if (dialog) {
      fireEvent.click(dialog);
      expect(handleClose).toHaveBeenCalled();

      fireEvent(dialog, new Event('close'));
      expect(handleClose).toHaveBeenCalled();
    }

    rerender(
      <MedicationDetailDialog
        medication={mockMed}
        isOpen={false}
        onClose={handleClose}
      />
    );
  });

  it('renders MOH NAG Section C recommendation card with pathways and external link for antibiotics', () => {
    const handleClose = vi.fn();

    const amoxicillinMed: Medication = {
      ...mockMed,
      id: 'amox-1',
      name: 'Amoxicillin Trihydrate 500mg Capsule',
    };

    render(
      <MedicationDetailDialog
        medication={amoxicillinMed}
        isOpen={true}
        onClose={handleClose}
      />
    );

    expect(
      screen.getByText('National Antibiotic Guideline (NAG)')
    ).toBeInTheDocument();
    expect(screen.getByText('Section C: Primary Care')).toBeInTheDocument();
    expect(
      screen.getByText(/Ministry of Health Malaysia \(MOH\) National Antimicrobial Guideline/i)
    ).toBeInTheDocument();

    // Verify pathway badges
    expect(screen.getByText(/Acute Bronchitis and Pneumonia/i)).toBeInTheDocument();
    expect(screen.getByText(/Acute Otitis Media/i)).toBeInTheDocument();

    // Verify external link anchor targeting MOH Google Sites
    const nagLink = screen.getByRole('link', {
      name: /Open MOH Section C Clinical Pathways in Primary Care Guideline/i,
    });
    expect(nagLink).toHaveAttribute(
      'href',
      'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care?authuser=0'
    );
    expect(nagLink).toHaveAttribute('target', '_blank');
    expect(nagLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render NAG Section C card for non-antibiotic medications', () => {
    render(
      <MedicationDetailDialog
        medication={mockMed} // Amlodipine
        isOpen={true}
        onClose={() => {}}
      />
    );

    expect(
      screen.queryByText('National Antibiotic Guideline (NAG)')
    ).not.toBeInTheDocument();
  });
});
