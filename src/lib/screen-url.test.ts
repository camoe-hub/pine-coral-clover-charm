import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addressAction, bootAddress, hashLocation } from "./screen-url.ts";

describe("hash addresses", () => {
  it("sends a screen path to its hash and leaves real pages and files", () => {
    assert.equal(hashLocation("/level"), "/#/level");
    assert.equal(hashLocation("/figure/p92-1"), "/#/figure/p92-1");
    assert.equal(hashLocation("/codes", "?q=e5"), "/#/codes?q=e5");
    assert.equal(hashLocation("/privacy"), null);
    assert.equal(hashLocation("/support"), null);
    assert.equal(hashLocation("/"), null);
    assert.equal(hashLocation("/favicon.ico"), null);
    assert.equal(hashLocation("/no-such-screen"), null);
  });

  it("keeps a cold address instead of opening Home", () => {
    const level = bootAddress("/", "", "#/level", { name: "home" });
    assert.equal(level.url, "/#/level");
    assert.deepEqual(level.open, { name: "level" });
    const fix = bootAddress("/", "", "#/fix", { name: "home" });
    assert.equal(fix.url, "/#/fix");
    assert.deepEqual(fix.open, { name: "fix" });
    const plain = bootAddress("/level", "", "", { name: "home" });
    assert.equal(plain.url, "/#/level");
    assert.deepEqual(plain.open, { name: "level" });
    assert.deepEqual(bootAddress("/", "", "", { name: "home" }), { url: "/", open: null });
  });

  it("follows the open screen after the first paint", () => {
    const cold = addressAction("/", "", "#/level", { name: "home" }, false);
    assert.equal(cold.url, "/#/level");
    assert.deepEqual(cold.open, { name: "level" });
    const wrote = addressAction("/", "", "", { name: "level" }, true);
    assert.equal(wrote.url, "/#/level");
    assert.equal(wrote.open, null);
    const backed = addressAction("/", "", "#/level", { name: "home" }, true);
    assert.equal(backed.url, "/");
    assert.equal(backed.open, null);
  });
});
