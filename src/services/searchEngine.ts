import MiniSearch from 'minisearch';
import { Medication } from '../types/formulary';

export function createSearchIndex(medications: Medication[]): MiniSearch<Medication> {
  const miniSearch = new MiniSearch<Medication>({
    fields: ['name', 'malBrands', 'mdc', 'indications'],
    storeFields: ['id'],
    searchOptions: {
      boost: {
        name: 3,
        malBrands: 2,
        mdc: 2,
        indications: 1,
      },
      prefix: true,
      fuzzy: 0.2,
    },
  });

  miniSearch.addAll(medications);
  return miniSearch;
}

export function searchMedications(
  miniSearch: MiniSearch<Medication>,
  medications: Medication[],
  query: string
): Medication[] {
  if (!query || !query.trim()) {
    return medications;
  }

  const results = miniSearch.search(query.trim());
  const medMap = new Map(medications.map((m) => [m.id, m]));

  const matched: Medication[] = [];
  for (const res of results) {
    const med = medMap.get(res.id);
    if (med) {
      matched.push(med);
    }
  }

  return matched;
}
