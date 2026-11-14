import { BOOK_VERSION } from "@/lib/book-version";
import { bookWorkerScript, workerIsCurrent } from "@/lib/worker-script";

const SET_KEY = "rivetcare-offline-set";

/** Loaded only when the owner taps Save for offline. Not on first paint. */
const SCREEN_LOADS = [
  () => import("@/components/fix-view"),
  () => import("@/components/care-view"),
  () => import("@/components/parts-view"),
  () => import("@/components/more-view"),
  () => import("@/components/flow-view"),
  () => import("@/components/figure-view"),
  () => import("@/components/records-view"),
  () => import("@/components/notes-view"),
  () => import("@/components/shop-sheet"),
  () => import("@/components/print-view"),
  () => import("@/components/table-view"),
  () => import("@/components/manuals-view"),
  () => import("@/components/weights-view"),
  () => import("@/components/level-view"),
  () => import("@/components/service-view"),
  () => import("@/components/tires-view"),
  () => import("@/components/supplies-view"),
  () => import("@/components/privacy-view"),
  () => import("@/components/support-view"),
  () => import("@/components/legal-copy"),
  () => import("@/components/backup-view"),
  () => import("@/data/search"),
  () => import("@/lib/weights"),
];

export type SaveReport = {
  shellOk: boolean;
  fontsHave: number;
  fontsWanted: number;
  screensHave: number;
  screensWanted: number;
};

export function savedOfflineVersion(): string | null {
  try {
    return localStorage.getItem(SET_KEY);
  } catch {
    return null;
  }
}

function rememberOfflineSet() {
  try {
    localStorage.setItem(SET_KEY, BOOK_VERSION);
  } catch {
    /* a private window can still finish this save */
  }
}

function assetPaths(): string[] {
  const paths = new Set<string>();
  const add = (raw: string | null | undefined) => {
    if (!raw) return;
    try {
      const path = new URL(raw, window.location.origin).pathname;
      if (path.startsWith("/assets/") && /\.(?:js|css)$/.test(path)) paths.add(path);
    } catch {
      /* a resource with no URL is not a screen file */
    }
  };
  for (const entry of performance.getEntriesByType("resource")) add(entry.name);
  for (const el of document.querySelectorAll("script[src], link[rel='stylesheet']")) {
    add(el.getAttribute("src") ?? el.getAttribute("href"));
  }
  return [...paths];
}

export function saveIsComplete(report: SaveReport): boolean {
  return report.shellOk && report.fontsWanted > 0 && report.fontsHave >= report.fontsWanted && report.screensWanted > 0 && report.screensHave >= report.screensWanted;
}

function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    work.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function controllingWorker(): Promise<ServiceWorker> {
  if (!("serviceWorker" in navigator)) throw new Error("no-worker");
  const reg = await registerBookWorker();
  try {
    await withTimeout(reg.update(), 4000);
  } catch {
    /* an older worker can still take this save */
  }
  if (!navigator.serviceWorker.controller) {
    await withTimeout(
      new Promise<void>((resolve) => {
        const done = () => {
          navigator.serviceWorker.removeEventListener("controllerchange", done);
          resolve();
        };
        navigator.serviceWorker.addEventListener("controllerchange", done);
      }),
      4000,
    ).catch(() => undefined);
  }
  const ready = await withTimeout(navigator.serviceWorker.ready, 8000);
  const worker = navigator.serviceWorker.controller ?? ready.active ?? reg.active;
  if (!worker) throw new Error("no-controller");
  return worker;
}

export async function registerBookWorker() {
  if (!("serviceWorker" in navigator)) throw new Error("no-worker");
  const want = bookWorkerScript(BOOK_VERSION);
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs.map((reg) => {
      const script = reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL || "";
      if (!script || workerIsCurrent(script, BOOK_VERSION)) return undefined;
      let path = "";
      try {
        path = new URL(script).pathname;
      } catch {
        return undefined;
      }
      if (path !== "/sw.js") return undefined;
      return reg.unregister();
    }),
  );
  const once = (options?: RegistrationOptions) => navigator.serviceWorker.register(want, options);
  return once({ updateViaCache: "none" }).catch(() => once());
}

export async function saveForOffline(): Promise<SaveReport> {
  const worker = await controllingWorker();
  let failed = 0;
  await Promise.all(
    SCREEN_LOADS.map(async (load) => {
      try {
        await load();
      } catch {
        failed += 1;
      }
    }),
  );
  const urls = [...new Set([...assetPaths(), "/privacy", "/support"])];
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const report = await new Promise<SaveReport>((resolve, reject) => {
    const channel = new MessageChannel();
    const finish = (data: SaveReport & { type?: string; id?: string }) => {
      if (!data || data.type !== "save-offline-done" || (data.id && data.id !== id)) return;
      window.clearTimeout(timer);
      navigator.serviceWorker.removeEventListener("message", onMessage);
      resolve(data);
    };
    const timer = window.setTimeout(() => {
      navigator.serviceWorker.removeEventListener("message", onMessage);
      reject(new Error("timeout"));
    }, 20000);
    const onMessage = (event: MessageEvent<SaveReport & { type?: string; id?: string }>) => finish(event.data);
    channel.port1.onmessage = (event) => finish(event.data);
    navigator.serviceWorker.addEventListener("message", onMessage);
    try {
      worker.postMessage({ type: "save-offline", id, urls }, [channel.port2]);
    } catch {
      worker.postMessage({ type: "save-offline", id, urls });
    }
  });
  if (failed > 0) {
    report.screensHave = 0;
    report.screensWanted = Math.max(report.screensWanted, failed);
  }
  if (saveIsComplete(report)) rememberOfflineSet();
  return report;
}
