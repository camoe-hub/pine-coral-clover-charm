import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookOpen, Calendar, ChevronLeft, ClipboardList, House, Plus, Search, Wrench, X } from "lucide-react";
import { modelById, modelGroups } from "@/data/models";
import { coachYear, vinMismatch, vinOk, vinProblem, vinYear } from "@/data/coach";
import type { Hit } from "@/data/search";
import { screenTitle, tabFor, useApp, type Screen } from "@/lib/store";
import { addressAction, screenFromHash, screenToHash } from "@/lib/screen-url";
import { HomeView } from "@/components/home-view";
import { MoreView } from "@/components/library-view";
import { AffiliationNote, DisclaimerCopy } from "@/components/disclaimer";
import { SetupView } from "@/components/setup-view";
import { DarkModeSwitch, PageTitle } from "@/components/ui";
import { OfflineView } from "@/components/offline-view";
import { applyTheme, themeChoice } from "@/lib/theme";
import { holdStorage, readStorageHold } from "@/lib/hold-storage";
import { BOOK_VERSION } from "@/lib/book-version";
import { registerBookWorker } from "@/lib/offline-save";
import { previewPathPrefix } from "@/lib/preview-path-prefix";
import { addBackLayer, backLayerCount, closeBackLayer, onBackLayers, removeBackLayer } from "@/lib/back-layer";
import { confirmRestore, RESTORE_NOTE, restoreApplying, subscribeRestoreHold, undoRestore } from "@/lib/restore-undo";
import { MISSING_SCREEN } from "@/lib/missing-screen";
import { ScreenBoundary } from "@/components/missing-screen";

function loadNamed<M extends object, K extends keyof M>(load: () => Promise<M | undefined>, key: K) {
  return load().then((mod) => {
    const Comp = mod?.[key];
    if (typeof Comp !== "function") throw new Error(MISSING_SCREEN);
    return { default: Comp };
  });
}

const FixView = lazy(() => loadNamed(() => import("@/components/fix-view"), "FixView"));
const SymptomView = lazy(() => loadNamed(() => import("@/components/fix-view"), "SymptomView"));
const CareView = lazy(() => loadNamed(() => import("@/components/care-view"), "CareView"));
const ProcedureView = lazy(() => loadNamed(() => import("@/components/care-view"), "ProcedureView"));
const PartsView = lazy(() => loadNamed(() => import("@/components/parts-view"), "PartsView"));
const PartView = lazy(() => loadNamed(() => import("@/components/parts-view"), "PartView"));
const AboutView = lazy(() => loadNamed(() => import("@/components/more-view"), "AboutView"));
const ChecklistView = lazy(() => loadNamed(() => import("@/components/more-view"), "ChecklistView"));
const ChecklistsView = lazy(() => loadNamed(() => import("@/components/more-view"), "ChecklistsView"));
const CodesView = lazy(() => loadNamed(() => import("@/components/more-view"), "CodesView"));
const LogView = lazy(() => loadNamed(() => import("@/components/more-view"), "LogView"));
const RecordsView = lazy(() => loadNamed(() => import("@/components/records-view"), "RecordsView"));
const BackupView = lazy(() => loadNamed(() => import("@/components/backup-view"), "BackupView"));
const PrivacyView = lazy(() => loadNamed(() => import("@/components/privacy-view"), "PrivacyView"));
const SupportView = lazy(() => loadNamed(() => import("@/components/support-view"), "SupportView"));
const NotesView = lazy(() => loadNamed(() => import("@/components/notes-view"), "NotesView"));
const ShopSheet = lazy(() => loadNamed(() => import("@/components/shop-sheet"), "ShopSheet"));
const OwnerHistory = lazy(() => loadNamed(() => import("@/components/shop-sheet"), "OwnerHistory"));
const ProceduresView = lazy(() => loadNamed(() => import("@/components/more-view"), "ProceduresView"));
const RecallsView = lazy(() => loadNamed(() => import("@/components/more-view"), "RecallsView"));
const SpecsView = lazy(() => loadNamed(() => import("@/components/more-view"), "SpecsView"));
const ToolsView = lazy(() => loadNamed(() => import("@/components/more-view"), "ToolsView"));
const PrintView = lazy(() => loadNamed(() => import("@/components/print-view"), "PrintView"));
const TableView = lazy(() => loadNamed(() => import("@/components/table-view"), "TableView"));
const FlowView = lazy(() => loadNamed(() => import("@/components/flow-view"), "FlowView"));
const FlowsView = lazy(() => loadNamed(() => import("@/components/flow-view"), "FlowsView"));
const FigureView = lazy(() => loadNamed(() => import("@/components/figure-view"), "FigureView"));
const FiguresView = lazy(() => loadNamed(() => import("@/components/figure-view"), "FiguresView"));
const SheetView = lazy(() => loadNamed(() => import("@/components/figure-view"), "SheetView"));
const ManualsView = lazy(() => loadNamed(() => import("@/components/manuals-view"), "ManualsView"));
const WeightsView = lazy(() => loadNamed(() => import("@/components/weights-view"), "WeightsView"));
const LevelView = lazy(() => loadNamed(() => import("@/components/level-view"), "LevelView"));
const ServiceView = lazy(() => loadNamed(() => import("@/components/service-view"), "ServiceView"));
const TiresView = lazy(() => loadNamed(() => import("@/components/tires-view"), "TiresView"));
const SuppliesView = lazy(() => loadNamed(() => import("@/components/supplies-view"), "SuppliesView"));

const prompts = ["no hot water", "E-1", "glycol", "110", "brake grab", "winterize"];

export function Shell() {
  const hydrate = useApp((s) => s.hydrate);
  const trail = useApp((s) => s.trail);
  const cursor = useApp((s) => s.cursor);
  const screen = useMemo(
    () => trail[cursor]?.screen ?? { name: "home" as const },
    [trail, cursor],
  );
  const back = useApp((s) => s.back);
  const canBack = cursor > 0;
  function goBack() {
    if (!closeBackLayer()) back();
  }
  const tab = useApp((s) => s.tab);
  const push = useApp((s) => s.push);
  const searching = useApp((s) => s.searching);
  const setSearching = useApp((s) => s.setSearching);
  const picker = useApp((s) => s.picker);
  const setPicker = useApp((s) => s.setPicker);
  const setModel = useApp((s) => s.setModel);
  const modelId = useApp((s) => s.modelId);
  const vin = useApp((s) => s.vin);
  const toast = useApp((s) => s.toast);
  const keptRaw = useApp((s) => s.keptRaw);
  const undo = useApp((s) => s.undo);
  const runUndo = useApp((s) => s.runUndo);
  const ready = useApp((s) => s.ready);
  const hydrated = useApp((s) => s.hydrated);
  const accepted = useApp((s) => s.accepted);
  const acceptDisclaimer = useApp((s) => s.acceptDisclaimer);
  const [q, setQ] = useState("");
  const [coachQ, setCoachQ] = useState("");
  useEffect(() => {
    if (!picker) setCoachQ("");
  }, [picker]);
  const [updateReady, setUpdateReady] = useState(false);
  const [updateCurrent, setUpdateCurrent] = useState(false);
  const updateReg = useRef<ServiceWorkerRegistration | null>(null);
  const reloadOnClaim = useRef(false);
  const urlBooted = useRef(false);
  const holdHistory = useRef(false);
  const skipHash = useRef(0);
  const adoptAddress = () => {
    const opened = screenFromHash(window.location.hash);
    const now = useApp.getState().trail[useApp.getState().cursor]?.screen ?? { name: "home" as const };
    const wanted = opened ? screenToHash(opened) : "";
    if (screenToHash(now) === wanted) return;
    // A flowchart step is its own history entry. Leave it before opening the
    // new screen, or the step's cleanup walks the address back to step 1.
    holdHistory.current = true;
    try {
      while (closeBackLayer()) {
        /* drop a flowchart step before the address changes */
      }
      const live = useApp.getState();
      const liveNow = live.trail[live.cursor]?.screen ?? { name: "home" as const };
      if (screenToHash(liveNow) === wanted) return;
      if (opened) live.push(opened);
      else if (liveNow.name !== "home") live.tab("home");
    } finally {
      holdHistory.current = false;
    }
  };
  const model = modelById(modelId);
  const coachNeedle = coachQ.trim().toLowerCase();
  const coachGroups = modelGroups()
    .map((group) => ({
      ...group,
      models: group.models.filter((item) => !coachNeedle || `${group.family} ${item.name} ${item.short} ${item.tire}`.toLowerCase().includes(coachNeedle)),
    }))
    .filter((group) => group.models.length > 0);

  useEffect(() => {
    applyTheme();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMq = () => {
      try {
        if (themeChoice() !== "system") return;
      } catch {
        return;
      }
      applyTheme();
    };
    mq.addEventListener("change", onMq);
    return () => {
      mq.removeEventListener("change", onMq);
    };
  }, []);

  useEffect(() => {
    void readStorageHold();
    const ask = () => holdStorage();
    window.addEventListener("pointerdown", ask, { capture: true, once: true });
    return () => window.removeEventListener("pointerdown", ask, { capture: true });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    const write = (url: string) => {
      const here = `${path}${search}${hash}`;
      if (here !== url) window.history.replaceState(window.history.state, "", url);
    };
    if (!urlBooted.current) {
      const decision = addressAction(path, search, hash, screen, false);
      if (decision.open && screenToHash(decision.open) !== screenToHash(screen)) {
        const live = useApp.getState();
        const liveScreen = live.trail[live.cursor]?.screen ?? { name: "home" as const };
        if (screenToHash(decision.open) !== screenToHash(liveScreen)) live.push(decision.open);
        write(decision.url);
        return;
      }
      urlBooted.current = true;
      write(decision.url);
      return;
    }
    write(addressAction(path, search, hash, screen, true).url);
  }, [hydrated, screen]);

  useEffect(() => {
    if (!hydrated) return;
    const onHash = () => {
      if (skipHash.current > 0) {
        skipHash.current -= 1;
        return;
      }
      adoptAddress();
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [hydrated]);

  const screenKey = screenToHash(screen) || "/";
  const screenSeen = useRef<string | null>(null);
  useEffect(() => {
    if (screenSeen.current === null) {
      screenSeen.current = screenKey;
      return;
    }
    if (screenSeen.current === screenKey) return;
    screenSeen.current = screenKey;
    useApp.getState().dismissToast();
  }, [screenKey]);

  useEffect(() => {
    if (!hydrated) return;
    let depth = 0;
    let suppress = 0;
    let inPop = false;
    let syncing = false;
    let wasSearching = useApp.getState().searching;
    let wasPicker = useApp.getState().picker;
    const closeSearch = () => useApp.getState().setSearching(false);
    const closePicker = () => useApp.getState().setPicker(false);
    if (wasSearching) addBackLayer(closeSearch);
    if (wasPicker) addBackLayer(closePicker);

    const alignStoreLayers = () => {
      const state = useApp.getState();
      if (state.searching !== wasSearching) {
        wasSearching = state.searching;
        if (state.searching) addBackLayer(closeSearch);
        else removeBackLayer(closeSearch);
      }
      if (state.picker !== wasPicker) {
        wasPicker = state.picker;
        if (state.picker) addBackLayer(closePicker);
        else removeBackLayer(closePicker);
      }
    };
    const applyDepth = (target: number) => {
      const delta = target - depth;
      if (delta === 0) return;
      depth = target;
      if (delta > 0) {
        for (let i = 0; i < delta; i += 1) history.pushState({ sb: 1 }, "");
        return;
      }
      // One popstate, even when several screens are dropped at once.
      suppress += 1;
      skipHash.current += 1;
      history.go(delta);
      window.setTimeout(() => {
        if (skipHash.current > 0) skipHash.current -= 1;
      }, 0);
    };
    const sync = () => {
      if (syncing) return;
      syncing = true;
      try {
        alignStoreLayers();
        if (inPop) return;
        const target = useApp.getState().cursor + backLayerCount();
        if (holdHistory.current) {
          depth = target;
          return;
        }
        applyDepth(target);
      } finally {
        syncing = false;
      }
    };
    const onPop = () => {
      if (suppress > 0) {
        suppress -= 1;
        const live = useApp.getState();
        const open = live.trail[live.cursor]?.screen ?? { name: "home" as const };
        const want = `${window.location.pathname}${window.location.search}${screenToHash(open)}`;
        const here = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (here !== want) window.history.replaceState(window.history.state, "", want);
        return;
      }
      // A hash edit fires popstate in Chrome, with no back-stack marker.
      // Stepping back here was dropping /#/fix onto Home. A real screen in
      // the address is still a navigation, including while Home is open.
      const marker = window.history.state as { sb?: number } | null;
      if (!marker || marker.sb !== 1) {
        const state = useApp.getState();
        const open = state.trail[state.cursor]?.screen;
        if (open?.name === "home" && state.cursor === 0 && state.activeTab === "home" && !screenFromHash(window.location.hash)) {
          if (window.location.hash) {
            window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
          }
          return;
        }
        adoptAddress();
        return;
      }
      inPop = true;
      depth = Math.max(0, depth - 1);
      try {
        if (!closeBackLayer() && useApp.getState().cursor > 0) useApp.getState().back();
      } finally {
        inPop = false;
      }
    };
    window.addEventListener("popstate", onPop);
    const unsubStore = useApp.subscribe(sync);
    const unsubLayers = onBackLayers(sync);
    sync();
    return () => {
      window.removeEventListener("popstate", onPop);
      unsubStore();
      unsubLayers();
      removeBackLayer(closeSearch);
      removeBackLayer(closePicker);
    };
  }, [hydrated]);

  useEffect(() => {
    hydrate();
    let removeController: (() => void) | undefined;
    const cacheShell = () => {
      const controller = navigator.serviceWorker?.controller;
      if (!controller) return;
      const urls = performance.getEntriesByType("resource").map((entry) => {
        try {
          return new URL(entry.name).pathname;
        } catch {
          return "";
        }
      });
      controller.postMessage({ type: "cache-shell", urls });
    };
    const askVersion = () => {
      const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
      return fetch(`${prefix}/version.txt?ts=${Date.now()}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.text() : ""))
        .then((text) => {
          const remote = text.trim();
          const newer = /^\d{4}\.\d{2}\.\d{2}$/.test(remote) && remote !== BOOK_VERSION;
          if (newer) setUpdateReady(true);
          return newer;
        })
        .catch(() => false);
    };
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      const onChange = () => {
        if (reloadOnClaim.current) window.location.reload();
        else cacheShell();
      };
      navigator.serviceWorker.addEventListener("controllerchange", onChange);
      removeController = () => navigator.serviceWorker.removeEventListener("controllerchange", onChange);
      void registerBookWorker().then(async (reg) => {
        updateReg.current = reg;
        const watch = (worker: ServiceWorker | null) => {
          if (!worker) return;
          if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
          });
        };
        watch(reg.installing);
        watch(reg.waiting);
        reg.addEventListener("updatefound", () => watch(reg.installing));
        try {
          await reg.update();
        } catch {
          /* a phone with no signal still has the saved copy */
        }
        watch(reg.waiting);
      }).catch(() => undefined);
    }
    askVersion();
    const onCheck = () => {
      void askVersion().then((newer) => {
        const worker = updateReg.current?.waiting ?? updateReg.current?.installing;
        if (newer || worker) {
          setUpdateReady(true);
          setUpdateCurrent(false);
          return;
        }
        setUpdateReady(false);
        setUpdateCurrent(true);
      });
    };
    window.addEventListener("rivetcare-check-update", onCheck);
    const id = window.setTimeout(cacheShell, 700);
    const poll = window.setInterval(() => {
      void updateReg.current?.update().catch(() => undefined);
      askVersion();
    }, 60 * 1000);
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      void updateReg.current?.update().catch(() => undefined);
      askVersion();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(id);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("rivetcare-check-update", onCheck);
      removeController?.();
    };
  }, [hydrate]);

  useEffect(() => {
    const onPreload = (event: Event) => {
      event.preventDefault();
      if (typeof navigator !== "undefined" && navigator.onLine === false) return;
      const key = "rivetcare-preload-reload";
      try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {
        /* a private window can still reload once */
      }
      window.location.reload();
    };
    window.addEventListener("vite:preloadError", onPreload);
    return () => window.removeEventListener("vite:preloadError", onPreload);
  }, []);

  useEffect(() => {
    if (searching) {
      window.scrollTo(0, 0);
      document.getElementById("guide-search")?.focus();
    }
  }, [searching]);

  useEffect(() => {
    const title = screen.name === "home" ? "RivetCare" : `${screenTitle(screen)} · RivetCare`;
    document.title = title;
  }, [screen]);

  useEffect(() => {
    if (!picker) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPicker(false);
    };
    window.addEventListener("keydown", onKey);
    const onTab = (e: KeyboardEvent) => trapTab(e, document.getElementById("coach-dialog"));
    window.addEventListener("keydown", onTab);
    document.getElementById("coach-dialog")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", onTab);
    };
  }, [picker, setPicker]);

  const showDisclaimer = hydrated && !accepted;
  const showSetup = hydrated && !ready && !showDisclaimer;

  useEffect(() => {
    if (!showDisclaimer) return;
    const dialog = document.getElementById("disclaimer-dialog");
    if (dialog) {
      dialog.scrollTop = 0;
      dialog.focus();
    }
    const onTab = (e: KeyboardEvent) => trapTab(e, document.getElementById("disclaimer-dialog"));
    window.addEventListener("keydown", onTab);
    return () => window.removeEventListener("keydown", onTab);
  }, [showDisclaimer]);

  const [hits, setHits] = useState<Hit[]>([]);
  const [searched, setSearched] = useState("");
  const [searchDown, setSearchDown] = useState(false);
  useEffect(() => {
    if (!searching || !q.trim()) return;
    let cancel = false;
    const timer = window.setTimeout(() => {
      const miss = () => {
        if (cancel) return;
        setHits([]);
        setSearched(q);
        setSearchDown(true);
      };
      void import("@/data/search")
        .then(({ searchAll, searchSaved, savedRowsFrom, mergeHits }) => {
          if (cancel) return;
          void import("@/lib/weights")
            .then(({ weightSearchBlob }) => {
              if (cancel) return;
              const live = useApp.getState();
              const saved = searchSaved(q, savedRowsFrom({ notes: live.notes, log: live.log, weights: weightSearchBlob(live.modelId) }));
              setHits(mergeHits(saved, searchAll(q, model, coachYear(live.vin, live.modelYear))));
              setSearched(q);
              setSearchDown(false);
            })
            .catch(miss);
        })
        .catch(miss);
    }, 150);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, [q, searching, model, vin]);
  const section = tabFor(screen);

  function closeSearch() {
    setSearching(false);
  }

  function openHit(to: Screen) {
    push(to);
  }

  const lock = picker || showDisclaimer || showSetup;
  const tabTitle =
    screen.name === "home"
      ? "RivetCare"
      : screen.name === "care"
        ? "Maintain"
        : screen.name === "fix"
          ? "Fix"
          : screen.name === "records"
            ? "My records"
            : screen.name === "more"
              ? "Library"
              : "";
  const tabRoot = tabTitle !== "";

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-paper text-ink print:max-w-none print:bg-white">
      <a href="#content" className="skip-link no-print">
        Skip to content
      </a>
      <header className={`no-print sticky top-0 z-30 bg-paper ${updateReady || updateCurrent ? "" : "safe-top"}`}>
        {updateReady ? (
          <div className="safe-top flex items-center justify-between gap-3 bg-[#152A6A] px-4 pb-2">
            <p className="text-sm font-semibold text-white">A newer copy is ready.</p>
            <button
              type="button"
              className="min-h-11 shrink-0 rounded-full bg-white px-4 text-sm font-semibold text-[#152A6A]"
              style={{ backgroundColor: "#ffffff", color: "#152A6A" }}
              onClick={() => {
                setUpdateReady(false);
                reloadOnClaim.current = true;
                const waiting = updateReg.current?.waiting ?? updateReg.current?.installing;
                if (waiting) {
                  waiting.postMessage("skip-waiting");
                  window.setTimeout(() => {
                    if (reloadOnClaim.current) window.location.reload();
                  }, 4000);
                  return;
                }
                window.location.reload();
              }}
            >
              Update
            </button>
          </div>
        ) : updateCurrent ? (
          <div className="safe-top flex items-center justify-between gap-3 border-b border-line bg-sheet px-4 pb-2">
            <p className="text-sm font-semibold text-ink">This copy is current.</p>
            <button
              type="button"
              className="min-h-11 shrink-0 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink"
              onClick={() => setUpdateCurrent(false)}
            >
              OK
            </button>
          </div>
        ) : null}
        <div inert={lock || undefined}>
        {searching ? (
          <form
            role="search"
            className="px-4 pb-3 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (hits[0]) openHit(hits[0].to);
            }}
          >
            <BackButton onClick={closeSearch} />
            <div className="relative mt-1 min-w-0">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id="guide-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeSearch();
                }}
                placeholder="Search fault codes, parts, notes"
                aria-label="Search symptoms, codes, and parts"
                enterKeyHint="search"
                inputMode="search"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="box-border min-h-12 w-full min-w-0 max-w-full rounded-full border border-line bg-sheet pl-10 pr-12 text-base text-ink placeholder:text-muted focus:border-navy"
              />
              <button
                type="button"
                className="absolute right-0.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-ink"
                aria-label="Close search"
                onClick={closeSearch}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
          </form>
        ) : (
          <div className="px-4 pb-3 pt-1">
            <div className="flex h-11 items-center">
              {canBack ? <BackButton onClick={goBack} /> : null}
              <div className="ml-auto flex items-center gap-1">
                <DarkModeSwitch />
                {screen.name === "records" ? (
                  <button
                    type="button"
                    onClick={() => push({ name: "log" })}
                    className="inline-flex h-11 items-center gap-1 rounded-full bg-navy px-3.5 text-sm font-semibold text-on-navy"
                  >
                    <Plus className="size-4" aria-hidden />
                    Add
                  </button>
                ) : screen.name === "home" ? null : (
                  <button
                    type="button"
                    onClick={() => setSearching(true)}
                    aria-expanded={searching}
                    aria-label="Search"
                    className="grid size-11 shrink-0 place-items-center text-ink"
                  >
                    <Search className="size-6" aria-hidden />
                  </button>
                )}
              </div>
            </div>
            {tabRoot ? (
              screen.name === "home" ? (
                <h1>
                  <img src="/logo.png" alt="RivetCare" width={806} height={176} className="logo-mark" />
                </h1>
              ) : (
                <PageTitle className="font-display text-[2rem] leading-tight text-ink">{tabTitle}</PageTitle>
              )
            ) : null}
            {tabRoot && screen.name !== "home" ? <TrailerStrip /> : null}
          </div>
        )}
        </div>
      </header>

      <RestoreHold />

      {searching ? (
        <main id="content" className="relative z-10 px-4 py-3 pb-28">
          <h1 className="sr-only">Search results</h1>
          {!q && (
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button key={p} onClick={() => setQ(p)} className="min-h-11 rounded-full border border-line bg-sheet px-3 text-sm font-semibold">
                  {p}
                </button>
              ))}
            </div>
          )}
          <div aria-live="polite">
            <ul className="mt-3 space-y-2">
              {hits.map((h, i) => (
                <li key={i}>
                  <button
                    onClick={() => openHit(h.to)}
                    className="w-full min-w-0 rounded-card border border-line bg-sheet px-3 py-3 text-left wrap-anywhere"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">{h.kicker}</span>
                    <span className="block font-semibold text-ink">{h.title}</span>
                    <span className="block text-sm text-muted">{h.detail}</span>
                    {h.why ? <span className="mt-1 block text-sm text-ink">{h.why}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
            {q && searched === q && hits.length === 0 && <p className="mt-6 text-sm text-muted">{searchDown ? "That list needs a signal." : "Nothing matches that."}</p>}
            {q && searched !== q && <p className="mt-6 text-sm text-muted">Searching…</p>}
          </div>
        </main>
      ) : (
        <main id="content" inert={lock || undefined} className="relative z-10 px-4 pb-28 pt-1 print:px-0 print:pb-0 print:pt-0">
          <ScreenBoundary key={screenToHash(screen) || "/"}>
            <Suspense fallback={<ScreenSkeleton />}>
              <ScreenBody screen={screen} />
            </Suspense>
          </ScreenBoundary>
          {screen.name === "home" ? (
            <div className="mt-8 px-1 text-center">
              <p className="text-sm font-semibold text-ink">RivetCare</p>
              <p className="text-sm text-muted">@RivetCareApp</p>
              <AffiliationNote />
            </div>
          ) : null}
        </main>
      )}

      <nav aria-label="Sections" inert={lock || undefined} className="safe-bottom no-print fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-paper">
        <div className="mx-auto max-w-lg">
          <div className="grid grid-cols-5 px-1">
          <Tab icon={<House className="size-5" />} label="Home" on={section === "home"} go={() => tab("home")} />
          <Tab icon={<Calendar className="size-5" />} label="Maintain" on={section === "care"} go={() => tab("care")} />
          <Tab icon={<ClipboardList className="size-5" />} label="Records" on={section === "records"} go={() => tab("records")} />
          <Tab icon={<Wrench className="size-5" />} label="Fix" on={section === "fix"} go={() => tab("fix")} />
          <Tab icon={<BookOpen className="size-5" />} label="Library" on={section === "more"} go={() => tab("more")} />
          </div>
        </div>
      </nav>

      {showSetup && <SetupView />}

      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-inverse/40"
          onClick={() => setPicker(false)}
        >
          <div
            id="coach-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coach-title"
            tabIndex={-1}
            className="safe-bottom max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-sheet px-4 pt-4 outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-4 flex items-center bg-sheet px-4 pb-2">
              <BackButton onClick={() => setPicker(false)} />
            </div>
            <h2 id="coach-title" className="font-display text-2xl text-ink">Which trailer?</h2>
            <p className="mt-1 text-sm text-muted">2027 travel trailers, from the owner’s manuals. Your weight sticker governs. Other is a year or model that is not on this list.</p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-rule pt-2">
              <p className="text-sm font-semibold text-ink">Light or dark</p>
              <DarkModeSwitch />
            </div>
            <CoachIdentity />
            <p className="mt-4 text-sm font-semibold text-ink">Floor plan</p>
            <label className="sr-only" htmlFor="coach-search">Search floor plans</label>
            <input
              id="coach-search"
              value={coachQ}
              onChange={(e) => setCoachQ(e.target.value)}
              placeholder="Classic, 28, Globetrotter…"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              className="mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
            />
            <div className="mt-3 space-y-4 pb-4">
              {coachGroups.length === 0 ? <p className="text-sm text-muted">Nothing matches that.</p> : null}
              {coachGroups.map((group) => (
                <div key={group.family}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">{group.family}</p>
                  <ul className="mt-2 space-y-2">
                    {group.models.map((m) => (
                      <li key={m.id}>
                        <button
                          onClick={() => setModel(m.id)}
                          className={`flex min-h-14 w-full items-center rounded-card border px-3 py-2 text-left ${modelId === m.id ? "border-navy bg-navy text-on-navy" : "border-line bg-paper text-ink"}`}
                          aria-pressed={modelId === m.id}
                        >
                          <span className="min-w-0">
                            <span className="block font-semibold">{m.name}</span>
                            <span className={`text-sm ${modelId === m.id ? "text-on-navy/80" : "text-muted"}`}>
                              {m.gvwr === "—" ? `${m.length} · weights not listed` : `${m.gvwr} GVWR · ${m.tire}`}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast || keptRaw ? (
          <div className="flex max-w-full items-center gap-3 rounded-full bg-inverse px-4 py-2 text-sm font-semibold text-on-navy">
            <span className="min-w-0">{toast || "The saved copy on this phone could not be read. It was kept."}</span>
            {keptRaw ? (
              <button
                type="button"
                onClick={() => {
                  const file = new Blob([keptRaw], { type: "text/plain" });
                  const url = URL.createObjectURL(file);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "rivetcare-unreadable.txt";
                  a.rel = "noopener";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
                className="min-h-11 shrink-0 underline"
              >
                Save copy
              </button>
            ) : null}
            {undo ? (
              <button type="button" onClick={runUndo} className="min-h-11 underline">
                Undo
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {showDisclaimer && (
        <div className="no-print fixed inset-0 z-50 flex items-end bg-inverse/50 sm:items-center sm:justify-center">
          <div
            id="disclaimer-dialog"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
            className="safe-bottom max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-sheet px-5 pt-5 sm:max-w-lg sm:rounded-3xl sm:pb-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Before you use this</p>
            <h2 id="disclaimer-title" className="mt-1 font-display text-3xl text-ink">Disclaimer</h2>
            <div className="mt-3">
              <DisclaimerCopy />
            </div>
            <button
              id="disclaimer-accept"
              type="button"
              onClick={() => acceptDisclaimer()}
              className="mt-4 mb-2 min-h-12 w-full rounded-full bg-navy text-sm font-semibold text-on-navy"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function trapTab(e: KeyboardEvent, root: HTMLElement | null) {
  if (e.key !== "Tab" || !root) return;
  const list = [...root.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter(
    (el) => !el.hasAttribute("disabled"),
  );
  if (!list.length) return;
  const first = list[0];
  const last = list[list.length - 1];
  const inside = root.contains(document.activeElement);
  if (e.shiftKey && (document.activeElement === first || !inside)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function CoachIdentity() {
  const vin = useApp((s) => s.vin);
  const setVin = useApp((s) => s.setVin);
  const modelYear = useApp((s) => s.modelYear);
  const model = modelById(useApp((s) => s.modelId));
  const [yearDraft, setYearDraft] = useState(modelYear ? String(modelYear) : "");
  useEffect(() => {
    setYearDraft(modelYear ? String(modelYear) : "");
  }, [modelYear, model.id]);
  const decoded = vinOk(vin) ? vinYear(vin) : null;
  const year = coachYear(vin, modelYear);
  const vinError = vinProblem(vin);
  const mismatch = vinMismatch(vin, model);
  const yearLine =
    decoded && modelYear && decoded !== modelYear
      ? `The year you typed is ${modelYear}. The VIN says ${decoded}. The typed year is the one this app will use.`
      : mismatch
        ? mismatch
        : decoded
          ? `${decoded} from the VIN. Confirm the plate.`
          : year
            ? `${year} on this coach. A VIN can confirm it.`
            : "Type the model year, or a 17-character VIN.";
  return (
    <>
      <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="coach-year">
        Model year
        <input
          id="coach-year"
          inputMode="numeric"
          value={yearDraft}
          onChange={(e) => setYearDraft(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onBlur={() => {
            if (!yearDraft) {
              useApp.getState().setModelYear(null);
              return;
            }
            const n = Number(yearDraft);
            if (yearDraft.length < 4 || n < 1960 || n > 2039) {
              useApp.getState().flash("Enter a year from 1960 to 2039");
              setYearDraft(modelYear ? String(modelYear) : "");
              return;
            }
            useApp.getState().setModelYear(n);
          }}
          placeholder="2021"
          className="mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink"
        />
      </label>
      <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="coach-vin">
        VIN
        <input
          id="coach-vin"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          maxLength={17}
          placeholder="17 characters"
          aria-describedby={vinError ? "vin-error" : "vin-status"}
          aria-invalid={vinError !== null}
          className="mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 font-mono text-sm uppercase tracking-wide text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-muted"
        />
      </label>
      <p id="vin-status" className="mt-1 text-sm text-muted">{yearLine}</p>
      {vinError ? (
        <p id="vin-error" className="mt-1 text-sm font-semibold text-stop">
          {vinError}
        </p>
      ) : null}
    </>
  );
}

function TrailerStrip() {
  const model = modelById(useApp((s) => s.modelId));
  const nickname = useApp((s) => s.nickname);
  const odo = useApp((s) => s.odometer);
  const vin = useApp((s) => s.vin);
  const year = coachYear(vin, useApp((s) => s.modelYear));
  const miles = odo > 0 ? `${odo.toLocaleString()} mi` : "miles not set";
  const sub = `${year ? `${year} ` : ""}${model.family} ${model.short} · ${miles}`;
  const setPicker = useApp((s) => s.setPicker);
  return (
    <div className="mt-3 flex min-h-14 items-center gap-2 rounded-full bg-sheet px-4 py-2">
      <button
        type="button"
        onClick={() => setPicker(true)}
        aria-haspopup="dialog"
        className="min-w-0 flex-1 text-left"
      >
        <span className="sr-only">Change trailer</span>
        <span className="block truncate font-semibold text-ink">{nickname || model.short}</span>
        <span className="block truncate text-sm text-muted">{sub}</span>
      </button>
      <button type="button" className="min-h-11 shrink-0 px-1 text-sm font-semibold text-ink" onClick={() => setPicker(true)}>
        Change
      </button>
    </div>
  );
}

function RestoreHold() {
  const flash = useApp((s) => s.flash);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    try {
      const note = sessionStorage.getItem(RESTORE_NOTE);
      if (note) {
        sessionStorage.removeItem(RESTORE_NOTE);
        useApp.getState().flash(note);
      }
    } catch {
      /* the hold still shows when session storage is blocked */
    }
    return subscribeRestoreHold(setOn);
  }, []);
  if (!on) return null;
  return (
    <div className="no-print border-b border-line bg-sheet px-4 py-3">
      <p className="text-sm text-ink">The previous log is still on this phone.</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          disabled={busy}
          className="min-h-11 flex-1 rounded-full bg-navy font-semibold text-on-navy disabled:opacity-40"
          onClick={() => {
            if (restoreApplying() || busy) return;
            setBusy(true);
            void undoRestore().then((ok) => {
              if (!ok) {
                setBusy(false);
                flash("Could not put the previous log back.");
                return;
              }
              window.location.reload();
            });
          }}
        >
          Undo restore
        </button>
        <button
          type="button"
          disabled={busy}
          className="min-h-11 flex-1 rounded-full border border-line font-semibold text-ink disabled:opacity-40"
          onClick={() => {
            if (restoreApplying() || busy) return;
            setBusy(true);
            void confirmRestore().finally(() => setBusy(false));
          }}
        >
          Keep this restore
        </button>
      </div>
    </div>
  );
}

function BackButton({ onClick, iconOnly = false }: { onClick: () => void; iconOnly?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex h-11 shrink-0 items-center text-ink" aria-label="Back">
      <ChevronLeft className="size-6 shrink-0" aria-hidden />
      {iconOnly ? null : <span className="text-sm font-semibold">Back</span>}
    </button>
  );
}

function ScreenSkeleton() {
  return (
    <div className="grid gap-3 py-2" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-quiet" />
      <div className="h-28 animate-pulse rounded-[20px] bg-quiet" />
      <div className="h-28 animate-pulse rounded-[20px] bg-quiet" />
    </div>
  );
}

function Tab({ icon, label, on, go }: { icon: ReactNode; label: string; on: boolean; go: () => void }) {
  return (
    <button onClick={go} aria-current={on ? "page" : undefined} className="flex min-h-14 items-center justify-center">
      <span className={`flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-center text-sm leading-tight ${on ? "font-semibold text-accent" : "font-medium text-muted"}`}>
        <span aria-hidden className={`grid size-8 place-items-center rounded-full [&_svg]:size-5 ${on ? "bg-navy text-on-navy" : ""}`}>
          {icon}
        </span>
        {label}
      </span>
    </button>
  );
}

function ScreenBody({ screen }: { screen: Screen }) {
  switch (screen.name) {
    case "home":
      return <HomeView />;
    case "fix":
      return <FixView />;
    case "symptom":
      return <SymptomView key={`${screen.id}-${screen.step}`} id={screen.id} step={screen.step} />;
    case "care":
      return <CareView />;
    case "procedure":
      return <ProcedureView id={screen.id} />;
    case "procedures":
      return <ProceduresView />;
    case "parts":
      return <PartsView />;
    case "part":
      return <PartView id={screen.id} />;
    case "more":
      return <MoreView />;
    case "checklist":
      return <ChecklistView id={screen.id} />;
    case "lists":
      return <ChecklistsView />;
    case "specs":
      return <SpecsView />;
    case "weights":
      return <WeightsView />;
    case "level":
      return <LevelView />;
    case "tires":
      return <TiresView />;
    case "supplies":
      return <SuppliesView />;
    case "service":
      return <ServiceView />;
    case "recalls":
      return <RecallsView />;
    case "codes":
      return <CodesView initialQuery={screen.q ?? ""} initialAppliance={screen.appliance ?? "All"} />;
    case "log":
      return <LogView />;
    case "records":
      return <RecordsView />;
    case "backup":
      return <BackupView />;
    case "privacy":
      return <PrivacyView />;
    case "history":
      return <OwnerHistory />;
    case "notes":
      return <NotesView />;
    case "desk":
      return <ShopSheet />;
    case "manuals":
      return <ManualsView />;
    case "tools":
      return <ToolsView />;
    case "about":
      return <AboutView />;
    case "printout":
      return <PrintView />;
    case "table":
      return <TableView id={screen.id} step={screen.step} />;
    case "flows":
      return <FlowsView />;
    case "flow":
      return <FlowView key={screen.id} id={screen.id} />;
    case "figures":
      return <FiguresView />;
    case "figure":
      return <FigureView id={screen.id} />;
    case "sheet":
      return <SheetView page={screen.page} />;
    case "offline":
      return <OfflineView />;
    case "support":
      return <SupportView />;
  }
}