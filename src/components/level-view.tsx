import { useEffect, useRef, useState } from "react";
import { PageTitle } from "@/components/ui";
import { Check } from "lucide-react";
import { accelConvention, applyZero, correctAccel, floorRead, parseSpan, tiltFromAccel, typedFloorTilt, zeroFromTilt, type AxisRead, type Tilt } from "@/lib/level";
import { readSpans, readZero, writeSpans, writeZero } from "@/lib/level-spans";
import { jackStart, trackStart } from "@/lib/level-track";
import { modelById } from "@/data/models";
import { useApp } from "@/lib/store";

type MotionCtor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type Side = "curbside" | "roadside" | "level";
type End = "tongue" | "front" | "level";

const field = "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base tabular-nums text-ink";
/** How often the floor reading updates. The phone reports motion much faster than this. */
const SAMPLE_MS = 500;
/** No new motion for this long means the last reading is no longer current. */
const STALE_MS = 2000;
/** A case bump of a couple of degrees should leave the center. Past this, the dot stays on the rim. */
const BUBBLE_FULL_DEG = 4;
const BUBBLE_TRAVEL_PX = 48;

function bubbleShift(deg: number) {
  const clamped = Math.max(-BUBBLE_FULL_DEG, Math.min(BUBBLE_FULL_DEG, deg));
  return (clamped / BUBBLE_FULL_DEG) * BUBBLE_TRAVEL_PX;
}

/** Bubble runs to the high side. Pitch up is toward the tongue. */
function LevelMark({ tilt, steady }: { tilt: Tilt | null; steady: boolean }) {
  const level = !!tilt && steady && Math.abs(tilt.pitchDeg) < 0.5 && Math.abs(tilt.rollDeg) < 0.5;
  const dx = tilt ? bubbleShift(-tilt.rollDeg) * 1.3 : 0;
  const dy = tilt ? bubbleShift(-tilt.pitchDeg) * 1.3 : 0;
  return (
    <span className="relative h-52 w-52 shrink-0 rounded-full border-2 border-line bg-paper" aria-hidden="true">
      <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rule" />
      {tilt ? (
        <span
          className={`absolute left-1/2 top-1/2 h-10 w-10 rounded-full ${level ? "bg-ok" : "bg-ink"}`}
          style={{ transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))` }}
        />
      ) : null}
    </span>
  );
}

function permissionKind(): "ask" | "listen" | "missing" {
  if (typeof DeviceMotionEvent === "undefined") return "missing";
  const ctor = DeviceMotionEvent as MotionCtor;
  return typeof ctor.requestPermission === "function" ? "ask" : "listen";
}

function average(samples: Tilt[]): Tilt {
  const n = samples.length;
  const sum = samples.reduce(
    (acc, sample) => ({
      pitchDeg: acc.pitchDeg + sample.pitchDeg,
      rollDeg: acc.rollDeg + sample.rollDeg,
      flatDeg: acc.flatDeg + sample.flatDeg,
      mag: acc.mag + sample.mag,
      z: acc.z + sample.z,
    }),
    { pitchDeg: 0, rollDeg: 0, flatDeg: 0, mag: 0, z: 0 },
  );
  return {
    pitchDeg: sum.pitchDeg / n,
    rollDeg: sum.rollDeg / n,
    flatDeg: sum.flatDeg / n,
    mag: sum.mag / n,
    z: sum.z / n,
  };
}

function steadyEnough(samples: Tilt[]) {
  if (samples.length < 3) return false;
  const pitch = samples.map((sample) => sample.pitchDeg);
  const roll = samples.map((sample) => sample.rollDeg);
  const spread = (values: number[]) => Math.max(...values) - Math.min(...values);
  return spread(pitch) <= 1 && spread(roll) <= 1;
}

export function LevelView() {
  const modelId = useApp((s) => s.modelId);
  const [track, setTrack] = useState("");
  const [jack, setJack] = useState("");
  const [trackOwn, setTrackOwn] = useState(false);
  const [jackOwn, setJackOwn] = useState(false);
  const [live, setLive] = useState<Tilt | null>(null);
  const [steady, setSteady] = useState(false);
  const [listening, setListening] = useState(false);
  const [denied, setDenied] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [typedOn, setTypedOn] = useState(false);
  const [sideDeg, setSideDeg] = useState("");
  const [side, setSide] = useState<Side | "">("");
  const [endDeg, setEndDeg] = useState("");
  const [end, setEnd] = useState<End | "">("");
  const [typed, setTyped] = useState<Tilt | null>(null);
  const [typedMsg, setTypedMsg] = useState("");
  const [paused, setPaused] = useState(false);
  const [zero, setZero] = useState<ReturnType<typeof readZero>>(null);
  const [zeroMsg, setZeroMsg] = useState("");
  const [spanMsg, setSpanMsg] = useState("");
  const [ready, setReady] = useState(false);
  const samples = useRef<Tilt[]>([]);
  const saw = useRef(false);
  const lastMotion = useRef(0);

  useEffect(() => {
    setReady(true);
    setZero(readZero());
  }, []);

  useEffect(() => {
    const saved = readSpans(modelId);
    const model = modelById(modelId);
    const trackFigure = trackStart(model);
    const jackFigure = jackStart(model);
    if (saved.jack != null) {
      setJack(String(saved.jack));
      setJackOwn(true);
    } else {
      setJack(jackFigure.inches == null ? "" : String(jackFigure.inches));
      setJackOwn(false);
    }
    if (saved.track != null) {
      setTrack(String(saved.track));
      setTrackOwn(true);
    } else {
      setTrack(trackFigure.inches == null ? "" : String(trackFigure.inches));
      setTrackOwn(false);
    }
  }, [modelId]);

  useEffect(() => {
    if (!listening) return;
    const convention = accelConvention({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
    });
    saw.current = false;
    samples.current = [];
    lastMotion.current = 0;
    let bucket: Tilt[] = [];
    let lastAt = 0;
    const onMotion = (event: DeviceMotionEvent) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel || accel.x == null || accel.y == null || accel.z == null) return;
      const corrected = correctAccel(accel.x, accel.y, accel.z, convention);
      const tilt = tiltFromAccel(corrected.x, corrected.y, corrected.z);
      if (!tilt) return;
      saw.current = true;
      lastMotion.current = Date.now();
      setPaused(false);
      bucket.push(tilt);
      const now = lastMotion.current;
      if (lastAt !== 0 && now - lastAt < SAMPLE_MS) return;
      lastAt = now;
      const sample = average(bucket);
      bucket = [];
      const next = samples.current.concat(sample).slice(-8);
      samples.current = next;
      setUnavailable(false);
      setSteady(steadyEnough(next.slice(-4)));
      setLive(average(next.slice(-4)));
      setTyped(null);
    };
    window.addEventListener("devicemotion", onMotion);
    const timer = window.setTimeout(() => {
      if (!saw.current) setUnavailable(true);
    }, 2500);
    const stale = window.setInterval(() => {
      if (!saw.current || lastMotion.current === 0 || Date.now() - lastMotion.current < STALE_MS) return;
      setPaused(true);
      setSteady(false);
      setLive(null);
      samples.current = [];
    }, 500);
    return () => {
      window.removeEventListener("devicemotion", onMotion);
      window.clearTimeout(timer);
      window.clearInterval(stale);
    };
  }, [listening]);

  function persist(nextTrack: string, nextJack: string, ownTrack: boolean, ownJack: boolean) {
    const trackSpan = !ownTrack || nextTrack.trim() === "" ? null : parseSpan(nextTrack);
    const jackSpan = !ownJack || nextJack.trim() === "" ? null : parseSpan(nextJack);
    const trackOk = !ownTrack || nextTrack.trim() === "" || trackSpan != null;
    const jackOk = !ownJack || nextJack.trim() === "" || jackSpan != null;
    if (!trackOk || !jackOk) return;
    setSpanMsg(writeSpans(modelId, { track: trackSpan, jack: jackSpan }) ? "" : "The spans did not save on this phone.");
  }

  function stop() {
    setListening(false);
    setPaused(false);
    setSteady(false);
    setLive(null);
    samples.current = [];
  }

  function recheck() {
    samples.current = [];
    lastMotion.current = Date.now();
    setPaused(false);
    setSteady(false);
    setLive(null);
    setTyped(null);
    setTypedMsg("");
    if (!listening) void start();
  }

  async function start() {
    setDenied(false);
    setUnavailable(false);
    setPaused(false);
    setTyped(null);
    setTypedMsg("");
    const kind = permissionKind();
    if (kind === "missing") {
      setUnavailable(true);
      return;
    }
    if (kind === "ask") {
      try {
        const result = await (DeviceMotionEvent as MotionCtor).requestPermission?.();
        if (result === "denied") {
          setDenied(true);
          setListening(false);
          return;
        }
      } catch {
        setDenied(true);
        setListening(false);
        return;
      }
    }
    setListening(true);
  }

  function zeroPhone() {
    if (!live || !steady) {
      setZeroMsg(listening ? "Hold still on a level surface, then zero." : "Read the floor first. Then set the phone on a level surface and zero.");
      return;
    }
    const next = zeroFromTilt(live);
    if (!next) {
      setZeroMsg("Hold the phone flat, screen up, on a level surface, then zero.");
      return;
    }
    setZero(next);
    setZeroMsg("");
    writeZero(next);
  }

  function clearZero() {
    setZero(null);
    setZeroMsg("");
    writeZero(null);
  }

  function acceptFigures() {
    const ownTrack = parseSpan(track) != null;
    const ownJack = parseSpan(jack) != null;
    if (!ownTrack && !ownJack) return;
    setTrackOwn(ownTrack);
    setJackOwn(ownJack);
    persist(track, jack, ownTrack, ownJack);
  }

  function useTyped() {
    if (!side || !end) {
      setTypedMsg("Pick the low side and the low end, or Level, before the inches.");
      return;
    }
    const result = typedFloorTilt({ side, sideDeg, end, endDeg });
    if (!result.ok) {
      setTypedMsg(result.message);
      return;
    }
    setTypedMsg("");
    setListening(false);
    setPaused(false);
    setLive(null);
    setSteady(true);
    setTyped(result.tilt);
  }

  const model = modelById(modelId);
  const figure = trackStart(model);
  const jackFigure = jackStart(model);
  const spans = { track: trackOwn ? parseSpan(track) : null, jack: jackOwn ? parseSpan(jack) : null };
  const bubbleTilt = live ? applyZero(live, zero) : null;
  const tilt = typed ?? bubbleTilt;
  const read = tilt ? floorRead(tilt, spans, typed ? true : steady) : null;
  const trackBad = track.trim() !== "" && parseSpan(track) == null;
  const jackBad = jack.trim() !== "" && parseSpan(jack) == null;
  const canAccept = (!trackOwn && parseSpan(track) != null) || (!jackOwn && parseSpan(jack) != null);

  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">On site</p>
      <PageTitle className="mt-1 text-3xl text-ink">Trailer level</PageTitle>
      <p className="mt-2 text-sm text-ink">Top of the phone toward the tongue. Screen up, flat on the floor. Side to side first, then the jack. Stabilizers are not for leveling.</p>

      <div className="mt-4 flex justify-center">
        <LevelMark tilt={bubbleTilt} steady={steady} />
      </div>

      <div className="mt-4 overflow-hidden rounded-[20px] border border-line bg-sheet" aria-live="polite">
        {paused && listening ? (
          <p className="px-4 py-4 font-display text-2xl leading-tight text-ink">Reading paused. Hold the phone still and try again.</p>
        ) : read?.axes ? (
          <div>
            <AxisCard axis={read.axes[0]} deg={tilt ? formatDeg(tilt.rollDeg) : ""} />
            <div className="mx-4 border-t border-rule" />
            <AxisCard axis={read.axes[1]} deg={tilt ? formatDeg(tilt.pitchDeg) : ""} />
          </div>
        ) : (
          <p className="px-4 py-4 font-display text-2xl leading-tight text-ink">{read ? read.lines[0] : "Set the phone on the floor, top toward the tongue."}</p>
        )}
      </div>
      {read?.estimate ? <p className="mt-3 text-sm text-muted">Estimate from the phone on the floor. Not a certified level.</p> : null}

      <section className="mt-4" aria-label="Sensor status">
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">Sensor</h2>
        <ul className="mt-2 space-y-2 text-sm text-ink">
          <StatusRow on={!!typed || (listening && steady && !paused)} label={paused && listening ? "Reading paused" : typed || (listening && steady) ? "Stable reading" : listening ? "Hold still" : "Not reading yet"} />
          <StatusRow on={!!tilt && tilt.z > 0} label={tilt && tilt.z <= 0 ? "Turn the phone screen up" : tilt ? "Screen up" : "Screen up, top toward the tongue"} />
        </ul>
      </section>

      {denied ? <p className="mt-3 text-sm text-ink">Motion is off for RivetCare. Type a Level reading below, or turn motion on in Settings.</p> : null}
      {unavailable && !denied ? <p className="mt-3 text-sm text-ink">This window is not sending motion. Type a Level reading, or open RivetCare on the phone.</p> : null}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {listening ? (
          <>
            <button type="button" onClick={stop} className="min-h-14 rounded-[18px] border border-line bg-sheet px-3 text-sm font-semibold text-ink">
              Stop reading
            </button>
            <button type="button" onClick={recheck} className="min-h-14 rounded-[18px] border border-line bg-sheet px-3 text-sm font-semibold text-ink">
              Recheck
            </button>
          </>
        ) : (
          <button type="button" onClick={() => void start()} className="col-span-2 min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy">
            {ready && permissionKind() === "ask" ? "Allow motion" : "Read the floor"}
          </button>
        )}
      </div>
      <button type="button" onClick={zeroPhone} className="mt-2 flex min-h-14 w-full items-center justify-center rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink">
        Zero the phone
      </button>
      <p className="mt-3 text-sm text-muted">Set the phone on a surface you know is level, and hold still. Zero takes out a case or a camera bump. It does not level the trailer, and it stays on this phone.</p>
      {zero ? <p className="mt-2 text-sm text-ink">Zero is set for this phone.</p> : null}
      {zeroMsg ? <p className="mt-2 text-sm text-ink">{zeroMsg}</p> : null}
      {zero ? (
        <button type="button" onClick={clearZero} className="mt-2 min-h-11 text-sm font-semibold text-ink">
          Clear zero
        </button>
      ) : null}

      <section className="mt-6">
        <h2 className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">For this coach</h2>
        <label className="mt-3 block text-sm font-semibold text-ink" htmlFor="level-track">
          Track, inches
          <span className="mt-1 block font-normal text-muted">{trackOwn ? "Saved for this coach. Hub-face to hub-face, not the body width." : figure.note}</span>
          <input
            id="level-track"
            inputMode="decimal"
            value={track}
            onChange={(e) => {
              const next = e.target.value.replace(/[^\d.]/g, "").slice(0, 6);
              const own = next.trim() !== "";
              setTrack(next);
              setTrackOwn(own);
              persist(next, jack, own, jackOwn);
            }}
            className={field}
          />
        </label>
        {trackBad ? <p className="mt-1 text-sm text-caution">Use 20 to 400 inches, one decimal.</p> : null}
        <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="level-jack">
          Jack to axle, inches
          <span className="mt-1 block font-normal text-muted">{jackOwn ? "Saved for this coach. Jack foot to the axle centerline." : jackFigure.note}</span>
          <input
            id="level-jack"
            inputMode="decimal"
            value={jack}
            onChange={(e) => {
              const next = e.target.value.replace(/[^\d.]/g, "").slice(0, 6);
              const own = next.trim() !== "";
              setJack(next);
              setJackOwn(own);
              persist(track, next, trackOwn, own);
            }}
            className={field}
          />
        </label>
        {jackBad ? <p className="mt-1 text-sm text-caution">Use 20 to 400 inches, one decimal.</p> : null}
        {spanMsg ? <p className="mt-3 text-sm text-ink">{spanMsg}</p> : null}
        {canAccept ? (
          <p className="mt-3 text-sm text-muted">The inches stay off until you use these starting figures or type your own. A number already in the box is not a measurement of this trailer.</p>
        ) : (
          <p className="mt-3 text-sm text-muted">A number you type replaces the starting figure and stays on this phone with this coach.</p>
        )}
        {canAccept ? (
          <button type="button" onClick={acceptFigures} className="mt-3 min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink">
            Use these starting figures
          </button>
        ) : null}
      </section>

      <section className="mt-6 rounded-[20px] border border-line bg-sheet px-4 py-4">
        <button type="button" onClick={() => setTypedOn((on) => !on)} className="min-h-11 text-sm font-semibold text-ink" aria-expanded={typedOn}>
          {typedOn ? "Hide the Level reading" : "Type a Level reading"}
        </button>
        {typedOn ? (
          <div className="mt-3">
            <p className="text-sm text-muted">From the Measure app, Level, phone flat. Do not tap that screen to zero it. Degrees here are only the input. The answer above stays in inches.</p>
            <label className="mt-3 block text-sm font-semibold text-ink" htmlFor="level-side-deg">
              Across, degrees
              <input id="level-side-deg" inputMode="decimal" value={sideDeg} onChange={(e) => setSideDeg(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))} className={field} />
            </label>
            <div className="mt-2 flex flex-col gap-2">
              <Pick on={side === "curbside"} onClick={() => setSide("curbside")}>Curbside low</Pick>
              <Pick on={side === "roadside"} onClick={() => setSide("roadside")}>Roadside low</Pick>
              <Pick on={side === "level"} onClick={() => setSide("level")}>Level</Pick>
            </div>
            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="level-end-deg">
              Lengthwise, degrees
              <input id="level-end-deg" inputMode="decimal" value={endDeg} onChange={(e) => setEndDeg(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))} className={field} />
            </label>
            <div className="mt-2 flex flex-col gap-2">
              <Pick on={end === "tongue"} onClick={() => setEnd("tongue")}>Tongue low</Pick>
              <Pick on={end === "front"} onClick={() => setEnd("front")}>Front high</Pick>
              <Pick on={end === "level"} onClick={() => setEnd("level")}>Level</Pick>
            </div>
            <button type="button" onClick={useTyped} className="mt-4 min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink">
              Show the inches
            </button>
            {typedMsg ? <p className="mt-3 text-sm text-ink">{typedMsg}</p> : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function formatDeg(deg: number): string {
  const n = Math.round(Math.abs(deg) * 10) / 10;
  return `${n}°`;
}

function AxisCard({ axis, deg }: { axis: AxisRead; deg: string }) {
  const chip =
    axis.state === "level"
      ? { label: "Level", className: "bg-sage-soft text-ok" }
      : axis.state === "stop"
        ? { label: "Too far", className: "bg-warn-soft text-caution" }
        : axis.state === "ask"
          ? { label: "Need a span", className: "bg-warn-soft text-caution" }
          : { label: "Adjustment needed", className: "bg-warn-soft text-caution" };
  const inches = axis.figure !== "—";
  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-sans text-lg font-semibold text-ink">{axis.title}</h2>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] font-semibold ${chip.className}`}>{chip.label}</span>
      </div>
      <p className="mt-2 font-display text-4xl tabular-nums leading-none text-ink">
        {inches ? axis.figure : deg || "—"}
        {inches ? <span className="ml-2 font-sans text-lg font-semibold text-muted">in</span> : null}
      </p>
      {inches && deg ? <p className="mt-2 text-sm text-muted">{deg}</p> : null}
      <p className="mt-3 text-sm text-ink">{axis.action}</p>
    </div>
  );
}

function StatusRow({ on, label }: { on: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {on ? <Check className="size-4 shrink-0 text-ok" aria-hidden /> : <span className="size-4 shrink-0 rounded-full border border-line" aria-hidden />}
      <span>{label}</span>
    </li>
  );
}

function Pick({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={`min-h-11 rounded-full border px-2 text-sm font-semibold ${on ? "border-navy bg-navy text-on-navy" : "border-line bg-paper text-ink"}`}>
      {children}
    </button>
  );
}
