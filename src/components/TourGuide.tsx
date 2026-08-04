import { TourOverlay } from './TourOverlay';
import { TourTooltip } from './TourTooltip';
import { TourStep } from '../types/tour';

interface TourGuideProps {
  isActive: boolean;
  currentStep: TourStep | null;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export function TourGuide({
  isActive,
  currentStep,
  currentStepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onComplete,
}: TourGuideProps) {
  if (!isActive || !currentStep) return null;

  return (
    <>
      <TourOverlay targetSelector={currentStep.targetSelector} isActive={isActive} />
      <TourTooltip
        step={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        onNext={onNext}
        onBack={onBack}
        onSkip={onSkip}
        onComplete={onComplete}
      />
    </>
  );
}
