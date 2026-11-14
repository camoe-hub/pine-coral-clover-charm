/** A new copy uses a new script address, so a host that caches /sw.js cannot keep the old worker. */

export function bookWorkerScript(version: string) {
  return `/sw.js?v=${encodeURIComponent(version)}`;
}

export function workerIsCurrent(scriptURL: string, version: string) {
  try {
    const url = new URL(scriptURL, "https://rivetcare.local");
    return url.pathname === "/sw.js" && url.searchParams.get("v") === version;
  } catch {
    return false;
  }
}
