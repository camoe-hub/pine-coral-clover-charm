import { useState } from "react";
import { SupportSections } from "@/components/legal-copy";
import { Btn, PageTitle } from "@/components/ui";
import { BOOK_VERSION } from "@/lib/book-version";
import { useApp } from "@/lib/store";

function ProjectCopy() {
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
      <PageTitle className="font-display text-3xl text-ink">Support</PageTitle>
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
