/* SHELL includes the package.json version. The build replaces 2026.11.69. */
const SHELL = "rivetcare-shell-2026.11.69";
const FIGURES = "rivetcare-figures-v5";
/** Home script is about 440 KB. A screen chunk can be larger. Parts books and zip tables stay out of the cache. */
const SHELL_MAX = 2 * 1024 * 1024;
/** A diagram past this size is shown, then not kept for offline. */
const FIGURE_MAX = 1024 * 1024;
/** The figure folder is under 100 files. Keep the ones opened most recently. */
const FIGURE_ENTRIES = 120;
const PROMPT_URL = "/__rivetcare_update";
const FONTS = [
  "/fonts/barlow-400-italic-latin-ext.woff2",
  "/fonts/barlow-400-italic-latin.woff2",
  "/fonts/barlow-400-latin-ext.woff2",
  "/fonts/barlow-400-latin.woff2",
  "/fonts/barlow-500-latin-ext.woff2",
  "/fonts/barlow-500-latin.woff2",
  "/fonts/barlow-600-latin-ext.woff2",
  "/fonts/barlow-600-latin.woff2",
  "/fonts/barlow-700-latin-ext.woff2",
  "/fonts/barlow-700-latin.woff2",
  "/fonts/source-serif-4-600-700-latin-ext.woff2",
  "/fonts/source-serif-4-600-700-latin.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(precacheShell().catch(() => undefined));
});

const NETWORK_WAIT = 4000;
/** A saved copy is used if the network has not answered. A dead network fails without this wait. */
const CACHED_WAIT = 1000;

let updateAccepted = false;

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") {
    updateAccepted = true;
    self.skipWaiting();
    return;
  }
  const data = event.data;
  if (data && data.type === "save-offline") {
    const port = event.ports && event.ports[0];
    event.waitUntil((async () => {
      try {
        await precacheShell();
        await cacheShell(Array.isArray(data.urls) ? data.urls : []);
      } catch {
        /* the reply still says what actually landed */
      }
      const cache = await caches.open(SHELL);
      const paths = (await cache.keys()).map((key) => new URL(key.url).pathname);
      const wanted = (Array.isArray(data.urls) ? data.urls : []).filter((url) => typeof url === "string" && url.startsWith("/assets/") && url.endsWith(".js"));
      const msg = {
        type: "save-offline-done",
        id: data.id,
        shellOk: paths.includes("/"),
        fontsHave: FONTS.filter((path) => paths.includes(path)).length,
        fontsWanted: FONTS.length,
        screensHave: wanted.filter((path) => paths.includes(path)).length,
        screensWanted: wanted.length,
      };
      if (event.source) event.source.postMessage(msg);
      else if (port) port.postMessage(msg);
    })());
    return;
  }
  if (!data || data.type !== "cache-shell" || !Array.isArray(data.urls)) return;
  event.waitUntil(cacheShell(data.urls));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const hadOlder = keys.some((key) => key !== SHELL && key !== FIGURES);
    await Promise.all(keys.filter((key) => key !== SHELL && key !== FIGURES).map((key) => caches.delete(key)));
    if (hadOlder && !updateAccepted) {
      const cache = await caches.open(SHELL);
      await cache.put(PROMPT_URL, new Response("1", { headers: { "content-type": "text/plain" } }));
    }
    await self.clients.claim();
  })());
});

function kindOf(url, request) {
  if (url.pathname.startsWith("/api/") || url.pathname.endsWith(".json") || url.pathname.endsWith(".zip")) return "";
  if (url.pathname === "/splash/brand.jpg") return "shell";
  if (url.pathname.startsWith("/figures/")) return /\.(?:png|jpe?g|webp)$/.test(url.pathname) ? "figure" : "";
  if (url.pathname.startsWith("/fonts/") && url.pathname.endsWith(".woff2")) return "shell";
  if (url.pathname === "/" || request.mode === "navigate") return "shell";
  if (url.pathname.startsWith("/assets/") && /\.(?:js|css|woff2?)$/.test(url.pathname)) return "shell";
  if (/\.(?:png|svg|ico|webmanifest)$/.test(url.pathname)) return "shell";
  return "";
}

async function precacheShell() {
  try {
    const cache = await caches.open(SHELL);
    const home = await fetch("/");
    if (!home.ok) return;
    const html = await home.text();
    await cache.put("/", new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }));
    const paths = new Set(["/theme-boot.js", "/splash/brand.jpg"]);
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const path = match[1].split("?")[0];
      if (path.startsWith("/assets/") && /\.(?:js|css)$/.test(path)) paths.add(path);
    }
    await Promise.all([...paths].map((path) => store(cache, path, SHELL_MAX).catch(() => undefined)));
    await Promise.all(FONTS.map((path) => store(cache, path, SHELL_MAX).catch(() => undefined)));
  } catch {
    /* a failed home fetch must not reject install */
  }
}

async function cacheShell(urls) {
  const paths = urls.filter((url) => typeof url === "string" && url.startsWith("/") && !url.startsWith("//"));
  await Promise.all(
    paths.map(async (path) => {
      const url = new URL(path, self.location.origin);
      const kind = kindOf(url, { mode: "same-origin" });
      if (!kind) return;
      const bucket = kind === "figure" ? FIGURES : SHELL;
      const cache = await caches.open(bucket);
      if (await cache.match(url.href)) return;
      try {
        await store(cache, path, kind === "figure" ? FIGURE_MAX : SHELL_MAX);
      } catch {
        /* a screen that is not on this phone yet stays uncached */
      }
    }),
  );
}

async function fetchLimited(req, fresh, wait) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), wait);
  try {
    if (!fresh) return await fetch(req.clone(), { signal: controller.signal });
    return await fetch(req.url, {
      cache: "no-store",
      credentials: "same-origin",
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function remember(cacheName, req, res, max, kind) {
  const listed = Number(res.headers.get("content-length") || 0);
  if (listed !== 0 && listed > max) return;
  const bytes = await res.clone().arrayBuffer();
  if (bytes.byteLength > max) return;
  const cache = await caches.open(cacheName);
  if (kind === "figure") await cache.delete(req);
  await cache.put(req, new Response(bytes, { status: res.status, statusText: res.statusText, headers: res.headers }));
  if (kind === "figure") await trimFigures(cache);
}

async function keepFigure(req, cached) {
  try {
    const cache = await caches.open(FIGURES);
    await cache.delete(req);
    await cache.put(req, cached.clone());
  } catch {
    /* a cache that will not update still serves the copy */
  }
}

async function store(cache, request, max) {
  const res = await fetch(request);
  if (!res.ok) return;
  const bytes = await res.arrayBuffer();
  if (bytes.byteLength > max) return;
  await cache.put(request, new Response(bytes, { status: res.status, statusText: res.statusText, headers: res.headers }));
}

async function trimFigures(cache) {
  const keys = await cache.keys();
  const extra = keys.length - FIGURE_ENTRIES;
  if (extra <= 0) return;
  await Promise.all(keys.slice(0, extra).map((key) => cache.delete(key)));
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL("/", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const open = list.find((client) => client.url.startsWith(self.location.origin));
      if (open) return open.focus();
      return self.clients.openWindow(target);
    }),
  );
});

function updatePage() {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>RivetCare</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#152A6A;color:#fff;font-family:system-ui,sans-serif;padding:24px}div{max-width:22rem}h1{font-size:1.6rem;line-height:1.2;margin:0}p{margin:0.6rem 0 0;font-size:1rem;line-height:1.4}button{margin-top:1.2rem;min-height:44px;border:0;border-radius:999px;padding:0 1.2rem;background:#fff;color:#152A6A;font:inherit;font-weight:700}</style><div><h1>A newer copy is ready.</h1><p>RivetCare 2026.11.69. Your records stay on this phone.</p><form method="get" action="/"><input type="hidden" name="updated" value="1"><button type="submit">Update</button></form></div></html>`;
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

async function promptOr(url) {
  try {
    const cache = await caches.open(SHELL);
    if (url.searchParams.get("updated") === "1") {
      await cache.delete(PROMPT_URL);
      const next = new URL(url.href);
      next.searchParams.delete("updated");
      next.searchParams.delete("needupdate");
      return Response.redirect(next.href, 302);
    }
    if (await cache.match(PROMPT_URL)) return updatePage();
    return null;
  } catch {
    return null;
  }
}
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin && url.pathname === "/version.txt") return;
  if (url.origin === self.location.origin && url.pathname.endsWith(".zip")) return;
  if (url.origin === self.location.origin && req.mode === "navigate") {
    event.respondWith((async () => {
      let prompted = null;
      try {
        prompted = await promptOr(url);
      } catch {
        prompted = null;
      }
      if (prompted) return prompted;
      const kind = kindOf(url, req);
      if (!kind) return fetch(req);
      const bucket = kind === "figure" ? FIGURES : SHELL;
      const max = kind === "figure" ? FIGURE_MAX : SHELL_MAX;
      try {
        return await shellResponse(req, kind, bucket, max);
      } catch {
        return fetch(req);
      }
    })());
    return;
  }
  const kind = url.origin === self.location.origin ? kindOf(url, req) : "";
  if (!kind) return;
  const bucket = kind === "figure" ? FIGURES : SHELL;
  const max = kind === "figure" ? FIGURE_MAX : SHELL_MAX;
  event.respondWith(shellResponse(req, kind, bucket, max));
});

async function keepFresh(bucket, req, res, max, kind) {
  try {
    await remember(bucket, req, res, max, kind);
  } catch {
    /* a full cache still returns the page that just loaded */
  }
}

async function shellResponse(req, kind, bucket, max) {
  const cached = await caches.match(req);
  const wait = cached ? CACHED_WAIT : NETWORK_WAIT;
  try {
    const res = await fetchLimited(req, kind === "shell", wait);
    if (res.ok) await keepFresh(bucket, req, res, max, kind);
    return res;
  } catch {
    if (cached) {
      if (kind === "figure") await keepFigure(req, cached);
      return cached;
    }
    try {
      const res = await fetchLimited(req, kind === "shell", NETWORK_WAIT);
      if (res.ok) await keepFresh(bucket, req, res, max, kind);
      return res;
    } catch {
      if (req.mode === "navigate") {
        const home = await caches.match("/");
        if (home) return home;
      }
      return new Response("Offline", { status: 503, headers: { "content-type": "text/plain" } });
    }
  }
}
