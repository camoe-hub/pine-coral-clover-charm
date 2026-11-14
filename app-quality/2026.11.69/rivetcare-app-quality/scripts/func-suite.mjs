// RivetCare full functional suite (A: setup, trailer, photo, miles, schedule, checklist, notes, log; B: restore/undo, search, fix, codes, circuit tables, print, level, weights, shops, theme, ics/csv, reminders, coaches, delete-my-data).
// Usage: node func-suite.mjs [phone|desktop]. Fresh browser context, test data only, downloads saved locally. Needs test-photo.jpg/test-photo2.jpg in /workspace/app-quality/r9/harness (or edit IMG).
import { open } from "/workspace/shared/app-quality/scripts/func-lib.mjs";
import fs from "node:fs";
const vp = process.argv[2] || "phone";
const out = "/workspace/shared/app-quality/r9-evidence/func";
const T = await open({ vp, out, extra: { permissions: ["geolocation","notifications"], geolocation: { latitude: 39.7392, longitude: -104.9903 } } });
const { page: p, step, go, state, idbCount } = T;
// Save-file uses showSaveFilePicker when present (a native dialog the harness cannot drive); remove it so the <a download> fallback runs.
await T.ctx.addInitScript(() => { try { delete window.showSaveFilePicker; } catch {} });
const IMG = "/workspace/app-quality/r9/harness/test-photo.jpg";
const snap = async (n) => fs.writeFileSync(`/workspace/app-quality/r9/harness/snap-${vp}-${n}.txt`, await p.locator("body").ariaSnapshot());

await step("A01 disclaimer shows on first visit and accepts", async () => {
  await p.goto("https://pine-coral-clover-charm.grok.me/", { waitUntil: "networkidle" });
  if (!(await p.locator("#disclaimer-dialog").isVisible())) throw new Error("no disclaimer");
  await p.click("#disclaimer-accept"); await p.waitForTimeout(400);
  return `setup dialog visible=${await p.getByRole("dialog", { name: "Set up this coach" }).isVisible()}`;
});
await step("A02 setup rejects a bad VIN", async () => {
  const d = p.getByRole("dialog", { name: "Set up this coach" });
  await d.getByLabel("VIN, optional").fill("123");
  await d.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(400);
  const still = await d.isVisible(); const txt = still ? (await d.innerText()).replace(/\n+/g, " | ").slice(-300) : "";
  return { status: still ? "pass" : "fail", detail: still ? `kept open: ${txt}` : "accepted 3-char VIN" };
});
await step("A03 setup continue with year 2021 and 12400 miles", async () => {
  const d = p.getByRole("dialog", { name: "Set up this coach" });
  if (await d.isVisible()) {
    await d.getByLabel("VIN, optional").fill("");
    await d.getByLabel("Model year, optional").fill("2021");
    await d.getByLabel("Lifetime miles, optional").fill("12400");
    await d.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(600);
  }
  const s = await state();
  return { status: s && s.odometer === 12400 && !(await d.isVisible()) ? "pass" : "fail", detail: `odometer=${s?.odometer} modelYear=${s?.modelYear} modelId=${s?.modelId}` };
});
await step("A04 reload keeps disclaimer accepted and setup", async () => {
  await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(500);
  const dis = await p.locator("#disclaimer-dialog").count(); const set = await p.getByRole("dialog", { name: "Set up this coach" }).count();
  return { status: !dis && !set ? "pass" : "fail", detail: `disclaimer=${dis} setup=${set}` };
});
await step("A05 trailer photo upload (generated jpg)", async () => {
  const before = await idbCount();
  await p.locator('input[type=file][aria-label^="Add a trailer photo"]').setInputFiles(IMG); await p.waitForTimeout(2500);
  const s = await state(); const after = await idbCount();
  return { status: s?.photoId && after > before ? "pass" : "fail", detail: `photoId=${s?.photoId} blobs ${before}->${after} img=${await p.locator("main img").count()}` };
});
await step("A06 name this trailer", async () => {
  await p.getByRole("button", { name: "Name this trailer" }).click(); await p.waitForTimeout(400);
  const box = p.getByRole("textbox", { name: "Nickname" });
  await box.fill("R9 Test Coach"); await box.press("Enter"); await p.waitForTimeout(500);
  const s2 = await state();
  return { status: s2?.nickname === "R9 Test Coach" ? "pass" : "fail", detail: `nickname=${s2?.nickname}` };
});
await step("A07 set miles", async () => {
  await go("#/care");
  await p.getByRole("button", { name: "Set miles", exact: true }).click(); await p.waitForTimeout(400);
  await p.getByLabel("Lifetime miles").fill("12650"); await p.getByRole("button", { name: "Save the reading" }).click(); await p.waitForTimeout(500);
  const s = await state();
  return { status: s?.odometer === 12650 ? "pass" : "fail", detail: `odometer=${s?.odometer}` };
});
await step("A08 add trip miles", async () => {
  const sum = p.locator("main summary", { hasText: "Add trip miles" }); if (await sum.count()) { await sum.first().click(); await p.waitForTimeout(300); }
  await p.getByRole("button", { name: "Add trip miles" }).first().click(); await p.waitForTimeout(400);
  await p.getByLabel("Miles this trip").fill("180"); await p.getByLabel("Note, optional").fill("Denver to Moab");
  await p.getByRole("button", { name: "Add to the total" }).click(); await p.waitForTimeout(500);
  const s = await state();
  return { status: s?.odometer === 12830 ? "pass" : "fail", detail: `odometer=${s?.odometer} log=${JSON.stringify(s?.log ?? "").slice(0, 160)}` };
});
await step("A09 set one date for all maintenance", async () => {
  await go("#/care");
  await p.getByRole("button", { name: "Set one date for all" }).click(); await p.waitForTimeout(400);
  await p.locator("main").getByRole("button", { name: "1", exact: true }).first().click(); await p.waitForTimeout(800);
  const s = await state(); const txt = (await p.locator("main").innerText()).slice(0, 300).replace(/\n+/g, " | ");
  return { status: /not established/.test(txt) ? "fail" : "pass", detail: `done keys=${Object.keys(s?.done ?? {}).length} checks=${JSON.stringify(s?.checks)} log=${(s?.log ?? []).length} :: ${txt}` };
});
await step("A10 trip checklist tick, persist, clear", async () => {
  await go("#/checklist/pretrip");
  const boxes = p.getByRole("checkbox"); await boxes.nth(0).click(); await p.waitForTimeout(200); await boxes.nth(1).click(); await p.waitForTimeout(300);
  const t1 = await p.getByRole("progressbar").getAttribute("aria-label");
  await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(600);
  const t2 = await p.getByRole("progressbar").getAttribute("aria-label");
  await p.getByRole("button", { name: "Clear this list" }).click(); await p.waitForTimeout(300);
  const cd = p.getByRole("alertdialog").or(p.getByRole("dialog")).last(); if (await cd.count() && await cd.isVisible()) { const b = cd.getByRole("button", { name: /Clear/ }).first(); if (await b.count()) await b.click(); }
  await p.waitForTimeout(300);
  const t3 = await p.getByRole("progressbar").getAttribute("aria-label");
  return { status: t1 === "2 of 10 checked" && t2 === t1 && /^0 of/.test(t3) ? "pass" : "fail", detail: `${t1} / after reload ${t2} / after clear ${t3}` };
});
await step("A11 notes add, edit, remove", async () => {
  await go("#/notes");
  await p.getByLabel("New note").fill("R9 note: spare key in the front locker"); await p.getByRole("button", { name: "Save note" }).click(); await p.waitForTimeout(400);
  const n1 = (await state())?.notes?.length;
  await p.getByRole("button", { name: "Edit", exact: true }).first().click(); await p.waitForTimeout(300);
  await p.getByLabel("Edit note").fill("R9 note edited"); await p.getByRole("button", { name: "Save", exact: true }).click(); await p.waitForTimeout(400);
  const txt = JSON.stringify((await state())?.notes);
  await p.getByRole("button", { name: /Remove/ }).first().click(); await p.waitForTimeout(400);
  const cd = p.getByRole("alertdialog").or(p.getByRole("dialog")).last(); if (await cd.count() && await cd.isVisible()) { const b = cd.getByRole("button", { name: /Remove|Delete/ }).first(); if (await b.count()) { await b.click(); await p.waitForTimeout(300); } }
  const n3 = (await state())?.notes?.length;
  return { status: n1 === 1 && /edited/.test(txt) && n3 === 0 ? "pass" : "fail", detail: `added=${n1} edited=${/edited/.test(txt)} after remove=${n3}` };
});
await step("A12 service log entry with photo", async () => {
  await go("#/log");
  await p.getByRole("textbox", { name: "Job", exact: true }).fill("R9 test: tire rotation"); await p.getByLabel("Service note").fill("Rotated, star torque 110"); await p.getByLabel("Miles").fill("12830"); await p.getByLabel("Total cost").fill("120");
  const before = await idbCount();
  await p.locator("#log-photo").setInputFiles("/workspace/app-quality/r9/harness/test-photo2.jpg"); await p.waitForTimeout(2000);
  await p.getByRole("button", { name: "Save in the log" }).click(); await p.waitForTimeout(800);
  const s = await state(); const after = await idbCount();
  return { status: (s?.log ?? []).some((e) => /R9 test/.test(JSON.stringify(e))) && after > before ? "pass" : "fail", detail: `log=${(s?.log ?? []).length} blobs ${before}->${after}` };
});
await step("A13 history and records screens show the entry", async () => {
  await go("#/history"); const h = await p.locator("main").innerText();
  await go("#/records"); const r = await p.locator("main").innerText();
  return { status: /R9 test/.test(h) ? "pass" : "fail", detail: `history has entry=${/R9 test/.test(h)} records: ${r.replace(/\n+/g, " | ").slice(0, 200)}` };
});




const DL = "/workspace/app-quality/r9/harness/dl-" + vp; fs.mkdirSync(DL, { recursive: true });
const mainText = async () => (await p.locator("main").innerText()).replace(/\n+/g, " | ");
const flashText = async () => (await p.locator("[role=status], [aria-live]").allInnerTexts()).join(" / ").replace(/\n+/g, " ").slice(0, 300);
await step("B01 restore input refuses a non-backup file (jpg)", async () => {
  await go("#/log");
  await p.locator('main input[type=file][accept^="application/json"]').setInputFiles("/workspace/app-quality/r9/harness/test-photo.jpg"); await p.waitForTimeout(1200);
  const sheet = await p.getByRole("button", { name: "Restore this backup" }).count();
  return { status: sheet ? "fail" : "pass", detail: `restore sheet opened=${!!sheet}; message: ${await flashText()}` };
});
let backupFile = "";
await step("B02 export complete backup (download only, local)", async () => {
  await go("#/backup");
  await p.getByRole("button", { name: "Export complete backup" }).click(); await p.waitForTimeout(800);
  const sizeTxt = (await p.locator("body").innerText()).match(/This file is [^.]+/)?.[0];
  const [dl] = await Promise.all([p.waitForEvent("download", { timeout: 15000 }), p.getByRole("button", { name: "Save file", exact: true }).click()]);
  backupFile = `${DL}/${dl.suggestedFilename()}`; await dl.saveAs(backupFile);
  const j = JSON.parse(fs.readFileSync(backupFile, "utf8"));
  const sz = fs.statSync(backupFile).size;
  const keys = Object.keys(j);
  const st = await state();
  await p.waitForTimeout(500); const closeBtn = p.getByRole("button", { name: "Not now" }); if (await closeBtn.count() && await closeBtn.last().isVisible()) await closeBtn.last().click();
  const photoKeys = JSON.stringify(j).match(/data:image|"files"|"blobs"/g) || [];
  return { status: "pass", detail: `${sizeTxt}; photo markers=${photoKeys.length}; ${dl.suggestedFilename()} ${sz} B keys=${keys.slice(0, 12).join(",")} lastBackup=${st?._root?.lastBackup}` };
});
await step("B03 note added after the backup (to test restore)", async () => {
  await go("#/notes"); await p.getByLabel("New note").fill("R9 after-backup note"); await p.getByRole("button", { name: "Save note" }).click(); await p.waitForTimeout(400);
  return `notes=${(await state())?.notes?.length}`;
});
await step("B04 verify backup shows a preview, then restore", async () => {
  await go("#/backup");
  await p.locator('main input[type=file]').first().setInputFiles(backupFile); await p.waitForTimeout(1500);
  const look = (await p.locator("body").innerText()).match(/Inside this file[\s\S]{0,400}/)?.[0]?.replace(/\n+/g, " | ") ?? "no preview";
  await p.getByRole("button", { name: "Restore this backup" }).click(); await p.waitForTimeout(2000);
  const n = (await state())?.notes?.length; const banner = await p.getByRole("button", { name: "Undo restore" }).count();
  return { status: n === 0 && banner ? "pass" : "fail", detail: `notes after restore=${n} undo banner=${banner} :: ${look.slice(0, 300)}` };
});
await step("B05 undo restore brings back the newer note", async () => {
  await p.getByRole("button", { name: "Undo restore" }).click(); await p.waitForLoadState("networkidle"); await p.waitForTimeout(1500);
  const notes = (await state())?.notes ?? []; const banner = await p.getByRole("button", { name: "Undo restore" }).count();
  return { status: notes.some((x) => /after-backup/.test(x.text)) && !banner ? "pass" : "fail", detail: `notes=${JSON.stringify(notes.map((x) => x.text))} banner=${banner}` };
});
await step("B06 restore again and keep it; photos survive", async () => {
  await go("#/backup");
  await p.locator('main input[type=file]').first().setInputFiles(backupFile); await p.waitForTimeout(1500);
  await p.getByRole("button", { name: "Restore this backup" }).click(); await p.waitForTimeout(2000);
  await p.getByRole("button", { name: "Keep this restore" }).click(); await p.waitForTimeout(1200);
  const s = await state(); const blobs = await idbCount();
  return { status: !(await p.getByRole("button", { name: "Undo restore" }).count()) && s?.photoId ? "pass" : "fail", detail: `photoId=${s?.photoId} blobs=${blobs} notes=${s?.notes?.length} log=${s?.log?.length}` };
});
await step("B07 global search", async () => {
  await go("#/fix"); await p.getByRole("button", { name: "Search", exact: true }).first().click(); await p.waitForTimeout(400);
  const box = p.getByRole("searchbox").or(p.getByRole("textbox", { name: /Search/ })).first(); await box.fill("converter"); await p.waitForTimeout(800);
  const t = (await p.locator("body").innerText()); const hits = (t.match(/onverter/g) || []).length;
  await p.keyboard.press("Escape"); await p.waitForTimeout(300);
  return { status: hits > 2 ? "pass" : "fail", detail: `"converter" mentions on screen=${hits}` };
});
await step("B08 symptom flow: open no-12v and step a check", async () => {
  await go("#/symptom/no-12v/0"); const t1 = await mainText();
  const btn = p.locator("main button").filter({ hasText: /Yes|No|Next|That fixed it|Still|Didn.t/ }).first(); const had = await btn.count();
  if (had) { await btn.click(); await p.waitForTimeout(500); }
  return { status: t1.length > 200 ? "pass" : "fail", detail: `stepped=${!!had} url=${p.url().split("#")[1]} :: ${t1.slice(0, 200)}` };
});
await step("B09 flowchart dead-12 yes/no path", async () => {
  await go("#/flow/dead-12"); const before = await mainText();
  const b = p.locator("main button").filter({ hasText: /^(Yes|No)$/ }).first(); const had = await b.count(); if (had) { await b.click(); await p.waitForTimeout(400); }
  const after = await mainText();
  return { status: had && before !== after ? "pass" : (had ? "fail" : "not checked"), detail: `yes/no buttons=${had} changed=${before !== after} :: ${after.slice(0, 200)}` };
});
await step("B10 fault code search 'gas failure'", async () => {
  await go("#/codes"); await p.waitForTimeout(500); const cb = p.getByRole("textbox", { name: /Fault code/ }); if (!(await cb.count())) return { status: "fail", detail: "no code search box: " + (await mainText()).slice(0, 300) }; await cb.fill("gas failure"); await p.waitForTimeout(500);
  const t = await mainText(); return { status: /Gas failure/i.test(t) ? "pass" : "fail", detail: t.slice(0, 200) };
});
for (const fig of ["p92-1", "p93-1"]) await step(`B11 circuit table ${fig} converter row`, async () => {
  await go(`#/figure/${fig}`); await p.waitForTimeout(800);
  const t = await p.locator("main table").first().innerText().catch(() => "");
  const ok = /15 A HACR/.test(t) && /8\.00/.test(t) && /36\.00 A/.test(t) && !/10\.90|38\.90/.test(t);
  const geo = await p.evaluate(() => { const tb = document.querySelector("main table"); if (!tb) return null; let e = tb.parentElement; while (e && e.scrollWidth <= e.clientWidth) e = e.parentElement; return { table: tb.scrollWidth, box: e?.clientWidth ?? null }; });
  const leg2 = (t.match(/LEG 2[^\n]*/) || [""])[0];
  await p.locator("main table").first().screenshot({ path: `${out}/${vp}-B11-${fig}-table.png` }).catch(() => {});
  return { status: ok ? "pass" : "fail", detail: `15A/8.00/36.00=${ok} ${leg2} geometry=${JSON.stringify(geo)}` };
});
await step("B12 print view: chip row hint, print call", async () => {
  await go("#/printout"); await p.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
  const chip = await p.evaluate(() => { const r = document.querySelector("main .chip-row"); return r ? { sw: r.scrollWidth, cw: r.clientWidth } : null; });
  const hint = /Swipe sideways/i.test(await mainText());
  await p.getByRole("button", { name: "Print or save as PDF" }).click(); await p.waitForTimeout(400);
  const printed = await p.evaluate(() => window.__printed);
  return { status: printed ? "pass" : "fail", detail: `print called=${printed} chip row ${JSON.stringify(chip)} scroll hint text=${hint}` };
});
await step("B13 level: typed reading", async () => {
  await go("#/level"); await p.getByRole("button", { name: "Type a Level reading" }).click(); await p.waitForTimeout(300);
  await p.locator("#level-side-deg").fill("1.5"); await p.getByRole("button", { name: "Curbside low" }).click();
  await p.locator("#level-end-deg").fill("0.8"); await p.getByRole("button", { name: "Tongue low" }).click(); await p.waitForTimeout(500);
  const t = await mainText(); const res = t.split("Hide the Level reading")[1] || "";
  return { status: /(inch|in\b)/.test(res) ? "pass" : "fail", detail: res.slice(0, 400) };
});
await step("B14 weights: scale passes compute", async () => {
  await go("#/weights");
  const fill = async (label, i, v) => p.getByRole("textbox", { name: label, exact: true }).nth(i).fill(v);
  await p.getByRole("textbox", { name: "Truck GVWR", exact: true }).fill("7000");
  await fill("Steer axle", 1, "3800"); await fill("Drive axle", 1, "3200");
  await fill("Steer axle", 2, "3600"); await fill("Drive axle", 2, "4300"); await fill("Trailer axles", 0, "6900");
  await fill("Steer axle", 3, "3750"); await fill("Drive axle", 3, "4050"); await fill("Trailer axles", 1, "7000"); await p.waitForTimeout(500);
  const t = await mainText(); const tick = t.match(/This ticket[\s\S]{0,500}/)?.[0] ?? "";
  return { status: /\d,?\d{3}/.test(tick) ? "pass" : "fail", detail: tick.slice(0, 400) };
});
await step("B15 shop finder by ZIP 80202", async () => {
  await go("#/service"); await p.getByLabel("ZIP code").fill("80202"); await p.waitForTimeout(1500);
  const t = await mainText(); const n = t.match(/(\d+) shops? within[^|]*/)?.[0] || "";
  return { status: /^[1-9]/.test(n) ? "pass" : "fail", detail: `${n} :: ${t.slice(380, 650)}` };
});
await step("B16 shop finder by location (emulated Denver)", async () => {
  await p.getByLabel("ZIP code").fill(""); await p.getByRole("button", { name: "Use my location" }).click(); await p.waitForTimeout(2000);
  const t = await mainText(); const n = t.match(/(\d+) shops? within[^|]*/)?.[0] || "";
  return { status: /^[1-9]/.test(n) ? "pass" : "fail", detail: `${n} :: ${t.slice(380, 650)}` };
});
await step("B17 dark mode toggle persists", async () => {
  await p.getByRole("switch").first().click(); await p.waitForTimeout(300);
  const v = await p.evaluate(() => [localStorage.getItem("rivetcare-theme"), document.documentElement.classList.contains("dark")]);
  await p.reload({ waitUntil: "networkidle" }); const d = await p.evaluate(() => document.documentElement.classList.contains("dark"));
  await p.getByRole("switch").first().click(); await p.waitForTimeout(200);
  return { status: v[1] && d ? "pass" : "fail", detail: `stored=${v[0]} dark=${v[1]} after reload=${d}` };
});
await step("B18 calendar export (.ics)", async () => {
  await go("#/care");
  const [dl] = await Promise.all([p.waitForEvent("download", { timeout: 10000 }), p.getByRole("button", { name: "Add dates to Calendar" }).click()]);
  const f = `${DL}/${dl.suggestedFilename()}`; await dl.saveAs(f); const t = fs.readFileSync(f, "utf8");
  return { status: /BEGIN:VCALENDAR/.test(t) && /BEGIN:VEVENT/.test(t) ? "pass" : "fail", detail: `${dl.suggestedFilename()} events=${(t.match(/BEGIN:VEVENT/g) || []).length}` };
});
await step("B19 service history CSV export", async () => {
  await go("#/log");
  const [dl] = await Promise.all([p.waitForEvent("download", { timeout: 10000 }), p.getByRole("button", { name: "Export history" }).click()]);
  const f = `${DL}/${dl.suggestedFilename()}`; await dl.saveAs(f); const t = fs.readFileSync(f, "utf8");
  const formula = /(^|,)"?[=+\-@]/m.test(t.split("\n").slice(1).join("\n"));
  return { status: t.split("\n").length > 2 ? "pass" : "fail", detail: `${dl.suggestedFilename()} lines=${t.split("\n").length} header=${t.split("\n")[0].slice(0, 120)} formula-like cells=${formula}` };
});
await step("B20 check for an update", async () => {
  await go("#/about"); await go("#/");
  await p.goto("https://pine-coral-clover-charm.grok.me/", { waitUntil: "networkidle" });
  const b = p.getByRole("button", { name: /Check for an update/ }); if (!(await b.count())) return { status: "not checked", detail: "button not on home after setup (only on first-run card)" };
  await b.first().click(); await p.waitForTimeout(1500); return `message: ${await flashText()}`;
});
await step("B21 phone reminders (notifications granted)", async () => {
  await go("#/");
  const b = p.getByRole("button", { name: "Turn on phone reminders" }); if (!(await b.count())) return { status: "not checked", detail: "button missing: " + (await mainText()).slice(0, 500) };
  await b.click(); await p.waitForTimeout(1200);
  return `after click: ${(await p.locator("main").innerText()).match(/Phone reminders[\s\S]{0,200}/i)?.[0]?.replace(/\n+/g, " | ")} / ${await flashText()}`;
});
await step("B22 second coach via picker keeps logs separate", async () => {
  await go("#/");
  await p.getByRole("button", { name: "Change trailer" }).first().click(); await p.waitForTimeout(400);
  await p.locator("#coach-search").fill("27FB"); await p.waitForTimeout(300);
  await p.locator("[role=dialog] button, .fixed button").filter({ hasText: /Globetrotter 27FB|27FB/ }).first().click(); await p.waitForTimeout(800);
  const s = await state();
  const other = s?._root?.coaches ? Object.keys(s._root.coaches) : [];
  const sep = (s?.log ?? []).length === 0;
  await p.getByRole("button", { name: "Change trailer" }).first().click(); await p.waitForTimeout(300);
  await p.locator("#coach-search").fill("Classic 28RB"); await p.waitForTimeout(300);
  await p.locator("[role=dialog] button, .fixed button").filter({ hasText: /Classic 28RB|^28RB/ }).first().click(); await p.waitForTimeout(800);
  const back = await state();
  return { status: other.length >= 2 && sep && back?.modelId === "c28" && (back?.log ?? []).length > 0 ? "pass" : "fail", detail: `coaches=${other} new coach log empty=${sep} back=${back?.modelId} log=${back?.log?.length}` };
});
fs.writeFileSync(`/workspace/app-quality/r9/harness/stateAll-${vp}.json`, JSON.stringify(await state(), null, 1));
await step("B23 delete all local records", async () => {
  await go("#/privacy"); await p.getByRole("button", { name: "Delete all local records" }).click(); await p.waitForTimeout(300);
  const c = p.locator("main button").filter({ hasText: /Delete|Erase|Yes/ }); await c.first().click(); await p.waitForTimeout(3500);
  await p.waitForLoadState("networkidle");
  const left = await p.evaluate(async () => ({ ls: Object.keys(localStorage), dbs: (await indexedDB.databases()).map((d) => d.name) }));
  const ours = left.ls.filter((k) => k.startsWith("rivetcare-") && k !== "rivetcare-v1");
  const s = await state(); const fresh = await p.locator("#disclaimer-dialog").count();
  const undoRows = await idbCount("rivetcare-undo", (await p.evaluate(() => new Promise((r) => { const q = indexedDB.open("rivetcare-undo"); q.onsuccess = () => { r([...q.result.objectStoreNames][0] || "none"); q.result.close(); }; q.onerror = () => r("err"); }))));
  return { status: !s?.coaches?.c28?.log?.length && !(left.dbs.includes("rivetcare-files")) ? "pass" : "fail", detail: `localStorage keys=${JSON.stringify(left.ls)} dbs=${JSON.stringify(left.dbs)} disclaimer shown again=${!!fresh} rivetcare-undo rows=${undoRows}` };
});
T.save(); await T.browser.close();
