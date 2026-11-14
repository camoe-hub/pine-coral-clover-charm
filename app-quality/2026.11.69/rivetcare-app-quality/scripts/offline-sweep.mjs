// Offline sweep after tapping Save for offline: every screen loaded with full page loads while offline. Note: page.goto between URLs that differ only by #hash is a same-document navigation; once the error page shows, later hashes stay on it. Read the FIRST failure. Usage: node offline-sweep.mjs
import { open, BASE } from "/workspace/shared/app-quality/scripts/func-lib.mjs";
import fs from "node:fs";
const out = "/workspace/shared/app-quality/r9-evidence/offline-saved"; fs.mkdirSync(out, { recursive: true });
const T = await open({ vp: "phone", out });
const { page: p, step, ctx, log } = T;
await T.firstRun();
const nn = p.getByRole("dialog", { name: "Set up this coach" }).getByRole("button", { name: "Not now" }); if (await nn.count()) await nn.click();
await p.evaluate(() => navigator.serviceWorker.ready); await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(2000);
await step("save for offline (Offline screen)", async () => { await p.evaluate(() => { location.hash = "#/offline"; }); await p.waitForTimeout(1200); await p.getByRole("button", { name: "Save for offline" }).click(); await p.getByText("Saved for offline.").waitFor({ timeout: 90000 }); return (await p.locator("main").innerText()).replace(/\n+/g, " | ").slice(0, 600); });
const cached = await p.evaluate(async () => { const c = await caches.open((await caches.keys()).find((k) => k.includes("shell"))); return (await c.keys()).map((r) => new URL(r.url).pathname); });
fs.writeFileSync(`${out}/cached-before-offline.json`, JSON.stringify(cached, null, 1));
await ctx.setOffline(true);
const routes = ["", "#/care", "#/records", "#/fix", "#/more", "#/procedures", "#/procedure/lugs", "#/parts", "#/part/lugnut", "#/lists", "#/checklist/pretrip", "#/specs", "#/weights", "#/level", "#/tires", "#/supplies", "#/service", "#/recalls", "#/codes", "#/log", "#/backup", "#/privacy", "#/history", "#/notes", "#/desk", "#/manuals", "#/tools", "#/about", "#/printout", "#/flows", "#/flow/dead-12", "#/figures", "#/figure/p92-1", "#/table", "#/symptom/no-12v/0", "#/offline", "#/support"];
for (const r of routes) await step(`offline ${r || "/"}`, async () => {
  await p.goto(BASE + "/" + r, { waitUntil: "load" }); await p.waitForTimeout(1500);
  const t = (await p.locator("body").innerText()).replace(/\n+/g, " | ");
  const bad = /Something went wrong/.test(t);
  return { status: bad ? "fail" : "pass", detail: bad ? t.match(/Something went wrong[^|]*\|[^|]*/)[0] : (await p.locator("main h1").first().innerText().catch(() => "(no h1)")) };
});
T.save(); await T.browser.close();
const res = JSON.parse(fs.readFileSync(`${out}/results-phone.json`)); console.log("cached", cached.length, "fails:", res.filter((r) => r.status === "fail").map((r) => r.step).join(", "));
