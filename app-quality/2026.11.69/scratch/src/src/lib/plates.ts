import type { Model } from "@/data/models";

export const PLATE_FIELDS = [
  { key: "water", label: "Water heater", placeholder: "Read the plate" },
  { key: "fridge", label: "Fridge", placeholder: "Read the plate" },
  { key: "furnace", label: "Furnace", placeholder: "Read the plate" },
  { key: "ac", label: "Air conditioner", placeholder: "Read the plate" },
  { key: "axle", label: "Axle", placeholder: "Dexter Torflex" },
] as const;

export type PlateKey = (typeof PLATE_FIELDS)[number]["key"];
export type Plates = Record<PlateKey, string>;

export const emptyPlates: Plates = { water: "", fridge: "", furnace: "", ac: "", axle: "" };

const FLOW_PLATE: Record<string, PlateKey> = {
  hot: "water",
  "fridge-flow": "fridge",
  "furnace-flow": "furnace",
  "alde-heat": "furnace",
  "ac-flow": "ac",
  "brake-flow": "axle",
  "tires-flow": "axle",
};

function cleanPlate(value: unknown) {
  if (typeof value !== "string") return "";
  let text = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    text += code >= 32 ? ch : " ";
  }
  return text.replace(/\s+/g, " ").trim().slice(0, 80);
}

export function asPlates(value: unknown): Plates {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    water: cleanPlate(row.water),
    fridge: cleanPlate(row.fridge),
    furnace: cleanPlate(row.furnace),
    ac: cleanPlate(row.ac),
    axle: cleanPlate(row.axle),
  };
}

export function plateKeyForFlow(flowId: string): PlateKey | null {
  return FLOW_PLATE[flowId] ?? null;
}

export function plateLabel(key: PlateKey) {
  return PLATE_FIELDS.find((field) => field.key === key)?.label ?? key;
}

/** 2027 floor card. Do not name a heater the manual for that floor does not name. */
export function waterHeaterSpec(model: Model): string {
  if (model.alde) {
    return "Alde glycol boiler. Not a Suburban tank and not a tankless. The 2027 model number was not opened, so this card does not say 3030. Read the boiler plate.";
  }
  if (model.id === "bcxe" || model.family === "World Traveler") {
    return "Truma Combi. It is the furnace and the water heater. No anode. Do not blow air through it.";
  }
  if (model.id === "bc16") {
    return "Read the plate. Through 2022 the books name a Truma Combi. A 2026 book names a Suburban IW60. Do not mix those codes.";
  }
  if (model.id === "cv19") {
    return "Not in the 2027 spec set. Read the plate.";
  }
  if (model.family === "Globetrotter") {
    return "2027 brochure: recirculating tankless, maker not named. Do not write Suburban ST-65 unless the plate says it.";
  }
  if (model.family === "Trade Wind" || model.family === "Bambi" || model.family === "Caravel" || model.family === "Frank Lloyd Wright" || model.family === "Stetson") {
    return "Tankless on this 2027 floor. The maker is not named. No anode. Read the plate.";
  }
  return "The 2027 maker is not named. Read the plate. Do not assume a Suburban ST-65.";
}

export function platePlaceholder(model: Model, key: PlateKey): string {
  if (key === "water") {
    if (model.alde) return "Alde, read the boiler plate";
    if (model.id === "bcxe" || model.family === "World Traveler") return "Truma Combi";
    if (model.family === "Globetrotter" || model.family === "Trade Wind") return "Tankless, read the plate";
    return "Read the plate";
  }
  if (key === "furnace") {
    if (model.alde) return "Alde";
    if (model.id === "bcxe" || model.family === "World Traveler") return "Truma Combi";
    return "Read the plate";
  }
  return PLATE_FIELDS.find((field) => field.key === key)?.placeholder ?? "";
}

/** What to show on a matching flowchart. Empty when that plate has not been typed. */
export function plateOnFlow(flowId: string, plates: Plates): { line: string; warn: string } | null {
  const key = plateKeyForFlow(flowId);
  if (!key) return null;
  const value = plates[key];
  if (!value) return null;
  const saysAlde = /alde/i.test(value);
  let warn = "";
  if (flowId === "alde-heat" && !saysAlde) {
    warn = "This chart is the Alde. That plate does not say Alde. Stop if this is not the heater on the coach.";
  } else if (flowId === "furnace-flow" && saysAlde) {
    warn = "This chart is the ducted furnace. That plate says Alde. Stop if this coach has an Alde.";
  }
  return { line: `Plate on this coach: ${plateLabel(key)}, ${value}.`, warn };
}

export function pathSteps(
  flow: { start: string; nodes: Record<string, { type: string; q?: string; yes?: string; no?: string }> },
  trail: string[],
) {
  const steps: { q: string; answer: string }[] = [];
  let id = flow.start;
  for (const answer of trail) {
    const node = flow.nodes[id];
    if (!node || node.type !== "ask" || !node.q || !node.yes || !node.no) break;
    steps.push({ q: node.q, answer });
    id = answer === "Yes" ? node.yes : node.no;
  }
  return steps;
}

export function repairNote(input: {
  coach: string;
  year: number | null;
  flowTitle: string;
  steps: { q: string; answer: string }[];
  stopTitle: string;
  stopBody: string;
  plate?: string;
}) {
  const lines = [
    "Repair note",
    input.coach,
    input.year ? `Year ${input.year}` : "Year not set",
    input.flowTitle,
    "",
    ...input.steps.map((step) => `${step.answer}. ${step.q}`),
    "",
    input.stopTitle,
    input.stopBody.trim(),
  ];
  if (input.plate) lines.push("", input.plate);
  lines.push("", "An aid, not a diagnosis. Not affiliated with Airstream, Inc.");
  return lines.join("\n").slice(0, 2000);
}
