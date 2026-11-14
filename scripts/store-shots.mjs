/**
 * App Store and Play Store frames from the live app.
 * Writes artifacts/store/. Not part of the phone book.
 * Run: node scripts/store-shots.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const ROOT = new URL("..", import.meta.url);
const OUT = join(fileURL(ROOT), "artifacts/store");
const APP = process.env.STORE_SHOT_URL || "http://127.0.0.1:8080/";

function fileURL(url) {
  return url.pathname;
}

const DATED = [
  "sixty-day", "ac-filter", "extinguisher", "awning-hose", "humidity-wash", "glycol-level", "air-cushion",
  "breakaway", "locks", "sealant", "belly", "winterize", "rotate", "brakes-year", "house-year", "lp-year",
  "lp-reg", "anode", "descale-year", "furnace-season", "alarms", "glycol-swap", "awning-deep", "tires-replace", "cylinders",
];

const done = {};
for (const id of DATED) done[id] = { iso: id === "ac-filter" ? "2026-10-20" : "2026-11-01", miles: 12000 };

const seed = {
  schema: 1,
  rev: 1,
  modelId: "c28",
  accepted: true,
  disclaimerRev: 2,
  ready: true,
  coachSet: true,
  hint: false,
  installHint: false,
  coaches: {
    c28: {
      odometer: 12400,
      modelYear: 2021,
      nickname: "",
      done,
      log: [{ id: "log-1", iso: "2026-10-20", miles: 12000, note: "Start date", job: "A/C filter", taskId: "ac-filter" }],
    },
  },
};

const FRAMES = [
  { id: "01-due", hash: "#/", kicker: "RivetCare", title: "Know what’s due.", line: "The next job sits at the top. No account." },
  { id: "02-fix", hash: "#/fix", kicker: "On the road", title: "Fix it from the symptoms.", line: "Flowcharts and fault codes, in the trailer." },
  { id: "03-parts", hash: "#/parts", kicker: "This coach", title: "The part for this year.", line: "A number from another year steps aside." },
  { id: "04-weights", hash: "#/weights", kicker: "At the scale", title: "Read the scale ticket.", line: "Axle, tongue, and the usual 10–15%." },
  { id: "05-offline", hash: "#/offline", kicker: "No signal", title: "The book stays on the phone.", line: "Save it once. Open it later." },
];

function poster(shot, frame, width, height) {
  const phoneW = Math.round(width * 0.78);
  const phoneH = Math.round(height * 0.62);
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: #152A6A; color: #f7f8f9; font-family: Georgia, "Times New Roman", serif; }
  .wrap { box-sizing: border-box; height: 100%; padding: ${Math.round(height * 0.055)}px ${Math.round(width * 0.07)}px 0; display: flex; flex-direction: column; }
  .kicker { font-family: "Segoe UI", sans-serif; font-size: ${Math.round(width * 0.028)}px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; }
  h1 { margin: ${Math.round(height * 0.012)}px 0 0; font-size: ${Math.round(width * 0.072)}px; line-height: 1.02; font-weight: 650; }
  .line { margin: ${Math.round(height * 0.012)}px 0 0; font-family: "Segoe UI", sans-serif; font-size: ${Math.round(width * 0.03)}px; line-height: 1.35; }
  .phone { margin-top: ${Math.round(height * 0.03)}px; width: ${phoneW}px; height: ${phoneH}px; align-self: center; border-radius: ${Math.round(phoneW * 0.06)}px ${Math.round(phoneW * 0.06)}px 0 0; overflow: hidden; background: #f7f8f9; box-shadow: 0 18px 50px rgba(0,0,0,0.28); }
  img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top center; }
</style>
</head>
<body>
  <div class="wrap">
    <p class="kicker">${frame.kicker}</p>
    <h1>${frame.title}</h1>
    <p class="line">${frame.line}</p>
    <div class="phone"><img src="${shot}" alt="" /></div>
  </div>
</body>
</html>`;
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.addInitScript((data) => localStorage.setItem("rivetcare-v1", JSON.stringify(data)), seed);
await page.goto(APP, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);

const shots = {};
for (const frame of FRAMES) {
  await page.goto(`${APP}${frame.hash}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  const file = join(OUT, `${frame.id}-phone.png`);
  await page.screenshot({ path: file });
  shots[frame.id] = file;
}

const sizes = [
  ["app-store", 1290, 2796],
  ["play", 1080, 1920],
];
for (const frame of FRAMES) {
  const bytes = readFileSync(shots[frame.id]).toString("base64");
  const src = `data:image/png;base64,${bytes}`;
  for (const [name, width, height] of sizes) {
    const html = poster(src, frame, width, height);
    const doc = join(OUT, `${frame.id}-${name}.html`);
    writeFileSync(doc, html);
    const shot = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await shot.goto(`file://${doc}`, { waitUntil: "load" });
    await shot.screenshot({ path: join(OUT, `${frame.id}-${name}.png`) });
    await shot.close();
  }
}
await browser.close();
console.log(OUT);
