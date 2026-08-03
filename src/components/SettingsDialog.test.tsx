import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsDialog } from './SettingsDialog';

const mockVersionInfo = {
  version: '2.0.0',
  lastChecked: new Date('2026-08-03T10:00:00Z').getTime(),
};

describe('SettingsDialog component', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <SettingsDialog
        isOpen={false}
        onClose={() => {}}
        versionInfo={mockVersionInfo}
        onCheckUpdate={() => {}}
        theme="light"
        onToggleTheme={() => {}}
      />
    );
    // Dialog element shouldn't be open
    const dialog = container.querySelector('dialog');
    expect(dialog?.open).toBeFalsy();
  });

  it('renders version info, build ID, and triggers update check when opened', () => {
    const handleClose = vi.fn();
    const handleCheckUpdate = vi.fn();
    const handleToggleTheme = vi.fn();

    render(
      <SettingsDialog
        isOpen={true}
        onClose={handleClose}
        versionInfo={mockVersionInfo}
        onCheckUpdate={handleCheckUpdate}
        theme="light"
        onToggleTheme={handleToggleTheme}
      />
    );

    expect(screen.getByRole('heading', { name: /Settings & System Information/i })).toBeInTheDocument();
    expect(screen.getByText(/v2.0.0/i)).toBeInTheDocument();

    // Check updates button
    const checkBtn = screen.getByRole('button', { name: /Check for updates/i });
    fireEvent.click(checkBtn);
    expect(handleCheckUpdate).toHaveBeenCalledTimes(1);

    // Toggle theme button
    const themeBtn = screen.getByRole('button', { name: /Switch to dark theme/i });
    fireEvent.click(themeBtn);
    expect(handleToggleTheme).toHaveBeenCalledTimes(1);

    // Close button
    const closeBtn = screen.getByRole('button', { name: /Close settings/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
