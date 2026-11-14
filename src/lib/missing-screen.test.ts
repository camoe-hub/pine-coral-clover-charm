import assert from "node:assert/strict";
import test from "node:test";
import { isMissingScreen, MISSING_SCREEN } from "./missing-screen.ts";

test("a missing screen is the raw chunk crash, not every error", () => {
  assert.equal(isMissingScreen(new Error(MISSING_SCREEN)), true);
  assert.equal(isMissingScreen(new TypeError("Cannot read properties of undefined (reading 'default')")), true);
  assert.equal(isMissingScreen(new TypeError('Cannot read properties of undefined (reading "default")')), true);
  assert.equal(isMissingScreen(new TypeError("Failed to fetch dynamically imported module: /assets/fix.js")), true);
  assert.equal(isMissingScreen(new Error("The phone is full")), false);
  assert.equal(isMissingScreen(undefined), false);
});
