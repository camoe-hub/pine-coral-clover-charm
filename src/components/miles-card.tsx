import { useEffect, useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useApp } from "@/lib/store";
import { useBackLayer } from "@/lib/back-layer";
import { Btn, Card, Kicker } from "@/components/ui";

function digitsOf(value: string) {
  return value.replace(/[^\d]/g, "").slice(0, 7);
}

function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const covered = window.innerHeight - vv.height - vv.offsetTop;
      setInset(covered > 80 ? covered : 0);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return inset;
}

export function MilesCard({ onNavy = false, quiet = false, bare = false }: { onNavy?: boolean; quiet?: boolean; bare?: boolean }) {
  const odo = useApp((s) => s.odometer);
  const setOdo = useApp((s) => s.setOdo);
  const addTripMiles = useApp((s) => s.addTripMiles);
  const flash = useApp((s) => s.flash);
  const [mode, setMode] = useState<"trip" | "total" | null>(null);
  const [digits, setDigits] = useState("");
  const [note, setNote] = useState("");
  const inset = useKeyboardInset();
  useBackLayer(mode !== null, () => setMode(null));
  const tripId = useId();
  const noteId = useId();
  const totalId = useId();

  function open(next: "trip" | "total") {
    setMode((current) => (current === next ? null : next));
    setDigits(next === "total" && odo > 0 ? String(odo) : "");
    setNote("");
  }

  function addTrip(e: FormEvent) {
    e.preventDefault();
    const n = Number(digits);
    if (!digits || !Number.isFinite(n) || n <= 0) {
      flash("Enter the miles for this trip");
      return;
    }
    addTripMiles(n, note);
    if (n <= 5000) {
      setMode(null);
      setDigits("");
      setNote("");
    }
  }

  function saveTotal(e: FormEvent) {
    e.preventDefault();
    if (!digits) {
      flash("Enter the lifetime miles");
      return;
    }
    if (!setOdo(Number(digits))) return;
    flash("Reading saved");
    setMode(null);
    setDigits("");
  }

  const label = onNavy ? "text-on-navy/80" : "text-muted";
  const figure = onNavy ? "text-on-navy" : "text-ink";
  const fillBtn = onNavy ? "bg-sheet text-accent" : "";

  const body = quiet ? (
    <>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => open("total")} className="min-h-11 min-w-0 flex-1 text-left">
          <span className={`block text-[13px] font-semibold uppercase tracking-wider ${label}`}>Trailer miles</span>
          <span className={`block text-lg font-semibold tabular-nums leading-tight ${figure}`}>
            {odo > 0 ? `${odo.toLocaleString()} mi` : "Add miles"}
          </span>
        </button>
        <button type="button" className={`min-h-11 shrink-0 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`} aria-expanded={mode === "trip"} onClick={() => open("trip")}>
          Add trip miles
        </button>
        <button type="button" className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center px-3 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`} aria-label="Set trailer miles" aria-expanded={mode === "total"} onClick={() => open("total")}>
          Set miles
        </button>
      </div>
      {mode === "trip" && (
        <form className="mt-2 space-y-2" onSubmit={addTrip}>
          <label className={`block text-xs font-semibold uppercase tracking-wider ${label}`} htmlFor={tripId}>
            Miles this trip
          </label>
          <input
            id={tripId}
            inputMode="numeric"
            autoFocus
            value={digits}
            onChange={(e) => setDigits(digitsOf(e.target.value))}
            placeholder="180"
            className="min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink tabular-nums"
          />
          <label className={`block text-xs font-semibold uppercase tracking-wider ${label}`} htmlFor={noteId}>
            Note, optional
          </label>
          <input
            id={noteId}
            value={note}
            maxLength={80}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Denver to Moab"
            className="min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
          />
          {odo <= 0 && <p className={`text-sm ${label}`}>This starts the total. Use Set miles if the trailer already has miles.</p>}
          <Btn type="submit" className={`w-full ${fillBtn}`}>
            Add to the total
          </Btn>
          <button type="button" onClick={() => setMode(null)} className={`min-h-12 w-full text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`}>
            Back
          </button>
        </form>
      )}
      {mode === "total" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse/40" role="presentation" onClick={() => setMode(null)}>
            <form
              className="w-full max-w-lg rounded-t-3xl bg-sheet px-4 pt-4"
              style={{ marginBottom: inset, paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
              onSubmit={saveTotal}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-ink">Trailer miles</h2>
              <label className="mt-3 block text-sm font-semibold text-ink" htmlFor={totalId}>
                Lifetime miles
              </label>
              <input
                id={totalId}
                inputMode="numeric"
                autoFocus
                value={digits}
                onChange={(e) => setDigits(digitsOf(e.target.value))}
                placeholder={odo > 0 ? String(odo) : "12400"}
                className="mt-2 min-h-12 w-full rounded-full border border-line bg-paper px-4 text-base text-ink tabular-nums"
              />
              <p className="mt-2 text-sm text-muted">Replaces the total. It does not add a trip.</p>
              <Btn type="submit" className="mt-3 w-full">
                Save the reading
              </Btn>
              <Btn variant="text" className="mt-1 min-h-12 w-full justify-center" type="button" onClick={() => setMode(null)}>
                Back
              </Btn>
            </form>
          </div>,
          document.body,
        )}
    </>
  ) : (
    <>
      {onNavy ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-on-navy/70">Trailer miles</p>
      ) : (
        <Kicker>Trailer miles</Kicker>
      )}
      <button
        type="button"
        onClick={() => open("total")}
        className={`mt-1 block text-left font-sans text-4xl font-semibold tabular-nums ${figure}`}
      >
        {odo > 0 ? odo.toLocaleString() : "Add miles"}
      </button>
      <div className="mt-1 flex gap-4">
        <button type="button" className={`min-h-11 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`} aria-expanded={mode === "trip"} onClick={() => open("trip")}>
          Add a trip
        </button>
        <button type="button" className={`min-h-11 text-sm font-semibold ${onNavy ? "text-on-navy" : "text-accent"}`} aria-expanded={mode === "total"} onClick={() => open("total")}>
          Set total
        </button>
      </div>
    </>
  );

  if (onNavy || bare) return <div>{body}</div>;
  return <Card className={quiet ? "px-4 py-3" : "p-4"}>{body}</Card>;
}