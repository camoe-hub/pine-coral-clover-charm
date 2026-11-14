/**
 * One phone shot of each screen, after the launch splash is gone.
 * Writes artifacts/rivetcare-pages.zip, one photo per screen. It is not served.
 * Refuses the file if two shots in a row match.
 * Run: node scripts/page-shots.mjs
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "artifacts/rivetcare-pages.zip");
const DIR = join(ROOT, "artifacts/page-shots");
const APP = process.env.PAGE_SHOT_URL || "http://127.0.0.1:8080/";

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
  coaches: { c28: { odometer: 0, modelYear: 2021, nickname: "" } },
};

const shots = [
  ["#/", "My trailer", "01-home.png"],
  ["#/care", "Set one date for all", "02-care.png"],
  ["#/fix", "Flowcharts", "03-fix.png"],
  ["#/parts", "Parts", "04-parts.png"],
  ["#/weights", "scale", "05-weights.png"],
  ["#/level", "low", "06-level.png"],
  ["#/tires", "placard", "07-tires.png"],
  ["#/supplies", "Propane", "08-supplies.png"],
  ["#/records", "record", "09-records.png"],
  ["#/log", "Save in the log", "10-log.png"],
  ["#/recalls", "NHTSA", "11-recalls.png"],
  ["#/service", "shop", "12-service.png"],
  ["#/manuals", "manual", "13-manuals.png"],
  ["#/specs", "spec", "14-specs.png"],
  ["#/lists", "Checklists", "15-lists.png"],
  ["#/checklist/pretrip", "tire pressure", "16-checklist-pretrip.png"],
  ["#/procedures", "Procedures", "17-procedures.png"],
  ["#/procedure/winterize", "antifreeze", "18-procedure-winterize.png"],
  ["#/flows", "Flowcharts", "19-flows.png"],
  ["#/flow/dead-12", "disconnect", "20-flow-dead-12.png"],
  ["#/figures", "Diagrams", "21-figures.png"],
  ["#/figure/p14-1", "Figure", "22-figure.png"],
  ["#/table", "Checks table", "23-table.png"],
  ["#/printout", "Print", "24-printout.png"],
  ["#/notes", "Notes", "25-notes.png"],
  ["#/desk", "shop", "26-desk.png"],
  ["#/tools", "carry", "27-tools.png"],
  ["#/about", "About", "28-about.png"],
  ["#/privacy", "phone", "29-privacy.png"],
  ["#/support", "wrong step", "30-support.png"],
  ["#/offline", "offline", "31-offline.png"],
  ["#/more", "Reference", "32-more.png"],
  ["#/symptom/no-12v/0", "battery disconnect", "33-symptom-no-12v.png"],
  ["#/history", "history", "34-history.png"],
  ["#/backup", "backup", "35-backup.png"],
];

rmSync(DIR, { recursive: true, force: true });
mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });
await page.addInitScript((data) => localStorage.setItem("rivetcare-v1", JSON.stringify(data)), seed);

const files = [];
let previous = "";
for (let n = 0; n < shots.length; n += 1) {
  const [hash, mark] = shots[n];
  await page.goto(`${APP}?shot=${n}${hash}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    (needle) => (document.getElementById("content")?.innerText || "").toLowerCase().includes(needle.toLowerCase()),
    mark,
    { timeout: 8000 },
  );
  await page.waitForFunction(() => !document.querySelector(".launch-splash"), null, { timeout: 4000 });
  await page.waitForTimeout(80);
  const file = join(DIR, `${String(n).padStart(2, "0")}.png`);
  await page.screenshot({ path: file });
  const digest = createHash("sha256").update(readFileSync(file)).digest("hex");
  if (digest === previous) {
    await browser.close();
    throw new Error(`page-shots: ${hash} matches the previous shot. The PDF was not written.`);
  }
  previous = digest;
  files.push(file);
  const title = (await page.locator("#content").innerText()).split("\n").filter(Boolean).slice(0, 2).join(" / ");
  console.log(String(n).padStart(2, "0"), hash, title.slice(0, 90));
}
await browser.close();

const names = shots.map((row) => row[2]);
const py = spawnSync(
  "python3",
  [
    "-c",
    `import zipfile
from pathlib import Path
files = ${JSON.stringify(files)}
names = ${JSON.stringify(names)}
out = Path(${JSON.stringify(OUT)})
with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_STORED) as z:
    for src, name in zip(files, names):
        z.write(src, name)
print(out, out.stat().st_size, "photos", len(files))
`,
  ],
  { stdio: "inherit" },
);
if (py.status !== 0) process.exit(py.status ?? 1);
writeFileSync(join(DIR, "ok"), `${files.length}\n`);
