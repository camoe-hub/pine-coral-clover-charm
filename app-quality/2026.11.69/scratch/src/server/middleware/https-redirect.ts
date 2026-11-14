/**
 * Production only. If a request actually reaches the app with
 * `x-forwarded-proto: http`, send it to https. Localhost stays http so the
 * editor and the Vite dev server are left alone. A host that errors before
 * the request gets here cannot be redirected by this file.
 */
import { httpsLocation } from "../../src/lib/https-redirect.ts";

interface RedirectEvent {
  url: URL;
  req: { headers: Headers };
}

export default function httpsRedirect(event: RedirectEvent, next: () => unknown): unknown {
  if (process.env.NODE_ENV !== "production") return next();
  const location = httpsLocation(
    event.req.headers.get("x-forwarded-proto"),
    event.req.headers.get("x-forwarded-host") ?? event.req.headers.get("host"),
    event.url.pathname,
    event.url.search,
  );
  if (!location) return next();
  return new Response(null, {
    status: 308,
    headers: { location, "cache-control": "no-store" },
  });
}
