import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  asTires,
  homeTireLine,
  jobMark,
  lowWheels,
  oldestTire,
  treadNeedsReplace,
  withCheck,
  type TireRecord,
} from "./tires.ts";

const now = new Date(2026, 10, 8, 12).getTime();

function tires(patch: unknown): TireRecord {
  return asTires(patch);
}

describe("tire records", () => {
  it("keeps an older single DOT and drops a bad wheel", () => {
    const row = tires({ psi: "80psi", dot: "23ab", on: "2024-06-01", wheels: { no: { dot: "0120" }, lf: { dot: "0122" } } });
    assert.equal(row.psi, "80");
    assert.equal(row.dot, "23");
    assert.equal(row.on, "2024-06-01");
    assert.equal(row.wheels.lf?.dot, "0122");
    assert.equal(row.wheels.lr, undefined);
  });

  it("names the oldest wheel, and the spare can be that wheel", () => {
    const row = tires({ wheels: { lf: { dot: "0124" }, spare: { dot: "0121" } }, dot: "0119" });
    const oldest = oldestTire(row, now);
    assert.equal(oldest?.id, "spare");
    assert.equal(oldest?.iso, "2021-01-01");
    assert.match(homeTireLine(row, now) ?? "", /Oldest tire: Spare/);
  });

  it("leaves the old home line alone when only one code is saved", () => {
    const old = tires({ dot: "0119", on: "2019-01-01" });
    assert.equal(homeTireLine(old, now), "Tires about 7 years from the DOT date");
    assert.equal(homeTireLine(tires({ dot: "0124" }), now), null);
    assert.equal(homeTireLine(tires({ on: "2018-01-01" }), now), "Tires mounted about 8 years ago");
  });

  it("follows the oldest DOT on the 5-year job", () => {
    const row = tires({ wheels: { rf: { dot: "0121" } } });
    const mark = jobMark("tires-replace", { iso: "2026-01-01", miles: 10, note: "detectors" }, row);
    assert.equal(mark?.iso, "2021-01-01");
    assert.equal(mark?.note, "detectors");
    assert.equal(jobMark("tires-replace", undefined, tires({})), undefined);
  });

  it("uses a rotation date for the 6-month side and does not hide an unmarked 10,000-mile job", () => {
    const row = tires({ rotated: "2026-08-01" });
    assert.equal(jobMark("rotate", undefined, row, 12000), undefined);
    assert.equal(jobMark("rotate", undefined, row, 4000)?.iso, "2026-08-01");
    assert.deepEqual(jobMark("rotate", { iso: "2026-01-01", miles: 8000 }, row), { iso: "2026-08-01", miles: 8000 });
    assert.equal(jobMark("rotate", { iso: "2026-09-01", miles: 8000 }, row)?.iso, "2026-09-01");
  });

  it("treats 2/32 and a replace mark as the existing line, not a wear estimate", () => {
    assert.equal(treadNeedsReplace("2"), true);
    assert.equal(treadNeedsReplace("3"), false);
    assert.equal(treadNeedsReplace("ok"), false);
    assert.equal(treadNeedsReplace("replace"), true);
    assert.match(homeTireLine(tires({ wheels: { lr: { tread: "2" } } }), now) ?? "", /Road rear is at the replace line/);
  });

  it("keeps one cold check per day and flags a reading more than 20% under the placard", () => {
    const first = tires({ psi: "80" });
    const checks = withCheck(first, { on: "2026-11-01", psi: { lf: "70", spare: "63" }, note: "camp" });
    assert.ok(checks);
    const again = withCheck({ ...first, checks: checks ?? [] }, { on: "2026-11-01", psi: { lf: "79" }, note: "" });
    assert.equal(again?.length, 1);
    assert.equal(again?.[0].psi.lf, "79");
    assert.deepEqual(lowWheels("80", { on: "2026-11-01", psi: { lf: "64", spare: "63" }, note: "" }), ["spare"]);
    assert.equal(withCheck(first, { on: "2027-01-01", psi: { lf: "80" }, note: "" }), null);
  });
});
