import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualMedList } from './VirtualMedList';
import { Medication } from '../types/formulary';

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 110,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        start: index * 110,
        size: 110,
      })),
  }),
}));

const mockMeds: Medication[] = [
  {
    id: 'med-1',
    name: 'Metformin 500mg Tablet',
    malBrands: 'MAL19910456A',
    fukkmSystemGroup: 'Endocrine',
    mdc: 'MDC00210',
    neml: 'Yes',
    methodOfPurchase: 'APPL',
    prescriberCategory: 'C',
    indications: 'Diabetes',
    prescribingRestrictions: '',
    dosage: '500mg bd',
    adverseReaction: '',
    contraindications: '',
    interactions: '',
    precautions: '',
    isQuota: false,
  },
];

describe('VirtualMedList component', () => {
  it('renders empty state when medications array is empty', () => {
    render(<VirtualMedList medications={[]} onSelectMedication={() => {}} />);
    expect(screen.getByText('No Medications Found')).toBeInTheDocument();
  });

  it('renders virtualized medication list container', () => {
    render(
      <VirtualMedList medications={mockMeds} onSelectMedication={() => {}} />
    );
    expect(
      screen.getByRole('region', { name: /Medication list/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Metformin 500mg Tablet')).toBeInTheDocument();
  });
});
