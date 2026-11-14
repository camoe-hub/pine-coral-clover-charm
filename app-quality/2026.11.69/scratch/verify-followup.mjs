import { chromium } from "/workspace/node_modules/playwright-core/index.mjs";
import fs from "node:fs";

const CHROME = "/opt/pw-browsers/chromium-1248/chrome-linux64/chrome";
const BASE = "http://127.0.0.1:8080";
const OUT = "/workspace/app-quality/2026.11.69/scratch/shots";
fs.mkdirSync(OUT, { recursive: true });
const notes = [];
const note = (name, ok, detail) => {
  notes.push({ name, ok, detail: String(detail).slice(0, 1200) });
  console.log(`${ok ? "PASS" : "FAIL"} ${name} :: ${String(detail).slice(0, 500)}`);
};

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });

async function context(vp, ua) {
  const size =
    vp === "desktop"
      ? { viewport: { width: 1280, height: 800 } }
      : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
  return browser.newContext({ ...size, userAgent: ua });
}

const wide = await context("phone");
const page = await wide.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.locator("#disclaimer-accept").click();
await page.locator("#setup-year").fill("2021");
await page.getByRole("dialog", { name: "Set up this trailer" }).getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(500);

async function offenders(p) {
  return p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const pageOverflow = document.documentElement.scrollWidth - vw;
    const nodes = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width < 2) continue;
      if (r.right > vw + 2 || r.left < -2) {
        const cs = getComputedStyle(el);
        nodes.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || "",
          cls: String(el.className).slice(0, 80),
          right: Math.round(r.right),
          left: Math.round(r.left),
          w: Math.round(r.width),
          ox: cs.overflowX,
          text: (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent : "").trim().slice(0, 60),
        });
      }
    }
    nodes.sort((a, b) => b.right - a.right);
    return { vw, pageOverflow, scrollWidth: document.documentElement.scrollWidth, nodes: nodes.slice(0, 12) };
  });
}

const routes = ["#/weights", "#/parts", "#/fix", "#/care", "#/records", "#/tires", "#/level", "#/support", "#/privacy", "#/offline", "#/more"];
const phoneOverflow = {};
for (const hash of routes) {
  await page.evaluate((h) => {
    location.hash = h;
  }, hash);
  await page.waitForTimeout(600);
  phoneOverflow[hash] = await offenders(page);
  console.log(hash, "overflow", phoneOverflow[hash].pageOverflow, "top", JSON.stringify(phoneOverflow[hash].nodes[0] || null));
}
await page.screenshot({ path: `${OUT}/phone-weights-overflow.png` });
note(
  "phone page overflow by screen",
  Object.values(phoneOverflow).every((row) => row.pageOverflow <= 1),
  JSON.stringify(
    Object.fromEntries(Object.entries(phoneOverflow).map(([k, v]) => [k, { overflow: v.pageOverflow, top: v.nodes.slice(0, 3) }])),
  ),
);

// Desktop
const desk = await context("desktop");
const dp = await desk.newPage();
const dlog = { pageerrors: [], console: [] };
dp.on("pageerror", (e) => dlog.pageerrors.push(String(e).slice(0, 200)));
dp.on("console", (m) => {
  if (m.type() === "error") dlog.console.push(m.text().slice(0, 180));
});
await dp.goto(BASE + "/", { waitUntil: "networkidle" });
await dp.locator("#disclaimer-accept").click();
await dp.getByRole("dialog", { name: "Set up this trailer" }).getByRole("button", { name: "Not now" }).click();
await dp.waitForTimeout(400);
await dp.screenshot({ path: `${OUT}/desktop-home.png` });
const deskOverflow = {};
for (const hash of ["", "#/fix", "#/parts", "#/weights", "#/records", "#/support", "#/privacy"]) {
  if (hash) {
    await dp.evaluate((h) => {
      location.hash = h;
    }, hash);
    await dp.waitForTimeout(500);
  }
  deskOverflow[hash || "/"] = await offenders(dp);
  console.log("desk", hash || "/", deskOverflow[hash || "/"].pageOverflow);
}
await dp.screenshot({ path: `${OUT}/desktop-weights.png` });
note(
  "desktop page overflow",
  Object.values(deskOverflow).every((row) => row.pageOverflow <= 1),
  JSON.stringify(Object.fromEntries(Object.entries(deskOverflow).map(([k, v]) => [k, v.pageOverflow]))),
);
note("desktop page errors", dlog.pageerrors.length === 0, dlog.pageerrors.join(" | ") || "none");
note("desktop console errors", dlog.console.length === 0, dlog.console.slice(0, 6).join(" | ") || "none");

// iPhone install path
const ios = await context(
  "phone",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
);
const ip = await ios.newPage();
await ip.goto(BASE + "/", { waitUntil: "networkidle" });
await ip.locator("#disclaimer-accept").click();
await ip.getByRole("dialog", { name: "Set up this trailer" }).getByRole("button", { name: "Not now" }).click();
await ip.waitForTimeout(400);
await ip.getByRole("button", { name: "Add", exact: true }).click();
await ip.waitForTimeout(1000);
const installText = (await ip.locator("body").innerText()).replace(/\s+/g, " ");
const installHtml = await ip.content();
await ip.screenshot({ path: `${OUT}/phone-install.png`, fullPage: true });
note(
  "iPhone Add opens a page named RivetCare with a real theme color",
  /Add RivetCare/.test(installText) && !installHtml.includes("{{THEME_COLOR}}") && !installHtml.includes("{{APP_NAME}}"),
  `url=${ip.url()} title=${await ip.title()} text=${installText.slice(0, 300)} theme=${(installHtml.match(/theme-color" content="[^"]+"/) || [])[0] || "none"}`,
);

// Direct install URL, the same address the Add button uses.
await ip.goto(BASE + "/?install=1&platform=ios", { waitUntil: "networkidle" });
const directText = (await ip.locator("body").innerText()).replace(/\s+/g, " ");
const directHtml = await ip.content();
await ip.screenshot({ path: `${OUT}/phone-install-direct.png`, fullPage: false });
note(
  "install URL itself is RivetCare",
  /Add RivetCare/.test(directText) && !directHtml.includes("{{"),
  `title=${await ip.title()} text=${directText.slice(0, 240)} leftover=${directHtml.includes("{{")}`,
);

// Offline friendly page
const off = await context("phone");
const op = await off.newPage();
await op.goto(BASE + "/", { waitUntil: "networkidle" });
await op.locator("#disclaimer-accept").click();
await op.getByRole("dialog", { name: "Set up this trailer" }).getByRole("button", { name: "Not now" }).click();
await op.waitForTimeout(300);
await op.evaluate(() => navigator.serviceWorker?.ready).catch(() => {});
await op.reload({ waitUntil: "networkidle" });
await op.waitForTimeout(800);
const swInfo = await op.evaluate(async () => ({
  controlled: !!navigator.serviceWorker?.controller,
  script: navigator.serviceWorker?.controller?.scriptURL || "",
  keys: await caches.keys().catch(() => []),
}));
await off.setOffline(true);
let navErr = "";
await op.goto(BASE + "/#/privacy", { waitUntil: "load" }).catch((e) => {
  navErr = e.message;
});
await op.waitForTimeout(1500);
const body = (await op.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 600);
await op.screenshot({ path: `${OUT}/phone-offline-privacy.png` });
const friendly = /isn't on (the|this) phone yet|Privacy|Home is still on this phone|Save for offline|Back to Home/.test(body);
note(
  "unsaved Privacy offline is friendly",
  friendly && body.trim() !== "Offline",
  `navErr=${navErr} sw=${JSON.stringify(swInfo)} body=${body}`,
);

// A screen that is on the save list, visited once, then offline reload of that hash.
await off.setOffline(false);
await op.goto(BASE + "/#/support", { waitUntil: "networkidle" }).catch(() => {});
await op.waitForTimeout(600);
await off.setOffline(true);
await op.reload({ waitUntil: "load" }).catch((e) => note("support reload error", false, e.message));
await op.waitForTimeout(1200);
const supportBody = (await op.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 400);
await op.screenshot({ path: `${OUT}/phone-offline-support.png` });
note("Support still readable after it was opened, then the signal dropped", /Support/.test(supportBody), supportBody);

fs.writeFileSync("/workspace/app-quality/2026.11.69/scratch/followup.json", JSON.stringify({ notes, phoneOverflow, deskOverflow, errors }, null, 2));
await browser.close();
const failed = notes.filter((row) => !row.ok);
console.log(`${notes.length - failed.length} pass / ${failed.length} fail`);
