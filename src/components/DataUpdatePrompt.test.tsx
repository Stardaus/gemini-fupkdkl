import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataUpdatePrompt } from './DataUpdatePrompt';

describe('DataUpdatePrompt component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isVisible is false', () => {
    const { container } = render(
      <DataUpdatePrompt
        isVisible={false}
        version="1785409094"
        onUpdate={async () => {}}
        onDismiss={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders data update prompt banner and handles update action with loading state', async () => {
    const handleUpdate = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50))
    );
    const handleDismiss = vi.fn();

    render(
      <DataUpdatePrompt
        isVisible={true}
        version="1785409094"
        onUpdate={handleUpdate}
        onDismiss={handleDismiss}
      />
    );

    expect(screen.getByText('Formulary Data Update Available')).toBeInTheDocument();
    expect(screen.getByText(/\(v1785409094\)/i)).toBeInTheDocument();

    const updateBtn = screen.getByRole('button', { name: /Update Data Now/i });
    fireEvent.click(updateBtn);

    expect(handleUpdate).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Update Data Now/i })).toBeInTheDocument();
    });
  });

  it('handles dismissal via Later button and dismiss icon', () => {
    const handleDismiss = vi.fn();

    render(
      <DataUpdatePrompt
        isVisible={true}
        version="1785409094"
        onUpdate={async () => {}}
        onDismiss={handleDismiss}
      />
    );

    const laterBtn = screen.getByRole('button', { name: /Later/i });
    fireEvent.click(laterBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);

    const closeBtn = screen.getByRole('button', {
      name: /Dismiss data update notification/i,
    });
    fireEvent.click(closeBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(2);
  });
});
