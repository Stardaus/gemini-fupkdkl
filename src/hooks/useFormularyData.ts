import { useState, useEffect, useCallback, useMemo } from 'react';
import { Medication, VersionInfo } from '../types/formulary';
import {
  getAllMedications,
  getStoredVersion,
} from '../services/db';
import { FormularySync } from '../services/formularySync';

export const DEFAULT_VERSION_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFA9lhUhdSk7L_t0XnGtGzrIMw1g9EXrNjmRfaBaQ8naqAy7ua8r_lpeth-LPQQS2pOMlKKSbvYQuB/pub?gid=411569782&single=true&output=csv';

export const DEFAULT_DATA_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFA9lhUhdSk7L_t0XnGtGzrIMw1g9EXrNjmRfaBaQ8naqAy7ua8r_lpeth-LPQQS2pOMlKKSbvYQuB/pub?gid=1786132140&single=true&output=csv';

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
  const [isInitialLoadRequired, setIsInitialLoadRequired] = useState<boolean>(false);
  const [isDataUpdateAvailable, setIsDataUpdateAvailable] = useState<boolean>(false);
  const [pendingVersion, setPendingVersion] = useState<string | null>(null);
  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState<boolean>(false);

  // Fetch remote data and seed IndexedDB for the very first launch
  const loadFromRemote = useCallback(async (): Promise<Medication[]> => {
    const targetVer = `remote-${Date.now()}`;
    const { medications: remoteMeds, versionInfo: remoteVerInfo } =
      await syncService.syncData(targetVer);
    setVersionInfo(remoteVerInfo);
    return remoteMeds;
  }, [syncService]);

  // Step 1: Fast local load from IndexedDB (<15ms); network-seed if empty
  const initializeData = useCallback(async () => {
    setIsLoading(true);
    setIsInitialLoadRequired(false);
    try {
      const cachedMeds = await getAllMedications();
      const version = await getStoredVersion();

      if (cachedMeds && cachedMeds.length > 0) {
        setMedications(cachedMeds);
        setVersionInfo(version);
        return;
      }

      // DB is empty — first launch, must seed from remote
      const remoteMeds = await loadFromRemote();
      setMedications(remoteMeds);
    } catch {
      // Network unavailable or fetch failure — surface the "internet required" state
      setIsInitialLoadRequired(true);
    } finally {
      setIsLoading(false);
    }
  }, [loadFromRemote]);

  // Step 2: Background version sentinel check
  const runVersionSentinel = useCallback(async (): Promise<{
    hasUpdate: boolean;
    isOffline: boolean;
    error: boolean;
  }> => {
    if (!enableSentinel) {
      return { hasUpdate: false, isOffline: false, error: false };
    }

    if (!navigator.onLine) {
      return { hasUpdate: false, isOffline: true, error: true };
    }

    try {
      const localVer = versionInfo?.version ?? null;
      const { hasUpdate, remoteVersion } = await syncService.checkUpdate(localVer);

      if (hasUpdate && remoteVersion) {
        setPendingVersion(remoteVersion);
        setIsDataUpdateAvailable(true);
        return { hasUpdate: true, isOffline: false, error: false };
      }
      return { hasUpdate: false, isOffline: false, error: false };
    } catch {
      return { hasUpdate: false, isOffline: false, error: true };
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

  // Retry triggered by the user from the InitialLoadScreen
  const retryInitialLoad = useCallback(async () => {
    setIsLoading(true);
    setIsInitialLoadRequired(false);
    try {
      const remoteMeds = await loadFromRemote();
      setMedications(remoteMeds);
    } catch {
      setIsInitialLoadRequired(true);
    } finally {
      setIsLoading(false);
    }
  }, [loadFromRemote]);

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
    isInitialLoadRequired,
    isDataUpdateAvailable,
    pendingVersion,
    isSuccessToastVisible,
    applyDataUpdate,
    retryInitialLoad,
    dismissDataUpdatePrompt,
    dismissSuccessToast,
    refreshData: runVersionSentinel,
  };
}
