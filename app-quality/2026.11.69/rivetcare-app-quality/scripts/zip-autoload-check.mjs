// Counts how many bytes of the project zip the home screen downloads on load. Usage: node zip-autoload-check.mjs
import { open, BASE } from "/workspace/shared/app-quality/scripts/func-lib.mjs";
const T = await open({ vp: "phone", out: "/tmp" }); const p = T.page; const hits = [];
p.on("requestfinished", async (r) => { if (r.url().includes("rivetcare-book.zip")) { const s = await r.sizes().catch(() => null); hits.push(`${r.method()} ${s?.responseBodySize ?? "?"} B`); } });
await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(3000);
console.log("first load (disclaimer showing):", hits.join(", ") || "none");
await p.click("#disclaimer-accept"); await p.getByRole("dialog", { name: "Set up this coach" }).getByRole("button", { name: "Not now" }).click();
hits.length = 0; await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(3000); console.log("reload after 'Not now':", hits.join(", ") || "none");
hits.length = 0; await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(3000); console.log("second reload:", hits.join(", ") || "none");
await T.browser.close();
