/** Delete every on-phone database, and finish only after each one has succeeded or failed once. */

export const ERASE_DATABASES = ["rivetcare-files", "rivetcare-books", "rivetcare-undo"] as const;

const ERASE_WAIT_MS = 4000;

export function eraseDatabases(
  idb: Pick<IDBFactory, "deleteDatabase">,
  names: readonly string[] = ERASE_DATABASES,
  timeoutMs = ERASE_WAIT_MS,
): Promise<boolean> {
  return new Promise((resolve) => {
    const settled = new Set<string>();
    let ok = true;
    let finished = false;
    const finish = (good: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve(good);
    };
    const settle = (name: string, good: boolean) => {
      if (finished || settled.has(name)) return;
      settled.add(name);
      ok = ok && good;
      if (settled.size === names.length) finish(ok);
    };
    const timer = setTimeout(() => finish(false), timeoutMs);
    try {
      for (const name of names) {
        const req = idb.deleteDatabase(name);
        req.onsuccess = () => settle(name, true);
        req.onerror = () => settle(name, false);
      }
    } catch {
      finish(false);
    }
  });
}
