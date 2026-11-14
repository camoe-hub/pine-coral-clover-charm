export type SupplyRecord = { propane: string; battery: string };

export const emptySupplies: SupplyRecord = { propane: "", battery: "" };

function asDate(value: unknown) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

export function asSupplies(value: unknown): SupplyRecord {
  if (!value || typeof value !== "object") return emptySupplies;
  const row = value as { propane?: unknown; battery?: unknown };
  return { propane: asDate(row.propane), battery: asDate(row.battery) };
}

function yearsSince(iso: string) {
  if (!iso) return null;
  const then = new Date(`${iso}T12:00:00`).getTime();
  if (Number.isNaN(then)) return null;
  return (Date.now() - then) / (365.25 * 86400000);
}

export function supplyAges(record: SupplyRecord) {
  return {
    propaneYears: yearsSince(record.propane),
    batteryYears: yearsSince(record.battery),
  };
}
