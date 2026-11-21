import { useEffect, useMemo, useRef, useState } from "react";
import { modelById } from "@/data/models";
import { WEIGHTS_KEY, MATCH_LB, MAX_WEIGHTS, TOW_KEY, asTow, asWeighIns, cumulativeOrder, explainTicket, fromCumulative, logReady, newId, readWeightsFile, scaleProblems, seedTow, stickerPounds, tongueShareNote, weigh, weightDistribution, weightEntry, weightProblem, weightsFit, writeWeightsFile, type Line, type Pass, type WeighIn } from "@/lib/weights";
import { useApp } from "@/lib/store";
import { todayIso, formatWhen } from "@/lib/date";
import { deleteFile, getFile, prepareFile, putFile } from "@/lib/files";
import { Btn, Chip, Kicker, PageTitle } from "@/components/ui";

const KEY = WEIGHTS_KEY;

type Mode = "axle" | "total";

type Form = {
  truckName: string;
  trailerName: string;
  mode: Mode;
  steerRating: string;
  driveRating: string;
  gvwRating: string;
  payloadRating: string;
  gcwr: string;
  trailerRating: string;
  tongueRating: string;
  factory: string;
  truckFront: string;
  truckRear: string;
  bareFront: string;
  bareRear: string;
  bareTrailer: string;
  wdFront: string;
  wdRear: string;
  wdTrailer: string;
  psi: string;
  bars: string;
  washers: string;
  shank: string;
  shankHole: string;
  perchHole: string;
  trailerOnly: string;
  combinedTyped: string;
  ticketPhoto: string;
};

const empty: Form = {
  truckName: "",
  trailerName: "",
  mode: "axle",
  steerRating: "",
  driveRating: "",
  gvwRating: "",
  payloadRating: "",
  gcwr: "",
  trailerRating: "",
  tongueRating: "",
  factory: "",
  truckFront: "",
  truckRear: "",
  bareFront: "",
  bareRear: "",
  bareTrailer: "",
  wdFront: "",
  wdRear: "",
  wdTrailer: "",
  psi: "",
  bars: "",
  washers: "",
  shank: "",
  shankHole: "",
  perchHole: "",
  trailerOnly: "",
  combinedTyped: "",
  ticketPhoto: "",
};

function scaleFilled(form: Form) {
  return [form.truckFront, form.truckRear, form.bareFront, form.bareRear, form.bareTrailer, form.wdFront, form.wdRear, form.wdTrailer, form.trailerOnly, form.combinedTyped].some((value) => value.trim());
}

function pounds(text: string): string {
  return stickerPounds(text);
}

function num(text: string): number | null {
  const t = text.trim();
  if (!/^\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function pass(front: string, rear: string, trailer: string, mode: Mode): Pass {
  if (mode === "total") return fromCumulative(num(front), num(rear), trailer ? num(trailer) : null);
  return { steer: num(front), drive: num(rear), trailer: trailer ? num(trailer) : null };
}

function lb(n: number | null): string {
  if (n == null || Number.isNaN(n)) return "Not entered";
  return `${Math.round(n).toLocaleString()} lb`;
}

function pct(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${Math.round(n * 100)}%`;
}

function blankForm(trailerName: string, gvwr: string, uvw: string): Form {
  return { ...empty, trailerName, trailerRating: gvwr, factory: uvw };
}

function isSingleForm(value: unknown): value is Partial<Form> {
  return !!value && typeof value === "object" && !Array.isArray(value) && ("mode" in value || "truckFront" in value || "trailerRating" in value);
}

function readForm(value: Partial<Form>): Form {
  return { ...empty, ...value, mode: value.mode === "total" ? "total" : "axle" };
}

function loadStored(modelId: string, trailerName: string, gvwr: string, uvw: string): { form: Form; trips: WeighIn[] } {
  const blank = { form: blankForm(trailerName, gvwr, uvw), trips: [] as WeighIn[] };
  if (typeof window === "undefined") return blank;
  const file = readWeightsFile();
  let form = blank.form;
  let trips = blank.trips;
  if (file && isSingleForm(file)) {
    form = readForm(file);
    const next = { [modelId]: { ...form, trips: [] } };
    const tow = asTow(form);
    localStorage.setItem(KEY, JSON.stringify({ ...next, [TOW_KEY]: tow }));
  } else if (file) {
    const row = file[modelId];
    if (row && typeof row === "object" && !Array.isArray(row)) {
      form = readForm(row as Partial<Form>);
      trips = asWeighIns((row as { trips?: unknown }).trips);
    }
  }
  const tow = seedTow(file && isSingleForm(file) ? { [modelId]: form, [TOW_KEY]: asTow(form) } : file, modelId);
  return { form: tow ? { ...form, ...tow } : form, trips };
}

function saveStored(modelId: string, form: Form, trips: WeighIn[]): boolean {
  try {
    let all: Record<string, unknown> = {};
    const raw = localStorage.getItem(KEY);
    if (raw && raw.length > MAX_WEIGHTS) return false;
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && !isSingleForm(parsed)) all = parsed as Record<string, unknown>;
      } catch {
        /* corrupt saved tickets are replaced by this save */
      }
    }
    all[modelId] = { ...form, trips };
    all[TOW_KEY] = asTow(form);
    if (!weightsFit(all)) return false;
    return writeWeightsFile(all);
  } catch {
    return false;
  }
}

export function WeightsView() {
  const model = modelById(useApp((s) => s.modelId));
  const addLog = useApp((s) => s.addLog);
  const flash = useApp((s) => s.flash);
  const loaded = useRef(model.id);
  const initial = useRef<{ form: Form; trips: WeighIn[] } | null>(null);
  if (!initial.current) initial.current = loadStored(model.id, model.name, pounds(model.gvwr), pounds(model.ubw));
  const [form, setForm] = useState<Form>(initial.current.form);
  const [trips, setTrips] = useState<WeighIn[]>(initial.current.trips);

  const toldFull = useRef(false);

  useEffect(() => {
    if (loaded.current !== model.id) {
      loaded.current = model.id;
      const next = loadStored(model.id, model.name, pounds(model.gvwr), pounds(model.ubw));
      setForm(next.form);
      setTrips(next.trips);
      return;
    }
    if (saveStored(model.id, form, trips)) toldFull.current = false;
    else if (!toldFull.current) {
      toldFull.current = true;
      flash("The scale tickets did not save. This phone's copy is full, so backup would drop them.");
    }
  }, [form, trips, model.id, model.name, model.gvwr, model.ubw, flash]);

  async function saveTicket() {
    const fields = [form.truckFront, form.truckRear, form.bareFront, form.bareRear, form.bareTrailer, form.wdFront, form.wdRear, form.wdTrailer];
    if (!fields.some((value) => value.trim())) {
      flash("Enter a scale weight first");
      return;
    }
    const missing = logReady(result);
    if (missing) {
      flash(missing);
      return;
    }
    const problems = scaleProblems(result);
    if (problems.block) {
      flash(problems.block);
      return;
    }
    const reading = (label: string, value: string) => (value.trim() ? `${label} ${value.trim()} lb` : "");
    const bits = [
      "CAT scale",
      reading("truck steer", form.truckFront),
      reading("truck drive", form.truckRear),
      reading("bars off steer", form.bareFront),
      reading("bars off drive", form.bareRear),
      reading("bars off trailer", form.bareTrailer),
      reading("bars on steer", form.wdFront),
      reading("bars on drive", form.wdRear),
      reading("bars on trailer", form.wdTrailer),
    ].filter(Boolean);
    const tongue = result.trailer.tongue.actual;
    const trailer = result.trailer.weight.actual;
    if (trailer != null) bits.push(`trailer ${Math.round(trailer).toLocaleString()} lb`);
    if (tongue != null) bits.push(`tongue ${Math.round(tongue).toLocaleString()} lb`);
    if (problems.warn) bits.push(problems.warn);
    if (!(await Promise.resolve(addLog(`${bits.join(". ")}.`)))) return;
    flash("Saved in the service log");
  }

  function saveWeighIn() {
    const fields = [form.truckFront, form.truckRear, form.bareFront, form.bareRear, form.bareTrailer, form.wdFront, form.wdRear, form.wdTrailer, form.trailerOnly];
    if (!fields.some((value) => value.trim())) {
      flash("Enter a scale weight first");
      return;
    }
    if (problems.block) {
      flash(problems.block);
      return;
    }
    const trip: WeighIn = {
      id: newId(),
      iso: todayIso(),
      name: form.trailerName || "Weigh-in",
      mode: form.mode,
      truckFront: form.truckFront,
      truckRear: form.truckRear,
      bareFront: form.bareFront,
      bareRear: form.bareRear,
      bareTrailer: form.bareTrailer,
      wdFront: form.wdFront,
      wdRear: form.wdRear,
      wdTrailer: form.wdTrailer,
      trailerOnly: form.trailerOnly,
      combinedTyped: form.combinedTyped,
    };
    setTrips((list) => {
      if (list.length >= 12) flash("The oldest weigh-in was dropped. Twelve are kept.");
      return [trip, ...list].slice(0, 12);
    });
    flash("Weigh-in kept on this phone");
  }

  async function exportReport() {
    const entered = (label: string, value: string) => `${label}: ${value.trim() ? `${value.trim()} lb` : "not entered"}`;
    const lines = [
      "Weight report. Measured weights, not ratings.",
      form.truckName || "Truck",
      form.trailerName || "Trailer",
      form.mode === "total" ? "Ticket style: running total" : "Ticket style: each axle alone",
      "",
      entered("Truck only, steer", form.truckFront),
      entered("Truck only, drive", form.truckRear),
      entered("Bars off, steer", form.bareFront),
      entered("Bars off, drive", form.bareRear),
      entered("Bars off, trailer axles", form.bareTrailer),
      entered("Bars on, steer", form.wdFront),
      entered("Bars on, drive", form.wdRear),
      entered("Bars on, trailer axles", form.wdTrailer),
      entered("Truck GVWR", form.gvwRating),
      entered("Payload rating", form.payloadRating),
      entered("GCWR", form.gcwr),
      entered("Trailer GVWR", form.trailerRating),
      entered("Tongue rating", form.tongueRating),
      "",
      `Payload, truck only: ${lb(result.truck.payload.actual)}`,
      `Payload, bars off: ${lb(result.noWd.payload.actual)}`,
      `Payload, bars on: ${lb(result.wd.payload.actual)}`,
      "",
      ...sheetRows(explained).map((row) => `${row.label}: ${row.value}`),
      ...(tongueNote ? [tongueNote] : []),
      "",
      ...explained.notes,
      ...explained.flags,
      "",
      "Not a towing safety assessment. Confirm the door stickers.",
    ];
    const text = lines.filter((line, i, all) => line !== "" || all[i - 1] !== "").join("\n");
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Weight report", text });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      flash("Weight report copied");
    } catch {
      flash("Could not share the weight report");
    }
  }

  async function onTicketPhoto(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    try {
      const prepared = await prepareFile(file);
      if (!prepared.mime.startsWith("image/")) {
        flash("Use a photo of the ticket.");
        return;
      }
      const id = newId();
      await putFile(id, prepared.blob);
      const prev = form.ticketPhoto;
      set("ticketPhoto", id);
      if (prev) void deleteFile(prev);
      flash("Photo kept. Type the numbers and check them. This app does not read the ticket.");
    } catch (err) {
      const heic = err instanceof Error && err.message === "heic";
      flash(heic ? "This photo is HEIC. Use Most Compatible, or a JPEG." : "Could not save that photo.");
    }
  }

  function setMode(mode: Mode) {
    if (mode === form.mode) return;
    const filled = [form.truckFront, form.truckRear, form.bareFront, form.bareRear, form.bareTrailer, form.wdFront, form.wdRear, form.wdTrailer].some((value) => value.trim());
    set("mode", mode);
    if (filled) flash(mode === "total" ? "Those numbers are now read as a running total." : "Those numbers are now read as each axle alone.");
  }

  function openWeighIn(trip: WeighIn) {
    if (scaleFilled(form) && !window.confirm("Replace the numbers on this screen with that weigh-in?")) return;
    setForm((current) => ({
      ...current,
      mode: trip.mode,
      truckFront: trip.truckFront,
      truckRear: trip.truckRear,
      bareFront: trip.bareFront,
      bareRear: trip.bareRear,
      bareTrailer: trip.bareTrailer,
      wdFront: trip.wdFront,
      wdRear: trip.wdRear,
      wdTrailer: trip.wdTrailer,
      trailerOnly: trip.trailerOnly,
      combinedTyped: trip.combinedTyped,
    }));
  }

  function clearNumbers() {
    if (scaleFilled(form) && !window.confirm("Clear the scale numbers on this screen? Saved weigh-ins stay.")) return;
    setForm((current) => ({
      ...current,
      truckFront: "",
      truckRear: "",
      bareFront: "",
      bareRear: "",
      bareTrailer: "",
      wdFront: "",
      wdRear: "",
      wdTrailer: "",
      trailerOnly: "",
      combinedTyped: "",
    }));
  }

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const result = useMemo(() => {
    return weigh(
      pass(form.truckFront, form.truckRear, "", form.mode),
      pass(form.bareFront, form.bareRear, form.bareTrailer, form.mode),
      pass(form.wdFront, form.wdRear, form.wdTrailer, form.mode),
      {
        steer: num(form.steerRating),
        drive: num(form.driveRating),
        gvw: num(form.gvwRating),
        payload: num(form.payloadRating),
        gcwr: num(form.gcwr),
        trailer: num(form.trailerRating),
        tongue: num(form.tongueRating),
        factory: num(form.factory),
      },
    );
  }, [form]);
  const problems = scaleProblems(result);
  const tongueNote = tongueShareNote(result.trailer.tonguePct);
  const explained = useMemo(() => {
    const bareOn = [form.bareFront, form.bareRear, form.bareTrailer].some((value) => value.trim());
    const barsOn = [form.wdFront, form.wdRear, form.wdTrailer].some((value) => value.trim());
    const passName = bareOn ? "bars off" : barsOn ? "bars on" : "none";
    const coupled = passName === "bars off" ? pass(form.bareFront, form.bareRear, form.bareTrailer, form.mode) : passName === "bars on" ? pass(form.wdFront, form.wdRear, form.wdTrailer, form.mode) : null;
    return explainTicket({
      coupled,
      truckOnly: result.truck.gvw.actual,
      trailerOnly: num(form.trailerOnly),
      combinedTyped: num(form.combinedTyped),
      barsOnCombined: result.wd.gcw.actual,
      ratings: { gvw: num(form.gvwRating), gcwr: num(form.gcwr), trailer: num(form.trailerRating), tongue: num(form.tongueRating) },
      passName,
    });
  }, [form, result]);

  const frontLabel = form.mode === "total" ? "Front axle on the scale" : "Steer axle";
  const rearLabel = form.mode === "total" ? "Front and rear on the scale" : "Drive axle";
  const trailerLabel = form.mode === "total" ? "Truck and trailer on the scale" : "Trailer axles";

  return (
    <div className="space-y-6">
      <div>
        <Kicker>Truck scale</Kicker>
        <PageTitle className="mt-1 text-3xl text-ink">Truck and trailer</PageTitle>
        <p className="mt-2 text-sm text-muted">
          Ratings come from the door stickers. Weights come from a truck scale. A CAT Scale ticket is one kind. GVW is a measured weight. GVWR is the rated maximum. A red number is a measured weight over a rating. This is not a towing safety assessment.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">Names</h2>
        <Text label="Truck" value={form.truckName} onChange={(v) => set("truckName", v)} />
        <Text label="Trailer" value={form.trailerName} onChange={(v) => set("trailerName", v)} />
      </section>

      <section className="space-y-3">
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">Rated capacities, pounds</h2>
        <div className="grid grid-cols-2 gap-3">
          <Lb id="rate-steer" label="Steer axle" value={form.steerRating} onChange={(v) => set("steerRating", v)} />
          <Lb id="rate-drive" label="Drive axle" value={form.driveRating} onChange={(v) => set("driveRating", v)} />
          <Lb id="rate-gvw" label="Truck GVWR" value={form.gvwRating} onChange={(v) => set("gvwRating", v)} />
          <Lb id="rate-payload" label="Payload" value={form.payloadRating} onChange={(v) => set("payloadRating", v)} />
          <Lb id="rate-gcwr" label="GCWR" value={form.gcwr} onChange={(v) => set("gcwr", v)} />
          <Lb id="rate-trailer" label="Trailer GVWR" value={form.trailerRating} onChange={(v) => set("trailerRating", v)} />
          <Lb id="rate-tongue" label="Tongue rating" value={form.tongueRating} onChange={(v) => set("tongueRating", v)} />
          <Lb id="rate-factory" label="Trailer as built" value={form.factory} onChange={(v) => set("factory", v)} />
        </div>
        <p className="text-sm text-muted">Trailer GVWR and as-built weight start from the selected floor. Confirm both on your sticker. They do not change with the VIN year. The truck name and the truck ratings stay when you change trailers. Enter pounds. Pasting a number that ends in kg converts it.</p>
      </section>

      <section>
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">How the scale ticket is written</h2>
        <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="Scale ticket style">
          <Chip on={form.mode === "axle"} onClick={() => setMode("axle")}>
            Each axle alone
          </Chip>
          <Chip on={form.mode === "total"} onClick={() => setMode("total")}>
            Running total
          </Chip>
        </div>
        <p className="mt-2 text-sm text-muted">
          {form.mode === "total"
            ? "Enter the number on the scale as the front axle stops, then with the rear on too, then with the trailer."
            : "Enter the weight of each axle group by itself."}{" "}
          Use the three passes in order. A blank pass is missing, not a safe result.
        </p>
      </section>

      <Weigh title="Pass 1. Truck only" front={frontLabel} rear={rearLabel} form={form} keys={["truckFront", "truckRear"]} set={set} />
      <Weigh
        title="Pass 2. Coupled, bars off"
        front={frontLabel}
        rear={rearLabel}
        trailer={trailerLabel}
        form={form}
        keys={["bareFront", "bareRear", "bareTrailer"]}
        set={set}
      />
      <Weigh
        title="Pass 3. Coupled, bars on"
        front={frontLabel}
        rear={rearLabel}
        trailer={trailerLabel}
        form={form}
        keys={["wdFront", "wdRear", "wdTrailer"]}
        set={set}
      />

      <section className="space-y-3">
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">Also on the ticket, if you have them</h2>
        <Lb id="combined-typed" label="Combined weight printed on the ticket" value={form.combinedTyped} onChange={(v) => set("combinedTyped", v)} />
        <Lb id="trailer-only" label="Trailer weighed alone" value={form.trailerOnly} onChange={(v) => set("trailerOnly", v)} />
        <p className="text-sm text-muted">Leave these blank if the ticket does not show them. A trailer-only weigh is not the same as the trailer axle group on a coupled ticket.</p>
        <label className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-accent">
          Photograph the ticket
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => {
              void onTicketPhoto(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {form.ticketPhoto ? <TicketPhoto id={form.ticketPhoto} /> : null}
        <p className="text-sm text-muted">The photo is kept so you can check the numbers. Nothing is read off it, and nothing is uploaded.</p>
      </section>

      <TicketSheet explained={explained} />

      <Result title="Truck only" lines={[
        ["Steer axle", result.truck.steer, "Steer rating"],
        ["Drive axle", result.truck.drive, "Drive rating"],
        ["Measured GVW", result.truck.gvw, "GVWR"],
        ["Payload, truck only", result.truck.payload, "Payload rating"],
      ]} note={result.truck.factory != null ? `Truck as built, from the GVWR minus the payload rating: ${lb(result.truck.factory)}. That is not a measured GVW.` : "Measured GVW is the scale. GVWR is the rating."} />

      <Result title="Coupled, bars off" lines={[
        ["Steer axle", result.noWd.steer, "Steer rating"],
        ["Drive axle", result.noWd.drive, "Drive rating"],
        ["Measured GVW", result.noWd.gvw, "GVWR"],
        ["Payload with the trailer", result.noWd.payload, "Payload rating"],
        ["Trailer axles", result.noWd.trailer, "measured"],
        ["Measured GCW", result.noWd.gcw, "GCWR"],
      ]} />

      <Result title="Coupled, bars on" lines={[
        ["Steer axle", result.wd.steer, "Steer rating"],
        ["Drive axle", result.wd.drive, "Drive rating"],
        ["Measured GVW", result.wd.gvw, "GVWR"],
        ["Payload with the trailer", result.wd.payload, "Payload rating"],
        ["Trailer axles", result.wd.trailer, "measured"],
        ["Measured GCW", result.wd.gcw, "GCWR"],
      ]} note="Bars move load between axles. This measured GVW is not the tongue weight." />

      <HitchCalc
        truck={pass(form.truckFront, form.truckRear, "", form.mode)}
        noWd={pass(form.bareFront, form.bareRear, form.bareTrailer, form.mode)}
        wd={pass(form.wdFront, form.wdRear, form.wdTrailer, form.mode)}
      />

      <section className="rounded-card border border-line bg-sheet p-4">
        <h2 className="text-2xl text-ink">What the hitch is doing</h2>
        <dl className="mt-3">
          <Fact label="Trailer weight" value={lb(result.trailer.weight.actual)} margin={result.trailer.weight.left} marginOf="trailer GVWR" share={result.trailer.weight.pct} shareOf="loaded trailer as a share of GVWR" />
          <Fact label="Tongue weight, bars off" value={lb(result.trailer.tongue.actual)} margin={result.trailer.tongue.left} marginOf="tongue rating" share={result.trailer.tongue.pct} shareOf="tongue rating" />
          <Fact label="Tongue as a share of the loaded trailer" value={shareText(result.trailer.tonguePct)} />
          {tongueNote ? <div className="border-b border-rule py-2 text-sm text-ink">{tongueNote}</div> : null}
          <Fact label="Tongue still on the truck, bars on" value={lb(result.trailer.tongueOnTruck)} />
          <Fact label="Tongue moved onto the trailer axles" value={lb(result.trailer.xfer)} share={result.trailer.xferPct} shareOf="bars-off tongue weight" />
          <Fact label="Trailer cargo" value={lb(result.trailer.cargo.actual)} margin={result.trailer.cargo.left} marginOf="cargo capacity" share={result.trailer.cargo.pct} shareOf="cargo capacity" />
        </dl>
        {problems.block ? <p className="mt-3 text-sm font-semibold text-ink">{problems.block}</p> : null}
        {problems.warn ? <p className="mt-3 text-sm font-semibold text-ink">{problems.warn}</p> : null}
      </section>

      <section className="space-y-3">
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">Hitch setup notes</h2>
        <div className="grid grid-cols-2 gap-3">
          <Text label="Tire pressure, front / rear" value={form.psi} onChange={(v) => set("psi", v)} />
          <Text label="Bars" value={form.bars} onChange={(v) => set("bars", v)} />
          <Text label="Washers" value={form.washers} onChange={(v) => set("washers", v)} />
          <Text label="Shank" value={form.shank} onChange={(v) => set("shank", v)} />
          <Text label="Hole on the shank" value={form.shankHole} onChange={(v) => set("shankHole", v)} />
          <Text label="Hole on the perch" value={form.perchHole} onChange={(v) => set("perchHole", v)} />
        </div>
      </section>

      <Btn className="w-full" onClick={saveWeighIn}>
        Save this weigh-in
      </Btn>
      <Btn variant="line" className="w-full" onClick={saveTicket}>
        Save this ticket in the log
      </Btn>
      <Btn variant="line" className="w-full" onClick={() => void exportReport()}>
        Export the weight report
      </Btn>
      <History
        trips={trips}
        onOpen={openWeighIn}
      />
      <Btn variant="text"
        type="button"
        onClick={clearNumbers}>
        Clear the scale numbers
      </Btn>
    </div>
  );
}

function Weigh({
  title,
  front,
  rear,
  trailer,
  form,
  keys,
  set,
}: {
  title: string;
  front: string;
  rear: string;
  trailer?: string;
  form: Form;
  keys: Array<keyof Form>;
  set: <K extends keyof Form>(key: K, value: Form[K]) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">{title}</h2>
      <Lb id={String(keys[0])} label={front} value={String(form[keys[0]])} onChange={(v) => set(keys[0], v)} />
      <Lb id={String(keys[1])} label={rear} value={String(form[keys[1]])} onChange={(v) => set(keys[1], v)} />
      {trailer && keys[2] && <Lb id={String(keys[2])} label={trailer} value={String(form[keys[2]])} onChange={(v) => set(keys[2], v)} />}
      {form.mode === "total" ? (
        <OrderNote front={String(form[keys[0]])} mid={String(form[keys[1]])} all={keys[2] ? String(form[keys[2]]) : ""} />
      ) : null}
    </section>
  );
}

function Result({ title, lines, note }: { title: string; lines: Array<[string, Line, string?]>; note?: string }) {
  const over = lines.some(([, row]) => row.left != null && row.left < 0);
  return (
    <section className="min-w-0 rounded-card border border-line bg-sheet p-4">
      <h2 className="text-2xl text-ink">{title}</h2>
      {over && <p className="mt-1 text-sm font-semibold text-stop">A measured weight is over its rating.</p>}
      <dl className="mt-3">
        {lines.map(([label, row, rating]) => {
          const hot = row.left != null && row.left < 0;
          const aside = resultAside(row, rating);
          return (
            <div key={label} className="min-w-0 border-b border-rule py-2 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="min-w-0 text-sm font-semibold text-ink">{label}</dt>
                <dd className={`shrink-0 text-right text-sm tabular-nums ${hot ? "font-semibold text-stop" : "text-ink"}`}>
                  <span className="block font-semibold">{row.actual == null ? "Not entered" : lb(row.actual)}</span>
                </dd>
              </div>
              {aside.map((line) => (
                <p key={line} className={`mt-1 text-sm ${hot ? "text-stop" : "text-muted"}`}>{line}</p>
              ))}
            </div>
          );
        })}
      </dl>
      {note && <p className="mt-2 text-sm text-muted">{note}</p>}
    </section>
  );
}

function resultAside(row: Line, rating?: string): string[] {
  if (row.actual == null) return [];
  if (rating === "measured") return ["Measured axle load. Trailer GVWR is for the loaded trailer, axles plus tongue."];
  const name = rating ?? "rating";
  if (row.rated == null) return [`No ${name} entered. This measured weight is not room left under a limit, and it is not a safe-tow result.`];
  const lines = [`${name} ${lb(row.rated)}`];
  if (row.left != null) lines.push(row.left < 0 ? `${lb(Math.abs(row.left))} over the ${name}` : `${lb(row.left)} under the ${name}`);
  if (row.pct != null && Number.isFinite(row.pct)) {
    lines.push(`${pct(row.pct)} of the ${name}`);
  }
  return lines;
}

function sheetRows(explained: ReturnType<typeof explainTicket>) {
  return [
    { label: "Truck front axle", value: lb(explained.front), detail: "Measured." },
    { label: "Truck rear axle", value: lb(explained.rear), detail: "Measured." },
    { label: "Trailer axle group", value: lb(explained.trailerAxles), detail: "Measured. This does not include tongue weight." },
    { label: "Combined weight", value: lb(explained.combined), detail: "Measured GCW. Front, rear, and trailer axles added. Not a GCWR." },
    { label: "Truck GVW", value: lb(explained.gvw), detail: "Measured on this configuration. The tongue is already in it when the trailer is coupled." },
    { label: "Truck-only weight", value: lb(explained.truckOnly), detail: "Measured with the trailer off, when you entered it." },
    { label: "Tongue weight", value: lb(explained.tongue), detail: "Bars-off truck GVW minus the truck alone. Not printed on a single coupled ticket." },
    { label: "Tongue share", value: shareText(explained.share), detail: "Tongue weight divided by the loaded trailer." },
    { label: "Loaded trailer", value: lb(explained.loaded), detail: "Trailer axles plus tongue. Not the trailer GVWR." },
  ];
}

function shareText(n: number | null) {
  if (n == null || !Number.isFinite(n)) return "Not entered";
  return `${(Math.round(n * 10000) / 100).toFixed(2)}%`;
}

function HitchCalc({ truck, noWd, wd }: { truck: Pass; noWd: Pass; wd: Pass }) {
  const hitch = weightDistribution(truck, noWd, wd);
  const missing = hitch.lostFront == null || hitch.restoredFront == null;
  return (
    <section className="rounded-card border border-line bg-sheet p-4">
      <h2 className="text-2xl text-ink">Weight-distribution hitch</h2>
      <p className="mt-2 text-sm text-ink">The bars move load among the axles. They do not change the tongue weight or the combined weight.</p>
      {missing ? (
        <p className="mt-3 text-sm text-ink">Enter the truck alone, then the coupled weigh with the bars off, then the same weigh with the bars on. Those three front-axle numbers are the hitch calculation.</p>
      ) : (
        <dl className="mt-3">
          <Fact label="Lost off the front axle, bars off" value={lb(hitch.lostFront)} />
          <Fact label="Put back on the front axle by the bars" value={lb(hitch.restoredFront)} />
          <Fact label="Front-axle restoration" value={hitch.restoration == null ? "Not defined" : pct(hitch.restoration)} />
          <Fact label="Rear axle, bars on versus bars off" value={signedMove(hitch.rearChange, "added to the rear", "taken off the rear")} />
          <Fact label="Trailer axles, bars on versus bars off" value={signedMove(hitch.trailerChange, "added to the trailer axles", "taken off the trailer axles")} />
        </dl>
      )}
      {hitch.restoration == null && hitch.lostFront != null && hitch.lostFront <= 0 ? (
        <p className="mt-3 text-sm text-ink">The front axle did not get lighter when you coupled, so there is no lost weight for the bars to put back.</p>
      ) : null}
      {hitch.balance != null ? (
        <p className="mt-3 text-sm text-muted">
          {Math.abs(hitch.balance) <= MATCH_LB
            ? "The front, rear, and trailer changes add up. The bars moved load. They did not add or remove weight."
            : `The axle changes disagree by ${lb(Math.abs(hitch.balance))}. Re-enter the two coupled tickets.`}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-muted">The hitch maker’s instructions set how much front-axle weight to put back. This page does not.</p>
    </section>
  );
}

function signedMove(n: number | null, gained: string, lost: string) {
  if (n == null) return "Not entered";
  if (n === 0) return "No change";
  return n > 0 ? `${lb(n)} ${gained}` : `${lb(Math.abs(n))} ${lost}`;
}

function TicketSheet({ explained }: { explained: ReturnType<typeof explainTicket> }) {
  return (
    <section className="rounded-card border border-line bg-sheet p-4">
      <h2 className="text-2xl text-ink">This ticket</h2>
      <dl className="mt-3">
        {sheetRows(explained).map((row) => (
          <div key={row.label} className="border-b border-rule py-2 last:border-b-0">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-semibold text-ink">{row.label}</dt>
              <dd className="text-sm font-semibold tabular-nums text-ink">{row.value}</dd>
            </div>
            <p className="text-sm text-muted">{row.detail}</p>
          </div>
        ))}
      </dl>
      <div className="mt-3 space-y-2">
        {explained.notes.map((note) => (
          <p key={note} className="text-sm text-ink">{note}</p>
        ))}
        {explained.flags.map((flag) => (
          <p key={flag} className="text-sm font-semibold text-ink">{flag}</p>
        ))}
      </div>
    </section>
  );
}

function History({ trips, onOpen }: { trips: WeighIn[]; onOpen: (trip: WeighIn) => void }) {
  if (!trips.length) return <p className="text-sm text-muted">No earlier weigh-in is saved yet. Save this weigh-in keeps it on the phone. The log line is separate.</p>;
  return (
    <section>
      <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">Earlier weigh-ins</h2>
      <ul className="mt-2">
        {trips.map((trip, index) => {
          const current = explainSaved(trip);
          const prev = trips[index + 1] ? explainSaved(trips[index + 1]) : null;
          const delta = current.combined != null && prev?.combined != null ? current.combined - prev.combined : null;
          return (
            <li key={trip.id} className="border-b border-rule py-3">
              <button type="button" className="min-h-11 w-full text-left" onClick={() => onOpen(trip)}>
                <span className="block font-semibold text-ink">{trip.name || "Weigh-in"}</span>
                <span className="mt-1 block text-sm tabular-nums text-ink">
                  {formatWhen(trip.iso)}
                  {current.combined != null ? ` · Combined ${lb(current.combined)}` : ""}
                  {current.tongue != null ? ` · Tongue ${lb(current.tongue)}` : ""}
                  {current.loaded != null ? ` · Trailer ${lb(current.loaded)}` : ""}
                </span>
                {delta != null ? (
                  <span className="mt-1 block text-sm tabular-nums text-muted">
                    {delta === 0 ? "Same combined weight as the older weigh-in" : `${delta > 0 ? "Up" : "Down"} ${lb(Math.abs(delta))} combined from the older weigh-in`}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-sm text-muted">Open a row to put those numbers back in the form. Twelve weigh-ins are kept. Saving a thirteenth drops the oldest.</p>
    </section>
  );
}

function explainSaved(trip: WeighIn) {
  const bareOn = [trip.bareFront, trip.bareRear, trip.bareTrailer].some((value) => value.trim());
  const barsOn = [trip.wdFront, trip.wdRear, trip.wdTrailer].some((value) => value.trim());
  const passName = bareOn ? "bars off" : barsOn ? "bars on" : "none";
  const coupled = passName === "bars off" ? pass(trip.bareFront, trip.bareRear, trip.bareTrailer, trip.mode) : passName === "bars on" ? pass(trip.wdFront, trip.wdRear, trip.wdTrailer, trip.mode) : null;
  const truck = pass(trip.truckFront, trip.truckRear, "", trip.mode);
  const truckOnly = truck.steer != null && truck.drive != null ? truck.steer + truck.drive : null;
  const bars = pass(trip.wdFront, trip.wdRear, trip.wdTrailer, trip.mode);
  const barsCombined = bars.steer != null && bars.drive != null && bars.trailer != null ? bars.steer + bars.drive + bars.trailer : null;
  return explainTicket({
    coupled,
    truckOnly,
    trailerOnly: num(trip.trailerOnly),
    combinedTyped: num(trip.combinedTyped),
    barsOnCombined: barsCombined,
    ratings: { gvw: null, gcwr: null, trailer: null, tongue: null },
    passName,
  });
}

function TicketPhoto({ id }: { id: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let live = true;
    let object = "";
    void getFile(id).then((blob) => {
      if (!blob || !live) return;
      object = URL.createObjectURL(blob);
      setUrl(object);
    });
    return () => {
      live = false;
      if (object) URL.revokeObjectURL(object);
    };
  }, [id]);
  return url ? <img src={url} alt="Scale ticket" className="h-24 w-24 rounded-lg object-cover" /> : null;
}

function Fact({
  label,
  value,
  margin,
  marginOf,
  share,
  shareOf,
}: {
  label: string;
  value: string;
  margin?: number | null;
  marginOf?: string;
  share?: number | null;
  shareOf?: string;
}) {
  const over = margin != null && margin < 0;
  const lines: string[] = [];
  if (margin != null && marginOf) lines.push(over ? `${lb(Math.abs(margin))} over the ${marginOf}` : `${lb(margin)} under the ${marginOf}`);
  if (share != null && Number.isFinite(share) && shareOf) {
    lines.push(shareOf.includes(" as a share ") ? `${pct(share)} — ${shareOf}` : `${pct(share)} of the ${shareOf}`);
  }
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-rule py-2 last:border-b-0">
      <dt className="min-w-0 text-sm font-semibold text-ink">{label}</dt>
      <dd className={`shrink-0 text-right text-sm tabular-nums ${over ? "font-semibold text-stop" : "text-ink"}`}>
        <span className="block font-semibold">{value}</span>
        {lines.map((line) => (
          <span key={line} className={`block font-normal ${over ? "text-stop" : "text-muted"}`}>{line}</span>
        ))}
      </dd>
    </div>
  );
}

function OrderNote({ front, mid, all }: { front: string; mid: string; all: string }) {
  const note = cumulativeOrder(num(front), num(mid), all.trim() ? num(all) : null);
  return note ? <p className="text-sm text-caution">{note}</p> : null;
}

function toPounds(raw: string): string {
  return weightEntry(raw);
}

function Lb({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(toPounds(e.target.value))}
        className="mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink"
      />
      {weightProblem(value) ? <p className="mt-1 text-sm text-caution">{weightProblem(value)}</p> : null}
    </div>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = `note-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 min-h-11 w-full rounded-xl border border-line bg-sheet px-3 text-ink"
      />
    </div>
  );
}
