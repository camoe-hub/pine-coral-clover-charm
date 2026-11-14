import { chromium } from "/workspace/node_modules/playwright-core/index.mjs";
const CHROME = "/opt/pw-browsers/chromium-1248/chrome-linux64/chrome";
const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.locator("#disclaimer-accept").click();
await page.locator("#setup-year").fill("2021");
await page.getByRole("dialog", { name: "Set up this trailer" }).getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(300);
await page.evaluate(() => { location.hash = "#/weights"; });
await page.waitForTimeout(400);
const cases = {
  "6.45": { truckFront: "2000", truckRear: "3000", bareFront: "2200", bareRear: "3200", bareTrailer: "5800" },
  "9.99": { truckFront: "2000", truckRear: "2000", bareFront: "1999", bareRear: "3000", bareTrailer: "9001" },
  "10": { truckFront: "2000", truckRear: "2000", bareFront: "2500", bareRear: "2500", bareTrailer: "9000" },
  "12": { truckFront: "2000", truckRear: "2000", bareFront: "2600", bareRear: "2600", bareTrailer: "8800" },
  "15": { truckFront: "2000", truckRear: "2000", bareFront: "2700", bareRear: "2800", bareTrailer: "8500" },
  "16": { truckFront: "2000", truckRear: "2000", bareFront: "2800", bareRear: "2800", bareTrailer: "8400" },
};
for (const [name, values] of Object.entries(cases)) {
  for (const [id, value] of Object.entries(values)) await page.locator("#" + id).fill(value);
  for (const id of ["wdFront", "wdRear", "wdTrailer"]) await page.locator("#" + id).fill("");
  await page.waitForTimeout(150);
  const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  const share = (text.match(/Tongue as a share of the loaded trailer [^T]+/) || [""])[0];
  const band = (text.match(/The usual band is 10–15%/g) || []).length;
  const passFail = /safe to tow|go light|caution light|\bPass\b|\bFail\b/.test(text.slice(text.indexOf("What the hitch")));
  console.log(name, "bands", band, "hitchPassFail", passFail, "::", share.slice(0, 180));
}
await browser.close();
