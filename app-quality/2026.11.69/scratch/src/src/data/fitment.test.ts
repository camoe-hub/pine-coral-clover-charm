import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coachHasAlde, procedureFits, symptomOn } from "./coach.ts";
import { aldeCodeOn, aldeShownName, fitmentPick, fitmentStanding, matrixAllows } from "./fitment.ts";
import { modelById } from "./models.ts";

describe("coach fitment", () => {
  it("does not put Alde on a Flying Cloud", () => {
    const flying = modelById("fc25");
    assert.equal(coachHasAlde(flying, 2025), false);
    assert.equal(symptomOn({ id: "alde-bleed", system: "Alde", title: "Alde will not heat" }, flying, 2025), false);
    assert.equal(procedureFits("alde", flying, 2025), false);
  });

  it("keeps the tankless water heater on a Globetrotter", () => {
    const gt = modelById("g25");
    assert.equal(symptomOn({ id: "tankless", system: "Water heater", title: "No hot water" }, gt, 2025), true);
  });

  it("keeps Classic TPMS on a 2027 Classic only", () => {
    assert.equal(procedureFits("tpms", modelById("c28"), 2027), true);
    assert.equal(procedureFits("tpms", modelById("c28"), 2026), false);
    assert.equal(procedureFits("tpms", modelById("fc25"), 2027), false);
  });

  it("shows TST only on a Classic, including when the year is unset", () => {
    const classic = modelById("c28");
    const flying = modelById("fc25");
    assert.equal(matrixAllows("TST TPMS", classic, null), true);
    assert.equal(matrixAllows("TST TPMS", classic, 2016), true);
    assert.equal(matrixAllows("TST TPMS", flying, 2025), false);
  });

  it("does not show TireMinder or Progressive EMS on a named floor", () => {
    const classic = modelById("c28");
    const flying = modelById("fc25");
    const other = modelById("other");
    assert.equal(other.family, "Other");
    assert.equal(matrixAllows("TireMinder", classic, 2027), false);
    assert.equal(matrixAllows("TireMinder", flying, 2025), false);
    assert.equal(matrixAllows("Progressive Industries EMS", classic, 2023), false);
    assert.equal(matrixAllows("Progressive Industries EMS", flying, 2025), false);
    assert.equal(matrixAllows("TireMinder", other, 2025), true);
    assert.equal(matrixAllows("Progressive Industries EMS", other, null), true);
  });

  it("does not call a 2023 Classic an Alde 3030", () => {
    const classic = modelById("c28");
    const picked = fitmentPick(classic, 2023);
    assert.ok(picked.row);
    assert.equal(picked.row.show.includes("Alde 3030"), false);
    assert.match(picked.row.note, /not a 3030/);
    assert.equal(matrixAllows("Alde 3030", classic, 2023), false);
    assert.equal(coachHasAlde(classic, 2023), true);
    assert.equal(procedureFits("alde", classic, 2023), true);
  });

  it("does not call an unverified Classic boiler a 3030", () => {
    const classic = modelById("c28");
    const thirty = modelById("c30");
    assert.equal(aldeShownName(2017, "c28"), "Alde 3010");
    assert.equal(aldeShownName(2018, "c28"), "Alde 3020");
    assert.equal(aldeShownName(2022, "c30"), "Alde 3020");
    assert.equal(aldeShownName(2024, "c28"), "Alde 3020");
    assert.equal(aldeShownName(2020, "c28"), "Alde");
    assert.equal(aldeShownName(2021, "c33"), "Alde");
    assert.equal(aldeShownName(2025, "c28"), "Alde");
    assert.equal(aldeShownName(2027, "c28"), "Alde");
    assert.equal(aldeShownName(2026, "c28"), "Alde 3030");
    assert.equal(aldeShownName(2026, "c30"), "Alde");
    assert.equal(aldeShownName(null, "c28"), "Alde");
    assert.equal(matrixAllows("Alde 3030", classic, 2017), true);
    assert.equal(aldeCodeOn("alde-dongle", 2024, "c28"), false);
    assert.equal(aldeCodeOn("alde-dongle", 2025, "c28"), false);
    assert.equal(aldeCodeOn("alde-dongle", 2026, "c30"), false);
    assert.equal(aldeCodeOn("alde-dongle", 2026, "c28"), true);
    assert.equal(aldeCodeOn("alde-dongle", 2027, "c28"), false);
    assert.equal(aldeCodeOn("alde-red", 2022, "c28"), true);
    assert.equal(aldeCodeOn("alde-red", 2026, "c28"), false);
    assert.equal(thirty.id, "c30");
    assert.equal(fitmentStanding(classic, 2019).standing, "factory");
    assert.equal(fitmentStanding(classic, 2018).standing, "mixed");
    assert.equal(fitmentStanding(classic, null).standing, "unknown");
  });
});