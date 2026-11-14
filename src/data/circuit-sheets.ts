/** Breaker lists are not in this edition. */

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

export function circuitSheet(_id: string): CircuitSheet | null {
  return null;
}

export function listedAmps(amps: string) {
  return amps.split("/").reduce((sum, part) => sum + (Number(part.trim()) || 0), 0);
}
