// CSP click-through for the enforcing policy. Needs a production build served locally:
//   npm run build && npm run preview    (serves http://127.0.0.1:8081)
//   node tools/csp-smoke.mjs [base]
// Opens each bottom-nav section and the first few buttons on each, and lists every CSP
// violation (securitypolicyviolation events plus console reports).
// Not covered: the grok.com preview frame, the platform's extensions.js on the live host,
// real photo/PDF files, share sheets.
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:8081";
const seed = () => {
  if (!localStorage.getItem("rivetcare-v1")) localStorage.setItem("rivetcare-v1", JSON.stringify({ accepted: true, ready: true }));
  document.addEventListener("securitypolicyviolation", (e) => {
    (window.__csp ??= []).push(`${e.disposition} ${e.effectiveDirective} ${e.blockedURI || "(inline)"} ${e.sourceFile ?? ""}:${e.lineNumber ?? ""}`);
  });
};

const browser = await chromium.launch();
const violations = new Set();
const errors = [];
let headerOk = false;
try {
  const ctx = await browser.newContext();
  await ctx.addInitScript(seed);
  const page = await ctx.newPage();
  page.on("console", (m) => {
    const t = m.text();
    if (/Content.Security.Policy/i.test(t)) violations.add(`console: ${t.slice(0, 300)}`);
    else if (m.type() === "error") errors.push(t.slice(0, 300));
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 300)}`));
  const res = await page.goto(BASE);
  const csp = res?.headers()["content-security-policy"] ?? "";
  headerOk = /frame-ancestors https:\/\/grok\.com/.test(csp) && /https:\/\/grok\.com/.test(csp) && !/fonts\.googleapis\.com/.test(csp);
  console.log(`${headerOk ? "PASS" : "FAIL"} document has an enforcing CSP framed only by https grok.com`);
  await page.waitForTimeout(1500);
  const nav = page.getByRole("navigation", { name: "Sections" });
  const sections = await nav.getByRole("button").allInnerTexts();
  for (const name of sections) {
    await nav.getByRole("button", { name: name.trim() }).first().click().catch(() => undefined);
    await page.waitForTimeout(600);
    const buttons = page.locator("#content button");
    const n = Math.min(await buttons.count(), 6);
    for (let i = 0; i < n; i++) {
      await buttons.nth(i).click({ timeout: 2000 }).catch(() => undefined);
      await page.waitForTimeout(300);
      await page.keyboard.press("Escape");
      await nav.getByRole("button", { name: name.trim() }).first().click().catch(() => undefined);
      await page.waitForTimeout(200);
    }
    console.log(`visited ${name.trim()} (${n} buttons)`);
  }
  for (const v of await page.evaluate(() => window.__csp ?? [])) violations.add(v);
  await ctx.close();
} finally {
  await browser.close();
}
console.log(`CSP violations: ${violations.size}`);
for (const v of violations) console.log(`  ${v}`);
if (errors.length) console.log(`other console errors: ${errors.length}\n  ${[...new Set(errors)].slice(0, 10).join("\n  ")}`);
process.exit(headerOk && violations.size === 0 ? 0 : 1);
