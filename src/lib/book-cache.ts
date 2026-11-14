import type { BookPart } from "@/data/books";

const DB = "rivetcare-books";
const STORE = "parts";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("no-store"));
      return;
    }
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("no-store"));
  });
}

function usable(value: unknown): value is BookPart[] {
  return Array.isArray(value) && value.length > 0 && value.every((row) => {
    if (!row || typeof row !== "object") return false;
    const part = row as BookPart;
    return typeof part.id === "string" && typeof part.pn === "string" && typeof part.name === "string" && typeof part.book === "string";
  });
}

export async function readBookParts(): Promise<BookPart[] | null> {
  const value = await getValue("list");
  return usable(value) ? value : null;
}

export async function writeBookParts(parts: BookPart[]): Promise<void> {
  await putValue("list", parts);
}

/** Drop a catalog that an older build saved on this phone. */
export async function dropBookParts(): Promise<void> {
  try {
    const base = await open();
    await new Promise<void>((resolve, reject) => {
      const tx = base.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete("list");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("no-store"));
    });
    base.close();
  } catch {
    /* already gone */
  }
}

function usableZips(value: unknown): value is Record<string, [number, number]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length < 1000) return false;
  for (const [zip, point] of entries) {
    if (!/^\d{5}$/.test(zip) || !Array.isArray(point) || point.length !== 2) return false;
    if (typeof point[0] !== "number" || typeof point[1] !== "number") return false;
  }
  return true;
}

export async function readZipTable(): Promise<Record<string, [number, number]> | null> {
  const value = await getValue("zips");
  return usableZips(value) ? value : null;
}

export async function writeZipTable(table: Record<string, [number, number]>): Promise<void> {
  await putValue("zips", table);
}

async function getValue(key: string): Promise<unknown> {
  try {
    const base = await open();
    const value = await new Promise<unknown>((resolve, reject) => {
      const tx = base.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error("no-store"));
    });
    base.close();
    return value;
  } catch {
    return null;
  }
}

async function putValue(key: string, value: unknown): Promise<void> {
  try {
    const base = await open();
    await new Promise<void>((resolve, reject) => {
      const tx = base.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("no-store"));
    });
    base.close();
  } catch {
    /* the shop table can load again later */
  }
}