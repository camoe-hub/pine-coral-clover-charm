import { BookOpen, Box, ChevronRight, KeyRound, MapPin, Ruler, Scale, TriangleAlert } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BOOK_VERSION } from "@/lib/book-version";
import { savedOfflineVersion } from "@/lib/offline-save";
import { useApp, type Screen } from "@/lib/store";

type Tone = "signal" | "offline" | "once";

const reference: { title: string; detail?: string; to: Screen["name"]; tone: Tone; icon: ReactNode }[] = [
  { title: "Owner’s manuals and parts books", to: "manuals", tone: "signal", icon: <BookOpen className="size-5" /> },
  { title: "Parts", detail: "Service numbers stay on this phone. The factory book opens on Airstream’s site.", to: "parts", tone: "offline", icon: <Box className="size-5" /> },
  { title: "Glovebox specs", to: "specs", tone: "offline", icon: <KeyRound className="size-5" /> },
  { title: "Weight calculator", detail: "Axle weights from a truck scale. A CAT Scale ticket works.", to: "weights", tone: "offline", icon: <Scale className="size-5" /> },
  { title: "Trailer level", detail: "Which end is low, and about how far. The phone stays on the floor.", to: "level", tone: "offline", icon: <Ruler className="size-5" /> },
  { title: "Recalls, 2024 and later", detail: "The notes are on this phone. Checking a campaign opens NHTSA.", to: "recalls", tone: "offline", icon: <TriangleAlert className="size-5" /> },
  { title: "Find a dealer or shop", to: "service", tone: "signal", icon: <MapPin className="size-5" /> },
];

const also: { title: string; detail: string; to: Screen["name"]; tone: Tone }[] = [
  { title: "About the numbers", detail: "Where the intervals and codes come from", to: "about", tone: "offline" },
  { title: "Trip checklists", detail: "Tow, setup, dump, winterize, and storage", to: "lists", tone: "offline" },
  { title: "Procedures", detail: "Winterize, bearings, brakes, sealant", to: "procedures", tone: "offline" },
  { title: "On-board kit", detail: "What to actually carry", to: "tools", tone: "offline" },
  { title: "Shop sheet", detail: "The weights, tires, and notes to hand a shop", to: "desk", tone: "offline" },
  { title: "Checks table", detail: "The same checks, in columns", to: "table", tone: "offline" },
  { title: "Printable checklist", detail: "Every symptom, check, and action", to: "printout", tone: "offline" },
  { title: "Privacy", detail: "What stays on this phone, and how to delete it", to: "privacy", tone: "offline" },
  { title: "Support", detail: "A wrong step, and this copy of the book", to: "support", tone: "offline" },
];

const badge: Record<Tone, { label: string; className: string }> = {
  signal: { label: "Needs a signal", className: "bg-warn-soft text-caution" },
  offline: { label: "Works offline", className: "bg-sage-soft text-ok" },
  once: { label: "Needs a signal once", className: "bg-warn-soft text-caution" },
};

function openLibrary(to: Screen["name"]) {
  if (to === "fix") {
    useApp.getState().setSystem("");
    useApp.getState().tab("fix");
    return;
  }
  useApp.getState().push({ name: to } as Screen);
}

export function MoreView() {
  const [offline, setOffline] = useState<"saved" | "not" | "checking">("checking");
  useEffect(() => {
    setOffline(savedOfflineVersion() === BOOK_VERSION ? "saved" : "not");
  }, []);
  function pillFor(tone: Tone) {
    if (tone === "offline") return null;
    return badge[tone];
  }
  return (
    <div>
      <button type="button" onClick={() => openLibrary("offline")} className="mb-4 block min-h-11 w-full text-left text-sm font-semibold text-ink">
        {offline === "checking" ? "Checking offline." : offline === "saved" ? "Saved for offline." : "Not saved for offline yet."}
      </button>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Reference</p>
      <ul className="mt-2 space-y-2">
        {reference.map((item) => {
          const pill = pillFor(item.tone);
          return (
            <li key={item.title}>
              <button type="button" onClick={() => openLibrary(item.to)} className="flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok" aria-hidden>
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">{item.title}</span>
                  {item.detail ? <span className="mt-0.5 block text-sm text-muted">{item.detail}</span> : null}
                  {pill ? <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[13px] font-semibold ${pill.className}`}>{pill.label}</span> : null}
                </span>
                <ChevronRight className="size-5 shrink-0 self-center text-muted" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 rounded-[18px] border border-dashed border-line px-4 py-3 text-sm text-muted">
        Looking for fault codes, flowcharts, or procedures? They live under <button type="button" className="font-semibold text-ink underline" onClick={() => openLibrary("fix")}>Fix</button> and <button type="button" className="font-semibold text-ink underline" onClick={() => useApp.getState().tab("care")}>Maintain</button>.
      </div>
      <section className="mt-5">
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-[0.14em] text-muted">Also</h2>
        <ul className="mt-2 overflow-hidden rounded-[18px] border border-line bg-sheet">
          {also.map((item, i) => {
            const pill = pillFor(item.tone);
            return (
            <li key={item.title} className={i === also.length - 1 ? "" : "border-b border-rule"}>
              <button type="button" onClick={() => openLibrary(item.to)} className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">{item.title}</span>
                  <span className="block text-sm text-muted">{item.detail}</span>
                  {pill ? <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[13px] font-semibold ${pill.className}`}>{pill.label}</span> : null}
                </span>
                <ChevronRight className="size-5 shrink-0 self-center text-muted" aria-hidden />
              </button>
            </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
