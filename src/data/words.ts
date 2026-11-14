const STOP = new Set([
  "the", "and", "for", "with", "from", "that", "this", "your",
  "how", "do", "does", "did", "is", "are", "was", "were",
  "can", "could", "would", "what", "why", "when", "where",
  "please", "my", "me", "to", "of", "in", "at", "an", "it", "its", "you", "just", "help",
  "wont", "failure", "failed", "problem", "issue",
]);

/** Owner spellings that should find the same page. */
const SAME: Record<string, string> = {
  grey: "gray",
  tyre: "tire",
  tyres: "tire",
  tires: "tire",
  fridge: "refrigerator",
  refer: "refrigerator",
  refrigerator: "refrigerator",
  winterise: "winterize",
  winterizing: "winterize",
  winterized: "winterize",
  winterisation: "winterize",
  winterization: "winterize",
  lp: "propane",
  stabiliser: "stabilizer",
  stabilisers: "stabilizer",
  colour: "color",
  colours: "color",
  aluminium: "aluminum",
  vapour: "vapor",
  cool: "cold",
  cooling: "cold",
  conditioner: "condition",
  conditioning: "condition",
  ignite: "ignite",
  ignites: "ignite",
  ignited: "ignite",
  ignition: "ignite",
  igniter: "ignite",
  ignitor: "ignite",
  flame: "ignite",
  flames: "ignite",
};

export function wordsOf(q: string): string[] {
  const parts = q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/['’]/g, "").replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, ""))
    .map((w) => (w === "a/c" ? "ac" : w === "not" ? "no" : w.replace(/^(\d+)v$/, "$1")))
    .filter((w) => w.length > 0 && !STOP.has(w));
  const kept = parts.filter((w) => w.length >= 2);
  const digits = parts.filter((w) => w.length === 1 && /\d/.test(w));
  if (kept.length && digits.length) return [...kept, ...digits];
  return kept;
}

/** Collapse plurals and the spellings in SAME, so "brakes" and "brake" meet. */
export function canonWord(w: string): string {
  const lower = w.toLowerCase();
  let stem = lower;
  if (lower.length >= 5 && lower.endsWith("ies")) stem = `${lower.slice(0, -3)}y`;
  else if (lower.length >= 5 && lower.endsWith("s") && !lower.endsWith("ss")) stem = lower.slice(0, -1);
  return SAME[lower] ?? SAME[stem] ?? stem;
}

/**
 * A word of 4+ letters may start a word ("grea" hits "grease").
 * A shorter word has to be the whole word, so "E1" is not "E10" and "air" is not "trailer".
 * "ac" also matches "air conditioner". A 7+ letter word may be off by one letter.
 */
export function textHasWords(text: string, words: string[]): boolean {
  const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const wanted = words.map((w) => w.toLowerCase());
  if (!wanted.every((w) => tokenHas(tokens, w))) return false;
  return noFollows(tokens, wanted);
}

function tokenHas(tokens: string[], w: string) {
  w = w.toLowerCase();
  if (!w) return false;
  if (w === "ac") {
    return tokens.some((t) => t.toLowerCase() === "ac") || (tokens.some((t) => t.toLowerCase() === "air") && tokens.some((t) => t.toLowerCase().startsWith("condition")));
  }
  const want = canonWord(w);
  const lower = tokens.map((t) => t.toLowerCase());
  if (w === "no") return lower.some((t) => t === "no" || t === "not");
  if (modelToken(lower, w)) return true;
  if (w.length <= 3 && want === w) return lower.some((t) => t === w || t === `${w}s`);
  return lower.some((t) => {
    const got = canonWord(t);
    if (got === want) return true;
    if (want === w && want.length >= 4 && (t.startsWith(w) || got.startsWith(want))) return true;
    return want.length >= 7 && got.length >= 7 && !/\d/.test(want) && !/\d/.test(got) && oneEdit(want, got);
  });
}

function modelToken(tokens: string[], w: string) {
  const want = w.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (want.length < 3 || !/[a-z]/.test(want) || !/\d/.test(want)) return false;
  return tokens.some((token, i) => {
    const here = token.replace(/[^a-z0-9]/g, "");
    const next = tokens[i + 1]?.replace(/[^a-z0-9]/g, "") ?? "";
    return modelHit(here, want) || modelHit(here + next, want);
  });
}

/** "ST-65" matches ST-65RL. "E1" must not match "E10". */
function modelHit(hay: string, want: string) {
  if (hay === want) return true;
  if (!hay.startsWith(want)) return false;
  const next = hay[want.length];
  if (next && /\d/.test(want[want.length - 1] ?? "") && /\d/.test(next)) return false;
  return true;
}

function oneEdit(a: string, b: string) {
  if (a.slice(0, 3) !== b.slice(0, 3) || Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) i += 1;
    else if (b.length > a.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** "No" or "not" has to sit in front of the next word, so "no water" is not "no factory" plus "water" later. */
function noFollows(tokens: string[], words: string[]) {
  if (!words.some((w) => w.toLowerCase() === "no")) return true;
  const rest = words.filter((w) => w.toLowerCase() !== "no");
  if (!rest.length) return true;
  return tokens.some((t, i) => {
    const token = t.toLowerCase();
    if (token !== "no" && token !== "not") return false;
    return tokens.slice(i + 1, i + 3).some((next) => rest.some((w) => tokenHas([next], w)));
  });
}
