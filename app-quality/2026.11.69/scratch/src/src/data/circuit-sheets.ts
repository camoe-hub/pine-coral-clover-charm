/** Simplified 27FB 50 A lists. Not the factory page. Leg 1 is the same on both sheets. */

export type CircuitRow = {
  circuit: string;
  breaker: string;
  romex: string;
  loads: string;
  amps: string;
};

export type CircuitSection = {
  label: string;
  total: number;
  rows: CircuitRow[];
};

export type CircuitSheet = {
  id: string;
  heading: string;
  sections: CircuitSection[];
  note: string;
};

const NOTE = "Slide-out microwave: 10 A AC limit switch. Romex sizes are W/GND. This table is simplified. It is not the factory page.";

const LEG_1: CircuitSection = {
  label: "MAIN 50 A HACR · 6-3 Romex · LEG 1 total 36.00 A",
  total: 36,
  rows: [
    { circuit: "1", breaker: "20 A HACR", romex: "12-2", loads: "B. Rear A/C (living area), wired direct", amps: "16.00" },
    { circuit: "2", breaker: "15 A HACR", romex: "—", loads: "L. Converter, wired direct", amps: "8.00" },
    { circuit: "3", breaker: "15 A HACR", romex: "14-2", loads: "J. 10 A limit switch (UL-CSA rated). K. Microwave recep", amps: "0.00 / 12.00" },
  ],
};

function leg2(each: "1.50" | "1.00", total: number): CircuitSection {
  return {
    label: `LEG 2 total ${total.toFixed(2)} A`,
    total,
    rows: [
      { circuit: "4", breaker: "15 A HACR", romex: "14-2", loads: "N. 2000 W inverter", amps: "0.00" },
      {
        circuit: "4 (inv.)",
        breaker: "2000 W inverter",
        romex: "12-2",
        loads: "P. C.S. bedroom. R. R.S. bedroom. S. Bedroom TV. T. Living TV. U. Bring-your-own-device recep",
        amps: `${each} each (5)`,
      },
      {
        circuit: "5",
        breaker: "15 A GFCI",
        romex: "14-2",
        loads: "D. Dinette. E. Galley. F. Outside. G. Bath recep",
        amps: `${each} each (4)`,
      },
      { circuit: "6", breaker: "20 A HACR", romex: "12-2", loads: "H. Front A/C (bedroom), wired direct", amps: "16.00" },
    ],
  };
}

const SHEETS: CircuitSheet[] = [
  {
    id: "p92-1",
    heading: "27FB Globetrotter 120 V / 50 A circuit table",
    sections: [LEG_1, leg2("1.50", 29.5)],
    note: NOTE,
  },
  {
    id: "p93-1",
    heading: "27FB Globetrotter 120 V / 50 A circuit table (CSA)",
    sections: [LEG_1, leg2("1.00", 25)],
    note: NOTE,
  },
];

export function circuitSheet(id: string) {
  return SHEETS.find((sheet) => sheet.id === id);
}

/** The amps column, using the running figure for a split cell such as 0.00 / 12.00. */
export function listedAmps(amps: string) {
  const each = /^(\d+(?:\.\d+)?) each \((\d+)\)$/.exec(amps);
  if (each) return Number(each[1]) * Number(each[2]);
  const split = amps.split("/").map((part) => Number(part.trim()));
  if (split.length === 2 && split.every((n) => Number.isFinite(n))) return split[1];
  const value = Number(amps);
  return Number.isFinite(value) ? value : Number.NaN;
}
