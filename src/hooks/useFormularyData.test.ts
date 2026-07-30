import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFormularyData } from './useFormularyData';
import { clearDB, saveMedications } from '../services/db';
import { Medication } from '../types/formulary';

const mockMed: Medication = {
  id: 'med-1',
  name: 'Amlodipine 5mg',
  malBrands: 'MAL123',
  fukkmSystemGroup: 'Cardio',
  mdc: 'MDC001',
  neml: 'Yes',
  methodOfPurchase: 'APPL',
  prescriberCategory: 'B',
  indications: 'Hypertension',
  prescribingRestrictions: '',
  dosage: '5mg',
  adverseReaction: '',
  contraindications: '',
  interactions: '',
  precautions: '',
  isQuota: false,
};

describe('useFormularyData hook', () => {
  beforeEach(async () => {
    await clearDB();
    vi.restoreAllMocks();
  });

  it('loads medications from IndexedDB when present', async () => {
    await saveMedications([mockMed]);

    const { result } = renderHook(() =>
      useFormularyData({ enableSentinel: false })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.medications).toHaveLength(1);
    expect(result.current.medications[0].name).toBe('Amlodipine 5mg');
  });

  it('handles data update dismissal and success toast dismissal', async () => {
    await saveMedications([mockMed]);

    const { result } = renderHook(() =>
      useFormularyData({ enableSentinel: false })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.dismissDataUpdatePrompt();
      result.current.dismissSuccessToast();
    });

    expect(result.current.isDataUpdateAvailable).toBe(false);
    expect(result.current.isSuccessToastVisible).toBe(false);
  });

  it('applies prompt-first data update when applyDataUpdate is called', async () => {
    const mockCSV = `Generic Name,MAL Registration / Brand Names,Clinical Indications,Quota Control
"Metformin 500mg","MAL456","Diabetes","No"`;

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('gid=411569782')) {
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'text/csv' }),
          text: async () => 'data_version,1785409099',
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'text/csv' }),
        text: async () => mockCSV,
      } as Response);
    });

    await saveMedications([mockMed]);

    const { result } = renderHook(() =>
      useFormularyData({ enableSentinel: false })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.applyDataUpdate();
    });

    expect(result.current.isDataUpdateAvailable).toBe(false);
    expect(result.current.isSuccessToastVisible).toBe(true);
    expect(result.current.medications).toHaveLength(1);
    expect(result.current.medications[0].name).toBe('Metformin 500mg');
  });
});
