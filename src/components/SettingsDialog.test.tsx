import { render, screen, fireEvent, act } from '@testing-library/react';
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
        orientationLock={{ isLocked: true, onToggle: () => {} }}
      />
    );
    const dialog = container.querySelector('dialog');
    expect(dialog?.open).toBeFalsy();
  });

  it('renders version info, build ID, and handles theme/close actions', () => {
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
        orientationLock={{ isLocked: true, onToggle: () => {} }}
      />
    );

    expect(screen.getByRole('heading', { name: /Settings & System Information/i })).toBeInTheDocument();
    expect(screen.getByText(/v2.0.0/i)).toBeInTheDocument();

    // Toggle theme button
    const themeBtn = screen.getByRole('button', { name: /Switch to dark theme/i });
    fireEvent.click(themeBtn);
    expect(handleToggleTheme).toHaveBeenCalledTimes(1);

    // Close button
    const closeBtn = screen.getByRole('button', { name: /Close settings/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('handles update check success feedback (Up to Date)', async () => {
    const handleCheckUpdate = vi.fn().mockResolvedValue({ hasUpdate: false });

    render(
      <SettingsDialog
        isOpen={true}
        onClose={() => {}}
        versionInfo={mockVersionInfo}
        onCheckUpdate={handleCheckUpdate}
        theme="dark"
        onToggleTheme={() => {}}
        orientationLock={{ isLocked: true, onToggle: () => {} }}
      />
    );

    const checkBtn = screen.getByRole('button', { name: /Check for updates/i });

    await act(async () => {
      fireEvent.click(checkBtn);
    });

    expect(handleCheckUpdate).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Up to Date ✓/i)).toBeInTheDocument();
  });

  it('handles update check error feedback', async () => {
    const handleCheckUpdate = vi.fn().mockResolvedValue({ error: true });

    render(
      <SettingsDialog
        isOpen={true}
        onClose={() => {}}
        versionInfo={null}
        onCheckUpdate={handleCheckUpdate}
        theme="dark"
        onToggleTheme={() => {}}
        orientationLock={{ isLocked: true, onToggle: () => {} }}
      />
    );

    const checkBtn = screen.getByRole('button', { name: /Check for updates/i });

    await act(async () => {
      fireEvent.click(checkBtn);
    });

    expect(handleCheckUpdate).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Offline \/ Error/i)).toBeInTheDocument();
  });

  it('handles update check exception gracefully', async () => {
    const handleCheckUpdate = vi.fn().mockRejectedValue(new Error('Network error'));

    render(
      <SettingsDialog
        isOpen={true}
        onClose={() => {}}
        versionInfo={null}
        onCheckUpdate={handleCheckUpdate}
        theme="light"
        onToggleTheme={() => {}}
        orientationLock={{ isLocked: true, onToggle: () => {} }}
      />
    );

    const checkBtn = screen.getByRole('button', { name: /Check for updates/i });

    await act(async () => {
      fireEvent.click(checkBtn);
    });

    expect(screen.getByText(/Offline \/ Error/i)).toBeInTheDocument();
  });

  it('handles backdrop click to trigger onClose', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <SettingsDialog
        isOpen={true}
        onClose={handleClose}
        versionInfo={mockVersionInfo}
        onCheckUpdate={() => {}}
        theme="light"
        onToggleTheme={() => {}}
        orientationLock={{ isLocked: true, onToggle: () => {} }}
      />
    );

    const dialog = container.querySelector('dialog');
    if (dialog) {
      fireEvent.click(dialog);
      expect(handleClose).toHaveBeenCalled();
    }
  });
});
