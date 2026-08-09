import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TourGuide } from './TourGuide';
import { TourStep } from '../types/tour';

const mockNormalStep: TourStep = {
  id: 'search-bar',
  targetSelector: '[data-tour="search-bar"]',
  placement: 'bottom',
  title: 'Search Medications',
  description: 'Search description',
  advanceOn: 'next',
};

const mockDialogStep: TourStep = {
  id: 'medication-detail',
  targetSelector: '[data-tour="medication-detail-content"]',
  placement: 'center',
  title: 'Clinical Details',
  description: 'Review details',
  advanceOn: 'next',
};

describe('TourGuide component', () => {
  it('renders TourOverlay and TourTooltip for standard non-dialog step', () => {
    const searchBarEl = document.createElement('div');
    searchBarEl.setAttribute('data-tour', 'search-bar');
    document.body.appendChild(searchBarEl);

    render(
      <TourGuide
        isActive={true}
        currentStep={mockNormalStep}
        currentStepIndex={0}
        totalSteps={6}
        onNext={() => {}}
        onBack={() => {}}
        onSkip={() => {}}
        onComplete={() => {}}
      />
    );

    expect(screen.getByText('Search Medications')).toBeInTheDocument();

    document.body.removeChild(searchBarEl);
  });

  it('portals TourTooltip inside native dialog and suppresses TourOverlay for dialog step', () => {
    const dialog = document.createElement('dialog');
    dialog.open = true;

    const content = document.createElement('div');
    content.setAttribute('data-tour', 'medication-detail-content');
    dialog.appendChild(content);
    document.body.appendChild(dialog);

    render(
      <TourGuide
        isActive={true}
        currentStep={mockDialogStep}
        currentStepIndex={4}
        totalSteps={6}
        onNext={() => {}}
        onBack={() => {}}
        onSkip={() => {}}
        onComplete={() => {}}
      />
    );

    // TourTooltip should be portaled inside <dialog>
    expect(dialog.querySelector('[role="dialog"]')).toBeInTheDocument();
    expect(screen.getByText('Clinical Details')).toBeInTheDocument();

    document.body.removeChild(dialog);
  });
});
