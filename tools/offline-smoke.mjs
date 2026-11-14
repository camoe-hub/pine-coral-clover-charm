// Manual check against a production preview. Not part of npm test.
//   npm run build && npm run preview
//   node tools/offline-smoke.mjs [base]
// Desktop Chromium only. This sandbox cannot drive iOS Safari, an installed
// Home Screen app, or Android Chrome. One font is blocked on purpose so a
// failed precache file cannot fail install; Save for offline should then
// report that the set is not complete.
// There is no /precache-manifest.json and no pictures cache.
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:8081";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`);
};

const seed = () => {
  localStorage.setItem(
    "rivetcare-v1",
    JSON.stringify({ accepted: true, ready: true, disclaimerRev: 2, coachSet: true, installHint: false }),
  );
};

async function shellState(page) {
  return page.evaluate(async () => {
    const ready = await navigator.serviceWorker.ready;
    const keys = await caches.keys();
    const shell = keys.find((key) => key.startsWith("rivetcare-shell-"));
    let have = 0;
    if (shell) have = (await (await caches.open(shell)).keys()).length;
    return {
      active: !!ready.active,
      controlled: !!navigator.serviceWorker.controller,
      keys,
      shell: shell ?? "",
      have,
      title: document.title,
    };
  });
}

async function waitInstalled(page, timeout = 20000) {
  const end = Date.now() + timeout;
  let state;
  while (Date.now() < end) {
    state = await shellState(page);
    if (state.active && state.controlled && state.shell) return state;
    await page.waitForTimeout(250);
  }
  return state;
}

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext();
  await ctx.addInitScript(seed);
  await ctx.route("**/fonts/barlow-700-latin.woff2", (route) => route.abort());
  const page = await ctx.newPage();
  const paths = [];
  page.on("request", (req) => paths.push(new URL(req.url()).pathname));
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const worker = await page.evaluate(async () => {
    const res = await fetch("/sw.js");
    return res.ok ? res.text() : "";
  });
  check("worker is the shell and figure caches", worker.includes("rivetcare-shell-") && worker.includes("rivetcare-figures-") && !worker.includes("pictures") && !worker.includes("precache-manifest"));
  check("a failed shell file cannot reject install", worker.includes("must not reject install") && worker.includes(".catch(() => undefined)"));
  const installed = await waitInstalled(page);
  check("page does not ask for a precache manifest", !paths.includes("/precache-manifest.json"));
  check(
    "a failed font fetch does not block install",
    installed.active && installed.controlled && installed.shell.startsWith("rivetcare-shell-") && installed.have > 0,
    `${installed.shell || "no shell cache"}, ${installed.have} entries, controlled=${installed.controlled}`,
  );
  check("title is RivetCare", installed.title === "RivetCare" || installed.title.endsWith("· RivetCare"), installed.title);
  check("no pictures cache", !installed.keys.some((key) => key.includes("pictures")));

  await page.getByRole("button", { name: "Offline", exact: true }).click();
  await page.getByRole("heading", { name: "On this phone" }).waitFor({ timeout: 10000 });
  await page.waitForFunction(() => !document.body.innerText.includes("Checking…"), undefined, { timeout: 10000 });
  const offline = await page.locator("#content").innerText();
  check("offline page names the app shell", offline.includes("App shell"));
  check("offline page names opened diagrams", offline.includes("Diagrams you have opened"));
  check("offline page names shop distances", offline.includes("Shop distances"));
  check("shop distances can be saved on their own", (await page.getByRole("button", { name: "Save shop distances" }).count()) === 1);
  check("save for offline is on the page", (await page.getByRole("button", { name: "Save for offline" }).count()) === 1);
  check("there is no save-pictures button", (await page.getByRole("button", { name: "Save pictures for offline" }).count()) === 0);
  await page.getByRole("button", { name: "Save for offline" }).click();
  await page.getByText(/Saved for offline|Not complete/).first().waitFor({ timeout: 25000 });
  const afterSave = await page.locator("#content").innerText();
  check("save for offline reports completeness", afterSave.includes("Saved for offline") || afterSave.includes("Not complete"), afterSave.includes("Not complete") ? "incomplete, as expected while one font is blocked" : "complete");

  await ctx.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  const offlineTitle = await page.title();
  check("app opens offline", offlineTitle === "RivetCare" || offlineTitle.endsWith("· RivetCare"), offlineTitle);
  await ctx.close();
} finally {
  await browser.close();
}

const failed = results.filter((row) => !row.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
