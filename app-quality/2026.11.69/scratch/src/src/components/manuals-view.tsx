import { useMemo, useState } from "react";
import { LIBRARY_URL, manualLinks, manualRevision, manualYears } from "@/data/manuals";
import { coachYear } from "@/data/coach";
import { useApp } from "@/lib/store";

export function ManualsView() {
  const vin = useApp((s) => s.vin);
  const fromVin = coachYear(vin, useApp((s) => s.modelYear));
  const [year, setYear] = useState<number | "all">(fromVin && manualYears.includes(fromVin) ? fromVin : "all");
  const [kind, setKind] = useState<"all" | "manual" | "parts">("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const seen = new Set<string>();
    return manualLinks.filter((m) => {
      if (seen.has(m.url)) return false;
      seen.add(m.url);
      if (year !== "all" && m.year !== year) return false;
      if (kind !== "all" && m.kind !== kind) return false;
      if (!needle) return true;
      return `${m.year} ${m.title} ${m.brand}`.toLowerCase().includes(needle);
    });
  }, [year, kind, q]);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Manuals</h1>
      <p className="mt-2 text-sm text-muted">
        Factory manuals and parts books, 2000 through {manualYears[0]}. They open on Airstream’s site. Nothing is stored in this app.
      </p>
      <a href={LIBRARY_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-accent">
        All files on Airstream.com
      </a>

      <div className="chip-row chip-scroll chip-fade -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Year">
        <Chip on={year === "all"} onClick={() => setYear("all")}>
          All years
        </Chip>
        {manualYears.map((y) => (
          <Chip key={y} on={year === y} onClick={() => setYear(y)}>
            {String(y)}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-2" role="group" aria-label="Kind of book">
        {(
          [
            ["all", "All"],
            ["manual", "Owner’s"],
            ["parts", "Parts"],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} on={kind === id} onClick={() => setKind(id)}>
            {label}
          </Chip>
        ))}
      </div>
      <label className="mt-3 block text-sm font-semibold text-ink" htmlFor="manual-search">
        Find a manual
      </label>
      <input
        id="manual-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Flying Cloud, Classic, Bambi…"
        inputMode="search"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
      />
      <p className="mt-3 text-sm text-muted">
        {year === "all" && !q.trim() ? `${rows.length} files. Pick a year or search to shorten the list.` : `${rows.length} files`}
      </p>
      <ul className="mt-2 rounded-card border border-line bg-sheet">
        {(year === "all" && !q.trim() ? rows.slice(0, 24) : rows).map((m, i, list) => (
          <li key={`${m.year}-${m.kind}-${m.title}-${m.url}`} className={i === list.length - 1 ? "" : "border-b border-line"}>
            <a href={m.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-3">
              <span className="block font-semibold text-ink">{m.title}</span>
              <span className="text-sm text-muted">
                {m.year} · {m.kind === "parts" ? "Parts book" : "Owner’s manual"}
                {manualRevision(m.url) ? ` · ${manualRevision(m.url)}` : " · no revision in the file name"}
                {m.brand ? ` · ${m.brand}` : ""}
              </span>
              <span className="sr-only"> Opens the Airstream PDF in a new tab.</span>
            </a>
          </li>
        ))}
      </ul>
      {rows.length === 0 && <p className="mt-4 text-sm text-muted">Nothing matches. Try all years, or the Airstream library.</p>}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`min-h-11 min-w-11 shrink-0 rounded-full px-3 text-sm font-semibold ${on ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`}
    >
      {children}
    </button>
  );
}
