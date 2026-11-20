import { useState } from "react";
import { PageTitle } from "@/components/ui";
import { PrivacySections } from "@/components/legal-copy";
import { closeFiles } from "@/lib/files";
import { closeRestoreUndo } from "@/lib/restore-undo";
import { eraseDatabases } from "@/lib/erase-databases";
import { useApp } from "@/lib/store";

const KEYS = [
  "rivetcare-v1",
  "rivetcare-v1-unreadable",
  "rivetcare-v1-before-trim",
  "rivetcare-weights",
  "rivetcare-theme",
  "rivetcare-spoke",
  "rivetcare-service",
  "rivetcare-offline-set",
  "rivetcare-level",
  "rivetcare-level-zero",
];

function clearNamedStorage() {
  const drop = new Set(KEYS);
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("rivetcare-") && key !== "rivetcare-pass") drop.add(key);
    }
  } catch {
    /* A private window can still remove the named keys. */
  }
  for (const key of drop) localStorage.removeItem(key);
  try {
    const session = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith("rivetcare-")) session.push(key);
    }
    for (const key of session) sessionStorage.removeItem(key);
  } catch {
    /* The tab copy is already gone when the window closes. */
  }
}

export function PrivacyView() {
  const flash = useApp((s) => s.flash);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function erase() {
    if (busy) return;
    setBusy(true);
    closeFiles();
    closeRestoreUndo();
    clearNamedStorage();
    const cleared = await eraseDatabases(indexedDB);
    if (!cleared) {
      setBusy(false);
      flash("The records were removed. A photo file was still open, so clear this site’s data in the browser to finish.");
      window.setTimeout(() => window.location.reload(), 1600);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <PageTitle className="font-display text-3xl text-ink">Privacy</PageTitle>
      <PrivacySections />
      <section className="space-y-2 rounded-card border border-line bg-sheet p-4">
        <h2 className="font-display text-2xl text-ink">Delete the records</h2>
        <p className="text-base text-ink">This removes the trailers, the log, the photos, the notes, the scale tickets, the floor-level spans, the phone zero, the saved shop search, a restore undo copy, and a saved parts list on this phone. Anything else this app saved under its own name on this phone goes with them. A backup file you already saved in Files is not deleted. The app itself can stay until you clear this site’s data in the browser.</p>
        {confirm ? (
          <div className="space-y-2">
            <p className="text-base font-semibold text-ink">This cannot be undone.</p>
            <button type="button" onClick={() => void erase()} disabled={busy} className="min-h-12 w-full rounded-full border border-stop px-4 font-semibold text-stop disabled:opacity-40">
              {busy ? "Deleting…" : "Delete the records on this phone"}
            </button>
            <button type="button" onClick={() => setConfirm(false)} disabled={busy} className="min-h-11 w-full font-semibold text-accent">
              Keep them
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="min-h-11 font-semibold text-stop">
            Delete all local records
          </button>
        )}
      </section>
    </div>
  );
}
