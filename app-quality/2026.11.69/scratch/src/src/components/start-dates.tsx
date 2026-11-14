import { useState } from "react";
import { coachYear, procedureFits } from "@/data/coach";
import { modelById } from "@/data/models";
import { tasks } from "@/data/schedule";
import { dueOf, useApp } from "@/lib/store";
import { jobMark } from "@/lib/tires";
import { todayIso } from "@/lib/date";

/** Shown when no due date can be calculated yet. */
export function unsetScheduleCopy(count: number): { title: string; body: string } | null {
  if (count < 1) return null;
  const need = count === 1 ? "1 maintenance item needs" : `${count} maintenance items need`;
  return {
    title: "Maintenance schedule not established",
    body: `${need} a starting date before due dates can be calculated.`,
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthCells(year: number, month: number) {
  const start = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < start; i += 1) cells.push(null);
  for (let day = 1; day <= count; day += 1) cells.push(day);
  return cells;
}

export function DayPicker({ iso, onPick }: { iso?: string; onPick: (stamp: string) => void }) {
  const today = todayIso();
  const [cursor, setCursor] = useState((iso || today).slice(0, 7));
  const [year, month] = cursor.split("-").map(Number);
  const cells = monthCells(year, month - 1);

  function shift(by: number) {
    const next = new Date(year, month - 1 + by, 1);
    const stamp = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
    if (stamp > today.slice(0, 7)) return;
    if (next.getFullYear() < new Date().getFullYear() - 40) return;
    setCursor(stamp);
  }

  return (
    <div className="mt-2 rounded-[18px] border border-line bg-paper p-3">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} className="min-h-11 min-w-11 text-sm font-semibold text-ink" aria-label="Previous month">
          Prev
        </button>
        <p className="text-sm font-semibold text-ink">
          {MONTHS[month - 1]} {year}
        </p>
        <button type="button" onClick={() => shift(1)} className="min-h-11 min-w-11 text-sm font-semibold text-ink" aria-label="Next month">
          Next
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={`${day}${index}`}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) return <span key={`e${index}`} />;
          const stamp = `${cursor}-${String(day).padStart(2, "0")}`;
          const ahead = stamp > today;
          const picked = stamp === iso;
          return (
            <button
              key={stamp}
              type="button"
              disabled={ahead}
              onClick={() => onPick(stamp)}
              className={`min-h-11 rounded-full text-sm font-semibold ${picked ? "bg-navy text-on-navy" : ahead ? "text-muted" : "text-ink"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** One date for every maintenance job that does not have one yet. */
export function StartAllDates({ onSeparate }: { onSeparate?: () => void }) {
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const done = useApp((s) => s.done);
  const tires = useApp((s) => s.tires);
  const odo = useApp((s) => s.odometer);
  const [open, setOpen] = useState(false);
  const ids = tasks
    .filter((task) => {
      if (task.fit === "classic" && !model.alde && model.family !== "Other") return false;
      if (task.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
      if (task.procedureId && !procedureFits(task.procedureId, model, year)) return false;
      return dueOf(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "unset";
    })
    .map((task) => task.id);
  const count = ids.length;

  return (
    <div>
      <p className="text-sm text-ink">
        <span className="font-semibold">
          {count === 0 ? "Every dated job already has a start date." : count === 1 ? "1 job has no start date." : `${count} jobs have no start date.`}
        </span>{" "}
        {count === 0
          ? "A new date does not replace one. Mile-only checks stay on the odometer."
          : "One date starts all of them. Each of those jobs gets a line in the service log. A job that already has a date stays as it is. Mile-only checks stay on the odometer."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy"
        >
          Set one date for all
        </button>
        {onSeparate ? (
          <button type="button" onClick={onSeparate} className="min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink">
            Set them separately
          </button>
        ) : null}
      </div>
      {open ? (
        <DayPicker
          onPick={(stamp) => {
            void useApp.getState().setStartDates(ids, stamp);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
