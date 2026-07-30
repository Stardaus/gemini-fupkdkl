import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MedicationCard } from './MedicationCard';
import { Medication } from '../types/formulary';

const mockMed: Medication = {
  id: 'med-1',
  name: 'Paracetamol 500mg Tablet',
  malBrands: 'MAL19870012A (Panadol)',
  fukkmSystemGroup: 'Central Nervous System',
  mdc: 'MDC00301',
  neml: 'Yes',
  methodOfPurchase: 'APPL',
  prescriberCategory: 'C',
  indications: 'Mild to moderate pain, pyrexia',
  prescribingRestrictions: 'None',
  dosage: '500mg-1000mg q4-6h',
  adverseReaction: 'Rash',
  contraindications: 'Hepatic impairment',
  interactions: 'Warfarin',
  precautions: 'Alcohol',
  isQuota: false,
};

describe('MedicationCard component', () => {
  it('renders medication name, category, and mdc code', () => {
    render(<MedicationCard medication={mockMed} onSelect={() => {}} />);
    expect(screen.getByText('Paracetamol 500mg Tablet')).toBeInTheDocument();
    expect(screen.getByText('Cat C')).toBeInTheDocument();
    expect(screen.getByText('MDC: MDC00301')).toBeInTheDocument();
  });

  it('triggers onSelect on click or Enter keypress', () => {
    const handleSelect = vi.fn();
    render(<MedicationCard medication={mockMed} onSelect={handleSelect} />);

    const card = screen.getByRole('button', { name: /View details for Paracetamol/i });
    fireEvent.click(card);
    expect(handleSelect).toHaveBeenCalledWith(mockMed);

    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });
});
