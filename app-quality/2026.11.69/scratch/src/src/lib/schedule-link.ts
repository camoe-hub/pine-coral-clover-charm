import { tasks, type Task } from "@/data/schedule";

export type ScheduleMark = { iso: string; miles: number; note?: string };

/** The one schedule job whose title or id is this text. Two matches means no link. */
export function taskFromJob(job: string): Task | null {
  const text = job.trim().toLowerCase();
  if (!text) return null;
  const byId = tasks.find((task) => task.id.toLowerCase() === text);
  if (byId) return byId;
  const hits = tasks.filter((task) => task.title.trim().toLowerCase() === text);
  return hits.length === 1 ? hits[0] : null;
}

/** The mark a service record should write. Null when the date is ahead, or the schedule is already later. */
export function markFromService(current: ScheduleMark | undefined, iso: string, miles: number, today: string): ScheduleMark | null {
  if (iso > today) return null;
  if (!current) return { iso, miles };
  if (iso > current.iso || (iso === current.iso && miles > current.miles)) {
    return { iso, miles, ...(current.note ? { note: current.note } : {}) };
  }
  return null;
}

export function latestService<T extends { iso: string; miles: number }>(entries: T[]): T | null {
  let best: T | null = null;
  for (const entry of entries) {
    if (!best || entry.iso > best.iso || (entry.iso === best.iso && entry.miles > best.miles)) best = entry;
  }
  return best;
}

/**
 * After editing the service that owned the schedule mark, follow the latest linked service.
 * Undefined when this edit did not own the mark, so a hand-set date stays.
 * Null when no linked service remains.
 */
export function markAfterOwnedEdit(
  mark: ScheduleMark | undefined,
  owned: { iso: string; miles: number },
  linked: { iso: string; miles: number }[],
): ScheduleMark | null | undefined {
  if (!mark || mark.iso !== owned.iso || mark.miles !== owned.miles) return undefined;
  const latest = latestService(linked);
  if (!latest) return null;
  return { iso: latest.iso, miles: latest.miles, ...(mark.note ? { note: mark.note } : {}) };
}
