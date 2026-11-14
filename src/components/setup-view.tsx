import { useState } from "react";
import { holdStorage } from "@/lib/hold-storage";
import { vinOk, vinProblem, vinYear } from "@/data/coach";
import { modelById } from "@/data/models";
import { useApp } from "@/lib/store";
import { Btn } from "@/components/ui";

export function SetupView() {
  const model = modelById(useApp((s) => s.modelId));
  const storedVin = useApp((s) => s.vin);
  const storedYear = useApp((s) => s.modelYear);
  const setVin = useApp((s) => s.setVin);
  const setYear = useApp((s) => s.setModelYear);
  const setPicker = useApp((s) => s.setPicker);
  const finish = useApp((s) => s.finishSetup);
  const [miles, setMiles] = useState("");
  const [vinDraft, setVinDraft] = useState(storedVin);
  const [yearDraft, setYearDraft] = useState(storedYear ? String(storedYear) : "");
  const [error, setError] = useState("");
  const problem = vinDraft ? vinProblem(vinDraft) : null;
  const decoded = vinOk(vinDraft) ? vinYear(vinDraft) : null;
  const typedYear = /^\d{4}$/.test(yearDraft) ? Number(yearDraft) : null;

  function done(confirmCoach: boolean) {
    holdStorage();
    if (!confirmCoach) {
      finish(null, false);
      return;
    }
    let milesValue: number | null = null;
    if (miles !== "") {
      const n = Number(miles);
      if (!/^\d{1,7}$/.test(miles) || !Number.isInteger(n) || n > 1_000_000) {
        setError("Use a mileage from 0 to 1,000,000. Digits only.");
        return;
      }
      milesValue = n;
    }
    if (yearDraft && (typedYear == null || typedYear < 1960 || typedYear > 2039)) {
      setError("Use a model year from 1960 to 2039, or leave it blank.");
      return;
    }
    if (vinDraft && problem) {
      setError(problem);
      return;
    }
    setError("");
    setYear(typedYear);
    setVin(vinDraft);
    finish(milesValue, true);
  }

  return (
    <div className="no-print fixed inset-0 z-40 flex items-end bg-inverse/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="setup-title"
        className="safe-bottom max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-sheet px-5 pb-6 pt-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">This phone</p>
        <h2 id="setup-title" className="mt-1 font-display text-3xl text-ink">
          Set up this trailer
        </h2>
        <p className="mt-2 text-sm text-muted">Pick the coach. A model year is enough. A VIN is optional, and you can change any of this later.</p>
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="mt-4 flex min-h-14 w-full items-center justify-between rounded-card border border-rule bg-paper px-4 text-left"
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Coach</span>
            <span className="block font-semibold text-ink">{model.name}</span>
          </span>
          <span className="text-sm font-semibold text-accent">Change</span>
        </button>
        <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="setup-year">
          Model year, optional
          <input
            id="setup-year"
            inputMode="numeric"
            value={yearDraft}
            onChange={(e) => {
              setError("");
              setYearDraft(e.target.value.replace(/\D/g, "").slice(0, 4));
            }}
            className="mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base tabular-nums text-ink"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="setup-miles">
          Lifetime miles, optional
          <input
            id="setup-miles"
            inputMode="numeric"
            value={miles}
            onChange={(e) => {
              setError("");
              setMiles(e.target.value.slice(0, 12));
            }}
            aria-invalid={error.startsWith("Use a mileage")}
            className="mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base tabular-nums text-ink"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="setup-vin">
          VIN, optional
          <input
            id="setup-vin"
            value={vinDraft}
            onChange={(e) => {
              setError("");
              setVinDraft(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17));
            }}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            maxLength={17}
            placeholder="17 characters"
            aria-invalid={problem !== null}
            className="mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 font-mono text-base uppercase tracking-wide text-ink"
          />
        </label>
        {decoded ? <p className="mt-2 text-sm font-semibold text-ink">This VIN is a {decoded} {model.name}.</p> : null}
        {typedYear && !decoded ? <p className="mt-2 text-sm text-ink">{typedYear} {model.name}. A VIN is not required.</p> : null}
        {typedYear && decoded && typedYear !== decoded ? <p className="mt-2 text-sm font-semibold text-stop">The year you typed is {typedYear}. The VIN says {decoded}. The typed year is the one this app will use.</p> : null}
        {problem ? <p className="mt-2 text-sm font-semibold text-stop">{problem}</p> : null}
        {error && error !== problem ? <p className="mt-2 text-sm font-semibold text-stop">{error}</p> : null}
        <Btn className="mt-4 w-full" onClick={() => done(true)}>
          Continue
        </Btn>
        <button type="button" onClick={() => done(false)} className="mt-1 min-h-11 w-full text-sm font-semibold text-muted">
          Not now
        </button>
      </div>
    </div>
  );
}