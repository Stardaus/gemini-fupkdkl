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
});
