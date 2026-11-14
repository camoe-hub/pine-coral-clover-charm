import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { blobMatches, photoIdsOnPhone, restoredBookOk, sameSnapshot, storedBookOk, type RestoreSnap } from "./restore-undo.ts";

describe("restore snapshot", () => {
  it("collects trailer, log, draft, and section photos once", () => {
    const ids = photoIdsOnPhone({
      photoId: "trailer",
      log: [{ files: [{ id: "log-a" }, { id: "" }] }],
      shots: { "care:tires": [{ id: "shot" }] },
      logDraft: { files: [{ id: "draft" }] },
      tires: { photos: { placard: { id: "placard", name: "placard.jpg", mime: "image/jpeg" } } },
      coaches: {
        c28: {
          photoId: "trailer",
          log: [{ files: [{ id: "other" }] }],
        },
      },
    });
    assert.deepEqual(ids.sort(), ["draft", "log-a", "other", "placard", "shot", "trailer"]);
  });

  it("accepts a readable book and rejects a cut-off one", () => {
    assert.equal(storedBookOk(null), true);
    assert.equal(storedBookOk('{"modelId":"c28"}'), true);
    assert.equal(storedBookOk("["), false);
    assert.equal(storedBookOk("[]"), false);
    assert.equal(restoredBookOk(null), false);
    assert.equal(restoredBookOk('{"modelId":"c28"}'), true);
  });

  it("matches a snapshot only when the book, weights, and photo sizes match", () => {
    const saved: RestoreSnap = {
      book: '{"modelId":"c28"}',
      weights: '{"c28":{"truckFront":"1"}}',
      files: [{ id: "a", size: 4, type: "image/jpeg" }],
      added: [],
    };
    assert.equal(sameSnapshot(saved, saved), true);
    assert.equal(sameSnapshot(saved, { ...saved, book: "{}" }), false);
    assert.equal(sameSnapshot(saved, { ...saved, level: null }), true);
    assert.equal(sameSnapshot(saved, { ...saved, level: "{}" }), false);
    assert.equal(sameSnapshot(saved, { ...saved, files: [{ id: "a", size: 5, type: "image/jpeg" }] }), false);
    assert.equal(blobMatches(saved.files[0], 4, ""), true);
    assert.equal(blobMatches(saved.files[0], 4, "image/png"), false);
    assert.equal(blobMatches(saved.files[0], 3, "image/jpeg"), false);
  });
});
