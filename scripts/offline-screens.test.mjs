import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const shell = readFileSync(new URL("../src/components/shell.tsx", import.meta.url), "utf8");
const save = readFileSync(new URL("../src/lib/offline-save.ts", import.meta.url), "utf8");

test("every lazy import in the shell is on the offline save list", () => {
  const lazy = [...shell.matchAll(/import\("(@\/[^"]+)"\)/g)].map((match) => match[1]);
  const saved = new Set([...save.matchAll(/import\("(@\/[^"]+)"\)/g)].map((match) => match[1]));
  const missing = [...new Set(lazy)].filter((spec) => !saved.has(spec));
  assert.deepEqual(missing, []);
});

test("privacy, support, and the legal copy are saved for offline", () => {
  for (const spec of ["@/components/privacy-view", "@/components/support-view", "@/components/legal-copy", "@/components/backup-view"]) {
    assert.match(save, new RegExp(spec.replace("/", "\\/")));
  }
});
