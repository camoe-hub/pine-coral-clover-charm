/** Symptoms that stay in the data, but are not their own row on Troubleshoot. */
export const foldedInto: Record<string, string> = {
  "inverter-hot": "no-120",
  "inverter-dead": "no-120",
  "pd-code": "no-120",
  "st-hot": "tankless",
  "st-code": "tankless",
  "furnace-flash": "furnace",
  "alde-cold": "alde",
  "alde-fault": "alde",
  "ac-drip": "ac",
  "ac-warm": "ac",
  "ac-soft": "ac",
  "ac-stat": "ac",
  "fridge-flash": "fridge",
  "fridge-yellow": "fridge",
  "brakes-lights": "brakes",
  "brakes-lock": "brakes",
  sway: "tires",
  "lp-alarm": "lp",
  "soft-floor": "leaks",
  "fan-lid": "fan-jack",
  "vent-fan": "fan-jack",
};

export function foldedParent(id: string) {
  return foldedInto[id];
}

export function foldedChildren(id: string) {
  return Object.entries(foldedInto)
    .filter(([, parent]) => parent === id)
    .map(([child]) => child);
}
