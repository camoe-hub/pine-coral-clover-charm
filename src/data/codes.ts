import { faultTable } from "@/data/fault-table";
import { textHasWords } from "@/data/words";

export type FaultCode = {
  id: string;
  appliance: string;
  code: string;
  meaning: string;
  fix: string;
  /** Named only when this book already points at that document. No invented page. */
  source?: string;
};

export function compactCode(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** E1, E-1, and "E 1" match the same code. E1 does not match E10. */
export function faultCodeMatches(c: FaultCode, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const blob = `${c.code} ${c.appliance} ${c.meaning} ${c.fix} ${c.source ?? ""}`;
  const code = compactCode(c.code);
  const key = compactCode(s);
  if (key.length >= 2 && (key === code || key.replace(/s$/, "") === code || key === code.replace(/s$/, ""))) return true;
  const bits = s
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ""))
    .filter((w) => w.length > 0);
  const usable = bits.filter((w) => w.length >= 2 || (/\d/.test(w) && bits.some((other) => other.length >= 2)));
  if (!usable.length) return false;
  if (usable.some((w) => compactCode(w) === code)) {
    return usable.every((w) => compactCode(w) === code || textHasWords(blob, [w]));
  }
  return textHasWords(blob, usable);
}

export function faultCodeExact(c: FaultCode, q: string): boolean {
  const code = compactCode(c.code);
  if (code.length < 2) return false;
  const key = compactCode(q);
  if (key === code || key.replace(/s$/, "") === code) return true;
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .some((w) => compactCode(w) === code);
}

/** Lower sorts first. A code that is the whole query beats one that only shares a word. */
export function faultCodeRank(c: FaultCode, q: string, onCoach = true): number {
  const query = compactCode(q);
  const code = compactCode(c.code);
  const exactness = query.length >= 2 && query === code ? 0 : faultCodeExact(c, q) ? 1 : 2;
  return exactness * 2 + (onCoach ? 0 : 1);
}

/** Forum wording, not a code from the maker’s sheet. */
export function ownerReportedCode(c: FaultCode) {
  return /forum only|forum reports only/i.test(`${c.meaning} ${c.fix}`);
}

export function symptomForCode(c: FaultCode): string | undefined {
  if (c.appliance === "Suburban ST-65RL" || c.appliance === "Suburban IW60") return "st-code";
  if (c.appliance === "Dometic furnace") return "furnace-flash";
  if (c.appliance === "Alde 3030") return "alde-fault";
  if (c.appliance === "PD1600 inverter") return "pd-code";
  if (c.appliance === "Progressive Industries EMS") return "no-120";
  if (c.appliance === "Norcold 12 V fridge") return "fridge-flash";
  if (c.appliance === "Coleman VS-18") return "ac-stat";
  if (c.appliance === "CZone") return "no-12v";
  if (c.appliance === "TST TPMS") return "tires";
  if (c.appliance === "12 V fridge") return "fridge-flash";
  if (c.appliance === "Coleman thermostat") return "ac-stat";
  if (c.appliance === "SeeLevel II") return "tank-monitor";
  if (c.appliance === "Victron SmartSolar") return "solar";
  if (c.appliance === "Girard GSWH-2" || c.appliance === "Truma AquaGo") return "tankless";
  if (c.appliance === "Truma Combi" || c.appliance === "Truma Combi (230 V)" || c.appliance === "Truma VarioHeat") return "furnace";
  if (c.appliance === "Dometic CCC2" || c.appliance === "Dometic single-zone") return "ac";
  if (c.appliance === "Victron MultiPlus") return "no-120";
  if (c.appliance === "Cerbo GX" || c.appliance === "Battle Born GC3") return "no-12v";
  if (c.appliance === "Suburban NT furnace" || c.appliance === "Dometic DF series furnace" || c.appliance === "Dometic AFM/AFMD furnace") return "furnace-flash";
  if (c.appliance === "Dometic RM fridge" || c.appliance === "Dometic RM1350" || c.appliance === "Dometic RUA" || c.appliance === "Norcold N-series" || c.appliance === "Norcold Polar" || c.appliance === "Norcold N4000") return "fridge";
  if (c.appliance === "Xantrex Freedom HF" || c.appliance === "Xantrex Freedom X") return "no-120";
  if (c.appliance === "Micro-Air EasyTouch" || c.appliance === "GE Profile" || c.appliance === "Dometic 5-button CCC") return "ac";
  if (c.appliance === "TireMinder") return "tires";
  if (c.appliance === "Suburban tank" || c.appliance === "Fogatti") return "tankless";
  if (c.appliance === "Coleman-Mach") return "ac";
  if (c.appliance === "Nova Kool" || c.appliance === "Vitrifrigo") return "fridge-flash";
  if (c.appliance === "WFCO" || c.appliance === "Parallax" || c.appliance === "Harbinger" || c.appliance === "Firefly") return "no-12v";
  if (c.appliance === "Progressive Dynamics" || c.appliance === "Progressive Dynamics PD4000" || c.appliance === "Progressive Dynamics PD4500") return "converter";
}
export const appliances = [
  "Suburban ST-65RL",
  "Suburban IW60",
  "Dometic furnace",
  "Dometic DF series furnace",
  "Dometic AFM/AFMD furnace",
  "Alde 3030",
  "PD1600 inverter",
  "Progressive Industries EMS",
  "Norcold 12 V fridge",
  "Coleman VS-18",
  "CZone",
  "TST TPMS",
  "12 V fridge",
  "Coleman thermostat",
  "SeeLevel II",
  "Victron SmartSolar",
  "Girard GSWH-2",
  "Truma AquaGo",
  "Truma Combi",
  "Truma Combi (230 V)",
  "Truma VarioHeat",
  "Dometic CCC2",
  "Dometic single-zone",
  "Victron MultiPlus",
  "Battle Born GC3",
  "Cerbo GX",
  "Dometic RM fridge",
  "Suburban tank",
  "Suburban NT furnace",
  "Dometic RM1350",
  "Dometic RUA",
  "Norcold N-series",
  "Norcold Polar",
  "Norcold N4000",
  "Dometic 5-button CCC",
  "Xantrex Freedom HF",
  "Xantrex Freedom X",
  "Micro-Air EasyTouch",
  "TireMinder",
  "Lippert Ground Control",
  "GE Profile",
  "Fogatti",
  "Nova Kool",
  "Vitrifrigo",
  "WFCO",
  "Firefly",
  "Harbinger",
  "Coleman-Mach",
  "Progressive Dynamics",
  "Progressive Dynamics PD4000",
  "Progressive Dynamics PD4500",
] as const;

export const faultCodes: FaultCode[] = faultTable;
