import { describe, it, expect } from 'vitest';
import { parseFormularyCSV } from './csvParser';

describe('csvParser service', () => {
  it('returns empty array when csv text is empty or null', () => {
    expect(parseFormularyCSV('')).toEqual([]);
    expect(parseFormularyCSV('   ')).toEqual([]);
  });

  it('parses valid CSV data with primary Malay and English header variations', () => {
    const csvMalay = `Nama Generik,Jenama MAL,Indikasi Klinikal,Kawalan Kuota,Sekatan Preskripsi
"Metformin 850mg","MAL19910457A","Diabetes","1","Kawalan Kuota PKD"`;

    const meds = parseFormularyCSV(csvMalay);
    expect(meds).toHaveLength(1);
    expect(meds[0].name).toBe('Metformin 850mg');
    expect(meds[0].malBrands).toBe('MAL19910457A');
    expect(meds[0].indications).toBe('Diabetes');
    expect(meds[0].isQuota).toBe(true);
  });

  it('handles fallback defaults when fields are missing', () => {
    const csvMinimal = `Generic Name\n"Test Drug"`;
    const meds = parseFormularyCSV(csvMinimal);
    expect(meds).toHaveLength(1);
    expect(meds[0].name).toBe('Test Drug');
    expect(meds[0].malBrands).toBe('N/A');
    expect(meds[0].isQuota).toBe(false);
  });
});
