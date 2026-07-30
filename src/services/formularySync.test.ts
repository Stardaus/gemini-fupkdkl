import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  FormularySync,
  computeMedicationsHash,
  isRemoteVersionNewer,
  extractVersionFromCSV,
} from './formularySync';
import { clearDB, getAllMedications, getStoredVersion } from './db';

describe('FormularySync deep module', () => {
  beforeEach(async () => {
    await clearDB();
    vi.restoreAllMocks();
  });

  it('compares version strings and handles semver & null comparisons', () => {
    expect(isRemoteVersionNewer('1785414466', '1785414792')).toBe(true);
    expect(isRemoteVersionNewer('1785414792', '1785414466')).toBe(false);
    expect(isRemoteVersionNewer('1785414792', '1785414792')).toBe(false);
    expect(isRemoteVersionNewer('2.0.0-initial', '1785414792')).toBe(true);
    expect(isRemoteVersionNewer(null, '1785414792')).toBe(true);
    expect(isRemoteVersionNewer('1785414792', null)).toBe(false);
    expect(isRemoteVersionNewer('v1.0.0', 'v1.1.0')).toBe(true);
  });

  it('computes deterministic content hash and handles empty medication list', () => {
    expect(computeMedicationsHash([])).toBe('0');
    const meds = [
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
    const hash = computeMedicationsHash(meds);
    expect(hash).not.toBe('0');
  });

  it('extracts version from CSV text and handles invalid or HTML content', () => {
    expect(extractVersionFromCSV('')).toBeNull();
    expect(extractVersionFromCSV('<!DOCTYPE html><html></html>')).toBeNull();
    expect(extractVersionFromCSV('data_version,1785414792')).toBe('1785414792');
  });

  it('checks version sentinel against local version and handles HTTP & HTML failures', async () => {
    const sync = new FormularySync('/api/version', '/api/data');

    // 1. Valid update
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => 'data_version,1785414792',
    } as Response);

    const res1 = await sync.checkUpdate('1785414466');
    expect(res1.hasUpdate).toBe(true);
    expect(res1.remoteVersion).toBe('1785414792');

    // 2. HTTP Error
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    } as Response);

    const res2 = await sync.checkUpdate('1785414466');
    expect(res2.hasUpdate).toBe(false);

    // 3. HTML Fallback
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/html' }),
      text: async () => '<html>Error</html>',
    } as Response);

    const res3 = await sync.checkUpdate('1785414466');
    expect(res3.hasUpdate).toBe(false);

    // 4. Exception throw
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));
    const res4 = await sync.checkUpdate('1785414466');
    expect(res4.hasUpdate).toBe(false);
  });

  it('syncs data, parses CSV, computes hash, commits to DB, and handles errors', async () => {
    const sync = new FormularySync('/api/version', '/api/data');
    const mockCSV = `Generic Name,MAL Registration / Brand Names,Clinical Indications,Quota Control
"Amlodipine 10mg","MAL19984124A","Hypertension","No"`;

    // 1. Success sync
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => mockCSV,
    } as Response);

    const { medications: meds, isNewData, versionInfo } = await sync.syncData('1785414792');
    expect(meds).toHaveLength(1);
    expect(isNewData).toBe(true);
    expect(versionInfo.version).toBe('1785414792');

    const dbMeds = await getAllMedications();
    expect(dbMeds).toHaveLength(1);

    const storedVer = await getStoredVersion();
    expect(storedVer?.version).toBe('1785414792');

    // 2. Stale CDN hash branch (isNewData = false)
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => mockCSV,
    } as Response);

    const secondSync = await sync.syncData('1785414793', versionInfo.contentHash);
    expect(secondSync.isNewData).toBe(false);

    // 3. HTTP Error
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    } as Response);

    await expect(sync.syncData('1.0.0')).rejects.toThrow('Failed to fetch remote dataset');

    // 4. HTML Content Type
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/html' }),
      text: async () => '<html>Error</html>',
    } as Response);

    await expect(sync.syncData('1.0.0')).rejects.toThrow('Remote URL returned HTML fallback');

    // 5. HTML Body
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => '<!DOCTYPE html><html>Error</html>',
    } as Response);

    await expect(sync.syncData('1.0.0')).rejects.toThrow('Remote URL returned HTML fallback');

    // 6. Empty CSV
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => '',
    } as Response);

    await expect(sync.syncData('1.0.0')).rejects.toThrow('Parsed CSV returned 0 valid medication records');
  });
});
