import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, ClipboardList, ListChecks } from "lucide-react";
import { coachYear, procedureBanner, procedureFits } from "@/data/coach";
import { modelById } from "@/data/models";
import { procedureById } from "@/data/procedures";
import { cadenceLabel, tasks, type Task } from "@/data/schedule";
import { textHasWords, wordsOf } from "@/data/words";
import { dueOf, dueWhy, maintainBand, nextDue, pickNextTask, retorqueWatch, serviceWindow, soonWhy, useApp, type LogFile } from "@/lib/store";
import { deleteFile, getFile, prepareFile, putFile } from "@/lib/files";
import { formatWhen, todayIso } from "@/lib/date";
import { datedJobs, icsFor } from "@/lib/calendar";
import { MilesCard } from "@/components/miles-card";
import { CoachRecordLinks } from "@/components/records-view";
import { DayPicker, StartAllDates, unsetScheduleCopy } from "@/components/start-dates";
import { StepMark } from "@/components/step-mark";
import { ScopedCopy } from "@/components/scoped-copy";
import { Btn, Card, Kicker, Notice, Pill } from "@/components/ui";
import { AlsoInBook } from "@/components/figure-view";
import { jumpsForProcedure } from "@/data/graph";
import { jobMark, oldestTire } from "@/lib/tires";
import { DotWidget, LugWidget, ValveWidget } from "@/components/widgets";

function fitsTask(fit: "classic" | "gt" | undefined, model: { alde: boolean; family: string }) {
  if (fit === "classic" && !model.alde && model.family !== "Other") return false;
  if (fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
  return true;
}

export function CareView() {
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const done = useApp((s) => s.done);
  const tires = useApp((s) => s.tires);
  const odo = useApp((s) => s.odometer);
  const logFull = useApp((s) => s.log.length) >= 200;
  const push = useApp((s) => s.push);
  const wheelOff = useApp((s) => s.wheelOff);
  const lugAck = useApp((s) => s.lugAck);
  const [band, setBand] = useState<"dash" | "due" | "unset" | "trip">("dash");
  const [q, setQ] = useState("");

  const watch = useMemo(() => {
    const mine = tasks.filter((t) => {
      if (!fitsTask(t.fit, model)) return false;
      if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
      return true;
    });
    return {
      overdue: mine.filter((t) => dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "due").length,
      soon: mine.filter((t) => {
        const where = maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
        return where === "days" || where === "miles";
      }).length,
      trip: mine.filter((t) => dueOf(t.cadence, done[t.id], odo) === "trip").length,
      unset: mine.filter((t) => dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "unset").length,
    };
  }, [model, year, done, odo, tires]);

  const mine = tasks.filter((t) => fitsTask(t.fit, model) && (!t.procedureId || procedureFits(t.procedureId, model, year)));
  const lug = retorqueWatch(wheelOff, odo, Boolean(done.retorque), lugAck);
  const retorqueOn = lug.upcoming.length > 0 || lug.missed.length > 0;
  const rows = useMemo(() => {
    const words = wordsOf(q);
    return tasks.filter((t) => {
      if (!fitsTask(t.fit, model)) return false;
      if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
      const state = dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
      if (band === "due" && state !== "due" && maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) !== "days" && maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) !== "miles" && !(t.id === "retorque" && retorqueOn)) return false;
      if (band === "unset" && state !== "unset") return false;
      if (band === "trip" && (state !== "trip" || (t.id === "retorque" && retorqueOn))) return false;
      if (!words.length) return true;
      const proc = t.procedureId ? procedureById(t.procedureId)?.title ?? "" : "";
      return textHasWords(`${t.title} ${t.system} ${t.detail} ${cadenceLabel(t.cadence)} ${proc}`, words);
    });
  }, [model, year, done, odo, tires, band, q, retorqueOn]);
  const picked = pickNextTask(
    mine.map((t) => ({ id: t.id, cadence: t.cadence, mark: jobMark(t.id, done[t.id], tires, odo) })),
    odo,
  );
  const urgent = picked && picked.why !== "next" ? mine.find((t) => t.id === picked.id) ?? null : null;
  const hero = urgent ?? (retorqueOn ? mine.find((t) => t.id === "retorque") ?? null : null);
  const trips = mine.filter((t) => t.cadence.type === "trip" && t.id !== hero?.id);
  const groups = {
    overdue: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "overdue" && t.id !== hero?.id),
    days: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "days" && t.id !== hero?.id),
    miles: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "miles" && t.id !== hero?.id),
    recent: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "recent"),
    none: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "none"),
    later: mine.filter((t) => maintainBand(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) === "later"),
  };
  const showList = band !== "dash" || q.trim().length > 0;
  const dueCount = watch.overdue + watch.soon + (retorqueOn ? 1 : 0);
  const tripCount = Math.max(0, watch.trip - (retorqueOn ? 1 : 0));
  const unestablished = !picked && !retorqueOn && watch.unset > 0;
  const unsetCopy = unestablished ? unsetScheduleCopy(watch.unset) : null;

  async function addDates() {
    const jobs = datedJobs(
      mine.map((task) => ({ id: task.id, title: task.title, cadence: task.cadence })),
      Object.fromEntries(mine.map((task) => [task.id, jobMark(task.id, done[task.id], tires, odo)])),
    );
    if (!jobs.length) {
      useApp.getState().flash("No dated jobs yet. Mile checks are not on the calendar.");
      return;
    }
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const file = new File([icsFor(jobs, stamp)], "rivetcare-dates.ics", { type: "text/calendar" });
    const can = navigator.canShare?.({ files: [file] }) ?? false;
    if (navigator.share && can) {
      try {
        await navigator.share({ files: [file], title: "rivetcare-dates.ics" });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rivetcare-dates.ics";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  return (
    <div>
      {logFull ? <p className="text-sm font-semibold text-ink">The service log is full at 200. Marking a job done removes the oldest entry and its photos. Undo puts that entry back.</p> : null}
      <div className="chip-row -mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Which jobs">
        {(
          [
            ["due", dueCount === 1 ? "Due 1 task" : `Due ${dueCount} tasks`],
            ["trip", tripCount === 1 ? "Every trip 1 task" : `Every trip ${tripCount} tasks`],
            ["unset", `Needs a date ${watch.unset}`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={band === id}
            onClick={() => setBand(band === id ? "dash" : id)}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 text-sm font-semibold ${band === id ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="sr-only" htmlFor="care-search">Search maintenance</label>
      <input
        id="care-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tires, bearings, winterize…"
        inputMode="search"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="mt-3 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
      />
      <button type="button" onClick={() => void addDates()} className="mt-3 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink">
        Add dates to Calendar
      </button>
      <p className="mt-1 text-sm text-muted">One date each, from the last time you marked the job. Nothing repeats. Mile checks and lug re-torque are left out. Delete older RivetCare events on the phone before you add this file.</p>
      <div className="mt-4">
        <MilesCard bare quiet />
      </div>
      {band === "due" ? <p className="mt-2 text-sm text-muted">Due is overdue, plus the last 30 days or the last 500 miles of a longer interval. A monthly job stays off that list until it is due. This is not a new factory interval.</p> : null}
      {retorqueOn && hero?.id !== "retorque" ? (
        <p className={`mt-3 text-sm font-semibold ${lug.upcoming.length ? "text-caution" : "text-signal"}`}>
          {lug.upcoming.length ? `Lug re-torque, ${lug.upcoming[0].left.toLocaleString()} mi left` : "Lug re-torque is past the 50 mile check"}
        </p>
      ) : null}

      {showList ? (
        <>
          <CareShortcuts />
          {rows.length === 0 ? (
            <p className="mt-4 text-sm text-muted">{q.trim() ? "Nothing matches that search." : "Nothing in this filter."}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {rows.map((t) => (
                <li key={t.id}>
                  <TaskCard task={t} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          {hero ? (
            <section className="mt-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Due now or soon</p>
              <div className="mt-2">
                <TaskCard task={hero} hero />
              </div>
            </section>
          ) : unsetCopy ? (
            <section className="mt-4">
              <h2 className="font-display text-[1.35rem] leading-tight text-ink">{unsetCopy.title}</h2>
              <p className="mt-1 text-sm text-ink">{unsetCopy.body}</p>
              <div className="mt-3">
                <StartAllDates onSeparate={() => setBand("unset")} />
              </div>
            </section>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Nothing is due.
              {watch.unset > 0
                ? watch.unset === 1
                  ? " 1 item still needs a starting date, so it is not on this list."
                  : ` ${watch.unset} items still need a starting date, so they are not on this list.`
                : ""}
            </p>
          )}
          <CareShortcuts />
          {trips.length > 0 && (
            <section className="mt-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Every trip</p>
              <ul className="mt-2 space-y-2">
                {trips.map((t) => (
                  <li key={t.id}>
                    <TripRow task={t} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <DashList title="Overdue" tasks={groups.overdue} empty="Nothing is overdue." hideEmpty={unestablished || (hero != null && maintainBand(hero.cadence, jobMark(hero.id, done[hero.id], tires, odo), odo) === "overdue")} />
          <DashList title="Due within 30 days" tasks={groups.days} empty="Nothing is due in the next 30 days." compact hideEmpty={unestablished || (hero != null && maintainBand(hero.cadence, jobMark(hero.id, done[hero.id], tires, odo), odo) === "days")} />
          <DashList title="Due within 500 miles" tasks={groups.miles} empty="Nothing is due in the next 500 miles." compact hideEmpty={unestablished || (hero != null && maintainBand(hero.cadence, jobMark(hero.id, done[hero.id], tires, odo), odo) === "miles")} />
          <DashList title="Recently completed" tasks={groups.recent} empty="Nothing was marked in the last 90 days." compact hideEmpty={unestablished} />
          {!unestablished ? <DashList title="No maintenance history" tasks={groups.none} empty="Every dated job has a start." compact /> : null}
          {groups.later.length > 0 && (
            <details className="mt-4 rounded-[18px] border border-line bg-sheet px-4 py-3">
              <summary className="min-h-11 cursor-pointer list-none font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {groups.later.length === 1 ? "1 later job" : `${groups.later.length} later jobs`}
              </summary>
              <ul className="mt-3 space-y-2">
                {groups.later.map((t) => (
                  <li key={t.id}>
                    <TaskCard task={t} />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}

      <div className="mt-5 space-y-3">
        <CoachRecordLinks />
      </div>

      {watch.unset > 0 && !unestablished && (
        <div className="mt-4 rounded-[18px] border border-line bg-sheet px-4 py-3">
          <StartAllDates onSeparate={() => setBand("unset")} />
        </div>
      )}

      <div className="mt-4">
        <Btn className="min-h-14 w-full text-base" onClick={() => push({ name: "log" })}>
          A job that isn’t on this list
        </Btn>
      </div>
      <details className="mt-2">
        <summary className="min-h-11 cursor-pointer list-none text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          How intervals work
        </summary>
        <p className="pb-2 text-sm text-muted">
          Whichever comes first, miles or time. Factory intervals are the warranty minimum. A tighter dealer interval is a suggestion, not a new requirement. The odometer, the check marks, and the service log are stored only on this phone.
        </p>
      </details>
    </div>
  );
}

function DoneDate({ taskId, iso, miles }: { taskId: string; iso?: string; miles?: number }) {
  const setDoneDate = useApp((s) => s.setDoneDate);
  const [open, setOpen] = useState(false);
  const label = iso ? `Last done ${formatWhen(iso)}` : "Set a start date for this job";

  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="min-h-11 w-full rounded-full border border-line bg-paper px-4 text-left text-base text-ink"
      >
        {label}
        {miles ? ` · ${miles.toLocaleString()} mi` : ""}
      </button>
      {open ? (
        <DayPicker
          iso={iso}
          onPick={(stamp) => {
            setDoneDate(taskId, stamp);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function TaskCard({ task, hero = false, nested = false }: { task: Task; hero?: boolean; nested?: boolean }) {
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const done = useApp((s) => s.done);
  const odo = useApp((s) => s.odometer);
  const markDone = useApp((s) => s.markDone);
  const clearDone = useApp((s) => s.clearDone);
  const push = useApp((s) => s.push);
  const wheelOff = useApp((s) => s.wheelOff);
  const lugAck = useApp((s) => s.lugAck);
  const startWheelOff = useApp((s) => s.startWheelOff);
  const tires = useApp((s) => s.tires);
  const stored = done[task.id];
  const mark = jobMark(task.id, stored, tires, odo);
  const oldest = task.id === "tires-replace" ? oldestTire(tires) : null;
  const state = dueOf(task.cadence, mark, odo);
  const soon = soonWhy(task.cadence, mark, odo);
  const lug = task.id === "retorque" ? retorqueWatch(wheelOff, odo, Boolean(mark), lugAck) : null;
  const stages = lug?.upcoming ?? [];
  const missed = lug?.missed ?? [];
  const either = task.cadence.type === "miles" && task.cadence.alsoDays;
  const traveled = lug?.start != null ? Math.max(0, odo - lug.start) : 0;
  const retorqueOpen = stages.length > 0 || missed.length > 0;
  const needsMark = state === "due" || state === "trip" || Boolean(lug?.current) || missed.length > 0;
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        {nested ? <span className="sr-only">{task.title}</span> : (
          <p className={`text-ink ${hero ? "font-display text-[1.35rem] leading-tight" : "font-semibold"}`}>{task.title}</p>
        )}
        {lug?.current ? (
          <span className="shrink-0 rounded-full bg-signal-soft px-2 py-1 text-sm font-semibold text-signal">
            {lug.current} mi check
          </span>
        ) : missed.length ? (
          <span className="shrink-0 rounded-full bg-signal-soft px-2 py-1 text-sm font-semibold text-signal">Past 50 mi</span>
        ) : (
          <Pill tone={state === "due" ? "due" : soon ? "blue" : state === "ok" ? "sage" : state === "trip" ? "navy" : "line"}>
            {state === "due" ? "Due" : soon ? "Soon" : state === "ok" ? "OK" : state === "trip" ? "Trip" : task.cadence.type === "miles" ? "No start" : "No date"}
          </Pill>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        {task.system} · {cadenceLabel(task.cadence)}
        {either ? ", whichever comes first" : ""}
        {task.fit === "classic" ? " · Classic" : task.fit === "gt" ? " · Globetrotter" : ""}
      </p>
      <p className="mt-2 text-sm text-ink">{task.detail}</p>
      {task.id === "retorque" && retorqueOpen && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[5, 10, 25, 50].map((miles) => {
            const passed = lug?.current != null ? miles < lug.current : traveled >= miles;
            const current = lug?.current === miles;
            return (
              <span key={miles} className={`rounded-full px-3 py-1 text-sm font-semibold ${passed ? "bg-sage-soft text-ok" : current ? "bg-navy text-on-navy" : "border border-line text-muted"}`}>
                {miles} mi
              </span>
            );
          })}
        </div>
      )}
      <DoneDate taskId={task.id} iso={stored?.iso} miles={stored?.miles} />
      <ServiceFacts task={task} />
      {task.id === "rotate" && tires.rotated ? (
        <p className="mt-2 text-sm text-ink">Last rotation {formatWhen(tires.rotated)}. Same side, front and rear.</p>
      ) : null}
      {oldest ? (
        <p className="mt-2 text-sm text-ink">
          {oldest.id === "set" ? "One DOT for the set" : `Oldest tire: ${oldest.label}`}, DOT {oldest.dot}, about {Math.floor(oldest.years)} years. The 5-year replace follows this tire. Marking the job done does not move that date.
        </p>
      ) : null}
      {soon && task.id !== "tires-replace" && <p className="mt-1 text-sm tabular-nums text-muted">{soon}</p>}
      {(state === "due" || (state === "unset" && task.cadence.type === "miles")) && task.id !== "tires-replace" && <p className="mt-1 text-sm tabular-nums text-muted">{dueWhy(task.cadence, mark, odo)}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {needsMark ? (
          <Btn className="px-3" onClick={() => markDone(task.id, task.title)}>
            {task.id === "retorque" && lug?.current ? `Mark the ${lug.current} mi check done` : "Mark done today"}
          </Btn>
        ) : null}
        {stored ? (
          <Btn variant="line" className="px-3" onClick={() => clearDone(task.id)}>
            Clear this mark
          </Btn>
        ) : null}
        {task.procedureId && procedureFits(task.procedureId, model, year) && (
          <Btn variant="line" className="px-3" onClick={() => push({ name: "procedure", id: task.procedureId! })}>
            How to
          </Btn>
        )}
        {task.id === "retorque" && odo > 0 && (
          <Btn variant="line" className="px-3" onClick={startWheelOff}>
            {wheelOff !== null ? `Start again at ${odo.toLocaleString()} mi` : `Wheel came off at ${odo.toLocaleString()} mi`}
          </Btn>
        )}
      </div>
      {needsMark && task.cadence.type === "miles" && odo <= 0 && (
        <p className="mt-3 text-sm text-muted">Set trailer miles before you mark this done. A zero-mile mark makes the next interval wrong.</p>
      )}
      {task.id === "retorque" && odo <= 0 && <p className="mt-3 text-sm text-muted">Set the odometer, then start the 5, 10, 25, and 50 mile countdown.</p>}
      {task.id === "retorque" && lug?.start != null && (
        <p className="mt-2 text-sm text-ink">
          Counting from {lug.start.toLocaleString()} mi.{" "}
          {stages.length
            ? stages.map((s) => `${s.miles} mi, ${s.left.toLocaleString()} left`).join(" · ")
            : "The 5, 10, 25, and 50 mile checks are past this reading."}
          {missed.length && stages.length ? ` Earlier checks are past.` : ""}
        </p>
      )}
      <SectionPhotos shotKey={`care:${task.id}`} label="this job" folded summary="Receipt or photo" />
    </>
  );
  if (nested) return body;
  return <Card className="p-4">{body}</Card>;
}

function ServiceFacts({ task }: { task: Task }) {
  const done = useApp((s) => s.done);
  const tires = useApp((s) => s.tires);
  const odo = useApp((s) => s.odometer);
  const setDoneNote = useApp((s) => s.setDoneNote);
  const stored = done[task.id];
  const followed = jobMark(task.id, stored, tires, odo);
  const facts = serviceWindow(task.cadence, followed, odo);
  const recorded = task.id === "tires-replace" ? serviceWindow(task.cadence, stored, odo) : facts;
  const either = task.cadence.type === "miles" && Boolean(task.cadence.alsoDays);
  const [note, setNote] = useState(stored?.note ?? "");
  useEffect(() => {
    setNote(stored?.note ?? "");
  }, [stored?.note, task.id]);
  const rows = [
    recorded.lastDate || recorded.lastMiles ? ["Last completed", [recorded.lastDate, recorded.lastMiles].filter(Boolean).join(" · ")] : null,
    facts.nextDate ? ["Next due", facts.nextDate] : null,
    facts.nextMiles ? ["Next mileage", facts.nextMiles] : null,
  ].filter((row): row is [string, string] => row !== null);
  if (!rows.length && !stored) return null;
  return (
    <div className="mt-3">
      {rows.length > 0 && (
        <dl>
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 py-0.5">
              <dt className="text-sm text-ink">{label}</dt>
              <dd className="text-right text-sm font-semibold tabular-nums text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {either && facts.nextDate && facts.nextMiles ? <p className="mt-1 text-sm text-muted">Whichever comes first. The interval is the one already on this job.</p> : null}
      {stored ? (
        <label className="mt-2 block text-sm font-semibold text-ink" htmlFor={`done-note-${task.id}`}>
          Completion note
          <input
            id={`done-note-${task.id}`}
            value={note}
            maxLength={200}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => void setDoneNote(task.id, note)}
            placeholder="What was done, or the shop"
            className="mt-1 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base font-normal text-ink"
          />
        </label>
      ) : null}
    </div>
  );
}

function DashList({ title, tasks: list, empty, compact = false, hideEmpty = false }: { title: string; tasks: Task[]; empty: string; compact?: boolean; hideEmpty?: boolean }) {
  const done = useApp((s) => s.done);
  const tires = useApp((s) => s.tires);
  const odo = useApp((s) => s.odometer);
  if (!list.length && hideEmpty) return null;
  if (!list.length) {
    return (
      <section className="mt-5">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
        <p className="mt-1 text-sm text-muted">{empty}</p>
      </section>
    );
  }
  return (
    <section className="mt-5">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-2 space-y-2">
        {list.map((task) =>
          compact ? (
            <li key={task.id}>
              <details className="rounded-[18px] border border-line bg-sheet">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-3 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 font-semibold text-ink">{task.title}</span>
                  <DashWhen taskId={task.id} cadence={task.cadence} mark={jobMark(task.id, done[task.id], tires, odo)} odo={odo} />
                </summary>
                <div className="px-3 pb-3">
                  <TaskCard task={task} nested />
                </div>
              </details>
            </li>
          ) : (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ),
        )}
      </ul>
    </section>
  );
}

function DashWhen({ taskId, cadence, mark, odo }: { taskId: string; cadence: Task["cadence"]; mark: { iso: string; miles: number } | undefined; odo: number }) {
  const facts = serviceWindow(cadence, mark, odo);
  const text = !mark && cadence.type === "miles"
    ? "No start"
    : facts.nextDate && facts.nextMiles
      ? `${facts.nextDate} · ${facts.nextMiles}`
      : facts.nextDate || facts.nextMiles || "No date";
  return <span className="shrink-0 text-right text-sm tabular-nums text-muted">{text}</span>;
}

const RECORD_GROUPS: { title: string; ids: string[]; warranty?: boolean }[] = [
  { title: "Bearing service", ids: ["rotate", "brakes-year"] },
  { title: "Brake inspection", ids: ["brakes-year", "breakaway"] },
  { title: "Sealant inspections", ids: ["sealant", "belly"] },
  { title: "Battery work", ids: ["house-year"] },
  { title: "Tire work", ids: ["rotate", "tires-replace", "tires-cold", "retorque"] },
  { title: "Appliance servicing", ids: ["anode", "descale-year", "furnace-season", "ac-filter", "glycol-level", "air-cushion", "glycol-swap", "lp-year"] },
  { title: "Warranty repairs", ids: [], warranty: true },
];

function CareShortcuts() {
  const push = useApp((s) => s.push);
  return (
    <div className="mt-5 space-y-3">
      <button
        type="button"
        onClick={() => push({ name: "procedures" })}
        className="flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok" aria-hidden>
          <ListChecks className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-ink">Procedures</span>
          <span className="block text-sm text-muted">Winterize, bearings, brakes, sealant</span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-muted" aria-hidden />
      </button>
      <OwnershipRecord />
    </div>
  );
}

function OwnershipRecord() {
  const log = useApp((s) => s.log);
  return (
    <details className="rounded-[18px] border border-line bg-sheet">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-3 py-3 [&::-webkit-details-marker]:hidden">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok" aria-hidden>
          <ClipboardList className="size-5" />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-semibold text-ink">Ownership record</span>
          <span className="block text-sm text-muted">What was written down for a buyer</span>
        </span>
      </summary>
      <div className="px-4 pb-4">
      <p className="text-sm text-muted">Marks and log lines already on this phone. A buyer can read what was recorded. It is not a factory history, and an empty group means nothing was written down.</p>
      <div className="mt-3 space-y-4">
        {RECORD_GROUPS.map((group) => {
          const rows = log.filter((entry) => {
            if (group.warranty) return /warranty/i.test(`${entry.job ?? ""} ${entry.note}`);
            return entry.taskId ? group.ids.includes(entry.taskId) : false;
          });
          return (
            <section key={group.title}>
              <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
              {rows.length === 0 ? (
                <p className="mt-1 text-sm text-muted">None recorded.</p>
              ) : (
                <ul className="mt-1">
                  {rows.map((entry) => (
                    <li key={`${group.title}-${entry.id}`} className="flex items-baseline justify-between gap-3 border-b border-rule py-2 last:border-b-0">
                      <span className="min-w-0 text-sm text-ink">{entry.job || entry.note}</span>
                      <span className="shrink-0 text-right text-sm tabular-nums text-muted">
                        {formatWhen(entry.iso)}
                        {entry.miles > 0 ? ` · ${entry.miles.toLocaleString()} mi` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
      </div>
    </details>
  );
}

function TripRow({ task }: { task: Task }) {
  const done = useApp((s) => s.done);
  const markedToday = done[task.id]?.iso === todayIso();
  return (
    <details className="rounded-[18px] border border-line bg-sheet">
      <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-3 [&::-webkit-details-marker]:hidden">
        <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${markedToday ? "border-sage bg-sage text-on-navy" : "border-line text-transparent"}`} aria-hidden>
          <Check className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1 font-semibold text-ink">{task.title}</span>
      </summary>
      <div className="px-1 pb-3 pt-2">
        <TaskCard task={task} nested />
      </div>
    </details>
  );
}

export function ProcedureView({ id }: { id: string }) {
  const p = procedureById(id);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const done = useApp((s) => s.done);
  const tires = useApp((s) => s.tires);
  const odo = useApp((s) => s.odometer);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (id !== "winterize") return;
    const trail = useApp.getState().winterPlace?.trail ?? [];
    useApp.getState().setWinterPlace({ page: "procedure", trail });
  }, [id]);
  if (!p) return <p className="text-sm text-muted">That procedure is not in this edition.</p>;
  const banner = procedureBanner(id, model, year);
  const linked = tasks.filter((t) => t.procedureId === id && fitsTask(t.fit, model) && procedureFits(id, model, year));
  const words = wordsOf(q);
  const steps = p.steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => !words.length || textHasWords(`${step.title} ${step.body}`, words));
  return (
    <div className="space-y-4">
      <div>
        <Kicker>{p.system}</Kicker>
        <h1 className="mt-1 font-display text-3xl text-ink">{p.title}</h1>
        {p.source ? <p className="mt-2 text-sm text-ink">Source: <ScopedCopy text={p.source} year={year} /></p> : <p className="mt-2 text-sm text-muted">Factory specification and owner notes are marked in the steps. The model-year manual governs.</p>}
        {p.revised ? <p className="mt-1 text-sm text-muted">Last checked {p.revised}. Not a factory revision date.</p> : null}
      </div>
      {banner && <Card className="p-4 text-sm text-ink">{banner}</Card>}
      {linked.length > 0 && (
        <Card className="p-4 text-sm text-ink">
          <p className="font-semibold">Miles and time</p>
          <ul className="mt-2 space-y-3">
            {linked.map((t) => {
              const mark = jobMark(t.id, done[t.id], tires, odo);
              const next = nextDue(t.cadence, mark, odo);
              const either = t.cadence.type === "miles" && t.cadence.alsoDays;
              return (
                <li key={t.id}>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-muted">
                    {cadenceLabel(t.cadence)}
                    {either ? ", whichever comes first" : ""}
                  </p>
                  {mark ? (
                    <p className="tabular-nums text-muted">
                      Last {formatWhen(mark.iso)}
                      {mark.miles ? ` · ${mark.miles.toLocaleString()} mi` : ""}
                    </p>
                  ) : (
                    <p className="text-muted">Not marked yet.</p>
                  )}
                  {next ? <p className="tabular-nums">{next}</p> : null}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      {p.caution && <Notice tone="caution" title="Caution"><ScopedCopy text={p.caution} year={year} /></Notice>}
      {p.tools && (
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">Tools. </span>
          {p.tools}
        </p>
      )}
      {p.widget === "lugs" && <LugWidget />}
      {p.widget === "valves" && <ValveWidget />}
      {p.widget === "dot" && <DotWidget />}
      <button
        type="button"
        className="min-h-11 text-sm font-semibold text-accent"
        onClick={() => {
          const text = `Possible error in “${p.title}.” ${p.revised ? `Last checked ${p.revised}. ` : ""}Write what disagrees with the manual or the plate. This note stays on the phone.`;
          void Promise.resolve(useApp.getState().addNote(text)).then((ok) => {
            useApp.getState().flash(ok === false ? "Could not save that note." : "Saved in notes. Nothing is sent.");
          });
        }}
      >
        Report an error in this procedure
      </button>
      <div>
        <label className="block text-sm font-semibold text-ink" htmlFor="step-search">
          Search these steps
        </label>
        <input
          id="step-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="A step, a tool, or a part"
          inputMode="search"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
        />
      </div>
      {steps.length === 0 && <p className="text-sm text-muted">No step matches that.</p>}
      {steps.length > 0 && (
      <ol className="space-y-3">
        {steps.map(({ step, index }) => (
          <li key={step.title} className="rounded-card border border-line bg-sheet p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Step {index + 1}</p>
            <p className="mt-1 font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-sm text-ink"><ScopedCopy text={step.body} year={year} /></p>
            <StepMark text={`${step.title} ${step.body}`} />
          </li>
        ))}
      </ol>
      )}
      <SectionPhotos shotKey={`procedure:${id}`} label="this procedure" />
      <AlsoInBook items={jumpsForProcedure(id)} />
    </div>
  );
}

function ShotThumb({ file, onRemove }: { file: LogFile; onRemove: () => void }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let live = true;
    let object = "";
    void getFile(file.id).then((blob) => {
      if (!blob || !live) return;
      object = URL.createObjectURL(blob);
      setUrl(object);
    });
    return () => {
      live = false;
      if (object) URL.revokeObjectURL(object);
    };
  }, [file.id]);
  return (
    <li className="relative shrink-0">
      {url ? <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-lg bg-paper text-xs text-muted">Photo</span>}
      <button type="button" onClick={onRemove} className="mt-1 block min-h-11 text-sm font-semibold text-stop">
        Remove
      </button>
    </li>
  );
}

const noShots: LogFile[] = [];

function SectionPhotos({ shotKey, label, folded = false, summary = "Photos" }: { shotKey: string; label: string; folded?: boolean; summary?: string }) {
  const shots = useApp((s) => s.shots[shotKey] ?? noShots);
  const addShot = useApp((s) => s.addShot);
  const removeShot = useApp((s) => s.removeShot);
  const flash = useApp((s) => s.flash);
  const [busy, setBusy] = useState(false);
  async function onFile(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const prepared = await prepareFile(file);
      if (!prepared.mime.startsWith("image/")) {
        flash("This section takes a photo, not a PDF.");
        return;
      }
      const id = crypto.randomUUID();
      await putFile(id, prepared.blob);
      if (!(await Promise.resolve(addShot(shotKey, { id, name: prepared.name, mime: prepared.mime })))) void deleteFile(id);
    } catch (err) {
      const heic = err instanceof Error && err.message === "heic";
      flash(heic ? "This photo is HEIC. Use Most Compatible, or a JPEG." : "Could not save that photo.");
    } finally {
      setBusy(false);
    }
  }
  const body = (
    <>
      <p className="text-sm font-semibold text-ink">Photos for {label}</p>
      {shots.length > 0 && (
        <ul className="mt-2 flex gap-2 overflow-x-auto">
          {shots.map((file) => (
            <ShotThumb key={file.id} file={file} onRemove={() => removeShot(shotKey, file.id)} />
          ))}
        </ul>
      )}
      {shots.length < 3 && (
        <label className="mt-1 flex min-h-11 cursor-pointer items-center text-sm font-semibold text-accent">
          {busy ? "Saving…" : "Add a photo"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => {
              void onFile(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      )}
      <p className="text-sm text-muted">The photo stays on this phone with this section. It is not uploaded, and nothing is read off it. A backup file includes it.</p>
    </>
  );
  if (!folded) return <div className="mt-3">{body}</div>;
  return (
    <details className="mt-3">
      <summary className="min-h-11 cursor-pointer list-none text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {summary}{shots.length ? `, ${shots.length}` : ""}
      </summary>
      {body}
    </details>
  );
}
