import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RecentMedications } from './RecentMedications';
import { Medication } from '../types/formulary';

const mockMeds: Medication[] = [
  {
    id: 'med-1',
    name: 'Salbutamol 100mcg Inhaler',
    malBrands: 'MAL19950890A',
    fukkmSystemGroup: 'Respiratory',
    mdc: 'MDC00405',
    neml: 'Yes',
    methodOfPurchase: 'APPL',
    prescriberCategory: 'C',
    indications: 'Asthma',
    prescribingRestrictions: '',
    dosage: '1-2 puffs prn',
    adverseReaction: '',
    contraindications: '',
    interactions: '',
    precautions: '',
    isQuota: false,
  },
];

describe('RecentMedications component', () => {
  it('renders nothing when recentMeds is empty', () => {
    const { container } = render(
      <RecentMedications
        recentMeds={[]}
        onSelectMedication={() => {}}
        onClearRecent={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders recent lookup pills and handles selection and clear button', () => {
    const handleSelect = vi.fn();
    const handleClear = vi.fn();

    render(
      <RecentMedications
        recentMeds={mockMeds}
        onSelectMedication={handleSelect}
        onClearRecent={handleClear}
      />
    );

    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    expect(screen.getByText('Salbutamol 100mcg Inhaler')).toBeInTheDocument();

    const pill = screen.getByRole('button', { name: /Salbutamol 100mcg Inhaler/i });
    fireEvent.click(pill);
    expect(handleSelect).toHaveBeenCalledWith(mockMeds[0]);

    const clearBtn = screen.getByRole('button', { name: /Clear recent search history/i });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
