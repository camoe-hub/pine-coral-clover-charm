import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accelConvention, applyZero, correctAccel, flatFromAxes, floorRead, formatInches, inchesFromDeg, levelRows, mergeLevelFile, parseSpan, phoneZero, tiltFromAccel, typedFloorTilt, zeroFromTilt } from "./level.ts";
import { modelById } from "../data/models.ts";
import { jackStart, trackStart } from "./level-track.ts";

const deg = (rise: number, span: number) => (Math.atan(rise / span) * 180) / Math.PI;

describe("floor inches", () => {
  it("names the low side and rounds to the nearest quarter inch", () => {
    const roll = deg(0.75, 96);
    const read = floorRead({ pitchDeg: 0, rollDeg: roll, flatDeg: roll, mag: 9.8, z: 9.8 }, { track: 96, jack: 180 }, true);
    assert.deepEqual(read.lines, ["Curbside is low. About 3/4 in of board under the curbside tires."]);
    assert.equal(read.axes?.[0].figure, "3/4");
    assert.equal(read.axes?.[0].state, "adjust");
    assert.equal(read.axes?.[1].state, "level");
    assert.equal(read.estimate, true);
    const roadside = floorRead({ pitchDeg: 0, rollDeg: -roll, flatDeg: roll, mag: 9.8, z: 9.8 }, { track: 96, jack: 180 }, true);
    assert.equal(roadside.lines[0], "Roadside is low. About 3/4 in of board under the roadside tires.");
  });

  it("does the jack after the tires, and stays quiet under an eighth of an inch", () => {
    const pitch = -deg(1.5, 180);
    const roll = deg(0.5, 96);
    const read = floorRead({ pitchDeg: pitch, rollDeg: roll, flatDeg: 2, mag: 9.8, z: 9.8 }, { track: 96, jack: 180 }, true);
    assert.deepEqual(read.lines, [
      "Curbside is low. About 1/2 in of board under the curbside tires.",
      "Tongue is low. Raise the jack about 1-1/2 in.",
    ]);
    const high = floorRead({ pitchDeg: deg(1, 180), rollDeg: 0, flatDeg: 1, mag: 9.8, z: 9.8 }, { track: 96, jack: 180 }, true);
    assert.equal(high.lines[0], "Front is high. Lower the jack about 1 in.");
    const close = floorRead({ pitchDeg: 0.02, rollDeg: -0.02, flatDeg: 0.02, mag: 9.8, z: 9.8 }, { track: 96, jack: 180 }, true);
    assert.deepEqual(close.lines, ["Close enough."]);
    assert.equal(close.estimate, false);
  });

  it("does not invent a distance without a span, and refuses a phone that is not flat", () => {
    const ask = floorRead({ pitchDeg: 0, rollDeg: 1, flatDeg: 1, mag: 9.8, z: 9.8 }, { track: null, jack: null }, true);
    assert.equal(ask.lines[0], "Curbside is low. Enter the track to see how far.");
    assert.equal(ask.estimate, false);
    const steep = floorRead({ pitchDeg: 0, rollDeg: 2, flatDeg: 16, mag: 9.8, z: 9.8 }, { track: 96, jack: 180 }, true);
    assert.deepEqual(steep.lines, ["Hold the phone flat on the floor."]);
    const down = floorRead({ pitchDeg: 0, rollDeg: 0, flatDeg: 180, mag: 9.8, z: -9.8 }, { track: 96, jack: 180 }, true);
    assert.match(down.lines[0], /screen up/);
    assert.equal(down.lines[0].includes("3/4"), false);
    const moving = floorRead({ pitchDeg: 0, rollDeg: 1, flatDeg: 1, mag: 4, z: 4 }, { track: 96, jack: 180 }, true);
    assert.deepEqual(moving.lines, ["Hold still."]);
  });

  it("treats a flat screen-up iPhone as level after the sign flip", () => {
    assert.equal(accelConvention({ userAgent: "iPhone", platform: "iPhone", maxTouchPoints: 5 }), "inverted");
    assert.equal(accelConvention({ userAgent: "Mozilla", platform: "MacIntel", maxTouchPoints: 0 }), "w3c");
    assert.equal(accelConvention({ userAgent: "Mozilla", platform: "MacIntel", maxTouchPoints: 1 }), "w3c");
    assert.equal(accelConvention({ platform: "MacIntel", maxTouchPoints: 5 }), "inverted");
    const iphone = correctAccel(0, 0, -9.8, "inverted");
    const tilt = tiltFromAccel(iphone.x, iphone.y, iphone.z);
    assert.ok(tilt);
    assert.ok(tilt && tilt.z > 0);
    const read = floorRead(tilt!, { track: 96, jack: 180 }, true);
    assert.deepEqual(read.lines, ["Close enough."]);
    const w3c = tiltFromAccel(0, 0, 9.8);
    assert.ok(w3c && w3c.z > 0 && w3c.flatDeg < 1);
  });

  it("rounds and parses spans without borrowing a length from the model", () => {
    assert.equal(formatInches(1.5), "1-1/2");
    assert.equal(formatInches(0.25), "1/4");
    assert.equal(formatInches(2), "2");
    assert.ok(Math.abs(inchesFromDeg(48, 0.6) - 0.5) < 0.02);
    assert.equal(parseSpan("96"), 96);
    assert.equal(parseSpan("96.5"), 96.5);
    assert.equal(parseSpan(""), null);
    assert.equal(parseSpan("9"), null);
    assert.equal(parseSpan("19"), null);
    assert.equal(parseSpan("401"), null);
    assert.equal(parseSpan("96.25"), null);
  });

  it("keeps another coach's spans when a backup names only one", () => {
    const merged = mergeLevelFile({ c28: { track: 90, jack: 160 }, gt27: { track: 80, jack: null } }, { c28: { track: 96, jack: 180 } });
    assert.equal(merged.c28?.track, 96);
    assert.equal(merged.gt27?.track, 80);
    assert.deepEqual(levelRows({ bad: { track: 10 }, c28: { track: "96", jack: "nope" } }), { c28: { track: 96, jack: null } });
  });

  it("fills a hub-face track only when the model has one number", () => {
    assert.equal(trackStart(modelById("c28")).inches, 86.5);
    assert.equal(trackStart(modelById("g25")).inches, 86.5);
    assert.equal(trackStart(modelById("fc25")).inches, 86.5);
    assert.equal(trackStart(modelById("i30")).inches, 86.5);
    assert.equal(trackStart(modelById("tw25")).inches, 86.5);
    assert.equal(trackStart(modelById("fc23")).inches, 81);
    assert.equal(trackStart(modelById("i23")).inches, 81);
    assert.equal(trackStart(modelById("tw23")).inches, 81);
    assert.equal(trackStart(modelById("b16")).inches, 81);
    assert.equal(trackStart(modelById("cv22")).inches, 81);
    assert.equal(trackStart(modelById("bc16")).inches, null);
    assert.equal(trackStart(modelById("bc20")).inches, null);
    assert.equal(trackStart(modelById("wt17")).inches, null);
    assert.equal(trackStart(modelById("flw")).inches, null);
    assert.equal(trackStart(modelById("other")).inches, null);
    assert.match(trackStart(modelById("bc16")).note, /69 to 75/);
    assert.match(trackStart(modelById("other")).note, /74\.5/);
  });

  it("fills a jack span only for a listed floor plan", () => {
    assert.equal(jackStart(modelById("bc16")).inches, 111);
    assert.equal(jackStart(modelById("b16")).inches, 112);
    assert.equal(jackStart(modelById("bc20")).inches, 140);
    assert.equal(jackStart(modelById("bcxe")).inches, 140);
    assert.equal(jackStart(modelById("cv19")).inches, 134);
    assert.equal(trackStart(modelById("cv19")).inches, 81);
    assert.equal(jackStart(modelById("b22")).inches, 162);
    assert.equal(jackStart(modelById("cv22")).inches, 162);
    assert.equal(jackStart(modelById("fc23")).inches, 173);
    assert.equal(jackStart(modelById("i23")).inches, 173);
    assert.equal(jackStart(modelById("tw25")).inches, 190);
    assert.equal(jackStart(modelById("fc25")).inches, 190);
    assert.equal(jackStart(modelById("g27")).inches, 193);
    assert.equal(jackStart(modelById("fc27")).inches, 193);
    assert.equal(jackStart(modelById("c28")).inches, 201);
    assert.equal(jackStart(modelById("c30")).inches, 220);
    assert.equal(jackStart(modelById("fc30")).inches, 220);
    assert.equal(jackStart(modelById("c33")).inches, 233);
    assert.equal(jackStart(modelById("b20")).inches, null);
    assert.equal(jackStart(modelById("cv16")).inches, null);
    assert.equal(jackStart(modelById("g25")).inches, null);
    assert.equal(jackStart(modelById("tw23")).inches, null);
    assert.equal(jackStart(modelById("tw27")).inches, null);
    assert.equal(jackStart(modelById("fc28")).inches, null);
    assert.equal(jackStart(modelById("i30")).inches, null);
    assert.equal(jackStart(modelById("wt22")).inches, null);
  });

  it("takes a case offset out of a later reading", () => {
    const raw = { pitchDeg: 2, rollDeg: -1, flatDeg: 2.2, mag: 9.8, z: 9.7 };
    const zero = zeroFromTilt(raw);
    assert.deepEqual(zero, { pitchDeg: 2, rollDeg: -1 });
    const level = applyZero(raw, zero);
    assert.equal(level.pitchDeg, 0);
    assert.equal(level.rollDeg, 0);
    assert.equal(level.flatDeg, 2.2);
    assert.deepEqual(floorRead(level, { track: 86.5, jack: 201 }, true).lines, ["Close enough."]);
    assert.notEqual(floorRead(raw, { track: 86.5, jack: 201 }, true).lines[0], "Close enough.");
    assert.equal(zeroFromTilt({ ...raw, z: -9, flatDeg: 20 }), null);
    assert.equal(phoneZero({ pitchDeg: 40, rollDeg: 0 }), null);
    assert.equal(applyZero(raw, null), raw);
  });

  it("does not treat a blank typed reading as level", () => {
    const blank = typedFloorTilt({ side: "curbside", sideDeg: "", end: "tongue", endDeg: "" });
    assert.equal(blank.ok, false);
    const oneSide = typedFloorTilt({ side: "curbside", sideDeg: "", end: "level", endDeg: "" });
    assert.equal(oneSide.ok, false);
    const bothLevel = typedFloorTilt({ side: "level", sideDeg: "", end: "level", endDeg: "" });
    assert.equal(bothLevel.ok, true);
    if (bothLevel.ok) assert.deepEqual(floorRead(bothLevel.tilt, { track: 96, jack: 180 }, true).lines, ["Close enough."]);
  });

  it("uses the sensor's combined tilt and stops at 15 degrees", () => {
    const pitch = (15 * Math.PI) / 180;
    const roll = (15 * Math.PI) / 180;
    const mag = 9.8;
    const tilt = tiltFromAccel(-mag * Math.cos(pitch) * Math.sin(roll), mag * Math.sin(pitch), mag * Math.cos(pitch) * Math.cos(roll));
    assert.ok(tilt);
    assert.ok(Math.abs(tilt!.pitchDeg - 15) < 0.05);
    assert.ok(Math.abs(tilt!.rollDeg - 15) < 0.05);
    assert.ok(Math.abs(tilt!.flatDeg - flatFromAxes(15, -15)) < 0.05);
    assert.ok(Math.abs(flatFromAxes(15, 15) - 21.1) < 0.1);
    const both = typedFloorTilt({ side: "curbside", sideDeg: "15", end: "tongue", endDeg: "15" });
    assert.equal(both.ok, false);
    const steep = typedFloorTilt({ side: "curbside", sideDeg: "45", end: "level", endDeg: "" });
    assert.equal(steep.ok, false);
    const modest = typedFloorTilt({ side: "curbside", sideDeg: "1", end: "level", endDeg: "" });
    assert.equal(modest.ok, true);
  });

  it("stops a large correction instead of quoting it as an ordinary move", () => {
    const side = floorRead({ pitchDeg: 0, rollDeg: 15, flatDeg: 15, mag: 9.8, z: 9.8 }, { track: 86.5, jack: 201 }, true);
    assert.match(side.lines[0], /more than 8 in/);
    assert.equal(side.lines[0].includes("About"), false);
    assert.equal(side.estimate, false);
    const jack = floorRead({ pitchDeg: -15, rollDeg: 0, flatDeg: 15, mag: 9.8, z: 9.8 }, { track: 86.5, jack: 201 }, true);
    assert.match(jack.lines[0], /more than 24 in/);
    assert.equal(jack.lines[0].includes("about"), false);
  });
});
