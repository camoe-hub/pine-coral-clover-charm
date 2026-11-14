import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { eraseDatabases } from "./erase-databases.ts";

const NAMES = ["rivetcare-files", "rivetcare-books", "rivetcare-undo"];

function harness() {
  const requests = new Map<string, IDBOpenDBRequest>();
  const idb = {
    deleteDatabase(name: string) {
      const req = {} as IDBOpenDBRequest;
      requests.set(name, req);
      return req;
    },
  } as Pick<IDBFactory, "deleteDatabase">;
  return { idb, requests };
}

function fire(req: IDBOpenDBRequest | undefined, event: "onsuccess" | "onerror" | "onblocked") {
  const handler = req?.[event] as ((ev: Event) => void) | null | undefined;
  handler?.(new Event(event));
}

describe("erase databases", () => {
  it("resolves true only after all three succeed", async () => {
    const { idb, requests } = harness();
    let resolved = false;
    const pending = eraseDatabases(idb, NAMES, 500).then((value) => {
      resolved = true;
      return value;
    });
    for (const name of NAMES.slice(0, 2)) fire(requests.get(name), "onsuccess");
    await Promise.resolve();
    assert.equal(resolved, false);
    fire(requests.get(NAMES[2]), "onsuccess");
    assert.equal(await pending, true);
  });

  it("counts a blocked database once, and only when it later succeeds", async () => {
    const { idb, requests } = harness();
    let resolved = false;
    const pending = eraseDatabases(idb, NAMES, 500).then((value) => {
      resolved = true;
      return value;
    });
    const blocked = requests.get(NAMES[0]);
    fire(blocked, "onblocked");
    for (const name of NAMES.slice(1)) fire(requests.get(name), "onsuccess");
    await Promise.resolve();
    assert.equal(resolved, false);
    fire(blocked, "onsuccess");
    fire(blocked, "onerror");
    assert.equal(await pending, true);
  });

  it("resolves false only after every database has a terminal event", async () => {
    const { idb, requests } = harness();
    let resolved = false;
    const pending = eraseDatabases(idb, NAMES, 500).then((value) => {
      resolved = true;
      return value;
    });
    fire(requests.get(NAMES[0]), "onerror");
    fire(requests.get(NAMES[1]), "onsuccess");
    await Promise.resolve();
    assert.equal(resolved, false);
    fire(requests.get(NAMES[2]), "onsuccess");
    assert.equal(await pending, false);
  });

  it("treats a database that stays blocked as not cleared", async () => {
    const { idb, requests } = harness();
    const pending = eraseDatabases(idb, NAMES, 30);
    for (const name of NAMES) fire(requests.get(name), "onblocked");
    assert.equal(await pending, false);
  });
});
