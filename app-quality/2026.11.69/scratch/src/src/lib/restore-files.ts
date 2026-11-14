import { backupBlob, getFile, putFile } from "@/lib/files";
import { noteRestoredFiles, photoIdsOnPhone, refreshRestoreHold, RESTORE_NOTE, restoredBookOk, setRestoreApplying, takeRestoreSnapshot, undoRestore } from "@/lib/restore-undo";
import { useApp, whenFilesDropped } from "@/lib/store";

const BOOK_KEY = "rivetcare-v1";

class ReadPhotoError extends Error {}

function readBook(): string | null {
  try {
    return localStorage.getItem(BOOK_KEY);
  } catch {
    return null;
  }
}

async function rollBack(message: string) {
  const ok = await undoRestore();
  if (!ok) return false;
  try {
    sessionStorage.setItem(RESTORE_NOTE, message);
  } catch {
    /* the reload still puts the previous log back */
  }
  window.location.reload();
  return true;
}

/** Saves a copy of the current log, checks that copy, then writes the backup. Undo stays until the restore is kept. */
export async function applyBackupFiles(
  plan: { files: { id: string; mime: string; data: string }[]; notice?: string; apply: () => boolean | Promise<boolean> },
  flash: (msg: string) => void,
) {
  const ids = new Set(photoIdsOnPhone(useApp.getState()));
  for (const item of plan.files) ids.add(item.id);
  const snap = await takeRestoreSnapshot([...ids]);
  if (!snap.ok) {
    flash(snap.message);
    return;
  }
  setRestoreApplying(true);
  const wrote: string[] = [];
  const sizes = new Map<string, number>();
  let saved = 0;
  let skippedDup = 0;
  try {
    for (const item of plan.files) {
      const blob = backupBlob(item.data, item.mime);
      if (!blob) continue;
      try {
        await getFile(item.id);
      } catch {
        throw new ReadPhotoError();
      }
      if (wrote.includes(item.id)) {
        skippedDup += 1;
        continue;
      }
      await putFile(item.id, blob);
      wrote.push(item.id);
      sizes.set(item.id, blob.size);
      saved += 1;
    }
    let applied = false;
    try {
      applied = await Promise.resolve(plan.apply());
    } catch {
      const back = await rollBack("Could not finish the restore. Nothing was replaced.");
      if (!back) flash("The previous log could not be put back.");
      return;
    }
    if (!applied) {
      const toast = useApp.getState().toast;
      const named = toast.startsWith("This phone has a newer copy") || toast.startsWith("Another tab saved first");
      const back = await rollBack(named ? toast : "This phone is full. Nothing was replaced.");
      if (!back) flash("The previous log could not be put back.");
      return;
    }
    await whenFilesDropped();
    let photosOk = true;
    try {
      for (const id of wrote) {
        const blob = await getFile(id);
        if (!blob || blob.size !== sizes.get(id)) photosOk = false;
      }
    } catch {
      photosOk = false;
    }
    if (!photosOk || !restoredBookOk(readBook())) {
      const back = await rollBack("The restored copy could not be checked. Nothing was replaced.");
      if (!back) flash("The previous log could not be put back.");
      return;
    }
    await noteRestoredFiles(wrote);
    await refreshRestoreHold();
    const incomplete = plan.files.length > 0 && saved + skippedDup !== plan.files.length;
    let base = plan.files.length === 0 ? "Backup restored" : incomplete ? "Notes restored. A file that was not a real photo or PDF was left out." : saved > 0 ? "Backup restored, with photos" : "Backup restored";
    if (skippedDup === 1) base += " One repeated photo was left out.";
    else if (skippedDup > 1) base += ` ${skippedDup} repeated photos were left out.`;
    const held = "The previous log stays until you keep it.";
    flash(plan.notice ? `${base}. ${held} ${plan.notice}` : `${base}. ${held}`);
  } catch (err) {
    const read = err instanceof ReadPhotoError;
    const back = await rollBack(read ? "A photo already on this phone could not be read. Nothing was replaced." : "This phone is full. Nothing was replaced.");
    if (!back) flash("The previous log could not be put back.");
  } finally {
    setRestoreApplying(false);
  }
}
