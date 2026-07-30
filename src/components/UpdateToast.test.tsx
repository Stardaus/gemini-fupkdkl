import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UpdateToast } from './UpdateToast';

describe('UpdateToast component', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(
      <UpdateToast isVisible={false} version="2.1.0" onDismiss={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders update toast content when visible and handles dismiss click', () => {
    const handleDismiss = vi.fn();
    render(
      <UpdateToast isVisible={true} version="2.1.0" onDismiss={handleDismiss} />
    );

    expect(screen.getByText(/Formulary Updated/i)).toBeInTheDocument();
    expect(screen.getByText(/\(v2.1.0\)/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Dismiss notification/i });
    fireEvent.click(closeBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
