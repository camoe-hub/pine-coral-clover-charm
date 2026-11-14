/**
 * Screens live at /#/recalls, not /recalls. A request for the plain path
 * is sent there. Privacy and support stay real pages.
 */
import { hashLocation } from "../../src/lib/screen-url.ts";

interface RedirectEvent {
  url: URL;
}

export default function screenRedirect(event: RedirectEvent, next: () => unknown): unknown {
  const location = hashLocation(event.url.pathname, event.url.search);
  if (!location) return next();
  return new Response(null, {
    status: 302,
    headers: { location, "cache-control": "no-store" },
  });
}
