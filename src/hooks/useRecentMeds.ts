import { useState, useCallback } from 'react';
import { Medication } from '../types/formulary';

const RECENT_MEDS_KEY = 'formulary_recent_meds';
const MAX_RECENT_MEDS = 5;

export function useRecentMeds() {
  const [recentMeds, setRecentMeds] = useState<Medication[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(RECENT_MEDS_KEY);
      return stored ? (JSON.parse(stored) as Medication[]) : [];
    } catch {
      return [];
    }
  });

  const addRecentMed = useCallback((medication: Medication) => {
    setRecentMeds((prev) => {
      const filtered = prev.filter((m) => m.id !== medication.id);
      const updated = [medication, ...filtered].slice(0, MAX_RECENT_MEDS);
      try {
        localStorage.setItem(RECENT_MEDS_KEY, JSON.stringify(updated));
      } catch {
        // Ignored if storage full or restricted
      }
      return updated;
    });
  }, []);

  const clearRecentMeds = useCallback(() => {
    setRecentMeds([]);
    try {
      localStorage.removeItem(RECENT_MEDS_KEY);
    } catch {
      // Ignored
    }
  }, []);

  return { recentMeds, addRecentMed, clearRecentMeds };
}
