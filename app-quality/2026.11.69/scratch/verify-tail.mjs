import { chromium } from "/workspace/node_modules/playwright-core/index.mjs";
import fs from "node:fs";

const CHROME = "/opt/pw-browsers/chromium-1248/chrome-linux64/chrome";
const BASE = "http://127.0.0.1:8080";
const OUT = "/workspace/app-quality/2026.11.69/scratch/shots";
const notes = [];
const note = (name, ok, detail) => {
  notes.push({ name, ok, detail: String(detail).slice(0, 1500) });
  console.log(`${ok ? "PASS" : "FAIL"} ${name} :: ${String(detail).slice(0, 600)}`);
};

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const pageerrors = [];
page.on("pageerror", (e) => pageerrors.push(String(e).slice(0, 240)));
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await page.locator("#disclaimer-accept").click();
await page.locator("#setup-year").fill("2021");
await page.getByRole("dialog", { name: "Set up this trailer" }).getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(400);
await page.evaluate(() => {
  location.hash = "#/weights";
});
await page.waitForTimeout(600);
for (const [id, value] of Object.entries({
  truckFront: "2000",
  truckRear: "2000",
  bareFront: "2800",
  bareRear: "2800",
  bareTrailer: "8400",
})) {
  await page.locator("#" + id).fill(value);
}
await page.waitForTimeout(400);
const wide = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const nodes = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width > 8 && (r.right > vw + 2 || el.scrollWidth > vw + 8)) {
      nodes.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        cls: String(el.className).toString().slice(0, 90),
        right: Math.round(r.right),
        sw: el.scrollWidth,
        cw: el.clientWidth,
        text: (el.innerText || "").replace(/\s+/g, " ").slice(0, 70),
      });
    }
  }
  nodes.sort((a, b) => b.right - a.right || b.sw - a.sw);
  return { vw, page: document.documentElement.scrollWidth - vw, nodes: nodes.slice(0, 8) };
});
await page.screenshot({ path: `${OUT}/phone-weights-filled.png` });
note("filled weights page fits a 390px phone", wide.page <= 1, JSON.stringify(wide));

const tongue = (await page.locator("main").innerText()).replace(/\s+/g, " ");
const sentences = tongue.match(/Tongue weight is \d+\.\d+% of the loaded trailer\. The usual band is 10–15%\./g) || [];
note(
  "16% tongue share is one plain sentence",
  sentences.length === 1 && tongue.includes("16.00%") && !/safe to tow|go light|caution light/i.test(tongue),
  sentences.join(" | ") || tongue.slice(tongue.indexOf("Tongue as a share"), tongue.indexOf("Tongue as a share") + 220),
);

// Offline with a bounded wait. Do not hang on serviceWorker.ready.
const off = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const op = await off.newPage();
await op.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await op.locator("#disclaimer-accept").click();
await op.getByRole("dialog", { name: "Set up this trailer" }).getByRole("button", { name: "Not now" }).click();
await op.waitForTimeout(500);
const swInfo = await op.evaluate(async () => {
  const ready = navigator.serviceWorker?.ready;
  const winner = await Promise.race([
    ready,
    new Promise((resolve) => setTimeout(() => resolve("timeout"), 4000)),
  ]);
  return {
    controlled: !!navigator.serviceWorker?.controller,
    script: navigator.serviceWorker?.controller?.scriptURL || "",
    ready: winner === "timeout" ? "timeout" : "ready",
    keys: await caches.keys().catch(() => []),
  };
});
await off.setOffline(true);
let navErr = "";
await op.goto(BASE + "/#/privacy", { waitUntil: "commit", timeout: 8000 }).catch((e) => {
  navErr = String(e.message || e).slice(0, 200);
});
await op.waitForTimeout(1200);
let body = "";
try {
  body = (await op.locator("body").innerText({ timeout: 3000 })).replace(/\s+/g, " ").slice(0, 500);
} catch (e) {
  body = `unreadable ${e.message}`;
}
await op.screenshot({ path: `${OUT}/phone-offline-privacy.png` }).catch(() => {});
note(
  "offline Privacy is a friendly page",
  /isn't on (the|this) phone yet|Privacy|Home is still on this phone|Back to Home|Save for offline/.test(body) && body.trim() !== "Offline",
  `nav=${navErr || "ok"} sw=${JSON.stringify(swInfo)} body=${body}`,
);

fs.writeFileSync("/workspace/app-quality/2026.11.69/scratch/tail.json", JSON.stringify({ notes, pageerrors }, null, 2));
await browser.close();
console.log("done", notes.filter((n) => !n.ok).length, "fail");
