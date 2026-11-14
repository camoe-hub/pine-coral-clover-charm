import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const store = await server.ssrLoadModule("/src/lib/store.ts");
const coach = await server.ssrLoadModule("/src/data/coach.ts");
const figures = await server.ssrLoadModule("/src/data/figures.ts");
const schedule = await server.ssrLoadModule("/src/data/schedule.ts");
const procedures = await server.ssrLoadModule("/src/data/procedures.ts");
const search = await server.ssrLoadModule("/src/data/search.ts");
const models = await server.ssrLoadModule("/src/data/models.ts");
const causes = await server.ssrLoadModule("/src/data/causes.ts");
const symptomsMod = await server.ssrLoadModule("/src/data/symptoms.ts");
const flowsMod = await server.ssrLoadModule("/src/data/flows.ts");
const manuals = await server.ssrLoadModule("/src/data/manuals.ts");
const embedder = await server.ssrLoadModule("/src/lib/preview-embedder-origin.ts");
const headers = await server.ssrLoadModule("/src/lib/security-headers.ts");
const weights = await server.ssrLoadModule("/src/lib/weights.ts");
const calendar = await server.ssrLoadModule("/src/lib/calendar.ts");
const sheets = await server.ssrLoadModule("/src/data/circuit-sheets.ts");
const remind = await server.ssrLoadModule("/src/lib/remind.ts");
const backup = await server.ssrLoadModule("/src/lib/backup.ts");
const httpsRedirect = await server.ssrLoadModule("/src/lib/https-redirect.ts");
const hostileRaw = readFileSync(new URL("./fixtures/hostile-backup.json", import.meta.url), "utf8");

test.after(async () => {
  await server.close();
});

function isoDaysAgo(days) {
  return isoShift(0, -days);
}

function isoShift(years, days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setFullYear(d.getFullYear() + years);
  d.setDate(d.getDate() + days);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

test("due dates follow miles or time, whichever the cadence asks for", () => {
  const { dueOf } = store;
  assert.equal(dueOf({ type: "trip" }, undefined, 0), "trip");
  assert.equal(dueOf({ type: "days", every: 30 }, undefined, 100), "unset");
  assert.equal(dueOf({ type: "days", every: 30 }, { iso: isoDaysAgo(1), miles: 0 }, 100), "ok");
  assert.equal(dueOf({ type: "days", every: 30 }, { iso: isoDaysAgo(30), miles: 0 }, 100), "due");
  assert.equal(dueOf({ type: "days", every: 30 }, { iso: isoDaysAgo(40), miles: 0 }, 100), "due");
  assert.equal(dueOf({ type: "miles", every: 1000 }, { iso: isoDaysAgo(0), miles: 1000 }, 1500), "ok");
  assert.equal(dueOf({ type: "miles", every: 1000 }, { iso: isoDaysAgo(0), miles: 1000 }, 2500), "due");
  assert.equal(
    dueOf({ type: "miles", every: 10000, alsoDays: 60 }, { iso: isoDaysAgo(70), miles: 1000 }, 1100),
    "due",
  );
  assert.equal(dueOf({ type: "years", every: 1 }, { iso: isoShift(-1, 0), miles: 0 }, 0), "due");
  assert.equal(dueOf({ type: "years", every: 1 }, { iso: isoShift(-1, 1), miles: 0 }, 0), "ok");
});

test("next due is the upcoming date or miles, and not a date that already passed", async () => {
  const { dueOf, nextDue, pickNextTask } = store;
  const date = await server.ssrLoadModule("/src/lib/date.ts");
  const marked = { iso: isoDaysAgo(0), miles: 1000 };
  const upcoming = date.shiftIso(marked.iso, 14);
  assert.equal(nextDue({ type: "days", every: 14 }, marked, 1000), `Next ${date.formatWhen(upcoming)}`);
  assert.equal(dueOf({ type: "days", every: 14 }, { iso: isoDaysAgo(14), miles: 0 }, 1000), "due");
  assert.equal(nextDue({ type: "days", every: 14 }, { iso: isoDaysAgo(14), miles: 0 }, 1000), null);
  assert.equal(
    nextDue({ type: "miles", every: 1000 }, { iso: isoDaysAgo(1), miles: 1000 }, 1500),
    `Next ${(2000).toLocaleString()} mi · ${(500).toLocaleString()} left`,
  );
  assert.equal(nextDue({ type: "miles", every: 1000 }, { iso: isoDaysAgo(0), miles: 1000 }, 2000), null);
  assert.equal(dueOf({ type: "miles", every: 1000 }, undefined, 0), "unset");
  assert.equal(dueOf({ type: "miles", every: 1000 }, undefined, 100), "unset");
  assert.equal(dueOf({ type: "miles", every: 1000 }, undefined, 1000), "unset");
  assert.equal(nextDue({ type: "miles", every: 1000 }, undefined, 100), null);
  const milePick = pickNextTask(
    [
      { id: "far", cadence: { type: "miles", every: 12000, alsoDays: 365 }, mark: undefined },
      { id: "mid", cadence: { type: "miles", every: 10000, alsoDays: 180 }, mark: undefined },
      { id: "near", cadence: { type: "miles", every: 1000, alsoDays: 60 }, mark: undefined },
    ],
    100,
  );
  assert.equal(milePick, null);
  assert.equal(nextDue({ type: "miles", every: 1000 }, { iso: isoDaysAgo(1), miles: 0 }, 5000), null);
  const both = nextDue({ type: "miles", every: 10000, alsoDays: 60 }, { iso: isoDaysAgo(10), miles: 1000 }, 1500);
  assert.equal(both.includes("left or "), true);
  assert.equal(nextDue({ type: "trip" }, marked, 1000), null);
  const picked = pickNextTask(
    [
      { id: "later", cadence: { type: "days", every: 90 }, mark: marked },
      { id: "sooner", cadence: { type: "days", every: 14 }, mark: marked },
      { id: "over", cadence: { type: "days", every: 30 }, mark: { iso: isoDaysAgo(40), miles: 0 } },
      { id: "trip", cadence: { type: "trip" }, mark: marked },
    ],
    1000,
  );
  assert.equal(picked.id, "over");
  assert.equal(picked.why, "due");
  const upcomingPick = pickNextTask(
    [
      { id: "later", cadence: { type: "days", every: 90 }, mark: marked },
      { id: "sooner", cadence: { type: "days", every: 14 }, mark: marked },
    ],
    1000,
  );
  assert.equal(upcomingPick.id, "sooner");
  assert.equal(upcomingPick.why, "next");
  const closer = pickNextTask(
    [
      { id: "window", cadence: { type: "days", every: 90 }, mark: { iso: isoDaysAgo(70), miles: 0 } },
      { id: "fortnight", cadence: { type: "days", every: 14 }, mark: marked },
    ],
    0,
  );
  assert.equal(closer.id, "fortnight");
});

test("wheel retorque counts 5, 10, 25, and 50 miles, then clears", () => {
  const { retorqueDue, retorqueWatch, settledWheel } = store;
  assert.deepEqual(
    retorqueDue(100, 100).map((row) => row.miles),
    [5, 10, 25, 50],
  );
  assert.deepEqual(
    retorqueDue(100, 110).map((row) => row.miles),
    [25, 50],
  );
  assert.equal(retorqueDue(100, 110)[0].left, 15);
  assert.equal(settledWheel(100, 249), 100);
  assert.equal(settledWheel(100, 250), null);
  assert.equal(settledWheel("no", 10), null);
  const at100 = retorqueWatch(null, 100, false);
  assert.equal(at100.start, 0);
  assert.deepEqual(
    at100.missed.map((row) => row.miles),
    [5, 10, 25, 50],
  );
  assert.equal(at100.upcoming.length, 0);
  assert.equal(retorqueWatch(null, 100, true).start, null);
  assert.equal(retorqueWatch(null, 200, false).start, null);
  const atWheel = retorqueWatch(200, 200, false, 0);
  assert.equal(atWheel.current, 5);
  assert.equal(atWheel.upcoming[0].left, 5);
  const afterFive = retorqueWatch(200, 200, true, 5);
  assert.equal(afterFive.current, 10);
  assert.equal(afterFive.upcoming[0].miles, 10);
  assert.equal(afterFive.upcoming[0].left, 10);
  assert.equal(retorqueWatch(200, 200, true, 50).start, null);
  const afterTrip = retorqueWatch(1000, 1100, false);
  assert.equal(afterTrip.start, 1000);
  assert.deepEqual(
    afterTrip.missed.map((row) => row.miles),
    [5, 10, 25, 50],
  );
  assert.equal(retorqueWatch(1000, 1200, false).start, null);
});

test("VIN year uses position 10 and the 2010 cycle when position 7 is a letter", () => {
  const { vinYear } = coach;
  assert.equal(vinYear(""), null);
  assert.equal(vinYear("12345"), null);
  assert.equal(vinYear("123456VxxVxxxxxxx"), 2027);
  assert.equal(vinYear("123456VxxTxxxxxxx"), 2026);
  assert.equal(vinYear("1234567xx6xxxxxxx"), 2006);
});

test("this edition ships no coach drawings", () => {
  assert.equal(figures.figures.length, 0);
  assert.equal(figures.figureById("p14-1"), undefined);
  assert.equal(figures.figureForCoach("p26-1", { family: "Classic", alde: true }), false);
});

test("every schedule procedure exists, including winterize", () => {
  const ids = new Set(procedures.procedures.map((p) => p.id));
  assert.equal(ids.has("winterize"), true);
  const winter = schedule.tasks.find((t) => t.procedureId === "winterize");
  assert.ok(winter);
  for (const task of schedule.tasks) {
    if (task.procedureId) assert.equal(ids.has(task.procedureId), true, task.id);
  }
});

test("search keeps short words, codes, and the selected coach apart", () => {
  const gt = models.modelById("g27");
  const classic = models.modelById("c28");
  const titles = (q, model) => search.searchAll(q, model).map((h) => `${h.kicker} ${h.title}`);
  const gfci = titles("GFCI", gt).join("\n");
  assert.equal(/alde/i.test(gfci), false);
  assert.equal(gfci.includes("No 120 V, breaker trips, or GFCI"), true);
  const e1 = titles("E1", gt).join("\n");
  assert.equal(/\bE10\b/.test(e1), false);
  assert.equal(/progressive industries/i.test(e1), false);
  assert.equal(/alde/i.test(e1), false);
  const open = titles("E1", models.modelById("other")).join("\n");
  assert.equal(/\bE10\b/.test(open), false);
  assert.equal(open.includes("E1"), true);
  const flashes = search.searchAll("2 flashes", gt, 2025);
  assert.equal(flashes[0]?.to.name, "codes");
  assert.equal(flashes[0]?.title, "2 flashes");
  assert.equal(flashes.some((hit) => hit.title === "3 flashes"), false);
  const err = search.searchAll("Err 21", models.modelById("other"));
  assert.equal(err[0]?.title, "Err 21");
  const gas = search.searchAll("Gas failure", classic, 2017);
  assert.equal(gas.some((hit) => hit.kicker === "Alde 3030"), false);
  assert.equal(gas.some((hit) => hit.kicker === "Alde 3010" && hit.title === "Gas failure"), true);
  assert.equal(err.some((hit, i) => hit.title === "21" && i < err.findIndex((row) => row.title === "Err 21")), false);
  const air = titles("air", gt).join("\n");
  assert.equal(/trailer/i.test(air), false);
  assert.equal(/condition/i.test(air), true);
  assert.equal(titles("ac", gt).some((t) => /condition/i.test(t)), true);
  assert.equal(titles("glycol", gt).some((t) => /alde/i.test(t)), false);
  assert.equal(titles("glycol", classic).some((t) => /alde/i.test(t)), true);
  const pump = titles("pump", gt).slice(0, 4).join("\n");
  assert.equal(/pump/i.test(pump), true);
  assert.equal(/E9/.test(pump.split("\n")[0]), false);
  const cold = titles("fridge not cold", classic);
  const warmAt = cold.findIndex((t) => t.includes("Fridge warm"));
  const flashAt = cold.findIndex((t) => t.includes("Fridge controller light"));
  assert.ok(warmAt >= 0, cold.join("\n"));
  if (flashAt >= 0) assert.ok(warmAt < flashAt, cold.join("\n"));
  const cooling = titles("fridge not cooling", classic);
  assert.equal(cooling.findIndex((t) => t.includes("Fridge warm")) >= 0, true);
  assert.equal(coach.procedureFits("tpms", classic, 2027), true);
  assert.equal(coach.procedureFits("tpms", classic, null), true);
  assert.equal(coach.procedureFits("tpms", classic, 2026), false);
  assert.equal(coach.procedureFits("tpms", gt, 2027), false);
  assert.equal(search.searchAll("TPMS", classic, 2026).some((h) => h.to.id === "tpms" || h.to.id === "maint-tpms"), false);
  assert.equal(search.searchAll("TPMS", classic, 2027).some((h) => h.to.id === "tpms"), true);
  const e4 = search.searchAll("E4", gt, 2024);
  assert.equal(e4.some((h) => h.detail.includes("Dometic")), true);
  assert.equal(e4.some((h) => h.detail.includes("Fogatti")), true);
  assert.equal(e4.some((h) => h.kicker === "Not on this coach"), true);
  const fridge = search.searchAll("fridge", classic, 2024);
  assert.equal(fridge[0]?.kicker, "Flowchart");
  const heater = search.searchAll("water heater", classic, 2024);
  assert.equal(heater[0]?.to.name, "flow");
});

test("a winterize mistake opens the spring flowchart, not the blow-out steps", () => {
  const row = causes.causes.find((c) => c.id === "winter-bypass");
  assert.deepEqual(row.to, { name: "flow", id: "winter" });
  const hot = flowsMod.flows.find((f) => f.id === "hot");
  assert.equal(hot.nodes["alde-instead"].title.includes("Only a Classic"), true);
});

function restoreHostile() {
  const result = store.useApp.getState().importBackup(hostileRaw);
  assert.equal(result.ok, true);
  assert.equal(result.apply(), true);
  return result;
}

test("https://grok.com may embed the book", () => {
  assert.equal(embedder.isGrokEmbedderOrigin("https://grok.com"), true);
});

test("an https grok.com subdomain may embed the book", () => {
  assert.equal(embedder.isGrokEmbedderOrigin("https://preview.grok.com"), true);
});

test("http://grok.com may not embed the book", () => {
  assert.equal(embedder.isGrokEmbedderOrigin("http://grok.com"), false);
});

test("a site that only looks like grok.com may not embed the book", () => {
  assert.equal(embedder.isGrokEmbedderOrigin("https://grok.com.evil.test"), false);
  assert.equal(embedder.isGrokEmbedderOrigin("https://notgrok.com"), false);
});

test("the local editor may still embed over http", () => {
  assert.equal(embedder.isGrokEmbedderOrigin("http://localhost:8080"), true);
  assert.equal(embedder.isGrokEmbedderOrigin("http://127.0.0.1:8080"), true);
});

test("an http page may not drive a sandbox preview", () => {
  assert.equal(embedder.resolveParentEmbedderOrigin(false, "http://evil.example/", null, "app.grok-sandbox.com"), null);
});

test("an https grok.com page may drive a sandbox preview", () => {
  assert.equal(
    embedder.resolveParentEmbedderOrigin(false, "https://grok.com/chat", null, "app.grok-sandbox.com"),
    "https://grok.com",
  );
});

test("security headers frame the book from grok.com and do not load Google fonts", () => {
  const dev = headers.securityHeaders(false);
  const prod = headers.securityHeaders(true);
  assert.equal(headers.documentCsp(true).includes("frame-ancestors"), false);
  assert.match(dev["Content-Security-Policy"], /frame-ancestors https:\/\/grok\.com https:\/\/\*\.grok\.com/);
  assert.equal(dev["X-Frame-Options"], undefined);
  assert.equal(dev["X-Content-Type-Options"], "nosniff");
  assert.equal(dev["Strict-Transport-Security"], undefined);
  assert.match(prod["Strict-Transport-Security"], /max-age=/);
  assert.match(dev["Content-Security-Policy"], /https:\/\/grok\.com/);
  assert.doesNotMatch(dev["Content-Security-Policy"], /fonts\.google/);
  assert.match(dev["Content-Security-Policy"], /unsafe-eval/);
  assert.doesNotMatch(prod["Content-Security-Policy"], /unsafe-eval/);
  assert.match(dev["Permissions-Policy"], /geolocation=\(self\)/);
  assert.doesNotMatch(dev["Permissions-Policy"], /geolocation=\(\)[^-]/);
  const prodScript = prod["Content-Security-Policy"].split(";").map((part) => part.trim()).find((part) => part.startsWith("script-src "));
  const prodConnect = prod["Content-Security-Policy"].split(";").map((part) => part.trim()).find((part) => part.startsWith("connect-src "));
  assert.match(prodScript, /unsafe-inline/);
  assert.doesNotMatch(prodScript, /grok\.com/);
  assert.equal(prodConnect, "connect-src 'self'");
  assert.equal(readFileSync(new URL("../src/routes/__root.tsx", import.meta.url), "utf8").includes("theme-boot.js"), true);
  assert.equal(readFileSync(new URL("../src/routes/__root.tsx", import.meta.url), "utf8").includes("THEME_BOOT"), false);
});

test("a hostile backup does not keep prototype coach names", () => {
  restoreHostile();
  const coaches = store.useApp.getState().coaches;
  assert.equal(Object.hasOwn(coaches, "__proto__"), false);
  assert.equal(Object.hasOwn(coaches, "constructor"), false);
  assert.equal(Object.hasOwn(coaches, "prototype"), false);
  assert.equal(Object.getPrototypeOf(coaches), Object.prototype);
});

test("an imported dealer address is capped at 120 characters", () => {
  restoreHostile();
  assert.equal(store.useApp.getState().coaches.c28.dealerAddress.length, 120);
  assert.equal(store.useApp.getState().dealerAddress.length, 120);
});

test("an imported backup brings in at most 20 coaches", () => {
  restoreHostile();
  const ids = Object.keys(store.useApp.getState().coaches);
  assert.equal(store.MAX_IMPORT_COACHES, 20);
  assert.equal(ids.includes("n19"), true);
  assert.equal(ids.includes("n20"), false);
  const brought = ids.filter((id) => id === "c28" || /^n\d\d$/.test(id));
  assert.ok(brought.length <= 20);
  assert.equal(brought.length, 20);
});

test("a hostile maintenance mark does not replace the record prototype", () => {
  restoreHostile();
  const coach = store.useApp.getState().coaches.c28;
  assert.equal(Object.getPrototypeOf(coach.done), Object.prototype);
  assert.equal(Object.hasOwn(coach.done, "__proto__"), false);
  assert.equal(coach.done.tires.iso, "2026-02-02");
  assert.equal(coach.listDone.winter, "2026-04-04");
  assert.equal(Object.hasOwn(coach.listDone, "__proto__"), false);
  assert.equal(Object.prototype.polluted, undefined);
});

test("hostile checklist keys are skipped", () => {
  restoreHostile();
  const checks = store.useApp.getState().coaches.c28.checks;
  assert.equal(Object.hasOwn(checks, "constructor"), false);
  assert.equal(checks.winter.hoses, true);
  assert.equal(Object.hasOwn(checks.winter, "prototype"), false);
});

test("a hostile backup does not restore a prototype file or an html file", () => {
  const result = restoreHostile();
  assert.equal(result.files.some((file) => file.id === "__proto__"), false);
  assert.equal(result.files.some((file) => file.mime === "text/html"), false);
});

test("hostile weight-ticket keys are skipped", () => {
  const cleaned = weights.backupWeights(JSON.parse(hostileRaw).weights);
  assert.deepEqual(Object.keys(cleaned), ["c28"]);
  assert.equal(cleaned.c28.note, "scale");
  const merged = weights.mergeWeightsFile({ g25: { note: "keep" } }, JSON.parse(hostileRaw).weights);
  assert.equal(merged.g25.note, "keep");
  assert.equal(Object.hasOwn(merged, "constructor"), false);
  assert.equal(Object.hasOwn(merged, "__proto__"), false);
  assert.equal(Object.prototype.polluted, undefined);
});

test("each manual file is listed once, and motorhome books for Atlas, Interstate, Rangeline, Land Yacht, and the pushers are not in the list", () => {
  const urls = manuals.manualLinks.map((m) => m.url);
  assert.equal(new Set(urls).size, urls.length);
  const blob = (m) => `${m.title} ${m.url}`.toLowerCase();
  assert.equal(manuals.manualLinks.some((m) => /atlas|interstate|rangeline|land yacht|diesel pusher|sky deck|avenue|parkway|westfalia|a series/.test(blob(m))), false);
  assert.equal(manuals.manualLinks.some((m) => /\b390\b|\b360[\s-]*xc\b|tommy bahama tc\b|touring-coach-tommy|350 xl|350-series|350-355/.test(blob(m))), false);
  assert.equal(manuals.manualLinks.some((m) => m.brand === "Touring Coach"), false);
  assert.equal(manuals.manualLinks.some((m) => /tommy bahama tt|travel-trailer-tommy/.test(blob(m))), true);
  assert.equal(manuals.manualLinks.some((m) => /international/i.test(m.title)), true);
  const y2027 = manuals.manualLinks.filter((m) => m.year === 2027);
  assert.equal(y2027.length, 13);
  assert.equal(y2027.every((m) => m.year === 2027), true);
  assert.equal(y2027.some((m) => /2024|2025/.test(m.url)), false);
});

test("undo after a full service log puts the oldest entry and its files back", async () => {
  const task = schedule.tasks.find((t) => t.cadence.type === "days");
  assert.ok(task);
  const oldest = {
    id: "old-full-log",
    iso: "2020-01-01",
    miles: 1,
    note: "oldest photo",
    files: [{ id: "file-old", name: "a.jpg", mime: "image/jpeg" }],
  };
  const rest = Array.from({ length: 199 }, (_, i) => ({
    id: `full-${i}`,
    iso: "2024-01-01",
    miles: 10,
    note: `entry ${i}`,
  }));
  store.useApp.setState({ log: [...rest, oldest], done: {}, odometer: 1000 });
  await store.useApp.getState().markDone(task.id, task.title);
  const mid = store.useApp.getState().log;
  assert.equal(mid.length, 200);
  assert.equal(mid.some((entry) => entry.id === oldest.id), false);
  assert.equal(mid[0].note, task.title);
  store.useApp.getState().runUndo();
  const after = store.useApp.getState().log;
  assert.equal(after.some((entry) => entry.note === task.title), false);
  const back = after.find((entry) => entry.id === oldest.id);
  assert.ok(back);
  assert.equal(back.files[0].id, "file-old");
  assert.equal(back.files[0].mime, "image/jpeg");
});

test("undo puts a removed service note back where it was", async () => {
  const log = [
    { id: "order-a", iso: "2024-01-01", miles: 1, note: "first" },
    { id: "order-b", iso: "2024-02-01", miles: 2, note: "middle" },
    { id: "order-c", iso: "2024-03-01", miles: 3, note: "last" },
  ];
  store.useApp.setState({ log, done: {} });
  await store.useApp.getState().removeLog("order-b");
  assert.deepEqual(
    store.useApp.getState().log.map((entry) => entry.id),
    ["order-a", "order-c"],
  );
  store.useApp.getState().runUndo();
  assert.deepEqual(
    store.useApp.getState().log.map((entry) => entry.id),
    ["order-a", "order-b", "order-c"],
  );
});

test("a restore keeps a photo that is only on an unsaved log note", () => {
  const raw = JSON.stringify({
    version: 1,
    modelId: "c28",
    coaches: {
      c28: {
        log: [],
        logDraft: {
          note: "unsaved leak",
          job: "",
          files: [{ id: "draft-photo", name: "leak.jpg", mime: "image/jpeg" }],
        },
      },
    },
    files: {
      "draft-photo": { mime: "image/jpeg", data: "abc" },
      stray: { mime: "image/jpeg", data: "nope" },
    },
  });
  const result = store.useApp.getState().importBackup(raw);
  assert.equal(result.ok, true);
  assert.equal(result.files.some((file) => file.id === "draft-photo"), true);
  assert.equal(result.files.some((file) => file.id === "stray"), false);
  assert.equal(result.apply(), true);
  const draft = store.useApp.getState().logDraft;
  assert.equal(draft.note, "unsaved leak");
  assert.equal(draft.files[0].id, "draft-photo");
});

test("symptom text has no invisible delete characters", () => {
  const raw = readFileSync(new URL("../src/data/extra-symptoms.json", import.meta.url), "utf8");
  assert.equal(raw.includes("\u007f"), false);
  const row = JSON.parse(raw).find((item) => item.id === "x-dometic-fridge-and-roof-ac-answers-from-a-certif");
  assert.ok(row);
  const action = row.checks.map((check) => check.action).join("\n");
  assert.equal(action.includes("68 Overlander"), true);
  assert.equal(action.includes("RM2652/2662"), true);
  assert.equal(action.includes("\u007f"), false);
});

test("plain http redirects to https, and local http stays", () => {
  const { httpsLocation } = httpsRedirect;
  assert.equal(httpsLocation("http", "book.example", "/fix", "?q=1"), "https://book.example/fix?q=1");
  assert.equal(httpsLocation("https", "book.example", "/", ""), null);
  assert.equal(httpsLocation("http, https", "book.example", "/", ""), null);
  assert.equal(httpsLocation("http", "localhost:8080", "/", ""), null);
  assert.equal(httpsLocation("http", "127.0.0.1:8080", "/", ""), null);
  assert.equal(httpsLocation("http", "[::1]:8080", "/", ""), null);
  assert.equal(httpsLocation("http", "evil.com\r\nSet-Cookie: a", "/", ""), null);
});

test("a backup nudge waits for a real record, and a dismissal holds", () => {
  const { copyNudgeOn } = store;
  const today = "2026-11-01";
  assert.equal(copyNudgeOn(0, "", today, null), false);
  assert.equal(copyNudgeOn(1, "", today, null), true);
  assert.equal(copyNudgeOn(3, "", today, { edits: 3, iso: today }), false);
  assert.equal(copyNudgeOn(13, "", today, { edits: 3, iso: today }), true);
  assert.equal(copyNudgeOn(3, "", "2026-11-15", { edits: 3, iso: today }), true);
  assert.equal(copyNudgeOn(1, today, today, null), false);
  assert.equal(copyNudgeOn(1, "2026-10-19", today, null), false);
  assert.equal(copyNudgeOn(1, "2026-10-18", today, null), true);
});

test("miles, a log line, a mark, a note, and a photo each count as a record", () => {
  const { countCoachEdits } = store;
  assert.equal(countCoachEdits({}), 0);
  assert.equal(countCoachEdits({ odometer: 100 }), 1);
  assert.equal(countCoachEdits({ log: [{ files: [{}] }] }), 2);
  assert.equal(countCoachEdits({ done: { a: {}, b: {} }, notes: [{}], photoId: "p" }), 4);
});

test("an older save is a chosen coach only when it is not the untouched Classic", () => {
  const { coachWasChosen } = store;
  assert.equal(coachWasChosen("c28", null, "", undefined), false);
  assert.equal(coachWasChosen("c28", null, "", false), false);
  assert.equal(coachWasChosen("c28", null, "", true), true);
  assert.equal(coachWasChosen("g25", null, "", undefined), true);
  assert.equal(coachWasChosen("c28", 2019, "", undefined), true);
  assert.equal(coachWasChosen("c28", null, "1AB", undefined), true);
});

test("a saved scale weight counts as a ticket, and an empty form does not", () => {
  assert.equal(weights.savedTicketCount(null), 0);
  assert.equal(weights.savedTicketCount({ c28: { trailerName: "Classic", truckFront: "" } }), 0);
  assert.equal(weights.savedTicketCount({ c28: { truckFront: "4200" } }), 1);
  assert.equal(weights.savedTicketCount({ c28: { truckFront: "1" }, nope: "x" }), 1);
});

test("a scale ticket splits tongue, transfer, and payload", () => {
  const result = weights.weigh(
    { steer: 4000, drive: 3500, trailer: null },
    { steer: 3700, drive: 4700, trailer: 6400 },
    { steer: 4000, drive: 4500, trailer: 6300 },
    { steer: 5500, drive: 6200, gvw: 10000, payload: 2200, gcwr: 20000, trailer: 8800, tongue: 1000, factory: 6500 },
  );
  assert.equal(result.truck.gvw.actual, 7500);
  assert.equal(result.truck.factory, 7800);
  assert.equal(result.truck.payload.actual, -300);
  assert.equal(result.trailer.tongue.actual, 900);
  assert.equal(result.trailer.weight.actual, 7300);
  assert.equal(result.trailer.xfer, -100);
  assert.equal(result.trailer.tongueOnTruck, 1000);
  const hitch = weights.weightDistribution(
    { steer: 4000, drive: 3500, trailer: null },
    { steer: 3700, drive: 4700, trailer: 6400 },
    { steer: 4000, drive: 4500, trailer: 6300 },
  );
  assert.equal(hitch.lostFront, 300);
  assert.equal(hitch.restoredFront, 300);
  assert.equal(result.trailer.cargo.actual, 800);
  assert.equal(result.noWd.gcw.actual, 14800);
  assert.equal(result.wd.gcw.actual, 14800);
  assert.equal(weights.scaleProblems(result).block, null);
});

test("calendar dates are one-time, and mile-only jobs stay out", () => {
  const rows = [
    { id: "filter", title: "Filter, rinse", cadence: { type: "days", every: 14 } },
    { id: "miles", title: "Rotate", cadence: { type: "miles", every: 10000 } },
    { id: "both", title: "Window and hitch", cadence: { type: "miles", every: 1000, alsoDays: 60 } },
    { id: "lugs", title: "Re-torque the lugs", cadence: { type: "trip" } },
    { id: "open", title: "Unset", cadence: { type: "days", every: 30 } },
  ];
  const done = {
    filter: { iso: "2026-11-01", miles: 0 },
    miles: { iso: "2026-11-01", miles: 1000 },
    both: { iso: "2026-11-01", miles: 1000 },
    lugs: { iso: "2026-11-01", miles: 0 },
  };
  const jobs = calendar.datedJobs(rows, done);
  assert.deepEqual(jobs.map((job) => job.id), ["filter", "both"]);
  assert.equal(jobs[0].date, "2026-11-15");
  assert.equal(jobs[1].date, "2026-12-31");
  const file = calendar.icsFor(jobs, "20261101T180000Z");
  assert.equal(file.includes("RRULE"), false);
  assert.equal(file.includes("DTSTART;VALUE=DATE:20261115"), true);
  assert.equal(file.includes("DTEND;VALUE=DATE:20270101"), true);
  assert.equal(file.includes("SUMMARY:Filter\\, rinse"), true);
  const unfolded = file.replace(/\r\n[ \t]/g, "");
  assert.equal(unfolded.includes("mile interval is not on this calendar"), true);
  assert.equal(unfolded.includes("UID:rivetcare-filter-20261115@rivetcare"), true);
  for (const line of file.split("\r\n")) {
    if (line) assert.ok(Buffer.byteLength(line) <= 75, line);
  }
  const early = calendar.datedJobs(rows, { ...done, filter: { iso: "2026-11-10", miles: 0 } });
  assert.equal(early.find((job) => job.id === "filter").date, "2026-11-24");
});

test("the breaker lists are not in this edition", () => {
  assert.equal(sheets.circuitSheet("p92-1"), null);
  assert.equal(sheets.circuitSheet("p93-1"), null);
});

test("a saved book comes back with the same miles, note, year, and scale weight", () => {
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (key) => (mem.has(key) ? mem.get(key) : null),
    setItem: (key, value) => mem.set(key, String(value)),
    removeItem: (key) => mem.delete(key),
  };
  globalThis.window = globalThis;
  const before = store.useApp.getState();
  before.setNickname("Round Trip");
  before.setOdo(12400);
  before.setModelYear(2019);
  assert.equal(store.useApp.getState().addNote("spare key in the truck"), true);
  const id = store.useApp.getState().modelId;
  const head = backup.backupHead(store.useApp.getState());
  const raw = JSON.stringify({ ...head, files: {}, weights: { [id]: { truckFront: "4200" } } });
  store.useApp.getState().setNickname("Changed");
  store.useApp.getState().setOdo(5);
  store.useApp.getState().setModelYear(2024);
  const imported = store.useApp.getState().importBackup(raw);
  assert.equal(imported.ok, true);
  assert.equal(imported.apply(), true);
  const after = store.useApp.getState();
  assert.equal(after.modelId, id);
  assert.equal(after.nickname, "Round Trip");
  assert.equal(after.odometer, 12400);
  assert.equal(after.modelYear, 2019);
  assert.equal(after.notes.some((note) => note.text === "spare key in the truck"), true);
  assert.equal(weights.readWeightsFile()?.[id]?.truckFront, "4200");
});

test("phone reminders stay off until the installed app can ask", () => {
  assert.equal(remind.reminderStatus({ notification: false, permission: "default", ios: true, installed: true }), "unsupported");
  assert.equal(remind.reminderStatus({ notification: true, permission: "default", ios: true, installed: false }), "needs-install");
  assert.equal(remind.reminderStatus({ notification: true, permission: "default", ios: false, installed: false }), "default");
  assert.equal(remind.reminderStatus({ notification: true, permission: "granted", ios: true, installed: true }), "granted");
  assert.equal(remind.reminderStatus({ notification: true, permission: "denied", ios: false, installed: true }), "denied");
  assert.equal(remind.noticesAreOn("granted", null), true);
  assert.equal(remind.noticesAreOn("granted", "on"), true);
  assert.equal(remind.noticesAreOn("granted", "off"), false);
  assert.equal(remind.noticesAreOn("default", "on"), true);
  assert.equal(remind.noticesAreOn("unsupported", "on"), true);
  assert.equal(remind.noticesAreOn("needs-install", "off"), false);
  assert.equal(remind.noticesAreOn("denied", null), false);
});

test("a shared cause lands on that coach's check, and not on another trailer's heater", () => {
  const byId = (id) => models.models.find((model) => model.id === id);
  const classic = byId("c28");
  const trade = byId("tw25");
  const cloud = byId("fc25");
  const cause = (id) => causes.causes.find((row) => row.id === id);
  for (const row of causes.causes) {
    if (row.to.name !== "symptom") continue;
    const sy = symptomsMod.symptomById(row.to.id);
    assert.ok(sy, row.id);
    assert.ok(row.to.step >= 0 && row.to.step < sy.checks.length, `${row.id} step ${row.to.step}`);
  }
  assert.equal(cause("lp-supply").to.step, 1);
  assert.equal(cause("heater-code").to.step, 2);
  assert.equal(cause("low-tongue").to.step, 1);
  assert.equal(cause("grey-vent").to.step, 1);
  assert.equal(cause("bms-cutoff").to.id, "lithium-cold");
  assert.equal(cause("converter-setting").to.step, 4);
  assert.equal(causes.causeFits(cause("heater-code"), classic, 2027), false);
  assert.equal(causes.causeFits(cause("tank-sender"), classic, 2027), false);
  assert.equal(causes.causeFits(cause("heater-code"), trade, 2025), true);
  assert.equal(coach.symptomOn({ id: "tankless", system: "Water heater" }, trade, 2025), true);
  assert.equal(coach.symptomOn({ id: "tankless", system: "Water heater" }, classic, 2027), false);
  assert.equal(coach.symptomOn({ id: "pd-code", system: "Electrical" }, cloud, 2022), true);
  assert.equal(coach.symptomOn({ id: "pd-code", system: "Electrical" }, classic, 2027), false);
  assert.equal(coach.symptomOn({ id: "st-hot", system: "Water heater" }, trade, 2025), false);
  assert.equal(coach.symptomOn({ id: "alde", system: "Alde", fit: "classic" }, cloud, 2025), false);
  assert.equal(coach.symptomOn({ id: "furnace", system: "Furnace" }, cloud, 2025), true);
  assert.equal(coach.symptomOn({ id: "furnace", system: "Furnace" }, classic, 2027), false);
  assert.equal(coach.symptomOn({ id: "alde", system: "Alde", fit: "classic" }, classic, 2016), false);
  assert.equal(coach.flowFits({ id: "alde-heat", fit: "classic" }, cloud, 2025), false);
  assert.equal(coach.flowFits({ id: "maint-truma" }, cloud, 2025), false);
  assert.equal(coach.flowFits({ id: "maint-recirc" }, cloud, 2025), false);
  assert.equal(coach.flowFits({ id: "furnace-flow" }, classic, 2027), false);
  assert.equal(coach.flowFits({ id: "alde-heat", fit: "classic" }, classic, 2027), true);
  assert.equal(coach.symptomOn({ id: "victron", system: "Electrical", title: "Victron" }, cloud, 2022), false);
  assert.equal(coach.symptomOn({ id: "victron", system: "Electrical", title: "Victron" }, trade, 2025), true);
  assert.equal(coach.symptomOn({ id: "app", system: "Electrical", fit: "classic" }, classic, 2024), false);
  assert.equal(coach.symptomOn({ id: "app", system: "Electrical", fit: "classic" }, classic, 2025), true);
  assert.equal(coach.symptomOn({ id: "footrest", system: "Body & gear", fit: "classic" }, classic, 2024), true);
  assert.equal(coach.symptomOn({ id: "footrest", system: "Body & gear", fit: "classic" }, classic, 2027), false);
  assert.equal(coach.symptomOn({ id: "ac-soft", system: "Air conditioning" }, trade, 2024), true);
  assert.equal(coach.symptomOn({ id: "ac-soft", system: "Air conditioning" }, trade, 2025), false);
  assert.equal(coach.symptomOn({ id: "x-girard", system: "Water heater", title: "Girard tankless" }, cloud, 2025), false);
  assert.equal(coach.symptomOn({ id: "x-girard", system: "Water heater", title: "Girard tankless" }, cloud, 2022), true);
  assert.equal(coach.procedureFits("anode", classic, 2016), false);
  const gt = byId("g27");
  assert.equal(coach.symptomOn({ id: "tankless", system: "Water heater", title: "Tankless" }, gt, 2027), true);
  assert.equal(coach.symptomOn({ id: "tankless", system: "Water heater", title: "Tankless" }, gt, null), true);
  assert.equal(coach.symptomOn({ id: "st-code", system: "Water heater" }, gt, 2027), false);
  assert.equal(coach.symptomOn({ id: "no-hot-tank", system: "Water heater" }, gt, 2027), false);
  assert.equal(coach.codeFits({ id: "girard", appliance: "Girard GSWH-2" }, gt, 2027), false);
  assert.equal(coach.symptomOn({ id: "tankless", system: "Water heater" }, gt, 2025), true);
  assert.equal(coach.symptomOn({ id: "st-hot", system: "Water heater" }, gt, 2025), true);
  assert.equal(coach.symptomOn({ id: "st-code", system: "Water heater" }, gt, 2022), false);
});

function memoryStorage() {
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (key) => (mem.has(key) ? mem.get(key) : null),
    setItem: (key, value) => mem.set(key, String(value)),
    removeItem: (key) => mem.delete(key),
  };
  globalThis.window = globalThis;
  return mem;
}

test("a stored null does not crash, and the raw text is kept", () => {
  const mem = memoryStorage();
  mem.set("rivetcare-v1", "null");
  assert.doesNotThrow(() => store.useApp.getState().hydrate());
  assert.equal(store.useApp.getState().toast.includes("could not be read"), true);
  assert.equal(store.useApp.getState().keptRaw, "null");
  store.useApp.getState().setOdo(10);
  assert.equal(store.useApp.getState().odometer, 0);
  assert.equal(mem.get("rivetcare-v1"), "null");
  assert.equal(mem.get("rivetcare-v1-unreadable"), "null");
});

test("a newer phone copy is not overwritten", () => {
  const mem = memoryStorage();
  const blob = JSON.stringify({ schema: 99, rev: 3, modelId: "c28", nickname: "Keep" });
  mem.set("rivetcare-v1", blob);
  store.useApp.getState().hydrate();
  assert.equal(store.useApp.getState().toast.includes("newer copy"), true);
  store.useApp.getState().setNickname("Lost");
  assert.equal(mem.get("rivetcare-v1"), blob);
});

test("a stale tab adopts the other tab instead of saving over it", () => {
  const mem = memoryStorage();
  mem.set("rivetcare-v1", JSON.stringify({ schema: 1, rev: 2, modelId: "c28", nickname: "A", ready: false, coaches: { c28: { odometer: 0, nickname: "A" } } }));
  store.useApp.getState().hydrate();
  assert.equal(store.useApp.getState().nickname, "A");
  mem.set("rivetcare-v1", JSON.stringify({ schema: 1, rev: 5, modelId: "c28", nickname: "B", ready: false, coaches: { c28: { odometer: 0, nickname: "B" } } }));
  store.useApp.getState().setNickname("C");
  assert.equal(store.useApp.getState().nickname, "B");
  assert.equal(JSON.parse(mem.get("rivetcare-v1")).nickname, "B");
  assert.equal(JSON.parse(mem.get("rivetcare-v1")).rev, 5);
});

test("a backup with no setup flag does not finish setup on an empty coach", () => {
  memoryStorage();
  const mem = globalThis.localStorage;
  mem.setItem("rivetcare-v1", JSON.stringify({ schema: 1, rev: 1, modelId: "c28", ready: false, coaches: { c28: { odometer: 0 } } }));
  store.useApp.getState().hydrate();
  assert.equal(store.useApp.getState().ready, false);
  const imported = store.useApp.getState().importBackup(JSON.stringify({ version: 1, modelId: "c28", coaches: { c28: { odometer: 0 } } }));
  assert.equal(imported.ok, true);
  assert.equal(imported.apply(), true);
  assert.equal(store.useApp.getState().ready, false);
  store.useApp.getState().setOdo(3);
  assert.equal(store.useApp.getState().odometer, 3);
});

test("a long photo id still matches, and a bad date or mileage is reported", () => {
  memoryStorage();
  const id = "p".repeat(90);
  const log = [{ iso: "not-a-date", note: "kept", miles: -4, files: [{ id, name: "a.jpg", mime: "image/jpeg" }] }];
  for (let i = 0; i < 200; i += 1) log.push({ iso: "2026-01-02", note: `line ${i}`, miles: 1 });
  const notes = [];
  for (let i = 0; i < 101; i += 1) notes.push({ id: `n${i}`, iso: "2026-01-02", text: `note ${i}` });
  const raw = JSON.stringify({
    version: 1,
    modelId: "c28",
    coaches: { c28: { odometer: -8, log, notes, done: { tires: { iso: "2026-02-31", miles: 10 } } } },
    files: { [id]: { mime: "image/jpeg", data: "aaaa" } },
  });
  const imported = store.useApp.getState().importBackup(raw);
  assert.equal(imported.ok, true);
  assert.equal(imported.files.some((file) => file.id === id), true);
  assert.equal(imported.notice.includes("log line"), true);
  assert.equal(imported.notice.includes("note past 100"), true);
  assert.equal(imported.notice.includes("set to today"), true);
  assert.equal(imported.notice.includes("mileage"), true);
  assert.equal(imported.apply(), true);
  const after = store.useApp.getState();
  assert.equal(after.odometer, 0);
  assert.equal(after.log.length, 200);
  assert.equal(/^\d{4}-\d{2}-\d{2}$/.test(after.log[0].iso), true);
  assert.equal(after.log[0].miles, 0);
  assert.equal(after.log[0].files[0].id, id);
  assert.equal(after.notes.length, 100);
  assert.equal(after.done.tires.iso, "2026-02-28");
  assert.equal(imported.notice.includes("corrected"), true);
});

test("a coupled ticket does not invent tongue weight, and it does not count the tongue twice", () => {
  const ticket = weights.explainTicket({
    coupled: { steer: 3200, drive: 3400, trailer: 5800 },
    truckOnly: 6200,
    trailerOnly: null,
    combinedTyped: 12800,
    barsOnCombined: null,
    ratings: { gvw: 10000, gcwr: 20000, trailer: 7600, tongue: 1000 },
    passName: "bars off",
  });
  assert.equal(ticket.gvw, 6600);
  assert.equal(ticket.combined, 12400);
  assert.equal(ticket.tongue, 400);
  assert.equal(ticket.loaded, 6200);
  assert.ok(Math.abs((ticket.share ?? 0) - 400 / 6200) < 0.000001);
  assert.ok(ticket.flags.some((flag) => flag.includes("counted twice")));
  const alone = weights.explainTicket({
    coupled: { steer: 3200, drive: 3400, trailer: 5800 },
    truckOnly: null,
    trailerOnly: null,
    combinedTyped: null,
    barsOnCombined: null,
    ratings: { gvw: null, gcwr: null, trailer: null, tongue: null },
    passName: "bars off",
  });
  assert.equal(alone.tongue, null);
  assert.ok(alone.flags.some((flag) => flag.includes("Truck-only")));
});

test("weight-distribution bars restore the front axle without changing total weight", () => {
  const hitch = weights.weightDistribution(
    { steer: 4000, drive: 3500, trailer: null },
    { steer: 3700, drive: 4700, trailer: 6400 },
    { steer: 4000, drive: 4500, trailer: 6300 },
  );
  assert.equal(hitch.lostFront, 300);
  assert.equal(hitch.restoredFront, 300);
  assert.equal(hitch.restoration, 1);
  assert.equal(hitch.rearChange, -200);
  assert.equal(hitch.trailerChange, -100);
  assert.equal(hitch.balance, 0);
});

test("a backup checksum matches the file that was signed, and a changed file does not", async () => {
  const look = await server.ssrLoadModule("/src/lib/backup-look.ts");
  const open = '{"version":1,"log":[]';
  const hash = await look.sha256Hex(open);
  const signed = `${open},"integrity":"${hash}"}`;
  assert.equal(await look.backupIntegrity(signed), "ok");
  assert.equal(await look.backupIntegrity(`${open}}`), "none");
  assert.equal(await look.backupIntegrity(signed.replace("log", "notes")), "bad");
  const summary = look.lookAtBackup(JSON.parse(signed), signed.length);
  assert.equal(summary.version, "1");
  assert.equal(summary.service, 0);
});




