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
});
