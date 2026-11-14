import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coldForLoad } from "./tire-load.ts";

describe("tire load table", () => {
  it("picks the lowest cold pressure that carries the axle end", () => {
    assert.deepEqual(coldForLoad("ST225/75R15", 2000), { psi: 45, carries: 2020 });
    assert.deepEqual(coldForLoad("ST225/75R15", 2830), { psi: 80, carries: 2830 });
    assert.deepEqual(coldForLoad("LT225/75R16", 2680), { psi: 80, carries: 2680 });
    assert.deepEqual(coldForLoad("LT235/85R16", 1700), { psi: 35, carries: 1700 });
  });

  it("does not invent a pressure over the published row", () => {
    assert.equal(coldForLoad("ST225/75R15", 2831), "over");
    assert.equal(coldForLoad("ST235/75R15", 1800), "empty");
    assert.equal(coldForLoad("ST225/75R15", 0), "empty");
  });
});
