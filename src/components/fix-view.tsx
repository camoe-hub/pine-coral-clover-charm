import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, ChevronRight, Code, Droplets, Flame, Snowflake, Wind, Zap } from "lucide-react";
import { symptomById, symptoms, systems, type Symptom } from "@/data/symptoms";
import { foldedChildren, foldedParent } from "@/data/browse";
import type { Hit } from "@/data/search";
import { causes, causeFits } from "@/data/causes";
import { partById } from "@/data/parts";
import { procedureById } from "@/data/procedures";
import { modelById } from "@/data/models";
import { coachHasAlde, coachYear, symptomOn, waterBrands } from "@/data/coach";
import { ScopedCopy } from "@/components/scoped-copy";
import { scopeLead } from "@/lib/year-scope";
import { useApp } from "@/lib/store";
import { useBackLayer } from "@/lib/back-layer";
import { AlsoInBook } from "@/components/figure-view";
import { StepMark } from "@/components/step-mark";
import { jumpsForSymptom } from "@/data/graph";
import { recalls } from "@/data/recalls";
import { Btn, Card, Kicker, PageTitle, Pill } from "@/components/ui";

type StartJob = {
  id: string;
  title: string;
  detail: string;
  symptom?: string;
  ask?: string;
  choices?: { label: string; symptom: string; step?: number }[];
};

const starts: StartJob[] = [
  {
    id: "no-12v",
    title: "No 12 V",
    detail: "Nothing works, the converter, solar, or only the jack",
    ask: "What is actually dead?",
    choices: [
      { label: "Nothing has 12 V", symptom: "no-12v" },
      { label: "Plugged in, and the batteries are not charging", symptom: "converter" },
      { label: "Solar is in the sun and nothing is charging", symptom: "solar" },
      { label: "Only the tongue jack is dead", symptom: "fan-jack", step: 1 },
    ],
  },
  { id: "no-water", title: "No water", detail: "The pump will not prime, or the city hose", symptom: "no-water" },
  {
    id: "hot",
    title: "No hot water",
    detail: "The heater named for this coach",
    ask: "Which heater is in this coach?",
    choices: [
      { label: "Tank heater", symptom: "no-hot-tank" },
      { label: "Tankless", symptom: "tankless" },
      { label: "Alde, on a Classic", symptom: "alde" },
    ],
  },
  {
    id: "heat",
    title: "No heat",
    detail: "The heat this coach uses",
    ask: "What heats the coach?",
    choices: [
      { label: "Furnace", symptom: "furnace" },
      { label: "Alde, on a Classic", symptom: "alde" },
    ],
  },
  {
    id: "climate",
    title: "Fridge or air conditioner",
    detail: "Warm box, no cool air, a drip",
    ask: "Which one?",
    choices: [
      { label: "Fridge", symptom: "fridge" },
      { label: "Air conditioner", symptom: "ac" },
    ],
  },
  { id: "brakes", title: "Brakes", detail: "Weak, grabby, or one wheel locking", symptom: "brakes" },
  { id: "leak", title: "A leak", detail: "Rain, plumbing, or a soft floor", symptom: "leaks" },
];

function heaterName(name: string) {
  if (name === "Alde 3030") return "Alde";
  if (name === "Girard GSWH-2") return "Girard tankless";
  if (name === "Suburban tank") return "Tank heater";
  if (name === "Atwood tank") return "Atwood tank";
  if (name === "Suburban ST-65RL" || name === "Suburban IW60") return "Suburban tankless";
  if (name === "Truma Combi") return "Truma Combi";
  if (name === "Truma AquaGo") return "Truma tankless";
  if (name === "Fogatti") return "Fogatti tankless";
  return name;
}

const startIcon: Record<string, ReactNode> = {
  "no-12v": <Zap className="size-5" />,
  "no-water": <Droplets className="size-5" />,
  hot: <Flame className="size-5" />,
  climate: <Snowflake className="size-5" />,
  brakes: <Wind className="size-5" />,
  heat: <Flame className="size-5" />,
  leak: <Droplets className="size-5" />,
};

export function FixView() {
  const filter = useApp((s) => s.systemFilter);
  const setSystem = useApp((s) => s.setSystem);
  const model = modelById(useApp((s) => s.modelId));
  const vin = useApp((s) => s.vin);
  const year = coachYear(vin, useApp((s) => s.modelYear));
  const push = useApp((s) => s.push);
  const [onlyMine, setOnlyMine] = useState(true);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [searched, setSearched] = useState("");
  const [searchDown, setSearchDown] = useState(false);
  const [openMore, setOpenMore] = useState<string | null>(null);
  const [openStart, setOpenStart] = useState<string | null>(null);
  useBackLayer(openStart !== null, () => setOpenStart(null));
  useEffect(() => {
    if (!q.trim()) return;
    let cancel = false;
    const timer = window.setTimeout(() => {
      const miss = () => {
        if (cancel) return;
        setHits([]);
        setSearched(q);
        setSearchDown(true);
      };
      void import("@/data/search")
        .then(({ searchAll, searchSaved, savedRowsFrom, mergeHits }) => {
          if (cancel) return;
          void import("@/lib/weights")
            .then(({ weightSearchBlob }) => {
              if (cancel) return;
              const live = useApp.getState();
              const saved = searchSaved(q, savedRowsFrom({ notes: live.notes, log: live.log, weights: weightSearchBlob(live.modelId) }));
              setHits(mergeHits(saved, searchAll(q, model, year)));
              setSearched(q);
              setSearchDown(false);
            })
            .catch(miss);
        })
        .catch(miss);
    }, 150);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, [q, model, year]);

  const list = useMemo(() => {
    return symptoms.filter((s) => {
      if (filter && s.system !== filter) return false;
      return symptomOn(s, model, year, onlyMine);
    });
  }, [filter, onlyMine, model, year]);

  const brands = waterBrands(model, year);
  const hasAlde = coachHasAlde(model, year);
  const aldeOnly = hasAlde && brands.size === 1 && brands.has("Alde 3030");
  const shownSystems = systems.filter((name) => symptoms.some((s) => s.system === name && symptomOn(s, model, year, onlyMine)));
  const systemChips = (
    <div className="mt-4">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">By system</p>
      <div className="chip-row chip-scroll chip-fade -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="System">
        <Chip on={filter === ""} onClick={() => setSystem("")}>
          Start
        </Chip>
        {shownSystems.map((name) => (
          <Chip key={name} on={filter === name} onClick={() => setSystem(filter === name ? "" : name)}>
            {name}
          </Chip>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <label className="sr-only" htmlFor="diagnose-search">Search</label>
      <div className="relative">
        <input
          id="diagnose-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Symptom, code, part, or a saved note"
          inputMode="search"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-h-12 w-full rounded-full border border-line bg-sheet px-4"
        />
      </div>
      {q.trim() ? (
        <ul className="mt-3 space-y-2" aria-live="polite">
          <li className="sr-only">{hits.length === 0 ? "Nothing matches that." : `${hits.length} results.`}</li>
          {hits.map((h, i) => (
            <li key={`${h.title}-${i}`}>
              <button type="button" onClick={() => push(h.to)} className="w-full rounded-card border border-line bg-sheet px-3 py-3 text-left">
                <span className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">{h.kicker}</span>
                <span className="block font-semibold text-ink">{h.title}</span>
                <span className="block text-sm text-muted">{h.detail}</span>
                {h.why ? <span className="mt-1 block text-sm text-ink">{h.why}</span> : null}
              </button>
            </li>
          ))}
          {hits.length === 0 && searched === q && <li className="text-sm text-muted">{searchDown ? "That list needs a signal." : "Nothing matches that."}</li>}
          {searched !== q && <li className="text-sm text-muted">Searching…</li>}
        </ul>
      ) : (
        <>
      <p className="mt-3 flex items-start gap-2 text-sm text-ink">
        <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden />
        <span>
          {onlyMine ? <>Showing guides for your {model.short}. </> : <>Showing every guide. </>}
          <button type="button" className="font-semibold underline underline-offset-2" onClick={() => setOnlyMine((v) => !v)}>
            {onlyMine ? "Show all" : `Only ${model.short}`}
          </button>
        </span>
      </p>
      {systemChips}
      <button
        type="button"
        onClick={() => push({ name: "flows" })}
        className="mt-3 flex min-h-14 w-full items-center justify-between rounded-[18px] border border-line bg-sheet px-4 text-left"
      >
        <span>
          <span className="block font-semibold text-ink">Flowcharts</span>
          <span className="block text-sm text-muted">{filter ? `${filter}, as a yes or no path` : "The same checks, as a yes or no path"}</span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-accent" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => push({ name: "table" })}
        className="mt-2 flex min-h-14 w-full items-center justify-between rounded-[18px] border border-line bg-sheet px-4 text-left text-base font-semibold text-ink"
      >
        {filter ? `${filter}, in a table` : "Same checks, in a table"}
        <ChevronRight className="size-5 shrink-0 text-accent" aria-hidden />
      </button>

      <ul className="mt-4 space-y-2">
        {filter === "" ? (
          <>
            {starts.map((job) => {
              const choices = job.choices?.filter((choice) => symptomOn(symptomById(choice.symptom) ?? { id: choice.symptom, system: "" }, model, year, onlyMine));
              const named = [...brands].map(heaterName);
              const detail =
                job.id === "hot" && aldeOnly
                  ? "This Classic uses the Alde, not a tank or a tankless."
                  : job.id === "hot" && named.length
                    ? named.join(" or ")
                    : job.id === "hot" && model.family !== "Other"
                      ? "This year does not name the heater. Read the plate."
                      : job.id === "heat" && hasAlde
                        ? "Alde heats this coach"
                        : job.id === "heat"
                          ? "The ducted furnace"
                          : job.detail;
              return (
                <li key={job.id}>
                  <button
                    type="button"
                    aria-expanded={choices?.length ? openStart === job.id : undefined}
                    onClick={() => {
                      if (job.symptom) push({ name: "symptom", id: job.symptom, step: 0 });
                      else if (choices?.length) setOpenStart(openStart === job.id ? null : job.id);
                      else if (job.id === "hot") push({ name: "flow", id: "hot" });
                    }}
                    className="flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok" aria-hidden>
                      {startIcon[job.id]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">{job.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">{detail}</span>
                    </span>
                    <ChevronRight className={`size-5 shrink-0 text-muted ${openStart === job.id ? "rotate-90" : ""}`} />
                  </button>
                  {choices && choices.length > 0 && openStart === job.id && (
                    <div className="mt-2 space-y-2 pl-3">
                      <button type="button" onClick={() => setOpenStart(null)} className="flex min-h-11 items-center text-sm font-semibold text-accent">
                        Back
                      </button>
                      <p className="text-sm font-semibold text-ink">{job.ask}</p>
                      {choices.map((choice) => (
                        <button
                          key={choice.symptom}
                          type="button"
                          onClick={() => push({ name: "symptom", id: choice.symptom, step: choice.step ?? 0 })}
                          className="flex min-h-11 w-full items-center rounded-card border border-line bg-sheet px-3 py-3 text-left text-sm font-semibold text-ink"
                        >
                          {choice.symptom === "tankless" && brands.has("Truma Combi") && !brands.has("Girard GSWH-2") && !brands.has("Suburban ST-65RL") && !brands.has("Suburban IW60") ? "Truma Combi" : choice.label}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => push({ name: "codes" })}
                className="flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok" aria-hidden>
                  <Code className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink">I have a fault code</span>
                  <span className="mt-0.5 block text-sm text-muted">{hasAlde ? "E-codes, flashes, and Alde messages" : "E-codes and flashes"}</span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted" />
              </button>
            </li>
          </>
        ) : (
          systems
            .filter((name) => name === filter)
            .map((name) => {
              const items = list.filter((s) => s.system === name && !foldedParent(s.id));
              if (!items.length) return null;
              const core = items.filter((s) => !s.id.startsWith("x-"));
              const more = items.filter((s) => s.id.startsWith("x-"));
              return (
                <li key={name}>
                  {(["stop", "soon", "watch"] as const).map((level) => {
                    const group = core.filter((s) => s.level === level);
                    if (!group.length) return null;
                    return (
                      <div key={level} className="mb-4">
                        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">
                          {level === "stop" ? "Stop" : level === "soon" ? "Soon" : "Watch"}
                        </h2>
                        <ul className="mt-2 space-y-2">
                          {group.map((s) => (
                            <SymptomRow key={s.id} s={s} year={year} onOpen={() => push({ name: "symptom", id: s.id, step: 0 })} />
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  {more.length > 0 && (
                    <div className="mt-3">
                      <button
                        type="button"
                        aria-expanded={openMore === name}
                        onClick={() => setOpenMore(openMore === name ? null : name)}
                        className="min-h-11 text-sm font-semibold text-accent"
                      >
                        {openMore === name ? "Hide" : "Show"} {more.length} more checks
                      </button>
                      {openMore === name && (
                        <ul className="mt-2 space-y-2">
                          {more.map((s) => (
                            <SymptomRow key={s.id} s={s} year={year} onOpen={() => push({ name: "symptom", id: s.id, step: 0 })} />
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })
        )}
      </ul>
      {list.length === 0 && filter !== "" && <p className="mt-6 text-sm text-muted">Nothing in this system for the current filter. Show all, or pick Start.</p>}
      <details className="group mt-6 rounded-card border border-line bg-sheet">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="block font-semibold text-ink">More than one thing is wrong</span>
            <span className="block text-sm font-normal text-muted">Match what you see. The line under it is the one cause.</span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-muted transition-transform group-open:rotate-90" aria-hidden />
        </summary>
        <div className="space-y-4 px-3 pb-3">
          {(["Power", "Gas", "Water", "Towing", "Body"] as const).map((group) => {
            const rows = causes.filter((c) => c.group === group && causeFits(c, model, year));
            if (!rows.length) return null;
            return (
            <div key={group}>
              <h3 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">{group}</h3>
              <ul className="mt-2 space-y-2">
                {rows.map((c) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => push(c.to)} className="w-full rounded-card border border-line bg-paper px-3 py-3 text-left">
                        <span className="flex flex-wrap gap-1.5">
                          {c.signs.map((sign) => (
                            <span key={sign} className="rounded-full bg-sheet px-2 py-1 text-sm text-ink">
                              {sign}
                            </span>
                          ))}
                        </span>
                        <span className="mt-2 block text-sm text-muted">Usually</span>
                        <span className="block font-semibold text-ink">{c.cause}</span>
                        <span className="mt-1 block text-sm font-semibold text-accent">{c.start}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            );
          })}
        </div>
      </details>
      <button
        type="button"
        onClick={() => push({ name: "service" })}
        className="mt-5 flex min-h-14 w-full items-center justify-between rounded-card border border-line bg-sheet px-4 text-left text-base font-semibold text-ink"
      >
        Find a shop
        <ChevronRight className="size-5 shrink-0 text-accent" aria-hidden />
      </button>
        </>
      )}
    </div>
  );
}

function SymptomRow({ s, year, onOpen }: { s: Symptom; year: number | null; onOpen: () => void }) {
  return (
    <li>
      <button
        onClick={onOpen}
        className="flex w-full items-center gap-3 rounded-card border border-line bg-sheet px-3 py-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <Pill tone={s.level === "stop" ? "danger" : s.level === "soon" ? "warn" : "line"}>
              {s.level === "stop" ? "Stop" : s.level === "soon" ? "Soon" : "Watch"}
            </Pill>
            {s.fit === "classic" && <Pill tone="line">Classic</Pill>}
            {s.fit === "gt" && <Pill tone="line">Globetrotter</Pill>}
          </span>
          <span className="mt-2 block font-semibold text-ink">{s.title}</span>
          <span className="mt-0.5 block text-sm text-muted">{scopeLead(s.blurb, year)}</span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-muted" />
      </button>
    </li>
  );
}

function Chip({ on, children, onClick }: { on: boolean; children: string; onClick: () => void }) {
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

function PartLinks({ ids }: { ids?: string[] }) {
  const push = useApp((s) => s.push);
  const rows = (ids ?? []).map((id) => partById(id)).filter((part) => !!part);
  if (!rows.length) return null;
  return (
    <div>
      <Kicker>Part numbers on this phone</Kicker>
      <p className="mt-1 text-sm text-muted">Stored in this app. This does not open a factory manual.</p>
      <ul className="mt-2 space-y-2">
        {rows.map((part) => (
          <li key={part.id}>
            <button type="button" onClick={() => push({ name: "part", id: part.id })} className="w-full min-w-0 rounded-card border border-line bg-sheet px-3 py-3 text-left wrap-anywhere">
              <span className="block font-semibold">{part.name}</span>
              <span className="font-mono text-sm text-accent">{part.pn}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SymptomView({ id, step }: { id: string; step: number }) {
  const sy = symptomById(id);
  const push = useApp((s) => s.push);
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const [fixed, setFixed] = useState(false);
  useEffect(() => {
    if (!sy || step <= 0) return;
    document.getElementById(`check-${sy.id}-${step}`)?.scrollIntoView({ block: "center" });
  }, [sy, step]);
  if (!sy) return <p className="text-sm text-muted">That symptom is not in this edition.</p>;
  const parentId = foldedParent(sy.id);
  const parent = parentId ? symptomById(parentId) : undefined;
  const also = foldedChildren(sy.id)
    .map((cid) => symptomById(cid))
    .filter((s): s is Symptom => !!s);
  const namedRecalls = recalls.filter((r) => {
    const num = r.campaign.replace(/^NHTSA\s+/, "");
    const blob = `${sy.title} ${sy.blurb} ${sy.checks.map((c) => `${c.look} ${c.action}`).join(" ")}`;
    return blob.toLowerCase().includes(num.toLowerCase());
  });

  if (fixed) {
    return (
      <div className="space-y-4">
        <Kicker>{sy.system}</Kicker>
        <PageTitle className="font-display text-3xl text-ink">That was the one.</PageTitle>
        <p className="text-sm text-muted">
          If it comes back, start again at check 1. Write it in the service log so the next time is faster.
        </p>
        <Btn onClick={() => push({ name: "log" })}>Add a log note</Btn>
        {!!sy.parts?.length && <PartLinks ids={sy.parts} />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-accent">{sy.system}</p>
        <PageTitle className="mt-1 font-display text-3xl text-ink">{sy.title}</PageTitle>
        <p className="mt-1 text-sm text-muted wrap-anywhere"><ScopedCopy text={sy.blurb} year={year} /></p>
        <p className="mt-2 text-sm text-ink">
          {/owner-reported/i.test(`${sy.blurb} ${sy.checks.map((c) => c.action).join(" ")}`)
            ? "Owner report. Not a factory specification, and not confirmed on this coach."
            : "A step that does not name a factory manual is not a factory specification. The model-year manual governs."}
        </p>
        {parent && (
          <button type="button" className="mt-2 min-h-11 text-sm font-semibold text-accent" onClick={() => push({ name: "symptom", id: parent.id, step: 0 })}>
            Part of {parent.title}
          </button>
        )}
      </div>
      <p className="text-sm text-muted">Work down the list. Stop when one of these is the problem.</p>
      <ol className="space-y-2">
        {sy.checks.map((check, i) => (
          <li key={`${sy.id}-${i}`} id={`check-${sy.id}-${i}`}>
            <Card className={`p-4 ${step > 0 && i === step ? "ring-2 ring-navy" : ""}`}>
              <p className="font-display text-xl text-ink wrap-anywhere">{check.look}</p>
              <p className="mt-2 text-base text-ink wrap-anywhere"><ScopedCopy text={check.action} year={year} /></p>
              <StepMark text={`${check.look} ${check.action}`} />
            </Card>
          </li>
        ))}
      </ol>
      <PartLinks ids={sy.parts} />
      <div className="grid grid-cols-1">
        <Btn onClick={() => setFixed(true)}>This fixed it</Btn>
        <button type="button" className="min-h-11 text-sm font-semibold text-accent" onClick={() => push({ name: "service" })}>
          None of these. Find a shop
        </button>
        <button type="button" className="min-h-11 text-sm font-semibold text-accent" onClick={() => push({ name: "table", id, step: 0 })}>
          See this in the table
        </button>
        <button
          type="button"
          className="min-h-11 text-sm font-semibold text-accent"
          onClick={() => {
            const text = `Possible error in “${sy.title}.” Write what disagrees with the manual or the plate. This note stays on the phone.`;
            void Promise.resolve(useApp.getState().addNote(text)).then((ok) => {
              useApp.getState().flash(ok === false ? "Could not save that note." : "Saved in notes. Nothing is sent.");
            });
          }}
        >
          Report an error in this check
        </button>
      </div>
      {also.length > 0 && (
        <div>
          <Kicker>Also in this job</Kicker>
          <ul className="mt-2 space-y-2">
            {also.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => push({ name: "symptom", id: s.id, step: 0 })} className="w-full rounded-card border border-line bg-sheet px-3 py-3 text-left">
                  <span className="block font-semibold text-ink">{s.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{scopeLead(s.blurb, year)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!sy.procedures?.length && (
        <div>
          <Kicker>Related procedure</Kicker>
          <div className="mt-2 flex flex-col gap-2">
            {sy.procedures.map((pid) => {
              const proc = procedureById(pid);
              return (
                <Btn key={pid} variant="line" onClick={() => push({ name: "procedure", id: pid })}>
                  {proc ? proc.title : "Open procedure"}
                </Btn>
              );
            })}
          </div>
        </div>
      )}
      {namedRecalls.length > 0 && (
        <div>
          <Kicker>Recall named in these checks</Kicker>
          <div className="mt-2 flex flex-col gap-2">
            {namedRecalls.map((r) => (
              <Btn key={r.id} variant="line" onClick={() => push({ name: "recalls" })}>
                {r.campaign}
              </Btn>
            ))}
          </div>
        </div>
      )}
      <AlsoInBook items={jumpsForSymptom(sy)} />
    </div>
  );
}
