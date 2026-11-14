import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bookWorkerScript, workerIsCurrent } from "./worker-script.ts";

describe("service worker address", () => {
  it("changes with the copy and treats an unversioned worker as old", () => {
    assert.equal(bookWorkerScript("2026.11.38"), "/sw.js?v=2026.11.38");
    assert.equal(workerIsCurrent("https://pine-coral-clover-charm.grok.me/sw.js?v=2026.11.38", "2026.11.38"), true);
    assert.equal(workerIsCurrent("https://pine-coral-clover-charm.grok.me/sw.js", "2026.11.38"), false);
    assert.equal(workerIsCurrent("https://pine-coral-clover-charm.grok.me/sw.js?v=2026.11.37", "2026.11.38"), false);
    assert.equal(workerIsCurrent("https://pine-coral-clover-charm.grok.me/theme-boot.js", "2026.11.38"), false);
  });
});
