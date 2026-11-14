import { levelRows, phoneZero, type LevelFile, type PhoneZero, type Spans } from "./level.ts";

export const LEVEL_KEY = "rivetcare-level";
const ZERO_KEY = "rivetcare-level-zero";
const MAX_LEVEL = 20_000;

export type { LevelFile };

export function readLevelFile(): LevelFile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEVEL_KEY);
    if (!raw || raw.length > MAX_LEVEL) return null;
    const rows = levelRows(JSON.parse(raw) as unknown);
    return Object.keys(rows).length ? rows : null;
  } catch {
    return null;
  }
}

export function writeLevelFile(value: LevelFile): boolean {
  if (typeof window === "undefined") return true;
  try {
    const rows = levelRows(value);
    if (!Object.keys(rows).length) {
      localStorage.removeItem(LEVEL_KEY);
      return true;
    }
    const text = JSON.stringify(rows);
    if (text.length > MAX_LEVEL) return false;
    localStorage.setItem(LEVEL_KEY, text);
    return true;
  } catch {
    return false;
  }
}

export function restoreLevelFile(value: LevelFile | null) {
  if (typeof window === "undefined") return;
  if (!value || !Object.keys(value).length) localStorage.removeItem(LEVEL_KEY);
  else writeLevelFile(value);
}

export function backupLevel(value: unknown): LevelFile | null {
  const rows = levelRows(value);
  if (!Object.keys(rows).length) return null;
  return rows;
}

export function readSpans(modelId: string): Spans {
  const row = readLevelFile()?.[modelId];
  return { track: row?.track ?? null, jack: row?.jack ?? null };
}

export function writeSpans(modelId: string, spans: Spans): boolean {
  if (modelId === "__proto__" || modelId === "constructor" || modelId === "prototype" || !/^[a-z0-9-]{1,32}$/i.test(modelId)) return false;
  const file = readLevelFile() ?? {};
  const next = { ...file };
  if (spans.track == null && spans.jack == null) delete next[modelId];
  else next[modelId] = { track: spans.track, jack: spans.jack };
  return writeLevelFile(next);
}

export function readZero(): PhoneZero | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ZERO_KEY);
    if (!raw || raw.length > 200) return null;
    return phoneZero(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function writeZero(zero: PhoneZero | null) {
  if (typeof window === "undefined") return;
  try {
    const clean = zero ? phoneZero(zero) : null;
    if (!clean) localStorage.removeItem(ZERO_KEY);
    else localStorage.setItem(ZERO_KEY, JSON.stringify(clean));
  } catch {
    /* The reading still works for this visit if the phone will not store it. */
  }
}
