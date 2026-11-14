/**
 * Write artifacts/rivetcare-book.zip: the app source only.
 * It is not served. Research notes, audits, screenshots, and builder files stay out.
 * Run: node scripts/pack-source.mjs
 */
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { crc32, deflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT_REL = "artifacts/rivetcare-book.zip";

const SKIP_DIR = new Set(["node_modules", "dist", "artifacts", "attachments", "screenshots", "app-quality", ".git", "__pycache__"]);
const STORED = new Set([".jpg", ".jpeg", ".png", ".webp", ".woff2", ".zip"]);

export function skipRel(rel) {
  const name = rel.split(sep).join("/").replace(/\/$/, "");
  if (
    !name ||
    name === OUT_REL ||
    name === `${OUT_REL}.tmp` ||
    name === "public/rivetcare-book.zip" ||
    name === "public/rivetcare-pages.pdf" ||
    name === "public/rivetcare-pages.zip"
  ) return true;
  // The auth-off flag is not a secret. The rest of the builder folder stays out.
  if (name === ".grok" || name === ".grok/app-env.json") return false;
  if (name.startsWith(".grok/")) return true;
  const top = name.split("/")[0];
  if (SKIP_DIR.has(top)) return true;
  if (name === "public/.well-known" || name === "public/.well-known/security.txt") return false;
  if (name.split("/").some((part) => part === "__pycache__" || part.startsWith("."))) {
    const file = name.slice(name.lastIndexOf("/") + 1);
    if (file !== ".vercelignore" && file !== ".prettierrc" && file !== ".gitignore" && file !== ".env.example") return true;
  }
  return false;
}

function walk(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    const rel = relative(ROOT, abs);
    if (entry.isDirectory()) {
      if (skipRel(rel + "/")) continue;
      walk(abs, out);
    } else if (entry.isFile() && !skipRel(rel)) {
      out.push(rel.split(sep).join("/"));
    }
  }
}

function u16(n) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n);
  return b;
}
function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n >>> 0);
  return b;
}

export function packSource() {
  const names = [];
  walk(ROOT, names);
  names.sort();
  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const name of names) {
    const data = readFileSync(join(ROOT, name));
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    const store = STORED.has(ext);
    const payload = store ? data : deflateRawSync(data);
    const method = store ? 0 : 8;
    const crc = crc32(data) >>> 0;
    const nameBuf = Buffer.from(name);
    const local = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(method),
      u16(time),
      u16(date),
      u32(crc),
      u32(payload.length),
      u32(data.length),
      u16(nameBuf.length),
      u16(0),
      nameBuf,
      payload,
    ]);
    const central = Buffer.concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(method),
      u16(time),
      u16(date),
      u32(crc),
      u32(payload.length),
      u32(data.length),
      u16(nameBuf.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBuf,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const centralBuf = Buffer.concat(centrals);
  const eocd = Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(names.length),
    u16(names.length),
    u32(centralBuf.length),
    u32(offset),
    u16(0),
  ]);
  const zip = Buffer.concat([...locals, centralBuf, eocd]);
  mkdirSync(join(ROOT, "artifacts"), { recursive: true });
  const tmp = join(ROOT, OUT_REL + ".tmp");
  writeFileSync(tmp, zip);
  renameSync(tmp, join(ROOT, OUT_REL));
  return { count: names.length, sha256: createHash("sha256").update(zip).digest("hex"), bytes: zip.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const result = packSource();
  console.log(`entries ${result.count}`);
  console.log(`bytes ${result.bytes}`);
  console.log(`sha256 ${result.sha256}`);
}
