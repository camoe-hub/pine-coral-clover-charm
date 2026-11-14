import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { packSource, skipRel } from "./pack-source.mjs";

function zipNames(buf) {
  const sig = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const eocd = buf.lastIndexOf(sig);
  assert.ok(eocd >= 0, "zip has no end record");
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  const names = [];
  for (let i = 0; i < count; i++) {
    assert.equal(buf.readUInt32LE(off), 0x02014b50);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    names.push(buf.subarray(off + 46, off + 46 + nameLen).toString("utf8"));
    off += 46 + nameLen + extraLen + commentLen;
  }
  return names;
}

test("research and screenshots stay out of the downloadable project zip", () => {
  assert.equal(skipRel("attachments/Academy maintenance procedures.md"), true);
  assert.equal(skipRel("attachments/airstream-maintenance.zip"), true);
  assert.equal(skipRel("screenshots/home.png"), true);
  assert.equal(skipRel(".grok/app-env.json"), false);
  assert.equal(skipRel(".gitignore"), false);
  assert.equal(skipRel(".env.example"), false);
  assert.equal(skipRel(".env"), true);
  assert.equal(skipRel(".grok/skills/og/SKILL.md"), true);
  assert.equal(skipRel(".grok/preview.log"), true);
  assert.equal(skipRel("public/rivetcare-book.zip"), true);
  assert.equal(skipRel("src/data/procedures.ts"), false);
  assert.equal(skipRel("src/data/shops.json"), false);
  assert.equal(skipRel("SOURCES.md"), false);

  packSource();
  const names = zipNames(readFileSync(new URL("../public/rivetcare-book.zip", import.meta.url)));
  assert.ok(names.includes("README.md"));
  assert.ok(names.includes(".gitignore"));
  assert.ok(names.includes(".env.example"));
  assert.equal(names.includes(".env"), false);
  assert.ok(names.includes(".grok/app-env.json"));
  assert.equal(readFileSync(new URL("../src/lib/auth/preview.ts", import.meta.url), "utf8").includes("8bcdb7fc"), false);
  assert.ok(names.includes("src/data/procedures.ts"));
  assert.ok(names.includes("src/data/shops.json"));
  assert.ok(names.includes("SOURCES.md"));
  for (const name of names) {
    assert.equal(name.startsWith("attachments/"), false, name);
    assert.equal(name.startsWith("screenshots/"), false, name);
    assert.equal(name.startsWith(".grok/") && name !== ".grok/app-env.json", false, name);
  }
  assert.equal(names.some((name) => name.includes("Academy maintenance")), false);
});
