import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App';
import { clearDB, saveMedications } from './services/db';
import { Medication } from './types/formulary';

const mockMeds: Medication[] = [
  {
    id: 'med-1',
    name: 'Amlodipine Besilate 5mg',
    malBrands: 'MAL19984123A (Norvasc)',
    fukkmSystemGroup: 'Cardiovascular',
    mdc: 'MDC00123',
    neml: 'Yes',
    methodOfPurchase: 'APPL',
    prescriberCategory: 'B',
    indications: 'Hypertension',
    prescribingRestrictions: '',
    dosage: '5mg daily',
    adverseReaction: 'Edema',
    contraindications: 'Hypotension',
    interactions: 'CYP3A4',
    precautions: 'Hepatic',
    isQuota: false,
  },
  {
    id: 'med-2',
    name: 'Perindopril Erbumine 4mg',
    malBrands: 'MAL20010111A (Coversyl)',
    fukkmSystemGroup: 'Cardiovascular',
    mdc: 'MDC00155',
    neml: 'Yes',
    methodOfPurchase: 'APPL',
    prescriberCategory: 'B',
    indications: 'Hypertension, Heart Failure',
    prescribingRestrictions: 'PKD Quota Control',
    dosage: '4mg daily',
    adverseReaction: 'Cough',
    contraindications: 'Angioedema',
    interactions: 'NSAIDs',
    precautions: 'Renal',
    isQuota: true,
  },
];

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

describe('Formulari App integration', () => {
  beforeEach(async () => {
    await clearDB();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders application title, handles disclaimer acceptance, search, filter, and theme toggle', async () => {
    await saveMedications(mockMeds);

    render(<App />);

    // 1. Disclaimer acceptance
    const acceptBtn = await screen.findByRole('button', {
      name: /I Understand & Agree/i,
    });
    fireEvent.click(acceptBtn);

    // 2. Title rendering
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/Build:/i).length).toBeGreaterThan(0);

    // 3. Search execution
    const searchInput = screen.getByRole('textbox', { name: /Search medications/i });
    fireEvent.change(searchInput, { target: { value: 'Amlodipine' } });

    await waitFor(() => {
      expect(screen.getByText('Amlodipine Besilate 5mg')).toBeInTheDocument();
    });

    // 4. Clear search
    const clearSearchBtn = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearSearchBtn);

    // 5. Quick filter toggle with Quota Drugs label
    const quotaFilterBtn = screen.getByRole('button', { name: /Quota Drugs/i });
    fireEvent.click(quotaFilterBtn);

    expect(screen.getByText('Perindopril Erbumine 4mg')).toBeInTheDocument();

    // 6. Select medication to open detail dialog
    const medCard = screen.getByRole('button', { name: /View details for Perindopril/i });
    fireEvent.click(medCard);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeDialogBtn = screen.getByRole('button', { name: /Close medication details/i });
    fireEvent.click(closeDialogBtn);

    // 7. Theme toggle
    const themeBtn = screen.getByRole('button', { name: /Switch to light mode/i });
    fireEvent.click(themeBtn);
    expect(localStorage.getItem('formulary_theme')).toBe('light');
  });
});
