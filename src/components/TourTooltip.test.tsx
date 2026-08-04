import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TourTooltip } from './TourTooltip';
import { TourStep } from '../types/tour';

const mockStep: TourStep = {
  id: 'search-bar',
  targetSelector: null,
  placement: 'bottom',
  title: 'Search Medications',
  description: 'Quickly find medications by name or code.',
  advanceOn: 'next',
};

const mockActionStep: TourStep = {
  id: 'medication-list',
  targetSelector: null,
  placement: 'bottom',
  title: 'Medication List',
  description: 'Tap any card to view details.',
  advanceOn: 'action',
  actionHint: 'Tap a medication card to continue',
};

const defaultProps = {
  rect: null,
  viewport: { width: 1024, height: 768 },
};

describe('TourTooltip component', () => {
  it('renders step title, description, and counter', () => {
    render(
      <TourTooltip
        {...defaultProps}
        step={mockStep}
        currentStepIndex={0}
        totalSteps={7}
        onNext={() => {}}
        onBack={() => {}}
        onSkip={() => {}}
        onComplete={() => {}}
      />
    );

    expect(screen.getByText('Search Medications')).toBeInTheDocument();
    expect(screen.getByText('Quickly find medications by name or code.')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 7')).toBeInTheDocument();
  });

  it('triggers onNext when Next button is clicked', () => {
    const handleNext = vi.fn();
    render(
      <TourTooltip
        {...defaultProps}
        step={mockStep}
        currentStepIndex={0}
        totalSteps={7}
        onNext={handleNext}
        onBack={() => {}}
        onSkip={() => {}}
        onComplete={() => {}}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('triggers onSkip when Skip Tour is clicked', () => {
    const handleSkip = vi.fn();
    render(
      <TourTooltip
        {...defaultProps}
        step={mockStep}
        currentStepIndex={0}
        totalSteps={7}
        onNext={() => {}}
        onBack={() => {}}
        onSkip={handleSkip}
        onComplete={() => {}}
      />
    );

    const skipBtn = screen.getByRole('button', { name: /Skip Tour/i });
    fireEvent.click(skipBtn);
    expect(handleSkip).toHaveBeenCalledTimes(1);
  });

  it('hides Next button and displays action hint on action-gated step', () => {
    render(
      <TourTooltip
        {...defaultProps}
        step={mockActionStep}
        currentStepIndex={3}
        totalSteps={7}
        onNext={() => {}}
        onBack={() => {}}
        onSkip={() => {}}
        onComplete={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: /Next/i })).not.toBeInTheDocument();
    expect(screen.getByText('Tap a medication card to continue')).toBeInTheDocument();
  });

  it('shows Done button on final step and triggers onComplete', () => {
    const handleComplete = vi.fn();
    render(
      <TourTooltip
        {...defaultProps}
        step={mockStep}
        currentStepIndex={6}
        totalSteps={7}
        onNext={() => {}}
        onBack={() => {}}
        onSkip={() => {}}
        onComplete={handleComplete}
      />
    );

    const doneBtn = screen.getByRole('button', { name: /Done/i });
    expect(doneBtn).toBeInTheDocument();

    fireEvent.click(doneBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
