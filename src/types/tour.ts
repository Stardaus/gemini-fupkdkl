export type AdvanceMode = 'next' | 'action';
export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourStep {
  id: string;
  targetSelector: string | null;
  placement: TourPlacement;
  title: string;
  description: string;
  advanceOn: AdvanceMode;
  actionHint?: string;
}
