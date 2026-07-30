import Papa from 'papaparse';
import { parseFormularyCSV } from './csvParser';
import { saveMedications, saveStoredVersion } from './db';
import { Medication, VersionInfo } from '../types/formulary';

export interface VersionCheckResult {
  hasUpdate: boolean;
  remoteVersion: string | null;
}

export interface SyncDataResult {
  medications: Medication[];
  isNewData: boolean;
  contentHash: string;
  versionInfo: VersionInfo;
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

export class FormularySync {
  constructor(
    private readonly versionUrl: string,
    private readonly dataUrl: string
  ) {}

  public async checkUpdate(localVersion: string | null): Promise<VersionCheckResult> {
    try {
      const cacheBustedUrl = `${this.versionUrl}${this.versionUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const response = await fetch(cacheBustedUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) return { hasUpdate: false, remoteVersion: null };

      const contentType = response.headers?.get?.('content-type') || '';
      if (contentType.includes('text/html')) return { hasUpdate: false, remoteVersion: null };

      const remoteText = await response.text();
      const remoteVersion = extractVersionFromCSV(remoteText);

      if (!remoteVersion) return { hasUpdate: false, remoteVersion: null };

      const hasUpdate = isRemoteVersionNewer(localVersion, remoteVersion);
      return { hasUpdate, remoteVersion };
    } catch {
      return { hasUpdate: false, remoteVersion: null };
    }
  }

  public async syncData(targetVersion: string, currentHash?: string): Promise<SyncDataResult> {
    const cacheBustedUrl = `${this.dataUrl}${this.dataUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
    const response = await fetch(cacheBustedUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch remote dataset: ${response.statusText || response.status}`);
    }

    const contentType = response.headers?.get?.('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Remote URL returned HTML fallback instead of CSV dataset');
    }

    const csvText = await response.text();
    if (csvText.trim().startsWith('<')) {
      throw new Error('Remote URL returned HTML fallback instead of CSV dataset');
    }

    const medications = parseFormularyCSV(csvText);
    if (medications.length === 0) {
      throw new Error('Parsed CSV returned 0 valid medication records');
    }

    const newContentHash = computeMedicationsHash(medications);
    const isNewData = !currentHash || newContentHash !== currentHash;

    await saveMedications(medications);
    const versionInfo: VersionInfo = {
      version: targetVersion,
      contentHash: newContentHash,
      lastChecked: Date.now(),
    };
    await saveStoredVersion(versionInfo);

    return { medications, isNewData, contentHash: newContentHash, versionInfo };
  }
}
