import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cumulativeOrder, explainTicket, fromCumulative, logReady, mergeWeightsFile, newId, scaleProblems, seedTow, stickerPounds, tongueShareNote, weigh, weightEntry, weightProblem, weightsFit, type Ratings } from "./weights.ts";

const none: Ratings = {
  steer: null,
  drive: null,
  gvw: null,
  payload: null,
  gcwr: null,
  trailer: null,
  tongue: null,
  factory: null,
};

describe("weigh", () => {
  it("splits a scale ticket into tongue weight and trailer weight", () => {
    const truck = { steer: 3200, drive: 3400, trailer: null };
    const coupled = { steer: 3000, drive: 4000, trailer: 5800 };
    const result = weigh(truck, coupled, coupled, none);
    assert.equal(result.truck.gvw.actual, 6600);
    assert.equal(result.trailer.tongue.actual, 400);
    assert.equal(result.trailer.weight.actual, 6200);
    assert.ok(Math.abs((result.trailer.tonguePct ?? 0) - 400 / 6200) < 0.0001);
    assert.equal(tongueShareNote(result.trailer.tonguePct), "Tongue weight is 6.45% of the loaded trailer. The usual band is 10–15%.");
    assert.equal(tongueShareNote(0.12), null);
    assert.equal(tongueShareNote(0.1), null);
    assert.equal(tongueShareNote(0.15), null);
    assert.equal(tongueShareNote(null), null);
  });

  it("reads a cumulative CAT ticket as three axle groups", () => {
    const pass = fromCumulative(3200, 6600, 12400);
    assert.deepEqual(pass, { steer: 3200, drive: 3400, trailer: 5800 });
  });

  it("does not invent room under a missing combined limit", () => {
    const truck = { steer: 3000, drive: 3000, trailer: null };
    const coupled = { steer: 2800, drive: 4200, trailer: 5000 };
    const result = weigh(truck, coupled, coupled, none);
    assert.equal(result.noWd.gcw.actual, 12000);
    assert.equal(result.noWd.gcw.left, null);
    assert.equal(result.noWd.gcw.pct, null);
    const explained = explainTicket({
      coupled,
      truckOnly: 6000,
      trailerOnly: null,
      combinedTyped: null,
      barsOnCombined: null,
      ratings: { gvw: null, gcwr: null, trailer: null, tongue: null },
      passName: "bars off",
    });
    assert.equal(explained.notes.some((note) => note.includes("No GCWR was entered")), true);
  });

  it("compares trailer GVWR with the loaded trailer, not the axle group", () => {
    const ratings: Ratings = { ...none, trailer: 5200 };
    const truck = { steer: 3000, drive: 3000, trailer: null };
    const coupled = { steer: 3200, drive: 3300, trailer: 5000 };
    const result = weigh(truck, coupled, coupled, ratings);
    assert.equal(result.noWd.trailer.actual, 5000);
    assert.equal(result.noWd.trailer.rated, null);
    assert.equal(result.noWd.trailer.left, null);
    assert.equal(result.wd.trailer.rated, null);
    assert.equal(result.trailer.weight.actual, 5500);
    assert.equal(result.trailer.weight.left, -300);
  });

  it("keeps truck-only payload separate from payload while coupled", () => {
    const ratings: Ratings = { ...none, gvw: 10000, payload: 3000 };
    const truck = { steer: 3500, drive: 4000, trailer: null };
    const off = { steer: 3200, drive: 5000, trailer: 5000 };
    const on = { steer: 3800, drive: 4600, trailer: 4800 };
    const result = weigh(truck, off, on, ratings);
    assert.equal(result.truck.payload.actual, 500);
    assert.equal(result.noWd.payload.actual, 1200);
    assert.equal(result.wd.payload.actual, 1400);
    assert.equal(result.truck.payload.left, 2500);
  });

  it("refuses a partial ticket for the service log", () => {
    const truck = { steer: 3200, drive: 3400, trailer: null };
    const coupled = { steer: 3000, drive: 4000, trailer: 5800 };
    const empty = { steer: null, drive: null, trailer: null };
    assert.match(logReady(weigh(truck, empty, empty, none)) ?? "", /three passes/);
    assert.equal(logReady(weigh(truck, coupled, coupled, none)), null);
  });

  it("uses the same 20 lb disagreement for the log and the ticket note", () => {
    const truck = { steer: 4000, drive: 3000, trailer: null };
    const off = { steer: 3600, drive: 4200, trailer: 5000 };
    const on = { steer: 3700, drive: 4160, trailer: 5000 };
    const offBy60 = scaleProblems(weigh(truck, off, on, none));
    assert.match(offBy60.block ?? "", /do not match/);
    const onClose = { steer: 3700, drive: 4120, trailer: 5000 };
    assert.equal(scaleProblems(weigh(truck, off, onClose, none)).block, null);
  });

  it("reads a loaded trailer from a bars-on ticket when the truck was weighed alone", () => {
    const explained = explainTicket({
      coupled: { steer: 3800, drive: 4200, trailer: 5000 },
      truckOnly: 7000,
      trailerOnly: null,
      combinedTyped: null,
      barsOnCombined: null,
      ratings: { gvw: null, gcwr: null, trailer: null, tongue: null },
      passName: "bars on",
    });
    assert.equal(explained.tongue, null);
    assert.equal(explained.loaded, 6000);
  });

  it("does not turn a bad entry into a different weight", () => {
    assert.equal(weightEntry("3.200,5"), "3.200,5");
    assert.equal(weightProblem("3.200,5"), "That entry is not a weight in pounds, so it was not used.");
    assert.equal(weightEntry("1e3"), "1e3");
    assert.equal(weightEntry("-500"), "-500");
    assert.equal(weightEntry("1.2.3"), "1.2.3");
    assert.equal(weightEntry("3,200"), "3200");
    assert.equal(weightEntry("5000 kg"), "11023");
    assert.equal(weightProblem("3200"), null);
    assert.equal(cumulativeOrder(4000, 3800, null), "The second total is lower than the front axle, so the drive axle would be negative.");
    assert.equal(stickerPounds("3,500–4,000 lb"), "");
    assert.equal(stickerPounds("6,100 lb"), "6100");
    const id = newId();
    assert.match(id, /^[0-9a-f-]{36}$/i);
    assert.equal(weightsFit({ note: "x".repeat(100_001) }), false);
    assert.equal(weightsFit({ note: "ok" }), true);
    const result = weigh({ steer: 4000, drive: 3000, trailer: null }, { steer: 3600, drive: 4200, trailer: 5000 }, { steer: 3800, drive: 4100, trailer: 4900 }, none);
    assert.equal("lifted" in result.trailer, false);
    assert.equal("returned" in result.trailer, false);
  });

  it("builds an id when randomUUID is missing", () => {
    const cryptoObj = globalThis.crypto;
    const original = cryptoObj.randomUUID;
    Object.defineProperty(cryptoObj, "randomUUID", { configurable: true, value: undefined });
    try {
      const id = newId();
      assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    } finally {
      Object.defineProperty(cryptoObj, "randomUUID", { configurable: true, value: original });
    }
  });

  it("blocks a negative tongue weight", () => {
    const truck = { steer: 4000, drive: 3000, trailer: null };
    const coupled = { steer: 3000, drive: 3000, trailer: 5000 };
    const problem = scaleProblems(weigh(truck, coupled, coupled, none));
    assert.equal(problem.block, "Tongue weight is negative. The ticket is incomplete.");
  });
});

describe("shared truck sticker", () => {
  it("keeps the truck when a backup has another coach and no sticker of its own", () => {
    const current = {
      c28: { truckFront: "3200", truckName: "Old" },
      tow: { truckName: "Ram", steerRating: "5200", driveRating: "6000", gvwRating: "10000", payloadRating: "3000", gcwr: "23000", tongueRating: "1200" },
    };
    const merged = mergeWeightsFile(current, { g25: { truckFront: "3000" } });
    assert.equal(seedTow(merged, "g25")?.truckName, "Ram");
    assert.equal(seedTow(merged, "g25")?.steerRating, "5200");
    assert.equal((merged.c28 as { truckFront: string }).truckFront, "3200");
    assert.equal((merged.g25 as { truckFront: string }).truckFront, "3000");
  });

  it("seeds a new coach from a truck already typed on another coach", () => {
    const file = { c28: { truckName: "Power Wagon", steerRating: "5500", driveRating: "" } };
    assert.equal(seedTow(file, "g25")?.truckName, "Power Wagon");
    assert.equal(seedTow(file, "g25")?.steerRating, "5500");
  });
});
