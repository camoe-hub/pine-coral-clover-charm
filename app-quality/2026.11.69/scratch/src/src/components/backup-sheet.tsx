import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft } from "lucide-react";
import { buildBackup } from "@/lib/backup";
import { formatWhen } from "@/lib/date";
import { MAX_BACKUP_TEXT, useApp } from "@/lib/store";
import { useDialog } from "@/lib/use-dialog";

type SavePicker = (options: {
  suggestedName?: string;
  types?: { description?: string; accept: Record<string, string[]> }[];
}) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;

let lastSavedBackup: File | null = null;

export function lastSavedBackupFile() {
  return lastSavedBackup;
}
function downloadNeedsShare() {
  const nav = navigator as Navigator & { standalone?: boolean };
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
  let framed = false;
  try {
    framed = window.top !== window.self;
  } catch {
    framed = true;
  }
  return ios || standalone || framed;
}

export function BackupSheet({ onClose }: { onClose: () => void }) {
  const lastBackup = useApp((s) => s.lastBackup);
  const dialogRef = useDialog(onClose);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [left, setLeft] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const handed = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";
    void buildBackup().then((built) => {
      if (cancelled || !built) {
        if (built) URL.revokeObjectURL(built.url);
        if (!cancelled) setError("Could not build the backup");
        return;
      }
      objectUrl = built.url;
      setFile(built.file);
      setUrl(built.url);
      setLeft(built.left);
    });
    return () => {
      cancelled = true;
      if (objectUrl && !handed.current) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  function saved() {
    if (file) lastSavedBackup = file;
    useApp.getState().noteBackup(file?.size);
    onClose();
  }

  async function share() {
    if (!file) return false;
    const can = navigator.canShare?.({ files: [file] }) ?? false;
    if (!navigator.share || !can) return false;
    try {
      await navigator.share({ files: [file], title: "RivetCare backup" });
      saved();
      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return true;
      return false;
    }
  }

  function anchorDownload() {
    if (!url) return false;
    handed.current = true;
    const blobUrl = url;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = file?.name || "rivetcare-backup.json";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    if (file) lastSavedBackup = file;
    useApp.getState().noteBackup(file?.size);
    window.setTimeout(onClose, 400);
    return true;
  }

  async function saveFile() {
    if (!file) return;
    setError("");
    const picker = (window as Window & { showSaveFilePicker?: SavePicker }).showSaveFilePicker;
    if (picker && !downloadNeedsShare()) {
      try {
        const handle = await picker({
          suggestedName: file.name,
          types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(file);
        await writable.close();
        saved();
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    if (downloadNeedsShare()) {
      const ok = await share();
      if (!ok) setError("Could not save the file.");
      return;
    }
    if (!anchorDownload()) setError("Could not save the file.");
  }

  async function copy() {
    if (!file) return;
    setError("");
    if (file.size > MAX_BACKUP_TEXT) {
      setError("That backup is too large to copy on this phone.");
      return;
    }
    try {
      const text = await file.text();
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(text);
    } catch {
      try {
        const text = await file.text();
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (!ok) throw new Error("copy failed");
      } catch {
        setError("Could not copy. Use Share or save to Files.");
        return;
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse/40" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-title"
        tabIndex={-1}
        className="w-full max-w-lg rounded-t-3xl bg-sheet px-4 pt-4 outline-none"
        style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 -mx-4 flex items-center bg-sheet px-2 pb-2">
          <button type="button" onClick={onClose} className="flex min-h-11 items-center text-ink" aria-label="Back">
            <ChevronLeft className="size-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">Back</span>
          </button>
        </div>
        <h2 id="backup-title" className="font-display text-2xl text-ink">
          Save a copy
        </h2>
        <p className="mt-2 text-sm text-ink">
          This file is your records: every trailer’s miles, service notes, personal notes, photos, and weight tickets. It is not the project zip. Save it to Files, or email it to yourself. On the other phone, open Records and tap Restore. Clearing this phone does not delete that copy.
        </p>
        <p className="mt-2 text-sm font-semibold text-ink">{lastBackup ? `Last backup saved ${formatWhen(lastBackup)}.` : "No backup saved yet."}</p>
        <p className="mt-1 text-sm text-muted">Share or Save file sets that date. Copy does not. Nothing is synced to an account.</p>
        {file ? <p className="mt-1 text-sm text-muted">This file is {fileSize(file.size)}.</p> : null}
        {left > 0 ? (
          <p className="mt-2 text-sm text-ink">
            {left === 1 ? "One photo or PDF did not fit" : `${left} photos or PDFs did not fit`} in this copy, so the phone could build the file. The notes are still in it.
          </p>
        ) : null}
        {error ? <p className="mt-2 text-sm text-stop">{error}</p> : null}
        <div className="mt-4 flex flex-col gap-2">
          <button type="button" disabled={!file} onClick={() => void share().then((ok) => { if (!ok) setError("Could not open the share sheet."); })} className="min-h-12 w-full rounded-full bg-navy font-semibold text-on-navy disabled:opacity-50">
            {file ? "Share or save to Files" : "Preparing the file…"}
          </button>
          <button type="button" disabled={!file} onClick={() => void saveFile()} className="min-h-12 w-full rounded-full border border-line font-semibold text-ink disabled:opacity-50">
            Save file
          </button>
          <button type="button" disabled={!file} onClick={() => void copy()} className="min-h-12 w-full rounded-full border border-line font-semibold text-ink disabled:opacity-50">
            {copied ? "Copied" : "Copy to clipboard"}
          </button>
          <button type="button" onClick={onClose} className="min-h-12 w-full font-semibold text-accent">
            Not now
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
