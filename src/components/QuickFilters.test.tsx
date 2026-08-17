import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuickFilters } from './QuickFilters';

describe('QuickFilters component', () => {
  it('renders filter buttons and responds to click selection', () => {
    const handleSelect = vi.fn();
    render(
      <QuickFilters
        activeFilter="ALL"
        onSelectFilter={handleSelect}
        totalCount={12}
        quotaCount={3}
      />
    );

    expect(screen.getByText(/All Medications/i)).toBeInTheDocument();
    expect(screen.getByText(/Quota Drugs/i)).toBeInTheDocument();

    const quotaBtn = screen.getByRole('button', { name: /Filter by Quota Control Drugs/i });
    fireEvent.click(quotaBtn);
    expect(handleSelect).toHaveBeenCalledWith('QUOTA_ONLY');

    const allBtn = screen.getByRole('button', { name: /Filter by All Medications/i });
    fireEvent.click(allBtn);
    expect(handleSelect).toHaveBeenCalledWith('ALL');
  });
});
