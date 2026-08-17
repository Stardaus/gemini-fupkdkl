import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NagSectionCDialog } from './NagSectionCDialog';

describe('NagSectionCDialog component', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <NagSectionCDialog isOpen={false} onClose={() => {}} />
    );
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('renders NAG Section C title, search, categories, and syndrome list when open', () => {
    const handleClose = vi.fn();
    render(<NagSectionCDialog isOpen={true} onClose={handleClose} />);

    expect(
      screen.getByRole('heading', { name: /National Antibiotic Guideline/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Section C: Primary Care')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search clinical syndrome/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Acute Otitis Media (AOM)')).toBeInTheDocument();
  });

  it('filters syndromes by search query', () => {
    render(<NagSectionCDialog isOpen={true} onClose={() => {}} />);

    const searchInput = screen.getByPlaceholderText(/Search clinical syndrome/i);
    fireEvent.change(searchInput, { target: { value: 'Cellulitis' } });

    expect(
      screen.getByText(/Cellulitis & Erysipelas/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Acute Otitis Media (AOM)')
    ).not.toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /Clear guideline search/i });
    fireEvent.click(clearBtn);
    expect(searchInput).toHaveValue('');
  });

  it('filters syndromes by category chips', () => {
    render(<NagSectionCDialog isOpen={true} onClose={() => {}} />);

    const urinaryBtn = screen.getByRole('button', { name: 'Urinary Tract' });
    fireEvent.click(urinaryBtn);

    expect(
      screen.getByText(/Acute Uncomplicated Cystitis/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Cellulitis & Erysipelas/i)
    ).not.toBeInTheDocument();
  });

  it('expands and collapses syndrome accordions', () => {
    render(<NagSectionCDialog isOpen={true} onClose={() => {}} />);

    const aomBtn = screen.getByRole('button', {
      name: /Acute Otitis Media \(AOM\)/i,
    });
    fireEvent.click(aomBtn);

    expect(
      screen.getByText(/FIRST-LINE ANTIMICROBIAL REGIMEN/i)
    ).toBeInTheDocument();
  });

  it('triggers onSelectMedicationName and closes dialog when cross-link is clicked', () => {
    const handleSelectMed = vi.fn();
    const handleClose = vi.fn();

    render(
      <NagSectionCDialog
        isOpen={true}
        onClose={handleClose}
        initialConditionId="nag-pharyngitis"
        onSelectMedicationName={handleSelectMed}
      />
    );

    const amoxBtn = screen.getByRole('button', { name: /Amoxicillin/i });
    fireEvent.click(amoxBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleSelectMed).toHaveBeenCalledWith('Amoxicillin');
  });

  it('handles backdrop click and close button to trigger onClose', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <NagSectionCDialog isOpen={true} onClose={handleClose} />
    );

    const closeBtn = screen.getByRole('button', { name: /Close antibiotic guidelines/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const dialog = container.querySelector('dialog');
    if (dialog) {
      fireEvent.click(dialog);
      expect(handleClose).toHaveBeenCalledTimes(2);

      fireEvent(dialog, new Event('close'));
      expect(handleClose).toHaveBeenCalledTimes(3);
    }
  });

  it('displays empty state when no matching guidelines found', () => {
    render(<NagSectionCDialog isOpen={true} onClose={() => {}} />);

    const searchInput = screen.getByPlaceholderText(/Search clinical syndrome/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistentcondition' } });

    expect(
      screen.getByText(/No matching clinical guidelines found/i)
    ).toBeInTheDocument();
  });
});
