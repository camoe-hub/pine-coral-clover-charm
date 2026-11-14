import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { flowById, flows, followFlow, gasStopFlow, hazardFlow, waysFrom, type EndNode, type Flow } from "@/data/flows";
import { coachHasAlde, coachYear, flowFits, procedureFits, waterBrands } from "@/data/coach";
import { modelById } from "@/data/models";
import { useApp } from "@/lib/store";
import { useBackLayer } from "@/lib/back-layer";
import { plateKeyForFlow, plateLabel, plateOnFlow } from "@/lib/plates";
import { flowReport } from "@/lib/flow-report";
import { AlsoInBook } from "@/components/figure-view";
import { StepMark } from "@/components/step-mark";
import { jumpsForFlow } from "@/data/graph";
import { Btn, Card, Kicker, Notice, PageTitle, Pill } from "@/components/ui";

const DEMAND_HEATERS = ["Girard GSWH-2", "Suburban ST-65RL", "Suburban IW60", "Truma AquaGo", "Fogatti", "Truma Combi"];

function hotStart(id: string, brands: Set<string>, hasAlde: boolean) {
  if (id !== "hot" || hasAlde) return null;
  const tank = brands.has("Suburban tank") || brands.has("Atwood tank");
  const demand = DEMAND_HEATERS.some((name) => brands.has(name));
  return demand && !tank ? "demand" : null;
}

export function FlowsView() {
  const push = useApp((s) => s.push);
  const filter = useApp((s) => s.systemFilter);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const [showAll, setShowAll] = useState(false);
  const fitted = flows.filter((f) => flowFits(f, model, year));
  const narrowed = filter && !showAll;
  const list = narrowed ? fitted.filter((f) => f.system === filter) : fitted;
  return (
    <div>
      <Kicker>Yes, no, or not sure</Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">Flowcharts</PageTitle>
      <p className="mt-1 text-sm text-muted">A shorter path through the same problems. The checks it opens are the source. Follow those if the wording ever disagrees.</p>
      {filter ? (
        <p className="mt-3 text-sm text-ink">
          {list.length > 0 && !showAll ? `Showing ${filter}. ` : showAll ? `Showing every flowchart. ` : `No flowchart for ${filter}. `}
          <button type="button" className="font-semibold underline underline-offset-2" onClick={() => setShowAll((v) => !v)}>
            {showAll ? `Only ${filter}` : "Show all"}
          </button>
        </p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {list.map((flow) => (
          <li key={flow.id}>
            <button
              type="button"
              onClick={() => push({ name: "flow", id: flow.id })}
              className="flex w-full items-center gap-3 rounded-card border border-line bg-sheet px-3 py-3 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">{flow.system}</span>
                <span className="mt-0.5 block font-semibold text-ink">{flow.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{flow.blurb}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-muted" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FlowView({ id }: { id: string }) {
  const flow = flowById(id);
  const push = useApp((s) => s.push);
  const model = modelById(useApp((s) => s.modelId));
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const brands = waterBrands(model, year);
  const hasAlde = coachHasAlde(model, year);
  const setWinterPlace = useApp((s) => s.setWinterPlace);
  const remembered = flow && id === "winter" ? followFlow(flow, useApp.getState().winterPlace?.trail ?? []) : null;
  const [nodeId, setNodeId] = useState(remembered?.nodeId ?? hotStart(id, brands, hasAlde) ?? flow?.start ?? "");
  const [stack, setStack] = useState<string[]>(remembered?.stack ?? []);
  const [trail, setTrail] = useState<string[]>(remembered ? (useApp.getState().winterPlace?.trail ?? []) : []);
  const [unsure, setUnsure] = useState(false);
  useEffect(() => {
    setUnsure(false);
  }, [nodeId]);

  function popStep() {
    setStack((s) => {
      const prev = s[s.length - 1];
      if (!prev) return s;
      setNodeId(prev);
      setTrail((path) => {
        const next = path.slice(0, -1);
        if (id === "winter") setWinterPlace({ page: "flow", trail: next });
        return next;
      });
      return s.slice(0, -1);
    });
  }
  useBackLayer(stack.length > 0, popStep, stack.length);

  useEffect(() => {
    if (id !== "winter") return;
    const saved = useApp.getState().winterPlace?.trail ?? [];
    setWinterPlace({ page: "flow", trail: saved });
  }, [id, setWinterPlace]);

  if (!flow) return <p className="text-sm">That flowchart is not in this app.</p>;
  const node = flow.nodes[nodeId];
  if (!node) return <p className="text-sm">That step is missing.</p>;
  const aldeOnly = hasAlde && brands.size === 1 && brands.has("Alde 3030");
  const atwoodOnly = brands.size === 1 && brands.has("Atwood tank");
  const heaterUnnamed = model.family !== "Other" && flow.id === "hot" && brands.size === 0;
  const skipSuburban = aldeOnly && flow.id === "hot" && nodeId === "tank" && trail.length === 0;

  function remember(path: string[]) {
    if (id !== "winter") return;
    setWinterPlace({ page: "flow", trail: path });
  }

  function choose(next: string, answer: string) {
    const dest = flow?.id === "hot" && next === "alde-instead" && !hasAlde ? "unknown-heater" : next;
    const path = [...trail, answer];
    setStack((s) => [...s, nodeId]);
    setTrail(path);
    setNodeId(dest);
    remember(path);
  }

  return (
    <div>
      <Kicker>
        {flow.system} · step {trail.length + 1}
      </Kicker>
      <PageTitle className="mt-1 font-display text-3xl text-ink">{flow.title}</PageTitle>
      <p className="mt-1 text-sm text-muted">{model.name} · {year ?? "Year not set"}</p>
      <PlateLine flowId={flow.id} />
      {trail.length === 0 && gasStopFlow(flow.id) && (
        <p className="mt-2 text-sm font-semibold text-ink">If you smell propane, or a CO or LP alarm is sounding: shut the cylinders, ventilate, leave, and do not flip switches.</p>
      )}
      {trail.length === 0 && hazardFlow(flow.id) && (
        <div className="mt-2">
          <Notice tone="stop" title="Stop">This is an aid, not the manual. Gas, brakes, and shore power can hurt you. If you are not sure, stop.</Notice>
        </div>
      )}
      {trail.length > 0 && (
        <div className="mt-3">
          <Btn variant="line" onClick={popStep}>
            Back one step
          </Btn>
        </div>
      )}
      {flow.id === "hot" && aldeOnly && (
        <p className="mt-2 text-sm text-ink">Hot water on this Classic is the Alde. It is not a Suburban tank or a Suburban tankless.</p>
      )}
      {flow.id === "hot" && atwoodOnly && (
        <p className="mt-2 text-sm text-ink">This Classic year is an Atwood tank in the fitment notes, not a Suburban. Do not install a Suburban anode.</p>
      )}
      {heaterUnnamed && (
        <p className="mt-2 text-sm text-ink">This year does not name the water heater. Do not assume Suburban, Girard, or Truma. Read the plate, then use a question only if it matches that plate.</p>
      )}
      {skipSuburban ? (
        <Card className="mt-4 p-4">
          <p className="font-display text-2xl text-ink">Open the Alde checks</p>
          <p className="mt-2 text-sm text-muted">A Suburban flowchart is the wrong heater for this coach.</p>
          <div className="mt-4 grid gap-2">
            <Btn className="w-full" onClick={() => push({ name: "flow", id: "alde-heat" })}>
              Alde flowchart
            </Btn>
            <Btn variant="line" className="w-full" onClick={() => choose("demand", "Not the factory heater")}>
              This coach was changed
            </Btn>
          </div>
        </Card>
      ) : node.type === "ask" ? (
        <Card className="mt-4 p-4">
          <p className="font-display text-2xl text-ink">{node.q}</p>
          {node.detail && !(flow.id === "hot" && nodeId === "demand" && !hasAlde) && <p className="mt-2 text-base text-ink">{node.detail}</p>}
          <StepMark text={`${node.q} ${node.detail ?? ""}`} />
          <div className={`mt-4 grid gap-2 ${waysFrom(flow, nodeId) ? "grid-cols-3" : "grid-cols-2"}`}>
            <Btn variant="line" className="w-full px-2" onClick={() => choose(node.yes, "Yes")}>
              Yes
            </Btn>
            <Btn variant="line" className="w-full px-2" onClick={() => choose(node.no, "No")}>
              No
            </Btn>
            {waysFrom(flow, nodeId) ? (
              <Btn variant="line" className="w-full px-2" aria-expanded={unsure} onClick={() => setUnsure(true)}>
                Not sure
              </Btn>
            ) : null}
          </div>
          <NotSure flow={flow} nodeId={nodeId} open={unsure} />
        </Card>
      ) : (
        <End
          flow={flow}
          trail={trail}
          node={node}
          onOpen={
            node.procedure && procedureFits(node.procedure, model, year)
              ? () => push({ name: "procedure", id: node.procedure! })
              : node.symptom
                ? () => push({ name: "symptom", id: node.symptom!, step: 0 })
                : undefined
          }
          label={node.procedure ? "Open the winterizing procedure" : "Open the full checks"}
        />
      )}
      <div className="mt-4 flex gap-2">
        {trail.length > 0 && <p className="min-w-0 flex-1 self-center text-sm text-muted">Path: {trail.join(" → ")}</p>}
        {nodeId !== flow.start && (
          <Btn
            variant="ghost"
            onClick={() => {
              setTrail([]);
              setStack([]);
              setNodeId(flow.start);
              remember([]);
            }}
          >
            Start over
          </Btn>
        )}
      </div>
      <div className="mt-4">
        <AlsoInBook
          items={jumpsForFlow(flow.id).filter((item) => item.to.name !== "procedure" || procedureFits(item.to.id, model, year))}
        />
      </div>
    </div>
  );
}

function NotSure({ flow, nodeId, open }: { flow: Flow; nodeId: string; open: boolean }) {
  const push = useApp((s) => s.push);
  const ways = waysFrom(flow, nodeId);
  if (!ways || !open) return null;
  const shared = ways.shared;
  return (
    <div className="mt-3 border-t border-rule pt-3">
      <p className="text-sm text-ink">Nothing is chosen yet. Read both, then tap Yes or No only if one of them is right.</p>
      <p className="mt-3 text-sm font-semibold text-ink">If yes</p>
      <p className="text-sm text-ink">{ways.yes.kind === "ask" ? ways.yes.label : `Stops at: ${ways.yes.label}`}</p>
      <p className="mt-3 text-sm font-semibold text-ink">If no</p>
      <p className="text-sm text-ink">{ways.no.kind === "ask" ? ways.no.label : `Stops at: ${ways.no.label}`}</p>
      {shared ? (
        <Btn
          variant="line"
          className="mt-3 w-full"
          onClick={() => {
            if (shared.symptom) push({ name: "symptom", id: shared.symptom, step: 0 });
            else if (shared.procedure) push({ name: "procedure", id: shared.procedure });
          }}
        >
          Open the checks either answer would use
        </Btn>
      ) : null}
    </div>
  );
}

function PlateLine({ flowId }: { flowId: string }) {
  const plates = useApp((s) => s.plates);
  const push = useApp((s) => s.push);
  const key = plateKeyForFlow(flowId);
  if (!key) return null;
  const note = plateOnFlow(flowId, plates);
  if (!note) {
    return (
      <div className="mt-2 text-sm text-muted">
        <p>No {plateLabel(key).toLowerCase()} plate saved.</p>
        <button type="button" className="min-h-11 font-semibold text-accent" onClick={() => push({ name: "specs" })}>
          Read it off the unit
        </button>
      </div>
    );
  }
  return (
    <div className="mt-2 space-y-1">
      <p className="text-sm text-ink">{note.line}</p>
      {note.warn ? <p className="text-sm font-semibold text-ink">{note.warn}</p> : null}
    </div>
  );
}

function PathNote({ flow, trail, node }: { flow: Flow; trail: string[]; node: EndNode }) {
  const addNote = useApp((s) => s.addNote);
  const flash = useApp((s) => s.flash);
  const model = modelById(useApp((s) => s.modelId));
  const nickname = useApp((s) => s.nickname);
  const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
  const plate = plateOnFlow(flow.id, useApp((s) => s.plates));
  const [saved, setSaved] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);

  async function handOff(text: string, already: boolean) {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Repair note", text });
        flash(already ? "Already in notes" : "Saved in notes");
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          flash(already ? "Already in notes" : "Saved in notes");
          return;
        }
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flash(already ? "Copied" : "Copied. Saved in notes.");
    } catch {
      flash("Saved in notes");
    }
  }

  function report() {
    return flowReport({
      flow,
      trail,
      node,
      model,
      year,
      coach: nickname || model.name,
      plate: plate?.line,
    });
  }

  async function saveLog() {
    const text = report().log;
    const full = useApp.getState().log.length >= 200;
    if (!(await Promise.resolve(useApp.getState().addLog(text, undefined, flow.title.slice(0, 80), true)))) {
      flash("Could not save that in the service log.");
      return;
    }
    setLogged(true);
    flash(full ? "Saved in the service log. The oldest entry was removed." : "Saved in the service log.");
  }

  async function save() {
    const text = report().log;
    if (!saved && !(await Promise.resolve(addNote(text)))) return;
    if (!saved) setSaved(text);
    void handOff(text, !!saved);
  }

  const rows = report().rows;

  return (
    <div className="mt-4 border-t border-rule pt-3">
      <dl>
        {rows.map((row) => (
          <div key={row.label} className="mt-3 first:mt-0">
            <dt className="text-sm font-semibold text-ink">{row.label}</dt>
            <dd className="mt-0.5 whitespace-pre-line text-sm text-ink">{row.text}</dd>
          </div>
        ))}
      </dl>
      <Btn variant="line" className="mt-4" onClick={saveLog} disabled={logged}>
        {logged ? "In the service log" : "Save this report in the service log"}
      </Btn>
      <Btn variant="line" className="mt-2" onClick={save}>
        Save this path
      </Btn>
      <p className="mt-2 text-sm text-muted">The log line says this is a path taken, not a diagnosis. It names a fault code or a manual page only when this stop already does. Nothing is uploaded.</p>
    </div>
  );
}

function End({ flow, trail, node, onOpen, label }: { flow: Flow; trail: string[]; node: EndNode; onOpen?: () => void; label: string }) {
  return (
    <Card className="mt-4 p-4">
      {node.level && (
        <Pill tone={node.level === "stop" ? "danger" : node.level === "soon" ? "warn" : "line"}>
          {node.level === "stop" ? "Stop" : node.level === "soon" ? "Soon" : "Watch"}
        </Pill>
      )}
      <p className="mt-2 font-display text-2xl text-ink">{node.title}</p>
      <StepMark text={`${node.title} ${node.body}`} />
      <PathNote flow={flow} trail={trail} node={node} />
      {onOpen && (
        <div className="mt-4">
          <Btn onClick={onOpen}>{label}</Btn>
        </div>
      )}
    </Card>
  );
}
