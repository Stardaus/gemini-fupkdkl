import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DisclaimerDialog } from './DisclaimerDialog';

describe('DisclaimerDialog component', () => {
  it('renders disclaimer content when open and triggers onAccept on button click', () => {
    const handleAccept = vi.fn();
    render(<DisclaimerDialog isOpen={true} onAccept={handleAccept} />);

    expect(
      screen.getByText('Medical Disclaimer & Terms of Use')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Medical Officers, Pharmacists/i)
    ).toBeInTheDocument();

    const acceptBtn = screen.getByRole('button', {
      name: /I Understand & Agree/i,
    });
    fireEvent.click(acceptBtn);
    expect(handleAccept).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when isOpen is false and prevents ESC cancel', () => {
    const handleAccept = vi.fn();
    const { container, rerender } = render(
      <DisclaimerDialog isOpen={true} onAccept={handleAccept} />
    );

    const dialog = container.querySelector('dialog');
    expect(dialog).toBeInTheDocument();

    // Trigger cancel event (ESC key)
    const cancelEvent = new Event('cancel', { cancelable: true });
    dialog?.dispatchEvent(cancelEvent);
    expect(cancelEvent.defaultPrevented).toBe(true);

    // Re-render closed
    rerender(<DisclaimerDialog isOpen={false} onAccept={handleAccept} />);
    expect(container.querySelector('dialog')).toBeNull();
  });
});
