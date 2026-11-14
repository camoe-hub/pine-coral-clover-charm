import { blobToBase64, getFile } from "@/lib/files";
import { useApp, type LogEntry, MAX_BACKUP_B64, MAX_BACKUP_FILES } from "@/lib/store";
import { readWeightsFile } from "@/lib/weights";
import { readLevelFile } from "@/lib/level-spans";
import { BACKUP_APP, BACKUP_VERSION } from "@/lib/backup-version";
import { backupFileName, hashStrings } from "@/lib/backup-look";
import { tirePhotoIds } from "@/lib/tires";
import { todayIso } from "@/lib/date";

function logsOf(coaches: Record<string, { log: LogEntry[] }>, currentId: string, current: LogEntry[]) {
  const all = { ...coaches, [currentId]: { log: current } };
  return Object.values(all).flatMap((coach) => coach.log);
}

export const BACKUP_NAME = "rivetcare-book-backup.json";

/** Encoded photos and PDFs stay under this so one backup can be built on a phone. */
export const BACKUP_FILE_BUDGET = 32 * 1024 * 1024;

type WantedFile = { id: string; mime: string; imagesOnly: boolean };

type BackupState = {
  modelId: string;
  coaches: Record<string, unknown>;
  odometer: number;
  done: unknown;
  checks: unknown;
  log: LogEntry[];
  notes: unknown;
  dealer: string;
  dealerAddress: string;
  hint: boolean;
  vin: string;
  wheelOff: number | null;
  lugAck: number;
  ready: boolean;
  coachSet: boolean;
  tires: unknown;
  supplies: unknown;
  plates: unknown;
  listDone: unknown;
  logDraft: { note: string; job: string; files: LogFile[] } | null;
  winterPlace: unknown;
  photoId: string | null;
  shots: Record<string, LogFile[]>;
  nickname: string;
  modelYear: number | null;
};

type LogFile = { id: string; name: string; mime: string };

/** The book without the photo blobs. The share step adds files and the scale tickets. */
export function backupHead(state: BackupState) {
  const coaches = {
    ...state.coaches,
    [state.modelId]: {
      odometer: state.odometer,
      done: state.done,
      checks: state.checks,
      log: state.log,
      notes: state.notes,
      dealer: state.dealer,
      dealerAddress: state.dealerAddress,
      vin: state.vin,
      nickname: state.nickname,
      modelYear: state.modelYear,
      wheelOff: state.wheelOff,
      lugAck: state.lugAck,
      tires: state.tires,
      supplies: state.supplies,
      plates: state.plates,
      listDone: state.listDone,
      logDraft: state.logDraft,
      winterPlace: state.winterPlace,
      photoId: state.photoId,
      shots: state.shots,
    },
  };
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    modelId: state.modelId,
    coaches,
    odometer: state.odometer,
    done: state.done,
    checks: state.checks,
    log: state.log,
    notes: state.notes,
    dealer: state.dealer,
    dealerAddress: state.dealerAddress,
    hint: state.hint,
    vin: state.vin,
    wheelOff: state.wheelOff,
    lugAck: state.lugAck,
    ready: state.ready,
    coachSet: state.coachSet,
    tires: state.tires,
    supplies: state.supplies,
    plates: state.plates,
    listDone: state.listDone,
    logDraft: state.logDraft,
    winterPlace: state.winterPlace,
    photoId: state.photoId,
    shots: state.shots,
  };
}

/** Builds the file. Saving it is a separate tap, so the phone still has the gesture. */
export async function buildBackup(): Promise<{ file: File; url: string; left: number } | null> {
  const state = useApp.getState();
  try {
    const head = backupHead(state);
    const coaches = head.coaches as Record<
      string,
      {
        log: LogEntry[];
        logDraft?: { files?: { id: string; mime: string }[] } | null;
        photoId?: string | null;
        shots?: Record<string, { id: string }[]>;
        tires?: unknown;
      }
    >;
    const wanted = wantedFiles(coaches, state.modelId, state.log);
    const parts: string[] = [JSON.stringify(head).slice(0, -1), ',"files":{'];
    let first = true;
    let used = 0;
    let kept = 0;
    let left = 0;
    for (const file of wanted) {
      if (kept >= MAX_BACKUP_FILES || used >= BACKUP_FILE_BUDGET) {
        left += 1;
        continue;
      }
      const blob = await getFile(file.id);
      const mime = blob && blob.type && blob.type !== "application/octet-stream" ? blob.type : file.mime;
      const allowed = mime.startsWith("image/") || (!file.imagesOnly && mime === "application/pdf");
      const encoded = blob ? Math.ceil(blob.size / 3) * 4 : 0;
      if (!blob || !allowed || encoded === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        continue;
      }
      if (encoded > MAX_BACKUP_B64 || used + encoded > BACKUP_FILE_BUDGET) {
        left += 1;
        await new Promise((resolve) => setTimeout(resolve, 0));
        continue;
      }
      const data = await blobToBase64(blob);
      if (data.length > MAX_BACKUP_B64 || used + data.length > BACKUP_FILE_BUDGET) {
        left += 1;
        continue;
      }
      if (!first) parts.push(",");
      first = false;
      used += data.length;
      kept += 1;
      parts.push(`${JSON.stringify(file.id)}:${JSON.stringify({ mime, data })}`);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    parts.push(`}${left > 0 ? `,"filesLeft":${left}` : ""},"weights":${JSON.stringify(readWeightsFile())},"level":${JSON.stringify(readLevelFile())}`);
    let integrity: string;
    try {
      integrity = hashStrings(parts);
    } catch {
      return null;
    }
    parts.push(`,"integrity":${JSON.stringify(integrity)}}`);
    const blob = new Blob(parts, { type: "application/json" });
    const file = new File([blob], backupFileName(todayIso()), { type: "application/json" });
    return { file, url: URL.createObjectURL(blob), left };
  } catch {
    return null;
  }
}

function wantedFiles(
  coaches: Record<string, { log: LogEntry[]; logDraft?: { files?: { id: string; mime: string }[] } | null; photoId?: string | null; shots?: Record<string, { id: string }[]>; tires?: unknown }>,
  currentId: string,
  current: LogEntry[],
): WantedFile[] {
  const list: WantedFile[] = [];
  const seen = new Set<string>();
  const add = (id: string | null | undefined, mime: string, imagesOnly: boolean) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    list.push({ id, mime, imagesOnly });
  };
  for (const entry of logsOf(coaches, currentId, current)) {
    for (const file of entry.files ?? []) add(file.id, file.mime, false);
  }
  for (const coach of Object.values(coaches)) {
    for (const file of coach.logDraft?.files ?? []) add(file.id, file.mime, false);
    add(coach.photoId, "image/jpeg", true);
    for (const shot of Object.values(coach.shots ?? {})) {
      for (const file of shot) add(file.id, "image/jpeg", true);
    }
    for (const id of tirePhotoIds(coach.tires)) add(id, "image/jpeg", true);
  }
  return list;
}
