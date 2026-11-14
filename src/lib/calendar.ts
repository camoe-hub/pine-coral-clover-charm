import type { Cadence } from "@/data/schedule";
import { calendarDate } from "@/lib/store";

export type DatedJob = {
  id: string;
  title: string;
  date: string;
  miles: boolean;
};

/** The next calendar date for each job that has one. Mile-only jobs and lug checks are left out. No repeats. */
export function datedJobs(
  rows: { id: string; title: string; cadence: Cadence }[],
  done: Record<string, { iso: string; miles: number } | undefined>,
): DatedJob[] {
  const jobs: DatedJob[] = [];
  for (const row of rows) {
    if (row.cadence.type === "trip") continue;
    if (row.cadence.type === "miles" && !row.cadence.alsoDays) continue;
    const date = calendarDate(row.cadence, done[row.id]);
    if (!date || date < "1970-01-01") continue;
    jobs.push({ id: row.id, title: row.title, date, miles: row.cadence.type === "miles" });
  }
  jobs.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  return jobs;
}

function icsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function nextDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}${m}${d}`;
}

function foldLine(line: string) {
  const width = (text: string) => new TextEncoder().encode(text).length;
  if (width(line) <= 75) return line;
  const chars = [...line];
  const parts: string[] = [];
  let index = 0;
  let first = true;
  while (index < chars.length) {
    let size = first ? 0 : 1;
    let next = index;
    while (next < chars.length && size + width(chars[next]) <= 75) {
      size += width(chars[next]);
      next += 1;
    }
    if (next === index) next = index + 1;
    const piece = chars.slice(index, next).join("");
    parts.push(first ? piece : ` ${piece}`);
    first = false;
    index = next;
  }
  return parts.join("\r\n");
}

/** One all-day event per date. The file is rebuilt from the current marks, so it has no repeating rule. */
export function icsFor(jobs: DatedJob[], stamp: string): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RivetCare//EN", "CALSCALE:GREGORIAN"];
  for (const job of jobs) {
    const day = job.date.replace(/-/g, "");
    const extra = job.miles ? " The mile interval is not on this calendar." : "";
    const description = `RivetCare. This date does not repeat. Mark the job done, then save a new file. Delete older RivetCare events on the phone.${extra}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:rivetcare-${job.id}-${day}@rivetcare`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day}`,
      `DTEND;VALUE=DATE:${nextDay(job.date)}`,
      `SUMMARY:${icsText(job.title)}`,
      `DESCRIPTION:${icsText(description)}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}
