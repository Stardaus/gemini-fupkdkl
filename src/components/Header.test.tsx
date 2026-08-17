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

  it('renders and handles Guide button when onOpenIntro is provided', () => {
    const handleOpenIntro = vi.fn();
    render(
      <Header
        theme="dark"
        onToggleTheme={() => {}}
        onOpenIntro={handleOpenIntro}
      />
    );

    const guideBtn = screen.getByRole('button', { name: /Open App Overview and Installation Guide/i });
    expect(guideBtn).toBeInTheDocument();
    fireEvent.click(guideBtn);
    expect(handleOpenIntro).toHaveBeenCalledTimes(1);
  });

  it('updates network status indicator when online and offline window events fire', () => {
    render(<Header theme="dark" onToggleTheme={() => {}} />);

    fireEvent(window, new Event('offline'));
    expect(screen.getByLabelText('Offline')).toBeInTheDocument();

    fireEvent(window, new Event('online'));
    expect(screen.getByLabelText('Online')).toBeInTheDocument();
  });

  it('renders and handles NAG link with official MOH Google Sites URL', () => {
    const handleOpenNag = vi.fn();
    render(
      <Header
        theme="dark"
        onToggleTheme={() => {}}
        onOpenNag={handleOpenNag}
      />
    );

    const nagLink = screen.getByRole('link', {
      name: /Open MOH National Antibiotic Guideline Section C in Primary Care/i,
    });
    expect(nagLink).toBeInTheDocument();
    expect(nagLink).toHaveAttribute(
      'href',
      'https://sites.google.com/moh.gov.my/nag/contents/section-c-clinical-pathways-in-primary-care?authuser=0'
    );
    expect(nagLink).toHaveAttribute('target', '_blank');
    expect(nagLink).toHaveAttribute('rel', 'noopener noreferrer');

    fireEvent.click(nagLink);
    expect(handleOpenNag).toHaveBeenCalledTimes(1);
  });
});
