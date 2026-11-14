import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const sw = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
const book = readFileSync(new URL("../src/lib/book-version.ts", import.meta.url), "utf8");
const vite = readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
const published = readFileSync(new URL("../public/version.txt", import.meta.url), "utf8").trim();

test("the book version is package.json, and the shell cache is stamped from it", () => {
  assert.equal(typeof pkg.version, "string");
  assert.match(pkg.version, /^\d{4}\.\d{1,2}\.\d{1,2}$/);
  assert.match(book, /package\.json/);
  assert.match(book, /pkg\.version/);
  assert.match(sw, /rivetcare-shell-__BOOK_VERSION__/);
  assert.doesNotMatch(sw, /rivetcare-shell-20\d\d/);
  assert.match(vite, /__BOOK_VERSION__/);
  assert.match(vite, /package\.json/);
  assert.match(vite, /replaceAll\(token, bookVersion\)/);
  assert.equal(published, pkg.version);
  assert.match(sw, /version\.txt/);
  assert.match(sw, /cache: "no-store"/);
  assert.match(sw, /precacheShell\(\)\.catch\(\(\) => undefined\)/);
  assert.doesNotMatch(sw, /client\.navigate/);
  assert.match(sw, /A newer copy is ready\./);
  assert.match(sw, /__rivetcare_update/);
  assert.equal(sw.split("/splash/brand.jpg").length - 1, 2);
});
