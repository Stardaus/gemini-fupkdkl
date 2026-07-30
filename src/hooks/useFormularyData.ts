import { useState, useEffect, useCallback, useMemo } from 'react';
import { Medication, VersionInfo } from '../types/formulary';
import {
  getAllMedications,
  getStoredVersion,
  saveMedications,
  saveStoredVersion,
} from '../services/db';
import { parseFormularyCSV } from '../services/csvParser';
import { FormularySync, computeMedicationsHash } from '../services/formularySync';

const INITIAL_VERSION = '2.0.0-initial';
const INITIAL_CSV_PATH = '/data/formulary_initial.csv';

export const DEFAULT_VERSION_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFA9lhUhdSk7L_t0XnGtGzrIMw1g9EXrNjmRfaBaQ8naqAy7ua8r_lpeth-LPQQS2pOMlKKSbvYQuB/pub?gid=411569782&single=true&output=csv';

export const DEFAULT_DATA_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFA9lhUhdSk7L_t0XnGtGzrIMw1g9EXrNjmRfaBaQ8naqAy7ua8r_lpeth-LPQQS2pOMlKKSbvYQuB/pub?output=csv';

export interface UseFormularyDataOptions {
  versionUrl?: string;
  dataUrl?: string;
  enableSentinel?: boolean;
}

export function useFormularyData(options: UseFormularyDataOptions = {}) {
  const {
    versionUrl = DEFAULT_VERSION_URL,
    dataUrl = DEFAULT_DATA_URL,
    enableSentinel = true,
  } = options;

  const syncService = useMemo(
    () => new FormularySync(versionUrl, dataUrl),
    [versionUrl, dataUrl]
  );

  const [medications, setMedications] = useState<Medication[]>([]);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataUpdateAvailable, setIsDataUpdateAvailable] = useState<boolean>(false);
  const [pendingVersion, setPendingVersion] = useState<string | null>(null);
  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState<boolean>(false);

  // Seed database from bundled CSV if DB is empty
  const loadInitialSeed = useCallback(async (): Promise<Medication[]> => {
    try {
      const response = await fetch(INITIAL_CSV_PATH);
      if (!response.ok) return [];
      const csvText = await response.text();
      const parsedMeds = parseFormularyCSV(csvText);

      if (parsedMeds.length > 0) {
        await saveMedications(parsedMeds);
        const hash = computeMedicationsHash(parsedMeds);
        const vInfo: VersionInfo = {
          version: INITIAL_VERSION,
          contentHash: hash,
          lastChecked: Date.now(),
        };
        await saveStoredVersion(vInfo);
        setVersionInfo(vInfo);
      }
      return parsedMeds;
    } catch {
      return [];
    }
  }, []);

  // Step 1: Fast local load from IndexedDB (< 15ms)
  const initializeData = useCallback(async () => {
    setIsLoading(true);
    try {
      let cachedMeds = await getAllMedications();
      let version = await getStoredVersion();

      if (!cachedMeds || cachedMeds.length === 0) {
        cachedMeds = await loadInitialSeed();
        version = await getStoredVersion();
      }

      setMedications(cachedMeds);
      setVersionInfo(version);
    } catch {
      // Non-fatal init
    } finally {
      setIsLoading(false);
    }
  }, [loadInitialSeed]);

  // Step 2: Background version sentinel check
  const runVersionSentinel = useCallback(async () => {
    if (!enableSentinel) return;

    try {
      const localVer = versionInfo?.version ?? null;
      const { hasUpdate, remoteVersion } = await syncService.checkUpdate(localVer);

      if (hasUpdate && remoteVersion) {
        setPendingVersion(remoteVersion);
        setIsDataUpdateAvailable(true);
      }
    } catch {
      // Non-fatal background check
    }
  }, [enableSentinel, syncService, versionInfo]);

  // Step 3: Prompt-First Data Update trigger (called when user taps "Update Data Now")
  const applyDataUpdate = useCallback(async () => {
    const targetVersion = pendingVersion || `manual-${Date.now()}`;
    try {
      const currentHash = versionInfo?.contentHash;
      const { medications: updatedMeds, versionInfo: newVerInfo } =
        await syncService.syncData(targetVersion, currentHash);

      if (updatedMeds.length > 0) {
        setMedications(updatedMeds);
        setVersionInfo(newVerInfo);
        setIsDataUpdateAvailable(false);
        setIsSuccessToastVisible(true);

        setTimeout(() => {
          setIsSuccessToastVisible(false);
        }, 3500);
      }
    } catch (err) {
      console.error('Failed to apply data update:', err);
      throw err;
    }
  }, [pendingVersion, syncService, versionInfo]);

  const dismissDataUpdatePrompt = useCallback(() => {
    setIsDataUpdateAvailable(false);
  }, []);

  const dismissSuccessToast = useCallback(() => {
    setIsSuccessToastVisible(false);
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (isLoading || medications.length === 0) return;

    runVersionSentinel();

    const interval = setInterval(runVersionSentinel, 15 * 60 * 1000);
    const handleFocus = () => {
      if (navigator.onLine) runVersionSentinel();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isLoading, medications.length, runVersionSentinel]);

  return {
    medications,
    versionInfo,
    isLoading,
    isDataUpdateAvailable,
    pendingVersion,
    isSuccessToastVisible,
    applyDataUpdate,
    dismissDataUpdatePrompt,
    dismissSuccessToast,
    refreshData: runVersionSentinel,
  };
}
