import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { latestService, markAfterOwnedEdit, markFromService, taskFromJob } from "./schedule-link.ts";
import { useApp } from "./store.ts";

describe("schedule link", () => {
  it("links one job title and refuses a title that is not a job", () => {
    assert.equal(taskFromJob("Hose off the awning")?.id, "awning-hose");
    assert.equal(taskFromJob("  hose off the awning ")?.id, "awning-hose");
    assert.equal(taskFromJob("awning-hose")?.id, "awning-hose");
    assert.equal(taskFromJob("dent repair"), null);
  });

  it("moves the schedule only to a later service", () => {
    assert.deepEqual(markFromService(undefined, "2020-01-15", 80, "2026-11-04"), { iso: "2020-01-15", miles: 80 });
    assert.equal(markFromService({ iso: "2020-01-15", miles: 80 }, "2019-01-15", 10, "2026-11-04"), null);
    assert.equal(markFromService(undefined, "2027-01-01", 80, "2026-11-04"), null);
    assert.deepEqual(markFromService({ iso: "2020-01-15", miles: 80, note: "shop" }, "2021-01-15", 90, "2026-11-04"), {
      iso: "2021-01-15",
      miles: 90,
      note: "shop",
    });
  });

  it("keeps the newest remaining record", () => {
    const latest = latestService([
      { iso: "2019-01-15", miles: 10 },
      { iso: "2020-01-15", miles: 80 },
      { iso: "2020-01-15", miles: 40 },
    ]);
    assert.deepEqual(latest, { iso: "2020-01-15", miles: 80 });
  });

  it("follows the latest remaining service and leaves a hand-set date alone", () => {
    const owned = { iso: "2026-11-01", miles: 11 };
    const linked = [
      { iso: "2026-10-01", miles: 10 },
      { iso: "2026-09-01", miles: 11 },
    ];
    assert.deepEqual(markAfterOwnedEdit({ iso: "2026-11-01", miles: 11, note: "shop" }, owned, linked), {
      iso: "2026-10-01",
      miles: 10,
      note: "shop",
    });
    assert.equal(markAfterOwnedEdit({ iso: "2026-08-01", miles: 1, note: "hand" }, owned, linked), undefined);
    assert.equal(markAfterOwnedEdit({ iso: "2026-11-01", miles: 11 }, owned, []), null);
  });
});

describe("editing a service date", () => {
  it("does not move the schedule behind an older service that is still later", async () => {
    useApp.setState({
      modelId: "c28",
      log: [
        { id: "oct", iso: "2026-10-01", miles: 10, note: "oct", taskId: "awning-hose" },
        { id: "nov", iso: "2026-11-01", miles: 11, note: "nov", taskId: "awning-hose" },
      ],
      done: { "awning-hose": { iso: "2026-11-01", miles: 11, note: "shop" } },
    });
    assert.equal(await useApp.getState().updateLog("nov", "nov", { iso: "2026-09-01", miles: 11 }), true);
    assert.deepEqual(useApp.getState().done["awning-hose"], { iso: "2026-10-01", miles: 10, note: "shop" });
  });
});
