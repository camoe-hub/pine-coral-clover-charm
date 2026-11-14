import { bookLabel, bookMeta, type BookId } from "@/data/books";
import { aldeCodeOn, fitmentPick, matrixAllows, matrixNote } from "@/data/fitment";
import type { Model } from "@/data/models";
import { recalls } from "@/data/recalls";

const YEAR_LETTERS = "ABCDEFGHJKLMNPRSTVWXY";
const TRANSLIT: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function cleanVin(vin: string) {
  return vin.trim().toUpperCase();
}

export function vinYear(vin: string): number | null {
  const v = cleanVin(vin);
  if (v.length < 10) return null;
  const code = v[9];
  const modern = /[A-HJ-NPR-Z]/.test(v[6] ?? "");
  if (code >= "1" && code <= "9") return (modern ? 2030 : 2000) + Number(code);
  const index = YEAR_LETTERS.indexOf(code);
  if (index < 0) return null;
  return (modern ? 2010 : 1980) + index;
}

function checkDigit(vin: string): string | null {
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return null;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const value = vin[i] >= "0" && vin[i] <= "9" ? Number(vin[i]) : TRANSLIT[vin[i]];
    if (value === undefined) return null;
    sum += value * WEIGHTS[i];
  }
  const remainder = sum % 11;
  return remainder === 10 ? "X" : String(remainder);
}

export function vinProblem(vin: string): string | null {
  const v = cleanVin(vin);
  if (!v) return null;
  if (/[IOQ]/.test(v)) return "A VIN cannot use I, O, or Q";
  if (v.length < 17) return "Enter all 17 characters";
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return "Use only letters and numbers";
  if (v[8] !== checkDigit(v)) return "Check digit does not match";
  if (vinYear(v) === null) return "Year character is not valid";
  return null;
}

export function vinOk(vin: string) {
  return cleanVin(vin).length === 17 && vinProblem(vin) === null;
}

/** The year on the coach. A typed year wins. Otherwise the year comes from a valid VIN. */
export function coachYear(vin: string, typed: number | null | undefined): number | null {
  if (typeof typed === "number" && typed >= 1960 && typed <= 2039) return typed;
  return vinOk(vin) ? vinYear(vin) : null;
}

export const SPEC_YEAR = 2027;

export function vinMismatch(vin: string, model: { id: string; name: string }) {
  if (!vinOk(vin)) return null;
  const year = vinYear(vin);
  if (year == null || year === SPEC_YEAR) return null;
  if (model.id === "other") return `VIN says ${year}. Other is not a ${SPEC_YEAR} floor plan. Use that year’s manual.`;
  return `VIN says ${year}. This card is a ${SPEC_YEAR} ${model.name}.`;
}

type PartLike = {
  id: string;
  pn: string;
  name: string;
  book?: BookId;
  floors?: string[];
};

export function coachPart(part: PartLike, model: Model) {
  const base = { hide: false, pn: part.pn, name: part.name, note: "" };
  if (part.book) {
    const meta = bookMeta(part.book);
    const label = bookLabel(part.book);
    if (model.family !== "Other" && model.family !== meta.family) {
      return { ...base, hide: true, note: `This number is in the ${label} book.` };
    }
    if (part.floors && part.floors.length && model.family === meta.family && !part.floors.includes(model.id)) {
      return { ...base, hide: true, note: "Listed for a different floor plan. Confirm the plate before you order." };
    }
    return base;
  }
  if (model.family === "Other") return base;
  if (part.id === "glycol" || part.id === "alde-boiler") {
    return { ...base, hide: !model.alde, note: model.alde ? "This coach has Alde." : "" };
  }
  if (part.id === "anode" || part.id === "heater-board" || part.id === "tool-anode-socket") {
    return { ...base, hide: model.alde, note: model.alde ? "An Alde coach does not use a Suburban tank anode." : "" };
  }
  if (part.id === "descale" || part.id === "st65") {
    const truma = model.id === "wt17" || model.id === "wt22" || model.id === "bcxe";
    const off = model.alde || truma;
    const note = model.alde ? "This coach is Alde, not a Suburban tankless." : truma ? "This coach is Truma, not a Suburban tankless." : "";
    return { ...base, hide: off, note };
  }
  if (part.id === "inverter") {
    if (model.family === "Trade Wind" || model.id === "bcxe") {
      return { ...base, hide: true, note: "This coach uses a Victron, not this Progressive Dynamics inverter." };
    }
    if (model.family === "Classic") return { ...base, pn: "514515", note: "Classic inverter. Globetrotter is 514263." };
    if (model.family === "Globetrotter") return { ...base, pn: "514263", note: "Globetrotter inverter. Classic is 514515." };
  }
  if (part.id === "toilet") {
    if (model.id === "g30") return { ...base, pn: "602334", name: "Thetford Aqua-Magic toilet", note: "Globetrotter 30RB. Other GT and Classic floors use the Dometic 690621-BOX." };
    if (model.id === "c33") return { ...base, pn: "602659", name: "Dometic macerator toilet", note: "Classic 33FB. 28RB and 30RB use the Dometic china 690621-BOX." };
    if (model.family === "Globetrotter" || model.family === "Classic") {
      return { ...base, pn: "690621-BOX", name: "Dometic toilet", note: "Not the 30RB Thetford or the 33FB macerator." };
    }
  }
  if (part.id === "brakes") {
    if (model.family === "Globetrotter") return { ...base, pn: "410980-102 LH / 410980-103 RH", note: "12 in Nev-R-Adjust. Quote the VIN before you order shoes." };
    if (model.id === "c28") return { ...base, pn: "411262-02", name: "Classic axle, 4,000 lb", note: "28RB. 30RB and 33FB use axle 411262-01." };
    if (model.id === "c30" || model.id === "c33") return { ...base, pn: "411262-01", name: "Classic axle, 5,000 lb", note: "30RB and 33FB. The 28RB uses 411262-02." };
  }
  if (part.id === "fridge") {
    const pn = model.id === "g25" ? "690770" : model.id === "g27" ? "690771-02" : model.id === "c28" ? "690771-01" : model.id === "c33" ? "690735-02" : "";
    if (pn) return { ...base, pn, note: "Matched to this floor plan. Confirm the plate on the fridge." };
  }
  return base;
}

const TRUMA = new Set(["wt17", "wt22", "bcxe"]);

export function bearingsAreRepack(model: Model) {
  return model.family === "Bambi" || model.family === "Basecamp" || model.family === "World Traveler";
}

export function bearingNote(model: Model) {
  if (model.family === "Other") {
    return "Read the hub. Nev-R-Lube is sealed. Bambi, Basecamp, and World Traveler manuals call for a yearly repack.";
  }
  if (bearingsAreRepack(model)) {
    return "This manual says clean and repack yearly. Confirm the hub first. Do not grease a Nev-R-Lube cartridge.";
  }
  return "Nev-R-Lube on this coach. End play 0.001–0.010 in. Do not repack. Inspect at tire rotation or yearly.";
}

export function applianceFits(name: string, model: Model, year?: number | null) {
  return matrixAllows(name, model, year);
}

export function codeFits(code: { id: string; appliance: string }, model: Model, year?: number | null) {
  if (!applianceFits(code.appliance, model, year)) return false;
  if (code.appliance === "Alde 3030" && !aldeCodeOn(code.id, year, model.id)) return false;
  return true;
}

export function fitmentNote(model: Model, year?: number | null) {
  return matrixNote(model, year);
}

const WATER_BRANDS = ["Alde 3030", "Truma Combi", "Girard GSWH-2", "Suburban tank", "Atwood tank", "Suburban ST-65RL", "Suburban IW60", "Fogatti", "Truma AquaGo"];
const TANKLESS = ["Girard GSWH-2", "Suburban ST-65RL", "Suburban IW60", "Truma AquaGo", "Fogatti"];

/** Brands the opened fitment row actually names. An empty set means the year does not name a heater. */
export function waterBrands(model: Model, year?: number | null): Set<string> {
  if (model.family === "Other") return new Set(WATER_BRANDS);
  const show = new Set(fitmentPick(model, year).row?.show ?? []);
  if (model.family === "Classic" && year != null && year <= 2016 && !show.has("Alde 3030")) return new Set(["Atwood tank"]);
  return new Set(WATER_BRANDS.filter((name) => show.has(name)));
}

const SYMPTOM_BRANDS: Record<string, string[]> = {
  "no-hot-tank": ["Suburban tank", "Atwood tank"],
  tankless: ["Girard GSWH-2", "Suburban ST-65RL", "Suburban IW60", "Truma AquaGo", "Truma Combi", "Fogatti"],
  "st-hot": ["Suburban ST-65RL"],
  "st-code": ["Suburban ST-65RL", "Suburban IW60"],
  relief: ["Suburban tank", "Atwood tank", "Girard GSWH-2", "Suburban ST-65RL", "Suburban IW60"],
  "pd-code": ["PD1600 inverter"],
};

const PART_BRANDS: Record<string, string[]> = {
  anode: ["Suburban tank"],
  "heater-board": ["Suburban tank"],
  descale: ["Suburban ST-65RL"],
  st65: ["Suburban ST-65RL"],
  iw60: ["Suburban IW60"],
  "tool-anode-socket": ["Suburban tank"],
};

/** False when this part names a heater the fitment row does not. */
export function partBrandOk(id: string, model: Model, year?: number | null) {
  const brands = PART_BRANDS[id];
  if (!brands || model.family === "Other") return true;
  const have = waterBrands(model, year);
  if (!have.size) return false;
  return brands.some((brand) => have.has(brand));
}

/** False when this check names a heater the fitment row does not. */
export function symptomBrandOk(id: string, model: Model, year?: number | null) {
  const brands = SYMPTOM_BRANDS[id];
  if (!brands || model.family === "Other") return true;
  if (id === "pd-code") return brands.some((brand) => matrixAllows(brand, model, year));
  if (id === "tankless" && matrixAllows("Unnamed tankless", model, year)) return true;
  if (id === "relief" && matrixAllows("Unnamed tankless", model, year)) return true;
  const have = waterBrands(model, year);
  if (!have.size) return false;
  return brands.some((brand) => have.has(brand));
}

/** Alde is the Classic hydronic heater from 2017 on. No other floor plan has it. */
export function coachHasAlde(model: Model, year?: number | null) {
  if (model.family !== "Classic" || !model.alde) return false;
  return !(year != null && year <= 2016);
}

const EXTRA_GEAR: [RegExp, string[]][] = [
  [/\balde\b/i, ["ALDE"]],
  [/\bgirard\b/i, ["Girard GSWH-2"]],
  [/\baquago\b/i, ["Truma AquaGo"]],
  [/\btruma\b/i, ["Truma Combi", "Truma AquaGo"]],
  [/\biw-?60\b/i, ["Suburban IW60"]],
  [/\bst-?65\b/i, ["Suburban ST-65RL"]],
  [/\batwood\b/i, ["Atwood tank"]],
  [/\bsee-?level\b/i, ["SeeLevel II"]],
  [/\bvictron\b|\bcerbo\b/i, ["Victron MultiPlus", "Cerbo GX", "Victron SmartSolar"]],
  [/\bczone\b/i, ["CZone"]],
  [/\bnorcold\b/i, ["Norcold 12 V fridge"]],
  [/\bnova[- ]kool\b/i, ["Nova Kool"]],
  [/\bharbinger\b/i, ["Harbinger"]],
  [/\bfogatti\b/i, ["Fogatti"]],
  [/\bcoleman\b/i, ["Coleman-Mach"]],
];

function extraGearOk(sy: { id: string; title?: string }, model: Model, year?: number | null) {
  if (!sy.id.startsWith("x-")) return true;
  const text = `${sy.id} ${sy.title ?? ""}`;
  if (sy.id.includes("flying-cloud") && model.family !== "Flying Cloud") return false;
  if (sy.id.includes("globetrotter") && model.family !== "Globetrotter") return false;
  if (sy.id.includes("bambi") && model.family !== "Bambi") return false;
  if (sy.id.includes("international") && model.family !== "International") return false;
  if (sy.id.includes("trade-wind") && model.family !== "Trade Wind" && model.family !== "Basecamp") return false;
  if (/\b2027\b/.test(text) && year != null && year < 2027 && !/\b20(1\d|2[0-6])\b/.test(text)) return false;
  const hit = EXTRA_GEAR.filter(([re]) => re.test(text));
  if (!hit.length) return true;
  return hit.some(([, names]) =>
    names.some((name) => (name === "ALDE" ? coachHasAlde(model, year) : name === "Atwood tank" ? waterBrands(model, year).has(name) : matrixAllows(name, model, year))),
  );
}

export function symptomOn(
  sy: { id: string; system: string; fit?: "classic" | "gt"; title?: string },
  model: Model,
  year?: number | null,
  onlyMine = true,
) {
  if (!symptomBrandOk(sy.id, model, year)) return false;
  if (model.family === "Other") return true;
  if (!onlyMine) return true;
  if (!extraGearOk(sy, model, year)) return false;
  const alde = coachHasAlde(model, year);
  if ((sy.system === "Alde" || sy.fit === "classic") && !alde) return false;
  if (sy.system === "Furnace" && alde) return false;
  if (sy.id === "app") return model.family === "Classic" && (year == null || year >= 2025);
  if (sy.id === "footrest") return model.family === "Classic" && year != null && year >= 2021 && year <= 2025;
  if (sy.id === "ac-soft") return model.family === "Trade Wind" && year === 2024;
  if (sy.id === "victron") return matrixAllows("Victron MultiPlus", model, year) || matrixAllows("Cerbo GX", model, year);
  if (sy.id === "ac-stat") return matrixAllows("Coleman-Mach", model, year);
  if (sy.id === "furnace-flash") {
    const truma = matrixAllows("Truma Combi", model, year);
    const ducted = matrixAllows("Dometic furnace", model, year) || matrixAllows("Suburban NT furnace", model, year);
    if (truma && !ducted) return false;
  }
  if ((sy.id === "inverter-hot" || sy.id === "inverter-dead") && model.family === "World Traveler") return false;
  if (sy.fit === "gt") return model.family === "Globetrotter";
  return true;
}

export function procedureFits(id: string, model: Model, year?: number | null) {
  if (model.family === "Other") return true;
  if (id === "tpms") return model.family === "Classic" && (year == null || year === 2027);
  if (id === "alde" || id === "valves") return coachHasAlde(model, year);
  if (id === "furnace") return !coachHasAlde(model, year);
  if (id === "anode") {
    const brands = waterBrands(model, year);
    if (!brands.size) return false;
    return brands.has("Suburban tank");
  }
  if (id === "descale") {
    if (coachHasAlde(model, year)) return false;
    if (TRUMA.has(model.id)) return false;
    const brands = waterBrands(model, year);
    if (!brands.size) return false;
    return TANKLESS.some((brand) => brands.has(brand));
  }
  return true;
}

export function procedureBanner(id: string, model: Model, year?: number | null) {
  if (id === "winterize") return `This coach: blow-out ${model.blowPsi} at the city inlet. If the floor plan is wrong, stop at 30 psi.`;
  if (id === "bearings") return bearingNote(model);
  if (!procedureFits(id, model, year)) return `Not the factory setup on a ${model.short}. The steps stay here in case the coach was changed.`;
  return null;
}

/** A flowchart that names another coach's heater stays off this one. */
export function flowFits(flow: { id: string; fit?: "classic" | "gt" }, model: Model, year?: number | null) {
  if (model.family === "Other") return true;
  if (flow.id === "maint-tpms") return procedureFits("tpms", model, year);
  if (flow.id === "myas") return model.family === "Classic" && (year == null || year >= 2025);
  if (flow.id === "furnace-flow") return !coachHasAlde(model, year);
  if (flow.id === "maint-truma") return matrixAllows("Truma Combi", model, year);
  if (flow.id === "maint-recirc") return model.family === "Trade Wind";
  if (flow.id === "alde-heat" || flow.id === "maint-valves" || flow.id === "maint-cushion" || flow.fit === "classic") return coachHasAlde(model, year);
  if (flow.fit === "gt") return model.family === "Globetrotter";
  return true;
}

const FAMILIES = ["frank lloyd wright", "world traveler", "flying cloud", "trade wind", "globetrotter", "basecamp", "international", "caravel", "classic", "stetson", "bambi"];

function mentionsFamily(text: string, name: string) {
  const denial = new RegExp(`not\\s+(?:${FAMILIES.join("|")})(?:\\s+or\\s+(?:${FAMILIES.join("|")}))*`, "g");
  return text.toLowerCase().replace(denial, " ").includes(name);
}

function floorOf(model: Model): number | null {
  const named = /^(\d{2})/.exec(model.short);
  if (named) return Number(named[1]);
  const match = /^(\d+)/.exec(model.length);
  return match ? Number(match[1]) : null;
}

function yearSpan(startText: string, endText: string | undefined): number[] {
  const start = Number(startText);
  let end = start;
  if (endText) {
    end = Number(endText);
    if (end < 100) end = Math.floor(start / 100) * 100 + end;
    if (end < start || end - start > 30) return [];
  }
  const years: number[] = [];
  for (let y = start; y <= end; y += 1) years.push(y);
  return years;
}

/** A year range that sits immediately in front of the family, and the floor that follows it. */
function campaignClauses(text: string, name: string): { years: number[]; feet: number | null }[] {
  const clauses: { years: number[]; feet: number | null }[] = [];
  const re = new RegExp(`\\b((?:19|20)\\d{2})(?:\\s*[–-]\\s*((?:19|20)?\\d{2}))?\\s+${name}\\b`, "gi");
  const footMark = /^(?:['’′´`]|ft\b|foot\b|feet\b)/i;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    const before = text.slice(Math.max(0, match.index - 5), match.index).toLowerCase();
    if (/\bnot\s*$/.test(before)) continue;
    const years = yearSpan(match[1], match[2]);
    if (!years.length) continue;
    const after = text.slice(match.index + match[0].length);
    const feetLead = /^\s+(\d{2})(?!\d)/.exec(after);
    let feet: number | null = null;
    if (feetLead) {
      const rest = after.slice(feetLead[0].length).trimStart();
      const marked = footMark.test(rest);
      const word = /^[a-z]/i.test(rest);
      if (marked || !word) feet = Number(feetLead[1]);
    }
    clauses.push({ years, feet });
  }
  return clauses;
}

export function recallsFor(model: Model, year?: number | null) {
  if (model.family === "Other") return [];
  const name = model.family.toLowerCase();
  const feet = floorOf(model);
  return recalls.filter((r) => {
    const blob = `${r.models} ${r.tell}`;
    if (!mentionsFamily(blob, name)) return false;
    if (year == null) return true;
    const clauses = [...campaignClauses(r.models, name), ...campaignClauses(r.tell, name)];
    if (!clauses.length) return false;
    const namedFloor = clauses.some((clause) => clause.feet != null);
    return clauses.some((clause) => {
      if (!clause.years.includes(year)) return false;
      if (clause.feet == null) return !namedFloor || feet == null;
      return feet != null && clause.feet === feet;
    });
  });
}

export function coachBudget(model: Model) {
  const fresh = model.fresh === "—" ? "Fresh tank is on the sticker" : `${model.fresh} gal fresh`;
  if (model.id === "tw27") {
    return {
      fresh,
      power: "16 kWh pack, plus about 200 Ah of 12 V",
      note: "Harbinger usable capacity, and two 100 Ah batteries for the 12 V side. Store the pack at 25% or more. A 1,000 W generator only charges. The air conditioner wants about 4,000 W.",
    };
  }
  if (model.id === "tw23" || model.id === "tw25" || model.id === "bcxe") {
    return { fresh, power: "810 Ah lithium", note: "About 9.7 kWh. Keep the inverter off unless you need it. The air conditioner wants about 4,000 W." };
  }
  if (model.id === "flw") {
    return { fresh, power: "100 Ah lithium", note: "One battery behind the LP cover. Inverter outlets are 2,000 W, so a hair dryer will empty it." };
  }
  if (model.family === "Other") {
    return { fresh, power: "See the battery label", note: "Pick the floor plan for a fresh-tank figure. Amp-hours are printed on the battery." };
  }
  if (model.alde || model.family === "Globetrotter") {
    return { fresh, power: "200 Ah lithium", note: "Two 100 Ah batteries. Lights and the furnace sip this. The inverter does not." };
  }
  return { fresh, power: "About 200 Ah (2.5 kWh)", note: "Brochure lithium bank. Read the label before you count on it. Inverter loads empty it much faster than lights." };
}
