import { Medication, FilterCategory } from '../types/formulary';
import { createSearchIndex, searchMedications } from './searchEngine';

export interface QueryResult {
  displayed: Medication[];
  totalCount: number;
  quotaCount: number;
}

export class FormularyQueryEngine {
  private searchIndex: ReturnType<typeof createSearchIndex> | null = null;
  private quotaCountMemo: number = 0;

  constructor(private readonly medications: Medication[] = []) {
    if (medications && medications.length > 0) {
      this.searchIndex = createSearchIndex(medications);
      this.quotaCountMemo = medications.filter((m) => m.isQuota).length;
    }
  }

  public query(searchQuery: string, filter: FilterCategory): QueryResult {
    let list = this.medications;

    if (searchQuery.trim() && this.searchIndex) {
      list = searchMedications(this.searchIndex, list, searchQuery);
    }

    if (filter === 'QUOTA_ONLY') {
      list = list.filter((med) => med.isQuota);
    }

    return {
      displayed: list,
      totalCount: this.medications.length,
      quotaCount: this.quotaCountMemo,
    };
  }
}
