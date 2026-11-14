// Read-only route crawl of RivetCare. Usage:
//   node route-crawl.mjs <base_url> <ids.json> <out_dir> [desktop|phone] [screens=plain|all]
// Env: PW_CORE (path to playwright-core/index.mjs), CHROME (default /usr/bin/google-chrome).
// Fresh context, test data only. Accepts the disclaimer, skips setup, then visits every hash route.
// Per route: console errors/warnings, page errors, failed or >=400 requests, page-level horizontal
// overflow, wide scroll boxes, h1 text. Writes <out_dir>/crawl-<vp>.json and screenshots.
import fs from "node:fs";
const PW = process.env.PW_CORE || "/workspace/app-quality/r9/src/node_modules/playwright-core/index.mjs";
const { chromium } = await import(PW);
const [base, idsFile, out, vp = "phone", shots = "plain"] = process.argv.slice(2);
const ids = JSON.parse(fs.readFileSync(idsFile, "utf8"));
fs.mkdirSync(out, { recursive: true });
const PLAIN = ["fix","care","procedures","parts","more","lists","specs","weights","level","tires","supplies","service","recalls","log","records","backup","privacy","history","notes","desk","manuals","tools","about","printout","flows","figures","offline","support","codes","table","sheet/1"];
const routes = [{ kind: "page", path: "/" }];
for (const r of PLAIN) routes.push({ kind: "hash", path: `#/${r}` });
const add = (name, list, suffix = "") => (list || []).forEach((id) => routes.push({ kind: "id", path: `#/${name}/${id}${suffix}` }));
add("procedure", ids.procedures); add("part", ids.parts); add("checklist", ids.checklists); add("flow", ids.flows);
add("figure", ids.figures); add("symptom", [...(ids.symptoms || []), ...(ids.extra || [])], "/0"); add("table", ids.symptoms, "/0");
routes.push({ kind: "page", path: "/privacy" }, { kind: "page", path: "/support" });
const size = vp === "desktop" ? { viewport: { width: 1280, height: 800 } } : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const b = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const ctx = await b.newContext(size);
const p = await ctx.newPage();
let bucket = null;
const push = (k, v) => { if (bucket) bucket[k].push(v); };
p.on("console", (m) => { if (["error", "warning"].includes(m.type())) push("console", `${m.type()}: ${m.text().slice(0, 300)}`); });
p.on("pageerror", (e) => push("pageerrors", String(e).slice(0, 300)));
p.on("requestfailed", (r) => push("failed", `${r.url()} ${r.failure()?.errorText}`));
p.on("response", (r) => { if (r.status() >= 400) push("failed", `${r.status()} ${r.url()}`); });
const results = [];
const measure = () => p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const pageOverflow = document.documentElement.scrollWidth - vw;
  const wide = [];
  for (const el of document.querySelectorAll("main *")) {
    const cs = getComputedStyle(el);
    if (/(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2 && !el.classList.contains("chip-row")) wide.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 2).join(".")} ${el.scrollWidth}>${el.clientWidth}`);
  }
  const off = [...document.querySelectorAll("main *")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.right > vw + 1 && !el.closest("[class*=overflow-x]") && getComputedStyle(el).position !== "fixed"; }).slice(0, 3).map((el) => `${el.tagName.toLowerCase()} right=${Math.round(el.getBoundingClientRect().right)}`);
  const h1 = document.querySelector("main h1, h1")?.textContent?.trim().slice(0, 80) || "";
  const text = (document.querySelector("main") || document.body).innerText.length;
  const crash = /something went wrong|not found|unknown/i.test((document.querySelector("main") || document.body).innerText.slice(0, 400));
  return { pageOverflow, wide: wide.slice(0, 3), off, h1, text, crash };
});
let started = false;
for (const r of routes) {
  bucket = { console: [], pageerrors: [], failed: [] };
  const t0 = Date.now();
  try {
    if (r.kind === "page" || !started) {
      await p.goto(base.replace(/\/$/, "") + (r.kind === "page" ? r.path : "/" + r.path), { waitUntil: "networkidle", timeout: 45000 });
      if (!started) {
        const acc = p.locator("#disclaimer-accept"); if (await acc.count()) { await acc.click(); await p.waitForTimeout(500); }
        const nn = p.getByRole("dialog", { name: "Set up this coach" }).getByRole("button", { name: "Not now" }); if (await nn.count()) { await nn.first().click({ timeout: 5000 }); await p.waitForTimeout(500); }
        if (await p.getByRole("dialog", { name: "Set up this coach" }).count()) throw new Error("setup dialog still open; crawl would be covered");
        started = true;
        if (r.kind !== "page") await p.goto(base.replace(/\/$/, "") + "/" + r.path, { waitUntil: "networkidle" });
      }
    } else if (new URL(p.url()).pathname !== "/") {
      await p.goto(base.replace(/\/$/, "") + "/" + r.path, { waitUntil: "networkidle", timeout: 45000 });
    } else {
      await p.evaluate((h) => { location.hash = h; }, r.path);
      await p.waitForLoadState("networkidle").catch(() => {});
      await p.waitForTimeout(r.kind === "id" ? 350 : 900);
    }
    const m = await measure();
    const row = { route: r.path, kind: r.kind, ms: Date.now() - t0, url: p.url(), ...m, ...bucket };
    const bad = row.pageerrors.length || row.failed.length || row.pageOverflow > 0 || row.off.length || row.crash || row.text < 80;
    if (r.kind !== "id" || shots === "all" || bad) {
      const f = `${out}/${vp}-${r.path.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "home"}.png`;
      await p.screenshot({ path: f }); row.shot = f;
    }
    results.push(row);
  } catch (e) { results.push({ route: r.path, kind: r.kind, error: String(e).slice(0, 300), ...bucket }); }
}
bucket = null;
fs.writeFileSync(`${out}/crawl-${vp}.json`, JSON.stringify(results, null, 1));
const n = (f) => results.filter(f).length;
console.log(`${vp}: routes ${results.length}, nav errors ${n((x) => x.error)}, pageerrors ${n((x) => x.pageerrors?.length)}, failed req ${n((x) => x.failed?.length)}, page overflow ${n((x) => x.pageOverflow > 0)}, offscreen ${n((x) => x.off?.length)}, wide boxes ${n((x) => x.wide?.length)}, crash/notfound text ${n((x) => x.crash)}, thin ${n((x) => x.text < 80)}`);
await b.close();
