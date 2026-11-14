import { create } from "zustand";
import { backupAppOk, backupVersion } from "@/lib/backup-version";
import { deleteFile } from "@/lib/files";
import { asTires, emptyTires, tirePhotoIds, type TireRecord } from "@/lib/tires";
import { cadenceLabel, tasks, type Cadence } from "@/data/schedule";
import { vinOk, vinYear } from "@/data/coach";
import { checklistById } from "@/data/checklists";
import { daysBetween, formatWhen, realDay, repairDay, shiftIso, shiftYears, todayIso } from "@/lib/date";
import { latestService, markAfterOwnedEdit, markFromService, taskFromJob } from "@/lib/schedule-link";
import { backupWeights, mergeWeightsFile, readWeightsFile, restoreWeightsFile, savedTicketCount, writeWeightsFile } from "@/lib/weights";
import { mergeLevelFile } from "@/lib/level";
import { backupLevel, readLevelFile, restoreLevelFile, writeLevelFile } from "@/lib/level-spans";
import type { BookId } from "@/data/books";
import type { SupplyRecord } from "@/lib/supplies";
import { asSupplies, emptySupplies } from "@/lib/supplies";
import type { Plates } from "@/lib/plates";
import { asPlates, emptyPlates } from "@/lib/plates";

export type Screen =
  | { name: "home" }
  | { name: "fix" }
  | { name: "symptom"; id: string; step: number }
  | { name: "care" }
  | { name: "procedure"; id: string }
  | { name: "procedures" }
  | { name: "parts" }
  | { name: "part"; id: string }
  | { name: "more" }
  | { name: "checklist"; id: string }
  | { name: "lists" }
  | { name: "specs" }
  | { name: "weights" }
  | { name: "level" }
  | { name: "tires" }
  | { name: "supplies"; part?: "propane" | "battery" }
  | { name: "service" }
  | { name: "recalls" }
  | { name: "codes"; q?: string; appliance?: string }
  | { name: "log" }
  | { name: "records" }
  | { name: "backup" }
  | { name: "privacy" }
  | { name: "history" }
  | { name: "notes" }
  | { name: "desk" }
  | { name: "manuals" }
  | { name: "tools" }
  | { name: "about" }
  | { name: "printout" }
  | { name: "table"; id?: string; step?: number }
  | { name: "flows" }
  | { name: "flow"; id: string }
  | { name: "figures" }
  | { name: "figure"; id: string }
  | { name: "sheet"; page: number }
  | { name: "offline" }
  | { name: "support" };

export type DoneMark = { iso: string; miles: number; note?: string };
export type LogFile = { id: string; name: string; mime: string; role?: "before" | "after" | "receipt" | "invoice" };
export type ServiceDetail = {
  work?: string;
  provider?: string;
  parts?: string;
  partsCost?: string;
  laborCost?: string;
  cost?: string;
  warranty?: string;
  tech?: string;
  phone?: string;
};

export function serviceTotal(partsCost?: string, laborCost?: string): string {
  const read = (value: string | undefined) => {
    if (!value) return null;
    const cleaned = value.replace(/[$,\s]/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };
  const parts = read(partsCost);
  const labor = read(laborCost);
  if (parts == null && labor == null) return "";
  const cents = Math.round(((parts ?? 0) + (labor ?? 0)) * 100);
  const text = (cents / 100).toFixed(2);
  const trimmed = text.endsWith(".00") ? String(cents / 100) : text.replace(/0$/, "").replace(/\.$/, "");
  return `${partsCost ?? ""} ${laborCost ?? ""}`.includes("$") ? `$${trimmed}` : trimmed;
}
export type LogEntry = { id: string; iso: string; miles: number; note: string; job?: string; files?: LogFile[]; taskId?: string } & ServiceDetail;
export type PersonalNote = { id: string; iso: string; text: string };

type CoachRecord = {
  odometer: number;
  done: Record<string, DoneMark>;
  checks: Record<string, Record<string, boolean>>;
  log: LogEntry[];
  notes: PersonalNote[];
  dealer: string;
  /** Street address for the saved dealer. Empty until they set one. */
  dealerAddress: string;
  vin: string;
  /** The owner's name for this coach. Empty until they set one. */
  nickname: string;
  /** Model year typed on the home screen. Null until they set one. */
  modelYear: number | null;
  wheelOff: number | null;
  /** Highest lug stage marked for this countdown: 0, 5, 10, 25, or 50. */
  lugAck: number;
  tires: TireRecord;
  supplies: SupplyRecord;
  plates: Plates;
  listDone: Record<string, string>;
  /** A service-log note that has not been saved as a log line yet. */
  logDraft: { note: string; job: string; files: LogFile[] } | null;
  /** The winterizing page to reopen, plus any Yes or No answers on that flowchart. */
  winterPlace: { page: "flow" | "procedure" | "checklist"; trail: string[] } | null;
  /** A photo of this coach, stored with the service-log files. Null until they add one. */
  photoId: string | null;
  /** Photos kept on a maintenance job or a procedure. Keys are care:taskId or procedure:id. */
  shots: Record<string, LogFile[]>;
};

type Persisted = {
  modelId: string;
  hint: boolean;
  installHint: boolean;
  accepted: boolean;
  /** Which disclaimer text this phone already accepted. */
  disclaimerRev?: number;
  ready: boolean;
  /** Day the backup file was last saved, or empty. */
  lastBackup: string;
  /** Size of the last backup file that was saved or shared. 0 if that size was not recorded. */
  lastBackupBytes: number;
  /** True after they pick a floor plan, or continue setup while looking at one. */
  coachSet: boolean;
  /** When the home backup line was dismissed, and how many records existed then. */
  copyNudge: { edits: number; iso: string } | null;
  /** Troubleshoot system last chosen. Empty means Start. */
  systemFilter: string;
  /** Miles, notes, and photos for each coach. The open coach is also copied here. */
  coaches: Record<string, CoachRecord>;
  /** Written on every save. Missing on copies from before schema checks. */
  schema?: number;
  /** Increments on every save so a stale tab cannot overwrite a newer one. */
  rev?: number;
};

const KEY = "rivetcare-v1";
const BROKEN_KEY = "rivetcare-v1-unreadable";
const RAW_KEY = "rivetcare-v1-before-trim";
/** Bump when a stored field must survive an older build. Older builds refuse to write over a higher number. */
export const STORE_SCHEMA = 1;
export const UNREADABLE_TOAST = "The saved copy on this phone could not be read. It was kept. This change was not saved.";
const NEWER_TOAST = "This phone has a newer copy of the book. This version will not change it.";
const STALE_TOAST = "Another tab saved first. This change was not saved.";
let saveBlocked: false | "unreadable" | "newer" = false;
let saveProblem: "" | "newer" | "stale" | "full" = "";
let seenRev = 0;
let listening = false;

const roots = new Set(["home", "fix", "care", "parts", "more", "log", "records"]);

function resumeWinter(place: CoachRecord["winterPlace"]): Partial<State> | Record<string, never> {
  if (!place) return {};
  const frame =
    place.page === "flow"
      ? { screen: { name: "flow" as const, id: "winter" }, tab: "fix" as const }
      : place.page === "procedure"
        ? { screen: { name: "procedure" as const, id: "winterize" }, tab: "care" as const }
        : { screen: { name: "checklist" as const, id: "winter" }, tab: "care" as const };
  return {
    trail: [{ screen: { name: "home" }, tab: "home" }, frame],
    cursor: 1,
    activeTab: frame.tab,
  };
}

function keepBroken(raw: string) {
  try {
    localStorage.setItem(BROKEN_KEY, raw);
  } catch {
    /* the raw text is still held in memory */
  }
}

function load(): { data: Partial<Persisted>; block: false | "unreadable" | "newer"; kept: string } {
  if (typeof window === "undefined") return { data: {}, block: false, kept: "" };
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return { data: {}, block: false, kept: "" };
  }
  if (!raw) return { data: {}, block: false, kept: "" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    keepBroken(raw);
    saveBlocked = "unreadable";
    return { data: {}, block: "unreadable", kept: raw };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    keepBroken(raw);
    saveBlocked = "unreadable";
    return { data: {}, block: "unreadable", kept: raw };
  }
  const row = parsed as Persisted;
  if (typeof row.schema === "number" && row.schema > STORE_SCHEMA) {
    saveBlocked = "newer";
    return { data: {}, block: "newer", kept: "" };
  }
  seenRev = typeof row.rev === "number" && Number.isFinite(row.rev) && row.rev >= 0 ? row.rev : 0;
  saveBlocked = false;
  return { data: row, block: false, kept: "" };
}

let saveInside = false;

function save(p: Persisted, quiet = false): boolean | Promise<boolean> {
  const locks = typeof document !== "undefined" && typeof navigator !== "undefined" ? navigator.locks : undefined;
  if (locks && !saveInside) {
    return locks.request("rivetcare-v1", () => {
      saveInside = true;
      try {
        return saveNow(p, quiet);
      } finally {
        saveInside = false;
      }
    });
  }
  return saveNow(p, quiet);
}

let dropped = false;

function saveNow(p: Persisted, quiet = false): boolean {
  if (typeof window === "undefined") return true;
  if (dropped) {
    saveProblem = "stale";
    return false;
  }
  saveProblem = "";
  if (saveBlocked === "newer") {
    saveProblem = "newer";
    return false;
  }
  let currentRev = 0;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const row = parsed as Persisted;
        if (typeof row.schema === "number" && row.schema > STORE_SCHEMA) {
          saveBlocked = "newer";
          saveProblem = "newer";
          return false;
        }
        if (typeof row.rev === "number" && Number.isFinite(row.rev) && row.rev >= 0) currentRev = row.rev;
      }
    } else if (seenRev > 0) {
      dropped = true;
      saveProblem = "stale";
      window.location.reload();
      return false;
    }
  } catch {
    /* a broken value can be replaced by a restore */
  }
  if (currentRev > seenRev) {
    saveProblem = "stale";
    adoptExternalSave("quiet");
    return false;
  }
  const nextRev = currentRev + 1;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...p, schema: STORE_SCHEMA, rev: nextRev }));
    seenRev = nextRev;
    if (saveBlocked === "unreadable") saveBlocked = false;
    if (clearKeptRaw) {
      clearKeptRaw = false;
      try {
        localStorage.removeItem(RAW_KEY);
      } catch {
        /* the extra copy can stay until the phone is erased */
      }
    }
    return true;
  } catch {
    saveProblem = "full";
    if (!quiet) {
      try {
        useApp.getState().flash("This phone is full. That change was not saved.");
      } catch {
        /* the store is still starting */
      }
    }
    return false;
  }
}

let clearKeptRaw = false;
let commitTail: Promise<void> = Promise.resolve();

type Patch = Partial<State>;
type PatchSource = Patch | ((live: State) => Patch | null);

/** Run a save after any save already waiting. In Node each save runs immediately. */
function enqueue<T>(job: () => T | Promise<T>): T | Promise<T> {
  const queued = typeof document !== "undefined" && typeof navigator !== "undefined" && navigator.locks;
  if (!queued) return job();
  const run = commitTail.then(() => Promise.resolve(job()));
  commitTail = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/** Write the change first. The screen updates only when the phone accepts it. */
function commit(source: PatchSource): boolean | Promise<boolean> {
  if (saveBlocked === "unreadable") {
    useApp.setState({ toast: UNREADABLE_TOAST });
    return false;
  }
  if (saveBlocked === "newer") {
    useApp.setState({ toast: NEWER_TOAST });
    return false;
  }
  return enqueue(() => applyCommit(source));
}

function applyCommit(source: PatchSource): boolean | Promise<boolean> {
  const live = useApp.getState();
  const patch = typeof source === "function" ? source(live) : source;
  if (!patch) return false;
  if (!Object.keys(patch).length) return true;
  const wrote = save(persisted({ ...live, ...patch }), true);
  const finish = (ok: boolean) => {
    if (!ok) {
      const toast = saveProblem === "newer" ? NEWER_TOAST : saveProblem === "stale" ? STALE_TOAST : "This phone is full. That change was not saved.";
      useApp.setState({ toast });
      if (saveProblem !== "stale") {
        window.setTimeout(() => {
          if (useApp.getState().toast === toast) useApp.setState({ toast: "" });
        }, 1600);
      }
      return false;
    }
    useApp.setState({ ...patch, keptRaw: "" });
    return true;
  };
  return wrote instanceof Promise ? wrote.then(finish) : finish(wrote);
}

type TabName = "home" | "fix" | "care" | "parts" | "more" | "log" | "records";
type Frame = { screen: Screen; tab: TabName };

/** Which bottom tab a screen belongs to. A push from Home must light this, not Home. */
export function tabFor(screen: Screen): TabName {
  switch (screen.name) {
    case "home":
      return "home";
    case "fix":
    case "symptom":
    case "codes":
    case "flow":
    case "flows":
    case "table":
      return "fix";
    case "care":
    case "procedure":
    case "procedures":
    case "tires":
    case "supplies":
      return "care";
    case "records":
    case "log":
    case "notes":
    case "history":
    case "backup":
    case "desk":
      return "records";
    default:
      return "more";
  }
}

const MAX_TRAIL = 40;

type State = CoachRecord & {
  modelId: string;
  hint: boolean;
  installHint: boolean;
  accepted: boolean;
  ready: boolean;
  lastBackup: string;
  lastBackupBytes: number;
  coachSet: boolean;
  copyNudge: { edits: number; iso: string } | null;
  coaches: Record<string, CoachRecord>;
  hydrated: boolean;
  trail: Frame[];
  cursor: number;
  activeTab: TabName;
  picker: boolean;
  searching: boolean;
  toast: string;
  /** The raw saved copy, when it could not be read. Empty once a later save lands. */
  keptRaw: string;
  undo: (() => void) | null;
  undoCommit: (() => void) | null;
  systemFilter: string;
  partsBook: BookId | null;
  guideQuery: string;
  hydrate: () => void;
  setModel: (id: string) => void;
  setOdo: (n: number) => void;
  addTripMiles: (delta: number, note?: string) => void;
  setTires: (patch: Partial<TireRecord>) => boolean | Promise<boolean>;
  setSupplies: (patch: Partial<SupplyRecord>) => void;
  setPlates: (patch: Partial<Plates>) => void;
  finishSetup: (miles: number | null, confirmCoach?: boolean) => void;
  setDealer: (s: string) => void;
  setDealerAddress: (s: string) => void;
  setVin: (s: string) => void;
  setNickname: (s: string) => void;
  setModelYear: (year: number | null) => void;
  setTrailerPhoto: (id: string | null) => void;
  importBackup: (raw: string | Record<string, unknown>) => { ok: true; files: { id: string; mime: string; data: string }[]; notice: string; apply: () => boolean | Promise<boolean> } | { ok: false; reason?: "future" | "large" };
  dismissHint: () => void;
  dismissInstall: () => void;
  dismissCopyNudge: () => void;
  acceptDisclaimer: () => void;
  markDone: (taskId: string, title: string) => void;
  setDoneDate: (taskId: string, iso: string) => void;
  setStartDates: (taskIds: string[], iso: string) => Promise<void>;
  setDoneNote: (taskId: string, note: string) => void;
  clearDone: (taskId: string) => void;
  startWheelOff: () => void;
  clearWheelOff: () => void;
  toggleCheck: (listId: string, itemId: string) => void;
  clearList: (listId: string) => void;
  addLog: (note: string, files?: LogFile[], job?: string, keepDraft?: boolean, when?: { iso?: string; miles?: number; detail?: ServiceDetail; taskId?: string }) => boolean | Promise<boolean>;
  setLogDraft: (draft: { note: string; job: string; files: LogFile[] } | null) => boolean | Promise<boolean>;
  setWinterPlace: (place: CoachRecord["winterPlace"]) => void;
  updateLog: (id: string, note: string, when?: { iso?: string; miles?: number; detail?: ServiceDetail }) => boolean | Promise<boolean>;
  removeLog: (id: string) => void;
  removeLogFile: (entryId: string, fileId: string) => void;
  addShot: (key: string, file: LogFile) => boolean | Promise<boolean>;
  removeShot: (key: string, fileId: string) => void;
  addNote: (text: string) => boolean | Promise<boolean>;
  updateNote: (id: string, text: string) => boolean | Promise<boolean>;
  removeNote: (id: string) => void;
  push: (s: Screen) => void;
  back: () => void;
  forward: () => void;
  tab: (name: TabName) => void;
  setPicker: (v: boolean) => void;
  setSearching: (v: boolean) => void;
  setSystem: (s: string) => void;
  setPartsBook: (id: BookId | null) => void;
  setGuideQuery: (q: string) => void;
  noteBackup: (bytes?: number) => void;
  flash: (msg: string) => void;
  offerUndo: (msg: string, revert: () => void, commit?: () => void) => void;
  runUndo: () => void;
};

function safeKey(key: string) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}

function ownCoach(map: object, id: string) {
  return safeKey(id) && /^[a-z0-9-]{1,32}$/i.test(id) && Object.prototype.hasOwnProperty.call(map, id);
}

const FILE_ID_MAX = 200;
const MILES_MAX = 1_000_000;
const LOG_MAX = 200;

function pushLog(prev: LogEntry[], entries: LogEntry[]) {
  const all = [...entries, ...prev];
  return { log: all.slice(0, LOG_MAX), dropped: all.slice(LOG_MAX) };
}
const NOTE_MAX = 100;

type Trim = { files: number; logs: number; notes: number; repaired: number; today: number; miles: number; dup: number };
let trim: Trim = { files: 0, logs: 0, notes: 0, repaired: 0, today: 0, miles: 0, dup: 0 };

function beginRead() {
  trim = { files: 0, logs: 0, notes: 0, repaired: 0, today: 0, miles: 0, dup: 0 };
}

function trimMessage(): string {
  const left: string[] = [];
  const fixed: string[] = [];
  if (trim.logs) left.push(trim.logs === 1 ? "1 log line past 200" : `${trim.logs} log lines past 200`);
  if (trim.notes) left.push(trim.notes === 1 ? "1 note past 100" : `${trim.notes} notes past 100`);
  if (trim.miles) left.push(trim.miles === 1 ? "a mileage out of range" : `${trim.miles} mileages out of range`);
  if (trim.files) left.push(trim.files === 1 ? "a photo id too long to match" : `${trim.files} photo ids too long to match`);
  if (trim.dup) left.push(trim.dup === 1 ? "1 repeated record id" : `${trim.dup} repeated record ids`);
  if (trim.repaired) fixed.push(trim.repaired === 1 ? "A date was corrected" : `${trim.repaired} dates were corrected`);
  if (trim.today) fixed.push(trim.today === 1 ? "A date was set to today" : `${trim.today} dates were set to today`);
  const parts: string[] = [];
  if (left.length) parts.push(`Left out ${left.join(", ")}`);
  parts.push(...fixed);
  if (!parts.length) return "";
  return `${parts.join(". ")}.`;
}

/** A missing date becomes today and is not announced. A bad day is repaired. Anything else becomes today. */
function settledIso(value: unknown): string {
  const raw = typeof value === "string" ? value : "";
  if (!raw) return todayIso();
  if (realDay(raw)) return raw;
  const fixed = repairDay(raw);
  if (fixed) {
    trim.repaired += 1;
    return fixed;
  }
  trim.today += 1;
  return todayIso();
}

function readMiles(value: unknown): number {
  const n = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : 0;
  if (!Number.isFinite(n)) return 0;
  const miles = Math.round(n);
  if (miles < 0) {
    trim.miles += 1;
    return 0;
  }
  if (miles > MILES_MAX) {
    trim.miles += 1;
    return MILES_MAX;
  }
  return miles;
}

function keepFileId(id: unknown): string | null {
  if (typeof id !== "string" || !id || !safeKey(id)) return null;
  if (id.length > FILE_ID_MAX) {
    trim.files += 1;
    return null;
  }
  return id;
}

function asFiles(value: unknown): LogFile[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const files: LogFile[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as { id?: unknown; name?: unknown; mime?: unknown; role?: unknown };
    if (typeof row.id !== "string" || !safeKey(row.id) || typeof row.name !== "string" || typeof row.mime !== "string") continue;
    const id = keepFileId(row.id);
    if (!id) continue;
    const mime = row.mime.toLowerCase().split(";")[0].trim();
    if (mime !== "image/jpeg" && mime !== "image/png" && mime !== "image/gif" && mime !== "image/webp" && mime !== "application/pdf") continue;
    const role = row.role === "before" || row.role === "after" || row.role === "receipt" || row.role === "invoice" ? row.role : undefined;
    files.push({ id, name: row.name.slice(0, 80), mime, ...(role ? { role } : {}) });
    if (files.length === 6) break;
  }
  return files.length ? files : undefined;
}

function clipText(value: unknown, max: number) {
  if (typeof value !== "string") return undefined;
  const text = value.trim().slice(0, max);
  return text || undefined;
}

export function readService(value: unknown): ServiceDetail {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    work: clipText(row.work, 200),
    provider: clipText(row.provider, 80),
    parts: clipText(row.parts, 200),
    partsCost: clipText(row.partsCost, 20),
    laborCost: clipText(row.laborCost, 20),
    cost: clipText(row.cost, 20),
    warranty: clipText(row.warranty, 200),
    tech: clipText(row.tech, 80),
    phone: clipText(row.phone, 40),
  };
}

function serviceText(detail: ServiceDetail | undefined) {
  if (!detail) return false;
  return Object.values(detail).some((value) => typeof value === "string" && value.trim());
}

function fileIds(entries: LogEntry[]) {
  return entries.flatMap((e) => e.files?.map((f) => f.id) ?? []);
}

let dropTail: Promise<void> = Promise.resolve();

function trackDrop(job: Promise<unknown>) {
  const settled = Promise.resolve(job).then(
    () => undefined,
    () => undefined,
  );
  dropTail = dropTail.then(() => settled);
}

/** Resolves when photo deletes started by a restore have finished. */
export function whenFilesDropped(): Promise<void> {
  return dropTail;
}

function coachHoldsFile(coach: { photoId?: string | null; shots?: Record<string, LogFile[]>; log?: LogEntry[]; logDraft?: { files?: LogFile[] } | null; tires?: unknown }, id: string) {
  if (coach.photoId === id) return true;
  if (shotIds(coach).includes(id)) return true;
  if (tirePhotoIds(coach.tires).includes(id)) return true;
  if ((coach.log ?? []).some((entry) => entry.files?.some((file) => file.id === id))) return true;
  return !!coach.logDraft?.files?.some((file) => file.id === id);
}

/** True when the open coach, or any other coach saved on this phone, still points at this photo. */
export function fileStillUsed(id: string): boolean {
  if (!id) return false;
  const state = useApp.getState();
  if (coachHoldsFile(state, id)) return true;
  for (const [coachId, coach] of Object.entries(state.coaches)) {
    if (coachId === state.modelId) continue;
    if (coachHoldsFile(coach, id)) return true;
  }
  return false;
}

function dropFiles(prev: LogEntry[], next: LogEntry[], alsoKeep: Iterable<string> = []) {
  const keep = new Set(fileIds(next));
  for (const id of alsoKeep) keep.add(id);
  const state = useApp.getState();
  for (const [id, coach] of Object.entries(state.coaches)) {
    if (id === state.modelId) continue;
    for (const fileId of fileIds(coach.log)) keep.add(fileId);
    if (coach.photoId) keep.add(coach.photoId);
    for (const fileId of shotIds(coach)) keep.add(fileId);
    for (const fileId of tirePhotoIds(coach.tires)) keep.add(fileId);
    for (const file of coach.logDraft?.files ?? []) keep.add(file.id);
  }
  if (state.photoId) keep.add(state.photoId);
  for (const fileId of shotIds(state)) keep.add(fileId);
  for (const fileId of tirePhotoIds(state.tires)) keep.add(fileId);
  for (const file of state.logDraft?.files ?? []) keep.add(file.id);
  const jobs: Promise<void>[] = [];
  for (const id of fileIds(prev)) {
    if (!keep.has(id)) jobs.push(deleteFile(id));
  }
  trackDrop(Promise.all(jobs));
}

function emptyCoach(): CoachRecord {
  return {
    odometer: 0,
    done: {},
    checks: {},
    log: [],
    notes: [],
    dealer: "",
    dealerAddress: "",
    vin: "",
    nickname: "",
    modelYear: null,
    wheelOff: null,
    lugAck: 0,
    tires: emptyTires,
    supplies: emptySupplies,
    plates: emptyPlates,
    listDone: {},
    logDraft: null,
    winterPlace: null,
    photoId: null,
    shots: {},
  };
}

function snapshot(s: CoachRecord): CoachRecord {
  return {
    odometer: s.odometer,
    done: s.done,
    checks: s.checks,
    log: s.log,
    notes: s.notes,
    dealer: s.dealer,
    dealerAddress: s.dealerAddress,
    vin: s.vin,
    nickname: s.nickname,
    modelYear: s.modelYear,
    wheelOff: s.wheelOff,
    lugAck: s.lugAck,
    tires: s.tires,
    supplies: s.supplies,
    plates: s.plates,
    listDone: s.listDone,
    logDraft: s.logDraft,
    winterPlace: s.winterPlace,
    photoId: s.photoId,
    shots: s.shots,
  };
}

export const COPY_NUDGE_EDITS = 10;
export const COPY_NUDGE_DAYS = 14;

type EditCoach = {
  odometer?: number;
  log?: { files?: unknown[] }[];
  done?: object;
  notes?: unknown[];
  photoId?: string | null;
  shots?: Record<string, unknown[] | undefined>;
  logDraft?: { note?: string; files?: unknown[] } | null;
  tires?: unknown;
};

/** A log line, miles, a mark, a note, a photo, or an unsaved note. Each one counts. */
export function countCoachEdits(coach: EditCoach): number {
  let n = 0;
  if ((coach.odometer ?? 0) > 0) n += 1;
  const log = coach.log ?? [];
  n += log.length;
  for (const entry of log) n += entry.files?.length ?? 0;
  n += Object.keys(coach.done ?? {}).length;
  n += coach.notes?.length ?? 0;
  if (coach.photoId) n += 1;
  for (const files of Object.values(coach.shots ?? {})) n += files?.length ?? 0;
  n += tirePhotoIds(coach.tires).length;
  const draft = coach.logDraft;
  if (draft && (draft.note?.trim() || (draft.files?.length ?? 0) > 0)) n += 1;
  return n;
}

/** Show the home backup line. A dismissal holds for 10 more records or 14 days. */
export function copyNudgeOn(edits: number, lastBackup: string, today: string, dismissed: { edits: number; iso: string } | null): boolean {
  const never = !lastBackup && edits > 0;
  const age = lastBackup ? daysBetween(lastBackup, today) : null;
  const stale = age != null && age >= COPY_NUDGE_DAYS;
  if (!never && !stale) return false;
  if (!dismissed) return true;
  if (edits >= dismissed.edits + COPY_NUDGE_EDITS) return true;
  const since = daysBetween(dismissed.iso, today);
  return since != null && since >= COPY_NUDGE_DAYS;
}

/** A missing flag is an older save. Another coach, a year, or a VIN counts as a choice. */
export function coachWasChosen(modelId: string, modelYear: number | null, vin: string, stored: unknown): boolean {
  if (stored === true) return true;
  if (stored === false) return false;
  if (modelId !== "c28") return true;
  if (modelYear != null) return true;
  if (vin.trim()) return true;
  return false;
}

export function recordEdits(s: {
  coaches: Record<string, CoachRecord>;
  modelId: string;
  odometer: number;
  log: LogEntry[];
  done: Record<string, DoneMark>;
  notes: PersonalNote[];
  photoId: string | null;
  shots: Record<string, LogFile[]>;
  tires: TireRecord;
  logDraft: CoachRecord["logDraft"];
}): number {
  const coaches = {
    ...s.coaches,
    [s.modelId]: {
      odometer: s.odometer,
      log: s.log,
      done: s.done,
      notes: s.notes,
      photoId: s.photoId,
      shots: s.shots,
      tires: s.tires,
      logDraft: s.logDraft,
    },
  };
  return Object.values(coaches).reduce((n, coach) => n + countCoachEdits(coach), 0) + savedTicketCount();
}

function readCopyNudge(value: unknown): { edits: number; iso: string } | null {
  if (!value || typeof value !== "object") return null;
  const row = value as { edits?: unknown; iso?: unknown };
  if (typeof row.edits !== "number" || !Number.isInteger(row.edits) || row.edits < 0 || row.edits > 100_000) return null;
  if (typeof row.iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.iso)) return null;
  return { edits: row.edits, iso: row.iso };
}

function readDone(value: unknown): Record<string, DoneMark> {
  const done: Record<string, DoneMark> = {};
  if (!value || typeof value !== "object") return done;
  for (const [id, mark] of Object.entries(value)) {
    if (!safeKey(id) || !mark || typeof mark !== "object" || typeof (mark as DoneMark).iso !== "string" || typeof (mark as DoneMark).miles !== "number") continue;
    const iso = (mark as DoneMark).iso;
    const note = typeof (mark as { note?: unknown }).note === "string" ? (mark as { note: string }).note.trim().slice(0, 200) : "";
    done[id] = { iso: settledIso(iso), miles: readMiles((mark as DoneMark).miles), ...(note ? { note } : {}) };
  }
  return done;
}

function readChecks(value: unknown): Record<string, Record<string, boolean>> {
  const checks: Record<string, Record<string, boolean>> = {};
  if (!value || typeof value !== "object") return checks;
  for (const [listId, items] of Object.entries(value)) {
    if (!safeKey(listId) || !items || typeof items !== "object" || Array.isArray(items)) continue;
    const row: Record<string, boolean> = {};
    for (const [itemId, on] of Object.entries(items)) {
      if (!safeKey(itemId)) continue;
      row[itemId] = !!on;
    }
    checks[listId] = row;
  }
  return checks;
}

function readWinterPlace(value: unknown): CoachRecord["winterPlace"] {
  if (!value || typeof value !== "object") return null;
  const row = value as { page?: unknown; trail?: unknown };
  const page = row.page === "flow" || row.page === "procedure" || row.page === "checklist" ? row.page : null;
  if (!page) return null;
  const trail = Array.isArray(row.trail)
    ? row.trail.filter((answer) => answer === "Yes" || answer === "No").slice(0, 12)
    : [];
  return { page, trail };
}

function readLogDraft(value: unknown): CoachRecord["logDraft"] {
  if (!value || typeof value !== "object") return null;
  const row = value as { note?: unknown; job?: unknown; files?: unknown };
  const note = typeof row.note === "string" ? row.note.slice(0, 800) : "";
  const job = typeof row.job === "string" ? row.job.trim().slice(0, 80) : "";
  const files = asFiles(row.files) ?? [];
  if (!note.trim() && !job && files.length === 0) return null;
  return { note, job, files };
}

function readNotes(value: unknown): PersonalNote[] {
  if (!Array.isArray(value)) return [];
  const notes: PersonalNote[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as { id?: unknown; iso?: unknown; text?: unknown };
    const text = typeof row.text === "string" ? row.text.trim().slice(0, 2000) : "";
    if (!text) continue;
    const iso = settledIso(row.iso);
    if (notes.length === NOTE_MAX) {
      trim.notes += 1;
      continue;
    }
    const id = typeof row.id === "string" && row.id && row.id.length <= FILE_ID_MAX ? row.id : crypto.randomUUID();
    if (notes.some((note) => note.id === id)) {
      trim.dup += 1;
      continue;
    }
    notes.push({ id, iso, text });
  }
  return notes;
}

function readLog(value: unknown, fallback: LogEntry[]): LogEntry[] {
  if (!Array.isArray(value)) return fallback;
  const rows = value.filter((e) => e && typeof e.iso === "string" && (typeof e.note === "string" || typeof (e as { job?: unknown }).job === "string"));
  if (rows.length > LOG_MAX) trim.logs += rows.length - LOG_MAX;
  const seen = new Set<string>();
  const log: LogEntry[] = [];
  for (const entry of rows.slice(0, LOG_MAX).map((e) => {
    const job = typeof (e as { job?: unknown }).job === "string" ? (e as { job: string }).job.trim().slice(0, 80) : "";
    const taskId = typeof (e as { taskId?: unknown }).taskId === "string" ? (e as { taskId: string }).taskId : "";
    return {
      id: String(e.id || crypto.randomUUID()),
      iso: settledIso(e.iso),
      miles: readMiles(e.miles),
      note: typeof e.note === "string" ? e.note : "",
      job: job || undefined,
      files: asFiles((e as { files?: unknown }).files),
      taskId: /^[a-z0-9-]{1,40}$/i.test(taskId) ? taskId : undefined,
      ...readService(e),
    };
  })) {
    if (seen.has(entry.id)) {
      trim.dup += 1;
      continue;
    }
    seen.add(entry.id);
    log.push(entry);
  }
  return log;
}

function readModelYear(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1960 || value > 2039) return null;
  return value;
}

function readShots(value: unknown): Record<string, LogFile[]> {
  const shots: Record<string, LogFile[]> = {};
  if (!value || typeof value !== "object") return shots;
  for (const [key, files] of Object.entries(value)) {
    if (!/^(care|procedure):[a-z0-9-]{1,40}$/i.test(key)) continue;
    const list = asFiles(files);
    if (list?.length) shots[key] = list.slice(0, 3);
  }
  return shots;
}

function readCoach(raw: unknown, fallbackLog: LogEntry[] = []): CoachRecord {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const odometer = readMiles(data.odometer);
  return {
    odometer,
    done: readDone(data.done),
    checks: readChecks(data.checks),
    log: readLog(data.log, fallbackLog),
    notes: readNotes(data.notes),
    dealer: typeof data.dealer === "string" ? data.dealer.slice(0, 80) : "",
    dealerAddress: typeof data.dealerAddress === "string" ? data.dealerAddress.slice(0, 120) : "",
    vin: typeof data.vin === "string" ? data.vin.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17) : "",
    nickname: typeof data.nickname === "string" ? data.nickname.trim().slice(0, 40) : "",
    modelYear: readModelYear(data.modelYear),
    wheelOff: settledWheel(data.wheelOff, odometer),
    lugAck: keptLugAck(settledWheel(data.wheelOff, odometer), odometer, data.lugAck),
    tires: asTires(data.tires),
    supplies: asSupplies(data.supplies),
    plates: asPlates(data.plates),
    listDone: asListDone(data.listDone),
    logDraft: readLogDraft(data.logDraft),
    winterPlace: readWinterPlace(data.winterPlace),
    photoId: keepFileId(data.photoId),
    shots: readShots(data.shots),
  };
}

function shotIds(coach: { shots?: Record<string, LogFile[]> }) {
  return Object.values(coach.shots ?? {}).flatMap((files) => files.map((file) => file.id));
}

function extraBackupIds(coaches: Record<string, CoachRecord>) {
  const ids: string[] = [];
  for (const coach of Object.values(coaches)) {
    if (coach.photoId) ids.push(coach.photoId);
    ids.push(...shotIds(coach));
    ids.push(...tirePhotoIds(coach.tires));
    for (const file of coach.logDraft?.files ?? []) ids.push(file.id);
  }
  return ids;
}

function draftAsLog(coaches: Record<string, CoachRecord>): LogEntry[] {
  return Object.values(coaches).flatMap((coach) =>
    coach.logDraft?.files?.length ? [{ id: "draft", iso: "", miles: 0, note: "", files: coach.logDraft.files }] : [],
  );
}

function coachLogs(coaches: Record<string, CoachRecord>) {
  return Object.values(coaches).flatMap((coach) => coach.log);
}

const DISCLAIMER_REV = 2;

function persisted(s: State): Persisted {
  return {
    modelId: s.modelId,
    hint: s.hint,
    installHint: s.installHint,
    accepted: s.accepted,
    disclaimerRev: s.accepted ? DISCLAIMER_REV : 0,
    ready: s.ready,
    lastBackup: s.lastBackup,
    lastBackupBytes: s.lastBackupBytes,
    coachSet: s.coachSet,
    copyNudge: s.copyNudge,
    systemFilter: s.systemFilter,
    coaches: { ...s.coaches, [s.modelId]: snapshot(s) },
  };
}

function fieldsFrom(p: Partial<Persisted> & Record<string, unknown>) {
  beginRead();
  const modelId = typeof p.modelId === "string" && p.modelId ? p.modelId : "c28";
  const coaches: Record<string, CoachRecord> = {};
  if (p.coaches && typeof p.coaches === "object") {
    for (const [id, raw] of Object.entries(p.coaches as Record<string, unknown>)) {
      if (!safeKey(id) || !raw || typeof raw !== "object") continue;
      coaches[id] = readCoach(raw);
    }
  }
  if (!coaches[modelId]) coaches[modelId] = readCoach(p);
  const active = coaches[modelId];
  const hasHistory = active.odometer > 0 || !!active.vin || active.log.length > 0 || active.notes.length > 0 || Object.keys(active.done).length > 0;
  return {
    modelId,
    coaches,
    hint: p.hint !== false,
    installHint: p.installHint !== false,
    accepted: p.accepted === true && p.disclaimerRev === DISCLAIMER_REV,
    ready: p.ready === true || (p.ready !== false && hasHistory),
    lastBackup: typeof p.lastBackup === "string" ? p.lastBackup : "",
    lastBackupBytes: typeof p.lastBackupBytes === "number" && p.lastBackupBytes > 0 ? Math.round(p.lastBackupBytes) : 0,
    coachSet: coachWasChosen(modelId, active.modelYear, active.vin, p.coachSet),
    copyNudge: readCopyNudge(p.copyNudge),
    systemFilter: typeof p.systemFilter === "string" ? p.systemFilter : "",
    ...active,
  };
}

function listen() {
  if (listening || typeof window === "undefined" || typeof window.addEventListener !== "function") return;
  listening = true;
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY) return;
    if (event.newValue == null) {
      dropped = true;
      window.location.reload();
      return;
    }
    adoptExternalSave("tab");
  });
}

/** Another tab wrote the phone copy. Adopt it. A quiet adopt is the stale save refusing to overwrite. */
export function adoptExternalSave(why: "tab" | "quiet" = "tab") {
  if (typeof window === "undefined") return;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return;
  }
  if (!raw) return;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
  const row = parsed as Persisted;
  if (typeof row.schema === "number" && row.schema > STORE_SCHEMA) {
    saveBlocked = "newer";
    saveProblem = "newer";
    useApp.setState({ toast: NEWER_TOAST, keptRaw: "" });
    return;
  }
  const rev = typeof row.rev === "number" && Number.isFinite(row.rev) && row.rev >= 0 ? row.rev : 0;
  if (rev <= seenRev) return;
  seenRev = rev;
  if (saveBlocked === "newer") saveBlocked = false;
  useApp.setState({
    ...fieldsFrom(row),
    keptRaw: "",
    ...(why === "tab" ? { toast: "Updated from another tab." } : {}),
  });
}

export const useApp = create<State>((set, get) => ({
  hydrated: false,
  modelId: "c28",
  odometer: 0,
  done: {},
  checks: {},
  log: [],
  notes: [],
  dealer: "",
  dealerAddress: "",
  hint: true,
  installHint: true,
  vin: "",
  nickname: "",
  modelYear: null,
  accepted: false,
  wheelOff: null,
  lugAck: 0,
  ready: false,
  tires: emptyTires,
  supplies: emptySupplies,
  plates: emptyPlates,
  listDone: {},
  logDraft: null,
  winterPlace: null,
  photoId: null,
  shots: {},
  lastBackup: "",
  lastBackupBytes: 0,
  coachSet: false,
  copyNudge: null,
  coaches: {},
  trail: [{ screen: { name: "home" }, tab: "home" }],
  cursor: 0,
  activeTab: "home",
  picker: false,
  searching: false,
  toast: "",
  keptRaw: "",
  undo: null,
  undoCommit: null,
  systemFilter: "",
  partsBook: null,
  guideQuery: "",
  hydrate: () => {
    listen();
    const loaded = load();
    if (loaded.block === "newer") {
      set({ hydrated: true, toast: NEWER_TOAST, keptRaw: "" });
      return;
    }
    const fields = fieldsFrom(loaded.data);
    const notice = trimMessage();
    set({
      hydrated: true,
      ...fields,
      keptRaw: loaded.kept,
      ...(loaded.block === "unreadable" ? { toast: UNREADABLE_TOAST } : notice ? { toast: notice } : {}),
      ...resumeWinter(fields.winterPlace ?? null),
    });
    if (notice && loaded.block !== "unreadable") {
      let raw = "";
      try {
        raw = localStorage.getItem(KEY) ?? "";
      } catch {
        raw = "";
      }
      let kept = !raw;
      if (raw) {
        try {
          if (!localStorage.getItem(RAW_KEY)) localStorage.setItem(RAW_KEY, raw);
          kept = true;
        } catch {
          kept = false;
        }
      }
      if (!kept) {
        set({ toast: `${notice} The original was not overwritten.` });
      } else {
        const wrote = save(persisted(useApp.getState()), true);
        const finish = (ok: boolean) => {
          if (!ok) return;
          set({ keptRaw: raw, toast: `${notice} The original was kept.` });
        };
        if (wrote instanceof Promise) {
          void wrote.then((ok) => {
            finish(ok);
            if (ok) clearKeptRaw = true;
          }).catch(() => undefined);
        } else {
          finish(wrote);
          if (wrote) clearKeptRaw = true;
        }
      }
    }
  },
  setModel: (id) => {
    if (!id) return;
    if (id !== get().modelId) dropUndo();
    commit((live) => {
      if (id === live.modelId) return { picker: false, partsBook: null, coachSet: true };
      const coaches = { ...live.coaches, [live.modelId]: snapshot(live) };
      const next = coaches[id] ?? emptyCoach();
      return { coaches, modelId: id, picker: false, partsBook: null, coachSet: true, ...next };
    });
  },
  setOdo: (n) => {
    if (!Number.isInteger(n) || n < 0 || n > MILES_MAX) {
      get().flash("Miles have to be from 0 to 1,000,000.");
      return;
    }
    commit((live) => ({ odometer: n, ...settleLug(live.wheelOff, n, live.lugAck) }));
  },
  setTires: (patch) => {
    return commit((live) => ({ tires: asTires({ ...live.tires, ...patch }) }));
  },
  setSupplies: (patch) => {
    commit((live) => ({ supplies: asSupplies({ ...live.supplies, ...patch }) }));
  },
  setPlates: (patch) => {
    commit((live) => ({ plates: asPlates({ ...live.plates, ...patch }) }));
  },
  finishSetup: (miles, confirmCoach = false) => {
    if (miles != null && (!Number.isInteger(miles) || miles < 0 || miles > MILES_MAX)) {
      get().flash("Miles have to be from 0 to 1,000,000.");
      return;
    }
    commit((live) => {
      const wheel = miles != null ? settleLug(live.wheelOff, miles, live.lugAck) : null;
      return { ready: true, coachSet: live.coachSet || confirmCoach, ...(wheel ? { odometer: miles as number, ...wheel } : {}) };
    });
  },
  addTripMiles: async (delta, note) => {
    const add = Math.round(delta);
    if (!Number.isFinite(add) || add <= 0) return;
    if (add > 5000) {
      get().flash("Add 5,000 miles or less. Use Set total for a lifetime reading.");
      return;
    }
    const iso = todayIso();
    const text = (note ?? "").trim().slice(0, 80);
    const entryNote = text ? `${text}, ${add.toLocaleString()} miles` : `Drove ${add.toLocaleString()} miles`;
    const id = crypto.randomUUID();
    const origin = get().modelId;
    let tooFar = false;
    let prevLog: LogEntry[] = [];
    let nextLog: LogEntry[] = [];
    const ok = await commit((live) => {
      if (live.modelId !== origin) return null;
      const miles = live.odometer + add;
      if (miles > MILES_MAX) {
        tooFar = true;
        return null;
      }
      prevLog = live.log;
      nextLog = [{ id, iso, miles, note: entryNote }, ...live.log].slice(0, LOG_MAX);
      return { odometer: miles, ...settleLug(live.wheelOff, miles, live.lugAck), log: nextLog };
    });
    if (!ok) {
      if (tooFar) get().flash("Miles have to be from 0 to 1,000,000.");
      return;
    }
    dropFiles(prevLog, nextLog);
    get().flash(`${add.toLocaleString()} miles logged`);
  },
  setDealer: (dealer) => {
    commit({ dealer: dealer.slice(0, 80) });
  },
  setDealerAddress: (dealerAddress) => {
    commit({ dealerAddress: dealerAddress.slice(0, 120) });
  },
  setVin: (vin) => {
    const next = vin.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17);
    commit((live) => {
      const year = live.modelYear == null && vinOk(next) ? vinYear(next) : null;
      return year ? { vin: next, modelYear: year } : { vin: next };
    });
  },
  setNickname: (nickname) => {
    commit({ nickname: nickname.trim().slice(0, 40) });
  },
  setModelYear: (modelYear) => {
    commit({ modelYear: readModelYear(modelYear) });
  },
  setTrailerPhoto: async (photoId) => {
    const origin = get().modelId;
    const captured = get().photoId;
    if (captured === photoId) return;
    const ok = await commit((live) => {
      if (live.modelId !== origin) return null;
      if (live.photoId === photoId) return {};
      return { photoId };
    });
    if (!ok) {
      if (photoId && !fileStillUsed(photoId)) void deleteFile(photoId);
      return;
    }
    if (captured && captured !== photoId && !fileStillUsed(captured)) void deleteFile(captured);
  },
  addShot: (key, file) => {
    if (!/^(care|procedure):[a-z0-9-]{1,40}$/i.test(key)) return false;
    const current = get().shots[key] ?? [];
    if (current.length >= 3) {
      get().flash("Three photos is the limit on one section.");
      return false;
    }
    if (current.some((row) => row.id === file.id)) return true;
    return commit((live) => {
      const current = live.shots[key] ?? [];
      if (current.length >= 3 || current.some((row) => row.id === file.id)) return current.some((row) => row.id === file.id) ? {} : null;
      return { shots: { ...live.shots, [key]: [...current, file] } };
    });
  },
  removeShot: async (key, fileId) => {
    const current = get().shots[key] ?? [];
    const next = current.filter((file) => file.id !== fileId);
    const origin = get().modelId;
    if (!(await commit((live) => {
      if (live.modelId !== origin) return null;
      const current = live.shots[key] ?? [];
      return { shots: { ...live.shots, [key]: current.filter((file) => file.id !== fileId) } };
    }))) return;
    if (!fileStillUsed(fileId)) void deleteFile(fileId);
  },
  importBackup: (raw) => {
    if (typeof raw === "string" && raw.length > MAX_BACKUP_TEXT) return { ok: false, reason: "large" };
    let data: Record<string, unknown>;
    if (typeof raw === "string") {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        return { ok: false };
      }
    } else {
      data = raw;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return { ok: false };
    const version = backupVersion(data.version);
    if (version === "future") return { ok: false, reason: "future" };
    if (version === "bad") return { ok: false };
    if (!backupAppOk(data.app)) return { ok: false };
    if (!("log" in data) && !("done" in data) && !("modelId" in data) && !("coaches" in data)) return { ok: false };
    beginRead();
    const current = get();
    const coaches = { ...current.coaches, [current.modelId]: snapshot(current) };
    const brought: Record<string, CoachRecord> = {};
    if (data.coaches && typeof data.coaches === "object" && !Array.isArray(data.coaches)) {
      let imported = 0;
      for (const [id, rawCoach] of Object.entries(data.coaches as Record<string, unknown>)) {
        if (imported >= MAX_IMPORT_COACHES) break;
        if (!safeKey(id) || !/^[a-z0-9-]{1,32}$/i.test(id) || !rawCoach || typeof rawCoach !== "object" || Array.isArray(rawCoach)) continue;
        const coach = readCoach(rawCoach);
        coaches[id] = coach;
        brought[id] = coach;
        imported += 1;
      }
    } else {
      const id = typeof data.modelId === "string" && safeKey(data.modelId) && /^[a-z0-9-]{1,32}$/i.test(data.modelId) ? data.modelId : current.modelId;
      const coach = readCoach(data, "log" in data ? [] : current.log);
      coaches[id] = coach;
      brought[id] = coach;
    }
    const requested = typeof data.modelId === "string" ? data.modelId : "";
    const files = backupFiles(data.files, coachLogs(coaches), extraBackupIds(coaches));
    const weights = backupWeights(data.weights);
    const level = backupLevel(data.level);
    const notice = trimMessage();
    return {
      ok: true as const,
      files,
      notice,
      apply: () =>
        enqueue(() => {
          const live = get();
          const before = { ...live.coaches, [live.modelId]: snapshot(live) };
          const mergedCoaches = { ...before, ...brought };
          const modelId = ownCoach(mergedCoaches, requested) ? requested : live.modelId;
          const active = ownCoach(mergedCoaches, modelId) ? mergedCoaches[modelId] : readCoach(data, live.log);
          const hasHistory = active.odometer > 0 || !!active.vin || active.log.length > 0 || active.notes.length > 0 || Object.keys(active.done).length > 0;
          const coachSet = typeof data.coachSet === "boolean" ? data.coachSet : live.coachSet;
          const next = {
            ...live,
            coaches: mergedCoaches,
            modelId,
            ...active,
            accepted: data.disclaimerRev === DISCLAIMER_REV && typeof data.accepted === "boolean" ? data.accepted : live.accepted,
            ready: typeof data.ready === "boolean" ? data.ready : hasHistory ? true : live.ready,
            coachSet,
          };
          const previousWeights = readWeightsFile();
          const merged = weights ? mergeWeightsFile(previousWeights, weights) : null;
          if (merged && !writeWeightsFile(merged)) return false;
          const previousLevel = readLevelFile();
          const mergedLevel = level ? mergeLevelFile(previousLevel, level) : null;
          if (mergedLevel && !writeLevelFile(mergedLevel)) {
            if (weights) restoreWeightsFile(previousWeights);
            return false;
          }
          const wrote = save(persisted(next), true);
          const finish = (ok: boolean) => {
            if (!ok) {
              if (weights) restoreWeightsFile(previousWeights);
              if (level) restoreLevelFile(previousLevel);
              const toast = saveProblem === "newer" ? NEWER_TOAST : saveProblem === "stale" ? STALE_TOAST : "";
              if (toast) set({ toast });
              return false;
            }
            const kept = new Set<string>([
              ...fileIds(coachLogs(mergedCoaches)),
              ...fileIds(draftAsLog(mergedCoaches)),
              ...extraBackupIds(mergedCoaches),
            ]);
            dropFiles(coachLogs(before), [...coachLogs(mergedCoaches), ...draftAsLog(mergedCoaches)], kept);
            const jobs: Promise<void>[] = [];
            for (const coach of Object.values(before)) {
              if (coach.photoId && !kept.has(coach.photoId)) jobs.push(deleteFile(coach.photoId));
              for (const id of shotIds(coach)) if (!kept.has(id)) jobs.push(deleteFile(id));
              for (const id of tirePhotoIds(coach.tires)) if (!kept.has(id)) jobs.push(deleteFile(id));
              for (const file of coach.logDraft?.files ?? []) if (!kept.has(file.id)) jobs.push(deleteFile(file.id));
            }
            trackDrop(Promise.all(jobs));
            set({
              coaches: mergedCoaches,
              modelId,
              ...active,
              accepted: next.accepted,
              ready: next.ready,
              coachSet: next.coachSet,
              keptRaw: "",
            });
            return true;
          };
          return wrote instanceof Promise ? wrote.then(finish) : finish(wrote);
        }),
    };
  },
  dismissHint: () => {
    commit({ hint: false });
  },
  dismissInstall: () => {
    commit({ installHint: false });
  },
  dismissCopyNudge: () => {
    commit((live) => ({ copyNudge: { edits: recordEdits(live), iso: todayIso() } }));
  },
  acceptDisclaimer: () => {
    commit({ accepted: true });
  },
  markDone: async (taskId, title) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task?.cadence.type === "miles" && !(get().odometer > 0)) {
      get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
      return;
    }
    const iso = todayIso();
    const id = crypto.randomUUID();
    const origin = get().modelId;
    let prev: DoneMark | undefined;
    let prevWheel: number | null = null;
    let prevAck = 0;
    let dropped: LogEntry | undefined;
    let needMiles = false;
    const ok = await commit((live) => {
      if (live.modelId !== origin) return null;
      if (task?.cadence.type === "miles" && !(live.odometer > 0)) {
        needMiles = true;
        return null;
      }
      prev = live.done[taskId];
      prevWheel = live.wheelOff;
      prevAck = live.lugAck;
      const miles = live.odometer;
      let note = title;
      let wheelOff = prevWheel;
      let lugAck = prevAck;
      if (taskId === "retorque") {
        const start = retorqueOrigin(prevWheel, miles, Boolean(prev), prevAck);
        const stage = start == null ? null : nextLugStage(prevAck);
        if (stage == null || stage >= 50) {
          wheelOff = null;
          lugAck = 0;
          if (stage != null) note = `${title}, ${stage} mi check`;
        } else {
          note = `${title}, ${stage} mi check`;
          lugAck = stage;
          wheelOff = start === 0 ? null : start;
        }
      }
      dropped = live.log.length >= LOG_MAX ? live.log[live.log.length - 1] : undefined;
      const log = [{ id, iso, miles, note, taskId }, ...live.log].slice(0, LOG_MAX);
      return { done: { ...live.done, [taskId]: { iso, miles } }, log, wheelOff, lugAck };
    });
    if (!ok) {
      if (needMiles) get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
      return;
    }
    const lost = dropped;
    get().offerUndo(
      "Logged",
      () => {
        commit((live) => {
          if (live.modelId !== origin) return null;
          const done = { ...live.done };
          if (prev) done[taskId] = prev;
          else delete done[taskId];
          let log = live.log.filter((row) => row.id !== id);
          if (lost && !log.some((row) => row.id === lost.id)) log = [...log, lost];
          return { done, log, wheelOff: prevWheel, lugAck: prevAck };
        });
      },
      () => {
        if (lost && !get().log.some((row) => row.id === lost.id)) dropFiles([lost], get().log);
      },
    );
  },
  setDoneDate: async (taskId, iso) => {
    if (!realDay(iso)) return;
    const age = daysBetween(iso, todayIso());
    if (age == null || age < 0) {
      get().flash("That date is ahead of today.");
      return;
    }
    if (age > 365 * 40) {
      get().flash("That date is too far back.");
      return;
    }
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const milesOnly = task.cadence.type === "miles" && !task.cadence.alsoDays;
    if (milesOnly && !get().done[taskId] && !(get().odometer > 0)) {
      get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
      return;
    }
    const origin = get().modelId;
    const lineId = crypto.randomUUID();
    let prev: DoneMark | undefined;
    let prevLog: LogEntry[] = [];
    let dropped: LogEntry[] = [];
    let changed = false;
    let needMiles = false;
    const ok = await commit((live) => {
      if (live.modelId !== origin) return null;
      prev = live.done[taskId];
      if (prev?.iso === iso) return {};
      if (milesOnly && !prev && !(live.odometer > 0)) {
        needMiles = true;
        return null;
      }
      const miles = prev?.miles ?? live.odometer;
      const done = { ...live.done, [taskId]: { iso, miles, ...(prev?.note ? { note: prev.note } : {}) } };
      const linked = prev ? live.log.find((entry) => entry.taskId === taskId && entry.iso === prev!.iso) : undefined;
      const line: LogEntry = linked
        ? { ...linked, iso, miles }
        : { id: lineId, iso, miles, note: prev ? "Date changed" : "Start date", job: task.title, taskId };
      prevLog = live.log;
      const packed = pushLog(linked ? live.log.filter((entry) => entry.id !== linked.id) : live.log, [line]);
      dropped = packed.dropped;
      changed = true;
      return { done, log: packed.log };
    });
    if (!ok || !changed) {
      if (needMiles) get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
      return;
    }
    get().offerUndo(
      "Date set",
      () => {
        commit((live) => {
          if (live.modelId !== origin) return null;
          const done = { ...live.done };
          if (prev) done[taskId] = prev;
          else delete done[taskId];
          return { done, log: prevLog };
        });
      },
      () => {
        if (dropped.length && !dropped.every((entry) => get().log.some((item) => item.id === entry.id))) dropFiles(dropped, get().log);
      },
    );
  },
  setStartDates: async (taskIds, iso) => {
    if (!realDay(iso)) return;
    const age = daysBetween(iso, todayIso());
    if (age == null || age < 0) {
      get().flash("That date is ahead of today.");
      return;
    }
    if (age > 365 * 40) {
      get().flash("That date is too far back.");
      return;
    }
    const origin = get().modelId;
    let prev: Record<string, DoneMark> = {};
    let prevLog: LogEntry[] = [];
    let dropped: LogEntry[] = [];
    let started = 0;
    let none = false;
    const ok = await commit((live) => {
      if (live.modelId !== origin) return null;
      const done = { ...live.done };
      const lines: LogEntry[] = [];
      const miles = live.odometer;
      for (const taskId of taskIds) {
        if (!safeKey(taskId) || done[taskId]) continue;
        const task = tasks.find((item) => item.id === taskId);
        if (!task || task.cadence.type === "trip") continue;
        const milesOnly = task.cadence.type === "miles" && !task.cadence.alsoDays;
        if (milesOnly) continue;
        done[taskId] = { iso, miles };
        lines.push({ id: crypto.randomUUID(), iso, miles, note: "Start date", job: task.title, taskId });
      }
      if (!lines.length) {
        none = true;
        return null;
      }
      prev = live.done;
      prevLog = live.log;
      const packed = pushLog(live.log, lines);
      dropped = packed.dropped;
      started = lines.length;
      return { done, log: packed.log };
    });
    if (!ok) {
      if (none) get().flash("Those jobs already have a start date.");
      return;
    }
    get().offerUndo(
      `Started ${started} ${started === 1 ? "job" : "jobs"}`,
      () => {
        commit((live) => (live.modelId === origin ? { done: prev, log: prevLog } : null));
      },
      () => {
        if (dropped.length && !dropped.every((entry) => get().log.some((item) => item.id === entry.id))) dropFiles(dropped, get().log);
      },
    );
  },
  clearDone: async (taskId) => {
    const origin = get().modelId;
    if (!get().done[taskId]) return;
    if (!(await commit((live) => {
      if (live.modelId !== origin || !live.done[taskId]) return null;
      const done = { ...live.done };
      delete done[taskId];
      const lugAck = taskId === "retorque" ? previousLugAck(live.lugAck) : live.lugAck;
      return { done, lugAck };
    }))) return;
    get().flash("Mark cleared");
  },
  setDoneNote: async (taskId, note) => {
    const text = note.trim().slice(0, 200);
    const origin = get().modelId;
    await commit((live) => {
      if (live.modelId !== origin) return null;
      const prev = live.done[taskId];
      if (!prev || (prev.note ?? "") === text) return {};
      return { done: { ...live.done, [taskId]: text ? { ...prev, note: text } : { iso: prev.iso, miles: prev.miles } } };
    });
  },
  startWheelOff: async () => {
    if (!(get().odometer > 0)) return;
    if (!(await commit((live) => (live.odometer > 0 ? { wheelOff: live.odometer, lugAck: 0 } : null)))) return;
    get().flash("Re-torque countdown started");
  },
  clearWheelOff: () => {
    commit({ wheelOff: null, lugAck: 0 });
  },
  toggleCheck: (listId, itemId) => {
    commit((live) => {
      const checks = { ...live.checks };
      const list = { ...(checks[listId] || {}) };
      list[itemId] = !list[itemId];
      checks[listId] = list;
      return { checks, listDone: stampList(listId, checks, live.listDone) };
    });
  },
  clearList: (listId) => {
    commit((live) => {
      const checks = { ...live.checks, [listId]: {} };
      const listDone = { ...live.listDone };
      delete listDone[listId];
      return { checks, listDone };
    });
  },
  addLog: async (note, files, job, keepDraft, when) => {
    const attached = (files ?? []).filter((f) => f.id && f.name && f.mime).slice(0, 6);
    const text = note.trim();
    const named = (job ?? "").trim().slice(0, 80);
    const service = readService(when?.detail);
    const hasService = serviceText(service);
    if (!text && !named && attached.length === 0 && !hasService) return false;
    let iso = todayIso();
    if (when?.iso) {
      if (!realDay(when.iso)) {
        get().flash("Use a real date");
        return false;
      }
      iso = when.iso;
    }
    if (when && typeof when.miles === "number") {
      if (!Number.isFinite(when.miles) || when.miles < 0 || when.miles > MILES_MAX) {
        get().flash("Miles should be a number");
        return false;
      }
    }
    const chosen = when?.taskId ? tasks.find((task) => task.id === when.taskId) : undefined;
    const task = chosen ?? (named ? taskFromJob(named) : null);
    const entryId = crypto.randomUUID();
    const origin = get().modelId;
    let toast = "";
    let prevDone: Record<string, DoneMark> = {};
    let prevLog: LogEntry[] = [];
    let wroteLog: LogEntry[] = [];
    let dropped: LogEntry[] = [];
    const ok = await commit((live) => {
      if (live.modelId !== origin) return null;
      const miles = when && typeof when.miles === "number" ? Math.round(when.miles) : live.odometer;
      const entry: LogEntry = {
        id: entryId,
        iso,
        miles,
        note: text || (named ? "" : attached.length === 1 ? attached[0].name.replace(/\.[^.]+$/, "") : `${attached.length} files`),
        job: named || undefined,
        files: attached.length ? attached : undefined,
        ...service,
      };
      if (task) {
        entry.taskId = task.id;
        if (!entry.job) entry.job = task.title;
      }
      prevDone = live.done;
      prevLog = live.log;
      let done = live.done;
      toast = "";
      if (task && task.cadence.type !== "trip") {
        const milesOnly = task.cadence.type === "miles" && !task.cadence.alsoDays;
        if (milesOnly && !(miles > 0)) toast = "Saved in the log. Set trailer miles before this job can move the schedule.";
        else if (iso > todayIso()) toast = "Saved. That date is ahead of today, so the schedule was not moved.";
        else {
          const nextMark = markFromService(live.done[task.id], iso, miles, todayIso());
          if (nextMark) done = { ...live.done, [task.id]: nextMark };
          else if (live.done[task.id]) toast = "Saved. The schedule already has a later date.";
        }
      }
      const packed = pushLog(live.log, [entry]);
      dropped = packed.dropped;
      wroteLog = packed.log;
      return done === live.done ? { log: packed.log } : { log: packed.log, done };
    });
    if (!ok) return false;
    if (task) {
      get().offerUndo(
        toast || "Saved. The schedule uses this date.",
        () => {
          commit((live) => {
            if (live.modelId !== origin) return null;
            let restored = live.log.filter((item) => item.id !== entryId);
            for (const old of dropped) if (!restored.some((item) => item.id === old.id)) restored = [...restored, old];
            return { log: restored.slice(0, LOG_MAX), done: prevDone };
          });
        },
        () => {
          if (dropped.length && !dropped.every((old) => get().log.some((item) => item.id === old.id))) dropFiles(dropped, get().log);
        },
      );
    } else {
      dropFiles(prevLog, wroteLog);
    }
    if (!keepDraft) get().setLogDraft(null);
    return true;
  },
  setLogDraft: (draft) => {
    const next = draft && (draft.note.trim() || draft.job.trim() || draft.files.length > 0)
      ? { note: draft.note.slice(0, 800), job: draft.job.trim().slice(0, 80), files: draft.files.slice(0, 6) }
      : null;
    const cur = get().logDraft;
    if (!next && !cur) return true;
    if (next && cur && next.note === cur.note && next.job === cur.job && next.files.length === cur.files.length && next.files.every((file, i) => file.id === cur.files[i]?.id && file.name === cur.files[i]?.name)) {
      return true;
    }
    return commit({ logDraft: next });
  },
  setWinterPlace: (place) => {
    const cur = get().winterPlace;
    if (JSON.stringify(cur) === JSON.stringify(place)) return;
    commit({ winterPlace: place });
  },
  updateLog: async (id, note, when) => {
    const text = note.trim().slice(0, 800);
    const prev = get().log.find((entry) => entry.id === id);
    if (!text && !prev?.job && !prev?.files?.length && !serviceText(when?.detail) && !serviceText(prev)) {
      get().flash("The note needs some text");
      return false;
    }
    if (!prev) return false;
    let iso = prev.iso;
    if (when?.iso) {
      if (!realDay(when.iso)) {
        get().flash("Use a real date");
        return false;
      }
      const age = daysBetween(when.iso, todayIso());
      if (age == null || age < 0) {
        get().flash("That date is ahead of today.");
        return false;
      }
      iso = when.iso;
    }
    let miles = prev.miles;
    if (when && typeof when.miles === "number") {
      if (!Number.isFinite(when.miles) || when.miles < 0 || when.miles > MILES_MAX) {
        get().flash("Miles have to be from 0 to 1,000,000.");
        return false;
      }
      miles = Math.round(when.miles);
    }
    const service = when?.detail ? readService(when.detail) : readService(prev);
    const nextEntry: LogEntry = { ...prev, note: text, iso, miles, work: service.work, provider: service.provider, parts: service.parts, partsCost: service.partsCost, laborCost: service.laborCost, cost: service.cost, warranty: service.warranty, tech: service.tech, phone: service.phone };
    if (JSON.stringify({ ...prev, id: "" }) === JSON.stringify({ ...nextEntry, id: "" })) return true;
    const taskId = prev.taskId;
    const origin = get().modelId;
    const prevMark = taskId ? get().done[taskId] : undefined;
    const movesMark = !!taskId && !!prevMark && prevMark.iso === prev.iso && prevMark.miles === prev.miles;
    if (!(await commit((live) => {
      if (live.modelId !== origin || !live.log.some((entry) => entry.id === id)) return null;
      const log = live.log.map((entry) => (entry.id === id ? nextEntry : entry));
      if (!movesMark || !taskId) return { log };
      const mark = live.done[taskId];
      const nextMark = markAfterOwnedEdit(
        mark,
        { iso: prev.iso, miles: prev.miles },
        log.filter((entry) => entry.taskId === taskId),
      );
      if (nextMark === undefined || (nextMark && nextMark.iso === mark?.iso && nextMark.miles === mark?.miles && nextMark.note === mark?.note)) return { log };
      if (!nextMark) {
        const done = { ...live.done };
        delete done[taskId];
        return { log, done };
      }
      return { log, done: { ...live.done, [taskId]: nextMark } };
    }))) return false;
    get().offerUndo("Note updated", () => {
      commit((live) => {
        if (live.modelId !== origin) return null;
        const log = live.log.map((entry) => (entry.id === id ? prev : entry));
        if (!movesMark || !taskId) return { log };
        const done = { ...live.done };
        if (prevMark) done[taskId] = prevMark;
        else delete done[taskId];
        return { log, done };
      });
    });
    return true;
  },
  removeLog: async (id) => {
    if (!get().log.some((entry) => entry.id === id)) return;
    const origin = get().modelId;
    const found: LogEntry[] = [];
    let index = 0;
    let prevDone: Record<string, DoneMark> = {};
    const ok = await commit((live) => {
      if (live.modelId !== origin) return null;
      const at = live.log.findIndex((item) => item.id === id);
      if (at < 0) return null;
      const row = live.log[at];
      found[0] = row;
      index = at;
      const next = live.log.filter((item) => item.id !== id);
      prevDone = live.done;
      let done = live.done;
      if (row.taskId && tasks.some((task) => task.id === row.taskId && task.cadence.type !== "trip")) {
        const mark = live.done[row.taskId];
        if (mark && mark.iso === row.iso && mark.miles === row.miles) {
          const latest = latestService(next.filter((item) => item.taskId === row.taskId));
          done = { ...live.done };
          if (latest) done[row.taskId] = { iso: latest.iso, miles: latest.miles, ...(mark.note ? { note: mark.note } : {}) };
          else delete done[row.taskId];
        }
      }
      return done === live.done ? { log: next } : { log: next, done };
    });
    const entry = found[0];
    if (!ok || !entry) return;
    const at = index;
    const doneBefore = prevDone;
    get().offerUndo(
      "Removed",
      () => {
        let current: LogEntry[] | null = null;
        let capped: LogEntry[] = [];
        void Promise.resolve(
          commit((live) => {
            if (live.modelId !== origin || live.log.some((item) => item.id === entry.id)) return {};
            current = live.log;
            const log = live.log.slice();
            log.splice(Math.min(at, log.length), 0, entry);
            capped = log.slice(0, LOG_MAX);
            return { log: capped, done: doneBefore };
          }),
        ).then((written) => {
          if (written && current) dropFiles(current, capped);
        }).catch(() => undefined);
      },
      () => {
        if (!get().log.some((item) => item.id === entry.id)) dropFiles([entry], []);
      },
    );
  },
  removeLogFile: async (entryId, fileId) => {
    const origin = get().modelId;
    let prev: LogEntry[] = [];
    let next: LogEntry[] = [];
    if (!(await commit((live) => {
      if (live.modelId !== origin) return null;
      prev = live.log;
      next = live.log.map((e) => {
        if (e.id !== entryId || !e.files) return e;
        const files = e.files.filter((f) => f.id !== fileId);
        return { ...e, files: files.length ? files : undefined };
      });
      return { log: next };
    }))) return;
    dropFiles(prev, next);
  },
  addNote: (text) => {
    const body = text.trim().slice(0, 2000);
    if (!body) return false;
    const origin = get().modelId;
    return commit((live) => {
      if (live.modelId !== origin) return null;
      if (live.notes.length >= 100) {
        queueMicrotask(() => useApp.getState().flash("100 notes is the limit. Remove one first."));
        return null;
      }
      return { notes: [{ id: crypto.randomUUID(), iso: todayIso(), text: body }, ...live.notes] };
    });
  },
  updateNote: async (id, text) => {
    const body = text.trim().slice(0, 2000);
    const prev = get().notes.find((note) => note.id === id);
    if (!body) {
      get().flash("The note needs some text");
      return false;
    }
    if (!prev || prev.text === body) return true;
    const origin = get().modelId;
    if (!(await commit((live) => {
      if (live.modelId !== origin) return null;
      if (!live.notes.some((note) => note.id === id)) return null;
      return { notes: live.notes.map((note) => (note.id === id ? { ...note, text: body, iso: todayIso() } : note)) };
    }))) return false;
    get().offerUndo("Note updated", () => {
      commit((live) => {
        if (live.modelId !== origin) return null;
        return { notes: live.notes.map((note) => (note.id === id ? prev : note)) };
      });
    });
    return true;
  },
  removeNote: async (id) => {
    const note = get().notes.find((item) => item.id === id);
    if (!note) return;
    const origin = get().modelId;
    if (!(await commit((live) => {
      if (live.modelId !== origin || !live.notes.some((item) => item.id === id)) return null;
      return { notes: live.notes.filter((item) => item.id !== id) };
    }))) return;
    get().offerUndo("Removed", () => {
      commit((live) => {
        if (live.modelId !== origin || live.notes.some((item) => item.id === note.id)) return {};
        return { notes: [note, ...live.notes].slice(0, 100) };
      });
    });
  },
  push: (screen) => {
    const tab = tabFor(screen);
    const { trail, cursor } = get();
    const next = trail.slice(0, cursor + 1);
    next.push({ screen, tab });
    const sized = next.length > MAX_TRAIL ? next.slice(next.length - MAX_TRAIL) : next;
    set({ trail: sized, cursor: sized.length - 1, activeTab: tab, searching: false });
  },
  back: () => {
    const { trail, cursor } = get();
    if (cursor <= 0) return;
    const next = cursor - 1;
    set({ cursor: next, activeTab: trail[next].tab, searching: false });
    if (roots.has(trail[next].screen.name)) get().setWinterPlace(null);
  },
  forward: () => {
    const { trail, cursor } = get();
    if (cursor >= trail.length - 1) return;
    const next = cursor + 1;
    set({ cursor: next, activeTab: trail[next].tab, searching: false });
  },
  tab: (name) => {
    if (name === "home") {
      const { cursor, activeTab, trail } = get();
      const atHomeRoot = activeTab === "home" && cursor === 0 && trail[cursor]?.screen.name === "home";
      if (!atHomeRoot) {
        set({
          trail: [{ screen: { name: "home" }, tab: "home" }],
          cursor: 0,
          activeTab: "home",
          searching: false,
          picker: false,
        });
        get().setWinterPlace(null);
      }
      return;
    }
    const { trail, cursor, activeTab } = get();
    const open = (nextTrail: Frame[], nextCursor: number, nextTab: TabName) => {
      set({ trail: nextTrail, cursor: nextCursor, activeTab: nextTab, searching: false, picker: false });
      if (roots.has(nextTrail[nextCursor].screen.name)) get().setWinterPlace(null);
    };
    if (name === activeTab) {
      let i = cursor;
      while (i > 0 && trail[i - 1].tab === name) i -= 1;
      if (trail[i].screen.name === name) {
        if (i !== cursor) open(trail, i, name);
        return;
      }
      const next = trail.slice(0, i);
      next.push({ screen: { name }, tab: name });
      open(next, next.length - 1, name);
      return;
    }
    const next = trail.slice(0, cursor + 1);
    next.push({ screen: { name }, tab: name });
    const sized = next.length > MAX_TRAIL ? next.slice(next.length - MAX_TRAIL) : next;
    open(sized, sized.length - 1, name);
  },
  setPicker: (picker) => set({ picker }),
  setSearching: (searching) => set({ searching }),
  setSystem: (systemFilter) => {
    set({ systemFilter });
    commit({ systemFilter });
  },
  setPartsBook: (partsBook) => set({ partsBook }),
  setGuideQuery: (guideQuery) => set({ guideQuery }),
  noteBackup: (bytes) => {
    const size = typeof bytes === "number" && Number.isFinite(bytes) && bytes > 0 ? Math.round(bytes) : get().lastBackupBytes;
    commit({ lastBackup: todayIso(), lastBackupBytes: size });
  },
  flash: (toast) => {
    undoToken += 1;
    const commit = get().undoCommit;
    set({ toast, undo: null, undoCommit: null });
    commit?.();
    const token = undoToken;
    if (typeof window === "undefined") return;
    window.setTimeout(() => {
      if (token !== undoToken) return;
      if (get().toast === toast) set({ toast: "" });
    }, 1600);
  },
  offerUndo: (toast, revert, commitUndo) => {
    const origin = get().modelId;
    undoToken += 1;
    const previous = get().undoCommit;
    set({
      toast,
      undo: () => {
        if (get().modelId !== origin) return;
        revert();
      },
      undoCommit: commitUndo ?? null,
    });
    previous?.();
    const token = undoToken;
    globalThis.setTimeout(() => {
      if (token !== undoToken) return;
      const pending = get().undoCommit;
      set({ toast: "", undo: null, undoCommit: null });
      pending?.();
    }, 5000);
  },
  runUndo: () => {
    const revert = get().undo;
    undoToken += 1;
    set({ toast: "", undo: null, undoCommit: null });
    revert?.();
  },
}));

export function isRoot(screen: Screen) {
  return roots.has(screen.name);
}

export const MAX_BACKUP_TEXT = 80 * 1024 * 1024;
export const MAX_IMPORT_COACHES = 20;
export const MAX_BACKUP_FILES = 200;
export const MAX_BACKUP_B64 = 21_000_000;
const RETORQUE_MILES = [5, 10, 25, 50] as const;
/** Keep a missed 50-mile check on screen for another 100 miles, then stop. */
const RETORQUE_KEEP = 150;
let undoToken = 0;

function dropUndo() {
  undoToken += 1;
  const pending = useApp.getState().undoCommit;
  useApp.setState({ toast: "", undo: null, undoCommit: null });
  pending?.();
}

export function readLugAck(value: unknown): number {
  return value === 5 || value === 10 || value === 25 || value === 50 ? value : 0;
}

function keptLugAck(wheelOff: number | null, odo: number, value: unknown): number {
  const ack = readLugAck(value);
  if (!ack) return 0;
  if (wheelOff != null) return ack;
  if (odo > 0 && odo < RETORQUE_KEEP) return ack;
  return 0;
}

function settleLug(wheelOff: number | null, odo: number, ack: number) {
  const kept = settledWheel(wheelOff, odo);
  if (wheelOff != null && kept == null) return { wheelOff: null, lugAck: 0 };
  return { wheelOff: kept, lugAck: keptLugAck(kept, odo, ack) };
}

function previousLugAck(ack: number): number {
  if (ack === 50) return 25;
  if (ack === 25) return 10;
  if (ack === 10) return 5;
  return 0;
}

export function settledWheel(start: unknown, odo: number): number | null {
  if (typeof start !== "number" || !Number.isFinite(start) || start < 0) return null;
  if (odo >= start + RETORQUE_KEEP) return null;
  return start;
}

export function nextLugStage(ack: number): 5 | 10 | 25 | 50 | null {
  return RETORQUE_MILES.find((miles) => miles > ack) ?? null;
}

export function retorqueDue(start: number | null, odo: number, ack = 0) {
  if (start === null) return [];
  return RETORQUE_MILES.filter((miles) => miles > ack && odo < start + miles).map((miles) => ({
    miles,
    at: start + miles,
    left: Math.max(0, start + miles - odo),
  }));
}

/** Where the 5 / 10 / 25 / 50 count starts. A trailer still near those first miles counts from 0 until a stage is marked. */
export function retorqueOrigin(wheelOff: number | null, odo: number, marked: boolean, ack = 0): number | null {
  if (!(odo > 0)) return null;
  if (ack >= 50) return null;
  if (wheelOff != null && wheelOff >= 0 && odo < wheelOff + RETORQUE_KEEP) return wheelOff;
  if (wheelOff != null) return null;
  if (marked && ack === 0) return null;
  if (odo < RETORQUE_KEEP) return 0;
  return null;
}

export function retorqueWatch(wheelOff: number | null, odo: number, marked: boolean, ack = 0) {
  const start = retorqueOrigin(wheelOff, odo, marked, ack);
  const current = start == null ? null : nextLugStage(ack);
  const upcoming = retorqueDue(start, odo, ack);
  const missed =
    start == null
      ? []
      : RETORQUE_MILES.filter((miles) => miles > ack && odo >= start + miles).map((miles) => ({
          miles,
          at: start + miles,
          left: 0,
        }));
  return { start, upcoming, missed, current };
}

function backupFiles(value: unknown, log: LogEntry[], extra: string[] = []) {
  const wanted = new Set(log.flatMap((e) => e.files?.map((f) => f.id) ?? []));
  for (const id of extra) if (id) wanted.add(id);
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const files: { id: string; mime: string; data: string }[] = [];
  for (const [id, row] of Object.entries(value as Record<string, unknown>)) {
    if (files.length >= MAX_BACKUP_FILES) break;
    if (!safeKey(id) || !wanted.has(id) || id.length > FILE_ID_MAX || !row || typeof row !== "object") continue;
    const mime = (row as { mime?: unknown }).mime;
    const data = (row as { data?: unknown }).data;
    if (typeof mime !== "string" || typeof data !== "string" || !data || data.length > MAX_BACKUP_B64) continue;
    const type = mime.toLowerCase().split(";")[0].trim();
    if (type !== "image/jpeg" && type !== "image/png" && type !== "image/gif" && type !== "image/webp" && type !== "application/pdf") continue;
    files.push({ id, mime: type, data });
  }
  return files;
}

export function dueOf(
  cadence: Cadence,
  mark: DoneMark | undefined,
  odo: number,
): "trip" | "unset" | "ok" | "due" {
  if (cadence.type === "trip") return "trip";
  if (!mark) return "unset";
  const today = todayIso();
  const dateDue = (iso: string | null) => {
    if (!iso) return null;
    return today >= iso;
  };
  if (cadence.type === "days") {
    const due = dateDue(shiftIso(mark.iso, cadence.every));
    return due == null ? "unset" : due ? "due" : "ok";
  }
  if (cadence.type === "years") {
    const due = dateDue(shiftYears(mark.iso, cadence.every));
    return due == null ? "unset" : due ? "due" : "ok";
  }
  if (cadence.type === "season") {
    const due = dateDue(shiftIso(mark.iso, 180));
    return due == null ? "unset" : due ? "due" : "ok";
  }
  const byMiles = odo > 0 && mark.miles > 0 && odo - mark.miles >= cadence.every;
  const byDays = cadence.alsoDays ? dateDue(shiftIso(mark.iso, cadence.alsoDays)) : false;
  if (byDays == null && !byMiles) return "unset";
  return byMiles || byDays ? "due" : "ok";
}

function asListDone(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, string> = {};
  for (const [id, iso] of Object.entries(value)) {
    if (!safeKey(id) || typeof iso !== "string" || !realDay(iso) || id.length === 0 || id.length >= 40) continue;
    out[id] = iso;
  }
  return out;
}

function stampList(listId: string, checks: Record<string, Record<string, boolean>>, listDone: Record<string, string>) {
  const next = { ...listDone };
  const list = checklistById(listId);
  const items = list?.groups.flatMap((group) => group.items) ?? [];
  const state = checks[listId] || {};
  if (items.length > 0 && items.every((item) => state[item.id])) next[listId] = todayIso();
  else delete next[listId];
  return next;
}

function ageDays(iso: string) {
  return daysBetween(iso, todayIso());
}

function nextDateIso(cadence: Cadence, mark: DoneMark): string | null {
  if (cadence.type === "days") return shiftIso(mark.iso, cadence.every);
  if (cadence.type === "years") return shiftYears(mark.iso, cadence.every);
  if (cadence.type === "season") return shiftIso(mark.iso, 180);
  if (cadence.type === "miles" && cadence.alsoDays) return shiftIso(mark.iso, cadence.alsoDays);
  return null;
}

/** The one calendar date for this job. Null for trip items, mile-only jobs, and anything not yet marked. */
export function calendarDate(cadence: Cadence, mark: DoneMark | undefined): string | null {
  if (!mark) return null;
  if (cadence.type === "trip") return null;
  if (cadence.type === "miles" && !cadence.alsoDays) return null;
  return nextDateIso(cadence, mark);
}

function nextMilesLeft(cadence: Cadence, mark: DoneMark, odo: number): number | null {
  if (cadence.type !== "miles" || !(mark.miles > 0) || !(odo > 0)) return null;
  return mark.miles + cadence.every - odo;
}

export function dueWhy(cadence: Cadence, mark: DoneMark | undefined, odo: number) {
  const state = dueOf(cadence, mark, odo);
  const label = cadenceLabel(cadence);
  if (state === "unset" && cadence.type === "miles") return `No start mileage · ${label}`;
  if (state === "unset") return `No date yet · ${label}`;
  if (state === "ok") return `OK · ${label}`;
  if (state !== "due" || !mark) return label;
  const age = ageDays(mark.iso);
  if (cadence.type === "miles") {
    const miles = odo > 0 && mark.miles > 0 ? odo - mark.miles : 0;
    const byMiles = mark.miles > 0 && miles >= cadence.every;
    const byDays = cadence.alsoDays != null && age != null && age >= cadence.alsoDays;
    if (byMiles && byDays) return `Due · ${miles.toLocaleString()} miles and ${age} days`;
    if (byMiles) return `Due · ${miles.toLocaleString()} miles`;
    if (byDays && age != null) return `Due · ${age} days`;
  }
  if (age != null && age >= 0) return `Due · ${age} days`;
  return `Due · ${label}`;
}

/** The next mile reading or calendar date from the last mark. Null once that limit has passed. */
export function nextDue(cadence: Cadence, mark: DoneMark | undefined, odo: number): string | null {
  if (cadence.type === "trip") return null;
  if (!mark || dueOf(cadence, mark, odo) !== "ok") return null;
  const when = nextDateIso(cadence, mark);
  const dateText = when ? formatWhen(when) : null;
  if (cadence.type === "days" || cadence.type === "years" || cadence.type === "season") {
    return dateText ? `Next ${dateText}` : null;
  }
  if (cadence.type !== "miles") return null;
  const left = nextMilesLeft(cadence, mark, odo);
  const at = mark.miles > 0 ? mark.miles + cadence.every : null;
  const mileText =
    at == null || left == null || left <= 0
      ? null
      : `Next ${at.toLocaleString()} mi · ${left.toLocaleString()} left`;
  if (dateText && mileText) return `${mileText} or ${dateText}`;
  return mileText ?? (dateText ? `Next ${dateText}` : null);
}

/** Last completion and the next date and miles. Nulls stay off the card. Intervals are the ones already on the job. */
export function serviceWindow(cadence: Cadence, mark: DoneMark | undefined, _odo: number) {
  const lastDate = mark ? formatWhen(mark.iso) : null;
  const lastMiles = mark && mark.miles > 0 ? `${mark.miles.toLocaleString()} mi` : null;
  const when = mark ? nextDateIso(cadence, mark) : null;
  const nextDate = when ? formatWhen(when) : null;
  let nextMiles: string | null = null;
  if (cadence.type === "miles") {
    if (mark && mark.miles > 0) nextMiles = `${(mark.miles + cadence.every).toLocaleString()} mi`;
  }
  return { lastDate, lastMiles, nextDate, nextMiles };
}

/** Overdue, the 30-day window, the 500-mile window, a recent mark, or no mark. A job is in only one of these. */
export function maintainBand(
  cadence: Cadence,
  mark: DoneMark | undefined,
  odo: number,
): "overdue" | "days" | "miles" | "recent" | "none" | "later" | "trip" {
  if (cadence.type === "trip") return "trip";
  if (dueOf(cadence, mark, odo) === "due") return "overdue";
  if (!mark) return "none";
  const left = soonLeft(cadence, mark, odo);
  if (left?.days != null) return "days";
  if (left?.miles != null) return "miles";
  const age = daysBetween(mark.iso, todayIso());
  if (age != null && age >= 0 && age <= 90) return "recent";
  return "later";
}

/**
 * The job that should sit on the Next due card.
 * Overdue first, then the soonest date still ahead. Trip items, including lug re-torque, are not in this list.
 */
export function pickNextTask(
  rows: { id: string; cadence: Cadence; mark: DoneMark | undefined }[],
  odo: number,
): { id: string; why: "due" | "soon" | "next" } | null {
  let best: { id: string; why: "due" | "soon" | "next"; key: number } | null = null;
  for (const row of rows) {
    const rank = rankDue(row.cadence, row.mark, odo);
    if (!rank) continue;
    if (!best || rank.key < best.key) best = { id: row.id, why: rank.why, key: rank.key };
  }
  return best ? { id: best.id, why: best.why } : null;
}

function rankDue(cadence: Cadence, mark: DoneMark | undefined, odo: number): { why: "due" | "soon" | "next"; key: number } | null {
  if (cadence.type === "trip") return null;
  if (!mark) return null;
  const state = dueOf(cadence, mark, odo);
  if (state !== "due" && state !== "ok") return null;
  const when = nextDateIso(cadence, mark);
  const daysLeft = when ? daysBetween(todayIso(), when) : null;
  const milesLeft = nextMilesLeft(cadence, mark, odo);
  if (state === "due") {
    const pastDays = daysLeft != null && daysLeft <= 0 ? -daysLeft : 0;
    const pastMiles = milesLeft != null && milesLeft <= 0 ? -milesLeft : 0;
    return { why: "due", key: -(pastDays * 1_000_000 + pastMiles) };
  }
  const dayScore = daysLeft != null && daysLeft > 0 ? daysLeft : null;
  const mileScore = milesLeft != null && milesLeft > 0 ? milesLeft : null;
  if (dayScore == null && mileScore == null) return null;
  const why = dueSoon(cadence, mark, odo) ? "soon" : "next";
  if (dayScore != null) return { why, key: 1_000_000 + dayScore };
  return { why, key: 2_000_000 + (mileScore ?? 0) };
}

/**
 * Still inside a longer interval, and inside the last 30 days or the last 500 miles.
 * A monthly job is not "soon" the day it is marked. It stays OK until it is due.
 */
export function dueSoon(cadence: Cadence, mark: DoneMark | undefined, odo: number) {
  return soonLeft(cadence, mark, odo) != null;
}

/** What put the job in the soon window. Null when it is not in that window. */
export function soonWhy(cadence: Cadence, mark: DoneMark | undefined, odo: number) {
  const left = soonLeft(cadence, mark, odo);
  if (!left) return null;
  const parts: string[] = [];
  if (left.days != null) parts.push(`${left.days} days left`);
  if (left.miles != null) parts.push(`${left.miles.toLocaleString()} miles left`);
  return parts.join(" · ");
}

function soonLeft(cadence: Cadence, mark: DoneMark | undefined, odo: number): { days: number | null; miles: number | null } | null {
  if (dueOf(cadence, mark, odo) !== "ok" || !mark) return null;
  const span =
    cadence.type === "days" ? cadence.every : cadence.type === "years" ? cadence.every * 365 : cadence.type === "season" ? 180 : cadence.type === "miles" ? cadence.alsoDays ?? 0 : 0;
  const when = nextDateIso(cadence, mark);
  const left = when ? daysBetween(todayIso(), when) : null;
  const days = span > 30 && left != null && left > 0 && left <= 30 ? left : null;
  if (cadence.type !== "miles") return days == null ? null : { days, miles: null };
  const milesLeft = nextMilesLeft(cadence, mark, odo);
  const miles = cadence.every > 500 && milesLeft != null && milesLeft > 0 && milesLeft <= 500 ? milesLeft : null;
  if (days == null && miles == null) return null;
  return { days, miles };
}

export function screenTitle(s: Screen): string {
  switch (s.name) {
    case "home":
      return "RivetCare";
    case "fix":
      return "Fix";
    case "symptom":
      return "Check";
    case "care":
      return "Maintain";
    case "procedure":
      return "Procedure";
    case "procedures":
      return "Procedures";
    case "parts":
      return "Parts";
    case "part":
      return "Part";
    case "more":
      return "Library";
    case "checklist":
      return "Checklist";
    case "lists":
      return "Checklists";
    case "specs":
      return "Glovebox card";
    case "weights":
      return "Weights";
    case "level":
      return "Trailer level";
    case "tires":
      return "Tires";
    case "supplies":
      return s.part === "battery" ? "Batteries" : s.part === "propane" ? "Propane cylinders" : "Cylinders";
    case "service":
      return "Service";
    case "recalls":
      return "Recalls";
    case "codes":
      return "Fault codes";
    case "log":
      return "Service log";
    case "records":
      return "Records";
    case "backup":
      return "Backup";
    case "privacy":
      return "Privacy";
    case "history":
      return "Owner's history";
    case "notes":
      return "Notes";
    case "desk":
      return "Shop sheet";
    case "manuals":
      return "Manuals";
    case "tools":
      return "On-board kit";
    case "about":
      return "About";
    case "printout":
      return "Print checklist";
    case "table":
      return "Checks table";
    case "flows":
      return "Flowcharts";
    case "flow":
      return "Flowchart";
    case "figures":
      return "Figures";
    case "figure":
      return "Figure";
    case "sheet":
      return "Figures";
    case "offline":
      return "Offline";
    case "support":
      return "Support";
  }
}
