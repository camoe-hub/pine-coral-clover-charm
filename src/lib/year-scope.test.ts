import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scopeCopy, scopeLead, scopedLine } from "./year-scope.ts";

describe("year scope", () => {
  it("moves a 2027 size off the lead when the coach is older", () => {
    const text = "The trailer has sat at least 3 hours. 2027 Classic: LT225/75R16, 90 psi max cold. Inflate to the placard.";
    const scoped = scopeCopy(text, 2021);
    assert.match(scoped.lead, /sat at least 3 hours/);
    assert.match(scoped.lead, /placard/);
    assert.doesNotMatch(scoped.lead, /2027/);
    assert.match(scoped.aside, /2027 Classic/);
  });

  it("keeps a year that is this coach", () => {
    const text = "2026 Classic brakes come with axle 411262-01. Quote the VIN.";
    const scoped = scopeCopy(text, 2026);
    assert.match(scoped.lead, /411262-01/);
    assert.equal(scoped.aside, "");
  });

  it("does not treat a revision month or a DOT example as a model year", () => {
    const text = "Last checked November 2026. 2623 means week 26 of 2023. Replace at 5 years.";
    const scoped = scopeCopy(text, 2021);
    assert.equal(scoped.aside, "");
    assert.match(scoped.lead, /November 2026/);
    assert.match(scoped.lead, /2023/);
  });

  it("treats a short range as those model years", () => {
    const text = "2025–27 books list acorn nut 400923.";
    assert.match(scopeCopy(text, 2026).lead, /400923/);
    assert.match(scopeCopy(text, 2024).aside, /2025/);
  });

  it("does not lead a list with another year's note", () => {
    assert.equal(scopeLead("2027 Classic only.", 2022), "Not this year.");
    assert.equal(scopedLine("2027 Classic only.", 2022), "Not this coach. 2027 Classic only.");
  });

  it("leaves the wording alone when no year is set", () => {
    const text = "2027 Classic: 90 psi max cold.";
    assert.equal(scopeCopy(text, null).lead, text);
    assert.equal(scopeLead(text, null), text);
  });
});
