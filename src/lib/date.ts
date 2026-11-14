const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Calendar date for the screen. Same year drops the year: Oct 27. */
export function formatWhen(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const year = Number(match[1]);
  const month = MONTHS[Number(match[2]) - 1];
  const day = Number(match[3]);
  if (!month || !day) return iso;
  return year === new Date().getFullYear() ? `${month} ${day}` : `${month} ${day}, ${year}`;
}

/** The calendar date on this phone. UTC would roll over at 6 PM in Denver. */
export function todayIso(now = new Date()) {
  return stamp(now);
}

function stamp(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** True for a real YYYY-MM-DD. 2026-02-31 is not one. */
export function realDay(iso: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) && atNoon(iso) !== null;
}

/** A real day, or the last real day of that month. Null when the text is not a date. */
export function repairDay(iso: string): string | null {
  if (realDay(iso)) return iso;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (year < 1960 || year > 2100 || month < 1 || month > 12) return null;
  const last = new Date(year, month, 0).getDate();
  const day = Math.min(Number(match[3]), last);
  if (day < 1) return null;
  const next = `${match[1]}-${match[2]}-${String(day).padStart(2, "0")}`;
  return realDay(next) ? next : null;
}
function atNoon(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

/** Calendar days from `fromIso` to `toIso`. Negative when `toIso` is earlier. */
export function daysBetween(fromIso: string, toIso: string): number | null {
  const from = atNoon(fromIso);
  const to = atNoon(toIso);
  if (!from || !to) return null;
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

export function shiftIso(iso: string, days: number): string | null {
  const date = atNoon(iso);
  if (!date || !Number.isFinite(days)) return null;
  date.setDate(date.getDate() + days);
  return stamp(date);
}

/** Same month and day, N years later. Feb 29 lands on Mar 1 in a non-leap year. */
export function shiftYears(iso: string, years: number): string | null {
  const date = atNoon(iso);
  if (!date || !Number.isInteger(years)) return null;
  date.setFullYear(date.getFullYear() + years);
  return stamp(date);
}
