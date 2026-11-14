import { useState } from "react";
import { Btn, Card, Kicker } from "@/components/ui";
import { modelById } from "@/data/models";
import { useApp } from "@/lib/store";

const ORDER = [1, 2, 3, 4, 5, 6];

export function LugWidget() {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const model = modelById(useApp((s) => s.modelId));
  const stages = ["20–25 ft-lb", "50–60 ft-lb", model.family === "Other" ? "Manual spec" : "110 aluminum / 100 spare"];
  const next = ORDER.find((n) => !done.includes(n));

  function tap(n: number) {
    if (n !== next) return;
    const now = [...done, n];
    if (now.length === 6) {
      if (stage < 2) {
        setStage(stage + 1);
        setDone([]);
      } else {
        setDone(now);
      }
    } else {
      setDone(now);
    }
  }

  const finished = stage === 2 && done.length === 6;

  return (
    <Card className="p-4">
      <Kicker>Star pattern</Kicker>
      <p className="mt-1 font-display text-xl text-ink">
        {finished ? "Final torque set" : `Stage ${stage + 1} · ${stages[stage]}`}
      </p>
      <p className="mt-1 text-sm text-muted">Tap the highlighted nut. Opposite nuts, then the next stage. Never an impact wrench for the last pass.</p>
      <div className="lug-ring mt-4" aria-hidden={false}>
        <div className="hub" />
        {ORDER.map((n) => (
          <button
            key={n}
            className={`lug lug-${n} ${done.includes(n) ? "on" : ""} ${n === next && !finished ? "next" : ""}`}
            onClick={() => tap(n)}
            aria-label={`Lug ${n}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Btn
          variant="line"
          className="flex-1"
          onClick={() => {
            setStage(0);
            setDone([]);
          }}
        >
          Reset
        </Btn>
      </div>
    </Card>
  );
}

const PRESETS: Record<string, { label: string; valves: Array<"open" | "closed" | "ask">; note: string }> = {
  normal: {
    label: "Normal",
    valves: ["open", "open", "open", "closed"],
    note: "Everyday use. Heat and hot water flow through the Alde.",
  },
  bypass: {
    label: "Bypass",
    valves: ["closed", "closed", "closed", "open"],
    note: "Before air or antifreeze. The Alde is isolated.",
  },
  drain: {
    label: "Drain",
    valves: ["open", "open", "open", "open"],
    note: "All valves open to empty the lines.",
  },
  blow: {
    label: "Blow out",
    valves: ["closed", "closed", "ask", "ask"],
    note: "The manual says close 1 and 2. Confirm 3 and 4 on the tag in your coach before you add air.",
  },
};

export function ValveWidget() {
  const [key, setKey] = useState<keyof typeof PRESETS>("normal");
  const preset = PRESETS[key];
  return (
    <Card className="p-4">
      <Kicker>Classic manifold</Kicker>
      <p className="mt-1 text-sm text-muted">2027 Classic 28RB, 30RB, and 33FB. Match the numbers on your valve tag.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((k) => (
          <button
            key={k}
            onClick={() => setKey(k)}
            className={`min-h-11 rounded-full text-sm font-semibold ${key === k ? "bg-navy text-on-navy" : "border border-line bg-paper text-ink"}`}
          >
            {PRESETS[k].label}
          </button>
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-2">
        {preset.valves.map((v, i) => (
          <li key={i} className="rounded-2xl border border-line bg-paper px-1 py-3 text-center">
            <p className="font-display text-lg text-ink">{i + 1}</p>
            <p className={`text-sm font-semibold ${v === "open" ? "text-ok" : v === "closed" ? "text-blue" : "text-caution"}`}>
              {v === "ask" ? "See tag" : v === "open" ? "Open" : "Closed"}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink">{preset.note}</p>
    </Card>
  );
}

export function DotWidget() {
  return (
    <Card className="p-4">
      <Kicker>DOT date code</Kicker>
      <p className="mt-1 text-sm text-muted">The last four digits are the build week and year. Replace the tire at 5 years, even with tread left.</p>
      <div className="mt-4 rounded-2xl bg-inverse px-4 py-5 text-on-navy">
        <p className="font-display text-2xl tracking-wide">DOT ··· ···· ··· 26 23</p>
        <p className="mt-2 text-sm text-on-navy/80">Example 2623 = week 26 of 2023. That tire is due in 2028.</p>
      </div>
    </Card>
  );
}
