import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useRecentMeds } from './useRecentMeds';
import { Medication } from '../types/formulary';

const makeMed = (id: string, name: string): Medication => ({
  id,
  name,
  malBrands: 'MAL123',
  fukkmSystemGroup: 'Group',
  mdc: 'MDC001',
  neml: 'Yes',
  methodOfPurchase: 'APPL',
  prescriberCategory: 'B',
  indications: 'Indication',
  prescribingRestrictions: '',
  dosage: 'Dosage',
  adverseReaction: '',
  contraindications: '',
  interactions: '',
  precautions: '',
  isQuota: false,
});

describe('useRecentMeds hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds recent meds up to 5 items, deduplicating and keeping most recent first', () => {
    const { result } = renderHook(() => useRecentMeds());

    act(() => {
      result.current.addRecentMed(makeMed('1', 'Med 1'));
      result.current.addRecentMed(makeMed('2', 'Med 2'));
      result.current.addRecentMed(makeMed('3', 'Med 3'));
      result.current.addRecentMed(makeMed('4', 'Med 4'));
      result.current.addRecentMed(makeMed('5', 'Med 5'));
      result.current.addRecentMed(makeMed('6', 'Med 6'));
    });

    expect(result.current.recentMeds).toHaveLength(5);
    expect(result.current.recentMeds[0].name).toBe('Med 6');

    // Deduplication check: re-add Med 2
    act(() => {
      result.current.addRecentMed(makeMed('2', 'Med 2'));
    });

    expect(result.current.recentMeds[0].name).toBe('Med 2');
    expect(
      result.current.recentMeds.filter((m) => m.id === '2')
    ).toHaveLength(1);
  });

  it('clears recent medications', () => {
    const { result } = renderHook(() => useRecentMeds());

    act(() => {
      result.current.addRecentMed(makeMed('1', 'Med 1'));
      result.current.clearRecentMeds();
    });

    expect(result.current.recentMeds).toHaveLength(0);
    expect(localStorage.getItem('formulary_recent_meds')).toBeNull();
  });
});
