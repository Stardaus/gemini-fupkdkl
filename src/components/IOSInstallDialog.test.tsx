import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IOSInstallDialog } from './IOSInstallDialog';

describe('IOSInstallDialog component', () => {
  it('does not render when isOpen is false', () => {
    render(<IOSInstallDialog isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders instructions correctly when isOpen is true', () => {
    render(<IOSInstallDialog isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Install on iOS Safari')).toBeDefined();
    expect(screen.getByText(/Tap the Share button/i)).toBeDefined();
    expect(screen.getByText(/Add to Home Screen/i)).toBeDefined();
  });

  it('calls onClose when close button or Got it button is clicked', () => {
    const handleClose = vi.fn();
    render(<IOSInstallDialog isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('Close install guide');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const gotItBtn = screen.getByRole('button', { name: /Got it/i });
    fireEvent.click(gotItBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
