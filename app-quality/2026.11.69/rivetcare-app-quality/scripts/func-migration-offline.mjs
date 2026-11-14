// C: old silverbook-v1 key read + delete-my-data leftovers; D: SW install and offline reload of key screens. Usage: node func-migration-offline.mjs
import { open, BASE } from "/workspace/shared/app-quality/scripts/func-lib.mjs";
import fs from "node:fs";
const out = "/workspace/shared/app-quality/r9-evidence/func-cd"; fs.mkdirSync(out, { recursive: true });
{
  const T = await open({ vp: "phone", out });
  const { page: p, step, state } = T;
  await step("C01 records saved under the 11.34 key (silverbook-v1) are read by 11.50", async () => {
    await T.firstRun();
    const d = p.getByRole("dialog", { name: "Set up this coach" });
    await d.getByLabel("Lifetime miles, optional").fill("5555"); await d.getByRole("button", { name: "Continue" }).click(); await p.waitForTimeout(600);
    await p.evaluate(() => { location.hash = "#/notes"; }); await p.waitForTimeout(900);
    await p.getByLabel("New note").fill("OLD-KEY NOTE"); await p.getByRole("button", { name: "Save note" }).click(); await p.waitForTimeout(500);
    // Simulate a phone that last ran 2026.11.34: same record JSON, stored under the old localStorage key.
    await p.evaluate(() => { const v = localStorage.getItem("rivetcare-v1"); localStorage.setItem("silverbook-v1", v); localStorage.setItem("silverbook-theme", "dark"); for (const k of Object.keys(localStorage)) if (k.startsWith("rivetcare-")) localStorage.removeItem(k); });
    await p.goto(BASE + "/", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
    const disclaimer = await p.locator("#disclaimer-dialog").count();
    const s = await state(); const old = await p.evaluate(() => localStorage.getItem("silverbook-v1")?.length ?? 0);
    const read = s && JSON.stringify(s).includes("OLD-KEY NOTE");
    return { status: read ? "pass" : "fail", detail: `after reload: disclaimer shown again=${!!disclaimer}; rivetcare-v1 has the note=${!!read}; silverbook-v1 still on phone (${old} chars), never read` };
  });
  await step("C02 delete-my-data leaves silverbook-* records on the phone", async () => {
    if (await p.locator("#disclaimer-accept").count()) await p.click("#disclaimer-accept");
    const nn = p.getByRole("dialog", { name: "Set up this coach" }).getByRole("button", { name: "Not now" }); if (await nn.count()) await nn.click();
    await p.evaluate(() => { location.hash = "#/privacy"; }); await p.waitForTimeout(900);
    await p.getByRole("button", { name: "Delete all local records" }).click(); await p.waitForTimeout(300);
    await p.locator("main button").filter({ hasText: /Delete|Erase|Yes/ }).first().click(); await p.waitForTimeout(3500); await p.waitForLoadState("networkidle");
    const left = await p.evaluate(() => Object.keys(localStorage));
    const has = left.filter((k) => k.startsWith("silverbook-"));
    return { status: has.length ? "fail" : "pass", detail: `localStorage after delete: ${JSON.stringify(left)}` };
  });
  T.save(); fs.renameSync(`${out}/results-phone.json`, `${out}/results-C-phone.json`); await T.browser.close();
}
{
  const T = await open({ vp: "phone", out });
  const { page: p, step, ctx, log } = T;
  await step("D01 service worker installs and controls the page", async () => {
    await T.firstRun();
    const nn = p.getByRole("dialog", { name: "Set up this coach" }).getByRole("button", { name: "Not now" }); if (await nn.count()) await nn.click();
    await p.evaluate(() => navigator.serviceWorker.ready); await p.reload({ waitUntil: "networkidle" });
    for (const h of ["#/fix", "#/figure/p92-1", "#/figure/fc-seelevel", "#/symptom/no-12v/0", "#/parts"]) { await p.evaluate((x) => { location.hash = x; }, h); await p.waitForTimeout(1200); }
    await p.waitForTimeout(3000);
    const info = await p.evaluate(async () => ({ ctrl: !!navigator.serviceWorker.controller, caches: await Promise.all((await caches.keys()).map(async (k) => [k, (await (await caches.open(k)).keys()).length])) }));
    return { status: info.ctrl ? "pass" : "fail", detail: JSON.stringify(info) };
  });
  await step("D02 offline reload renders home", async () => {
    await ctx.setOffline(true); log.failed.length = 0;
    await p.goto(BASE + "/", { waitUntil: "load" }).catch((e) => { throw new Error("offline nav failed: " + e.message); }); await p.waitForTimeout(2500);
    const t = (await p.locator("body").innerText()).slice(0, 160).replace(/\n+/g, " | ");
    return { status: /RivetCare/.test(t) ? "pass" : "fail", detail: `${t} | failed requests: ${log.failed.slice(0, 6).join(" ; ")}` };
  });
  for (const [h, re] of [["#/fix", /By system|Troubleshoot|Symptom/], ["#/symptom/no-12v/0", /No 12 V/], ["#/figure/p92-1", /15 A HACR/], ["#/figure/fc-seelevel", /SeeLevel/], ["#/codes", /Fault codes/], ["#/level", /Floor level/], ["#/weights", /Truck and trailer/], ["#/service", /Find a shop/], ["#/figure/p14-1", /./]]) {
    await step(`D03 offline ${h}`, async () => {
      const f0 = log.failed.length; await p.evaluate((x) => { location.hash = x; }, h); await p.waitForTimeout(1800);
      const t = (await p.locator("main").innerText().catch(() => "")).replace(/\n+/g, " | ");
      const imgs = await p.evaluate(() => [...document.querySelectorAll("main img")].map((i) => `${i.getAttribute("src")}:${i.complete && i.naturalWidth > 0}`));
      return { status: re.test(t) ? "pass" : "fail", detail: `${t.slice(0, 160)} imgs=${JSON.stringify(imgs).slice(0, 200)} failed=${log.failed.slice(f0).join(" ; ").slice(0, 200)}` };
    });
  }
  await ctx.setOffline(false);
  T.save(); fs.renameSync(`${out}/results-phone.json`, `${out}/results-D-phone.json`); await T.browser.close();
}
