import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';
import { Medication } from '../types/formulary';

const mockRecentMeds: Medication[] = [
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
    adverseReaction: '',
    contraindications: '',
    interactions: '',
    precautions: '',
    isQuota: false,
  }
];

describe('SearchBar component', () => {
  it('renders input with value and handles change events', () => {
    const handleChange = vi.fn();
    const handleClear = vi.fn();

    render(
      <SearchBar
        value="amlodipine"
        onChange={handleChange}
        onClear={handleClear}
      />
    );

    const input = screen.getByRole('searchbox', { name: /Search medications/i });
    expect(input).toHaveValue('amlodipine');

    fireEvent.change(input, { target: { value: 'metformin' } });
    expect(handleChange).toHaveBeenCalledWith('metformin');
  });

  it('renders clear button when value is present and triggers clear callback', () => {
    const handleClear = vi.fn();
    render(
      <SearchBar value="salbutamol" onChange={() => {}} onClear={handleClear} />
    );

    const clearBtn = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('shows recent meds dropdown on focus when query is empty and handles selection', () => {
    const handleSelectRecent = vi.fn();
    
    render(
      <SearchBar 
        value="" 
        onChange={() => {}} 
        onClear={() => {}} 
        recentMeds={mockRecentMeds}
        onSelectRecentMed={handleSelectRecent}
      />
    );

    const input = screen.getByRole('searchbox', { name: /Search medications/i });
    
    // Dropdown should not be visible initially
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    
    // Focus input
    fireEvent.focus(input);
    
    // Dropdown should appear
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Amlodipine Besilate 5mg')).toBeInTheDocument();
    
    // Select recent med
    const recentMedBtn = screen.getByText('Amlodipine Besilate 5mg');
    fireEvent.mouseDown(recentMedBtn);
    
    expect(handleSelectRecent).toHaveBeenCalledWith(mockRecentMeds[0]);
  });

  it('hides recent meds dropdown when user types', () => {
    const { rerender } = render(
      <SearchBar 
        value="" 
        onChange={() => {}} 
        onClear={() => {}} 
        recentMeds={mockRecentMeds}
      />
    );

    const input = screen.getByRole('searchbox', { name: /Search medications/i });
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Re-render with value to simulate typing
    rerender(
      <SearchBar 
        value="Aml" 
        onChange={() => {}} 
        onClear={() => {}} 
        recentMeds={mockRecentMeds}
      />
    );
    
    // Dropdown should hide
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
  
  it('handles clear recent meds action', () => {
    const handleClearRecent = vi.fn();
    
    render(
      <SearchBar 
        value="" 
        onChange={() => {}} 
        onClear={() => {}} 
        recentMeds={mockRecentMeds}
        onClearRecentMeds={handleClearRecent}
      />
    );

    const input = screen.getByRole('searchbox', { name: /Search medications/i });
    fireEvent.focus(input);
    
    const clearRecentBtn = screen.getByRole('button', { name: /Clear recent search history/i });
    fireEvent.mouseDown(clearRecentBtn);
    
    expect(handleClearRecent).toHaveBeenCalledTimes(1);
  });
  
  it('hides recent meds dropdown on blur with delay', () => {
    vi.useFakeTimers();
    
    render(
      <SearchBar 
        value="" 
        onChange={() => {}} 
        onClear={() => {}} 
        recentMeds={mockRecentMeds}
      />
    );

    const input = screen.getByRole('searchbox', { name: /Search medications/i });
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Blur input
    fireEvent.blur(input);
    
    // Still in document immediately due to delay
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Advance timers past 150ms delay
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    // Now it should be hidden
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
