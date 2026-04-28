// lib/indexedDB.ts
import { openDB } from 'idb';
import { AuditHistory } from '@/types/auditHistory';

const openDatabase = async () => {
  return openDB('metakit', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('audits')) {
        db.createObjectStore('audits', { keyPath: 'id' });
      }
    },
  });
};

export const saveAudit = async (historyObj: AuditHistory): Promise<void> => {
  const db = await openDatabase();
  await db.put('audits', historyObj);
};

export const getAudits = async (): Promise<AuditHistory[]> => {
  const db = await openDatabase();
  return await db.getAll('audits');
};