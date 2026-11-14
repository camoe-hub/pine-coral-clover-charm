import { deleteFile, getFile, putFile } from "@/lib/files";
import { LEVEL_KEY } from "@/lib/level-spans";
import { tirePhotoIds } from "@/lib/tires";
import { WEIGHTS_KEY } from "@/lib/weights";

const DB = "rivetcare-undo";
const META = "meta";
const BLOBS = "blobs";
const META_KEY = "current";
const BOOK_KEY = "rivetcare-v1";
export const RESTORE_NOTE = "rivetcare-restore-note";

export type FileNote = { id: string; size: number; type: string };

export type RestoreSnap = {
  book: string | null;
  weights: string | null;
  /** Absent on a snapshot taken before floor spans were copied. */
  level?: string | null;
  files: FileNote[];
  added: string[];
};

type FileRef = { id?: string };
type CoachFiles = {
  photoId?: string | null;
  log?: { files?: FileRef[] }[];
  shots?: Record<string, FileRef[]>;
  logDraft?: { files?: FileRef[] } | null;
  tires?: unknown;
};

export type PhoneFiles = CoachFiles & { coaches?: Record<string, CoachFiles> };

let writing = false;
let applying = false;
const listeners = new Set<(on: boolean) => void>();
let known = false;

export function restoreApplying() {
  return applying;
}

export function setRestoreApplying(on: boolean) {
  applying = on;
}
let shared: IDBDatabase | null = null;
let opening: Promise<IDBDatabase> | null = null;

export function photoIdsOnPhone(state: PhoneFiles): string[] {
  const ids = new Set<string>();
  const take = (coach: CoachFiles | undefined) => {
    if (!coach) return;
    if (coach.photoId) ids.add(coach.photoId);
    for (const entry of coach.log ?? []) for (const file of entry.files ?? []) if (file.id) ids.add(file.id);
    for (const files of Object.values(coach.shots ?? {})) for (const file of files) if (file.id) ids.add(file.id);
    for (const file of coach.logDraft?.files ?? []) if (file.id) ids.add(file.id);
    for (const id of tirePhotoIds(coach.tires)) ids.add(id);
  };
  take(state);
  for (const coach of Object.values(state.coaches ?? {})) take(coach);
  return [...ids];
}

export function storedBookOk(raw: string | null): boolean {
  if (raw == null) return true;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return !!parsed && typeof parsed === "object" && !Array.isArray(parsed);
  } catch {
    return false;
  }
}

export function restoredBookOk(raw: string | null): boolean {
  return raw != null && storedBookOk(raw);
}

export function blobMatches(saved: FileNote, size: number, type: string): boolean {
  if (saved.size !== size) return false;
  if (type && type !== saved.type) return false;
  return true;
}

export function sameSnapshot(saved: RestoreSnap, read: RestoreSnap): boolean {
  if (saved.book !== read.book || saved.weights !== read.weights) return false;
  if ((saved.level ?? null) !== (read.level ?? null)) return false;
  if (saved.files.length !== read.files.length) return false;
  const by = new Map(read.files.map((file) => [file.id, file]));
  return saved.files.every((file) => {
    const got = by.get(file.id);
    return !!got && got.size === file.size && got.type === file.type;
  });
}

export function subscribeRestoreHold(fn: (on: boolean) => void) {
  listeners.add(fn);
  fn(known);
  void refreshRestoreHold();
  return () => {
    listeners.delete(fn);
  };
}

function emit(on: boolean) {
  known = on;
  for (const fn of listeners) fn(on);
}

export function closeRestoreUndo() {
  const base = shared;
  shared = null;
  opening = null;
  base?.close();
}

function openDb(): Promise<IDBDatabase> {
  if (shared) return Promise.resolve(shared);
  if (opening) return opening;
  const pending = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("no-store"));
      return;
    }
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const base = req.result;
      if (!base.objectStoreNames.contains(META)) base.createObjectStore(META);
      if (!base.objectStoreNames.contains(BLOBS)) base.createObjectStore(BLOBS);
    };
    req.onsuccess = () => {
      const base = req.result;
      shared = base;
      shared.onversionchange = () => closeRestoreUndo();
      shared.onclose = () => {
        if (shared === base) shared = null;
      };
      resolve(base);
    };
    req.onerror = () => reject(req.error ?? new Error("no-store"));
  });
  opening = pending;
  void pending.finally(() => {
    if (opening === pending) opening = null;
  });
  return pending;
}

function readRaw(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
}

function writeRaw(key: string, value: string | null) {
  if (value == null) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
}

async function readMeta(): Promise<RestoreSnap | null> {
  const base = await openDb();
  return await new Promise((resolve, reject) => {
    const tx = base.transaction(META, "readonly");
    const req = tx.objectStore(META).get(META_KEY);
    req.onsuccess = () => resolve((req.result as RestoreSnap | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error("no-store"));
  });
}

async function writeMeta(snap: RestoreSnap) {
  const base = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = base.transaction(META, "readwrite");
    tx.objectStore(META).put(snap, META_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("no-store"));
  });
}

async function readBlob(id: string): Promise<Blob | null> {
  const base = await openDb();
  return await new Promise((resolve, reject) => {
    const tx = base.transaction(BLOBS, "readonly");
    const req = tx.objectStore(BLOBS).get(id);
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error("no-store"));
  });
}

async function writeBlob(id: string, blob: Blob) {
  const base = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = base.transaction(BLOBS, "readwrite");
    tx.objectStore(BLOBS).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("no-store"));
  });
}

export async function clearRestoreUndo() {
  try {
    const base = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = base.transaction([META, BLOBS], "readwrite");
      tx.objectStore(META).clear();
      tx.objectStore(BLOBS).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("no-store"));
    });
  } catch {
    /* a missing store has nothing to keep */
  }
  emit(false);
}

export async function refreshRestoreHold() {
  try {
    const snap = await readMeta();
    emit(!!snap && storedBookOk(snap.book));
  } catch {
    emit(false);
  }
}

async function verify(saved: RestoreSnap): Promise<boolean> {
  const snap = await readMeta();
  if (!snap || !sameSnapshot(saved, snap) || !storedBookOk(snap.book)) return false;
  for (const file of saved.files) {
    const blob = await readBlob(file.id);
    if (!blob || !blobMatches(file, blob.size, blob.type)) return false;
  }
  return true;
}

/** Copy the log and the photos a restore might replace. Refuse when that copy cannot be read back. */
export async function takeRestoreSnapshot(ids: string[]): Promise<{ ok: true } | { ok: false; message: string }> {
  if (writing || applying) return { ok: false, message: "A restore is already running." };
  writing = true;
  try {
    let existing: RestoreSnap | null = null;
    try {
      existing = await readMeta();
    } catch {
      return { ok: false, message: "Could not save a copy of the current log. Nothing was replaced." };
    }
    if (existing) return { ok: false, message: "Undo the last restore, or keep it, before restoring another file." };
    let book: string | null;
    let weights: string | null;
    let level: string | null;
    try {
      book = readRaw(BOOK_KEY);
      weights = readRaw(WEIGHTS_KEY);
      level = readRaw(LEVEL_KEY);
    } catch {
      return { ok: false, message: "Could not save a copy of the current log. Nothing was replaced." };
    }
    if (!storedBookOk(book)) return { ok: false, message: "The log on this phone could not be read. Nothing was replaced." };
    const notes: FileNote[] = [];
    try {
      for (const id of new Set(ids)) {
        const blob = await getFile(id);
        if (!blob) continue;
        const copy = blob.slice(0, blob.size, blob.type);
        await writeBlob(id, copy);
        notes.push({ id, size: copy.size, type: copy.type });
      }
      const saved: RestoreSnap = { book, weights, level, files: notes, added: [] };
      await writeMeta(saved);
      if (!(await verify(saved))) {
        await clearRestoreUndo();
        return { ok: false, message: "The copy of the current log could not be read back. Nothing was replaced." };
      }
    } catch {
      await clearRestoreUndo();
      return { ok: false, message: "Could not save a copy of the current log. Nothing was replaced." };
    }
    return { ok: true };
  } finally {
    writing = false;
  }
}

export async function noteRestoredFiles(ids: string[]) {
  try {
    const snap = await readMeta();
    if (!snap) return;
    const had = new Set(snap.files.map((file) => file.id));
    snap.added = [...new Set(ids.filter((id) => !had.has(id)))];
    await writeMeta(snap);
  } catch {
    /* undo still puts the previous log back */
  }
}

export async function confirmRestore() {
  await clearRestoreUndo();
}

/** Put the pre-restore log and photos back. The caller reloads so the screen matches. */
export async function undoRestore(): Promise<boolean> {
  let snap: RestoreSnap | null;
  try {
    snap = await readMeta();
  } catch {
    return false;
  }
  if (!snap || !storedBookOk(snap.book)) return false;
  try {
    for (const file of snap.files) {
      const blob = await readBlob(file.id);
      if (!blob || !blobMatches(file, blob.size, blob.type)) return false;
      await putFile(file.id, blob);
    }
    for (const id of snap.added) {
      if (!snap.files.some((file) => file.id === id)) await deleteFile(id);
    }
    writeRaw(BOOK_KEY, snap.book);
    writeRaw(WEIGHTS_KEY, snap.weights);
    if (snap.level !== undefined) writeRaw(LEVEL_KEY, snap.level);
    const bookNow = readRaw(BOOK_KEY);
    const weightsNow = readRaw(WEIGHTS_KEY);
    if (bookNow !== snap.book || weightsNow !== snap.weights) return false;
    if (snap.level !== undefined && readRaw(LEVEL_KEY) !== snap.level) return false;
  } catch {
    return false;
  }
  await clearRestoreUndo();
  return true;
}
