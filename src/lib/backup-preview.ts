import { backupIntegrity, lookAtBackup, repeatedRecordIds, type BackupLook } from "@/lib/backup-look";
import { MAX_BACKUP_TEXT, useApp } from "@/lib/store";

let lastSavedBackup: File | null = null;

export function rememberSavedBackup(file: File | null) {
  lastSavedBackup = file;
}

export function lastSavedBackupFile() {
  return lastSavedBackup;
}

type Plan = { files: { id: string; mime: string; data: string }[]; notice?: string; apply: () => boolean | Promise<boolean> };

export type BackupPreview = {
  name: string;
  integrity: "ok" | "none";
  summary: BackupLook;
  plan: Plan;
  repeated: number;
  phoneService: number;
  phoneNotes: number;
};

export async function previewBackup(file: File): Promise<{ ok: true; look: BackupPreview } | { ok: false; message: string }> {
  if (file.size > MAX_BACKUP_TEXT) return { ok: false, message: "That backup is too large to restore on this phone." };
  let text = "";
  try {
    text = await file.text();
  } catch {
    return { ok: false, message: "That file could not be read." };
  }
  const integrity = backupIntegrity(text);
  if (integrity === "bad") return { ok: false, message: "This file does not match its checksum. It may be damaged. Nothing was replaced." };
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { ok: false, message: "That file is not a backup" };
  }
  const result = useApp.getState().importBackup(data);
  if (!result.ok) {
    return {
      ok: false,
      message:
        result.reason === "future"
          ? "This backup is from a newer copy of the app."
          : result.reason === "large"
            ? "That backup is too large to restore on this phone."
            : "That file is not a backup",
    };
  }
  try {
    const state = useApp.getState();
    const coaches = { ...state.coaches, [state.modelId]: { log: state.log, notes: state.notes } };
    let phoneService = 0;
    let phoneNotes = 0;
    for (const row of Object.values(coaches)) {
      const coach = row as { log?: unknown[]; notes?: unknown[] };
      phoneService += Array.isArray(coach.log) ? coach.log.length : 0;
      phoneNotes += Array.isArray(coach.notes) ? coach.notes.length : 0;
    }
    return {
      ok: true,
      look: {
        name: file.name,
        integrity,
        summary: lookAtBackup(data, file.size),
        plan: result,
        repeated: repeatedRecordIds(data),
        phoneService,
        phoneNotes,
      },
    };
  } catch {
    return { ok: false, message: "That file is not a backup" };
  }
}
