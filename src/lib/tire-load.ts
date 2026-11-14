export type LoadRow = { psi: number; lb: number };

export type TireTable = {
  size: string;
  source: string;
  rows: LoadRow[];
};

/**
 * This edition does not store a tire maker's load rows.
 * The size stays on the coach card. The placard is the pressure.
 */
export const TIRE_TABLES: TireTable[] = [];

export function tireTable(size: string): TireTable | null {
  return TIRE_TABLES.find((table) => table.size === size) ?? null;
}

/** Lowest cold pressure whose row carries this axle-end load. Over the last row is not a made-up pressure. */
export function coldForLoad(size: string, pounds: number): { psi: number; carries: number } | "over" | "empty" {
  const table = tireTable(size);
  if (!table || !Number.isFinite(pounds) || pounds <= 0) return "empty";
  const row = table.rows.find((item) => item.lb >= pounds);
  if (!row) return "over";
  return { psi: row.psi, carries: row.lb };
}
