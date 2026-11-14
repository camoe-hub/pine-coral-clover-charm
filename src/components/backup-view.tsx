import { useState } from "react";
import { PageTitle } from "@/components/ui";
import { createPortal } from "react-dom";
import { ChevronLeft } from "lucide-react";
import { BackupSheet } from "@/components/backup-sheet";
import { lastSavedBackupFile, previewBackup, type BackupPreview } from "@/lib/backup-preview";
import { formatWhen } from "@/lib/date";
import { formatBytes } from "@/lib/backup-look";
import { BACKUP_VERSION } from "@/lib/backup-version";
import { useApp } from "@/lib/store";
import { applyBackupFiles } from "@/lib/restore-files";
import { readWeightsFile, savedTicketCount } from "@/lib/weights";
import { useBackLayer } from "@/lib/back-layer";
import { useDialog } from "@/lib/use-dialog";

function noneYet(names: readonly string[]) {
  const lower = names.map((name) => name.charAt(0).toLowerCase() + name.slice(1));
  if (lower.length <= 1) return lower[0] ?? "";
  if (lower.length === 2) return `${lower[0]} or ${lower[1]}`;
  return `${lower.slice(0, -1).join(", ")}, or ${lower[lower.length - 1]}`;
}

export function BackupView() {
  const push = useApp((s) => s.push);
  const flash = useApp((s) => s.flash);
  const lastBackup = useApp((s) => s.lastBackup);
  const lastBackupBytes = useApp((s) => s.lastBackupBytes);
  const coaches = useApp((s) => s.coaches);
  const modelId = useApp((s) => s.modelId);
  const log = useApp((s) => s.log);
  const notes = useApp((s) => s.notes);
  const done = useApp((s) => s.done);
  const checks = useApp((s) => s.checks);
  const [open, setOpen] = useState(false);
  const [look, setLook] = useState<BackupPreview | null>(null);
  useBackLayer(open, () => setOpen(false));
  useBackLayer(look !== null, () => setLook(null));

  const shots = useApp((s) => s.shots);
  const photos = log.reduce((n, entry) => n + (entry.files?.length ?? 0), 0) + Object.values(shots).reduce((n, files) => n + files.length, 0);
  const coachCount = new Set([...Object.keys(coaches), modelId]).size;
  const counted = [
    ["Maintenance marks", Object.keys(done).length],
    ["Checklist marks", Object.keys(checks).length],
    ["Service records", log.length],
    ["Notes", notes.length],
    ["Photos and receipts", photos],
    ["Scale tickets", savedTicketCount(readWeightsFile())],
  ] as const;
  const filled = counted.filter((row) => row[1] > 0);
  const empty = counted.filter((row) => row[1] === 0).map((row) => row[0]);

  async function inspect(file: File) {
    const result = await previewBackup(file);
    if (!result.ok) {
      flash(result.message);
      return;
    }
    setLook(result.look);
  }

  return (
    <div className="space-y-4">
      <div>
        <PageTitle className="font-display text-3xl text-ink">Backup</PageTitle>
        <p className="mt-2 text-sm text-ink">A backup is a file you save. This app does not upload one. A restore keeps the previous log on this phone until you tap Keep this restore.</p>
      </div>
      <section className="rounded-card border border-line bg-sheet p-4">
        <h2 className="font-display text-2xl text-ink">On this phone</h2>
        <dl className="mt-3">
          <Row label="Last backup saved" value={lastBackup ? formatWhen(lastBackup) : "None yet"} />
          <Row label="Last file size" value={formatBytes(lastBackupBytes)} />
          <Row label="Backup version" value={String(BACKUP_VERSION)} />
          <Row label="Trailers" value={String(coachCount)} />
          {filled.map(([label, value]) => (
            <Row key={label} label={label} value={String(value)} />
          ))}
        </dl>
        {empty.length > 0 ? <p className="mt-3 text-sm text-ink">None yet: {noneYet(empty)}.</p> : null}
        <p className="mt-3 text-sm text-ink">{lastBackup ? "Last backup saved is the date you saved the file, not a check that the file still opens. Tap Verify backup and choose that file. A checksum catches a damaged or cut-off file. It does not show that nobody edited it." : "No backup file to check yet. The records are only on this phone until you save one."}</p>
        <p className="mt-2 text-sm text-muted">The file also includes the VIN, the year, appliance plates, tire notes, and the hitch setup, when you have entered them.</p>
      </section>
      <button type="button" onClick={() => setOpen(true)} className="min-h-12 w-full rounded-full bg-navy px-4 font-semibold text-on-navy">
        Export complete backup
      </button>
      <label className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full border border-line bg-sheet px-4 font-semibold text-ink">
        Verify backup
        <input
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void inspect(file);
          }}
        />
      </label>
      <p className="-mt-2 text-sm text-muted">Checks the file and shows what would change. Nothing is replaced until you confirm.</p>
      {lastSavedBackupFile() ? (
        <button type="button" onClick={() => void inspect(lastSavedBackupFile()!)} className="block min-h-11 w-full text-left text-sm font-semibold text-accent">
          Verify the copy just saved
        </button>
      ) : null}
      <button type="button" onClick={() => push({ name: "history" })} className="block min-h-11 w-full text-left text-sm font-semibold text-accent">
        Owner's history, to print or save as PDF
      </button>
      <button type="button" onClick={() => push({ name: "privacy" })} className="block min-h-11 w-full text-left text-sm font-semibold text-accent">
        Privacy and where the data stays
      </button>
      {open && <BackupSheet onClose={() => setOpen(false)} />}
      {look && (
        <RestoreSheet
          look={look}
          onClose={() => setLook(null)}
          onRestore={() => {
            const plan = look.plan;
            setLook(null);
            void (async () => {
              try {
                await applyBackupFiles(plan, flash);
              } catch {
                flash("Could not restore. Nothing was replaced.");
              }
            })();
          }}
        />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-rule py-2 last:border-b-0">
      <dt className="text-sm text-ink">{label}</dt>
      <dd className="text-sm font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

export function RestoreSheet({ look, onClose, onRestore }: { look: BackupPreview; onClose: () => void; onRestore: () => void }) {
  const summary = look.summary;
  const dialogRef = useDialog(onClose);
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse/40" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="look-title"
        tabIndex={-1}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-sheet px-4 pt-4 outline-none"
        style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 -mx-4 flex items-center bg-sheet px-2 pb-2">
          <button type="button" onClick={onClose} className="flex min-h-11 items-center text-ink" aria-label="Back">
            <ChevronLeft className="size-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Back</span>
          </button>
        </div>
        <h2 id="look-title" className="font-display text-2xl text-ink">Inside this file</h2>
        <p className="mt-1 text-sm text-muted">{look.name}</p>
        <dl className="mt-3">
          <Row label="File size" value={formatBytes(summary.bytes)} />
          <Row label="Backup version" value={summary.version} />
          <Row label="File check" value={look.integrity === "ok" ? "Matches. This only catches a damaged file." : "No checksum. Older file."} />
          <Row label="Trailers" value={String(summary.coaches)} />
          <Row label="Maintenance marks" value={String(summary.maintenance)} />
          <Row label="Checklist marks" value={String(summary.checks)} />
          <Row label="Service records" value={String(summary.service)} />
          <Row label="Notes" value={String(summary.notes)} />
          <Row label="Photos and receipts" value={String(summary.photos)} />
          <Row label="Scale tickets" value={String(summary.weights)} />
        </dl>
        <p className="mt-3 text-sm text-ink">Nothing has been replaced. Service records: {look.phoneService} on this phone, {summary.service} in this file. Notes: {look.phoneNotes} on this phone, {summary.notes} in this file. Restoring writes these trailers over the matching ones. Other trailers stay. The previous log stays on this phone until you keep this restore. A file that does not say setup was finished does not finish it, unless that coach already has miles or notes.</p>
        {look.repeated > 0 ? <p className="mt-2 text-sm font-semibold text-ink">This file repeats {look.repeated} record {look.repeated === 1 ? "id" : "ids"}. A repeated id is kept once.</p> : null}
        {look.plan.notice ? <p className="mt-2 text-sm font-semibold text-ink">{look.plan.notice}</p> : null}
        <button type="button" onClick={onRestore} className="mt-4 min-h-12 w-full rounded-full bg-navy font-semibold text-on-navy">
          Restore this backup
        </button>
        <button type="button" onClick={onClose} className="mt-2 min-h-12 w-full font-semibold text-accent">
          Don't restore
        </button>
      </div>
    </div>,
    document.body,
  );
}
