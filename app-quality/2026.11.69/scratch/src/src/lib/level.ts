/** Trailer level: phone tilt turned into inches along a span. Not a certified level. */

export const MAX_FLOOR_TILT_DEG = 15;
export const CLOSE_IN = 0.125;
export const SPAN_MIN = 20;
export const SPAN_MAX = 400;
/** This app stops at 8 in of board. Not a factory limit. */
export const MAX_BOARD_IN = 8;
/** This app stops at 24 in of jack travel. Not a factory limit. */
export const MAX_JACK_IN = 24;

export type Convention = "w3c" | "inverted";

export type Accel = { x: number; y: number; z: number };

export type Tilt = {
  pitchDeg: number;
  rollDeg: number;
  flatDeg: number;
  mag: number;
  /** Corrected z. Positive is screen up. */
  z: number;
};

export type Spans = { track: number | null; jack: number | null };

export function accelConvention(input: { userAgent?: string; platform?: string; maxTouchPoints?: number }): Convention {
  const agent = input.userAgent ?? "";
  const platform = input.platform ?? "";
  const points = input.maxTouchPoints ?? 0;
  if (/iPhone|iPad|iPod/i.test(agent) || (platform === "MacIntel" && points > 1)) return "inverted";
  return "w3c";
}

/** iOS reports the opposite sign from the W3C device frame. Flip all three, or refuse. */
export function correctAccel(x: number, y: number, z: number, convention: Convention): Accel {
  if (convention === "inverted") return { x: -x, y: -y, z: -z };
  return { x, y, z };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/** Pitch is positive when the top of the phone is high. Roll is positive when the right side is down. */
export function tiltFromAccel(x: number, y: number, z: number): Tilt | null {
  if (![x, y, z].every((n) => Number.isFinite(n))) return null;
  const mag = Math.hypot(x, y, z);
  if (mag < 1) return null;
  const pitchDeg = (Math.asin(clamp(y / mag, -1, 1)) * 180) / Math.PI;
  const rollDeg = (Math.atan2(-x, z) * 180) / Math.PI;
  const flatDeg = (Math.acos(clamp(z / mag, -1, 1)) * 180) / Math.PI;
  return { pitchDeg, rollDeg, flatDeg, mag, z };
}

export function inchesFromDeg(spanIn: number, deg: number): number {
  return spanIn * Math.tan((deg * Math.PI) / 180);
}

/** Same flat angle the motion sensor uses, from the two typed axes. */
export function flatFromAxes(pitchDeg: number, rollDeg: number): number {
  const pitch = (pitchDeg * Math.PI) / 180;
  const roll = (rollDeg * Math.PI) / 180;
  const zOverMag = Math.cos(pitch) * Math.cos(roll);
  return (Math.acos(clamp(zOverMag, -1, 1)) * 180) / Math.PI;
}

export type TypedAxes = {
  side: "curbside" | "roadside" | "level";
  sideDeg: string;
  end: "tongue" | "front" | "level";
  endDeg: string;
};

/** A typed Level reading. An empty direction is not level. */
export function typedFloorTilt(input: TypedAxes): { ok: true; tilt: Tilt } | { ok: false; message: string } {
  const sideBlank = input.side !== "level" && input.sideDeg.trim() === "";
  const endBlank = input.end !== "level" && input.endDeg.trim() === "";
  if (sideBlank || endBlank) return { ok: false, message: "Enter the degrees, or set that direction to Level." };
  const sideN = input.side === "level" ? 0 : Number(input.sideDeg);
  const endN = input.end === "level" ? 0 : Number(input.endDeg);
  if (!Number.isFinite(sideN) || !Number.isFinite(endN) || sideN < 0 || endN < 0 || sideN > MAX_FLOOR_TILT_DEG || endN > MAX_FLOOR_TILT_DEG) {
    return { ok: false, message: "This tool stops at 15 degrees. Reposition, or type a smaller reading." };
  }
  const rollDeg = input.side === "roadside" ? -sideN : sideN;
  const pitchDeg = input.end === "tongue" ? -endN : endN;
  const flatDeg = flatFromAxes(pitchDeg, rollDeg);
  if (flatDeg > MAX_FLOOR_TILT_DEG) return { ok: false, message: "Together those readings are steeper than 15 degrees. This tool stops there." };
  return { ok: true, tilt: { pitchDeg, rollDeg, flatDeg, mag: 9.8, z: 9.8 } };
}

export function quarterIn(inches: number): number {
  return Math.round(inches * 4) / 4;
}

/** Nearest 1/4 in, as an owner would say it. 1.5 → "1-1/2". */
export function formatInches(inches: number): string {
  const q = quarterIn(Math.abs(inches));
  const whole = Math.floor(q + 1e-9);
  const frac = Math.round((q - whole) * 4);
  const names = ["", "1/4", "1/2", "3/4"] as const;
  const part = frac === 4 ? "" : names[frac] ?? "";
  const base = frac === 4 ? whole + 1 : whole;
  if (base === 0) return part || "0";
  if (!part) return String(base);
  return `${base}-${part}`;
}

/** Empty is unset. One decimal, 20 through 400. Anything else is not a span. */
export function parseSpan(value: string): number | null {
  const text = value.trim();
  if (!text) return null;
  if (!/^\d{1,3}(\.\d)?$/.test(text)) return null;
  const n = Number(text);
  if (n < SPAN_MIN || n > SPAN_MAX) return null;
  return n;
}

export type PhoneZero = { pitchDeg: number; rollDeg: number };

/** A case offset is a small tilt. Anything steeper is not a zero. */
export function phoneZero(value: unknown): PhoneZero | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as { pitchDeg?: unknown; rollDeg?: unknown };
  if (typeof raw.pitchDeg !== "number" || typeof raw.rollDeg !== "number") return null;
  if (!Number.isFinite(raw.pitchDeg) || !Number.isFinite(raw.rollDeg)) return null;
  if (Math.abs(raw.pitchDeg) > MAX_FLOOR_TILT_DEG || Math.abs(raw.rollDeg) > MAX_FLOOR_TILT_DEG) return null;
  return { pitchDeg: raw.pitchDeg, rollDeg: raw.rollDeg };
}

/** Take the case and camera out of a later reading. The phone's real flatness stays. */
export function applyZero(tilt: Tilt, zero: PhoneZero | null): Tilt {
  if (!zero) return tilt;
  return { ...tilt, pitchDeg: tilt.pitchDeg - zero.pitchDeg, rollDeg: tilt.rollDeg - zero.rollDeg };
}

/** The attitude to store, or null when this is not a floor reading. */
export function zeroFromTilt(tilt: Tilt): PhoneZero | null {
  if (tilt.z <= 0 || tilt.flatDeg > MAX_FLOOR_TILT_DEG) return null;
  return phoneZero({ pitchDeg: tilt.pitchDeg, rollDeg: tilt.rollDeg });
}

export type AxisState = "adjust" | "level" | "ask" | "stop";

export type AxisRead = {
  title: string;
  state: AxisState;
  /** A short figure, such as 3/4 or 0. A dash means there is no distance to show. */
  figure: string;
  action: string;
};

export type FloorRead = {
  lines: string[];
  /** True when a distance is on screen. */
  estimate: boolean;
  /** Side, then length. Absent when the phone is not a floor reading. */
  axes?: [AxisRead, AxisRead];
};

export type LevelFile = Record<string, Spans>;

function safeId(key: string) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype" && /^[a-z0-9-]{1,32}$/i.test(key);
}

function spanField(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return parseSpan(String(Math.round(value * 10) / 10));
  if (typeof value === "string") return parseSpan(value);
  return null;
}

/** Drop bad rows. A coach with neither span is left out. */
export function levelRows(value: unknown): LevelFile {
  const out: LevelFile = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return out;
  for (const [key, row] of Object.entries(value as Record<string, unknown>)) {
    if (!safeId(key) || !row || typeof row !== "object" || Array.isArray(row)) continue;
    const raw = row as { track?: unknown; jack?: unknown };
    const track = spanField(raw.track);
    const jack = spanField(raw.jack);
    if (track == null && jack == null) continue;
    out[key] = { track, jack };
  }
  return out;
}

/** Incoming coaches replace the same id. Coaches this file does not mention stay. */
export function mergeLevelFile(current: LevelFile | null, incoming: LevelFile): LevelFile {
  return { ...levelRows(current), ...levelRows(incoming) };
}

function sideAxis(rollDeg: number, track: number | null): AxisRead {
  const low = rollDeg > 0;
  const end = low ? "Curbside" : "Roadside";
  const tires = low ? "curbside" : "roadside";
  if (track == null) {
    if (Math.abs(rollDeg) < 0.2) return { title: "Side to side", state: "level", figure: "0", action: "Under 1/8 in." };
    return { title: "Side to side", state: "ask", figure: "—", action: `${end} is low. Enter the track to see how far.` };
  }
  const rise = Math.abs(inchesFromDeg(track, rollDeg));
  if (rise < CLOSE_IN) return { title: "Side to side", state: "level", figure: "0", action: "Under 1/8 in." };
  if (rise > MAX_BOARD_IN) {
    return {
      title: "Side to side",
      state: "stop",
      figure: "—",
      action: `${end} is low by more than ${MAX_BOARD_IN} in. Reposition the trailer. This app stops at ${MAX_BOARD_IN} in of board. That is not a factory limit.`,
    };
  }
  return { title: "Side to side", state: "adjust", figure: formatInches(rise), action: `${end} is low. About ${formatInches(rise)} in of board under the ${tires} tires.` };
}

function lengthAxis(pitchDeg: number, jack: number | null): AxisRead {
  const tongueLow = pitchDeg < 0;
  if (jack == null) {
    if (Math.abs(pitchDeg) < 0.2) return { title: "Front to rear", state: "level", figure: "0", action: "Under 1/8 in." };
    return {
      title: "Front to rear",
      state: "ask",
      figure: "—",
      action: tongueLow ? "Tongue is low. Enter the jack span to see how far." : "Front is high. Enter the jack span to see how far.",
    };
  }
  const rise = Math.abs(inchesFromDeg(jack, pitchDeg));
  if (rise < CLOSE_IN) return { title: "Front to rear", state: "level", figure: "0", action: "Under 1/8 in." };
  if (rise > MAX_JACK_IN) {
    return {
      title: "Front to rear",
      state: "stop",
      figure: "—",
      action: tongueLow
        ? `Tongue is low by more than ${MAX_JACK_IN} in. Reposition the trailer. This app stops at ${MAX_JACK_IN} in of jack travel. That is not a factory limit.`
        : `Front is high by more than ${MAX_JACK_IN} in. Reposition the trailer. This app stops at ${MAX_JACK_IN} in of jack travel. That is not a factory limit.`,
    };
  }
  return {
    title: "Front to rear",
    state: "adjust",
    figure: formatInches(rise),
    action: tongueLow ? `Tongue is low. Raise the jack about ${formatInches(rise)} in.` : `Front is high. Lower the jack about ${formatInches(rise)} in.`,
  };
}

/** Side to side first, then the jack. No number when the phone is not a floor reading. */
export function floorRead(tilt: Tilt, spans: Spans, steady: boolean): FloorRead {
  if (!steady || tilt.mag < 8 || tilt.mag > 11.5) return { lines: ["Hold still."], estimate: false };
  if (tilt.z <= 0) {
    return { lines: ["Turn the phone screen up. If it already is, this phone's motion reads the other way, and Trailer level will not guess."], estimate: false };
  }
  if (tilt.flatDeg > MAX_FLOOR_TILT_DEG) return { lines: ["Hold the phone flat on the floor."], estimate: false };
  const axes: [AxisRead, AxisRead] = [sideAxis(tilt.rollDeg, spans.track), lengthAxis(tilt.pitchDeg, spans.jack)];
  const lines = axes.filter((axis) => axis.state !== "level").map((axis) => axis.action);
  if (!lines.length) return { lines: ["Close enough."], estimate: false, axes };
  const estimate = lines.some((line) => line.includes("About") || line.includes("about"));
  return { lines, estimate, axes };
}
