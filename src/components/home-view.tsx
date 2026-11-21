import { Camera, ChevronRight, ListChecks, MapPin, Ruler, Scale, Search, Shield, Wrench } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { procedureFits, vinMismatch, vinOk, vinProblem, coachYear, SPEC_YEAR } from "@/data/coach";
import { modelById } from "@/data/models";
import { tasks, unsetScheduleCopy } from "@/data/schedule";
import { dueOf, dueWhy, daysUntilNext, maintainBand, nextDue, pickNextTask, retorqueWatch, useApp } from "@/lib/store";
import { getFile, prepareFile, putFile } from "@/lib/files";
import { supplyAges } from "@/lib/supplies";
import { homeTireLine, jobMark } from "@/lib/tires";
import { speakDue, disableReminders, enableReminders, noticesAreOn, readNoticesChoice, readReminderStatus, type ReminderStatus } from "@/lib/remind";
import { daysBetween, formatWhen, todayIso } from "@/lib/date";
import { readStorageHold, subscribeStorageHold, type StorageHold } from "@/lib/hold-storage";

function StorageWarning() {
  const [hold, setHold] = useState<StorageHold>("unknown");
  useEffect(() => {
    let stop = false;
    void readStorageHold().then((next) => {
      if (!stop) setHold(next);
    });
    const unsub = subscribeStorageHold((next) => {
      if (!stop) setHold(next);
    });
    return () => {
      stop = true;
      unsub();
    };
  }, []);
  if (hold === "unknown" || hold === "granted") return null;
  return (
    <span className="mt-0.5 block font-normal text-muted">
      Safari can clear records kept only in the browser after about 7 days without a visit, unless this app is on your Home Screen. This browser has not promised to keep them.
    </span>
  );
}

export function HomeView() {
  const model = modelById(useApp((s) => s.modelId));
  const push = useApp((s) => s.push);
  const installHint = useApp((s) => s.installHint);
  const dismissInstall = useApp((s) => s.dismissInstall);
  const [standalone, setStandalone] = useState(false);
  const [installEvent, setInstallEvent] = useState<Event | null>(null);
  const [naming, setNaming] = useState(false);
  const nickname = useApp((s) => s.nickname);
  const [nameDraft, setNameDraft] = useState(nickname);
  useEffect(() => {
    setNaming(false);
    setNameDraft(useApp.getState().nickname);
  }, [model.id]);
  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    setStandalone(window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  const done = useApp((s) => s.done);
  const odo = useApp((s) => s.odometer);
  const wheelOff = useApp((s) => s.wheelOff);
  const lugAck = useApp((s) => s.lugAck);
  const vin = useApp((s) => s.vin);
  const modelYear = useApp((s) => s.modelYear);
  const year = coachYear(vin, modelYear);
  const watch = retorqueWatch(wheelOff, odo, Boolean(done.retorque), lugAck);
  const stages = watch.upcoming;
  const missed = watch.missed;
  const lugNow = watch.current == null ? null : [...missed, ...stages].find((row) => row.miles === watch.current) ?? null;
  const retorqueOn = lugNow != null;
  const mine = tasks.filter((t) => {
    if (t.fit === "classic" && !model.alde && model.family !== "Other") return false;
    if (t.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
    if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
    return true;
  });
  const tires = useApp((s) => s.tires);
  const next = mine
    .filter((t) => {
      const state = dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
      return state === "due" || state === "unset";
    })
    .map((t) => ({ t, state: dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo) as "due" | "unset" }))
    .sort((a, b) => Number(a.state !== "due") - Number(b.state !== "due"));
  const tireLine = homeTireLine(tires);
  const supply = supplyAges(useApp((s) => s.supplies));
  const supplyLine =
    supply.propaneYears != null && supply.propaneYears >= 12
      ? `Cylinder about ${Math.floor(supply.propaneYears)} years`
      : supply.batteryYears != null && supply.batteryYears >= 5
        ? `Batteries about ${Math.floor(supply.batteryYears)} years`
        : null;
  const mismatch = vinMismatch(vin, model);
  const vinError = vinProblem(vin);
  const log = useApp((s) => s.log);
  const logDraft = useApp((s) => s.logDraft);
  const lastBackup = useApp((s) => s.lastBackup);
  const coachSet = useApp((s) => s.coachSet);
  const ready = useApp((s) => s.ready);
  const hydrated = useApp((s) => s.hydrated);
  const showInstall = installHint && !standalone;
  const dueTitles = [
    ...next.filter((item) => item.state === "due").map((item) => item.t.title),
    ...(lugNow ? [lugNow.left > 0 ? `Lug re-torque, ${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left` : `Lug re-torque, ${lugNow.miles} mi check is due`] : []),
    ...(tireLine ? [tireLine] : []),
    ...(supplyLine ? [supplyLine] : []),
  ];
  const dueKey = dueTitles.map((title) => JSON.stringify(title)).join(",");
  const dueRef = useRef(dueTitles);
  dueRef.current = dueTitles;
  const vinNote = mismatch ? mismatch : vinError ? vinError : vinOk(vin) ? "VIN on file" : "No VIN yet";
  useEffect(() => {
    void speakDue(dueRef.current);
  }, [dueKey]);
  useEffect(() => {
    const onShow = () => {
      if (document.visibilityState === "visible") void speakDue(dueRef.current);
    };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, []);
  const [reminders, setReminders] = useState<ReminderStatus>("unsupported");
  const [notices, setNotices] = useState(false);
  useEffect(() => {
    const status = readReminderStatus();
    setReminders(status);
    setNotices(noticesAreOn(status, readNoticesChoice()));
  }, []);
  function setNoticeState(status: ReminderStatus) {
    setReminders(status);
    setNotices(noticesAreOn(status, readNoticesChoice()));
  }

  const picked = pickNextTask(
    mine.map((t) => ({ id: t.id, cadence: t.cadence, mark: jobMark(t.id, done[t.id], tires, odo) })),
    odo,
  );
  const lugLeads = retorqueOn && (!picked || picked.why === "next");
  const feature = !lugLeads && picked ? mine.find((t) => t.id === picked.id) ?? null : null;
  const featureWhy = retorqueOn && !feature
    ? lugNow
      ? lugNow.left > 0
        ? `${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left`
        : `${lugNow.miles} mi check is due`
      : "Due now"
    : picked?.why === "due"
      ? "Due now"
      : picked?.why === "soon"
        ? "Due soon"
        : null;
  const dueNow =
    (retorqueOn && !feature && (!lugNow || lugNow.left <= 0)) || picked?.why === "due";
  const featureMark = feature ? jobMark(feature.id, done[feature.id], tires, odo) : undefined;
  const featureDays = feature ? daysUntilNext(feature.cadence, featureMark, odo) : null;
  const upcoming = feature && picked?.why !== "due" ? nextDue(feature.cadence, featureMark, odo) : null;
  const upcomingWhen = upcoming?.replace(/^Next /, "") ?? "";
  const featureLine = feature
    ? feature.id === "tires-replace" && tireLine
      ? tireLine
      : picked?.why === "due"
        ? dueWhy(feature.cadence, featureMark, odo)
        : featureDays != null && featureDays <= 30
          ? upcomingWhen
            ? `Due in ${featureDays} ${featureDays === 1 ? "day" : "days"} · ${upcomingWhen}`
            : `Due in ${featureDays} ${featureDays === 1 ? "day" : "days"}`
          : upcoming
    : missed.length && !stages.length
      ? "Break-in checks at 5, 10, 25, and 50 miles are past this reading. Mark it done if the lugs were already checked."
      : null;
  const dueJob = feature ?? (retorqueOn ? mine.find((t) => t.id === "retorque") ?? null : null);
  const procedureId = dueJob?.procedureId && procedureFits(dueJob.procedureId, model, year) ? dueJob.procedureId : "";
  const traveled = watch.start != null && odo > watch.start ? Math.min(50, odo - watch.start) : 0;
  const unsetCount = mine.filter((task) => dueOf(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "unset").length;
  const unsetCopy = !feature && !retorqueOn ? unsetScheduleCopy(unsetCount) : null;
  const overdueCount = mine.filter((task) => maintainBand(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "overdue").length;
  const dueSoonCount = mine.filter((task) => {
    const left = daysUntilNext(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo);
    return left != null && left <= 30;
  }).length;
  const draftOpen = Boolean(logDraft && (logDraft.note.trim() || logDraft.files.length));
  const coachName = `${year ? `${year} ` : ""}${model.name}`;
  const milesLine = odo > 0 ? `${odo.toLocaleString()} mi` : "Miles not set";
  const backupDays = lastBackup ? daysBetween(lastBackup, todayIso()) : null;
  const backupStale = backupDays != null && backupDays >= 30;
  const backupTone = backupStale ? "text-caution" : "text-ok";

  const [installDesktop, setInstallDesktop] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const phone = ios || /Android|Mobile|webOS/i.test(ua);
    setInstallDesktop(!phone);
  }, []);
  function addToHome() {
    const prompt = installEvent as (Event & { prompt?: () => Promise<void>; userChoice?: Promise<{ outcome: "accepted" | "dismissed" }> }) | null;
    const ask = prompt?.prompt;
    if (ask) {
      void (async () => {
        try {
          await ask();
          const choice = await prompt?.userChoice;
          if (choice?.outcome === "accepted") dismissInstall();
        } finally {
          setInstallEvent(null);
        }
      })();
      return;
    }
  }

  return (
    <div className="space-y-3">
      {!hydrated ? (
        <div className="grid gap-3 py-2" aria-busy="true" aria-label="Loading your records">
          <div className="h-12 animate-pulse rounded-full bg-quiet" />
          <div className="h-28 animate-pulse rounded-[20px] bg-quiet" />
          <div className="h-40 animate-pulse rounded-[20px] bg-quiet" />
        </div>
      ) : null}
      {hydrated ? (<>
      <button
        type="button"
        onClick={() => useApp.getState().setSearching(true)}
        className="flex min-h-12 w-full items-center gap-2 rounded-full border border-line bg-sheet px-4 text-left text-muted"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        Search fault codes, parts, notes
      </button>

      <section className="rounded-[20px] border border-line bg-sheet p-3">
        <div className="flex items-start gap-3">
        <TrailerMark />
        <div className="flex min-w-0 flex-1 items-start gap-1">
          <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">My trailer</p>
          {naming ? (
            <form
              className="mt-1"
              onSubmit={(e) => {
                e.preventDefault();
                useApp.getState().setNickname(nameDraft);
                setNaming(false);
              }}
            >
              <label className="sr-only" htmlFor="trailer-name">Nickname</label>
              <input
                id="trailer-name"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={() => {
                  useApp.getState().setNickname(nameDraft);
                  setNaming(false);
                }}
                maxLength={40}
                autoFocus
                placeholder="Name this trailer"
                className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink"
              />
            </form>
          ) : (
            <button
              type="button"
              className="mt-0.5 block max-w-full whitespace-normal text-left font-display text-[1.65rem] leading-tight text-ink"
              aria-label={nickname ? `Name this trailer. Now called ${nickname}` : "Name this trailer"}
              onClick={() => {
                setNameDraft(nickname);
                setNaming(true);
              }}
            >
              {nickname || model.name}
            </button>
          )}
          {coachName !== (nickname || model.name) ? (
            <p className="mt-1 whitespace-normal text-base font-semibold leading-snug text-ink">{coachName}</p>
          ) : null}
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3">
            <button
              type="button"
              onClick={() => useApp.getState().tab("care")}
              className="min-h-11 shrink-0 tabular-nums text-left text-base font-semibold text-ink"
              aria-label={odo > 0 ? `Trailer miles, ${odo.toLocaleString()}. Change them on Maintain.` : "Miles not set. Set them on Maintain."}
            >
              {milesLine}
            </button>
            <button
              type="button"
              onClick={() => useApp.getState().setPicker(true)}
              className="min-h-11 min-w-0 text-left text-sm font-semibold text-ink"
            >
              {vinNote}
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Change trailer"
          onClick={() => useApp.getState().setPicker(true)}
          className="grid size-11 shrink-0 place-items-center text-muted"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
        </div>
      </div>
      </section>

      {ready && !coachSet ? (
        <button
          type="button"
          onClick={() => useApp.getState().setPicker(true)}
          className="w-full rounded-[20px] border border-line bg-sheet px-4 py-3 text-left text-sm font-semibold leading-snug text-ink"
        >
          Showing the {year ?? SPEC_YEAR} {model.name} until you pick yours.
        </button>
      ) : null}

      <section className="rounded-[20px] border border-line bg-sheet p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{unsetCopy ? "Schedule" : dueNow ? "Due now" : "Next due"}</p>
          {featureWhy && featureWhy !== "Due now" ? <p className={`text-sm font-semibold ${dueNow ? "text-signal" : "text-caution"}`}>{featureWhy}</p> : null}
        </div>
        <h2 className="mt-2 text-[1.65rem] leading-tight text-ink">
          {feature ? feature.title : retorqueOn ? (lugNow ? `${lugNow.miles} mi lug check` : "Re-torque the lugs") : unsetCopy ? unsetCopy.title : "Nothing is due"}
        </h2>
        <p className="mt-1 text-sm text-ink">
          {feature
            ? featureLine || feature.detail
            : lugNow
              ? lugNow.left > 0
                ? `Star pattern. ${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left.`
                : `${lugNow.miles} mi check is due. Star pattern.`
              : unsetCopy
                ? unsetCopy.body
                : "The next job with a start date shows here."}
        </p>
        {stages.length > 0 && !feature && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full bg-sage" style={{ width: `${(traveled / 50) * 100}%` }} />
          </div>
        )}
        {retorqueOn && feature ? (
          <p className={`mt-3 text-sm ${lugNow && lugNow.left > 0 ? "text-caution" : "text-signal"}`}>
            {lugNow ? (lugNow.left > 0 ? `${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left` : `${lugNow.miles} mi check is due`) : "Lug re-torque is past the 50 mile check"}
          </p>
        ) : null}
        {tireLine || supplyLine ? <p className="mt-3 text-sm text-caution">{[tireLine, supplyLine].filter(Boolean).join(" · ")}</p> : null}
        {!unsetCopy ? (
          <p className="mt-3 text-sm text-ink">
            {overdueCount === 0 ? "None overdue." : overdueCount === 1 ? "1 overdue." : `${overdueCount} overdue.`}{" "}
            {dueSoonCount === 0 ? "None due in 30 days." : dueSoonCount === 1 ? "1 due in 30 days." : `${dueSoonCount} due in 30 days.`}{" "}
            Last service: {log[0] ? formatWhen(log[0].iso) : "none yet"}.
            {draftOpen ? " A service note is still open." : ""}
          </p>
        ) : null}
        <div className="mt-4 flex gap-2">
          {feature || (retorqueOn && !feature) ? (
            <button
              type="button"
              onClick={() => useApp.getState().markDone(feature ? feature.id : "retorque", feature ? feature.title : "Re-torque the lugs")}
              className="min-h-11 flex-1 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy"
            >
              Mark done
            </button>
          ) : null}
          {procedureId ? (
            <button
              type="button"
              onClick={() => push({ name: "procedure", id: procedureId })}
              className="min-h-11 flex-1 rounded-full border border-line px-4 text-sm font-semibold text-ink"
            >
              How to
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => useApp.getState().tab("care")}
            className={
              unsetCopy
                ? "min-h-11 w-full rounded-full bg-navy px-4 text-sm font-semibold text-on-navy"
                : `min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink ${feature || (retorqueOn && !feature) ? "flex-1" : "w-full"}`
            }
          >
            {unsetCopy ? "Set starting dates" : "Schedule"}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <Tool icon={<Ruler className="size-5" />} title="Trailer level" detail="Which end is low" onClick={() => push({ name: "level" })} />
        <Tool icon={<Scale className="size-5" />} title="Weights" detail="Axle weights from a scale" onClick={() => push({ name: "weights" })} />
        <Tool icon={<Wrench className="size-5" />} title="Fix" detail="Symptoms, steps, and codes" onClick={() => { useApp.getState().setSystem(""); useApp.getState().tab("fix"); }} />
        <Tool icon={<ListChecks className="size-5" />} title="Checklists" detail="Tow, setup, and storage" onClick={() => push({ name: "lists" })} />
      </div>
      <button type="button" onClick={() => push({ name: "service" })} className="flex min-h-14 w-full items-center gap-3 rounded-[20px] border border-line bg-sheet px-4 text-left">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-paper text-ok"><MapPin className="size-5" aria-hidden /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-tight text-ink">Find service</span>
          <span className="mt-0.5 block text-sm leading-snug text-muted">Dealers and shops</span>
        </span>
      </button>

      <div className="flex items-center gap-2 px-1 py-1">
        <p className="min-w-0 flex-1 text-sm leading-snug text-ink">
          <span className="font-semibold">Phone reminders</span>
          <span className="mt-0.5 block text-sm font-normal text-muted">
            {!notices
              ? "Off."
              : reminders === "granted"
                ? "On. One short notice a day."
                : reminders === "denied"
                  ? "On here. Allow notifications in Settings."
                  : "On. Open from the Home Screen icon to deliver it."}
          </span>
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={notices}
          aria-label="Phone reminders"
          onClick={() => {
            if (notices) {
              void disableReminders().then(setNoticeState);
              return;
            }
            void enableReminders(dueRef.current).then(setNoticeState);
          }}
          className="grid h-11 w-12 shrink-0 place-items-center"
        >
          <span className={`relative h-6 w-10 rounded-full ${notices ? "bg-navy" : "border border-line bg-paper"}`} aria-hidden>
            <span className={`absolute top-0.5 size-5 rounded-full bg-knob shadow-sm ${notices ? "right-0.5" : "left-0.5"}`} />
          </span>
        </button>
      </div>

      <div className="flex items-start gap-3 px-1">
        <Shield className={`mt-3 size-5 shrink-0 ${lastBackup ? backupTone : "text-caution"}`} aria-hidden />
        <button type="button" onClick={() => push({ name: "backup" })} className="min-h-11 min-w-0 flex-1 py-2 text-left text-sm">
          <span className={`block font-semibold ${lastBackup ? backupTone : "text-ink"}`}>
            {lastBackup ? `Last backup saved ${formatWhen(lastBackup)}.` : "These records are only on this phone."}
          </span>
          <span className={`mt-0.5 block font-normal ${lastBackup ? backupTone : "text-muted"}`}>
            {lastBackup
              ? "Not checked again after you save the file. Open Backup and tap Verify backup."
              : "Saving a copy keeps the records."}
          </span>
          <StorageWarning />
        </button>
      </div>

      {showInstall ? (
        <div className="px-1 py-2">
          <p className="font-semibold text-ink">Add it to your Home Screen</p>
          {installDesktop ? (
            <p className="mt-1 text-sm text-muted">On this computer, use the install icon in the address bar.</p>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted">There is no plus. Open this address in Safari, tap Share, then tap the card at the top that says Add to your Home Screen. The next screen has Add in the corner.</p>
              <p className="mt-2 text-sm text-muted">Save a backup before you add it. An address typed in Safari does not move onto the icon.</p>
            </>
          )}
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={addToHome} className="min-h-11 flex-1 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy">
              Add
            </button>
            <button type="button" onClick={dismissInstall} className="min-h-11 rounded-full px-4 text-sm font-semibold text-ink">
              Not now
            </button>
          </div>
        </div>
      ) : null}
      </>) : null}
    </div>
  );
}
function Tool({ icon, title, detail, onClick }: { icon: ReactNode; title: string; detail: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-24 flex-col items-start gap-1 rounded-[20px] border border-line bg-sheet p-3 text-left">
      <span className="grid size-9 place-items-center rounded-xl bg-paper text-ok">{icon}</span>
      <span className="text-[15px] font-semibold leading-tight text-ink">{title}</span>
      <span className="text-sm leading-snug text-muted">{detail}</span>
    </button>
  );
}

function TrailerMark() {
  const photoId = useApp((s) => s.photoId);
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (!photoId) {
      setUrl(null);
      return;
    }
    let alive = true;
    let object = "";
    void getFile(photoId).then((blob) => {
      if (!alive || !blob) return;
      object = URL.createObjectURL(blob);
      setUrl(object);
    });
    return () => {
      alive = false;
      if (object) URL.revokeObjectURL(object);
    };
  }, [photoId]);

  async function onPick(file: File | undefined) {
    if (!file) return;
    setErr("");
    try {
      const prepared = await prepareFile(file);
      if (!prepared.mime.startsWith("image/")) {
        setErr("Use a photo.");
        return;
      }
      const nextId = crypto.randomUUID();
      await putFile(nextId, prepared.blob);
      useApp.getState().setTrailerPhoto(nextId);
    } catch (error) {
      setErr(error instanceof Error && error.message === "heic"
        ? "This photo is HEIC. Set the iPhone camera to Most Compatible, or choose a JPEG."
        : "That photo couldn't be saved.");
    }
  }

  return (
    <div className="shrink-0">
      <label className="block w-[9.25rem] cursor-pointer">
        <span className="grid h-20 w-[9.25rem] place-items-center overflow-hidden rounded-2xl bg-paper text-muted">
          {url ? <img src={url} alt="" className="size-full object-cover" /> : <Camera className="size-7" aria-hidden />}
        </span>
        {url ? null : (
          <>
            <span className="mt-1 block text-[13px] font-semibold text-muted">Add a photo</span>
            <span className="mt-0.5 block text-[13px] leading-snug text-muted">Stays on this phone. It is not uploaded.</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label={url ? "Trailer photo. It stays on this phone." : "Add a trailer photo. It stays on this phone."}
          onChange={(e) => {
            void onPick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {url ? (
        <button type="button" className="mt-1 text-[13px] font-semibold text-muted" onClick={() => useApp.getState().setTrailerPhoto(null)}>
          Remove
        </button>
      ) : null}
      {err ? <p className="mt-1 max-w-[150px] text-[13px] font-semibold text-stop">{err}</p> : null}
    </div>
  );
}
