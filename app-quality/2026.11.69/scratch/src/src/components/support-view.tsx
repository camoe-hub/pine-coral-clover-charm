import { useEffect, useRef, useState } from "react";
import { SupportSections } from "@/components/legal-copy";
import { Btn } from "@/components/ui";
import { BOOK_VERSION } from "@/lib/book-version";
import { previewPathPrefix } from "@/lib/preview-path-prefix";
import { useApp } from "@/lib/store";

function phoneSave() {
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

async function readProjectZip(href: string) {
  const res = await fetch(href, { cache: "no-store" });
  if (!res.ok) throw new Error("missing");
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error("not a zip");
  return new File([buf], "rivetcare-book.zip", { type: "application/zip" });
}

function shareableZip(file: File) {
  if (typeof navigator === "undefined" || !navigator.share) return null;
  if (!navigator.canShare || navigator.canShare({ files: [file] })) return file;
  const plain = new File([file], file.name, { type: "application/octet-stream" });
  if (navigator.canShare({ files: [plain] })) return plain;
  return file;
}

function ProjectCopy() {
  const [zipHref, setZipHref] = useState("/rivetcare-book.zip");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [zipBusy, setZipBusy] = useState(false);
  const zipStarted = useRef(false);
  useEffect(() => {
    const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
    setZipHref(`${prefix}/rivetcare-book.zip`);
  }, []);
  function loadZip() {
    if (zipFile || zipBusy || zipStarted.current) return;
    zipStarted.current = true;
    setZipBusy(true);
    void readProjectZip(zipHref)
      .then((file) => {
        setZipFile(file);
        setZipBusy(false);
      })
      .catch(() => {
        zipStarted.current = false;
        setZipBusy(false);
      });
  }
  function saveProjectZip(event: { preventDefault: () => void }) {
    const file = zipFile;
    if (!file || !phoneSave() || !navigator.share) return;
    const shareFile = shareableZip(file);
    if (!shareFile || (navigator.canShare && !navigator.canShare({ files: [shareFile] }))) return;
    event.preventDefault();
    try {
      const pending = navigator.share({ files: [shareFile], title: "RivetCare" });
      void Promise.resolve(pending).catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        window.location.assign(zipHref);
      });
    } catch {
      window.location.assign(zipHref);
    }
  }
  return (
    <section className="space-y-2">
      <h2 className="font-display text-2xl text-ink">This copy</h2>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("rivetcare-check-update"))}
        className="flex min-h-11 items-center text-left text-sm font-semibold text-ink"
      >
        Version {BOOK_VERSION}. Check for an update
      </button>
      <a href={zipHref} download="rivetcare-book.zip" onClick={saveProjectZip} onMouseEnter={loadZip} onFocus={loadZip} className="flex min-h-11 items-center text-sm font-semibold text-ink">
        {zipBusy && !zipFile ? "Getting the zip…" : "Save the project zip"}
      </a>
      <p className="text-sm text-muted">The zip is the app source, not your miles, notes, or photos. Save a copy keeps the records. On iPhone, choose Save to Files if a share sheet opens.</p>
    </section>
  );
}

export function SupportView() {
  const addNote = useApp((s) => s.addNote);
  const flash = useApp((s) => s.flash);
  const [draft, setDraft] = useState("");

  async function save() {
    const body = draft.trim();
    if (!body) {
      flash("Write what disagrees with the manual or the plate.");
      return;
    }
    const ok = await Promise.resolve(addNote(`Possible error. ${body} This note stays on the phone.`));
    if (ok === false) {
      flash("Could not save that note.");
      return;
    }
    setDraft("");
    flash("Saved in notes. Nothing is sent.");
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl text-ink">Support</h1>
      <section className="space-y-2">
        <h2 className="font-display text-2xl text-ink">Report a wrong step</h2>
        <p className="text-base text-ink">Write what the step got wrong. The note stays on this phone. Nothing is sent.</p>
        <label className="block" htmlFor="wrong-step">
          <span className="sr-only">What the step got wrong</span>
          <textarea
            id="wrong-step"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="The step, the page, and what the manual or the plate says"
            className="min-h-28 w-full rounded-card border border-line bg-sheet px-4 py-3 text-base"
          />
        </label>
        <Btn className="w-full" onClick={() => void save()}>
          Save the note
        </Btn>
      </section>
      <SupportSections />
      <ProjectCopy />
    </div>
  );
}
