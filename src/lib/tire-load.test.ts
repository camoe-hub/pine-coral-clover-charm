import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coldForLoad } from "./tire-load.ts";

describe("tire load table", () => {
  it("does not store a maker's rows", () => {
    assert.equal(coldForLoad("ST225/75R15", 2000), "empty");
    assert.equal(coldForLoad("LT225/75R16", 2680), "empty");
    assert.equal(coldForLoad("LT235/85R16", 1700), "empty");
    assert.equal(coldForLoad("ST235/75R15", 1800), "empty");
    assert.equal(coldForLoad("ST225/75R15", 0), "empty");
  });
});
