/** Thrown when a screen chunk did not load. The service worker answers a miss with 503. */
export const MISSING_SCREEN = "This screen isn't on this phone yet.";

/** A failed lazy screen, including the swallowed preload that then reads `.default`. */
export function isMissingScreen(error: unknown): boolean {
  const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  if (!message) return false;
  if (message === MISSING_SCREEN) return true;
  return /reading ['"]default['"]|dynamically imported module|Failed to fetch dynamically|error loading dynamically imported module|Importing a module script failed|Unable to preload|ChunkLoadError/i.test(
    message,
  );
}
