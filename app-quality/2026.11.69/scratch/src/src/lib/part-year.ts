import { modelYearsIn } from "@/lib/year-scope";

const EXAMPLE = /,?\s+including\b[^.]*/gi;
const FAMILY =
  /\b(?:globetrotter|classic|flying cloud|trade wind|bambi|basecamp|international|caravel|stetson|world traveler|frank lloyd wright)\b/gi;

function sentences(text: string): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  return clean.split(/(?<=[.!?])\s+/).filter(Boolean);
}

/** Distinctive tokens of an ordering number. Short hardware sizes are not tokens. */
export function partTokens(pn: string): string[] {
  const kept = new Set<string>();
  for (const raw of pn.split(/[\s/·,]+/)) {
    const token = raw.trim();
    if (/(?:\d{4,}|\d{2,}-\d)/.test(token)) kept.add(token);
  }
  return [...kept];
}

function hasToken(sentence: string, token: string) {
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![A-Za-z0-9-])${escaped}(?![A-Za-z0-9-])`, "i").test(sentence);
}

function isYearStamp(sentence: string) {
  if (!modelYearsIn(sentence).length) return false;
  const rest = sentence.replace(/\b(?:19|20)\d{2}\b/g, " ").replace(FAMILY, " ").replace(/[^a-z]+/gi, "");
  return rest.length === 0;
}

function isConfirm(sentence: string) {
  return /^(confirm|verify|quote|read|match|check)\b/i.test(sentence.trim());
}

function isNegation(sentence: string) {
  return /^not\b/i.test(sentence.trim());
}

/** “690732-02 is the furnace assembly” names the number. It is not a use. */
function isIdentity(sentence: string, tokens: string[]) {
  if (!tokens.some((token) => hasToken(sentence, token))) return false;
  const without = tokens.reduce(
    (text, token) => text.replace(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " "),
    sentence,
  );
  return /^(is|are)\b/i.test(without.replace(/[^a-z]+/gi, " ").trim());
}

function namesOtherNumber(sentence: string, tokens: string[]) {
  const found = sentence.match(/\b[A-Za-z]{0,6}\d{4,}(?:-[A-Za-z0-9]+)*\b/g) ?? [];
  return found.some((raw) => {
    if (/^(?:19|20)\d{2}$/.test(raw)) return false;
    const low = raw.toLowerCase();
    return !tokens.some((token) => {
      const offered = token.toLowerCase();
      return low === offered || offered.startsWith(low) || low.startsWith(offered);
    });
  });
}

/** Sentences that say where this number is used. A confirm line, a denial, or another number does not. */
function statedUses(application: string, tokens: string[]) {
  return sentences(application.replace(EXAMPLE, "")).filter((sentence) => {
    if (isConfirm(sentence) || isNegation(sentence) || isIdentity(sentence, tokens)) return false;
    if (!tokens.some((token) => hasToken(sentence, token)) && namesOtherNumber(sentence, tokens)) return false;
    return true;
  });
}

/**
 * True when the offered number is tied to years that are not this coach.
 * A floor-plan number with no year claim stays. No year set stays.
 */
export function otherYearNumber(input: {
  pn: string;
  name: string;
  application: string;
  notes: string;
  coachNote: string;
  year: number | null;
}): boolean {
  const year = input.year;
  if (year == null) return false;
  const nameYears = modelYearsIn(input.name);
  if (nameYears.length > 0 && !nameYears.includes(year)) return true;

  const tokens = partTokens(input.pn);
  const hits = sentences([input.application, input.notes, input.coachNote].join(" ")).filter((sentence) =>
    tokens.some((token) => hasToken(sentence, token)) && !isIdentity(sentence, tokens),
  );
  if (hits.length) {
    const alsoThisCoach = hits.some((sentence) => {
      const years = modelYearsIn(sentence);
      return years.length === 0 || years.includes(year);
    });
    return !alsoThisCoach;
  }

  const claimed = sentences(input.application.replace(EXAMPLE, ""));
  if (claimed.length && isYearStamp(claimed[0]) && !modelYearsIn(claimed[0]).includes(year)) {
    const later = claimed.slice(1).some((sentence) => modelYearsIn(sentence).includes(year));
    if (!later) return true;
  }
  const uses = statedUses(input.application, tokens);
  const yearUses = uses.filter((sentence) => modelYearsIn(sentence).length > 0);
  if (!yearUses.length || yearUses.length !== uses.length) return false;
  return yearUses.every((sentence) => !modelYearsIn(sentence).includes(year));
}
