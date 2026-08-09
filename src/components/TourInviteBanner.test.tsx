import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TourInviteBanner } from './TourInviteBanner';

describe('TourInviteBanner component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders banner title and buttons when visible', () => {
    render(
      <TourInviteBanner
        isVisible={true}
        onStartTour={() => {}}
        onDismiss={() => {}}
      />
    );

    expect(screen.getByText('New to Formulari PKD Kuala Langat?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Tour/i })).toBeInTheDocument();
  });

  it('does not render when isVisible is false', () => {
    render(
      <TourInviteBanner
        isVisible={false}
        onStartTour={() => {}}
        onDismiss={() => {}}
      />
    );

    expect(screen.queryByText('New to Formulari PKD Kuala Langat?')).not.toBeInTheDocument();
  });

  it('triggers onStartTour when Start Tour is clicked', () => {
    const handleStart = vi.fn();
    const handleDismiss = vi.fn();

    render(
      <TourInviteBanner
        isVisible={true}
        onStartTour={handleStart}
        onDismiss={handleDismiss}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Start Tour/i }));
    expect(handleStart).toHaveBeenCalledTimes(1);
    expect(handleDismiss).not.toHaveBeenCalled();
  });

  it('triggers onDismiss when dismiss button is clicked', () => {
    const handleStart = vi.fn();
    const handleDismiss = vi.fn();

    render(
      <TourInviteBanner
        isVisible={true}
        onStartTour={handleStart}
        onDismiss={handleDismiss}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Dismiss tour prompt/i }));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses after 10 seconds', () => {
    const handleDismiss = vi.fn();

    render(
      <TourInviteBanner
        isVisible={true}
        onStartTour={() => {}}
        onDismiss={handleDismiss}
      />
    );

    act(() => {
      vi.advanceTimersByTime(10000);
      vi.advanceTimersByTime(300); // fade out timeout
    });

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
