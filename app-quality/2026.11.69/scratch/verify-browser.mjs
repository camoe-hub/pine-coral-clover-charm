// Read-only browser checks for RivetCare 2026.11.69 against the local preview.
import { chromium } from "/workspace/node_modules/playwright-core/index.mjs";
import fs from "node:fs";

const CHROME = "/opt/pw-browsers/chromium-1248/chrome-linux64/chrome";
const BASE = "http://127.0.0.1:8080";
const OUT = "/workspace/app-quality/2026.11.69/scratch/shots";
fs.mkdirSync(OUT, { recursive: true });

const findings = [];
function note(name, ok, detail) {
  const row = { name, ok, detail: String(detail).slice(0, 800) };
  findings.push(row);
  console.log(`${ok ? "PASS" : "FAIL"} ${name} :: ${row.detail}`);
}

async function launch(vp) {
  const size =
    vp === "desktop"
      ? { viewport: { width: 1280, height: 800 } }
      : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
  const ctx = await browser.newContext({ ...size, acceptDownloads: true });
  const page = await ctx.newPage();
  const log = { console: [], pageerrors: [], failed: [] };
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type()) && !/Unrecognized feature: 'notifications'/.test(m.text())) {
      log.console.push(`${m.type()}: ${m.text().slice(0, 240)}`);
    }
  });
  page.on("pageerror", (e) => log.pageerrors.push(String(e).slice(0, 300)));
  page.on("requestfailed", (r) => log.failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => {
    if (r.status() >= 400) log.failed.push(`${r.status()} ${r.url()}`);
  });
  return { browser, ctx, page, log };
}

async function shot(page, name) {
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file, fullPage: false }).catch(() => {});
  return file;
}

async function ready(page) {
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const accept = page.locator("#disclaimer-accept");
  if (await accept.count()) {
    await accept.click();
    await page.waitForTimeout(400);
  }
  const year = page.locator("#setup-year");
  if (await year.count()) {
    await year.fill("2021");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(600);
  }
}

async function go(page, hash) {
  await page.evaluate((h) => {
    location.hash = h;
  }, hash);
  await page.waitForTimeout(700);
}

async function setYear(page, year) {
  await go(page, "");
  await page.getByRole("button", { name: "Change trailer" }).click();
  await page.waitForTimeout(400);
  const box = page.locator("#coach-year");
  await box.fill(String(year));
  await box.blur();
  await page.waitForTimeout(400);
  await page.locator("#coach-dialog").getByRole("button", { name: "Back" }).click().catch(async () => {
    await page.keyboard.press("Escape");
  });
  await page.waitForTimeout(300);
  // close by clicking the back control if the dialog is still up
  if (await page.locator("#coach-dialog").count()) {
    await page.locator("#coach-dialog button").first().click();
    await page.waitForTimeout(300);
  }
}

async function pickCoach(page, query, name) {
  await go(page, "");
  await page.getByRole("button", { name: "Change trailer" }).click();
  await page.waitForTimeout(400);
  await page.locator("#coach-search").fill(query);
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: new RegExp(name) }).first().click();
  await page.waitForTimeout(500);
}

async function partTexts(page, query) {
  await go(page, "#/parts");
  await page.locator("#parts-search").fill(query);
  await page.waitForTimeout(400);
  const row = page.locator("ul button").first();
  const list = (await row.innerText()).replace(/\s+/g, " ").trim();
  await row.click();
  await page.waitForTimeout(500);
  const card = (await page.locator("main").innerText()).replace(/\s+/g, " ").trim();
  return { list, card };
}

function countPhrase(text, phrase) {
  return text.split(phrase).length - 1;
}

const phone = await launch("phone");
const p = phone.page;
const zipHits = [];
p.on("request", (r) => {
  if (r.url().includes("rivetcare-book.zip")) zipHits.push(`${r.method()} ${r.url()}`);
});

await ready(p);
await shot(p, "phone-home");
const homeText = (await p.locator("body").innerText()).replace(/\s+/g, " ");
note("tab name is Fix", /Fix/.test(homeText) && (await p.getByRole("button", { name: "Fix" }).count()) > 0, "Fix tab present");
note("home does not download the project zip by itself", zipHits.length === 0, zipHits.join(" | ") || "no zip request on first load");
note("2021 setup landed", /2021/.test(homeText), homeText.slice(0, 240));

const swText = await p.evaluate(async () => (await fetch("/sw.js")).text());
note(
  "preview service worker cache name",
  swText.includes("rivetcare-shell-__BOOK_VERSION__"),
  swText.includes("2026.11.69") ? "served sw.js already contains 2026.11.69" : "served sw.js still has the build token __BOOK_VERSION__",
);
const versionTxt = await p.evaluate(async () => (await fetch("/version.txt")).text());
note("version.txt on the preview", versionTxt.trim() === "2026.11.69", versionTxt.trim());

async function expectOtherYear(query, pn) {
  const { list, card } = await partTexts(p, query);
  const listHides = list.includes("Not this year’s part") && !list.includes(pn);
  const cardKeeps = card.includes("Not this year’s part") && card.includes(pn);
  note(`2021 list does not offer ${pn}`, listHides, list.slice(0, 280));
  note(`2021 card keeps ${pn} and says not this year`, cardKeeps, card.slice(0, 360));
  await shot(p, `phone-card-${query.replace(/[^a-z0-9]+/gi, "")}`);
}

await expectOtherYear("coupler", "455653");
await expectOtherYear("601392", "601392-06");
await expectOtherYear("furnace", "690732-02");

const lug = await partTexts(p, "lug nut");
note("2021 lug nut stays on the list", lug.list.includes("400923") && !lug.list.includes("Not this year’s part"), lug.list.slice(0, 240));
const inv = await partTexts(p, "inverter");
note(
  "2021 inverter stays on the list",
  (inv.list.includes("514515") || inv.list.includes("514263")) && !inv.list.includes("Not this year’s part"),
  inv.list.slice(0, 280),
);

await setYear(p, 2026);
const coupler2026 = await partTexts(p, "coupler");
note(
  "2026 Classic shows the coupler number",
  coupler2026.list.includes("455653") && !coupler2026.list.includes("Not this year’s part"),
  coupler2026.list.slice(0, 280),
);

await setYear(p, 2025);
const city2025 = await partTexts(p, "601392");
note(
  "2025 Classic shows the city inlet",
  city2025.list.includes("601392-06") && !city2025.list.includes("Not this year’s part"),
  city2025.list.slice(0, 280),
);

await pickCoach(p, "Globetrotter", "Globetrotter 27FB");
await setYear(p, 2025);
const furnace2025 = await partTexts(p, "690732");
note(
  "2025 Globetrotter shows the furnace",
  furnace2025.list.includes("690732-02") && !furnace2025.list.includes("Not this year’s part"),
  furnace2025.list.slice(0, 300),
);
const yearLine = await p.evaluate(() => {
  try {
    const s = JSON.parse(localStorage.getItem("rivetcare-v1") || "null");
    return `${s?.modelId} year=${s?.modelYear}`;
  } catch {
    return "unreadable";
  }
});
note("coach after furnace check", yearLine.includes("g27"), yearLine);

// Truck sticker survives a coach change.
await go(p, "#/weights");
await p.locator("#note-truck").fill("Audit Ram");
await p.locator("#rate-gvw").fill("10000");
await p.waitForTimeout(400);
await pickCoach(p, "Classic", "Classic 28RB");
await go(p, "#/weights");
await p.waitForTimeout(500);
const truckAfter = await p.locator("#note-truck").inputValue();
const gvwAfter = await p.locator("#rate-gvw").inputValue();
note("truck sticker stays after switching coaches", truckAfter === "Audit Ram" && gvwAfter === "10000", `truck=${truckAfter} gvw=${gvwAfter}`);
await shot(p, "phone-weights-truck");

async function tongueCase(label, values) {
  await go(p, "#/weights");
  for (const [id, value] of Object.entries(values)) {
    await p.locator("#" + id).fill(value);
  }
  await p.waitForTimeout(250);
  const text = (await p.locator("main").innerText()).replace(/\s+/g, " ");
  const band = (text.match(/Tongue weight is [^.]+\. The usual band is 10–15%\./g) || []).length;
  const lights = /go light|caution light|over light|safe to tow|safe-to-tow/i.test(text);
  return { text, band, lights };
}

const low = await tongueCase("low", { truckFront: "2000", truckRear: "3000", bareFront: "2200", bareRear: "3200", bareTrailer: "5800", wdFront: "", wdRear: "", wdTrailer: "" });
note(
  "tongue share under 10% is one sentence, no pass or fail light",
  low.band === 1 && low.text.includes("6.45%") && !low.lights && !/not this year's part/.test(low.text),
  `bandCount=${low.band} lights=${low.lights} snippet=${low.text.slice(low.text.indexOf("Tongue as a share"), low.text.indexOf("Tongue as a share") + 280)}`,
);
await shot(p, "phone-tongue-low");

const inside = await tongueCase("inside", { truckFront: "2000", truckRear: "2000", bareFront: "2600", bareRear: "2600", bareTrailer: "8800", wdFront: "", wdRear: "", wdTrailer: "" });
note("tongue share of 12% has no extra sentence", inside.band === 0 && !inside.lights, `bandCount=${inside.band}`);

const at10 = await tongueCase("10", { truckFront: "2000", truckRear: "2000", bareFront: "2500", bareRear: "2500", bareTrailer: "9000" });
note("tongue share of 10% has no extra sentence", at10.band === 0, `bandCount=${at10.band}`);

const at15 = await tongueCase("15", { truckFront: "2000", truckRear: "2000", bareFront: "2700", bareRear: "2800", bareTrailer: "8500" });
note("tongue share of 15% has no extra sentence", at15.band === 0, `bandCount=${at15.band}`);

const over = await tongueCase("16", { truckFront: "2000", truckRear: "2000", bareFront: "2800", bareRear: "2800", bareTrailer: "8400" });
note(
  "tongue share over 15% is one sentence",
  over.band === 1 && over.text.includes("16.00%") && !over.lights,
  `bandCount=${over.band} snippet=${over.text.slice(over.text.indexOf("Tongue as a share"), over.text.indexOf("Tongue as a share") + 240)}`,
);

await go(p, "#/tires");
const tires = (await p.locator("main").innerText()).replace(/\s+/g, " ");
note(
  "cold pressure names the placard as the winner",
  /placard still wins/i.test(tires) && /Heavier axle end/.test(tires),
  tires.slice(tires.indexOf("Cold pressure"), tires.indexOf("Cold pressure") + 320),
);
await shot(p, "phone-tires");

await go(p, "#/privacy");
const privacy = (await p.locator("main h1").innerText()).catch?.() ?? (await p.locator("h1").first().innerText());
note("Privacy screen opens", /Privacy/i.test(privacy), privacy);
await shot(p, "phone-privacy");

await go(p, "#/support");
const support = await p.locator("main").innerText();
note("Support screen opens and names this version", /Support/.test(support) && /2026\.11\.69/.test(support), support.replace(/\s+/g, " ").slice(0, 240));
const zipBeforeHover = zipHits.length;
await p.getByRole("link", { name: /Save the project zip/ }).hover();
await p.waitForTimeout(1500);
note(
  "zip download stays on the Support link, not a surprise on home",
  zipBeforeHover === 0,
  `requests before hover=${zipBeforeHover} after=${zipHits.length} ${zipHits.join(" | ")}`,
);
await shot(p, "phone-support");

await go(p, "#/records");
const records = (await p.locator("main").innerText()).replace(/\s+/g, " ");
note("dealer field is on Records", /dealer/i.test(records), records.slice(0, 200));

const routes = ["", "#/care", "#/records", "#/fix", "#/more", "#/parts", "#/weights", "#/level", "#/tires", "#/privacy", "#/support", "#/offline"];
const overflow = [];
for (const hash of routes) {
  const before = phone.log.pageerrors.length;
  await go(p, hash || "#/");
  if (!hash) await p.goto(BASE + "/", { waitUntil: "networkidle" });
  const measure = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const pageOverflow = document.documentElement.scrollWidth - vw;
    const h1 = document.querySelector("main h1, h1")?.textContent?.trim().slice(0, 80) || "";
    return { pageOverflow, h1, title: document.title };
  });
  if (measure.pageOverflow > 1) overflow.push(`${hash || "/"} +${measure.pageOverflow} ${measure.h1}`);
  if (phone.log.pageerrors.length > before) overflow.push(`pageerror ${hash} ${phone.log.pageerrors.slice(before).join(" | ")}`);
}
note("phone screens stay within the width and do not crash", overflow.length === 0, overflow.join(" ; ") || "no overflow, no page error");
await shot(p, "phone-fix");

// iPhone Add button opens the install tutorial.
const ios = await launch("phone");
await ios.ctx.setExtraHTTPHeaders({});
await ios.page.close();
const iosPage = await ios.ctx.browser?.newPage?.();
// relaunch with iPhone UA
await ios.browser.close();
const iosBrowser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const iosCtx = await iosBrowser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
});
const ip = await iosCtx.newPage();
await ip.goto(BASE + "/", { waitUntil: "networkidle" });
if (await ip.locator("#disclaimer-accept").count()) await ip.locator("#disclaimer-accept").click();
await ip.waitForTimeout(400);
const notNow = ip.getByRole("button", { name: "Not now" });
if (await notNow.count()) await notNow.first().click();
await ip.waitForTimeout(400);
const add = ip.getByRole("button", { name: "Add", exact: true });
if (await add.count()) await add.click();
await ip.waitForTimeout(800);
const installText = (await ip.locator("body").innerText()).replace(/\s+/g, " ");
const installHtml = await ip.content();
note(
  "iPhone Add opens a RivetCare install page",
  /Add RivetCare to your Home Screen/.test(installText) && !installHtml.includes("{{THEME_COLOR}}") && !installHtml.includes("{{APP_NAME}}"),
  `url=${ip.url()} text=${installText.slice(0, 220)} themeToken=${installHtml.includes("{{THEME_COLOR}}")} appToken=${installHtml.includes("{{APP_NAME}}")}`,
);
await shot(ip, "phone-install");
await iosBrowser.close();

// Offline: a screen that was never opened should not be a raw crash.
const off = await launch("phone");
await ready(off.page);
await off.page.evaluate(() => navigator.serviceWorker?.ready).catch(() => {});
await off.page.reload({ waitUntil: "networkidle" });
await off.page.waitForTimeout(1000);
const swInfo = await off.page.evaluate(async () => {
  const regs = await navigator.serviceWorker?.getRegistrations?.() ?? [];
  const keys = await caches.keys().catch(() => []);
  return { controlled: !!navigator.serviceWorker?.controller, regs: regs.map((r) => r.active?.scriptURL || r.scope), keys };
});
await off.ctx.setOffline(true);
await off.page.goto(BASE + "/#/privacy", { waitUntil: "load" }).catch((e) => note("offline navigation threw", false, e.message));
await off.page.waitForTimeout(1500);
const offlineBody = (await off.page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 500);
const raw = offlineBody.trim() === "Offline" || /Something went wrong/.test(offlineBody);
const friendly = /isn't on the phone yet|isn't on this phone yet|Privacy|Home is still on this phone|Save for offline/.test(offlineBody);
note("offline Privacy is a friendly page, not a raw crash", friendly && !/^Offline$/.test(offlineBody.trim()), `sw=${JSON.stringify(swInfo)} body=${offlineBody}`);
await shot(off.page, "phone-offline-privacy");
await off.browser.close();

await phone.browser.close();

// Desktop sweep of the same screens.
const desk = await launch("desktop");
await ready(desk.page);
await shot(desk.page, "desktop-home");
const deskOverflow = [];
for (const hash of ["", "#/fix", "#/parts", "#/weights", "#/records", "#/support", "#/privacy"]) {
  if (hash) await go(desk.page, hash);
  else await desk.page.goto(BASE + "/", { waitUntil: "networkidle" });
  const measure = await desk.page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelector("main h1, h1")?.textContent?.trim().slice(0, 80) || "",
  }));
  if (measure.overflow > 1) deskOverflow.push(`${hash || "/"} +${measure.overflow} ${measure.h1}`);
}
await shot(desk.page, "desktop-parts");
note("desktop screens stay within 1280px", deskOverflow.length === 0, deskOverflow.join(" ; ") || "no overflow");
note(
  "desktop console and page errors",
  desk.log.pageerrors.length === 0,
  `pageerrors=${desk.log.pageerrors.slice(0, 4).join(" | ") || "none"} console=${desk.log.console.slice(0, 6).join(" | ") || "none"} failed=${desk.log.failed.slice(0, 6).join(" | ") || "none"}`,
);
note(
  "phone console and page errors",
  phone.log.pageerrors.length === 0,
  `pageerrors=${phone.log.pageerrors.slice(0, 4).join(" | ") || "none"} console=${phone.log.console.slice(0, 8).join(" | ") || "none"} failed=${phone.log.failed.filter((x) => !x.includes("net::ERR_INTERNET_DISCONNECTED") && !x.includes("Failed to fetch")).slice(0, 8).join(" | ") || "none"}`,
);
await desk.browser.close();

fs.writeFileSync("/workspace/app-quality/2026.11.69/scratch/browser-findings.json", JSON.stringify(findings, null, 2));
const failed = findings.filter((row) => !row.ok);
console.log(`\n${findings.length - failed.length} pass / ${failed.length} fail`);
process.exit(failed.length ? 1 : 0);
