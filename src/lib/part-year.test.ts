import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { coachPart } from "@/data/coach.ts";
import { modelById } from "@/data/models.ts";
import { otherYearNumber } from "./part-year.ts";

const source = readFileSync(new URL("../data/parts.ts", import.meta.url), "utf8");

function partFields(id: string) {
  const block = source.split(`id: "${id}",`)[1]?.split(/\n {2}\},/)[0] ?? "";
  const field = (key: string) => /([^\n]*)/.exec(new RegExp(`${key}: "(.*)`).exec(block)?.[1] ?? "")?.[1]?.replace(/",$/, "") ?? "";
  return {
    id,
    pn: field("pn"),
    name: field("name"),
    application: field("application"),
    notes: field("notes"),
  };
}

function otherYear(id: string, modelId: string, year: number | null) {
  const part = partFields(id);
  assert.ok(part.pn, id);
  const view = coachPart(part, modelById(modelId));
  return otherYearNumber({
    pn: view.pn,
    name: part.name,
    application: part.application,
    notes: part.notes,
    coachNote: view.note,
    year,
  });
}

describe("year-aware part numbers", () => {
  it("does not offer the 2026 Classic axle on an older Classic", () => {
    assert.equal(otherYear("brakes", "c28", 2021), true);
    assert.equal(coachPart(partFields("brakes"), modelById("c28")).pn, "411262-02");
  });

  it("keeps that axle when the coach is the year the number belongs to", () => {
    assert.equal(otherYear("brakes", "c28", 2026), false);
    assert.equal(otherYear("brakes", "c30", 2026), false);
  });

  it("does not offer the 2025 Globetrotter brake number on another year", () => {
    assert.equal(otherYear("brakes", "g27", 2021), true);
    assert.equal(otherYear("brakes", "g27", 2025), false);
  });

  it("leaves the number alone when no year is set", () => {
    assert.equal(otherYear("brakes", "c28", null), false);
  });

  it("keeps a floor-plan number that is not tied to a year", () => {
    assert.equal(otherYear("inverter", "c28", 2021), false);
    assert.equal(otherYear("lugnut", "c28", 2021), false);
    assert.equal(otherYear("brake-10", "c28", 2026), false);
    assert.equal(otherYear("descale", "g27", 2021), false);
  });

  it("does not offer a number whose only stated use is another year", () => {
    assert.equal(otherYear("coupler", "c28", 2021), true);
    assert.equal(otherYear("coupler", "c28", 2026), false);
    assert.equal(otherYear("city", "c28", 2021), true);
    assert.equal(otherYear("city", "c28", 2025), false);
    assert.equal(otherYear("city", "c28", 2026), false);
    assert.equal(otherYear("furnace-pn", "c28", 2021), true);
    assert.equal(otherYear("furnace-pn", "g27", 2025), false);
    assert.equal(otherYear("coupler", "c28", null), false);
    assert.equal(otherYear("city", "c28", null), false);
    assert.equal(otherYear("furnace-pn", "c28", null), false);
  });

  it("withholds a part whose name or only stated use is another year", () => {
    assert.equal(otherYear("fuses", "c28", 2021), true);
    assert.equal(otherYear("fuses", "c28", 2025), false);
    assert.equal(otherYear("power-hub", "c28", 2021), true);
    assert.equal(otherYear("power-hub", "c28", 2025), false);
    assert.equal(otherYear("alde-boiler", "c28", 2021), true);
    assert.equal(otherYear("alde-boiler", "c28", 2026), false);
  });
});
