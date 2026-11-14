import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const extra = JSON.parse(readFileSync(new URL("../src/data/extra-symptoms.json", import.meta.url), "utf8"));
const procedures = readFileSync(new URL("../src/data/procedures.ts", import.meta.url), "utf8");
const privacy = [
  readFileSync(new URL("../src/components/privacy-view.tsx", import.meta.url), "utf8"),
  readFileSync(new URL("../src/components/legal-copy.tsx", import.meta.url), "utf8"),
  readFileSync(new URL("../src/lib/erase-databases.ts", import.meta.url), "utf8"),
].join("\n");

const HANDLES = ["gixxer", "jmpratt", "Foiled Again", "rickandsandi", "Snowey", "NCstream", "Spinonedad", "Wazbro"];

describe("owner-report text", () => {
  it("does not keep dead bracket citations or forum handles", () => {
    const blob = JSON.stringify(extra);
    assert.equal(/\[\d/.test(blob), false);
    assert.equal(/see also ref/i.test(blob), false);
    for (const name of HANDLES) assert.equal(blob.toLowerCase().includes(name.toLowerCase()), false, name);
  });

  it("keeps the entry door and the Fantastic Fan as separate cards", () => {
    const door = extra.find((row) => row.id === "x-entry-door-hard-to-close-or-the-upper-lock-jams");
    assert.ok(door);
    assert.equal(JSON.stringify(door).includes("Fantastic Fan"), false);
    assert.ok(extra.some((row) => row.title === "A-frame flex, tongue-jack level, and weight-distribution bars"));
    const tires = extra.find((row) => row.id.startsWith("x-tires-and-wheels"));
    assert.equal(JSON.stringify(tires).includes("A-frame"), false);
  });
});

describe("procedures", () => {
  it("names a source and a revision on every procedure", () => {
    const ids = [...procedures.matchAll(/id: "([^"]+)"/g)].map((match) => match[1]);
    assert.ok(ids.length >= 20);
    for (const id of ids) {
      const start = procedures.indexOf(`id: "${id}"`);
      const next = procedures.indexOf("\n  {", start + 1);
      const block = procedures.slice(start, next === -1 ? undefined : next);
      assert.equal(block.includes("source:"), true, id);
      assert.equal(block.includes('revised: "November 2026"'), true, id);
    }
  });
});

describe("privacy deletion", () => {
  it("names every local record key the app writes", () => {
    for (const key of [
      "rivetcare-v1",
      "rivetcare-v1-unreadable",
      "rivetcare-v1-before-trim",
      "rivetcare-weights",
      "rivetcare-theme",
      "rivetcare-spoke",
      "rivetcare-service",
      "rivetcare-offline-set",
      "rivetcare-level",
      "rivetcare-level-zero",
    ]) {
      assert.equal(privacy.includes(key), true, key);
    }
    assert.equal(privacy.includes("does not store factory manuals"), true);
  });
});
