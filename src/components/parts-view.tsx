import { useEffect, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { partById, parts, type Part } from "@/data/parts";
import { textHasWords, wordsOf } from "@/data/words";
import { LIBRARY_URL, partsBookFor } from "@/data/manuals";
import { coachPart, coachYear } from "@/data/coach";
import { modelById, type Model } from "@/data/models";
import { otherYearNumber } from "@/lib/part-year";
import { dropBookParts } from "@/lib/book-cache";
import { useApp } from "@/lib/store";
import { ScopedCopy } from "@/components/scoped-copy";
import { Btn, Card, Kicker, PageTitle, Pill } from "@/components/ui";

type Source = "guide" | "tools";

function offeredPart(part: Part, model: Model, year: number | null) {
  const view = coachPart(part, model);
  const otherYear = otherYearNumber({
    pn: view.pn,
    name: part.name,
    application: part.application,
    notes: part.notes,
    coachNote: view.note,
    year,
  });
  return { ...view, otherYear, title: otherYear ? part.name : view.name };
}

export function PartsView() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState<Source>("guide");
  const [system, setSystem] = useState("");
  const push = useApp((s) => s.push);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const book = partsBookFor(model.id, model.family, year);

  useEffect(() => {
    void dropBookParts();
  }, []);

  useEffect(() => {
    setSystem("");
  }, [model.id]);

  const guideList = useMemo(() => {
    const words = wordsOf(q);
    const pool = words.length
      ? parts
      : parts.filter((p) => {
          if (coachPart(p, model).hide) return false;
          if (source === "tools") return !!p.tool;
          if (p.tool) return false;
          if (system && p.system !== system) return false;
          return true;
        });
    const blob = (p: (typeof parts)[number]) => `${p.name} ${p.pn} ${p.also ?? ""} ${p.application} ${p.system} ${p.notes}`;
    const matched = words.length ? pool.filter((p) => textHasWords(blob(p), words)) : pool.slice();
    if (words.length) {
      const rank = (p: (typeof parts)[number]) => {
        const named = textHasWords(p.name, words);
        if (named && !p.id.startsWith("pn-")) return 0;
        if (named) return 1;
        if (textHasWords(`${p.pn} ${p.also ?? ""}`, words)) return 2;
        return 3;
      };
      return matched.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)).slice(0, 30);
    }
    const order = [
      "Running gear",
      "Tires and wheels",
      "Axles and brakes",
      "Hitch",
      "Electrical",
      "Plumbing",
      "Water",
      "Water heater",
      "Alde",
      "Furnace",
      "Air conditioning",
      "Refrigerator",
      "Appliances",
      "Propane",
      "Body",
      "General",
    ];
    return matched.sort((a, b) => {
      const ia = order.indexOf(a.system);
      const ib = order.indexOf(b.system);
      const d = (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      if (d) return d;
      const ra = a.id.startsWith("pn-") ? 1 : 0;
      const rb = b.id.startsWith("pn-") ? 1 : 0;
      if (ra !== rb) return ra - rb;
      return a.pn.localeCompare(b.pn);
    });
  }, [q, source, system, model]);

  const visibleParts = useMemo(() => parts.filter((p) => !p.tool && !coachPart(p, model).hide), [model]);
  const partCount = visibleParts.length;
  const systems = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of visibleParts) counts.set(p.system, (counts.get(p.system) ?? 0) + 1);
    return [...counts.entries()];
  }, [visibleParts]);

  const searching = wordsOf(q).length > 0;

  return (
    <div>
      <Kicker>Service list and tools</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Parts</PageTitle>
      <p className="mt-1 text-sm text-muted">
        {partCount} service reminders and the tool list. Numbers follow the selected floor, not every year of that floor. Quote the VIN before you order.
      </p>
      <Card className="mt-4 p-4">
        <Kicker>Needs a signal</Kicker>
        <h2 className="mt-1 font-display text-2xl text-ink">{book.title}</h2>
        <p className="mt-2 text-sm text-ink">{book.note}</p>
        <a
          href={book.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold text-on-navy"
        >
          Open the parts book
        </a>
        {book.url !== book.fallback ? (
          <a href={LIBRARY_URL} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 items-center justify-center text-sm font-semibold text-accent">
            If that file does not open
          </a>
        ) : null}
      </Card>
      <div className="chip-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {(
          [
            ["guide", "Service list"],
            ["tools", "Tools"],
          ] as [Source, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSource(id)}
            className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${source === id ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="parts-search">
        Search parts
      </label>
      <input
        id="parts-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search parts"
        placeholder="Search faucet, inverter, anode…"
        inputMode="search"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
      />

      {searching && (
        <ul className="mt-4 space-y-2">
          {guideList.map((p) => {
            const view = offeredPart(p, model, year);
            return (
              <li key={p.id}>
                <button onClick={() => push({ name: "part", id: p.id })} className="w-full rounded-card border border-line bg-sheet px-3 py-3 text-left">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{view.title}</span>
                    {view.hide ? <Pill tone="warn">Not on this coach</Pill> : null}
                  </span>
                  {view.otherYear ? (
                    <span className="mt-1 block text-sm text-muted">Not this year’s part</span>
                  ) : (
                    <span className="mt-1 block font-mono text-sm text-accent wrap-anywhere">{view.pn}</span>
                  )}
                  <span className="mt-1 block text-sm text-muted">{p.system}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {searching && guideList.length === 0 && <p className="mt-6 text-sm text-muted">No part matches that. The factory book is the link above.</p>}

      {!searching && (
        <>
          {source === "guide" && (
            <div className="chip-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
              <button
                type="button"
                onClick={() => setSystem("")}
                className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${system === "" ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`}
              >
                All {partCount}
              </button>
              {systems.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSystem(name)}
                  className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${system === name ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`}
                >
                  {name} {count}
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-sm text-ink">Check the VIN or the data plate before you order. This list does not confirm the part.</p>
          <ul className="mt-4 space-y-2">
            {guideList.map((p, i) => {
              const view = offeredPart(p, model, year);
              const head = source === "guide" && (i === 0 || guideList[i - 1].system !== p.system);
              return (
                <li key={p.id}>
                  {head && <h2 className="mb-2 mt-4 font-display text-xl text-ink first:mt-0">{p.system}</h2>}
                  <button onClick={() => push({ name: "part", id: p.id })} className="w-full rounded-card border border-line bg-sheet px-3 py-3 text-left">
                    <span className="font-semibold text-ink">{view.title}</span>
                    {view.otherYear ? (
                      <span className="mt-1 block text-sm text-muted">Not this year’s part</span>
                    ) : (
                      <span className="mt-1 block font-mono text-sm text-accent wrap-anywhere">{view.pn}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export function PartView({ id }: { id: string }) {
  const flash = useApp((s) => s.flash);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const p = partById(id);
  if (!p) return <p className="text-sm text-muted">That factory line is not stored in this app. Open the parts book on Airstream’s site.</p>;
  const view = offeredPart(p, model, year);
  const copyText = [view.pn, p.also].filter(Boolean).join(" · ");
  return (
    <div className="space-y-4">
      <div>
        <Kicker>{p.system}</Kicker>
        <PageTitle className="mt-1 font-display text-3xl text-ink">{view.title}</PageTitle>
      </div>
      {view.hide && <Pill tone="warn">Not the part for {model.name}</Pill>}
      <Card className="p-4">
        {view.otherYear ? (
          <>
            <p className="text-sm font-semibold text-ink">Not this year’s part</p>
            {view.name !== p.name ? <p className="mt-2 text-sm text-muted">{view.name}</p> : null}
            <p className="mt-1 font-mono text-sm text-muted wrap-anywhere">{view.pn}</p>
          </>
        ) : (
          <>
            <Kicker>{p.tool ? "Carry this" : "For this coach"}</Kicker>
            <p className="mt-1 font-mono text-lg text-accent wrap-anywhere">{view.pn}</p>
          </>
        )}
        {view.note && <p className="mt-2 text-sm text-ink">{view.note}</p>}
        {p.also && (
          <>
            <Kicker>Also</Kicker>
            <p className="mt-1 text-sm text-ink">{p.also}</p>
          </>
        )}
        <Btn
          className="mt-4"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(copyText);
              flash("Copied");
            } catch {
              flash("Could not copy");
            }
          }}
        >
          <Copy className="size-4" />
          Copy numbers
        </Btn>
      </Card>
      {p.verify && <Pill tone="warn">Verify by VIN or data plate</Pill>}
      <p className="text-sm text-ink"><ScopedCopy text={p.application} year={year} /></p>
      <p className="text-sm text-muted"><ScopedCopy text={p.notes} year={year} /></p>
    </div>
  );
}