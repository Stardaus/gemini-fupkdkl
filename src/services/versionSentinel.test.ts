import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkVersionSentinel,
  fetchAndPersistRemoteData,
  extractVersionFromCSV,
  computeMedicationsHash,
  isRemoteVersionNewer,
} from './versionSentinel';
import { clearDB, getAllMedications, getStoredVersion } from './db';

describe('versionSentinel service', () => {
  beforeEach(async () => {
    await clearDB();
    vi.restoreAllMocks();
  });

  it('correctly compares version numbers to prevent lagging CDN node flapping', () => {
    expect(isRemoteVersionNewer('1785414466', '1785414792')).toBe(true);
    expect(isRemoteVersionNewer('1785414792', '1785414466')).toBe(false);
    expect(isRemoteVersionNewer('1785414792', '1785414792')).toBe(false);
    expect(isRemoteVersionNewer('2.0.0-initial', '1785414792')).toBe(true);
    expect(isRemoteVersionNewer(null, '1785414792')).toBe(true);
    expect(isRemoteVersionNewer('1785414792', null)).toBe(false);
  });

  it('computes deterministic content hash for medication records', () => {
    const meds1 = [
      {
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
      },
    ];

    const meds2 = [
      {
        ...meds1[0],
        isQuota: true,
      },
    ];

    const hash1 = computeMedicationsHash(meds1);
    const hash2 = computeMedicationsHash(meds2);

    expect(hash1).not.toBe('0');
    expect(hash2).not.toBe('0');
    expect(hash1).not.toBe(hash2);
  });

  it('extracts version from live Google Sheets CSV format (data_version,1785409094)', () => {
    const liveCSV = 'data_version,1785409094';
    const extracted = extractVersionFromCSV(liveCSV);
    expect(extracted).toBe('1785409094');
  });

  it('returns null for HTML fallback responses or empty CSV', () => {
    expect(extractVersionFromCSV('')).toBeNull();
    expect(extractVersionFromCSV('<!DOCTYPE html><html></html>')).toBeNull();
  });

  it('detects remote version updates against local stored version', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => 'data_version,1785409094',
    } as Response);

    const result = await checkVersionSentinel('/api/version', '1000000000');
    expect(result.hasUpdate).toBe(true);
    expect(result.remoteVersion).toBe('1785409094');
  });

  it('fetches remote data, parses CSV, computes hash, and persists into IndexedDB', async () => {
    const mockCSV = `Generic Name,MAL Registration / Brand Names,Clinical Indications,Quota Control
"Amlodipine 10mg","MAL19984124A","Hypertension","No"`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => mockCSV,
    } as Response);

    const { medications: meds, isNewData, contentHash } = await fetchAndPersistRemoteData('/data/remote.csv', '1785409094');
    expect(meds).toHaveLength(1);
    expect(isNewData).toBe(true);
    expect(meds[0].name).toBe('Amlodipine 10mg');

    const dbMeds = await getAllMedications();
    expect(dbMeds).toHaveLength(1);

    const storedVer = await getStoredVersion();
    expect(storedVer?.version).toBe('1785409094');
    expect(storedVer?.contentHash).toBe(contentHash);

    // Test CDN stale hash branch (isNewData = false)
    const secondFetch = await fetchAndPersistRemoteData('/data/remote.csv', '1785409095', contentHash);
    expect(secondFetch.isNewData).toBe(false);
  });

  it('throws error when remote fetch returns empty dataset or HTML fallback', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => '',
    } as Response);

    await expect(
      fetchAndPersistRemoteData('/data/empty.csv', '1.0.0')
    ).rejects.toThrow('Parsed CSV returned 0 valid medication records');
  });
});
