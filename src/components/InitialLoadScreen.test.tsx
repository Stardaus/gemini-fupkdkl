import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InitialLoadScreen } from './InitialLoadScreen';

describe('InitialLoadScreen component', () => {
  it('renders heading, description, and Load Data button', () => {
    render(<InitialLoadScreen onRetry={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: /internet connection required/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/active internet connection is required to download/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /load data/i })
    ).toBeInTheDocument();
  });

  it('calls onRetry when button is clicked', async () => {
    const onRetryMock = vi.fn().mockResolvedValue(undefined);
    render(<InitialLoadScreen onRetry={onRetryMock} />);

    const button = screen.getByRole('button', { name: /load data/i });
    await act(async () => {
      fireEvent.click(button);
    });

    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner and disables button during retry', async () => {
    let resolveRetry: () => void = () => {};
    const pendingPromise = new Promise<void>((resolve) => {
      resolveRetry = resolve;
    });
    const onRetryMock = vi.fn().mockReturnValue(pendingPromise);

    render(<InitialLoadScreen onRetry={onRetryMock} />);

    const button = screen.getByRole('button', { name: /load data/i });
    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByText(/downloading database\.\.\./i)).toBeInTheDocument();
    expect(button).toBeDisabled();

    await act(async () => {
      resolveRetry();
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /load data/i })).not.toBeDisabled();
    });
  });

  it('displays inline error message when retry fails', async () => {
    const onRetryMock = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<InitialLoadScreen onRetry={onRetryMock} />);

    const button = screen.getByRole('button', { name: /load data/i });
    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/unable to download dataset\. please check your connection and try again\./i)
      ).toBeInTheDocument();
    });
    expect(button).not.toBeDisabled();
  });
});
