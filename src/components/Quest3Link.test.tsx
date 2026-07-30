import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Quest3Link } from './Quest3Link';

describe('Quest3Link component', () => {
  it('renders N/A when malString is empty or N/A', () => {
    render(<Quest3Link malString="N/A" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('parses MAL number and renders anchor link targeting Quest3+ portal', () => {
    render(<Quest3Link malString="MAL19984123A (Norvasc)" />);

    const link = screen.getByRole('link', {
      name: /Inspect MAL19984123A on Quest3\+ BPFK Portal/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://quest3plus.bpfk.gov.my/pmo2/detail.php?type=product&id=MAL19984123A'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('(Norvasc)')).toBeInTheDocument();
  });
});
