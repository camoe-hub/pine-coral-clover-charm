import { useState, type FormEvent } from "react";
import { codeMatches, rememberPass } from "@/lib/pass-code";

export function PassGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!codeMatches(value)) {
      setWrong(true);
      return;
    }
    rememberPass();
    onUnlock();
  }

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end bg-inverse/50 sm:items-center sm:justify-center">
      <form
        onSubmit={submit}
        className="safe-bottom w-full rounded-t-3xl bg-sheet px-5 pt-5 sm:max-w-lg sm:rounded-3xl sm:pb-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">RivetCare</p>
        <h1 className="mt-1 font-display text-3xl text-ink">Enter your code</h1>
        <p className="mt-2 text-base text-ink">The code is on your Gumroad receipt. This phone asks once.</p>
        <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="pass-code">
          Code
        </label>
        <input
          id="pass-code"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setWrong(false);
          }}
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          className="mt-1 min-h-12 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink"
        />
        {wrong ? <p className="mt-2 text-sm font-semibold text-caution">That code was not recognized.</p> : null}
        <button type="submit" className="mt-4 mb-2 min-h-12 w-full rounded-full bg-navy text-sm font-semibold text-on-navy">
          Continue
        </button>
      </form>
    </div>
  );
}
