import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PWAUpdatePrompt } from './PWAUpdatePrompt';

const mockUpdateSW = vi.fn();
const mockSetNeedRefresh = vi.fn();

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: (options: {
    onRegisteredSW?: (
      url: string,
      reg: { update: () => void }
    ) => void;
  }) => {
    if (options?.onRegisteredSW) {
      options.onRegisteredSW('/sw.js', { update: vi.fn() });
    }
    return {
      needRefresh: [true, mockSetNeedRefresh],
      updateServiceWorker: mockUpdateSW,
    };
  },
}));

describe('PWAUpdatePrompt component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders app update banner when needRefresh is true and handles update click', () => {
    render(<PWAUpdatePrompt />);

    expect(screen.getByText('App Update Available')).toBeInTheDocument();
    expect(
      screen.getByText(/A new build of District Drug Formulary is ready/i)
    ).toBeInTheDocument();

    const updateBtn = screen.getByRole('button', { name: /Update App Now/i });
    fireEvent.click(updateBtn);
    expect(mockUpdateSW).toHaveBeenCalledWith(true);
  });

  it('handles dismissal via Later button and dismiss icon', () => {
    render(<PWAUpdatePrompt />);

    const laterBtn = screen.getByRole('button', { name: /Later/i });
    fireEvent.click(laterBtn);
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);

    const closeBtn = screen.getByRole('button', { name: /Dismiss app update prompt/i });
    fireEvent.click(closeBtn);
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
  });
});
