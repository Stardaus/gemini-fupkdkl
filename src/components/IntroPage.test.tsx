import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IntroPage } from './IntroPage';
import { Medication } from '../types/formulary';

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
    indications: 'Hypertension',
    prescribingRestrictions: 'PKD Quota Control',
    dosage: '4mg daily',
    adverseReaction: 'Cough',
    contraindications: 'Angioedema',
    interactions: 'NSAIDs',
    precautions: 'Renal',
    isQuota: true,
  },
];

describe('IntroPage component', () => {
  it('renders title, stats, and main sections', () => {
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={() => {}}
        onLaunchApp={() => {}}
        medications={mockMeds}
      />
    );

    expect(screen.getAllByText(/District Drug Formulary/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Try the Live Formulary Search')).toBeInTheDocument();
    expect(screen.getByText('Neon-Yellow Quota Alert System')).toBeInTheDocument();
    expect(screen.getByText('How to Install as a PWA App')).toBeInTheDocument();
  });

  it('triggers onLaunchApp when Launch App button is clicked', () => {
    const handleLaunch = vi.fn();
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={() => {}}
        onLaunchApp={handleLaunch}
        medications={mockMeds}
      />
    );

    const launchBtns = screen.getAllByRole('button', { name: /Launch App/i });
    fireEvent.click(launchBtns[0]);
    expect(handleLaunch).toHaveBeenCalledTimes(1);
  });

  it('filters medications in live search playground', () => {
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={() => {}}
        onLaunchApp={() => {}}
        medications={mockMeds}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Type drug name/i);
    fireEvent.change(searchInput, { target: { value: 'Amlodipine' } });

    expect(screen.getByText('Amlodipine Besilate 5mg')).toBeInTheDocument();
    expect(screen.queryByText('Perindopril Erbumine 4mg')).not.toBeInTheDocument();
  });

  it('toggles quota filter in live search playground', () => {
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={() => {}}
        onLaunchApp={() => {}}
        medications={mockMeds}
      />
    );

    const quotaBtn = screen.getByRole('button', { name: /Quota Control \(1\)/i });
    fireEvent.click(quotaBtn);

    expect(screen.getByText('Perindopril Erbumine 4mg')).toBeInTheDocument();
    expect(screen.queryByText('Amlodipine Besilate 5mg')).not.toBeInTheDocument();
  });

  it('triggers onToggleTheme when theme button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={handleToggle}
        onLaunchApp={() => {}}
        medications={mockMeds}
      />
    );

    const themeBtn = screen.getByRole('button', { name: /Switch to light mode/i });
    fireEvent.click(themeBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('clears search input when clear button is clicked', () => {
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={() => {}}
        onLaunchApp={() => {}}
        medications={mockMeds}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Type drug name/i);
    fireEvent.change(searchInput, { target: { value: 'Amlodipine' } });
    expect(searchInput).toHaveValue('Amlodipine');

    const clearBtn = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearBtn);
    expect(searchInput).toHaveValue('');
  });

  it('opens and closes medication preview modal', () => {
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={() => {}}
        onLaunchApp={() => {}}
        medications={mockMeds}
      />
    );

    const medCard = screen.getByRole('button', { name: /Amlodipine Besilate 5mg/i });
    fireEvent.click(medCard);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
    expect(screen.getByText('5mg daily')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close preview modal/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('switches active screenshot in showcase gallery', () => {
    render(
      <IntroPage
        theme="dark"
        onToggleTheme={() => {}}
        onLaunchApp={() => {}}
        medications={mockMeds}
      />
    );

    const screenshotBtns = screen.getAllByRole('button', { name: /Multi-Field Instant Search/i });
    fireEvent.click(screenshotBtns[0]);

    const activeImage = screen.getByAltText('Multi-Field Instant Search');
    expect(activeImage).toBeInTheDocument();
  });
});
