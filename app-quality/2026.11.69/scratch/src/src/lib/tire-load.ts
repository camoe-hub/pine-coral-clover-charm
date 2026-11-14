export type LoadRow = { psi: number; lb: number };

export type TireTable = {
  size: string;
  source: string;
  rows: LoadRow[];
};

/**
 * Single-tire rows only. Dual ratings are lower and are not used.
 * ST225/75R15 is the Goodyear highway trailer table through load range E.
 * The LT sizes are the Goodyear load and inflation table through load range E at 80 psi.
 * A higher load range, or a different brand, is not in this table.
 */
export const TIRE_TABLES: TireTable[] = [
  {
    size: "ST225/75R15",
    source: "Goodyear highway trailer table, single tire, load range E.",
    rows: [
      { psi: 25, lb: 1430 },
      { psi: 30, lb: 1600 },
      { psi: 35, lb: 1760 },
      { psi: 40, lb: 1880 },
      { psi: 45, lb: 2020 },
      { psi: 50, lb: 2150 },
      { psi: 55, lb: 2270 },
      { psi: 60, lb: 2380 },
      { psi: 65, lb: 2540 },
      { psi: 70, lb: 2620 },
      { psi: 75, lb: 2720 },
      { psi: 80, lb: 2830 },
    ],
  },
  {
    size: "LT225/75R16",
    source: "Goodyear load and inflation table, single tire, through load range E at 80 psi.",
    rows: [
      { psi: 35, lb: 1500 },
      { psi: 40, lb: 1650 },
      { psi: 45, lb: 1790 },
      { psi: 50, lb: 1940 },
      { psi: 55, lb: 2060 },
      { psi: 60, lb: 2190 },
      { psi: 65, lb: 2335 },
      { psi: 70, lb: 2440 },
      { psi: 75, lb: 2560 },
      { psi: 80, lb: 2680 },
    ],
  },
  {
    size: "LT235/85R16",
    source: "Goodyear load and inflation table, single tire, through load range E at 80 psi.",
    rows: [
      { psi: 35, lb: 1700 },
      { psi: 40, lb: 1870 },
      { psi: 45, lb: 2030 },
      { psi: 50, lb: 2205 },
      { psi: 55, lb: 2335 },
      { psi: 60, lb: 2485 },
      { psi: 65, lb: 2623 },
      { psi: 70, lb: 2765 },
      { psi: 75, lb: 2905 },
      { psi: 80, lb: 3042 },
    ],
  },
];

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
