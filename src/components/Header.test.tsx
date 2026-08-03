import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

describe('Header component', () => {
  it('renders application title, subtitle, and offline status badge', () => {
    render(<Header theme="dark" onToggleTheme={() => {}} />);

    expect(screen.getByText(/District Drug Formulary/i)).toBeInTheDocument();
    expect(screen.getByText(/PKD Kuala Langat/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Pejabat Kesihatan Daerah Kuala Langat|Kuala Langat District Health Office/i)
    ).toBeInTheDocument();
  });

  it('triggers onToggleTheme when theme button is clicked in light or dark mode', () => {
    const handleToggle = vi.fn();
    const { rerender } = render(<Header theme="dark" onToggleTheme={handleToggle} />);

    const themeBtn = screen.getByRole('button', { name: /Switch to light mode/i });
    fireEvent.click(themeBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);

    rerender(<Header theme="light" onToggleTheme={handleToggle} />);
    const lightBtn = screen.getByRole('button', { name: /Switch to dark mode/i });
    expect(lightBtn).toBeInTheDocument();
  });

  it('renders and handles Install App button when isInstallable is true', () => {
    const handleInstall = vi.fn();
    render(
      <Header
        theme="dark"
        onToggleTheme={() => {}}
        isInstallable={true}
        onInstallApp={handleInstall}
      />
    );

    const installBtn = screen.getByRole('button', { name: /Install Formulary App/i });
    expect(installBtn).toBeInTheDocument();
    fireEvent.click(installBtn);
    expect(handleInstall).toHaveBeenCalledTimes(1);
  });

  it('renders and handles Settings button when onOpenSettings is provided', () => {
    const handleOpenSettings = vi.fn();
    render(
      <Header
        theme="dark"
        onToggleTheme={() => {}}
        onOpenSettings={handleOpenSettings}
      />
    );

    const settingsBtn = screen.getByRole('button', { name: /Open Settings/i });
    expect(settingsBtn).toBeInTheDocument();
    fireEvent.click(settingsBtn);
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });
});
