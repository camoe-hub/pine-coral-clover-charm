import type { Screen } from "@/lib/store";

const PLAIN = new Set([
  "fix",
  "care",
  "procedures",
  "parts",
  "more",
  "lists",
  "specs",
  "weights",
  "level",
  "tires",
  "supplies",
  "service",
  "recalls",
  "log",
  "records",
  "backup",
  "privacy",
  "history",
  "notes",
  "desk",
  "manuals",
  "tools",
  "about",
  "printout",
  "flows",
  "figures",
  "offline",
  "support",
]);

const WITH_ID = new Set(["procedure", "part", "checklist", "flow", "figure"]);

function enc(value: string) {
  return encodeURIComponent(value);
}

function dec(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}

function safeId(value: string) {
  const id = dec(value).slice(0, 80);
  return /^[a-z0-9][a-z0-9._-]*$/i.test(id) ? id : "";
}

/** A bookmarkable address for the open screen. Home stays the plain path. */
export function screenToHash(screen: Screen): string {
  if (screen.name === "home") return "";
  if (screen.name === "symptom") {
    const id = safeId(screen.id);
    if (!id) return "#/fix";
    return `#/symptom/${enc(id)}/${Number.isFinite(screen.step) ? screen.step : 0}`;
  }
  if (screen.name === "codes") {
    const q = new URLSearchParams();
    if (screen.q) q.set("q", screen.q.slice(0, 40));
    if (screen.appliance) q.set("appliance", screen.appliance.slice(0, 80));
    const extra = q.toString();
    return extra ? `#/codes?${extra}` : "#/codes";
  }
  if (screen.name === "supplies") {
    return screen.part === "propane" || screen.part === "battery" ? `#/supplies?part=${screen.part}` : "#/supplies";
  }
  if (screen.name === "sheet") return `#/sheet/${Number.isFinite(screen.page) ? screen.page : 1}`;
  if (screen.name === "table") {
    const id = screen.id ? safeId(screen.id) : "";
    return id ? `#/table/${enc(id)}/${screen.step ?? 0}` : "#/table";
  }
  if (WITH_ID.has(screen.name) && "id" in screen) {
    const id = safeId(screen.id);
    return id ? `#/${screen.name}/${enc(id)}` : `#/${screen.name}`;
  }
  if (PLAIN.has(screen.name)) return `#/${screen.name}`;
  return "";
}

/** The screen named in a shared or reloaded address. Null means Home. */
export function screenFromHash(hash: string): Screen | null {
  const raw = hash.trim().replace(/^#/, "");
  if (!raw || raw === "/") return null;
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const name = parts[0] ?? "";
  if (name === "symptom") {
    const id = safeId(parts[1] ?? "");
    const step = Number(parts[2] ?? 0);
    if (!id) return null;
    return { name: "symptom", id, step: Number.isFinite(step) ? step : 0 };
  }
  if (name === "codes") {
    const q = new URLSearchParams(query);
    const text = q.get("q")?.slice(0, 40) || undefined;
    const appliance = q.get("appliance")?.slice(0, 80) || undefined;
    return { name: "codes", q: text, appliance };
  }
  if (name === "supplies") {
    const part = new URLSearchParams(query).get("part");
    return part === "propane" || part === "battery" ? { name: "supplies", part } : { name: "supplies" };
  }
  if (name === "sheet") {
    const page = Number(parts[1] ?? 1);
    return { name: "sheet", page: Number.isFinite(page) ? page : 1 };
  }
  if (name === "table") {
    const id = parts[1] ? safeId(parts[1]) : "";
    const step = Number(parts[2] ?? 0);
    return { name: "table", id: id || undefined, step: Number.isFinite(step) ? step : 0 };
  }
  if (WITH_ID.has(name)) {
    const id = safeId(parts[1] ?? "");
    if (!id) return null;
    return { name, id } as Screen;
  }
  if (PLAIN.has(name)) return { name } as Screen;
  return null;
}

/** Published pages. These stay real addresses. Every other screen is a hash. */
const PUBLISHED_PAGE = new Set(["privacy", "support"]);

/** Where a plain address such as /recalls should send the browser. Null means leave it. */
export function hashLocation(pathname: string, search = ""): string | null {
  if (!pathname.startsWith("/") || pathname === "/" || pathname.includes(".")) return null;
  const screen = screenFromHash(`#${pathname}${search}`);
  if (!screen || PUBLISHED_PAGE.has(screen.name)) return null;
  const hash = screenToHash(screen);
  return hash ? `/${hash}` : null;
}

/** The address to keep when the app starts. A hash is never replaced by Home. */
export function bootAddress(pathname: string, search: string, hash: string, screen: Screen): { url: string; open: Screen | null } {
  const opened = screenFromHash(hash);
  if (opened) {
    const kept = hash.startsWith("#") ? hash : `#${hash}`;
    return { url: `${pathname}${search}${kept}`, open: opened };
  }
  const jump = hashLocation(pathname, search);
  if (jump) {
    const mark = jump.indexOf("#");
    return { url: jump, open: screenFromHash(mark >= 0 ? jump.slice(mark) : "") };
  }
  return { url: `${pathname}${search}${screenToHash(screen)}`, open: null };
}

/**
 * First paint follows the address. After that the open screen writes the
 * address. A later paint must not read a stale hash and reopen that screen.
 */
export function addressAction(
  pathname: string,
  search: string,
  hash: string,
  screen: Screen,
  booted: boolean,
): { url: string; open: Screen | null } {
  if (!booted) return bootAddress(pathname, search, hash, screen);
  return { url: `${pathname}${search}${screenToHash(screen)}`, open: null };
}
