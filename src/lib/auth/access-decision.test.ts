import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accessDecision } from "./access-decision.ts";

const base = { sessionUserId: null, devUserId: "dev-user" };

describe("accessDecision", () => {
  it("uses the shared dev user only when auth is off and there is no database", () => {
    assert.deepEqual(
      accessDecision({ ...base, authConfigured: false, gateIdentity: false, databaseConfigured: false }),
      { ok: true, userId: "dev-user", source: "dev" },
    );
  });

  it("fails closed when auth is off but a database is configured", () => {
    assert.deepEqual(
      accessDecision({ ...base, authConfigured: false, gateIdentity: false, databaseConfigured: true, sessionUserId: "browser-says-so" }),
      { ok: false, reason: "auth-off-with-database" },
    );
  });

  it("ignores a claimed id when auth is on and there is no verified session", () => {
    assert.deepEqual(
      accessDecision({
        authConfigured: true,
        gateIdentity: false,
        databaseConfigured: false,
        sessionUserId: null,
        devUserId: "dev-user",
      }),
      { ok: false, reason: "unauthorized" },
    );
  });

  it("uses only the session id once auth is on", () => {
    assert.deepEqual(
      accessDecision({
        authConfigured: true,
        gateIdentity: false,
        databaseConfigured: true,
        sessionUserId: "session-user",
        devUserId: "dev-user",
      }),
      { ok: true, userId: "session-user", source: "session" },
    );
  });
});
