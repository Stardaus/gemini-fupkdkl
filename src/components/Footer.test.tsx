import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from './Footer';

describe('Footer component', () => {
  it('renders app build version, data version, and organization details', () => {
    render(
      <Footer
        versionInfo={{ version: '1785409094', lastChecked: Date.now() }}
        onCheckUpdate={() => {}}
      />
    );

    expect(screen.getByText(/District Drug Formulary PKD Kuala Langat/i)).toBeInTheDocument();
    expect(screen.getByText(/Build:/i)).toBeInTheDocument();
    expect(screen.getByText(/Data: v1785409094/i)).toBeInTheDocument();
    expect(screen.getByText(/Pejabat Kesihatan Daerah Kuala Langat/i)).toBeInTheDocument();
  });

  it('handles manual check update click with async feedback', async () => {
    const handleCheck = vi.fn().mockResolvedValue({ hasUpdate: false });
    render(
      <Footer
        versionInfo={null}
        onCheckUpdate={handleCheck}
      />
    );

    const checkBtn = screen.getByRole('button', { name: /Check for updates/i });
    await act(async () => {
      fireEvent.click(checkBtn);
    });
    expect(handleCheck).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Up to Date ✓/i)).toBeInTheDocument();
  });
});
