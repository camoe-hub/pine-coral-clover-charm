import { useEffect, useState } from "react";
import { figureApplies, figureById, figures } from "@/data/figures";
import type { Jump } from "@/data/graph";
import { modelById } from "@/data/models";
import { coachYear } from "@/data/coach";
import { useApp } from "@/lib/store";
import { circuitSheet, type CircuitSheet } from "@/data/circuit-sheets";
import { cadenceLabel, tasks } from "@/data/schedule";
import { Kicker, PageTitle } from "@/components/ui";

const order = ["Schedule", "Wheels, tires, and brakes", "Water and the body", "Heat and power", "Schematics", "Flowcharts", "Decision charts", "Where things are"];

function DiagramsGone() {
  return (
    <div>
      <Kicker>Not in this edition</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Diagrams</PageTitle>
      <p className="mt-3 text-base text-ink">The pictures are not in this copy. The checks are written out on Fix and in Procedures. The drawing, if you need it, is in the manual for this coach.</p>
    </div>
  );
}

export function FiguresView() {
  const push = useApp((s) => s.push);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const [all, setAll] = useState(false);
  const shown = all ? figures : figures.filter((f) => figureApplies(f.id, model, year));
  const hidden = figures.filter((f) => !figureApplies(f.id, model, year)).length;
  if (!figures.length) return <DiagramsGone />;
  return (
    <div>
      <Kicker>From the guide</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Figures</PageTitle>
      <p className="mt-1 text-sm text-muted">
        {all ? "Every chart in the guide." : `Charts for this ${model.short}.`}
      </p>
      {hidden > 0 && (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-2 min-h-11 text-sm font-semibold text-accent">
          {all ? `Only this ${model.short}` : `Show all diagrams`}
        </button>
      )}
      {order.map((group) => {
        const items = shown.filter((f) => f.group === group);
        if (!items.length) return null;
        return (
          <section key={group} className="mt-5">
            <h2 className="px-1 font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">{group}</h2>
            <ul className="mt-2 space-y-2">
              {items.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => push({ name: "figure", id: f.id })}
                    className="flex w-full items-center gap-3 rounded-card border border-line bg-sheet p-2 text-left"
                  >
                    {f.src ? (
                      <img src={f.src} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-line bg-paper object-contain" />
                    ) : (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-paper px-1 text-center text-sm font-semibold leading-tight text-ink">
                        {figureMark(f.num)}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{f.num}</span>
                      <span className="mt-0.5 block text-sm font-semibold text-ink">{f.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function AlsoInBook({ items }: { items: Jump[] }) {
  const push = useApp((s) => s.push);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const shown = items.filter((item) => item.to.name !== "figure" || figureApplies(item.to.id, model, year));
  if (!shown.length) return null;
  return (
    <details open className="rounded-card border border-line bg-sheet">
      <summary className="flex min-h-12 cursor-pointer list-none items-center px-3 py-2 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold text-ink">Related</span>
      </summary>
      <ul className="space-y-1 px-2 pb-2">
        {shown.map((item) => (
          <li key={item.key}>
            <button type="button" onClick={() => push(item.to)} className="min-h-11 w-full rounded-lg px-2 py-2 text-left">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{item.detail}</span>
              <span className="block text-sm font-semibold text-ink">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function FigureView({ id }: { id: string }) {
  const fig = figureById(id);
  const sheet = circuitSheet(id);
  const [scale, setScale] = useState(1);
  if (!fig) return <DiagramsGone />;
  const wide = scale > 1;
  return (
    <div>
      <Kicker>{fig.group}</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">{fig.num}</PageTitle>
      <p className="mt-1 text-base text-ink">{fig.title}</p>
      {fig.id === "p14-1" ? (
        <>
          <p className="mt-3 text-sm text-ink">The chart is a picture of type that is too small to read. These are the same intervals.</p>
          <ul className="mt-3 divide-y divide-rule overflow-hidden rounded-card border border-line bg-sheet">
            {tasks.map((task) => (
              <li key={task.id} className="px-3 py-3">
                <p className="font-semibold text-ink">{task.title}</p>
                <p className="mt-0.5 text-sm text-ink">{cadenceLabel(task.cadence)}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy" onClick={() => setScale((n) => Math.min(3, Math.round((n + 0.5) * 10) / 10))} aria-label="Make this diagram larger">
          Larger
        </button>
        <button type="button" className="min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink disabled:opacity-40" disabled={!wide} onClick={() => setScale(1)}>
          Fit
        </button>
      </div>
      {sheet ? (
        <CircuitTable sheet={sheet} scale={scale} />
      ) : (
        <div className="mt-3 overflow-auto rounded-card border border-line bg-sheet" style={{ touchAction: "pinch-zoom" }}>
          <img src={fig.src} alt={fig.title} style={{ width: `${scale * 100}%`, maxWidth: "none", touchAction: "pinch-zoom" }} className="block h-auto" />
        </div>
      )}
      <p className="mt-2 text-sm text-muted">
        {sheet ? "Larger only makes this table easier to read. It is not a factory page." : "The title above is the text. Larger only magnifies the drawing. It is not a factory page."}
      </p>
        </>
      )}
      <div className="mt-4">
        <FigureJumps id={id} />
      </div>
    </div>
  );
}

function figureMark(num: string) {
  const match = /([0-9]+(?:\.[0-9]+)?[a-z]?)/i.exec(num);
  return match?.[1] ?? num;
}

function CircuitTable({ sheet, scale }: { sheet: CircuitSheet; scale: number }) {
  return (
    <div className="mt-3 min-w-0 text-ink" style={{ fontSize: `${scale}em` }}>
      <h2 className="font-display text-xl text-ink">{sheet.heading}</h2>
      {sheet.sections.map((section) => (
        <section key={section.label} className="mt-3 min-w-0 overflow-hidden rounded-card border border-line bg-sheet">
          <h3 className="bg-paper px-3 py-2 text-[0.875em] font-semibold text-ink">{section.label}</h3>
          <ul>
            {section.rows.map((row) => (
              <li key={`${section.label}-${row.circuit}`} className="min-w-0 border-t border-line px-3 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="min-w-0 font-semibold">Circuit {row.circuit}</p>
                  <p className="shrink-0 text-right text-[0.875em]">
                    <span className="mr-1 font-semibold uppercase tracking-wider text-muted">Amps</span>
                    <span className="font-semibold tabular-nums">{row.amps}</span>
                  </p>
                </div>
                <p className="mt-1 text-[0.875em]">{row.loads}</p>
                <p className="mt-1 text-[0.875em] text-muted">{row.breaker} · Romex {row.romex}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-2 text-[0.875em] text-muted">{sheet.note}</p>
    </div>
  );
}

function FigureJumps({ id }: { id: string }) {
  const [items, setItems] = useState<Jump[] | null>(null);
  useEffect(() => {
    let live = true;
    void import("@/data/graph")
      .then((mod) => {
        if (live) setItems(mod.jumpsForFigure(id));
      })
      .catch(() => {
        if (live) setItems([]);
      });
    return () => {
      live = false;
    };
  }, [id]);
  if (!items) return null;
  return <AlsoInBook items={items} />;
}

export function SheetView(_props: { page?: number }) {
  return <FiguresView />;
}
