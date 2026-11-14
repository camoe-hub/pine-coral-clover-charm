const DB = "rivetcare-files";
const STORE = "blobs";
const MAX_PDF = 15 * 1024 * 1024;
const MAX_EDGE = 1600;

export type PreparedFile = { blob: Blob; mime: string; name: string };

let sharedDb: IDBDatabase | null = null;
let openingDb: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (sharedDb) return Promise.resolve(sharedDb);
  if (openingDb) return openingDb;
  const pending = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("no-store"));
      return;
    }
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => {
      const base = req.result;
      sharedDb = base;
      const drop = () => {
        if (sharedDb === base) sharedDb = null;
      };
      base.onversionchange = () => {
        base.close();
        drop();
      };
      base.onclose = drop;
      resolve(base);
    };
    req.onerror = () => reject(req.error ?? new Error("no-store"));
  });
  openingDb = pending;
  void pending.finally(() => {
    if (openingDb === pending) openingDb = null;
  });
  return pending;
}

export function closeFiles() {
  const base = sharedDb;
  sharedDb = null;
  openingDb = null;
  base?.close();
}

export async function putFile(id: string, blob: Blob) {
  const base = await db();
  await new Promise<void>((resolve, reject) => {
    const tx = base.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("no-store"));
  });
}

export async function getFile(id: string): Promise<Blob | null> {
  const base = await db();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = base.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error("no-store"));
  });
  return blob;
}

export async function deleteFile(id: string) {
  try {
    const base = await db();
    await new Promise<void>((resolve, reject) => {
      const tx = base.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("no-store"));
    });
  } catch {
    /* a missing store should not block removing the log line */
  }
}

function cleanName(name: string, fallback: string) {
  const base = name.split(/[/\\]/).pop()?.replace(/[^\w.\- ()]+/g, "").slice(0, 80);
  return base || fallback;
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

const SHOWABLE = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

function isOddImage(file: File) {
  const type = file.type.toLowerCase().split(";")[0].trim();
  return type === "image/avif" || type === "image/tiff" || type === "image/bmp" || /\.(avif|tiff?|bmp)$/i.test(file.name);
}

function isHeic(file: File) {
  return file.type === "image/heic" || file.type === "image/heif" || /\.hei[cf]$/i.test(file.name);
}

function isImage(file: File) {
  return isHeic(file) || file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}

async function shrinkImage(file: File): Promise<PreparedFile> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("unreadable");
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.72));
  if (!blob) throw new Error("unreadable");
  const stem = cleanName(file.name, "photo").replace(/\.[^.]+$/, "") || "photo";
  return { blob, mime: "image/jpeg", name: `${stem}.jpg` };
}

export async function prepareFile(file: File): Promise<PreparedFile> {
  if (!file.size) throw new Error("unreadable");
  if (isPdf(file)) {
    if (file.size > MAX_PDF) throw new Error("too-big");
    if (!(await hasMagic(file, "application/pdf"))) throw new Error("bad-type");
    return { blob: file, mime: "application/pdf", name: cleanName(file.name, "repair.pdf").replace(/\.pdf$/i, "") + ".pdf" };
  }
  if (!isImage(file)) throw new Error("bad-type");
  try {
    return await shrinkImage(file);
  } catch {
    if (isHeic(file)) throw new Error("heic");
    const type = file.type.toLowerCase().split(";")[0].trim();
    if (SHOWABLE.has(type)) {
      if (file.size > MAX_PDF) throw new Error("too-big");
      if (!(await hasMagic(file, type))) throw new Error("unreadable");
      return { blob: file, mime: type, name: cleanName(file.name, "photo") };
    }
    if (isOddImage(file)) throw new Error("odd-image");
    throw new Error("unreadable");
  }
}

export async function blobToBase64(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const size = 0x6000;
  let out = "";
  for (let i = 0; i < bytes.length; i += size) {
    const slice = bytes.subarray(i, Math.min(bytes.length, i + size));
    out += btoa(String.fromCharCode.apply(null, slice as unknown as number[]));
    if (i + size < bytes.length) await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return out;
}

async function hasMagic(file: Blob, type: string) {
  return magicOk(type, new Uint8Array(await file.slice(0, 16).arrayBuffer()));
}

export function base64ToBlob(data: string, mime: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

const SAFE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"]);

function startsWith(bytes: Uint8Array, sig: number[]) {
  if (bytes.length < sig.length) return false;
  return sig.every((b, i) => bytes[i] === b);
}

function ascii(bytes: Uint8Array, start: number, text: string) {
  if (bytes.length < start + text.length) return false;
  for (let i = 0; i < text.length; i++) if (bytes[start + i] !== text.charCodeAt(i)) return false;
  return true;
}

function magicOk(type: string, bytes: Uint8Array) {
  if (type === "application/pdf") return ascii(bytes, 0, "%PDF");
  if (type === "image/jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]);
  if (type === "image/png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47]);
  if (type === "image/gif") return ascii(bytes, 0, "GIF87a") || ascii(bytes, 0, "GIF89a");
  if (type === "image/webp") return ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WEBP");
  return false;
}

/** A backup may only restore a real photo or PDF. HTML with a fake type is refused. */
export function backupBlob(data: string, mime: string): Blob | null {
  const type = mime.toLowerCase().split(";")[0].trim();
  if (!SAFE_TYPES.has(type)) return null;
  let binary: string;
  try {
    binary = atob(data);
  } catch {
    return null;
  }
  if (!binary.length || binary.length > MAX_PDF) return null;
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  if (!magicOk(type, bytes)) return null;
  return new Blob([bytes], { type });
}

export async function trustedBlob(blob: Blob, mime: string): Promise<Blob | null> {
  const type = mime.toLowerCase().split(";")[0].trim();
  if (!SAFE_TYPES.has(type) || blob.size > MAX_PDF) return null;
  const head = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
  if (!magicOk(type, head)) return null;
  return blob.type === type ? blob : new Blob([await blob.arrayBuffer()], { type });
}
