import { useEffect, useState } from "react";
import { figureApplies, figureById, figures } from "@/data/figures";
import type { Jump } from "@/data/graph";
import { modelById } from "@/data/models";
import { coachYear } from "@/data/coach";
import { useApp } from "@/lib/store";
import { circuitSheet, type CircuitSheet } from "@/data/circuit-sheets";
import { cadenceLabel, tasks } from "@/data/schedule";
import { Kicker } from "@/components/ui";

const order = ["Schedule", "Wheels, tires, and brakes", "Water and the body", "Heat and power", "Schematics", "Flowcharts", "Decision charts", "Where things are"];

export function FiguresView() {
  const push = useApp((s) => s.push);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const [all, setAll] = useState(false);
  const shown = all ? figures : figures.filter((f) => figureApplies(f.id, model, year));
  const hidden = figures.filter((f) => !figureApplies(f.id, model, year)).length;
  return (
    <div>
      <Kicker>From the guide</Kicker>
      <h1 className="mt-1 font-display text-3xl text-ink">Figures</h1>
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
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-paper px-1 text-center text-sm font-semibold leading-tight text-ink">
                      {figureMark(f.num)}
                    </span>
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
  if (!fig) return <p className="text-sm text-muted">That figure is not in this edition.</p>;
  const wide = scale > 1;
  return (
    <div>
      <Kicker>{fig.group}</Kicker>
      <h1 className="mt-1 font-display text-3xl text-ink">{fig.num}</h1>
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
    <div className="mt-3 overflow-x-auto rounded-card border border-line bg-sheet" style={{ fontSize: `${scale}em` }}>
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm text-ink">
        <caption className="px-3 py-3 text-left font-display text-xl text-ink">{sheet.heading}</caption>
        <thead>
          <tr className="bg-navy text-on-navy">
            <th scope="col" className="px-2 py-2 font-semibold">Circuit</th>
            <th scope="col" className="px-2 py-2 font-semibold">Breaker</th>
            <th scope="col" className="px-2 py-2 font-semibold">Romex</th>
            <th scope="col" className="px-2 py-2 font-semibold">Loads</th>
            <th scope="col" className="px-2 py-2 text-right font-semibold">Amps</th>
          </tr>
        </thead>
        <tbody>
          {sheet.sections.flatMap((section) => [
            <tr key={section.label} className="bg-paper">
              <th scope="colgroup" colSpan={5} className="px-2 py-2 text-left font-semibold text-ink">
                {section.label}
              </th>
            </tr>,
            ...section.rows.map((row) => (
              <tr key={`${section.label}-${row.circuit}`} className="border-t border-line">
                <th scope="row" className="px-2 py-2 align-top font-semibold">{row.circuit}</th>
                <td className="px-2 py-2 align-top">{row.breaker}</td>
                <td className="px-2 py-2 align-top">{row.romex}</td>
                <td className="px-2 py-2 align-top">{row.loads}</td>
                <td className="px-2 py-2 text-right align-top tabular-nums">{row.amps}</td>
              </tr>
            )),
          ])}
        </tbody>
      </table>
      <p className="px-3 py-2 text-sm text-muted">{sheet.note}</p>
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
