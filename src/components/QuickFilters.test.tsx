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

    expect(screen.getByText('All Medications')).toBeInTheDocument();
    expect(screen.getByText('Quota Drugs')).toBeInTheDocument();

    const quotaBtn = screen.getByRole('button', { name: /Quota Drugs/i });
    fireEvent.click(quotaBtn);
    expect(handleSelect).toHaveBeenCalledWith('QUOTA_ONLY');
  });
});
