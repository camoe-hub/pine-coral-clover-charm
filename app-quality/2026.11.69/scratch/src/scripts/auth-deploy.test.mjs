import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url);

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

test("the shipped config keeps accounts off", () => {
  const env = JSON.parse(read(".grok/app-env.json"));
  assert.equal(env.VITE_AUTH_ENABLED, "false");
  assert.equal(env.deploy.database, false);
});

test("Better Auth is on the patched 1.7 line", () => {
  const pkg = JSON.parse(read("package.json"));
  const declared = pkg.dependencies["better-auth"];
  assert.match(declared, /^~1\.7\.(1[6-9]|[2-9]\d)$/);
  const installed = JSON.parse(read("node_modules/better-auth/package.json")).version;
  const [major, minor, patch] = installed.split(".").map(Number);
  assert.equal(major, 1);
  assert.ok(minor > 7 || (minor === 7 && patch >= 16), installed);
});

test("auth off does not require a login route, and auth on would", () => {
  const env = JSON.parse(read(".grok/app-env.json"));
  const authOn = env.VITE_AUTH_ENABLED === "true";
  const login = existsSync(join(root.pathname, "src/routes/login.tsx"));
  if (authOn) assert.equal(login, true, "VITE_AUTH_ENABLED=true needs src/routes/login.tsx");
  else assert.equal(login, false);
});

test("the server does not load the vulnerable optional plugins", () => {
  const code = read("src/lib/auth/server.ts").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(code, /magicLink|oauthProxy|deviceAuthorization/);
  assert.match(code, /authorizationUrl/);
  assert.doesNotMatch(code, /discoveryUrl|getUserInfo/);
  const verify = read("src/lib/auth/verify.server.ts").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.match(verify, /auth\.api\.getSession/);
  assert.match(verify, /accessDecision/);
  assert.doesNotMatch(verify, /searchParams|body\.userId|clientUserId/);
});
