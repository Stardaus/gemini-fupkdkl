import { TourOverlay } from './TourOverlay';
import { TourTooltip } from './TourTooltip';
import { TourStep } from '../types/tour';
import { useTargetBoundingRect } from '../hooks/useTargetBoundingRect';

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
  const { rect, viewport } = useTargetBoundingRect(
    currentStep?.targetSelector ?? null,
    isActive
  );

  if (!isActive || !currentStep) return null;

  return (
    <>
      <TourOverlay rect={rect} viewport={viewport} isActive={isActive} />
      <TourTooltip
        step={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        rect={rect}
        viewport={viewport}
        onNext={onNext}
        onBack={onBack}
        onSkip={onSkip}
        onComplete={onComplete}
      />
    </>
  );
}
