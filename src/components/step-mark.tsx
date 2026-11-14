import { classifyStep } from "@/lib/safety-class";
import { Notice } from "@/components/ui";

/** Owner-reported steps, and a hazard line only when the step is one of those jobs. */
export function StepMark({ text, namedSource }: { text: string; namedSource?: string | null }) {
  const mark = classifyStep(text, namedSource);
  const owner = mark.kind === "owner";
  if (!owner && !mark.hazard) return null;
  return (
    <div className="mt-2">
      {owner ? <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{mark.label}</p> : null}
      {mark.hazard ? (
        <div className={owner ? "mt-2" : undefined}>
          <Notice tone={mark.tone} title={mark.tone === "stop" ? "Stop" : "Caution"}>{mark.hazard}</Notice>
        </div>
      ) : null}
    </div>
  );
}
