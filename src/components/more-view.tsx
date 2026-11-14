import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Check, ChevronLeft, ChevronRight, FileText, ScanLine, X } from "lucide-react";
import { checklists, checklistById } from "@/data/checklists";
import { applianceFits, codeFits, bearingNote, coachBudget, coachYear, procedureFits, vinMismatch, vinOk } from "@/data/coach";
import { aldeShownName, fitmentStanding } from "@/data/fitment";
import { modelById, models } from "@/data/models";
import { ownerIssues, recalls, tsbs } from "@/data/recalls";
import { appliances, faultCodes, faultCodeMatches, faultCodeRank, ownerReportedCode, symptomForCode } from "@/data/codes";
import { procedures } from "@/data/procedures";
import { tasks } from "@/data/schedule";
import { textHasWords, wordsOf } from "@/data/words";
import { useApp, serviceTotal, type LogEntry, type LogFile, type ServiceDetail } from "@/lib/store";
import { useBackLayer } from "@/lib/back-layer";
import { daysBetween, formatWhen, todayIso } from "@/lib/date";
import { deleteFile, getFile, prepareFile, putFile, trustedBlob } from "@/lib/files";
import { BackupSheet } from "@/components/backup-sheet";
import { previewBackup, type BackupPreview } from "@/lib/backup-preview";
import { RestoreSheet } from "@/components/backup-view";
import { applyBackupFiles } from "@/lib/restore-files";
import { DisclaimerCopy } from "@/components/disclaimer";
import { PLATE_FIELDS, platePlaceholder, waterHeaterSpec } from "@/lib/plates";
import { Btn, Card, Kicker, PageTitle } from "@/components/ui";

export function ProceduresView() {
  const push = useApp((s) => s.push);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const [q, setQ] = useState("");
  const words = wordsOf(q);
  const shown = procedures.filter((p) => {
    if (!procedureFits(p.id, model, year)) return false;
    if (!words.length) return true;
    const steps = p.steps.map((s) => `${s.title} ${s.body}`).join(" ");
    return textHasWords(`${p.title} ${p.system} ${p.tools ?? ""} ${p.caution ?? ""} ${steps}`, words);
  });
  return (
    <div>
      <Kicker>Step by step</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Procedures</PageTitle>
      <p className="mt-1 text-sm text-muted">Step by step, for this coach. Your model-year manual still governs.</p>
      <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="procedure-search">
        Search procedures
      </label>
      <input
        id="procedure-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Torque, winterize, bearings…"
        inputMode="search"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
      />
      {shown.length < procedures.length && !q.trim() && (
        <p className="mt-2 text-sm text-muted">Steps for other appliances stay off this list. A link from the schedule still opens them.</p>
      )}
      {shown.length === 0 && <p className="mt-4 text-sm text-muted">Nothing matches that.</p>}
      {shown.length > 0 && (
      <ul className="mt-4 rounded-card border border-line bg-sheet">
        {shown.map((p, i) => (
          <li key={p.id} className={i === shown.length - 1 ? "" : "border-b border-line"}>
            <button onClick={() => push({ name: "procedure", id: p.id })} className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{p.title}</span>
                <span className="block text-sm text-muted">{p.system}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted" />
            </button>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
}

export function ChecklistsView() {
  const push = useApp((s) => s.push);
  return (
    <div>
      <Kicker>Before you leave, and after you arrive</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Checklists</PageTitle>
      <ul className="mt-4 rounded-card border border-line bg-sheet">
        {checklists.map((c, i) => (
          <li key={c.id} className={i === checklists.length - 1 ? "" : "border-b border-rule"}>
            <button
              onClick={() => push({ name: "checklist", id: c.id })}
              className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{c.title}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 self-center text-muted" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChecklistView({ id }: { id: string }) {
  const list = checklistById(id);
  const checks = useApp((s) => s.checks);
  const listDone = useApp((s) => s.listDone);
  const toggle = useApp((s) => s.toggleCheck);
  const clear = useApp((s) => s.clearList);
  useEffect(() => {
    if (id !== "winter") return;
    const trail = useApp.getState().winterPlace?.trail ?? [];
    useApp.getState().setWinterPlace({ page: "checklist", trail });
  }, [id]);
  if (!list) return null;
  const state = checks[id] || {};
  const all = list.groups.flatMap((g) => g.items);
  const n = all.filter((i) => state[i.id]).length;
  const finished = n === all.length && all.length > 0 ? listDone[id] : "";
  return (
    <div>
      <Kicker>{finished ? `Finished ${formatWhen(finished)}` : `${n} of ${all.length}`}</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">{list.title}</PageTitle>
      <p className="mt-2 text-sm text-muted">{list.intro}</p>
      {id === "boondock" && <BudgetCard />}
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-quiet"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={all.length}
        aria-valuenow={n}
        aria-label={`${n} of ${all.length} checked`}
      >
        <div className="h-full bg-navy" style={{ width: `${all.length ? (n / all.length) * 100 : 0}%` }} />
      </div>
      {list.groups.map((g) => (
        <section key={g.title} className="mt-5">
          <Kicker>{g.title}</Kicker>
          <ul className="mt-2 space-y-2">
            {g.items.map((item) => {
              const on = !!state[item.id];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(id, item.id)}
                    className="flex w-full items-start gap-3 rounded-card border border-line bg-sheet px-3 py-3 text-left"
                  >
                    <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border ${on ? "border-sage bg-sage text-on-navy" : "border-line"}`}>
                      {on ? <Check className="size-4" /> : null}
                    </span>
                    <span>
                      <span className={`block text-sm ${on ? "text-muted line-through" : "text-ink"}`}>{item.text}</span>
                      {item.owner && <span className="text-sm font-semibold text-caution">Owner-reported, not a factory step</span>}
                    </span>
                  </button>
                  {id === "arrival" && item.id === "level" ? (
                    <button type="button" onClick={() => useApp.getState().push({ name: "level" })} className="mt-2 min-h-11 px-1 text-sm font-semibold text-ink">
                      Trailer level, in inches
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <Btn variant="line" className="mt-4" onClick={() => clear(id)}>
        Clear this list
      </Btn>
    </div>
  );
}

function BudgetCard() {
  const m = modelById(useApp((s) => s.modelId));
  const budget = coachBudget(m);
  return (
    <Card className="mt-4 p-4 text-sm">
      <p className="font-semibold text-ink">Dry-camping budget</p>
      <p className="mt-2 text-ink">{budget.fresh}</p>
      <p className="mt-1 text-ink">{budget.power}</p>
      <p className="mt-2 text-muted">{budget.note}</p>
    </Card>
  );
}

function PlatesCard() {
  const modelId = useApp((s) => s.modelId);
  const saved = useApp((s) => s.plates);
  const setPlates = useApp((s) => s.setPlates);
  const flash = useApp((s) => s.flash);
  const [draft, setDraft] = useState(saved);
  useEffect(() => {
    setDraft(useApp.getState().plates);
  }, [modelId]);

  return (
    <Card className="mt-4 space-y-3 p-4">
      <p className="font-semibold text-ink">Plates on this coach</p>
      <p className="text-sm text-muted">Read the label on the unit. These words show on the matching flowchart. They do not choose the steps.</p>
      {PLATE_FIELDS.map((field) => (
        <label key={field.key} className="block text-sm font-semibold text-ink" htmlFor={`plate-${field.key}`}>
          {field.label}
          <input
            id={`plate-${field.key}`}
            value={draft[field.key]}
            onChange={(e) => setDraft((current) => ({ ...current, [field.key]: e.target.value }))}
            maxLength={80}
            placeholder={platePlaceholder(modelById(modelId), field.key)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base font-normal text-ink"
          />
        </label>
      ))}
      <Btn
        className="w-full"
        onClick={() => {
          setPlates(draft);
          setDraft(useApp.getState().plates);
          flash("Plates saved");
        }}
      >
        Save plates
      </Btn>
    </Card>
  );
}

export function SpecsView() {
  const id = useApp((s) => s.modelId);
  const vin = useApp((s) => s.vin);
  const m = modelById(id);
  const mismatch = vinMismatch(vin, m);
  const rows: [string, string][] = [
    ["VIN", vin || "Add it above"],
    ["Length", m.length],
    ["UBW with LP and batteries", m.ubw],
    ["Hitch weight", m.hitch],
    ["GVWR", m.gvwr],
    ["Cargo capacity (NCC)", m.ncc],
    ["Fresh / gray / black", `${m.fresh} / ${m.gray} / ${m.black} gal`],
    ["Tire", `${m.tire} · ${m.psi} · ${m.load} max load`],
    ["Lug nuts", m.lug],
    ["Re-torque", "5, 10, 25, and 50 miles after a wheel change, star pattern"],
    ["Hitch ball", `${m.ball} at ${m.ballHeight}`],
    ["Water heater", waterHeaterSpec(m)],
    ["City water", m.blowPsi.startsWith("30") ? "Stop at 30 psi. This floor is not the 50 psi limit." : "Inline regulator limits to 50 psi"],
    ["Breakaway", "Test every 90 days. Pin out no more than 20–30 seconds."],
    ["Axle alignment", "Toe-in 1/16 in each side (±1/8). Camber 3/4° positive (±3/4°)."],
  ];
  return (
    <div>
      <Kicker>Selected floor, not every year</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">{m.name}</PageTitle>
      <p className="mt-2 text-sm text-muted">
        These figures match the floor plan you picked. They do not change with the VIN year. Tire pressure is the maximum cold rating. Check your placard and manual. Inflate to the placard for the load you are carrying, and confirm earlier years in that year’s manual.
      </p>
      {mismatch ? <p className="mt-3 text-sm font-semibold text-ink">{mismatch}</p> : null}
      <PlatesCard />
      <dl className="mt-4 rounded-card border border-line bg-sheet">
        {rows.map(([k, v]) => (
          <div key={k} className="border-b border-line px-4 py-3 last:border-b-0">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
            <dd className="mt-0.5 text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <Card className="mt-4 p-4 text-sm">
        <p className="font-semibold text-ink">Where is it</p>
        <dl className="mt-3 space-y-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Power center</dt>
            <dd className="mt-0.5 text-ink">{m.powerCenter}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Low-point drains</dt>
            <dd className="mt-0.5 text-ink">{m.drains}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Blow-out</dt>
            <dd className="mt-0.5 text-ink">{m.blowPsi} at the city inlet. If this is not your floor plan, stop at 30 psi.</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Bearings</dt>
            <dd className="mt-0.5 text-ink">{bearingNote(m)}</dd>
          </div>
        </dl>
      </Card>
      <BudgetCard />
      {m.alde && (
        <Card className="mt-4 p-4 text-sm">
          <p className="font-semibold">Alde valves</p>
          <p className="mt-1">Normal: 1, 2, 3 open / 4 closed. Bypass: 1, 2, 3 closed / 4 open. Drain: all open. Blow-out: close 1 and 2. The interactive card is in the valve procedure.</p>
        </Card>
      )}
      <p className="mt-4 text-sm text-muted">Other floor plans in this app: {models.filter((x) => x.id !== "other").map((x) => x.short).join(", ")}.</p>
    </div>
  );
}

export function CodesView({ initialQuery = "", initialAppliance = "All" }: { initialQuery?: string; initialAppliance?: string }) {
  const [app, setApp] = useState<string>(initialAppliance);
  const [q, setQ] = useState(initialQuery);
  const push = useApp((s) => s.push);
  const model = modelById(useApp((s) => s.modelId));
  const vin = useApp((s) => s.vin);
  const year = coachYear(vin, useApp((s) => s.modelYear));
  useEffect(() => {
    setQ(initialQuery);
    setApp(initialAppliance);
  }, [initialQuery, initialAppliance]);
  const searching = q.trim().length > 0;
  const fits = useCallback((c: { id: string; appliance: string }) => codeFits(c, model, year), [model, year]);
  const list = useMemo(() => {
    const rows = faultCodes.filter((c) => {
      if (app !== "All" && c.appliance !== app) return false;
      if (!searching && !fits(c)) return false;
      return faultCodeMatches(c, q);
    });
    if (!searching) return rows;
    return rows.sort((a, b) => faultCodeRank(a, q, fits(a)) - faultCodeRank(b, q, fits(b)) || a.code.localeCompare(b.code) || a.appliance.localeCompare(b.appliance));
  }, [app, q, searching, fits]);
  const chips = appliances.filter((name) => searching || applianceFits(name, model, year) || name === app);
  const fit = fitmentStanding(model, year);
  return (
    <div>
      <Kicker>Panel, LED, and remote</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Fault codes</PageTitle>
      <p className="mt-1 text-sm text-muted">Codes for this coach. Search still finds the others, marked not on this coach.</p>
      <p className={`mt-1 text-sm ${fit.standing === "factory" ? "text-muted" : "font-semibold text-ink"}`}>{fit.line}</p>
      <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="fault-code">
        Fault code or message
      </label>
      <input
        id="fault-code"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="E-1, gas failure, 2 flashes…"
        inputMode="search"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4"
      />
      <div className="chip-row -mx-4 mt-3 flex gap-2 px-4">
        {["All", ...chips].map((name) => (
          <button
            key={name}
            onClick={() => setApp(name)}
            className={`min-h-11 min-w-11 shrink-0 rounded-full px-3 text-sm font-semibold ${app === name ? "bg-navy text-on-navy" : "border border-line bg-sheet"}`}
          >
            {name === "Alde 3030" ? aldeShownName(year, model.id) : name}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {list.map((c) => {
          const symptom = symptomForCode(c);
          const body = (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <p className={c.code.trim().length <= 8 && !/\s/.test(c.code) ? "font-mono text-base font-semibold tracking-wide text-ink" : "font-sans text-sm font-normal text-ink"}>{c.code}</p>
                <p className="text-right text-sm font-semibold text-muted">
                  {c.appliance === "Alde 3030" ? (fits(c) ? aldeShownName(year, model.id) : "Alde") : c.appliance}
                  {!fits(c) && <span className="mt-1 block normal-case tracking-normal text-caution">Not on this coach</span>}
                </p>
              </div>
              <p className="mt-1 font-sans text-sm font-normal text-ink">{c.meaning}</p>
              {ownerReportedCode(c) ? <p className="mt-1 text-sm font-semibold text-ink">Owner-reported. Not from the maker’s sheet.</p> : null}
              <p className="mt-1 text-sm text-muted">{c.fix}</p>
              {c.source ? <p className="mt-1 text-sm text-muted">Source: {c.source}</p> : ownerReportedCode(c) ? null : <p className="mt-1 text-sm font-semibold text-ink">No published source for this line.</p>}
            </>
          );
          if (!symptom) {
            return (
              <li key={c.id} className="rounded-card border border-line bg-sheet p-4">
                {body}
              </li>
            );
          }
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => push({ name: "symptom", id: symptom, step: 0 })}
                aria-label={`${c.code}. Open the checks`}
                className="flex w-full items-start gap-2 rounded-card border border-line bg-sheet p-4 text-left"
              >
                <span className="min-w-0 flex-1">{body}</span>
                <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && (
        <p className="mt-6 text-sm text-muted">{q.trim() ? "No code matches that." : "Nothing on this coach in that filter. Search a code to see other appliances."}</p>
      )}
    </div>
  );
}

/** A year overlap is not proof. Name the family, or say it does not. */
function recallFit(models: string, family: string) {
  if (!family || family === "Other") return "Check your VIN";
  const cleaned = models.replace(/\bnot\b[^.]*/gi, " ");
  const named = new RegExp(`\\b${family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(cleaned);
  if (!named && !/\bother\b/i.test(models)) return "Doesn't apply";
  return "Check your VIN";
}

export function RecallsView() {
  const vin = useApp((s) => s.vin);
  const model = modelById(useApp((s) => s.modelId));
  const ok = vinOk(vin);
  const href = ok ? `https://www.nhtsa.gov/recalls?vin=${encodeURIComponent(vin)}#vehicle` : "https://www.nhtsa.gov/recalls#vehicle";

  function openNhtsa() {
    if (ok) void navigator.clipboard?.writeText(vin).catch(() => undefined);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const recallAge = daysBetween("2026-10-25", todayIso());
  const recallStale = recallAge != null && recallAge >= 30;

  return (
    <div className="space-y-4">
      <div>
        <Kicker>Checked 24–25 Oct 2026</Kicker>
        <PageTitle className="mt-1 font-display text-3xl text-ink">Recalls</PageTitle>
        <button type="button" onClick={openNhtsa} className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold text-on-navy">
          {ok ? "Look up this VIN at NHTSA" : "Look up a VIN at NHTSA"}
        </button>
        <p className="mt-3 text-sm text-ink">
          As of 24–25 Oct 2026, NHTSA showed no recalls for a 2025–2027 Globetrotter or a 2027 Classic. That line is not a result for this trailer. A name on the list below is not proof it applies.
        </p>
        <p className="mt-2 text-sm text-muted">
          {ok
            ? "Copies this VIN and opens NHTSA. Paste it if the box is empty."
            : "Opens NHTSA. Add a valid VIN first if you want it copied for you."}{" "}
          The notes below were checked 24–25 Oct 2026. {recallStale ? "That check is past 30 days." : "That is not yet 30 days."} They will go stale. A campaign applies only to the VINs in it. NHTSA is the list that matters.
        </p>
      </div>
      {recalls.map((r) => (
        <Card key={r.id} className="p-4">
          <p className="font-semibold text-ink">{r.campaign}</p>
          {/fire/i.test(r.defect) ? <p className="mt-1 text-sm font-semibold text-signal">Fire risk</p> : null}
          <p className="mt-1 text-sm font-semibold text-ink">{recallFit(r.models, model.family)}</p>
          <p className="mt-1 text-sm text-muted">{r.when}</p>
          <p className="mt-2 text-sm text-ink">{r.models}</p>
          <p className="mt-2 text-sm text-ink">{r.defect}</p>
          <p className="mt-2 text-sm text-muted">{r.remedy}</p>
          <p className="mt-2 text-sm text-ink">{r.tell}</p>
        </Card>
      ))}
      <Kicker>Bulletins, not recalls</Kicker>
      {tsbs.map((t) => (
        <Card key={t.id} className="p-4">
          <p className="font-semibold">{t.title}</p>
          <p className="mt-1 text-sm text-muted">{t.applies}</p>
          <p className="mt-2 text-sm">{t.problem}</p>
        </Card>
      ))}
      <Kicker>Owner-reported, not a recall</Kicker>
      {ownerIssues.map((o) => (
        <Card key={o.title} className="p-4">
          <p className="font-semibold">{o.title}</p>
          <p className="text-sm text-muted">{o.models}</p>
          <p className="mt-2 text-sm">{o.issue}</p>
          <p className="mt-1 text-sm text-muted">{o.fix}</p>
        </Card>
      ))}
    </div>
  );
}

const kit = [
  ["Torque wrench to ~150 ft-lb, 1/2 in drive", "Wind it back to zero after use. Final lug torque is a click, not an impact."],
  ["Breaker bar, short extension, thin-wall 6-point socket", "Often 13/16 in (21 mm). Some nuts are 3/4 in. Test-fit at home. A cross wrench may not reach a recessed alloy nut."],
  ["Socket set, 1/4 and 3/8 in drive", "SAE and metric, 6-point, shallow and deep. A short extension and a universal. Keep the 1/2 in lug socket with the wheel tools."],
  ["3/8 and 1/2 in ratchets", "One of each. The 3/8 is the everyday driver. The 1/2 in takes the lug socket and the heavier frame bolts. A short extension for each."],
  ["Cordless drill and a bit set", "Phillips, flat, and square driver bits, a few twist bits, and a charged spare battery. Interior screws do not need an impact."],
  ["Combination wrenches", "7/16, 1/2, 9/16, 5/8, and 3/4 in, plus 10 and 13 mm. One adjustable wrench. Some stabilizer bolts are 3/4 in — confirm on yours."],
  ["Screwdrivers, hex keys, and pliers", "#2 Phillips, a flat, and a stubby. SAE Allen keys and T25 / T30. Slip-joint, needle-nose, channel locks, and side cutters."],
  ["Multimeter and spare fuses", "Two of each ATC rating in the 12 V panel. Same type and amperage only. Solar-port fuse: 15 A on Classic, Flying Cloud, Frank Lloyd Wright, and Trade Wind 23/25; 30 A on a Globetrotter, Stetson, or World Traveler EU. Basecamp 20XE portable solar is 300 W on a lithium profile. A clamp meter is the brake-magnet check, about 3 A each."],
  ["Rivet tool and 3/16 in aluminum rivets", "Include large-flange rivets for the belly pan. Match the grip to the stack. Do not guess a box for the shell."],
  ["Leveling blocks or a ramp", "On a tandem, the good tire climbs and the flat lifts clear. Still use stands if you go underneath."],
  ["Bottle jack and rated jack stands", "Lift only at the marked JACK pad on the frame. Never on the axle. Stands go under before you work."],
  ["Tire gauge and a compressor that can hit max cold psi", "Classic 90, Globetrotter 80, as maximums."],
  ["Spare that matches", "The carrier wants an undamaged tire and rim of the specified type."],
  ["Hitch pin, cotter, and ball lube", "Carry a spare pin in the coach, not only in the truck. A spare 7-way plug is the usual road spare."],
  ["Wheel chocks and a warning triangle", "Both are on the manual equipment list. A hi-vis vest is worth having at the roadside."],
  ["Two drinking-water hoses, a sewer hose, and a spare cap", "A hose washer, and a 90° elbow at the city inlet so the hose does not lever the fitting."],
  ["Spare LP pigtails and a soapy-water bottle", "Collapsed pigtails are a common no-flame fault. Growing bubbles are a leak. Never a flame."],
  ["1-1/16 in socket and a regulated air fitting", "The socket removes a Suburban tank anode. The fitting is the winter blow-out, held to your manual’s pressure limit."],
  ["Hygrometer", "Keep indoor humidity at or under 60%, about 35% in a cold climate."],
  ["Headlamp, gloves, and safety glasses", "Plus the flashlight and first-aid kit already in the motoring list. Eye protection for rivets and bearings."],
  ["Contact cleaner, dielectric grease, graphite, Boeshield", "7-way, breakaway pin, locks, hinge."],
  ["Water-heater anode or descale kit", "Tank: 233514. Tankless Suburban: 521163. Do not carry an anode for a tankless."],
  ["Alde glycol, Classics", "360371-301C or -201C. Not automotive antifreeze."],
  ["Non-toxic RV antifreeze", "Traps, and the winterize kit if you use the pink method."],
];

export function ToolsView() {
  return (
    <div>
      <Kicker>Classic 28RB and Globetrotter 27FB kit</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">What to carry</PageTitle>
      <p className="mt-2 text-sm text-muted">Socket sizes vary. Test-fit every tool on your own trailer before you leave.</p>
      <ul className="mt-4 space-y-2">
        {kit.map(([t, d]) => (
          <li key={t} className="rounded-card border border-line bg-sheet p-4">
            <p className="font-semibold text-ink">{t}</p>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type PendingFile = { id: string; name: string; mime: string; blob: Blob; url: string; role?: LogFile["role"] };

function fileError(err: unknown) {
  if (err instanceof Error && err.message === "too-big") return "That file is over 15 MB";
  if (err instanceof Error && err.message === "bad-type") return "Use a photo or a PDF";
  if (err instanceof Error && err.message === "heic") return "This photo is HEIC. Set the iPhone camera to Most Compatible, or choose a JPEG.";
  if (err instanceof Error && err.message === "odd-image") return "This photo format cannot be saved. Choose a JPEG or PNG.";
  return "Could not read that file";
}

export function LogView() {
  const log = useApp((s) => s.log);
  const odo = useApp((s) => s.odometer);
  const add = useApp((s) => s.addLog);
  const update = useApp((s) => s.updateLog);
  const remove = useApp((s) => s.removeLog);
  const removeFile = useApp((s) => s.removeLogFile);
  const flash = useApp((s) => s.flash);
  const modelId = useApp((s) => s.modelId);
  const vin = useApp((s) => s.vin);
  const modelYear = useApp((s) => s.modelYear);
  const setLogDraft = useApp((s) => s.setLogDraft);
  const model = modelById(modelId);
  const year = coachYear(vin, modelYear);
  const scheduleJobs = tasks.filter((task) => {
    if (task.cadence.type === "trip") return false;
    if (task.fit === "classic" && !model.alde && model.family !== "Other") return false;
    if (task.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
    if (task.procedureId && !procedureFits(task.procedureId, model, year)) return false;
    return true;
  });
  const [note, setNote] = useState("");
  const [job, setJob] = useState("");
  const [taskPick, setTaskPick] = useState("");
  const [entryIso, setEntryIso] = useState("");
  const [entryMiles, setEntryMiles] = useState(odo > 0 ? String(odo) : "");
  const [detail, setDetail] = useState<ServiceDetail>({});
  const [pending, setPending] = useState<PendingFile[]>([]);
  const draftTimer = useRef<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState<{ entryId: string; file: LogFile } | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [editIso, setEditIso] = useState("");
  const [editMiles, setEditMiles] = useState("");
  const [editDetail, setEditDetail] = useState<ServiceDetail>({});
  const [backupOpen, setBackupOpen] = useState(false);
  const [restoreLook, setRestoreLook] = useState<BackupPreview | null>(null);
  useBackLayer(backupOpen, () => setBackupOpen(false));
  useBackLayer(restoreLook !== null, () => setRestoreLook(null));
  useBackLayer(view !== null, () => setView(null));
  const [photoError, setPhotoError] = useState("");
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const noteRef = useRef(note);
  const jobRef = useRef(job);
  noteRef.current = note;
  jobRef.current = job;

  function remember(nextNote: string, nextJob: string, files: PendingFile[], now = false) {
    if (draftTimer.current != null) window.clearTimeout(draftTimer.current);
    const modelAt = useApp.getState().modelId;
    const write = () => {
      if (useApp.getState().modelId !== modelAt) return;
      setLogDraft({
        note: nextNote,
        job: nextJob,
        files: files.map(({ id, name, mime }) => ({ id, name, mime })),
      });
    };
    if (now) write();
    else draftTimer.current = window.setTimeout(write, 300);
  }

  useEffect(() => {
    let cancel = false;
    if (draftTimer.current != null) window.clearTimeout(draftTimer.current);
    const saved = useApp.getState().logDraft;
    setNote(saved?.note ?? "");
    setJob(saved?.job ?? "");
    setTaskPick(tasks.find((task) => task.title === (saved?.job ?? "").trim())?.id ?? "");
    setEntryIso(todayIso());
    setEntryMiles(useApp.getState().odometer > 0 ? String(useApp.getState().odometer) : "");
    setDetail({});
    setPending((current) => {
      for (const file of current) URL.revokeObjectURL(file.url);
      return [];
    });
    const files = saved?.files ?? [];
    if (!files.length) return () => { cancel = true; };
    void (async () => {
      const restored: PendingFile[] = [];
      for (const file of files) {
        const blob = await getFile(file.id);
        if (cancel) break;
        if (!blob) continue;
        restored.push({ id: file.id, name: file.name, mime: file.mime, blob, url: URL.createObjectURL(blob) });
      }
      if (cancel) {
        for (const file of restored) URL.revokeObjectURL(file.url);
        return;
      }
      setPending(restored);
    })();
    return () => {
      cancel = true;
    };
  }, [modelId]);

  useEffect(() => {
    return () => {
      for (const file of pendingRef.current) URL.revokeObjectURL(file.url);
    };
  }, []);

  async function takeFiles(list: FileList | null) {
    if (!list?.length || busy) return;
    setBusy(true);
    const next: PendingFile[] = [];
    try {
      for (const file of [...list]) {
        if (pending.length + next.length >= 6) {
          flash("Six files at a time");
          break;
        }
        try {
          const prepared = await prepareFile(file);
          next.push({ id: crypto.randomUUID(), ...prepared, url: URL.createObjectURL(prepared.blob) });
        } catch (err) {
          const message = fileError(err);
          if (err instanceof Error && (err.message === "heic" || err.message === "odd-image")) setPhotoError(message);
          else flash(message);
        }
      }
      if (next.length) {
        let kept = [...pending, ...next].slice(0, 6);
        setPhotoError("");
        setPending(kept);
        remember(note, job, kept, true);
        for (const file of next) {
          if (!kept.some((item) => item.id === file.id)) continue;
          try {
            await putFile(file.id, file.blob);
          } catch {
            kept = kept.filter((item) => item.id !== file.id);
            URL.revokeObjectURL(file.url);
            setPending(kept);
            remember(note, job, kept, true);
            flash("Could not save. This browser may be blocking storage.");
          }
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function finishRestore(plan: BackupPreview["plan"]) {
    try {
      await applyBackupFiles(plan, flash);
    } catch {
      flash("Could not restore. Nothing was replaced.");
    }
  }

  function dropPending(id: string) {
    setPending((current) => {
      const hit = current.find((file) => file.id === id);
      if (hit) URL.revokeObjectURL(hit.url);
      const left = current.filter((file) => file.id !== id);
      remember(noteRef.current, jobRef.current, left, true);
      return left;
    });
    void deleteFile(id);
  }

  async function saveEntry() {
    if (busy || (!note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail))) return;
    const miles = entryMiles.trim() === "" ? odo : Number(entryMiles.replace(/,/g, ""));
    if (entryMiles.trim() !== "" && !Number.isFinite(miles)) {
      flash("Miles should be a number");
      return;
    }
    setBusy(true);
    try {
      for (const file of pending) await putFile(file.id, file.blob);
      const saved = await Promise.resolve(
        add(
          note,
          pending.map((file) => ({ id: file.id, name: file.name, mime: file.mime, ...(file.role ? { role: file.role } : {}) })),
          job,
          false,
          { iso: entryIso || todayIso(), miles, detail, taskId: taskPick || undefined },
        ),
      );
      if (!saved) return;
      if (draftTimer.current != null) window.clearTimeout(draftTimer.current);
      for (const file of pending) URL.revokeObjectURL(file.url);
      setPending([]);
      setNote("");
      setJob("");
      setTaskPick("");
      setEntryIso(todayIso());
      setEntryMiles(odo > 0 ? String(odo) : "");
      setDetail({});
      if (!taskPick) flash("Saved on this phone");
    } catch {
      flash("Could not save. This browser may be blocking storage.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Kicker>On this phone</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Service log</PageTitle>
      <button type="button" onClick={() => useApp.getState().push({ name: "desk" })} className="mt-2 min-h-11 text-sm font-semibold text-accent">
        Shop sheet
      </button>
      <p className="mt-1 text-sm text-muted">
        Notes and photos stay with this trailer. A different coach has its own miles and log. Clearing the phone’s data deletes them, so keep a backup file.{" "}
        {odo ? `Current odometer ${odo.toLocaleString()} mi.` : "Add the mileage on Maintain so the schedule can use it."}
      </p>
      {log.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Record your first service visit. A job, a photo, or a receipt is enough.</p>
      ) : (
        <>
          <ProviderHistory log={log} />
        <ul className="mt-4 space-y-2">
          {log.map((entry) => (
            <li key={entry.id} className="rounded-card border border-rule bg-sheet p-4">
              <p className="text-sm tabular-nums text-muted">
                {formatWhen(entry.iso)}
                {entry.miles ? ` · ${entry.miles.toLocaleString()} mi` : ""}
              </p>
              {entry.job ? <p className="mt-1 font-semibold text-ink">{entry.job}</p> : null}
              <ServiceLines entry={entry} />
              {editing === entry.id ? (
                <form
                  className="mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const miles = editMiles.trim() === "" ? 0 : Number(editMiles.replace(/,/g, ""));
                    if (update(entry.id, draft, { iso: editIso, miles, detail: editDetail })) {
                      setEditing(null);
                      setDraft("");
                      setEditIso("");
                      setEditMiles("");
                      setEditDetail({});
                    }
                  }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-sm font-semibold text-muted" htmlFor={`date-${entry.id}`}>
                      Date
                      <input
                        id={`date-${entry.id}`}
                        type="date"
                        value={editIso}
                        onChange={(e) => setEditIso(e.target.value)}
                        className="mt-1 min-h-11 w-full rounded-card border border-line bg-paper px-3 text-base text-ink"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-muted" htmlFor={`miles-${entry.id}`}>
                      Miles
                      <input
                        id={`miles-${entry.id}`}
                        inputMode="numeric"
                        value={editMiles}
                        onChange={(e) => setEditMiles(e.target.value)}
                        className="mt-1 min-h-11 w-full rounded-card border border-line bg-paper px-3 text-base text-ink"
                      />
                    </label>
                  </div>
                  <ServiceFields idPrefix={`edit-${entry.id}`} value={editDetail} onChange={setEditDetail} />
                  <label className="mt-3 block text-sm font-semibold text-ink" htmlFor={`edit-${entry.id}`}>
                    Notes
                  <textarea
                    id={`edit-${entry.id}`}
                    value={draft}
                    maxLength={800}
                    rows={3}
                    onChange={(e) => setDraft(e.target.value)}
                    className="mt-2 w-full rounded-card border border-line bg-paper px-3 py-2 text-base text-ink"
                  />
                  </label>
                  <div className="mt-2 flex gap-2">
                    <Btn type="submit" className="px-3">
                      Save
                    </Btn>
                    <Btn
                      type="button"
                      variant="line"
                      className="px-3"
                      onClick={() => {
                        setEditing(null);
                        setDraft("");
                        setEditIso("");
                        setEditMiles("");
                        setEditDetail({});
                      }}
                    >
                      Cancel
                    </Btn>
                  </div>
                </form>
              ) : entry.note ? (
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{entry.note}</p>
              ) : null}
              {entry.files && entry.files.length > 0 && (
                <ul className="mt-3 flex gap-2 overflow-x-auto">
                  {entry.files.map((file) => (
                    <li key={file.id} className="shrink-0">
                      <button type="button" onClick={() => setView({ entryId: entry.id, file })} className="block" aria-label={`Open ${file.name}`}>
                        <StoredThumb file={file} />
                        {file.role ? <span className="mt-1 block text-center text-sm text-ink">{roleLabel(file.role)}</span> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 flex gap-4">
                {editing !== entry.id && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(entry.id);
                      setDraft(entry.note);
                      setEditIso(entry.iso);
                      setEditMiles(entry.miles ? String(entry.miles) : "");
                      setEditDetail({
                        work: entry.work,
                        provider: entry.provider,
                        parts: entry.parts,
                        partsCost: entry.partsCost,
                        laborCost: entry.laborCost,
                        cost: entry.cost,
                        warranty: entry.warranty,
                        tech: entry.tech,
                        phone: entry.phone,
                      });
                    }}
                    className="min-h-11 text-sm font-semibold text-accent"
                  >
                    Edit
                  </button>
                )}
                <button type="button" onClick={() => remove(entry.id)} className="min-h-11 text-sm font-semibold text-stop">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn variant="line" className="px-3" onClick={() => setBackupOpen(true)}>
          Export backup
        </Btn>
        <Btn variant="line" className="px-3" onClick={() => downloadHistory(log)}>
          Export history
        </Btn>
        <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-sheet px-4 text-sm font-semibold">
          Restore
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const result = await previewBackup(file);
              if (!result.ok) {
                flash(result.message);
                return;
              }
              setRestoreLook(result.look);
            }}
          />
        </label>
      </div>
      {backupOpen && <BackupSheet onClose={() => setBackupOpen(false)} />}
      {restoreLook && (
        <RestoreSheet
          look={restoreLook}
          onClose={() => setRestoreLook(null)}
          onRestore={() => {
            const plan = restoreLook.plan;
            setRestoreLook(null);
            void finishRestore(plan);
          }}
        />
      )}
      <div className="mt-4">
        <label className="block" htmlFor="service-task">
          <span className="block text-sm font-semibold text-ink">Schedule job</span>
          <select
            id="service-task"
            value={taskPick}
            onChange={(e) => {
              const id = e.target.value;
              setTaskPick(id);
              const task = scheduleJobs.find((item) => item.id === id);
              const nextJob = task ? task.title : job;
              if (task) setJob(task.title);
              remember(note, nextJob, pending);
            }}
            className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-base text-ink"
          >
            <option value="">Not a scheduled job</option>
            {scheduleJobs.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-2 text-sm text-muted">Choosing a schedule job marks it done on the date below, unless the schedule already has a later date.</p>
        <label className="mt-3 block" htmlFor="service-job">
          <span className="block text-sm font-semibold text-ink">Job</span>
          <input
            id="service-job"
            value={job}
            onChange={(e) => {
              const next = e.target.value;
              setJob(next);
              const match = scheduleJobs.find((task) => task.title === next.trim());
              setTaskPick(match?.id ?? "");
              remember(note, next, pending);
            }}
            maxLength={80}
            placeholder="Not on the schedule, such as a dent repair"
            className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-base"
          />
        </label>
        <label className="mt-3 block" htmlFor="service-note">
          <span className="block text-sm font-semibold text-ink">Service note</span>
          <input
            id="service-note"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              remember(e.target.value, job, pending);
            }}
            placeholder="Rotated tires, star torque 110"
            className="mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-base"
          />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block text-sm font-semibold text-ink" htmlFor="service-date">
            Date
            <input
              id="service-date"
              type="date"
              value={entryIso}
              onChange={(e) => setEntryIso(e.target.value)}
              className="mt-2 min-h-11 w-full rounded-card border border-line bg-sheet px-3 text-base text-ink"
            />
          </label>
          <label className="block text-sm font-semibold text-ink" htmlFor="service-miles">
            Miles
            <input
              id="service-miles"
              inputMode="numeric"
              value={entryMiles}
              onChange={(e) => setEntryMiles(e.target.value)}
              placeholder={odo > 0 ? String(odo) : "Trailer miles"}
              className="mt-2 min-h-11 w-full rounded-card border border-line bg-sheet px-3 text-base text-ink"
            />
          </label>
        </div>
        <ServiceFields idPrefix="service" value={detail} onChange={setDetail} />
        {pending.length > 0 && (
          <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {pending.map((file) => (
              <li key={file.id} className="relative shrink-0">
                <PendingThumb file={file} />
                <label className="mt-1 block text-sm text-ink" htmlFor={`role-${file.id}`}>
                  <span className="sr-only">What this file is</span>
                  <select
                    id={`role-${file.id}`}
                    value={file.role ?? ""}
                    onChange={(e) => {
                      const role = e.target.value as LogFile["role"] | "";
                      setPending((current) => current.map((item) => (item.id === file.id ? { ...item, role: role || undefined } : item)));
                    }}
                    className="min-h-11 w-full rounded-card border border-line bg-paper px-1 text-sm text-ink"
                  >
                    <option value="">Photo</option>
                    <option value="before">Before</option>
                    <option value="after">After</option>
                    <option value="receipt">Receipt</option>
                    <option value="invoice">Invoice</option>
                  </select>
                </label>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => dropPending(file.id)}
                  className="absolute -right-1 -top-1 grid size-11 place-items-center"
                >
                  <span className="grid size-6 place-items-center rounded-full bg-inverse text-on-navy">
                    <X className="size-3.5" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-sheet px-3 text-sm font-semibold text-ink">
            <Camera className="size-5 shrink-0" aria-hidden />
            Take photo
            <input
              id="log-photo"
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => {
                void takeFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-sheet px-3 text-sm font-semibold text-ink">
            <ScanLine className="size-5 shrink-0" aria-hidden />
            Scan or file
            <input
              id="log-scan"
              type="file"
              accept="image/*,application/pdf,.pdf"
              multiple
              className="sr-only"
              onChange={(e) => {
                void takeFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-sm text-muted">On iPhone, Scan Documents is in the file sheet. Photos are resized before they are saved.</p>
        {log.length >= 200 ? <p className="mt-2 text-sm font-semibold text-ink">The log is full at 200. Saving another entry removes the oldest one and its photos.</p> : null}
        {photoError ? (
          <div className="mt-2 flex items-start gap-2" role="alert">
            <p className="flex-1 text-sm font-semibold text-stop">{photoError}</p>
            <button type="button" onClick={() => setPhotoError("")} aria-label="Close" className="flex min-h-11 min-w-11 items-center justify-center text-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        <Btn
          className="mt-3 w-full disabled:border disabled:border-line disabled:bg-sheet disabled:text-muted disabled:opacity-100"
          disabled={busy || (!note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail))}
          aria-describedby={!note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail) ? "log-save-why" : undefined}
          onClick={() => void saveEntry()}
        >
          {busy ? "Working…" : "Save in the log"}
        </Btn>
        {!note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail) ? (
          <p id="log-save-why" className="mt-2 text-sm font-semibold text-ink">Add a job, a note, or a photo.</p>
        ) : null}
      </div>
      {view && (
        <FileViewer
          file={view.file}
          onClose={() => setView(null)}
          onRemove={() => {
            removeFile(view.entryId, view.file.id);
            setView(null);
            flash("Removed");
          }}
        />
      )}
    </div>
  );
}

function serviceFilled(detail: ServiceDetail) {
  return Object.values(detail).some((value) => typeof value === "string" && value.trim());
}

const SERVICE_FIELDS: { key: keyof ServiceDetail; label: string; max: number }[] = [
  { key: "work", label: "Work performed", max: 200 },
  { key: "provider", label: "Service provider", max: 80 },
  { key: "parts", label: "Parts", max: 200 },
  { key: "partsCost", label: "Parts cost", max: 20 },
  { key: "laborCost", label: "Labor cost", max: 20 },
  { key: "cost", label: "Total cost", max: 20 },
  { key: "warranty", label: "Warranty", max: 200 },
  { key: "tech", label: "Technician", max: 80 },
  { key: "phone", label: "Technician phone", max: 40 },
];

function ServiceFields({ idPrefix, value, onChange }: { idPrefix: string; value: ServiceDetail; onChange: (next: ServiceDetail) => void }) {
  return (
    <div className="mt-3 space-y-3">
      {SERVICE_FIELDS.map((field) => (
        <label key={field.key} className="block text-sm font-semibold text-ink" htmlFor={`${idPrefix}-${field.key}`}>
          {field.label}
          <input
            id={`${idPrefix}-${field.key}`}
            value={field.key === "cost" ? value.cost || serviceTotal(value.partsCost, value.laborCost) : (value[field.key] ?? "")}
            maxLength={field.max}
            inputMode={field.key === "partsCost" || field.key === "laborCost" || field.key === "cost" ? "decimal" : undefined}
            onChange={(e) => {
              const raw = e.target.value;
              if (field.key !== "partsCost" && field.key !== "laborCost") {
                onChange({ ...value, [field.key]: raw });
                return;
              }
              const next = { ...value, [field.key]: raw };
              const total = serviceTotal(next.partsCost, next.laborCost);
              onChange(total ? { ...next, cost: total } : next);
            }}
            className="mt-1 min-h-11 w-full rounded-card border border-line bg-sheet px-3 text-base font-normal text-ink"
          />
        </label>
      ))}
    </div>
  );
}

function ServiceLines({ entry }: { entry: LogEntry }) {
  const total = entry.cost?.trim() || serviceTotal(entry.partsCost, entry.laborCost);
  const rows = SERVICE_FIELDS.map((field) => {
    const text = field.key === "cost" ? total : entry[field.key];
    return [field.label, text] as const;
  }).filter((row): row is readonly [string, string] => Boolean(row[1]));
  if (!rows.length) return null;
  return (
    <dl className="mt-2">
      {rows.map(([label, text]) => (
        <div key={label} className="mt-1">
          <dt className="text-sm font-semibold text-ink">{label}</dt>
          <dd className="text-sm text-ink">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

function roleLabel(role: NonNullable<LogFile["role"]>) {
  if (role === "before") return "Before";
  if (role === "after") return "After";
  if (role === "receipt") return "Receipt";
  return "Invoice";
}

function ProviderHistory({ log }: { log: LogEntry[] }) {
  const counts = new Map<string, number>();
  for (const entry of log) {
    const name = entry.provider?.trim();
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const shops = [...counts.entries()];
  if (!shops.length) return null;
  return (
    <p className="mt-3 text-sm text-ink">
      Shops on this phone: {shops.map(([name, count]) => (count === 1 ? name : `${name} (${count})`)).join(", ")}.
    </p>
  );
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadHistory(log: LogEntry[]) {
  const header = ["Date", "Miles", "Job", "Work performed", "Service provider", "Parts", "Parts cost", "Labor cost", "Total cost", "Warranty", "Technician", "Phone", "Notes", "Files"];
  const lines = log.map((entry) =>
    [
      entry.iso,
      entry.miles ? String(entry.miles) : "",
      entry.job ?? "",
      entry.work ?? "",
      entry.provider ?? "",
      entry.parts ?? "",
      entry.partsCost ?? "",
      entry.laborCost ?? "",
      entry.cost ?? "",
      entry.warranty ?? "",
      entry.tech ?? "",
      entry.phone ?? "",
      entry.note,
      (entry.files ?? []).map((file) => (file.role ? `${roleLabel(file.role)}: ${file.name}` : file.name)).join("; "),
    ]
      .map(csvCell)
      .join(","),
  );
  const file = new File([[header.map(csvCell).join(","), ...lines].join("\n")], "rivetcare-service.csv", { type: "text/csv" });
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rivetcare-service.csv";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function PendingThumb({ file }: { file: PendingFile }) {
  if (file.mime === "application/pdf") return <PdfTile name={file.name} />;
  return <img src={file.url} alt="" className="size-20 rounded-card border border-line object-cover" />;
}

function StoredThumb({ file }: { file: LogFile }) {
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (file.mime === "application/pdf") return;
    let dead = false;
    let current = "";
    getFile(file.id)
      .then((blob) => {
        if (dead) return;
        if (!blob) {
          setMissing(true);
          return;
        }
        current = URL.createObjectURL(blob);
        setUrl(current);
      })
      .catch(() => {
        if (!dead) setMissing(true);
      });
    return () => {
      dead = true;
      if (current) URL.revokeObjectURL(current);
    };
  }, [file.id, file.mime]);
  if (file.mime === "application/pdf") return <PdfTile name={file.name} />;
  if (missing) return <MissingTile />;
  if (!url) return <span className="block size-20 rounded-card border border-line bg-paper" />;
  return <img src={url} alt="" className="size-20 rounded-card border border-line object-cover" />;
}

function PdfTile({ name }: { name: string }) {
  return (
    <span className="grid size-20 content-center justify-items-center overflow-hidden rounded-card border border-line bg-paper px-1 text-center">
      <FileText className="size-5 text-accent" aria-hidden />
      <span className="line-clamp-2 text-xs font-semibold leading-tight text-ink">{name.replace(/\.pdf$/i, "")}</span>
    </span>
  );
}

function MissingTile() {
  return <span className="grid size-20 place-items-center rounded-card border border-line bg-paper px-1 text-center text-xs font-semibold leading-tight text-muted">Not on this phone</span>;
}

function FileViewer({ file, onClose, onRemove }: { file: LogFile; onClose: () => void; onRemove: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const safeRef = useRef<Blob | null>(null);
  useEffect(() => {
    closeRef.current?.focus();
    let dead = false;
    let current = "";
    safeRef.current = null;
    getFile(file.id)
      .then(async (blob) => {
        if (dead) return;
        if (!blob) {
          setMissing(true);
          return;
        }
        const safe = await trustedBlob(blob, file.mime);
        if (dead) return;
        if (!safe) {
          setMissing(true);
          return;
        }
        safeRef.current = safe;
        current = URL.createObjectURL(safe);
        setUrl(current);
      })
      .catch(() => {
        if (!dead) setMissing(true);
      });
    return () => {
      dead = true;
      safeRef.current = null;
      if (current) URL.revokeObjectURL(current);
    };
  }, [file.id, file.mime]);

  async function share() {
    const blob = safeRef.current;
    if (!blob) {
      useApp.getState().flash("That file is not on this phone.");
      return;
    }
    const shared = new File([blob], file.name, { type: blob.type || file.mime });
    try {
      if (navigator.canShare?.({ files: [shared] })) {
        await navigator.share({ files: [shared], title: file.name });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
  }

  return createPortal(
    <div className="no-print fixed inset-0 z-40 flex justify-center bg-inverse" role="dialog" aria-modal="true" aria-label={file.name}>
      <div className="flex h-full w-full max-w-lg flex-col">
        <div className="safe-top flex items-center justify-between px-2">
          <button ref={closeRef} type="button" onClick={onClose} className="flex min-h-11 items-center px-2 text-sm font-semibold text-on-navy" aria-label="Back">
            <ChevronLeft className="size-5 shrink-0" aria-hidden />
            Back
          </button>
          <button type="button" onClick={() => void share()} disabled={!url} className="min-h-11 px-3 text-sm font-semibold text-on-navy disabled:opacity-40">
            Share
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center px-4">
          {missing && <p className="text-sm text-on-navy">That file is not on this phone.</p>}
          {!missing && !url && <p className="text-sm text-on-navy">Opening…</p>}
          {url && file.mime !== "application/pdf" && <img src={url} alt={file.name} className="max-h-full max-w-full object-contain" />}
          {url && file.mime === "application/pdf" && (
            <a href={url} target="_blank" rel="noopener" className="rounded-full bg-sheet px-4 py-3 text-sm font-semibold text-accent">
              Open {file.name}
            </a>
          )}
        </div>
        <div className="safe-bottom bg-sheet px-4 pt-4">
          <p className="text-sm font-semibold text-ink">{file.name}</p>
          <button type="button" onClick={onRemove} className="mt-1 min-h-11 text-sm font-semibold text-stop">
            Remove this file
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export { DisclaimerCopy } from "@/components/disclaimer";

export function AboutView() {
  return (
    <div className="space-y-4 text-sm text-ink">
      <div>
        <Kicker>November 2026 edition</Kicker>
        <PageTitle className="mt-1 font-display text-3xl">About RivetCare</PageTitle>
        <p className="mt-1 text-base text-ink">Owner's book for your Airstream</p>
        <p className="mt-1 text-sm text-muted">@RivetCareApp</p>
        <button type="button" onClick={() => useApp.getState().push({ name: "privacy" })} className="mt-2 block min-h-11 text-sm font-semibold text-accent">
          Privacy and where the data stays
        </button>
        <button type="button" onClick={() => useApp.getState().push({ name: "support" })} className="mt-1 block min-h-11 text-sm font-semibold text-accent">
          Support
        </button>
        <button type="button" onClick={() => useApp.getState().push({ name: "records" })} className="mt-1 block min-h-11 text-left text-sm font-semibold text-accent">
          Dealer and roadside are saved under Records
        </button>
      </div>
      <DisclaimerCopy />
    </div>
  );
}
