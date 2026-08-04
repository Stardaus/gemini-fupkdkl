import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from './Footer';

describe('Footer component', () => {
  it('renders copyright and organization details in minimal layout', () => {
    render(<Footer />);

    expect(screen.getByText(/Pejabat Kesihatan Daerah Kuala Langat/i)).toBeInTheDocument();
    expect(screen.getByText(/Official Clinical Reference Guide/i)).toBeInTheDocument();
  });

  it('handles settings button click when onOpenSettings is provided', () => {
    const handleOpenSettings = vi.fn();
    render(<Footer onOpenSettings={handleOpenSettings} />);

    const settingsBtn = screen.getByRole('button', { name: /Settings/i });
    expect(settingsBtn).toBeInTheDocument();

    fireEvent.click(settingsBtn);
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('renders as a single row with compact vertical padding', () => {
    const { container } = render(<Footer />);
    const footerElement = container.querySelector('footer');
    
    // Assert compact vertical padding
    expect(footerElement).toHaveClass('py-1.5');
    
    // Assert single flex row layout
    const innerContainer = footerElement?.firstElementChild;
    expect(innerContainer).toHaveClass('flex', 'flex-row');
    expect(innerContainer).not.toHaveClass('flex-col');
  });
});
