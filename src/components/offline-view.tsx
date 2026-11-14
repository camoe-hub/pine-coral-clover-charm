import { useEffect, useState } from "react";
import { formatWhen } from "@/lib/date";
import { readZipTable } from "@/lib/book-cache";
import { BOOK_VERSION } from "@/lib/book-version";
import { savedOfflineVersion, saveForOffline, saveIsComplete, type SaveReport } from "@/lib/offline-save";
import { useApp } from "@/lib/store";

type Ready = "yes" | "no" | "checking";

async function cacheInfo(prefix: string): Promise<{ has: boolean; count: number }> {
  try {
    if (typeof caches === "undefined") return { has: false, count: 0 };
    const keys = await caches.keys();
    const name = keys.find((key) => key === prefix || key.startsWith(`${prefix}-`));
    if (!name) return { has: false, count: 0 };
    const count = (await (await caches.open(name)).keys()).length;
    return { has: count > 0, count };
  } catch {
    return { has: false, count: 0 };
  }
}

export function OfflineView() {
  const lastBackup = useApp((s) => s.lastBackup);
  const [shell, setShell] = useState<Ready>("checking");
  const [zips, setZips] = useState<Ready>("checking");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [zipError, setZipError] = useState("");
  const [report, setReport] = useState<SaveReport | null>(null);
  const [savedVersion, setSavedVersion] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      try {
        const [shellInfo, table] = await Promise.all([
          cacheInfo("rivetcare-shell"),
          readZipTable().catch(() => null),
        ]);
        if (!live) return;
        setShell(shellInfo.has ? "yes" : "no");
        setZips(table ? "yes" : "no");
        setSavedVersion(savedOfflineVersion());
      } catch {
        if (!live) return;
        setShell("no");
        setZips("no");
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  async function saveSet() {
    if (saving) return;
    setSaving(true);
    setSaveError("");
    try {
      const next = await saveForOffline();
      setReport(next);
      setSavedVersion(savedOfflineVersion());
      if (next.shellOk) setShell("yes");
      if (!saveIsComplete(next)) setSaveError("Not complete. Stay on a signal and save again.");
    } catch (error) {
      const timedOut = error instanceof Error && error.message === "timeout";
      setSaveError(timedOut ? "The save did not finish. Stay on a signal and try again." : "That save needs a signal, and the app has to be open in this tab.");
    } finally {
      setSaving(false);
    }
  }

  async function saveDistances() {
    if (saving) return;
    setSaving(true);
    setZipError("");
    try {
      const { saveShopDistances } = await import("@/lib/service");
      const ok = await saveShopDistances();
      if (ok) setZips("yes");
      else setZipError("Could not save the ZIP list on this phone.");
    } catch {
      setZipError("That save needs a signal.");
    } finally {
      setSaving(false);
    }
  }

  const complete = !!report && saveIsComplete(report);
  const screensReady: Ready = report ? (report.screensWanted > 0 && report.screensHave >= report.screensWanted ? "yes" : "no") : shell === "checking" ? "checking" : "no";
  const fontsReady: Ready = report ? (report.fontsWanted > 0 && report.fontsHave >= report.fontsWanted ? "yes" : "no") : shell === "checking" ? "checking" : "no";
  const screenDetail = report && report.screensWanted > 0 ? `${report.screensHave} of ${report.screensWanted} screen files.` : "";
  const fontDetail = report ? `${report.fontsHave} of ${report.fontsWanted}.` : "";
  const screenMissing =
    savedVersion === BOOK_VERSION && !report
      ? "Last save was this version. Save again to check that it is still here."
      : savedVersion && savedVersion !== BOOK_VERSION
        ? "This version is not saved yet. Save again while you have a signal."
        : "Not saved as a set yet. Save while you have a signal.";
  const stamped = savedOfflineVersion() === BOOK_VERSION;
  const saved = (shell === "yes" && screensReady === "yes" && fontsReady === "yes") || stamped;
  const online = typeof navigator === "undefined" || navigator.onLine;
  const status = shell === "checking" && !stamped
    ? "Checking what is already on this phone."
    : saved
      ? "Saved for offline."
      : "Not saved for offline yet.";

  return (
    <div className="grid gap-3">
      <p className="text-base font-semibold text-ink">{status}</p>
      <button type="button" onClick={() => void saveSet()} disabled={saving || !online} className="min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy disabled:opacity-40">
        {saving ? "Saving…" : complete || (stamped && !online) ? "Saved" : "Save for offline"}
      </button>
      {saveError ? <p className="text-sm font-semibold text-stop">{saveError}</p> : null}
      <p className="text-sm text-ink">
        There is no account and no sync time. What you typed stays in this browser until the browser erases it. A backup file is a copy you save yourself. It is not the same as working offline.
      </p>
      <section className="rounded-[20px] border border-line bg-sheet p-4">
        <h2 className="font-display text-xl text-ink">On this phone</h2>
        <ul className="mt-3 grid gap-3 text-sm text-ink">
          <Row label="App shell" ready={shell} missing="Not saved for offline yet. Save while you have a signal." />
          <Row
            label="Screen code"
            ready={screensReady}
            missing={screenMissing}
            detail={screenDetail}
          />
          <Row label="Fonts" ready={fontsReady} missing="Not checked yet. Save while you have a signal." detail={fontDetail} />
          <Row label="Shop distances" ready={zips} missing="Not on this phone yet. The ZIP list is saved on its own." />
        </ul>
        {zips === "no" ? (
          <div className="mt-3">
            <button type="button" onClick={() => void saveDistances()} disabled={saving} className="min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink disabled:opacity-40">
              {saving ? "Saving…" : "Save shop distances"}
            </button>
            {zipError ? <p className="mt-2 text-sm font-semibold text-stop">{zipError}</p> : null}
          </div>
        ) : null}
        <p className="mt-3 text-sm text-muted">
          Checks, fault codes, flowcharts, procedures, weights, and your notes and log do not need a signal once this save finishes. Factory manuals and the factory parts book are not part of it. The VIN year is calculated on the phone.
        </p>
      </section>
      <section className="rounded-[20px] border border-line bg-sheet p-4">
        <h2 className="font-display text-xl text-ink">Needs a signal</h2>
        <p className="mt-2 text-sm text-ink">Factory manuals, the factory parts book, Apple Maps, and the NHTSA recall lookup open on the network. They are not stored here.</p>
      </section>
      <p className="text-sm text-muted">{lastBackup ? `Last backup saved ${formatWhen(lastBackup)}.` : "No backup file saved yet."}</p>
    </div>
  );
}

function Row({ label, ready, missing, detail }: { label: string; ready: Ready; missing: string; detail?: string }) {
  return (
    <li>
      <span className="block font-semibold">{label}</span>
      {ready === "checking" ? <span className="mt-0.5 block text-sm text-muted">Checking…</span> : null}
      {ready === "yes" ? <span className="mt-0.5 block text-sm text-muted">{detail ? `Saved. ${detail}` : "Saved"}</span> : null}
      {ready === "no" ? <span className="mt-0.5 block text-sm text-muted">{missing}</span> : null}
    </li>
  );
}