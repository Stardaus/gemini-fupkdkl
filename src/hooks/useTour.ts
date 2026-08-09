import { useState, useCallback } from 'react';
import { TOUR_STEPS } from '../config/tourSteps';

const STORAGE_KEY = 'fupkdkl_tour_completed';

export function useTour() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const getActiveSteps = useCallback(() => {
    return TOUR_STEPS.filter((step) => (step.isVisible ? step.isVisible() : true));
  }, []);

  const activeSteps = getActiveSteps();

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
      const steps = getActiveSteps();
      if (prevIndex >= steps.length - 1) {
        finishTour();
        return prevIndex;
      }
      return prevIndex + 1;
    });
  }, [finishTour, getActiveSteps]);

  const back = useCallback(() => {
    setCurrentStepIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const currentStep = activeSteps[currentStepIndex] || null;

  return {
    isActive,
    currentStepIndex,
    currentStep,
    totalSteps: activeSteps.length,
    shouldAutoStart: shouldAutoStart(),
    start,
    next,
    back,
    skip: finishTour,
    complete: finishTour,
  };
}
