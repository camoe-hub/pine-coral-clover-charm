import type { Family } from "../data/models";

/** A starting span. Null when the model has no single number. */
export type TrackStart = {
  inches: number | null;
  note: string;
};

const WIDE: ReadonlySet<Family> = new Set(["Classic", "Globetrotter", "International", "Flying Cloud", "Trade Wind"]);
const NARROW: ReadonlySet<Family> = new Set(["Bambi", "Caravel"]);
const RANGE: ReadonlySet<Family> = new Set(["Basecamp", "World Traveler"]);

const WIDE_NOTE = "Starting figure for this wide-body: 86.5 in, hub-face to hub-face. Not the body width. Type over it if you measure yours.";
const NARROW_NOTE = "Starting figure for this body: about 81 in, hub-face to hub-face. Not the body width. Type over it if you measure yours.";
const RANGE_NOTE = "No single track is listed. These narrow bodies are often 69 to 75 in, hub-face to hub-face. Measure once and type it.";
const OTHER_NOTE = "No track is listed. Measure hub-face to hub-face. A mid-1960s trailer was about 74.5 in.";
const UNKNOWN_NOTE = "No hub-face track is listed for this model. Measure it once. A wide-body of this length is often 86.5 in.";

function nominalFeet(short: string): number | null {
  const match = /^(\d{2})/.exec(short);
  return match ? Number(match[1]) : null;
}

/** A model track, when one number is known. A saved measurement still wins. */
export function trackStart(model: { family: Family; short: string }): TrackStart {
  if (RANGE.has(model.family)) return { inches: null, note: RANGE_NOTE };
  if (NARROW.has(model.family)) return { inches: 81, note: NARROW_NOTE };
  if (WIDE.has(model.family)) {
    const feet = nominalFeet(model.short);
    if (feet != null && feet >= 25) return { inches: 86.5, note: WIDE_NOTE };
    if (feet != null && feet >= 16 && feet <= 23) return { inches: 81, note: NARROW_NOTE };
  }
  if (model.family === "Other") return { inches: null, note: OTHER_NOTE };
  return { inches: null, note: UNKNOWN_NOTE };
}

const JACK_MEASURE = "Jack foot to the axle centerline. On a tandem, to the point halfway between the axles.";

/** Jack foot to axle centerline, only where a floor plan has a listed figure. */
const JACK: Record<string, number> = {
  bc16: 111,
  b16: 112,
  bc20: 140,
  bcxe: 140,
  cv19: 134,
  b22: 162,
  cv22: 162,
  fc23: 173,
  i23: 173,
  fc25: 190,
  i25: 190,
  tw25: 190,
  fc27: 193,
  i27: 193,
  g27: 193,
  c28: 201,
  c30: 220,
  fc30: 220,
  c33: 233,
};

export function jackStart(model: { id: string }): TrackStart {
  const inches = JACK[model.id];
  if (inches == null) return { inches: null, note: JACK_MEASURE };
  return {
    inches,
    note: `Starting figure for this floor plan: ${inches} in, jack foot to axle centerline. Type over it if you measure yours.`,
  };
}
