/** HTTPS URL for a plain-http request, or null when the request should stay. */
export function httpsLocation(proto: string | null, host: string | null, path: string, search: string): string | null {
  if (proto?.trim().toLowerCase() !== "http") return null;
  const raw = String(host ?? "").split(",")[0]?.trim() ?? "";
  if (!raw || raw.length > 253 || /[\s/\\@]/.test(raw)) return null;
  const hostname = (raw.startsWith("[") ? raw.slice(1, raw.indexOf("]")) : raw.replace(/:\d+$/, "")).toLowerCase();
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") return null;
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const query = search ? (search.startsWith("?") ? search : `?${search}`) : "";
  return `https://${raw}${pathname}${query}`;
}
