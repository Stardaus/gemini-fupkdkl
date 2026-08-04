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
    localStorage.setItem('fupkdkl_tour_completed', 'true');
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
    expect(screen.getAllByText(/Pejabat Kesihatan Daerah Kuala Langat/i).length).toBeGreaterThan(0);

    // Open settings to verify Build ID
    const settingsBtn = screen.getByRole('button', { name: /Open Settings/i });
    fireEvent.click(settingsBtn);
    expect(screen.getByText(/App Build ID/i)).toBeInTheDocument();
    const closeSettingsBtn = screen.getByRole('button', { name: /Close settings/i });
    fireEvent.click(closeSettingsBtn);

    // 3. Search execution
    const searchInput = screen.getByRole('searchbox', { name: /Search medications/i });
    fireEvent.change(searchInput, { target: { value: 'Amlodipine' } });

    await waitFor(() => {
      expect(screen.getByText('Amlodipine Besilate 5mg')).toBeInTheDocument();
    });

    // 4. Clear search
    const clearSearchBtn = screen.getByRole('button', { name: /Clear search query/i });
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

  it('renders Footer as a sibling to main (not inside it)', async () => {
    const { container } = render(<App />);
    
    // Accept disclaimer to render the main app
    const acceptBtn = await screen.findByRole('button', {
      name: /I Understand & Agree/i,
    });
    fireEvent.click(acceptBtn);

    const mainElement = container.querySelector('main');
    const footerElement = container.querySelector('footer');

    expect(mainElement).toBeInTheDocument();
    expect(footerElement).toBeInTheDocument();
    
    // Assert they share the same parent and are siblings
    expect(mainElement?.parentElement).toBe(footerElement?.parentElement);
    // Assert footer is not inside main
    expect(mainElement?.contains(footerElement)).toBe(false);
  });

  it('automatically launches tour on first launch when tour completion key is absent', async () => {
    localStorage.removeItem('fupkdkl_tour_completed');
    render(<App />);

    const acceptBtn = await screen.findByRole('button', {
      name: /I Understand & Agree/i,
    });
    fireEvent.click(acceptBtn);

    // Assert Tour step 1 is rendered
    await waitFor(() => {
      expect(screen.getByText('Search Medications')).toBeInTheDocument();
    });
    expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();

    // Skip tour
    const skipBtn = screen.getByRole('button', { name: /Skip Tour/i });
    fireEvent.click(skipBtn);

    expect(localStorage.getItem('fupkdkl_tour_completed')).toBe('true');
  });
});
