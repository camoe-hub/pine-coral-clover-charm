export const WEIGHTS_KEY = "rivetcare-weights";
export const MAX_WEIGHTS = 100_000;
/** Combined weights and axle changes may differ by one scale step. Past that, the ticket disagrees with itself. */
export const MATCH_LB = 20;

/** The scale tickets saved on this phone, keyed by coach. Null when there are none. */
export function readWeightsFile(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY);
    if (!raw || raw.length > MAX_WEIGHTS) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Text from this coach's scale ticket, for search. Empty when nothing is saved. */
export function weightSearchBlob(modelId: string): string {
  const file = readWeightsFile();
  const row = file?.[modelId];
  if (!row || typeof row !== "object" || Array.isArray(row)) return "";
  const bits = Object.values(row).filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  if (!bits.length) return "";
  return `weight ticket scale ${bits.join(" ")}`;
}

export function writeWeightsFile(value: Record<string, unknown>): boolean {
  if (!weightsFit(value)) return false;
  if (typeof window === "undefined") return true;
  try {
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** False when the saved tickets would be dropped by backup and search. */
export function weightsFit(value: Record<string, unknown>): boolean {
  try {
    return JSON.stringify(value).length <= MAX_WEIGHTS;
  } catch {
    return false;
  }
}

/** An id for a weigh-in. Works where randomUUID is missing. */
export function newId(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") return cryptoObj.randomUUID();
  const bytes = new Uint8Array(16);
  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") cryptoObj.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function restoreWeightsFile(value: Record<string, unknown> | null) {
  if (typeof window === "undefined") return;
  if (!value) localStorage.removeItem(WEIGHTS_KEY);
  else writeWeightsFile(value);
}

function safeTicketKey(key: string) {
  return key !== TOW_KEY && key !== "__proto__" && key !== "constructor" && key !== "prototype" && /^[a-z0-9-]{1,32}$/i.test(key);
}

function ticketRows(value: Record<string, unknown> | null): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!value) return out;
  for (const [key, row] of Object.entries(value)) {
    if (!safeTicketKey(key) || !row || typeof row !== "object" || Array.isArray(row)) continue;
    out[key] = row;
  }
  return out;
}

/** One tow vehicle, shared by every coach saved on this phone. Not a second weights page. */
export const TOW_KEY = "tow";

export type TowSticker = {
  truckName: string;
  steerRating: string;
  driveRating: string;
  gvwRating: string;
  payloadRating: string;
  gcwr: string;
  tongueRating: string;
};

const TOW_FIELDS = ["truckName", "steerRating", "driveRating", "gvwRating", "payloadRating", "gcwr", "tongueRating"] as const;

export function emptyTow(): TowSticker {
  return { truckName: "", steerRating: "", driveRating: "", gvwRating: "", payloadRating: "", gcwr: "", tongueRating: "" };
}

function towText(key: (typeof TOW_FIELDS)[number], value: unknown) {
  if (typeof value !== "string") return "";
  if (key === "truckName") return value.replace(/[\r\n]/g, " ").trim().slice(0, 40);
  return value.replace(/[^\d]/g, "").slice(0, 7);
}

export function asTow(value: unknown): TowSticker {
  const tow = emptyTow();
  if (!value || typeof value !== "object" || Array.isArray(value)) return tow;
  const row = value as Record<string, unknown>;
  for (const key of TOW_FIELDS) tow[key] = towText(key, row[key]);
  return tow;
}

export function towFilled(tow: TowSticker) {
  return TOW_FIELDS.some((key) => tow[key] !== "");
}

/** Null when this file has never stored a shared truck. An empty sticker is a truck the owner cleared. */
export function readTow(file: Record<string, unknown> | null): TowSticker | null {
  if (!file || !Object.prototype.hasOwnProperty.call(file, TOW_KEY)) return null;
  return asTow(file[TOW_KEY]);
}

function towFromRow(row: unknown): TowSticker | null {
  const tow = asTow(row);
  return towFilled(tow) ? tow : null;
}

/** The shared sticker, or the truck already typed on a coach, until the first shared save. */
export function seedTow(file: Record<string, unknown> | null, preferId: string): TowSticker | null {
  const saved = readTow(file);
  if (saved) return saved;
  const rows = ticketRows(file);
  const preferred = towFromRow(rows[preferId]);
  if (preferred) return preferred;
  for (const row of Object.values(rows)) {
    const tow = towFromRow(row);
    if (tow) return tow;
  }
  return null;
}

/** Keep tickets already on the phone for trailers this backup does not include. The truck sticker survives either way. */
export function mergeWeightsFile(current: Record<string, unknown> | null, incoming: Record<string, unknown>): Record<string, unknown> {
  const tickets = { ...ticketRows(current), ...ticketRows(incoming) };
  const tow = readTow(incoming) ?? readTow(current);
  return tow ? { ...tickets, [TOW_KEY]: tow } : tickets;
}

export function backupWeights(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const clean = ticketRows(source);
  const tow = readTow(source);
  const out: Record<string, unknown> = tow && towFilled(tow) ? { ...clean, [TOW_KEY]: tow } : clean;
  if (!Object.keys(out).length) return null;
  try {
    const text = JSON.stringify(out);
    if (text.length > MAX_WEIGHTS) return null;
    return out;
  } catch {
    return null;
  }
}

const SCALE_FIELDS = ["truckFront", "truckRear", "bareFront", "bareRear", "bareTrailer", "wdFront", "wdRear", "wdTrailer"];

/** Coaches with a scale weight filled in. An empty saved form does not count. */
export function savedTicketCount(file?: Record<string, unknown> | null): number {
  const rows = ticketRows(file === undefined ? readWeightsFile() : file);
  let n = 0;
  for (const row of Object.values(rows)) {
    const form = row as Record<string, unknown>;
    if (SCALE_FIELDS.some((key) => typeof form[key] === "string" && form[key].trim() !== "")) n += 1;
  }
  return n;
}

export type Pass = { steer: number | null; drive: number | null; trailer: number | null };

export type Ratings = {
  steer: number | null;
  drive: number | null;
  gvw: number | null;
  payload: number | null;
  gcwr: number | null;
  trailer: number | null;
  tongue: number | null;
  factory: number | null;
};

export type Line = {
  actual: number | null;
  rated: number | null;
  left: number | null;
  pct: number | null;
};

function add(a: number | null, b: number | null): number | null {
  if (a == null || b == null) return null;
  return a + b;
}

function sub(a: number | null, b: number | null): number | null {
  if (a == null || b == null) return null;
  return a - b;
}

function line(actual: number | null, rated: number | null): Line {
  return {
    actual,
    rated,
    left: actual != null && rated != null ? rated - actual : null,
    pct: actual != null && rated != null && rated !== 0 ? actual / rated : null,
  };
}

/** Sheet 1: the scale total as each axle group rolls on. */
export function fromCumulative(front: number | null, frontRear: number | null, all: number | null): Pass {
  return {
    steer: front,
    drive: front != null && frontRear != null ? frontRear - front : null,
    trailer: all != null && frontRear != null ? all - frontRear : null,
  };
}

export function weigh(truck: Pass, noWd: Pass, wd: Pass, ratings: Ratings) {
  const truckGvw = add(truck.steer, truck.drive);
  const factoryTruck = sub(ratings.gvw, ratings.payload);
  const payloadNow = sub(truckGvw, factoryTruck);

  const noGvw = add(noWd.steer, noWd.drive);
  const noGcw = add(noGvw, noWd.trailer);
  const wdGvw = add(wd.steer, wd.drive);
  const wdGcw = add(wdGvw, wd.trailer);
  const combined = wdGcw ?? noGcw;

  const trailerWt = sub(combined, truckGvw);
  const tongue = sub(noGvw, truckGvw);
  const tongueOnTruck = sub(wdGvw, truckGvw);
  const xfer = sub(wd.trailer, noWd.trailer);
  const payloadOff = sub(noGvw, factoryTruck);
  const payloadOn = sub(wdGvw, factoryTruck);
  const cargoCap = sub(ratings.trailer, ratings.factory);
  const cargo = sub(trailerWt, ratings.factory);

  return {
    truck: {
      steer: line(truck.steer, ratings.steer),
      drive: line(truck.drive, ratings.drive),
      gvw: line(truckGvw, ratings.gvw),
      payload: line(payloadNow, ratings.payload),
      factory: factoryTruck,
    },
    noWd: {
      steer: line(noWd.steer, ratings.steer),
      drive: line(noWd.drive, ratings.drive),
      gvw: line(noGvw, ratings.gvw),
      trailer: line(noWd.trailer, null),
      payload: line(payloadOff, ratings.payload),
      gcw: line(noGcw, ratings.gcwr),
    },
    wd: {
      steer: line(wd.steer, ratings.steer),
      drive: line(wd.drive, ratings.drive),
      gvw: line(wdGvw, ratings.gvw),
      trailer: line(wd.trailer, null),
      payload: line(payloadOn, ratings.payload),
      gcw: line(wdGcw, ratings.gcwr),
    },
    trailer: {
      weight: line(trailerWt, ratings.trailer),
      tongue: line(tongue, ratings.tongue),
      cargo: line(cargo, cargoCap),
      tonguePct: tongue != null && trailerWt ? tongue / trailerWt : null,
      xfer,
      xferPct: xfer != null && tongue ? xfer / tongue : null,
      tongueOnTruck,
    },
  };
}

/** The usual tongue share for a travel trailer. Null when the share is in that band, or unknown. Not a pass or a fail. */
export function tongueShareNote(share: number | null): string | null {
  if (share == null || !Number.isFinite(share)) return null;
  const shown = Math.round(share * 10000) / 100;
  if (shown >= 10 && shown <= 15) return null;
  return `Tongue weight is ${shown.toFixed(2)}% of the loaded trailer. The usual band is 10–15%.`;
}

/** How the bars moved load. Restoration is only defined when coupling, bars off, made the front axle lighter. */
export function weightDistribution(truck: Pass, noWd: Pass, wd: Pass) {
  const lostFront = sub(truck.steer, noWd.steer);
  const restoredFront = sub(wd.steer, noWd.steer);
  const rearChange = sub(wd.drive, noWd.drive);
  const trailerChange = sub(wd.trailer, noWd.trailer);
  const balance = restoredFront != null && rearChange != null && trailerChange != null ? restoredFront + rearChange + trailerChange : null;
  const restoration = lostFront != null && lostFront > 0 && restoredFront != null ? restoredFront / lostFront : null;
  return { lostFront, restoredFront, rearChange, trailerChange, balance, restoration };
}

/** Reasons a scale ticket should not be written into the service log, plus a rating gap that is only a warning. */
export function scaleProblems(result: ReturnType<typeof weigh>): { block: string | null; warn: string | null } {
  if (result.trailer.tongue.actual != null && result.trailer.tongue.actual < 0) {
    return { block: "Tongue weight is negative. The ticket is incomplete.", warn: null };
  }
  const axles = [
    result.truck.steer.actual,
    result.truck.drive.actual,
    result.noWd.steer.actual,
    result.noWd.drive.actual,
    result.noWd.trailer.actual,
    result.wd.steer.actual,
    result.wd.drive.actual,
    result.wd.trailer.actual,
  ];
  if (axles.some((n) => n != null && n <= 0)) {
    return { block: "An axle weight is zero. The ticket is incomplete.", warn: null };
  }
  const bare = result.noWd.gcw.actual;
  const hitched = result.wd.gcw.actual;
  if (bare != null && hitched != null && Math.abs(bare - hitched) > MATCH_LB) {
    return { block: "The two combined weights do not match. Re-enter the scale ticket.", warn: null };
  }
  const ratedMissing = [result.truck.gvw, result.truck.payload, result.noWd.gvw, result.noWd.payload, result.noWd.gcw, result.wd.gvw, result.wd.payload, result.wd.gcw, result.trailer.weight, result.trailer.tongue].some(
    (row) => row.actual != null && row.actual > 0 && row.rated == null,
  );
  return { block: null, warn: ratedMissing ? "A measured weight has no rating, so an overload would not show. A missing rating is not a safe-tow result." : null };
}

/** The service log is a finished three-pass ticket. A partial ticket stays in Save this weigh-in. */
export function logReady(result: ReturnType<typeof weigh>): string | null {
  const axles = [
    result.truck.steer.actual,
    result.truck.drive.actual,
    result.noWd.steer.actual,
    result.noWd.drive.actual,
    result.noWd.trailer.actual,
    result.wd.steer.actual,
    result.wd.drive.actual,
    result.wd.trailer.actual,
  ];
  if (axles.some((n) => n == null)) return "The service log wants all three passes. Save this weigh-in keeps a partial ticket.";
  return null;
}

/** What one CAT configuration can and cannot say. Tongue weight is only the bars-off truck minus the truck alone. */
export function explainTicket(input: {
  coupled: Pass | null;
  truckOnly: number | null;
  trailerOnly: number | null;
  combinedTyped: number | null;
  barsOnCombined: number | null;
  ratings: { gvw: number | null; gcwr: number | null; trailer: number | null; tongue: number | null };
  passName: "bars off" | "bars on" | "none";
}) {
  const front = input.coupled?.steer ?? null;
  const rear = input.coupled?.drive ?? null;
  const trailerAxles = input.coupled?.trailer ?? null;
  const gvw = add(front, rear);
  const combined = add(gvw, trailerAxles);
  const tongue = input.passName === "bars off" && gvw != null && input.truckOnly != null ? gvw - input.truckOnly : null;
  const loadedFromTongue = add(trailerAxles, tongue);
  const loadedFromTotal = combined != null && input.truckOnly != null ? combined - input.truckOnly : null;
  const loaded = loadedFromTongue ?? loadedFromTotal;
  const share = tongue != null && loaded != null && loaded !== 0 ? tongue / loaded : null;
  const flags: string[] = [];
  const notes: string[] = [];

  notes.push("GVW is the weight on the scale. GVWR is the rated maximum. A measured GVW is never a GVWR.");
  if (input.passName === "none") {
    flags.push("No coupled axle weights yet.");
  } else {
    notes.push(
      input.passName === "bars off"
        ? "Tongue weight is the bars-off truck GVW minus the truck weighed alone. The bars were not holding."
        : "These numbers are with the bars on. Bars move load between the axles. They are not a tongue-weight measurement.",
    );
  }
  if (front == null || rear == null) flags.push("Front and rear axle weights are both needed before the truck GVW is known.");
  if (trailerAxles == null && input.passName !== "none") flags.push("The trailer axle group is missing, so the combined weight is incomplete.");
  if (input.passName === "bars off" && input.truckOnly == null && gvw != null) {
    flags.push("Truck-only weight is missing. Tongue weight, tongue share, and loaded trailer weight are not on this ticket.");
  }
  if (input.passName === "bars on") {
    flags.push("A bars-on ticket does not provide tongue weight. Weigh the truck alone, then again with the trailer coupled and the bars off.");
  }
  if (input.combinedTyped != null && combined != null && Math.abs(input.combinedTyped - combined) > MATCH_LB) {
    if (loaded != null && gvw != null && Math.abs(input.combinedTyped - (gvw + loaded)) <= MATCH_LB) {
      flags.push("That combined weight adds the loaded trailer to the coupled truck GVW. The tongue is already in the truck axles, so it is counted twice. Combined weight is the three axle groups added together.");
    } else {
      flags.push("The combined weight typed from the ticket does not match the axle groups.");
    }
  }
  if (input.trailerOnly != null && loaded != null && Math.abs(input.trailerOnly - loaded) > MATCH_LB) {
    flags.push("The trailer-only weight does not match the trailer axles plus tongue. Those are different scale setups.");
  }
  if (combined != null && input.barsOnCombined != null && input.passName === "bars off" && Math.abs(combined - input.barsOnCombined) > MATCH_LB) {
    flags.push("The bars-off and bars-on combined weights do not match. Re-enter the ticket. Bars should move load between axles, not change the total.");
  }
  if (tongue != null && tongue < 0) flags.push("Tongue weight is negative. The truck-only weigh is heavier than the coupled truck, so one of the tickets is incomplete.");
  if (gvw != null && input.ratings.gvw != null && gvw > input.ratings.gvw) flags.push("Measured truck GVW is over the truck GVWR.");
  if (combined != null && input.ratings.gcwr != null && combined > input.ratings.gcwr) flags.push("Measured combined weight is over the GCWR.");
  if (loaded != null && input.ratings.trailer != null && loaded > input.ratings.trailer) flags.push("Measured loaded trailer weight is over the trailer GVWR.");
  if (tongue != null && input.ratings.tongue != null && tongue > input.ratings.tongue) flags.push("Measured tongue weight is over the tongue rating.");
  if (combined != null && input.ratings.gcwr == null) notes.push("No GCWR was entered. This combined weight is not room left under a limit, and it is not a safe-tow result.");
  notes.push("One ticket is not every towing measurement. A weight-distribution hitch changes axle weights. It does not replace a truck-only weigh.");
  return { front, rear, trailerAxles, gvw, combined, tongue, loaded, share, truckOnly: input.truckOnly, flags, notes };
}

/** A running total that goes backwards invents a negative axle group. */
export function cumulativeOrder(front: number | null, mid: number | null, all: number | null): string | null {
  if (front != null && mid != null && mid < front) return "The second total is lower than the front axle, so the drive axle would be negative.";
  if (mid != null && all != null && all < mid) return "The final total is lower than the truck total, so the trailer axle group would be negative.";
  return null;
}

/** A plain pound entry, or a pasted number that ends in kg. Anything else is kept and not used. */
export function weightEntry(raw: string): string {
  const text = raw.trim();
  if (!text) return "";
  const kg = /^([\d.,]+)\s*kg$/i.exec(text);
  if (kg) {
    const n = completePounds(kg[1]);
    return n == null ? text : String(Math.round(n * 2.2046226218));
  }
  const n = completePounds(text);
  if (n == null || text.endsWith(".")) return text;
  return String(n);
}

export function weightProblem(value: string): string | null {
  const text = value.trim();
  if (!text || completePounds(text) != null || /^\d+\.$/.test(text) || /^\d{1,3},$/.test(text) || /^\d{1,3},\d{1,2}$/.test(text)) return null;
  return "That entry is not a weight in pounds, so it was not used.";
}

/** The first number on a sticker. A range is not a number, so it is left blank. */
export function stickerPounds(text: string): string {
  if (/\d\s*[–—-]\s*\d/.test(text)) return "";
  const match = text.replace(/,/g, "").match(/[\d.]+/);
  if (!match) return "";
  const n = Number(match[0]);
  return Number.isFinite(n) ? String(Math.round(n)) : "";
}

function completePounds(text: string): number | null {
  const thousands = /^(\d{1,3}(?:,\d{3})+)(\.\d+)?$/.exec(text);
  const plain = /^(\d+)(\.\d+)?$/.exec(text);
  const body = thousands ? `${thousands[1].replace(/,/g, "")}${thousands[2] ?? ""}` : plain ? text : null;
  if (body == null) return null;
  const n = Number(body);
  return Number.isFinite(n) ? n : null;
}

export type WeighIn = {
  id: string;
  iso: string;
  name: string;
  mode: "axle" | "total";
  truckFront: string;
  truckRear: string;
  bareFront: string;
  bareRear: string;
  bareTrailer: string;
  wdFront: string;
  wdRear: string;
  wdTrailer: string;
  trailerOnly: string;
  combinedTyped: string;
};

export function asWeighIns(value: unknown): WeighIn[] {
  if (!Array.isArray(value)) return [];
  const rows: WeighIn[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const row = item as Partial<WeighIn>;
    if (typeof row.id !== "string" || typeof row.iso !== "string") continue;
    const text = (key: keyof WeighIn) => (typeof row[key] === "string" ? String(row[key]).slice(0, 40) : "");
    rows.push({
      id: row.id.slice(0, 40),
      iso: row.iso.slice(0, 10),
      name: typeof row.name === "string" ? row.name.slice(0, 80) : "",
      mode: row.mode === "total" ? "total" : "axle",
      truckFront: text("truckFront"),
      truckRear: text("truckRear"),
      bareFront: text("bareFront"),
      bareRear: text("bareRear"),
      bareTrailer: text("bareTrailer"),
      wdFront: text("wdFront"),
      wdRear: text("wdRear"),
      wdTrailer: text("wdTrailer"),
      trailerOnly: text("trailerOnly"),
      combinedTyped: text("combinedTyped"),
    });
    if (rows.length === 12) break;
  }
  return rows;
}
