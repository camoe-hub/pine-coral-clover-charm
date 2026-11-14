/* The boundary is a class, which this rule does not treat as a component. */
/* eslint-disable react-refresh/only-export-components */
import { Component, type ReactNode } from "react";
import { isMissingScreen, MISSING_SCREEN } from "@/lib/missing-screen";
import { useApp } from "@/lib/store";

/** Catches a screen chunk that never arrived. The tabs outside this boundary still work. */
export class ScreenBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  state: { error: unknown } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error) return <MissingScreen error={this.state.error} />;
    return this.props.children;
  }
}

function MissingScreen({ error }: { error: unknown }) {
  const tab = useApp((s) => s.tab);
  const push = useApp((s) => s.push);
  const missing = isMissingScreen(error);
  const detail = error instanceof Error && error.message ? error.message : "";
  return (
    <div className="grid gap-3 py-6">
      <h2 className="font-display text-3xl text-ink">{missing ? "This screen isn't on the phone yet" : "Something went wrong"}</h2>
      <p className="text-base text-ink">
        {missing
          ? "Open it once while you have a signal, or save the book from Offline. Home, and the tabs along the bottom, are already on this phone."
          : "Home is still on this phone. Reload if you have a signal."}
      </p>
      {detail && detail !== MISSING_SCREEN && !missing ? <p className="text-sm break-words text-muted">{detail}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => tab("home")} className="min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy">
          Back to Home
        </button>
        <button type="button" onClick={() => push({ name: "offline" })} className="min-h-11 rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink">
          Open Offline
        </button>
      </div>
    </div>
  );
}
