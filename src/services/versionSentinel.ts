import Papa from 'papaparse';
import { parseFormularyCSV } from './csvParser';
import { saveMedications, saveStoredVersion } from './db';
import { Medication, VersionInfo } from '../types/formulary';

export interface VersionCheckResult {
  hasUpdate: boolean;
  remoteVersion: string | null;
}

export function computeMedicationsHash(medications: Medication[]): string {
  if (!medications || medications.length === 0) return '0';
  let hash = 0x811c9dc5;
  for (let i = 0; i < medications.length; i++) {
    const m = medications[i];
    const str = `${m.name}|${m.malBrands}|${m.prescriberCategory}|${m.indications}|${m.isQuota}|${m.dosage}`;
    for (let j = 0; j < str.length; j++) {
      hash ^= str.charCodeAt(j);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
  }
  return (hash >>> 0).toString(16);
}

export function isRemoteVersionNewer(
  localVer: string | null,
  remoteVer: string | null
): boolean {
  if (!remoteVer) return false;
  if (!localVer) return true;

  const cleanLocal = localVer.trim();
  const cleanRemote = remoteVer.trim();

  if (cleanLocal === cleanRemote) return false;

  const numLocal = Number(cleanLocal);
  const numRemote = Number(cleanRemote);

  if (!Number.isNaN(numLocal) && !Number.isNaN(numRemote)) {
    return numRemote > numLocal;
  }

  if (cleanLocal === '2.0.0-initial') return true;

  return cleanRemote.localeCompare(cleanLocal, undefined, { numeric: true }) > 0;
}

export function extractVersionFromCSV(csvText: string): string | null {
  if (!csvText || !csvText.trim()) return null;

  const trimmedText = csvText.trim();
  if (trimmedText.startsWith('<')) return null;

  const result = Papa.parse<Record<string, string>>(trimmedText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (result.data && result.data.length > 0) {
    const row = result.data[0];
    const versionVal =
      row['data_version'] ||
      row['Version'] ||
      row['version'] ||
      row['formulary_version'] ||
      Object.values(row)[0];

    if (versionVal && typeof versionVal === 'string') {
      const clean = versionVal.trim();
      if (clean && !clean.startsWith('<') && clean.length <= 50) {
        return clean;
      }
    }
  }

  // Fallback: parse direct 2nd token from "data_version,1785409094" or line 1
  const lines = trimmedText.split('\n');
  if (lines.length > 0) {
    const parts = lines[0].split(',');
    const rawVal = parts.length >= 2 ? parts[1].trim() : parts[0].trim();
    if (rawVal && !rawVal.startsWith('<') && rawVal.length <= 50) {
      return rawVal;
    }
  }

  return null;
}

export async function checkVersionSentinel(
  versionUrl: string,
  localVersion: string | null
): Promise<VersionCheckResult> {
  try {
    const cacheBustedUrl = `${versionUrl}${versionUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
    console.log(`[DATA-UPDATE-DEBUG] Checking version sentinel at ${cacheBustedUrl} (Local Version: "${localVersion}")`);

    const response = await fetch(cacheBustedUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      console.warn(`[DATA-UPDATE-DEBUG] Version check HTTP failure: ${response.status} ${response.statusText}`);
      return { hasUpdate: false, remoteVersion: null };
    }

    const contentType = response.headers?.get?.('content-type') || '';
    if (contentType.includes('text/html')) {
      console.warn('[DATA-UPDATE-DEBUG] Version check returned HTML fallback.');
      return { hasUpdate: false, remoteVersion: null };
    }

    const remoteText = await response.text();
    const remoteVersion = extractVersionFromCSV(remoteText);

    if (!remoteVersion) {
      console.warn('[DATA-UPDATE-DEBUG] Failed to extract version token from CSV.');
      return { hasUpdate: false, remoteVersion: null };
    }

    const hasUpdate = isRemoteVersionNewer(localVersion, remoteVersion);
    console.log(`[DATA-UPDATE-DEBUG] Version Sentinel Result => Local: "${localVersion}", Remote: "${remoteVersion}", HasUpdate: ${hasUpdate}`);
    return { hasUpdate, remoteVersion };
  } catch (err) {
    console.error('[DATA-UPDATE-DEBUG] Exception during checkVersionSentinel:', err);
    return { hasUpdate: false, remoteVersion: null };
  }
}

export interface FetchRemoteDataResult {
  medications: Medication[];
  isNewData: boolean;
  contentHash: string;
}

export async function fetchAndPersistRemoteData(
  dataUrl: string,
  newVersion: string,
  currentContentHash?: string
): Promise<FetchRemoteDataResult> {
  const cacheBustedUrl = `${dataUrl}${dataUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
  console.log(`[DATA-UPDATE-DEBUG] Fetching remote dataset from: ${cacheBustedUrl}`);

  const response = await fetch(cacheBustedUrl, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  });

  if (!response.ok) {
    console.error(`[DATA-UPDATE-DEBUG] Remote CSV fetch failed with HTTP status ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch remote data: ${response.statusText || response.status}`);
  }

  const contentType = response.headers?.get?.('content-type') || '';
  if (contentType.includes('text/html')) {
    console.error('[DATA-UPDATE-DEBUG] Remote URL returned HTML fallback.');
    throw new Error('Remote URL returned HTML fallback instead of CSV dataset');
  }

  const csvText = await response.text();
  if (csvText.trim().startsWith('<')) {
    console.error('[DATA-UPDATE-DEBUG] Remote URL content starts with "<" (HTML doc).');
    throw new Error('Remote URL returned HTML fallback instead of CSV dataset');
  }

  const medications = parseFormularyCSV(csvText);

  if (medications.length === 0) {
    console.error('[DATA-UPDATE-DEBUG] Parsed CSV returned 0 valid medication rows.');
    throw new Error('Parsed CSV returned 0 valid medication records');
  }

  const newContentHash = computeMedicationsHash(medications);
  const isNewData = !currentContentHash || newContentHash !== currentContentHash;

  console.log(`[DATA-UPDATE-DEBUG] Remote CSV parsed successfully: ${medications.length} rows. OldHash: "${currentContentHash}", NewHash: "${newContentHash}", IsNewData: ${isNewData}`);

  // Save medications and commit target version into IndexedDB
  await saveMedications(medications);
  const versionInfo: VersionInfo = {
    version: newVersion,
    contentHash: newContentHash,
    lastChecked: Date.now(),
  };
  await saveStoredVersion(versionInfo);
  console.log(`[DATA-UPDATE-DEBUG] Successfully committed version "${newVersion}" & ${medications.length} rows to IndexedDB.`);

  return { medications, isNewData, contentHash: newContentHash };
}
