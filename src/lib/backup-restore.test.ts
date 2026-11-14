import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { backupIntegrity, hashStrings } from "./backup-look.ts";
import { backupAppOk } from "./backup-version.ts";
import { backupHead } from "./backup.ts";
import { closeFiles } from "./files.ts";
import { fileStillUsed, useApp } from "./store.ts";

const original = { id: "keep", iso: "2026-01-02", miles: 12, note: "axle pack" };

describe("a damaged backup does not replace records", () => {
  it("refuses a bad checksum and a newer file, and does not write before apply", () => {
    useApp.setState({ log: [original], notes: [] });
    const before = useApp.getState().log.map((entry) => entry.note).join("\n");
    const body = '{"version":1,"log":[{"id":"x","iso":"2026-02-02","miles":1,"note":"replaced"}]';
    const damaged = `${body} ,"integrity":"${hashStrings(["{}"])}"}`;
    assert.equal(backupIntegrity(damaged), "bad");
    if (backupIntegrity(damaged) !== "bad") useApp.getState().importBackup(damaged);
    assert.equal(useApp.getState().importBackup("{").ok, false);
    assert.equal(useApp.getState().importBackup({ version: 99, log: [{ id: "x", iso: "2026-02-02", miles: 1, note: "replaced" }] }).ok, false);
    const pending = useApp.getState().importBackup({
      version: 1,
      modelId: "c28",
      log: [{ id: "x", iso: "2026-02-02", miles: 1, note: "replaced" }],
    });
    assert.equal(pending.ok, true);
    assert.equal(useApp.getState().log.map((entry) => entry.note).join("\n"), before);
  });
});

describe("backup name", () => {
  it("writes RivetCare and still reads a SilverBullet file", () => {
    const legacy = JSON.parse(readFileSync(new URL("./fixtures/legacy-backup.json", import.meta.url), "utf8"));
    const current = JSON.parse(readFileSync(new URL("./fixtures/rivetcare-backup.json", import.meta.url), "utf8"));
    const unmarked = { version: 1, modelId: "c28", log: [{ id: "plain", iso: "2026-01-01", miles: 1, note: "no name field" }] };
    assert.equal(backupAppOk(legacy.app), true);
    assert.equal(backupAppOk(current.app), true);
    assert.equal(backupAppOk(undefined), true);
    assert.equal(backupAppOk("Other"), false);
    for (const file of [legacy, current, unmarked]) {
      const pending = useApp.getState().importBackup(file);
      assert.equal(pending.ok, true);
      if (!pending.ok) continue;
      assert.equal(pending.apply(), true);
      assert.equal(useApp.getState().log[0]?.note, file.log[0].note);
    }
    const written = backupHead({
      modelId: "c28",
      coaches: {},
      odometer: 0,
      done: {},
      checks: {},
      log: [],
      notes: [],
      dealer: "",
      dealerAddress: "",
      hint: false,
      vin: "",
      wheelOff: null,
      lugAck: 0,
      ready: false,
      coachSet: false,
      tires: {},
      supplies: {},
      plates: {},
      listDone: {},
      logDraft: null,
      winterPlace: "",
      photoId: null,
      shots: {},
      nickname: "",
      modelYear: null,
    });
    assert.equal(written.app, "RivetCare");
    assert.equal(useApp.getState().importBackup({ ...unmarked, app: "Other" }).ok, false);
  });
});

describe("a restore does not wipe a coach the file does not contain", () => {
  it("keeps a note saved after the preview", () => {
    useApp.setState({ modelId: "c28", notes: [], log: [], coaches: {}, odometer: 0, photoId: null });
    const pending = useApp.getState().importBackup({
      version: 1,
      modelId: "gt27",
      coaches: { gt27: { odometer: 10, notes: [], log: [] } },
    });
    assert.equal(pending.ok, true);
    if (!pending.ok) return;
    assert.equal(useApp.getState().addNote("after preview"), true);
    assert.equal(pending.apply(), true);
    assert.equal(useApp.getState().modelId, "gt27");
    assert.equal(useApp.getState().coaches.c28?.notes.some((note) => note.text === "after preview"), true);
  });

  it("still replaces a coach that is in the file", () => {
    useApp.setState({
      modelId: "c28",
      notes: [{ id: "n1", iso: "2026-01-01", text: "before" }],
      log: [],
      coaches: {},
      odometer: 0,
      photoId: null,
    });
    const pending = useApp.getState().importBackup({
      version: 1,
      modelId: "c28",
      coaches: { c28: { odometer: 4, notes: [], log: [] } },
    });
    assert.equal(pending.ok, true);
    if (!pending.ok) return;
    assert.equal(useApp.getState().addNote("after preview"), true);
    assert.equal(pending.apply(), true);
    assert.equal(useApp.getState().notes.some((note) => note.text === "after preview"), false);
    assert.equal(useApp.getState().odometer, 4);
  });
});

describe("a photo delete stays on the coach that owned it", () => {
  it("does not drop a photo another coach still uses, and does not clear a coach that was switched to", async () => {
    const deleted: string[] = [];
    const previousDb = globalThis.indexedDB;
    const previousDoc = globalThis.document;
    const previousNav = globalThis.navigator;
    globalThis.indexedDB = {
      open() {
        const req = {
          result: {
            objectStoreNames: { contains: () => true },
            close() {},
            onversionchange: null,
            onclose: null,
            transaction() {
              const tx = {
                oncomplete: undefined as (() => void) | undefined,
                onerror: undefined as (() => void) | undefined,
                objectStore() {
                  return { delete: (id: string) => deleted.push(id) };
                },
              };
              queueMicrotask(() => tx.oncomplete?.());
              return tx;
            },
          },
          onupgradeneeded: undefined as (() => void) | undefined,
          onsuccess: undefined as (() => void) | undefined,
          onerror: undefined as (() => void) | undefined,
        };
        queueMicrotask(() => req.onsuccess?.());
        return req;
      },
      deleteDatabase() {
        return { onsuccess: undefined as (() => void) | undefined, onerror: undefined as (() => void) | undefined, onblocked: undefined as (() => void) | undefined };
      },
    } as unknown as IDBFactory;
    try {
      useApp.setState({
        modelId: "c28",
        photoId: "shared",
        notes: [],
        log: [],
        coaches: { gt27: { photoId: "shared", notes: [], log: [], shots: {} } as never },
      });
      await Promise.resolve(useApp.getState().setTrailerPhoto(null));
      await new Promise((resolve) => setTimeout(resolve, 30));
      assert.equal(useApp.getState().photoId, null);
      assert.equal(useApp.getState().coaches.gt27?.photoId, "shared");
      assert.equal(fileStillUsed("shared"), true);
      assert.equal(deleted.includes("shared"), false);

      closeFiles();
      deleted.length = 0;
      Object.defineProperty(globalThis, "document", { value: {}, configurable: true });
      Object.defineProperty(globalThis, "navigator", {
        value: { locks: { request: (_name: string, callback: () => unknown) => callback() } },
        configurable: true,
      });
      useApp.setState({
        modelId: "c28",
        photoId: "pic-a",
        notes: [],
        log: [],
        shots: {},
        coaches: { gt27: { photoId: "pic-b", notes: [], log: [], shots: {} } as never },
      });
      useApp.getState().setModel("gt27");
      await Promise.resolve(useApp.getState().setTrailerPhoto(null));
      await new Promise((resolve) => setTimeout(resolve, 30));
      assert.equal(useApp.getState().modelId, "gt27");
      assert.equal(useApp.getState().photoId, "pic-b");
      assert.equal(useApp.getState().coaches.c28?.photoId, "pic-a");
      assert.equal(deleted.includes("pic-a"), false);
      assert.equal(deleted.includes("pic-b"), false);
    } finally {
      closeFiles();
      globalThis.indexedDB = previousDb;
      Object.defineProperty(globalThis, "document", { value: previousDoc, configurable: true });
      Object.defineProperty(globalThis, "navigator", { value: previousNav, configurable: true });
    }
  });

  it("does not delete a section photo another coach still uses", async () => {
    const deleted: string[] = [];
    const previousDb = globalThis.indexedDB;
    globalThis.indexedDB = {
      open() {
        const req = {
          result: {
            objectStoreNames: { contains: () => true },
            close() {},
            onversionchange: null,
            onclose: null,
            transaction() {
              const tx = {
                oncomplete: undefined as (() => void) | undefined,
                onerror: undefined as (() => void) | undefined,
                objectStore() {
                  return { delete: (id: string) => deleted.push(id) };
                },
              };
              queueMicrotask(() => tx.oncomplete?.());
              return tx;
            },
          },
          onupgradeneeded: undefined as (() => void) | undefined,
          onsuccess: undefined as (() => void) | undefined,
          onerror: undefined as (() => void) | undefined,
        };
        queueMicrotask(() => req.onsuccess?.());
        return req;
      },
      deleteDatabase() {
        return { onsuccess: undefined as (() => void) | undefined, onerror: undefined as (() => void) | undefined, onblocked: undefined as (() => void) | undefined };
      },
    } as unknown as IDBFactory;
    const shot = { id: "shared", name: "filter.jpg", mime: "image/jpeg" };
    try {
      useApp.setState({
        modelId: "c28",
        photoId: null,
        shots: { "care:ac-filter": [shot] },
        notes: [],
        log: [],
        coaches: { gt27: { photoId: null, notes: [], log: [], shots: { "care:ac-filter": [shot] } } as never },
      });
      await useApp.getState().removeShot("care:ac-filter", "shared");
      await new Promise((resolve) => setTimeout(resolve, 30));
      assert.equal(useApp.getState().shots["care:ac-filter"]?.length ?? 0, 0);
      assert.equal(fileStillUsed("shared"), true);
      assert.equal(deleted.includes("shared"), false);

      useApp.setState({
        modelId: "c28",
        shots: { "care:ac-filter": [{ id: "only", name: "only.jpg", mime: "image/jpeg" }] },
        coaches: {},
      });
      await useApp.getState().removeShot("care:ac-filter", "only");
      await new Promise((resolve) => setTimeout(resolve, 30));
      assert.equal(deleted.includes("only"), true);
    } finally {
      closeFiles();
      globalThis.indexedDB = previousDb;
    }
  });
});
