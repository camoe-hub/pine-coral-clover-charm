import { tasks } from "@/data/schedule";
import { realDay, todayIso } from "@/lib/date";

export const WHEELS = [
  { id: "lf", label: "Road front" },
  { id: "lr", label: "Road rear" },
  { id: "rf", label: "Curb front" },
  { id: "rr", label: "Curb rear" },
  { id: "spare", label: "Spare" },
] as const;

export type WheelId = (typeof WHEELS)[number]["id"];

export type WheelRecord = {
  dot: string;
  on: string;
  /** "ok", "replace", or a tread depth in 32nds. */
  tread: string;
  side: "" | "ok" | "replace";
};

export type PressureCheck = {
  on: string;
  psi: Partial<Record<WheelId, string>>;
  note: string;
};

export type TirePhoto = { id: string; name: string; mime: string };

export type TirePhotos = {
  placard: TirePhoto | null;
  side: Partial<Record<WheelId, TirePhoto>>;
};

export type TireRecord = {
  psi: string;
  /** Heavier axle-end load, pounds. Not the whole axle group. */
  endLb: string;
  dot: string;
  on: string;
  rotated: string;
  wheels: Partial<Record<WheelId, WheelRecord>>;
  checks: PressureCheck[];
  photos: TirePhotos;
};

export const emptyWheel = (): WheelRecord => ({ dot: "", on: "", tread: "", side: "" });

export const emptyTires: TireRecord = {
  psi: "",
  endLb: "",
  dot: "",
  on: "",
  rotated: "",
  wheels: {},
  checks: [],
  photos: { placard: null, side: {} },
};

const CHECKS_MAX = 12;
const TREAD_REPLACE = 2;

export type OldestTire = {
  id: WheelId | "set";
  label: string;
  dot: string;
  iso: string;
  years: number;
};

type JobMark = { iso: string; miles: number; note?: string };

function yearsSince(then: Date, now = Date.now()) {
  return (now - then.getTime()) / (365.25 * 86400000);
}

function isoFrom(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function pastDay(value: unknown) {
  if (typeof value !== "string" || !realDay(value) || value > todayIso()) return "";
  return value;
}

function asEnd(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return "";
  const digits = String(value).replace(/[^\d]/g, "").slice(0, 5);
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n) || n <= 0 || n > 20000) return "";
  return String(n);
}

function asPsi(value: unknown) {
  if (typeof value !== "string") return "";
  const digits = value.replace(/[^\d]/g, "").slice(0, 3);
  if (!digits) return "";
  return String(Number(digits));
}

function asDot(value: unknown) {
  return typeof value === "string" ? value.replace(/[^\d]/g, "").slice(0, 4) : "";
}

function asTread(value: unknown) {
  if (value === "ok" || value === "replace") return value;
  if (typeof value !== "string") return "";
  const digits = value.replace(/[^\d]/g, "").slice(0, 2);
  if (!digits) return "";
  const n = Number(digits);
  if (n > 32) return "";
  return String(n);
}

function asSide(value: unknown): WheelRecord["side"] {
  return value === "ok" || value === "replace" ? value : "";
}

function wheelId(value: string): WheelId | null {
  return WHEELS.some((wheel) => wheel.id === value) ? (value as WheelId) : null;
}

function photoIdOk(id: string) {
  return id !== "__proto__" && id !== "constructor" && id !== "prototype" && /^[A-Za-z0-9._-]{1,80}$/.test(id);
}

function asPhoto(value: unknown): TirePhoto | null {
  if (!value || typeof value !== "object") return null;
  const row = value as { id?: unknown; name?: unknown; mime?: unknown };
  if (typeof row.id !== "string" || !photoIdOk(row.id)) return null;
  const mime = typeof row.mime === "string" ? row.mime.toLowerCase().split(";")[0].trim() : "";
  if (mime !== "image/jpeg" && mime !== "image/png" && mime !== "image/gif" && mime !== "image/webp") return null;
  const name = typeof row.name === "string" ? row.name.replace(/[\r\n]/g, "").slice(0, 80) : "photo.jpg";
  return { id: row.id, name: name || "photo.jpg", mime };
}

function asWheel(value: unknown): WheelRecord | null {
  if (!value || typeof value !== "object") return null;
  const row = value as { dot?: unknown; on?: unknown; tread?: unknown; side?: unknown };
  const wheel: WheelRecord = { dot: asDot(row.dot), on: pastDay(row.on), tread: asTread(row.tread), side: asSide(row.side) };
  if (!wheel.dot && !wheel.on && !wheel.tread && !wheel.side) return null;
  return wheel;
}

function asWheels(value: unknown): TireRecord["wheels"] {
  const wheels: TireRecord["wheels"] = {};
  if (!value || typeof value !== "object") return wheels;
  for (const [key, row] of Object.entries(value)) {
    const id = wheelId(key);
    if (!id) continue;
    const wheel = asWheel(row);
    if (wheel) wheels[id] = wheel;
  }
  return wheels;
}

function asCheck(value: unknown): PressureCheck | null {
  if (!value || typeof value !== "object") return null;
  const row = value as { on?: unknown; psi?: unknown; note?: unknown };
  const on = pastDay(row.on);
  if (!on) return null;
  const psi: PressureCheck["psi"] = {};
  if (row.psi && typeof row.psi === "object") {
    for (const [key, reading] of Object.entries(row.psi)) {
      const id = wheelId(key);
      const clean = asPsi(reading);
      if (id && clean) psi[id] = clean;
    }
  }
  const note = typeof row.note === "string" ? row.note.replace(/[\r\n]/g, " ").trim().slice(0, 80) : "";
  if (!note && Object.keys(psi).length === 0) return null;
  return { on, psi, note };
}

function asChecks(value: unknown): PressureCheck[] {
  if (!Array.isArray(value)) return [];
  const checks: PressureCheck[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (checks.length >= CHECKS_MAX) break;
    const check = asCheck(item);
    if (!check || seen.has(check.on)) continue;
    seen.add(check.on);
    checks.push(check);
  }
  return checks;
}

function asPhotos(value: unknown): TirePhotos {
  const photos: TirePhotos = { placard: null, side: {} };
  if (!value || typeof value !== "object") return photos;
  const row = value as { placard?: unknown; side?: unknown };
  photos.placard = asPhoto(row.placard);
  if (row.side && typeof row.side === "object") {
    for (const [key, photo] of Object.entries(row.side)) {
      const id = wheelId(key);
      const clean = asPhoto(photo);
      if (id && clean) photos.side[id] = clean;
    }
  }
  return photos;
}

export function asTires(value: unknown): TireRecord {
  if (!value || typeof value !== "object") return emptyTires;
  const row = value as {
    psi?: unknown;
    endLb?: unknown;
    dot?: unknown;
    on?: unknown;
    rotated?: unknown;
    wheels?: unknown;
    checks?: unknown;
    photos?: unknown;
  };
  return {
    psi: asPsi(row.psi),
    endLb: asEnd(row.endLb),
    dot: asDot(row.dot),
    on: pastDay(row.on),
    rotated: pastDay(row.rotated),
    wheels: asWheels(row.wheels),
    checks: asChecks(row.checks),
    photos: asPhotos(row.photos),
  };
}

/** Last four digits of a DOT code are week and year, as in 2323. */
export function dotDate(dot: string): Date | null {
  if (dot.length !== 4) return null;
  const week = Number(dot.slice(0, 2));
  const year = 2000 + Number(dot.slice(2));
  if (week < 1 || week > 53) return null;
  const nowY = new Date().getFullYear();
  if (year < 2000 || year > nowY + 1) return null;
  return new Date(year, 0, 1 + (week - 1) * 7);
}

export function dotIso(dot: string): string | null {
  const made = dotDate(dot);
  return made ? isoFrom(made) : null;
}

export function tireAges(tires: TireRecord, now = Date.now()) {
  const made = dotDate(tires.dot);
  let onYears: number | null = null;
  if (tires.on) {
    const mounted = new Date(`${tires.on}T12:00:00`);
    if (!Number.isNaN(mounted.getTime())) onYears = yearsSince(mounted, now);
  }
  return {
    dotYears: made ? yearsSince(made, now) : null,
    onYears,
  };
}

export function wheelLabel(id: WheelId | "set") {
  if (id === "set") return "The set";
  return WHEELS.find((wheel) => wheel.id === id)?.label ?? id;
}

/** The oldest DOT on the coach. A single saved code is used until a wheel has its own. */
export function oldestTire(tires: TireRecord, now = Date.now()): OldestTire | null {
  let best: OldestTire | null = null;
  const consider = (id: WheelId | "set", label: string, dot: string) => {
    const made = dotDate(dot);
    const iso = made ? isoFrom(made) : null;
    if (!made || !iso) return;
    const years = yearsSince(made, now);
    if (years < 0) return;
    if (!best || years > best.years) best = { id, label, dot, iso, years };
  };
  for (const wheel of WHEELS) {
    const dot = tires.wheels[wheel.id]?.dot;
    if (dot) consider(wheel.id, wheel.label, dot);
  }
  if (best) return best;
  if (tires.dot) consider("set", "The set", tires.dot);
  return best;
}

export function treadNeedsReplace(tread: string) {
  if (tread === "replace") return true;
  if (/^\d{1,2}$/.test(tread)) return Number(tread) <= TREAD_REPLACE;
  return false;
}

export function sideNeedsReplace(side: string) {
  return side === "replace";
}

export function wheelsToReplace(tires: TireRecord) {
  return WHEELS.filter((wheel) => {
    const row = tires.wheels[wheel.id];
    return !!row && (treadNeedsReplace(row.tread) || sideNeedsReplace(row.side));
  }).map((wheel) => wheel.label);
}

/** Home only speaks up at the existing thresholds: 5 years on a named wheel, 6 on the old single code. */
export function homeTireLine(tires: TireRecord, now = Date.now()) {
  const parts: string[] = [];
  const marks = wheelsToReplace(tires);
  if (marks.length === 1) parts.push(`${marks[0]} is at the replace line`);
  else if (marks.length > 1) parts.push(`${marks.join(", ")} are at the replace line`);
  const oldest = oldestTire(tires, now);
  if (oldest && oldest.id !== "set" && oldest.years >= 5) {
    parts.push(`Oldest tire: ${oldest.label}, about ${Math.floor(oldest.years)} years (DOT ${oldest.dot})`);
  } else if (!oldest || oldest.id === "set") {
    const ages = tireAges(tires, now);
    if (ages.dotYears != null && ages.dotYears >= 6) parts.push(`Tires about ${Math.floor(ages.dotYears)} years from the DOT date`);
    else if (ages.onYears != null && ages.onYears >= 6) parts.push(`Tires mounted about ${Math.floor(ages.onYears)} years ago`);
  }
  return parts.length ? parts.join(". ") : null;
}

/** Readings more than 20% under the placard number. The procedure already says that tire comes off. */
export function lowWheels(placard: string, check: PressureCheck): WheelId[] {
  const target = Number(placard);
  if (!Number.isInteger(target) || target <= 0) return [];
  const limit = target * 0.8;
  return WHEELS.filter((wheel) => {
    const reading = check.psi[wheel.id];
    if (!reading) return false;
    const got = Number(reading);
    return got > 0 && got < limit;
  }).map((wheel) => wheel.id);
}

export function withCheck(tires: TireRecord, check: PressureCheck): PressureCheck[] | null {
  const [row] = asChecks([check]);
  if (!row) return null;
  return asChecks([row, ...tires.checks.filter((item) => item.on !== row.on)]);
}

export function withoutCheck(tires: TireRecord, on: string) {
  return tires.checks.filter((item) => item.on !== on);
}

export function tirePhotoIds(tires: unknown): string[] {
  const row = asTires(tires);
  const ids: string[] = [];
  if (row.photos.placard) ids.push(row.photos.placard.id);
  for (const photo of Object.values(row.photos.side)) if (photo) ids.push(photo.id);
  return ids;
}

function rotateEvery() {
  const task = tasks.find((item) => item.id === "rotate");
  return task?.cadence.type === "miles" ? task.cadence.every : 10000;
}

/**
 * The replace job follows the oldest DOT. A rotation date moves the 6-month side
 * without hiding a 10,000-mile job that was never marked.
 */
export function jobMark(taskId: string, mark: JobMark | undefined, tires: TireRecord, odo = 0): JobMark | undefined {
  if (taskId === "tires-replace") {
    const oldest = oldestTire(tires);
    if (!oldest) return mark;
    return { iso: oldest.iso, miles: 0, ...(mark?.note ? { note: mark.note } : {}) };
  }
  if (taskId === "rotate" && tires.rotated) {
    if (!mark) return odo >= rotateEvery() ? mark : { iso: tires.rotated, miles: 0 };
    if (tires.rotated > mark.iso) return { ...mark, iso: tires.rotated };
  }
  return mark;
}
