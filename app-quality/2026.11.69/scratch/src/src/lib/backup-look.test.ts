import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { describe, it } from "node:test";
import { backupFileName, backupIntegrity, hashStrings, repeatedRecordIds } from "./backup-look.ts";

describe("backup integrity", () => {
  it("accepts a file whose checksum matches and rejects a damaged one", () => {
    const body = '{"version":1,"ready":true';
    const good = `${body},"integrity":"${hashStrings([body])}"}`;
    assert.equal(backupIntegrity(good), "ok");
    const damaged = `${body} ,"integrity":"${hashStrings([body])}"}`;
    assert.equal(backupIntegrity(damaged), "bad");
    assert.equal(backupIntegrity('{"version":1,"ready":true}'), "none");
  });

  it("matches NIST SHA-256 vectors", () => {
    const vectors: [string, string][] = [
      ["", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"],
      ["abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
    ];
    for (const [text, hex] of vectors) {
      assert.equal(hashStrings([text]), hex);
      assert.equal(createHash("sha256").update(text).digest("hex"), hex);
    }
    const million = "a".repeat(1_000_000);
    const millionHex = "cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0";
    assert.equal(hashStrings([million]), millionHex);
  });

  it("names a backup with its date and counts repeated record ids", () => {
    assert.equal(backupFileName("2026-11-05"), "rivetcare-backup-2026-11-05.json");
    assert.equal(backupFileName("today"), "rivetcare-backup-undated.json");
    const data = {
      coaches: {
        c28: {
          log: [
            { id: "a", iso: "2026-01-01", note: "first" },
            { id: "a", iso: "2026-01-02", note: "again" },
          ],
          notes: [{ id: "n1", text: "one" }],
        },
      },
    };
    assert.equal(repeatedRecordIds(data), 1);
    assert.equal(repeatedRecordIds({ log: [{ id: "only" }] }), 0);
  });
});