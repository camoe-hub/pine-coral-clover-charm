import { useEffect, useMemo, useState } from "react";
import { symptomById, symptoms, systems, type Symptom } from "@/data/symptoms";
import { modelById } from "@/data/models";
import { coachYear, symptomOn } from "@/data/coach";
import { scopeLead, scopedLine } from "@/lib/year-scope";
import { useApp } from "@/lib/store";
import { Kicker, Pill } from "@/components/ui";

const levelWord = { stop: "Stop", soon: "Soon", watch: "Watch" } as const;
const levelTone = { stop: "danger", soon: "warn", watch: "line" } as const;

function fitsModel(fit: "classic" | "gt" | undefined, family: string, alde: boolean) {
  if (!fit || family === "Other") return true;
  if (fit === "classic") return alde;
  return family === "Globetrotter";
}

/** Forum notes and contested write-ups are not check/action rows. */
function isTip(symptom: Symptom) {
  if (symptom.title.toLowerCase().includes("contested topic")) return true;
  return symptom.checks.some((check) => {
    const look = check.look.trim().toLowerCase();
    const action = check.action.trim().toLowerCase();
    return look.startsWith("what owners") || action.startsWith("owner-reported") || action.startsWith("manufacturer + owner-reported");
  });
}

export function TableView({ id, step }: { id?: string; step?: number }) {
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const push = useApp((s) => s.push);
  const storedSystem = useApp((s) => s.systemFilter);
  const focus = id ? symptomById(id) : undefined;
  const [onlyMine, setOnlyMine] = useState(() => (focus ? fitsModel(focus.fit, model.family, model.alde) : true));
  const [system, setSystem] = useState(focus?.system ?? storedSystem);
  const [showRest, setShowRest] = useState(false);
  function pickSystem(next: string) {
    setSystem(next);
    if (!focus) useApp.getState().setSystem(next);
  }

  const checks = useMemo(() => symptoms.filter((s) => !isTip(s) || s.id === id), [id]);

  const groups = useMemo(() => {
    const rows = checks.filter((s) => {
      if (focus && !showRest) return s.id === focus.id;
      if (focus && showRest && s.system !== focus.system) return false;
      if (!focus && system && s.system !== system) return false;
      if (s.id === id) return true;
      return symptomOn(s, model, year, onlyMine);
    });
    return systems
      .map((name) => ({
        name,
        items: rows.filter((s) => s.system === name).sort((a, b) => (a.id === id ? -1 : b.id === id ? 1 : 0)),
      }))
      .filter((g) => g.items.length > 0);
  }, [checks, onlyMine, system, model, year, focus, showRest, id]);

  const neighbors = focus ? checks.filter((s) => s.system === focus.system && s.id !== focus.id).length : 0;

  useEffect(() => {
    if (focus || !system) return;
    document.getElementById("table-system")?.querySelector<HTMLElement>("[aria-pressed='true']")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [system, focus]);

  useEffect(() => {
    if (!id) return;
    const row = step != null ? document.getElementById(`table-${id}-${step}`) : null;
    const card = document.getElementById(`table-${id}`);
    (row ?? card)?.scrollIntoView({ block: "center" });
  }, [id, step, showRest]);

  return (
    <div>
      <Kicker>A view of the Fix checks</Kicker>
      <h1 className="mt-1 font-display text-3xl text-ink">{focus && !showRest ? focus.title : "Checks table"}</h1>
      <p className="mt-1 text-sm text-muted">
        {focus
          ? `${focus.system}. The highlighted row is the check you were on.`
          : system
            ? `Showing ${system}. Symptom, check, and action only. Forum notes are not listed here.`
            : "Symptom, check, and action only. Forum notes are not listed here. Stop means do not keep going. Soon means it is close. Watch means look, not that it failed."}
      </p>

      {focus && !showRest && neighbors > 0 && (
        <button type="button" onClick={() => setShowRest(true)} className="mt-3 min-h-11 text-sm font-semibold text-accent">
          Rest of {focus.system}
        </button>
      )}

      {!focus && (
        <>
          <button type="button" onClick={() => setOnlyMine((v) => !v)} className="mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">
            <span className={`grid size-5 place-items-center rounded border ${onlyMine ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet"}`}>
              {onlyMine ? "✓" : ""}
            </span>
            Only jobs that fit {model.short}
          </button>
          <div id="table-system" className="chip-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="System">
            <Filter on={system === ""} onClick={() => pickSystem("")}>
              All
            </Filter>
            {systems
              .filter((name) => symptoms.some((s) => s.system === name && symptomOn(s, model, year, onlyMine)))
              .map((name) => (
              <Filter key={name} on={system === name} onClick={() => pickSystem(system === name ? "" : name)}>
                {name}
              </Filter>
            ))}
          </div>
        </>
      )}

      {groups.map((group) => (
        <section key={group.name} className="mt-6">
          {(showRest || !focus) && <h2 className="font-display text-2xl text-accent">{group.name}</h2>}
          <div className="mt-2 space-y-3">
            {group.items.map((symptom) => (
              <SymptomTable key={symptom.id} symptom={symptom} year={year} activeId={id} step={step} onOpen={() => push({ name: "symptom", id: symptom.id, step: 0 })} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SymptomTable({ symptom, year, activeId, step, onOpen }: { symptom: Symptom; year: number | null; activeId?: string; step?: number; onOpen: () => void }) {
  return (
    <div id={`table-${symptom.id}`} className="rounded-card border border-line bg-sheet">
      <button type="button" onClick={onOpen} className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left">
        <span>
          <span className="block font-semibold text-ink">{symptom.title}</span>
          <span className="mt-0.5 block text-sm text-muted">{scopeLead(symptom.blurb, year)}</span>
        </span>
        <Pill tone={levelTone[symptom.level]}>{levelWord[symptom.level]}</Pill>
      </button>
      <div className="border-t border-line">
        <table className="w-full border-collapse text-left text-sm max-sm:block">
          <thead className="max-sm:hidden">
            <tr className="bg-paper text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="w-[40%] px-3 py-2 font-semibold">Check</th>
              <th className="px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="max-sm:block">
            {symptom.checks.map((check, i) => {
              const here = symptom.id === activeId && i === step;
              return (
                <tr key={`${check.look}-${i}`} id={`table-${symptom.id}-${i}`} className={`align-top max-sm:block${here ? " bg-blue-soft" : ""}`}>
                  <td className="border-t border-line px-3 py-2 font-semibold text-ink wrap-anywhere max-sm:block max-sm:pb-0">{check.look}</td>
                  <td className="border-t border-line px-3 py-2 text-ink wrap-anywhere max-sm:block max-sm:border-t-0 max-sm:pt-1">{scopedLine(check.action, year)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Filter({ on, children, onClick }: { on: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`min-h-11 min-w-11 shrink-0 rounded-full border px-3 text-sm font-semibold ${on ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet text-ink"}`}
    >
      {children}
    </button>
  );
}
