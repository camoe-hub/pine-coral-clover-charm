/**
 * Who a server function may act as. The only inputs are server facts.
 * A user id from the browser is not an input, so hiding a control cannot grant access.
 */
export type AccessDecision =
  | { ok: true; userId: string; source: "dev" | "session" }
  | { ok: false; reason: "auth-off-with-database" | "unauthorized" };

export function accessDecision(input: {
  authConfigured: boolean;
  gateIdentity: boolean;
  databaseConfigured: boolean;
  sessionUserId: string | null;
  devUserId: string;
}): AccessDecision {
  if (!input.authConfigured && !input.gateIdentity) {
    if (input.databaseConfigured) return { ok: false, reason: "auth-off-with-database" };
    return { ok: true, userId: input.devUserId, source: "dev" };
  }
  if (!input.sessionUserId) return { ok: false, reason: "unauthorized" };
  return { ok: true, userId: input.sessionUserId, source: "session" };
}
