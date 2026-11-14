// axe-core sweep of 39 screens. Needs axe-core installed (AXE_DIR, default /workspace/app-quality/r9/harness/node_modules/axe-core). Usage: node axe-sweep.mjs [phone|desktop]
import { open, BASE } from "/workspace/shared/app-quality/scripts/func-lib.mjs";
import fs from "node:fs";
const axe = fs.readFileSync((process.env.AXE_DIR || "/workspace/app-quality/r9/harness/node_modules/axe-core") + "/axe.min.js", "utf8");
const vp = process.argv[2] || "phone";
const T = await open({ vp, out: "/tmp" }); const p = T.page;
await T.firstRun(); await p.getByRole("dialog", { name: "Set up this coach" }).getByRole("button", { name: "Not now" }).click();
const routes = ["", "#/care", "#/records", "#/fix", "#/more", "#/procedures", "#/procedure/lugs", "#/parts", "#/part/lugnut", "#/lists", "#/checklist/pretrip", "#/specs", "#/weights", "#/level", "#/tires", "#/supplies", "#/service", "#/recalls", "#/codes", "#/log", "#/backup", "#/privacy", "#/history", "#/notes", "#/desk", "#/manuals", "#/tools", "#/about", "#/printout", "#/flows", "#/flow/dead-12", "#/figures", "#/figure/p92-1", "#/figure/fc-seelevel", "#/table", "#/symptom/no-12v/0", "#/sheet/1", "#/offline", "#/support"];
const all = {};
for (const r of routes) {
  await p.goto(BASE + "/" + r, { waitUntil: "networkidle" }); await p.waitForTimeout(700);
  await p.evaluate(axe);
  const res = await p.evaluate(async () => (await window.axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, t: v.nodes.slice(0, 2).map((x) => x.target.join(" ")) })));
  all[r || "/"] = res;
}
fs.writeFileSync(`/workspace/shared/app-quality/r9-evidence/axe-${vp}.json`, JSON.stringify(all, null, 1));
const agg = {}; for (const [r, vs] of Object.entries(all)) for (const v of vs) { agg[v.id] ??= { impact: v.impact, help: v.help, routes: [], nodes: 0, ex: v.t }; agg[v.id].routes.push(r); agg[v.id].nodes += v.n; }
for (const [id, a] of Object.entries(agg)) console.log(`${a.impact} ${id} (${a.help}) nodes=${a.nodes} routes=${a.routes.length}: ${a.routes.slice(0, 6).join(",")} ex=${a.ex.join(" | ").slice(0, 160)}`);
await T.browser.close();
