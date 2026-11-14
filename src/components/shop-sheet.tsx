import { Printer } from "lucide-react";
import { PageTitle } from "@/components/ui";
import { modelById } from "@/data/models";
import { tasks } from "@/data/schedule";
import { procedureFits, coachYear } from "@/data/coach";
import { dueOf, dueWhy, serviceTotal, useApp, type LogEntry } from "@/lib/store";
import { formatWhen } from "@/lib/date";
import { PLATE_FIELDS } from "@/lib/plates";
import { WHEELS, jobMark, lowWheels, oldestTire, tireAges, treadNeedsReplace, sideNeedsReplace } from "@/lib/tires";

export function ShopSheet() {
  const model = modelById(useApp((s) => s.modelId));
  const vin = useApp((s) => s.vin);
  const odo = useApp((s) => s.odometer);
  const done = useApp((s) => s.done);
  const tires = useApp((s) => s.tires);
  const dealer = useApp((s) => s.dealer);
  const dealerAddress = useApp((s) => s.dealerAddress);
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const nickname = useApp((s) => s.nickname);
  const plates = useApp((s) => s.plates);
  const log = useApp((s) => s.log);
  const ages = tireAges(tires);
  const oldest = oldestTire(tires);
  const due = tasks.filter((t) => {
    if (t.fit === "classic" && !model.alde && model.family !== "Other") return false;
    if (t.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
    if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
    const state = dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
    return state === "due" || state === "unset";
  });
  const notes = log.filter((entry) => !entry.note.startsWith("Path taken")).slice(0, 8);
  const diagnostics = log.filter((entry) => entry.note.startsWith("Path taken")).slice(0, 3);
  const equipment = PLATE_FIELDS.map((field) => ({ label: field.label, value: plates[field.key] })).filter((row) => row.value);

  return (
    <div className="print-sheet">
      <div className="no-print mb-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy px-4 font-semibold text-on-navy"
        >
          <Printer className="size-5" aria-hidden />
          Print or save as PDF
        </button>
        <p className="mt-2 text-sm text-muted">One page for the shop. Print, then choose Save as PDF. The full history is the CSV on the service log. This is a record, not a work order.</p>
      </div>
      <PageTitle className="font-display text-3xl text-ink">{nickname || model.name}</PageTitle>
      <p className="mt-1 text-sm text-ink">{model.name}{year ? ` · ${year}` : " · Year not set"}</p>
      <p className="text-sm text-ink">{vin ? `VIN ${vin}` : "VIN not entered"}</p>
      <p className="text-sm text-ink">{odo > 0 ? `${odo.toLocaleString()} trailer miles` : "Trailer miles not set"}</p>
      {dealer || dealerAddress ? (
        <p className="text-sm text-ink">
          Dealer: {dealer || "Saved"}
          {dealerAddress ? ` · ${dealerAddress}` : ""}
          {(dealer || dealerAddress) && (
            <>
              {" · "}
              <a className="font-semibold text-accent" href={`https://maps.apple.com/?q=${encodeURIComponent([dealer, dealerAddress].filter(Boolean).join(", "))}`} target="_blank" rel="noreferrer">
                Map
              </a>
            </>
          )}
        </p>
      ) : null}

      <h2 className="mt-5 font-display text-xl text-ink">Installed equipment</h2>
      {equipment.length === 0 ? (
        <p className="mt-1 text-sm text-ink">No appliance plates saved. Read them off the units in Glovebox.</p>
      ) : (
        <ul className="mt-1 text-sm text-ink">
          {equipment.map((row) => (
            <li key={row.label}>{row.label}: {row.value}</li>
          ))}
        </ul>
      )}

      <h2 className="mt-5 font-display text-xl text-ink">Diagnostic results</h2>
      {diagnostics.length === 0 ? (
        <p className="mt-1 text-sm text-ink">No flowchart report is in the log. A saved flowchart report is a path taken, not a diagnosis.</p>
      ) : (
        <ul className="mt-1 space-y-2 text-sm text-ink">
          {diagnostics.map((entry) => (
            <li key={entry.id}>
              <Visit entry={entry} />
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-5 font-display text-xl text-ink">Tires</h2>
      {tires.psi || tires.dot || tires.on || tires.rotated || oldest || tires.checks.length ? (
        <ul className="mt-1 text-sm text-ink">
          {tires.psi ? <li>Placard cold pressure written down: {tires.psi} psi</li> : <li>Placard pressure not set</li>}
          {tires.rotated ? <li>Last rotation {formatWhen(tires.rotated)}. Same side, front and rear.</li> : null}
          {WHEELS.map((wheel) => {
            const row = tires.wheels[wheel.id];
            if (!row) return <li key={wheel.id}>{wheel.label}: not set</li>;
            const bits = [
              row.dot ? `DOT ${row.dot}` : "DOT not set",
              row.on ? `mounted ${formatWhen(row.on)}` : "",
              row.tread ? (treadNeedsReplace(row.tread) ? `tread ${row.tread === "replace" ? "replace" : `${row.tread}/32, replace`}` : `tread ${row.tread === "ok" ? "ok" : `${row.tread}/32`}`) : "",
              sideNeedsReplace(row.side) ? "sidewall replace" : row.side === "ok" ? "sidewall ok" : "",
            ].filter(Boolean);
            return (
              <li key={wheel.id}>
                {wheel.label}: {bits.join(", ")}
              </li>
            );
          })}
          {oldest && oldest.id !== "set" ? (
            <li>
              Oldest tire: {oldest.label}, DOT {oldest.dot}, about {Math.floor(oldest.years)} years. The 5-year replace follows this tire.
            </li>
          ) : tires.dot ? (
            <li>
              One code for the set, DOT {tires.dot}
              {ages.dotYears != null ? `, about ${Math.floor(ages.dotYears)} years old` : ""}
            </li>
          ) : null}
          {tires.on && (!oldest || oldest.id === "set") ? (
            <li>
              Mounted {formatWhen(tires.on)}
              {ages.onYears != null ? `, about ${Math.floor(ages.onYears)} years on the trailer` : ""}
            </li>
          ) : null}
          {tires.checks[0] ? (
            <li>
              Last cold check {formatWhen(tires.checks[0].on)}
              {tires.checks[0].note ? `, ${tires.checks[0].note}` : ""}
              {lowWheels(tires.psi, tires.checks[0]).length
                ? `. More than 20% under the placard: ${lowWheels(tires.psi, tires.checks[0])
                    .map((id) => WHEELS.find((wheel) => wheel.id === id)?.label)
                    .filter(Boolean)
                    .join(", ")}`
                : ""}
            </li>
          ) : null}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-ink">Tire dates not set.</p>
      )}

      <h2 className="mt-5 font-display text-xl text-ink">Due or never recorded</h2>
      {due.length === 0 ? (
        <p className="mt-1 text-sm text-ink">Nothing on the schedule is due.</p>
      ) : (
        <ul className="mt-1 space-y-1 text-sm text-ink">
          {due.map((t) => (
            <li key={t.id}>
              {t.title}. {dueWhy(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo)}
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-5 font-display text-xl text-ink">Service history</h2>
      {notes.length === 0 ? (
        <p className="mt-1 text-sm text-ink">No service notes yet.</p>
      ) : (
        <ul className="mt-1 space-y-2 text-sm text-ink">
          {notes.map((entry) => (
            <li key={entry.id}>
              <Visit entry={entry} />
            </li>
          ))}
        </ul>
      )}
      {log.length > notes.length + diagnostics.length ? <p className="mt-2 text-sm text-ink">Older visits are in the service log. Export history for the full CSV.</p> : null}
    </div>
  );
}

export function OwnerHistory() {
  const model = modelById(useApp((s) => s.modelId));
  const vin = useApp((s) => s.vin);
  const year = coachYear(vin, useApp((s) => s.modelYear));
  const nickname = useApp((s) => s.nickname);
  const odo = useApp((s) => s.odometer);
  const log = useApp((s) => s.log);
  return (
    <div className="print-sheet">
      <div className="no-print mb-4">
        <button type="button" onClick={() => window.print()} className="flex min-h-12 w-full items-center justify-center rounded-full bg-navy px-4 font-semibold text-on-navy">
          Print or save as PDF
        </button>
        <p className="mt-2 text-sm text-muted">This is the service history on this phone. The browser’s print sheet can save it as a PDF. It is a record, not a work order.</p>
      </div>
      <PageTitle className="font-display text-3xl text-ink">{nickname || model.name}</PageTitle>
      <p className="mt-1 text-sm text-ink">
        {model.name}
        {year ? ` · ${year}` : ""}
      </p>
      <p className="text-sm text-ink">{vin ? `VIN ${vin}` : "VIN not entered"}</p>
      <p className="text-sm text-ink">{odo > 0 ? `${odo.toLocaleString()} trailer miles` : "Trailer miles not set"}</p>
      <h2 className="mt-5 font-display text-xl text-ink">Service history</h2>
      {log.length === 0 ? (
        <p className="mt-1 text-sm text-ink">No service records yet.</p>
      ) : (
        <ul className="mt-1 space-y-3 text-sm text-ink">
          {log.map((entry) => (
            <li key={entry.id}>
              <Visit entry={entry} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Visit({ entry }: { entry: LogEntry }) {
  const bits = [
    entry.work ? `Work: ${entry.work}` : "",
    entry.provider ? `Shop: ${entry.provider}` : "",
    entry.parts ? `Parts: ${entry.parts}` : "",
    entry.partsCost ? `Parts cost: ${entry.partsCost}` : "",
    entry.laborCost ? `Labor: ${entry.laborCost}` : "",
    entry.cost || serviceTotal(entry.partsCost, entry.laborCost) ? `Total: ${entry.cost || serviceTotal(entry.partsCost, entry.laborCost)}` : "",
    entry.warranty ? `Warranty: ${entry.warranty}` : "",
    entry.tech ? `Technician: ${entry.tech}` : "",
    entry.note ? entry.note : "",
  ].filter(Boolean);
  return (
    <>
      <span className="tabular-nums">{formatWhen(entry.iso)}</span>
      {entry.miles ? ` · ${entry.miles.toLocaleString()} mi` : ""}
      {entry.job ? `. ${entry.job}` : ""}
      {bits.length ? `. ${bits.join(". ")}` : ""}
    </>
  );
}
