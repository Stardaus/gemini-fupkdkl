import { useState, useCallback } from 'react';
import { TOUR_STEPS } from '../config/tourSteps';

const STORAGE_KEY = 'fupkdkl_tour_completed';

export function useTour() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const shouldAutoStart = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) === null;
  }, []);

  const finishTour = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsActive(false);
  }, []);

  const start = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const next = useCallback(() => {
    setCurrentStepIndex((prevIndex) => {
      if (prevIndex >= TOUR_STEPS.length - 1) {
        finishTour();
        return prevIndex;
      }
      return prevIndex + 1;
    });
  }, [finishTour]);

  const back = useCallback(() => {
    setCurrentStepIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const skip = useCallback(() => {
    finishTour();
  }, [finishTour]);

  const complete = useCallback(() => {
    finishTour();
  }, [finishTour]);

  const currentStep = TOUR_STEPS[currentStepIndex] || null;

  return {
    isActive,
    currentStepIndex,
    currentStep,
    totalSteps: TOUR_STEPS.length,
    shouldAutoStart: shouldAutoStart(),
    start,
    next,
    back,
    skip,
    complete,
  };
}
