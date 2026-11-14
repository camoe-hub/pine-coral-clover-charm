import type { ErrorComponentProps } from "@tanstack/react-router";
import { isMissingScreen } from "@/lib/missing-screen";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

function goHome() {
  try {
    sessionStorage.removeItem("rivetcare-preload-reload");
  } catch {
    /* a private window can still leave this page */
  }
  const url = new URL(window.location.href);
  url.hash = "";
  window.location.assign(`${url.pathname}${url.search}`);
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const missing = isMissingScreen(error);
  const message = errorMessage(error);
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-3 bg-paper px-6 text-ink">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">RivetCare</p>
      <h1 className="font-display text-3xl">{missing ? "This screen isn't on the phone yet" : "Something went wrong"}</h1>
      <p className="text-base text-ink">
        {missing
          ? "It needs a signal the first time. Home is already on this phone. Save for offline from the Offline screen when you are back online."
          : "Home is still on this phone. Reload if you have a signal."}
      </p>
      <p className="max-w-md text-sm break-words text-muted">{message}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={goHome} className="min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy">
          Back to Home
        </button>
        {missing ? null : (
          <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink">
            Reload
          </button>
        )}
      </div>
    </main>
  );
}
