import { createPortal } from 'react-dom';
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

  const targetEl =
    typeof document !== 'undefined' && currentStep.targetSelector
      ? document.querySelector(currentStep.targetSelector)
      : null;
  const dialogAncestor = targetEl ? targetEl.closest('dialog') : null;
  const isInsideDialog = !!dialogAncestor;

  const tooltipNode = (
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
  );

  return (
    <>
      {!isInsideDialog && <TourOverlay rect={rect} viewport={viewport} isActive={isActive} />}
      {isInsideDialog && dialogAncestor ? createPortal(tooltipNode, dialogAncestor) : tooltipNode}
    </>
  );
}
