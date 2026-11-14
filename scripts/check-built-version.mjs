// Fail the build if a copied service worker is not stamped with package.json.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const version = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
const token = "__BOOK_VERSION__";
const found = [];

function walk(dir) {
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    const path = join(dir, name);
    let st;
    try {
      st = statSync(path);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(path);
    else if (name === "sw.js") found.push(path);
  }
}

for (const root of ["dist", ".output", ".vercel/output"]) walk(root);

if (found.length === 0) {
  console.error("check-built-version: no built sw.js. The shell cache was not stamped.");
  process.exit(1);
}

let failed = false;
for (const path of found) {
  const text = readFileSync(path, "utf8");
  const stamp = readFileSync(join(path, "..", "version.txt"), "utf8").trim();
  if (text.includes(token) || !text.includes(`rivetcare-shell-${version}`) || stamp !== version) {
    console.error(`check-built-version: ${path} is not package.json ${version}`);
    failed = true;
  }
}

if (failed) process.exit(1);
const banned = ["rivetcare-book.zip", "rivetcare-pages.zip", "rivetcare-pages.pdf"];
for (const name of banned) {
  const path = join(".vercel/output/static", name);
  if (existsSync(path)) {
    console.error(`check-built-version: ${name} must not be published.`);
    process.exit(1);
  }
}
console.log(`check-built-version: ${found.length} service worker(s) at ${version}`);
