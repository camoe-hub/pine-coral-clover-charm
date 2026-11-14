import assert from "node:assert/strict";
import test from "node:test";
import { classifyStep } from "./safety-class.ts";

test("a step that does not name a source is guidance, not a factory fact", () => {
  const mark = classifyStep("Look at the fitting and try the next connection.");
  assert.equal(mark.kind, "guidance");
  assert.equal(mark.hazard, null);
});

test("owner wording stays an owner report even when a manual is named", () => {
  const mark = classifyStep("Owner-reported. The manual was not opened for this.");
  assert.equal(mark.kind, "owner");
});

test("propane, shore power, brakes, and jacking stop; tires, structure, and weight caution", () => {
  assert.equal(classifyStep("Shut the LP cylinder.").tone, "stop");
  assert.match(classifyStep("Shut the LP cylinder.").hazard ?? "", /Propane/);
  assert.equal(classifyStep("The 120 V breaker is off.").tone, "stop");
  assert.match(classifyStep("The 120 V breaker is off.").hazard ?? "", /120 V/);
  assert.equal(classifyStep("Do not grease the bearing.").tone, "stop");
  assert.match(classifyStep("Do not grease the bearing.").hazard ?? "", /Brakes and bearings/);
  assert.equal(classifyStep("Set the jack and chock the wheels.").tone, "stop");
  assert.match(classifyStep("Set the jack and chock the wheels.").hazard ?? "", /Jacking/);
  assert.equal(classifyStep("Set the tire to the placard psi.").tone, "caution");
  assert.match(classifyStep("Set the tire to the placard psi.").hazard ?? "", /Tires/);
  assert.equal(classifyStep("Do not drill the frame rail.").tone, "caution");
  assert.match(classifyStep("Do not drill the frame rail.").hazard ?? "", /Structure/);
  assert.equal(classifyStep("Tongue weight is not a hitch rating.").tone, "caution");
  assert.match(classifyStep("Tongue weight is not a hitch rating.").hazard ?? "", /Weight/);
});
