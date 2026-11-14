import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { vinProblem, vinYear } from "../data/coach.ts";
import { useApp } from "./store.ts";

describe("setup input", () => {
  it("names a short VIN that uses I, O, or Q instead of saving it", () => {
    assert.equal(vinProblem("1IOQ23"), "A VIN cannot use I, O, or Q");
    assert.equal(vinProblem(""), null);
    assert.equal(vinYear("1IOQ23"), null);
  });

  it("does not save a mileage that is not a whole number from 0 to 1,000,000", () => {
    useApp.setState({ odometer: 10, ready: false, coachSet: false });
    useApp.getState().finishSetup(-500, true);
    assert.equal(useApp.getState().odometer, 10);
    assert.equal(useApp.getState().ready, false);
    useApp.getState().finishSetup(500.4, true);
    assert.equal(useApp.getState().ready, false);
    useApp.getState().finishSetup(500, true);
    assert.equal(useApp.getState().odometer, 500);
    assert.equal(useApp.getState().ready, true);
    assert.equal(useApp.getState().coachSet, true);
  });
});
