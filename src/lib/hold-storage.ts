export type StorageHold = "unknown" | "granted" | "refused" | "unsupported";

let asked = false;
let status: StorageHold = "unknown";
const listeners = new Set<(next: StorageHold) => void>();

function publish(next: StorageHold) {
  status = next;
  for (const fn of listeners) fn(next);
}

export function storageHold() {
  return status;
}

export function subscribeStorageHold(fn: (next: StorageHold) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Read whether this browser has already promised to keep the site. */
export async function readStorageHold(): Promise<StorageHold> {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) {
    publish("unsupported");
    return "unsupported";
  }
  try {
    if (await navigator.storage.persisted?.()) {
      publish("granted");
      return "granted";
    }
  } catch {
    /* a later tap can still ask */
  }
  if (status === "unknown") publish("refused");
  return status;
}

/** Ask the browser to keep this origin. A refusal is reported, not hidden. Call this from a tap. */
export function holdStorage() {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) {
    if (typeof navigator !== "undefined") publish("unsupported");
    return;
  }
  if (asked) return;
  asked = true;
  void navigator.storage.persist().then(
    (ok) => publish(ok ? "granted" : "refused"),
    () => publish("refused"),
  );
}