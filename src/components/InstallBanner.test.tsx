import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InstallBanner } from './InstallBanner';

describe('InstallBanner component', () => {
  it('does not render when isVisible is false', () => {
    render(<InstallBanner isVisible={false} onInstall={vi.fn()} onDismiss={vi.fn()} />);
    expect(screen.queryByRole('region')).toBeNull();
  });

  it('renders correctly when isVisible is true', () => {
    render(<InstallBanner isVisible={true} onInstall={vi.fn()} onDismiss={vi.fn()} />);

    expect(screen.getByRole('region')).toBeDefined();
    expect(screen.getByText('Install Formulary App')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Install' })).toBeDefined();
  });

  it('triggers onInstall and onDismiss callbacks', () => {
    const handleInstall = vi.fn();
    const handleDismiss = vi.fn();

    render(<InstallBanner isVisible={true} onInstall={handleInstall} onDismiss={handleDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: 'Install' }));
    expect(handleInstall).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Dismiss install banner'));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
