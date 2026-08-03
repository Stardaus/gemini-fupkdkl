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

    const settingsBtn = screen.getByRole('button', { name: /Settings & Info/i });
    expect(settingsBtn).toBeInTheDocument();

    fireEvent.click(settingsBtn);
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });
});
