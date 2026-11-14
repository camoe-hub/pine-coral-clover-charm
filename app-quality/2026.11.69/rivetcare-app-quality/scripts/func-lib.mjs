// Shared helpers for RivetCare functional checks (read-only against live; test data in a fresh browser context).
import fs from "node:fs";
const PW = process.env.PW_CORE || "/workspace/app-quality/r9/src/node_modules/playwright-core/index.mjs";
export const { chromium } = await import(PW);
export const BASE = (process.env.BASE || "https://pine-coral-clover-charm.grok.me").replace(/\/$/, "");
export async function open({ vp = "phone", out, extra = {} } = {}) {
  const size = vp === "desktop" ? { viewport: { width: 1280, height: 800 } } : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
  const browser = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome", args: ["--no-sandbox"] });
  const ctx = await browser.newContext({ ...size, acceptDownloads: true, ...extra });
  const page = await ctx.newPage();
  const log = { console: [], pageerrors: [], failed: [] };
  page.on("console", (m) => { if (["error", "warning"].includes(m.type()) && !/Permissions-Policy header: Unrecognized feature: 'notifications'/.test(m.text())) log.console.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on("pageerror", (e) => log.pageerrors.push(String(e).slice(0, 300)));
  page.on("requestfailed", (r) => log.failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => { if (r.status() >= 400) log.failed.push(`${r.status()} ${r.url()}`); });
  const results = [];
  const shot = async (name) => { const f = `${out}/${vp}-${name}.png`; await page.screenshot({ path: f }).catch(() => {}); return f; };
  async function step(name, fn) {
    const before = { c: log.console.length, e: log.pageerrors.length, f: log.failed.length };
    let status = "pass", detail = "";
    try { const r = await fn(); if (r && typeof r === "object") { status = r.status || "pass"; detail = r.detail || ""; } else detail = r ?? ""; }
    catch (e) { status = "fail"; detail = String(e.message || e).split("\n")[0].slice(0, 300); }
    const row = { step: name, status, detail: String(detail).slice(0, 600), console: log.console.slice(before.c), pageerrors: log.pageerrors.slice(before.e), failed: log.failed.slice(before.f), shot: await shot(name.replace(/[^a-z0-9]+/gi, "_")) };
    results.push(row); console.log(`${status.toUpperCase()} ${name} :: ${row.detail}${row.pageerrors.length ? " PAGEERR " + row.pageerrors.join("|") : ""}${row.console.length ? " CONSOLE " + row.console.join("|") : ""}`);
    return row;
  }
  const go = async (hash) => { if (new URL(page.url()).pathname !== "/" || page.url() === "about:blank") await page.goto(BASE + "/" + hash, { waitUntil: "networkidle" }); else { await page.evaluate((h) => { location.hash = h; }, hash); await page.waitForTimeout(900); } };
  const state = () => page.evaluate(() => { try { const s = JSON.parse(localStorage.getItem("rivetcare-v1") || "null"); if (!s) return null; return { ...s, ...(s.coaches?.[s.modelId] || {}), _root: s }; } catch { return "unreadable"; } });
  const idbCount = (db = "rivetcare-files", store = "blobs") => page.evaluate(([db, store]) => new Promise(async (res) => { const list = await indexedDB.databases(); if (!list.some((x) => x.name === db)) return res(0); const r = indexedDB.open(db); r.onsuccess = () => { const d = r.result; if (!d.objectStoreNames.contains(store)) { d.close(); return res(-1); } const t = d.transaction(store).objectStore(store).count(); t.onsuccess = () => { res(t.result); d.close(); }; t.onerror = () => res(-2); }; r.onerror = () => res(-3); }), [db, store]);
  const save = () => fs.writeFileSync(`${out}/results-${vp}.json`, JSON.stringify(results, null, 1));
  const firstRun = async () => { await page.goto(BASE + "/", { waitUntil: "networkidle" }); await page.click("#disclaimer-accept"); await page.waitForTimeout(400); };
  return { browser, ctx, page, log, results, step, shot, go, state, idbCount, save, firstRun };
}
