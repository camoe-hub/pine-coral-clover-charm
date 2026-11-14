import type { Family, Model } from "@/data/models";

export type FitRow = {
  family: Family;
  from: number;
  to: number;
  show: string[];
  note: string;
  id?: string;
};

const row = (family: Family, from: number, to: number, show: string[], note: string, id?: string): FitRow => ({
  family,
  from,
  to,
  show,
  note,
  id,
});

/** Named appliances only. A year with no book uses the nearest opened year, and the note says so. */
export const fitmentRows: FitRow[] = [
  row("Classic", 2010, 2010, ["Atwood tank"], "2010 manual names an Atwood tank. The furnace is Hydroflame with no maker, and the air and fridge makers were not named."),
  row("Classic", 2011, 2015, ["Atwood tank", "Dometic CCC2", "Dometic RM fridge", "SeeLevel II", "WFCO", "Parallax"], "2011–2015 were not opened. This is the 2016 pre-Alde list: Atwood tank, CCC2, Dometic RM, SeeLevel, WFCO, and Parallax. No Alde. Read the plate."),
  row("Classic", 2016, 2016, ["Atwood tank", "Dometic CCC2", "Dometic RM fridge", "SeeLevel II", "WFCO", "Parallax"], "2016 parts book: Atwood tank, CCC2, Dometic RM3962, Parallax, WFCO 1000 W. No Alde. Furnace maker not named."),
  row("Classic", 2017, 2017, ["Alde 3030", "Dometic CCC2", "SeeLevel II", "Firefly", "Parallax"], "2017 parts book: Alde 3010, CCC2, Firefly, Parallax. A late 2017 build can already be a 3020. Fridge maker not named."),
  row("Classic", 2018, 2018, ["Alde 3030", "Firefly"], "2018 parts book: Alde 3020. Firefly that year is an owner report, not a parts-book line."),
  row("Classic", 2019, 2019, ["Alde 3030", "CZone", "SeeLevel II"], "2019 parts book: Alde 3020 and CZone. No separate CCC2."),
  row("Classic", 2020, 2021, ["Alde 3030", "CZone"], "Manual years. The 2021 fridge changed mid-year. Do not assume Norcold or Dometic."),
  row("Classic", 2022, 2022, ["Alde 3030", "CZone", "Coleman-Mach"], "2022 parts book: Alde 3020, Coleman-Mach 8, CZone. Mach 8 has no numbered codes. Do not use VS-18 numbers."),
  row("Classic", 2023, 2023, ["CZone", "12 V fridge"], "Dealer listing: a 12 V fridge, maker not named, and CZone. The Alde model was not verified. It is not a 3030."),
  row("Classic", 2024, 2024, ["Alde 3030"], "A 2024 owner still had a 3020, not a 3030. Air, the tank monitor, and CZone were not verified for 2024 and are not copied."),
  row("Classic", 2025, 2025, ["Alde 3030", "Coleman-Mach"], "Coleman-Mach 8 Signature is an owner report. The 2025 Alde model was not in a parts book. CZone was not verified."),
  row("Classic", 2026, 2026, ["Alde 3030", "Coleman-Mach", "CZone"], "A 3030 is confirmed on a 2026 28 only. Coleman-Mach 8 Plus. CZone that year is an owner report."),
  row("Classic", 2027, 2027, ["Alde 3030"], "The 2027 boiler model, air conditioner, and control system were not opened. Nothing is copied from 2026."),
  row("Globetrotter", 2019, 2019, ["Dometic CCC2", "Dometic RM fridge"], "Dealer spec: absorption fridge. The parts-book appliance pages were not extracted. No Girard."),
  row("Globetrotter", 2020, 2020, ["Dometic RM fridge"], "Provisional. A 6-gallon tank is a spec note, and the maker was not named. Suburban is not copied onto it."),
  row("Globetrotter", 2021, 2021, ["Girard GSWH-2", "Dometic CCC2", "SeeLevel II", "12 V fridge", "Nova Kool"], "2021 parts book: Girard and SeeLevel II. Nova Kool is named on the 25. The 27 and 30 makers are not. Not a Norcold letter code."),
  row("Globetrotter", 2022, 2022, ["Girard GSWH-2", "Dometic CCC2", "SeeLevel II", "12 V fridge", "Nova Kool", "PD1600 inverter"], "2022 parts book: Girard, CCC2, SeeLevel, Progressive Dynamics 1000 W. Nova Kool is named on the 23 and 25. Furnace maker not named."),
  row("Globetrotter", 2023, 2024, ["Girard GSWH-2", "12 V fridge"], "Those parts books were not extracted. Girard is the hypothesis from the surrounding years."),
  row("Globetrotter", 2025, 2026, ["Suburban ST-65RL", "Suburban IW60", "12 V fridge"], "Owners report Suburban from 2025, under both ST65RL and IW60RL. One 2025 lot still showed a Girard. The 2026 book was not opened separately. Read the plate."),
  row("Globetrotter", 2027, 2027, ["Unnamed tankless", "12 V fridge"], "2027 brochure: recirculating tankless, maker not named. Suburban and Girard codes are not copied onto it. The 12 V compressor maker was not named. Read the plate before you use a code."),
  row("Flying Cloud", 2010, 2012, ["Dometic CCC2"], "Spec sheets name a CCC thermostat. The tank and the fridge makers were not named, so those lists stay in search."),
  row("Flying Cloud", 2013, 2013, ["Dometic RM fridge"], "2013 parts book prints RM2451, RM3762, and DM2862. The water heater and air pages were not extracted."),
  row("Flying Cloud", 2014, 2015, ["Atwood tank", "Dometic CCC2", "Dometic RM fridge"], "Listings: Atwood tank and a Dometic absorption fridge."),
  row("Flying Cloud", 2017, 2017, ["Dometic CCC2", "Dometic RM fridge"], "Listings name a Dometic tank heater and a Dometic absorption fridge. That is not a Suburban tank. 2016 was not found and is not copied from either side."),
  row("Flying Cloud", 2018, 2018, ["Dometic CCC2"], "2018 parts book: Comfort Control Center. The 6-gallon tank and the fridge maker were not named."),
  row("Flying Cloud", 2019, 2020, ["Suburban tank", "Dometic CCC2", "Dometic RM fridge", "SeeLevel II"], "SeeLevel II is verified in the 2019 manual."),
  row("Flying Cloud", 2021, 2021, ["Girard GSWH-2", "Dometic CCC2", "12 V fridge"], "2021 parts book: Girard. The fridge maker is not named."),
  row("Flying Cloud", 2022, 2022, ["Girard GSWH-2", "Dometic CCC2", "SeeLevel II", "12 V fridge", "PD1600 inverter", "Nova Kool"], "2022 parts book: Girard, Nova Kool, SeeLevel, Progressive Dynamics 1000 W."),
  row("Flying Cloud", 2023, 2023, ["Girard GSWH-2", "12 V fridge", "PD1600 inverter"], "A 2023 review names Girard and a Progressive Dynamics 1000 W inverter. Not a parts book."),
  row("Flying Cloud", 2024, 2024, ["Girard GSWH-2", "12 V fridge"], "An owner listing names Girard. The fridge maker is a conflict and was not picked. The inverter was not named."),
  row("Flying Cloud", 2025, 2025, ["12 V fridge"], "The 2025 water-heater maker is not named. Suburban was not copied over from the Globetrotter."),
  row("Flying Cloud", 2026, 2026, ["12 V fridge", "SeeLevel II", "GE Profile"], "The 2026 manual points the thermostat at GE and names SeeLevel. The water-heater maker is still not named."),
  row("Flying Cloud", 2027, 2027, ["12 V fridge"], "No 2027 parts book. A dealer page says 12 V, maker not named. A press GE claim and an AquaHot claim were not adopted."),
  row("International", 2019, 2019, ["Dometic CCC2"], "2019 listings did not name the furnace, fridge, air, or tank. A 6-gallon tank in the next book does not name the maker, so no tank brand is shown."),
  row("International", 2020, 2020, ["Dometic CCC2"], "2020 book: 6-gallon tank, maker not named, and CCC2. A Dometic fridge is one owner report and is not shown as factory."),
  row("International", 2021, 2021, ["Girard GSWH-2", "Dometic CCC2", "SeeLevel II"], "The manual uses the Girard model code and CCC2. The fridge that year is absorption in the manual and 12 V in some listings. Neither is shown."),
  row("International", 2022, 2023, ["Girard GSWH-2", "Dometic CCC2", "SeeLevel II", "12 V fridge", "PD1600 inverter", "Nova Kool"], "Parts books: Girard, CCC2, SeeLevel, Progressive Dynamics 1000 W. Nova Kool is named on the 23."),
  row("International", 2024, 2024, ["Girard GSWH-2", "SeeLevel II", "12 V fridge", "PD1600 inverter", "Nova Kool", "GE Profile", "Victron SmartSolar"], "2024 book: Girard, GE Profile, Progressive Dynamics 2000 W. Victron is the solar option, not the inverter."),
  row("International", 2025, 2025, ["Girard GSWH-2", "12 V fridge"], "An owner was winterizing a Girard. Not a parts book. GE was not copied forward."),
  row("International", 2026, 2026, ["12 V fridge", "SeeLevel II", "GE Profile"], "The manual points the thermostat at GE. The water-heater maker is not named. 2027 was not found."),
  row("Caravel", 2021, 2021, ["Girard GSWH-2", "Dometic CCC2", "SeeLevel II", "12 V fridge", "PD1600 inverter", "Nova Kool"], "2021 parts book: Girard, CCC, Nova Kool, Progressive Dynamics 1000 W."),
  row("Caravel", 2023, 2024, ["Girard GSWH-2", "Dometic CCC2", "SeeLevel II", "12 V fridge", "PD1600 inverter", "Nova Kool", "Vitrifrigo"], "Parts books: Girard and CCC. 2024 inverter is a Progressive Dynamics 2000 W. 2022 was not opened."),
  row("Caravel", 2025, 2025, ["Girard GSWH-2", "SeeLevel II", "12 V fridge", "PD1600 inverter", "GE Profile", "Nova Kool", "Vitrifrigo"], "2025 parts book: Girard, GE Profile, Progressive Dynamics 2000 W."),
  row("Caravel", 2026, 2026, ["Fogatti", "SeeLevel II", "12 V fridge", "PD1600 inverter", "GE Profile", "Nova Kool", "Vitrifrigo"], "2026 parts book: Fogatti replaces Girard. No Fogatti codes were found."),
  row("Bambi", 2022, 2022, ["Girard GSWH-2", "SeeLevel II", "12 V fridge", "Nova Kool"], "2022 parts book: Girard and Nova Kool. No inverter in that book. 2020, 2021, 2024, and 2027 were not opened."),
  row("Bambi", 2023, 2023, ["SeeLevel II", "12 V fridge", "Vitrifrigo"], "2023 manual: tankless, maker not named, and SeeLevel. Vitrifrigo is from press and a forum, not a parts book."),
  row("Bambi", 2025, 2025, ["GE Profile"], "2025 GE is an owner quote of a parts book. The fridge and the water heater were not named."),
  row("Bambi", 2026, 2026, ["12 V fridge"], "2026 spec: 12 V fridge, maker not named. The water heater and the air conditioner were not named."),
  row("Basecamp", 2017, 2017, ["Truma Combi", "Coleman-Mach"], "2017 parts book, 16 only: Truma Combi Eco Plus and a Mach 8 Polar Cub. The fridge maker was not named. The converter and the tank monitor were not in that extract.", "bc16"),
  row("Basecamp", 2020, 2020, ["Truma Combi", "Coleman-Mach", "Nova Kool"], "2020 parts book, 16 only: Truma Combi Eco Plus, Mach 8, Nova Kool 3.1. The 20 was not in that extract.", "bc16"),
  row("Basecamp", 2022, 2022, ["Truma Combi", "Coleman-Mach", "Nova Kool", "SeeLevel II", "Progressive Dynamics"], "2022 parts book, 16: Truma Combi Eco Plus, Nova Kool 3.1, SeeLevel, Progressive Dynamics power center 513802. The 20 that year is Suburban, not this row.", "bc16"),
  row("Basecamp", 2023, 2025, ["Truma Combi", "Dometic furnace", "Suburban IW60", "Coleman-Mach", "Nova Kool", "SeeLevel II", "Progressive Dynamics"], "2023–2025 books were not opened. The 16 still had a Truma in 2022 and a Dometic furnace plus Suburban IW60 in 2026. Both lists are here. Read the heater plate. Do not use Truma codes on a Suburban, or IW60 codes on a Combi.", "bc16"),
  row("Basecamp", 2026, 2026, ["Dometic furnace", "Suburban IW60", "Coleman-Mach", "Nova Kool", "SeeLevel II", "Progressive Dynamics"], "2026 parts book, 16: Truma is gone. Dometic 12,000 BTU furnace 690798-01, Suburban IW60, Mach 8, Nova Kool, SeeLevel, Progressive Dynamics 513802. Read the furnace-board decal before you use the flash list.", "bc16"),
  row("Basecamp", 2022, 2022, ["Suburban IW60", "Suburban NT furnace", "SeeLevel II", "12 V fridge", "Nova Kool", "Coleman-Mach", "Progressive Dynamics"], "2022 Basecamp 20: Suburban 16,000 BTU furnace and IW60, Mach 8, Nova Kool, SeeLevel, Progressive Dynamics 513802. This row is not the 16, which still had a Truma.", "bc20"),
  row("Basecamp", 2026, 2026, ["Suburban IW60", "Suburban NT furnace", "SeeLevel II", "12 V fridge", "Nova Kool", "Coleman-Mach", "Progressive Dynamics"], "2026 Basecamp 20: Suburban 19,000 BTU furnace, IW60, Mach 8 Plus, Nova Kool, SeeLevel, Progressive Dynamics 513802. The 16 dropped Truma the same year.", "bc20"),
  row("Basecamp", 2026, 2027, ["Truma Combi", "Victron MultiPlus", "Victron SmartSolar", "Cerbo GX", "Battle Born GC3", "12 V fridge"], "2027 Basecamp 20XE manual: Truma Combi is the furnace and the water heater. Victron, Cerbo, and Battle Born are on this card from the coach spec. The parts book was not opened.", "bcxe"),
  row("Trade Wind", 2024, 2024, ["Suburban IW60", "Victron MultiPlus", "Victron SmartSolar", "Cerbo GX", "GE Profile", "12 V fridge"], "2024 manual and recall: GE air, Victron, Suburban tankless. The exact Suburban model and SeeLevel were not confirmed. The fridge maker was not picked."),
  row("Trade Wind", 2025, 2025, ["Suburban IW60", "Victron MultiPlus", "Victron SmartSolar", "Cerbo GX", "GE Profile", "12 V fridge", "SeeLevel II", "Battle Born GC3", "Nova Kool"], "2025 parts book: IW60RL, MultiPlus-II, Cerbo, SeeLevel, Battle Born. Nova Kool is named on the 23."),
  row("Trade Wind", 2026, 2026, ["Suburban IW60", "Victron MultiPlus", "Victron SmartSolar", "Cerbo GX", "GE Profile", "12 V fridge", "SeeLevel II", "Battle Born GC3", "Nova Kool"], "2026 brochure does not name the water heater, air, inverter, or tank monitor. The 2025 parts book and the 2027 manual on the 23 and 25 agree on Victron and GE, so those lists are shown. Harbinger is the 2027 27FB only. Read the plate."),
  row("Trade Wind", 2027, 2027, ["Victron MultiPlus", "Victron SmartSolar", "Cerbo GX", "GE Profile", "12 V fridge"], "2027 manual: Victron on the 23 and 25. The thermostat page points at GE. The water heater is tankless, maker not named. SeeLevel was not confirmed."),
  row("Trade Wind", 2027, 2027, ["Harbinger", "GE Profile", "12 V fridge"], "2027 27FB only: Harbinger replaces Victron. The water heater maker was not named. The Harbinger screen has its own alarms. Victron numbers do not apply.", "tw27"),
  row("World Traveler", 2026, 2027, ["Truma Combi"], "Brochure and dealer lists: Truma Combi Eco Plus is the furnace and the water heater. No separate inverter."),
  row("Frank Lloyd Wright", 2026, 2026, ["12 V fridge"], "Spec sheet: 12 V fridge, unnamed furnace, unnamed tankless. Probeless is not recorded as SeeLevel. 2027 was not confirmed."),
  row("Stetson", 2026, 2027, ["12 V fridge"], "Dealer specs: 12 V fridge and an unnamed tankless heater. The inverter maker is not named."),
];

const ALDE_3030_ONLY = new Set(["alde-conn", "alde-nf", "alde-ohg", "alde-ohl", "alde-fail", "alde-panel", "alde-zone", "alde-alt", "alde-ci", "alde-bac", "alde-load", "alde-dongle"]);
const ALDE_EARLY = new Set(["alde-red", "alde-blue", "alde-ext", "alde-redc", "alde-yel", "alde-nomatch"]);

function rowsFor(model: Model) {
  return fitmentRows.filter((r) => r.family === model.family && (!r.id || r.id === model.id));
}

export function fitmentPick(model: Model, year?: number | null): { row: FitRow | null; gap: boolean; assumed: boolean; carried: boolean } {
  const rows = rowsFor(model);
  if (!rows.length) return { row: null, gap: false, assumed: false, carried: false };
  const y = year ?? 2027;
  const specific = rows.find((r) => r.id === model.id && y >= r.from && y <= r.to);
  if (specific) return { row: specific, gap: false, assumed: year == null, carried: false };
  const hit = rows.find((r) => !r.id && y >= r.from && y <= r.to);
  if (hit) return { row: hit, gap: false, assumed: year == null, carried: false };
  if (year == null) return { row: rows[rows.length - 1], gap: false, assumed: true, carried: false };
  const prev = [...rows].reverse().find((r) => r.to < y);
  if (prev) return { row: prev, gap: false, assumed: false, carried: true };
  const next = rows.find((r) => r.from > y);
  if (next) return { row: next, gap: false, assumed: false, carried: true };
  return { row: null, gap: true, assumed: false, carried: false };
}

export function matrixAllows(name: string, model: Model, year?: number | null) {
  if (model.family === "Other") return true;
  if (name === "TST TPMS") return model.family === "Classic";
  if (name === "TireMinder" || name === "Progressive Industries EMS") return false;
  const picked = fitmentPick(model, year);
  if (!picked.row) return !picked.gap;
  return picked.row.show.includes(name);
}

export function matrixNote(model: Model, year?: number | null) {
  if (model.family === "Other") return "Every code list is open until you pick a floor.";
  const picked = fitmentPick(model, year);
  if (picked.gap) return "No parts book for this year was opened, and there is no neighboring year to carry. Search still finds every code.";
  if (!picked.row) return "No fitment row for this floor.";
  if (picked.carried && year != null) {
    const span = picked.row.from === picked.row.to ? String(picked.row.from) : `${picked.row.from}–${picked.row.to}`;
    const which = year < picked.row.from ? "next" : "previous";
    return `No book for ${year} was opened. These codes are the ${which} opened year (${span}). Read the plate. ${picked.row.note}`;
  }
  const head = picked.assumed ? "No VIN year, so this is the latest row on file. " : "";
  return head + picked.row.note;
}

/** One reading of the fitment row: factory book, mixed with an owner report, or not established. */
export function fitmentStanding(model: Model, year?: number | null): { standing: "factory" | "mixed" | "unknown"; line: string } {
  const note = matrixNote(model, year);
  const picked = fitmentPick(model, year);
  if (model.family === "Other" || picked.gap || picked.assumed || picked.carried || !picked.row) {
    return { standing: "unknown", line: `Fit is not established for this coach. ${note}` };
  }
  const mixed = /owner report|not verified|not opened|was not opened|not in a parts book|not a parts book/i.test(picked.row.note);
  if (mixed) return { standing: "mixed", line: `This year mixes a parts book with an owner report or an item that was not opened. ${note}` };
  return { standing: "factory", line: note };
}

export function aldeCodeOn(id: string, year?: number | null, modelId?: string) {
  if (ALDE_3030_ONLY.has(id)) return year === 2026 && modelId === "c28";
  if (ALDE_EARLY.has(id) && (year == null || year >= 2025)) return false;
  return true;
}

/** What the fault list prints. "Alde 3030" in a fitment row is only the code key. */
export function aldeShownName(year?: number | null, modelId?: string): string {
  if (year === 2017) return "Alde 3010";
  if (year === 2018 || year === 2019 || year === 2022 || year === 2024) return "Alde 3020";
  if (year === 2026 && modelId === "c28") return "Alde 3030";
  return "Alde";
}
