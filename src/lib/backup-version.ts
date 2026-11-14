/** Files with no version are this version. A higher number is refused. */
export const BACKUP_VERSION = 1;
export const BACKUP_APP = "RivetCare";
/** Restore still accepts files written under the previous name. */
export const LEGACY_BACKUP_APP = "SilverBullet";

export function backupVersion(value: unknown): "ok" | "future" | "bad" {
  if (value === undefined) return "ok";
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) return "bad";
  if (value > BACKUP_VERSION) return "future";
  return "ok";
}

export function backupAppOk(value: unknown) {
  if (value == null || value === "") return true;
  if (typeof value !== "string") return false;
  const name = value.trim().toLowerCase();
  return name === BACKUP_APP.toLowerCase() || name === LEGACY_BACKUP_APP.toLowerCase();
}
