/** Change this, rebuild the host folder, and put the new code on the Gumroad receipt. */
export const PASS_CODE = "RIVET-4H7Q";

const KEY = "rivetcare-pass";

export function passUnlocked() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberPass() {
  localStorage.setItem(KEY, "1");
}

function fold(value: string) {
  return value.trim().toUpperCase().replace(/[\s-]+/g, "");
}

export function codeMatches(value: string) {
  const got = fold(value);
  const want = fold(PASS_CODE);
  if (!got || got.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i++) diff |= got.charCodeAt(i) ^ want.charCodeAt(i);
  return diff === 0;
}
