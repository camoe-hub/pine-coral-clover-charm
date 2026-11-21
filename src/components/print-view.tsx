import { useMemo, useState } from "react";
import { Btn, PageTitle } from "@/components/ui";
import { Printer } from "lucide-react";
import { symptoms, systems } from "@/data/symptoms";
import { causes, causeFits } from "@/data/causes";
import { modelById } from "@/data/models";
import { coachYear, symptomOn } from "@/data/coach";
import { scopedLine } from "@/lib/year-scope";
import { useApp } from "@/lib/store";

const levelWord = { stop: "Stop", soon: "Soon", watch: "Watch" } as const;

export function PrintView() {
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const [onlyMine, setOnlyMine] = useState(true);
  const [system, setSystem] = useState("");

  const groups = useMemo(() => {
    const rows = symptoms.filter((s) => {
      if (system && s.system !== system) return false;
      if (!onlyMine) return true;
      return symptomOn(s, model, year);
    });
    return systems
      .map((name) => ({ name, items: rows.filter((s) => s.system === name) }))
      .filter((g) => g.items.length > 0);
  }, [onlyMine, system, model, year]);

  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="print-sheet max-w-full overflow-x-hidden">
      <div className="no-print mb-4 space-y-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy px-4 font-semibold text-on-navy"
        >
          <Printer className="size-5" aria-hidden />
          Print or save as PDF
        </button>
        <p className="text-sm text-muted">On iPhone: Print, then choose a printer or Save to Files. The tabs and this button stay off the page.</p>
        <Btn variant="text" type="button" role="checkbox" aria-checked={onlyMine} onClick={() => setOnlyMine((v) => !v)}>
          <span className={`grid size-5 place-items-center rounded border ${onlyMine ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet"}`}>
            {onlyMine ? "✓" : ""}
          </span>
          Only jobs that fit {model.short}
        </Btn>
        <div className="chip-row flex max-w-full gap-2 overflow-x-auto pb-1">
          <Filter on={system === ""} onClick={() => setSystem("")}>
            All systems
          </Filter>
          {systems.filter((name) => symptoms.some((s) => s.system === name && symptomOn(s, model, year, onlyMine))).map((name) => (
            <Filter key={name} on={system === name} onClick={() => setSystem(system === name ? "" : name)}>
              {name}
            </Filter>
          ))}
        </div>
      </div>

      <header className="border-b border-ink pb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">RivetCare · symptom, then check, then action</p>
        <PageTitle className="mt-1 text-3xl text-ink">Symptom checklist</PageTitle>
        <p className="mt-1 text-sm text-ink">
          {model.name}
          {onlyMine ? " · this coach only" : " · every system in the book"} · {count} symptoms
        </p>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <p>Date ______________</p>
          <p>Miles _____________</p>
          <p>Site ______________</p>
          <p>Initials __________</p>
        </div>
      </header>

      {system === "" && (
        <section className="mt-4">
          <h2 className="border-b border-line pb-1 text-xl text-accent">More than one thing is wrong</h2>
          <p className="mt-1 text-sm text-ink">If you see more than one of these, start with the cause under them.</p>
          <ul className="mt-2 space-y-2 text-sm text-ink">
            {(onlyMine ? causes.filter((c) => causeFits(c, model, year)) : causes).map((c) => (
              <li key={c.id}>
                <p>{c.signs.join(" · ")}</p>
                <p className="font-semibold">{c.cause}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.name} className="mt-4">
          <h2 className="border-b border-line pb-1 text-xl text-accent">{group.name}</h2>
          <ul className="mt-2 space-y-3">
            {group.items.map((symptom) => (
              <li key={symptom.id} className="print-symptom">
                <p className="flex items-start gap-2 font-semibold text-ink">
                  <Box />
                  <span className="min-w-0 break-words">
                    {symptom.title}
                    <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-muted">{levelWord[symptom.level]}</span>
                  </span>
                </p>
                <ol className="mt-1 space-y-1 pl-6">
                  {symptom.checks.map((check, index) => (
                    <li key={`${symptom.id}-${index}`} className="flex items-start gap-2 text-sm">
                      <Box />
                      <span className="min-w-0 break-words">
                        <span className="font-semibold">{check.look}. </span>
                        {scopedLine(check.action, year)}
                      </span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-6 border-t border-line pt-3 text-sm text-muted">
        Work the checks in order. Stop means do not keep going until that one is fixed. Soon means it is close. Watch means look, not that it failed. Your model-year owner’s manual governs. Owner-reported steps are one person’s experience.
      </p>
    </div>
  );
}

function Box() {
  return <span className="print-box" aria-hidden />;
}

function Filter({ on, children, onClick }: { on: boolean; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 shrink-0 rounded-full border px-3 text-sm font-semibold ${on ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet text-ink"}`}
    >
      {children}
    </button>
  );
}
