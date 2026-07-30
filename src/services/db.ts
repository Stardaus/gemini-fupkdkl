import { openDB, IDBPDatabase } from 'idb';
import { Medication, VersionInfo } from '../types/formulary';

const DB_NAME = 'formulary_db';
const DB_VERSION = 1;

export const STORE_MEDICATIONS = 'medications';
export const STORE_META = 'meta';

export const META_KEY_VERSION = 'version_info';

export interface FormularyDBSchema {
  medications: {
    key: string;
    value: Medication;
    indexes: {
      name: string;
      isQuota: number;
      prescriberCategory: string;
    };
  };
  meta: {
    key: string;
    value: { key: string; value: VersionInfo | unknown };
  };
}

let dbPromise: Promise<IDBPDatabase<FormularyDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<FormularyDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<FormularyDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_MEDICATIONS)) {
          const medStore = db.createObjectStore(STORE_MEDICATIONS, {
            keyPath: 'id',
          });
          medStore.createIndex('name', 'name');
          medStore.createIndex('isQuota', 'isQuota');
          medStore.createIndex('prescriberCategory', 'prescriberCategory');
        }

        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllMedications(): Promise<Medication[]> {
  const db = await getDB();
  return db.getAll(STORE_MEDICATIONS);
}

export async function saveMedications(medications: Medication[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction([STORE_MEDICATIONS], 'readwrite');
  const store = tx.objectStore(STORE_MEDICATIONS);
  await store.clear();
  for (const med of medications) {
    await store.put(med);
  }
  await tx.done;
}

export async function getStoredVersion(): Promise<VersionInfo | null> {
  const db = await getDB();
  const record = await db.get(STORE_META, META_KEY_VERSION);
  if (!record) return null;
  return record.value as VersionInfo;
}

export async function saveStoredVersion(versionInfo: VersionInfo): Promise<void> {
  const db = await getDB();
  await db.put(STORE_META, {
    key: META_KEY_VERSION,
    value: versionInfo,
  });
}

export async function clearDB(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction([STORE_MEDICATIONS, STORE_META], 'readwrite');
  await tx.objectStore(STORE_MEDICATIONS).clear();
  await tx.objectStore(STORE_META).clear();
  await tx.done;
}
