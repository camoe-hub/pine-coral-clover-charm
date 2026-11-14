const MONTH =
  /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\.?\s+(?:19|20)\d{2}\b/gi;

const WEEK = /\bweek\s+\d{1,2}\s+of\s+(?:19|20)\d{2}\b/gi;

/** Model years named in one sentence. A month, or a DOT “week of” example, is not a model year. */
export function modelYearsIn(sentence: string): number[] {
  const stripped = sentence.replace(WEEK, " ").replace(MONTH, " ");
  const years = new Set<number>();
  const taken = new Array<boolean>(stripped.length).fill(false);
  const range = /\b((?:19|20)\d{2})\s*[–—-]\s*((?:19|20)?\d{2})\b/g;
  let match: RegExpExecArray | null;
  while ((match = range.exec(stripped))) {
    const start = Number(match[1]);
    let end = Number(match[2]);
    if (end < 100) end = Math.floor(start / 100) * 100 + end;
    if (start < 1960 || end > 2039 || end < start || end - start > 30) continue;
    for (let year = start; year <= end; year += 1) years.add(year);
    for (let i = match.index; i < match.index + match[0].length; i += 1) taken[i] = true;
  }
  const single = /\b((?:19|20)\d{2})\b/g;
  while ((match = single.exec(stripped))) {
    if (taken[match.index]) continue;
    const year = Number(match[1]);
    if (year >= 1960 && year <= 2039) years.add(year);
  }
  return [...years];
}

export function scopeCopy(text: string, year: number | null): { lead: string; aside: string } {
  const clean = text.replace(/\s+/g, " ").trim();
  if (year == null || !clean) return { lead: text, aside: "" };
  const lead: string[] = [];
  const aside: string[] = [];
  for (const sentence of clean.split(/(?<=[.!?])\s+/)) {
    const years = modelYearsIn(sentence);
    if (years.length > 0 && !years.includes(year)) aside.push(sentence);
    else lead.push(sentence);
  }
  return { lead: lead.join(" "), aside: aside.join(" ") };
}

/** List rows show only what can apply. A note that is entirely another year does not lead. */
export function scopeLead(text: string, year: number | null): string {
  const scoped = scopeCopy(text, year);
  if (!scoped.aside) return text;
  return scoped.lead || "Not this year.";
}

/** A table or print row keeps the other-year sentence, after the line that it is not this coach. */
export function scopedLine(text: string, year: number | null): string {
  const scoped = scopeCopy(text, year);
  if (!scoped.aside) return text;
  if (!scoped.lead) return `Not this coach. ${scoped.aside}`;
  return `${scoped.lead} Not this coach. ${scoped.aside}`;
}
