export type BackupLook = {
  bytes: number;
  version: string;
  coaches: number;
  service: number;
  notes: number;
  checks: number;
  maintenance: number;
  photos: number;
  weights: number;
};

/** Dated name so two saves are not the same file. */
export function backupFileName(iso: string) {
  const day = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : "undated";
  return `rivetcare-backup-${day}.json`;
}

/** Repeated log or note ids in the file. The file is not applied. */
export function repeatedRecordIds(data: Record<string, unknown>): number {
  const seen = new Set<string>();
  let extra = 0;
  const take = (id: unknown) => {
    if (typeof id !== "string" || !id) return;
    if (seen.has(id)) extra += 1;
    else seen.add(id);
  };
  const walk = (row: unknown) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return;
    const coach = row as Record<string, unknown>;
    if (Array.isArray(coach.log)) {
      for (const entry of coach.log) if (entry && typeof entry === "object") take((entry as { id?: unknown }).id);
    }
    if (Array.isArray(coach.notes)) {
      for (const entry of coach.notes) if (entry && typeof entry === "object") take((entry as { id?: unknown }).id);
    }
  };
  const coaches = data.coaches;
  if (coaches && typeof coaches === "object" && !Array.isArray(coaches)) {
    for (const row of Object.values(coaches)) walk(row);
  } else {
    walk(data);
  }
  return extra;
}

function countKeys(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
  return Object.keys(value).length;
}

function countList(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

/** What a backup file contains. It does not apply the file. */
export function lookAtBackup(data: Record<string, unknown>, bytes: number): BackupLook {
  const coaches = data.coaches && typeof data.coaches === "object" && !Array.isArray(data.coaches) ? (data.coaches as Record<string, unknown>) : null;
  let service = 0;
  let notes = 0;
  let checks = 0;
  let maintenance = 0;
  if (coaches) {
    for (const row of Object.values(coaches)) {
      if (!row || typeof row !== "object" || Array.isArray(row)) continue;
      const coach = row as Record<string, unknown>;
      service += countList(coach.log);
      notes += countList(coach.notes);
      checks += countKeys(coach.checks);
      maintenance += countKeys(coach.done);
    }
  } else {
    service = countList(data.log);
    notes = countList(data.notes);
    checks = countKeys(data.checks);
    maintenance = countKeys(data.done);
  }
  return {
    bytes,
    version: typeof data.version === "number" ? String(data.version) : "Not marked",
    coaches: coaches ? Object.keys(coaches).length : typeof data.modelId === "string" ? 1 : 0,
    service,
    notes,
    checks,
    maintenance,
    photos: countKeys(data.files),
    weights: countKeys(data.weights),
  };
}

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
  0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351,
  0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585,
  0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
  0xc67178f2,
]);

function rotr(x: number, n: number) {
  return (x >>> n) | (x << (32 - n));
}

/** SHA-256 over UTF-8, one piece at a time, so a photo backup is not copied into one string. */
class Sha256 {
  private h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  private buf = new Uint8Array(64);
  private bufLen = 0;
  private bytes = 0;
  private w = new Uint32Array(64);
  private encoder = new TextEncoder();

  update(text: string, from = 0, to = text.length) {
    const size = 0x8000;
    for (let i = from; i < to; ) {
      let end = Math.min(to, i + size);
      if (end < to && text.charCodeAt(end - 1) >= 0xd800 && text.charCodeAt(end - 1) <= 0xdbff) end -= 1;
      if (end <= i) end = Math.min(to, i + size);
      this.feed(this.encoder.encode(text.slice(i, end)));
      i = end;
    }
  }

  private feed(data: Uint8Array) {
    this.bytes += data.length;
    let offset = 0;
    if (this.bufLen > 0) {
      const take = Math.min(64 - this.bufLen, data.length);
      this.buf.set(data.subarray(0, take), this.bufLen);
      this.bufLen += take;
      offset = take;
      if (this.bufLen === 64) {
        this.compress(this.buf);
        this.bufLen = 0;
      }
    }
    while (offset + 64 <= data.length) {
      this.compress(data.subarray(offset, offset + 64));
      offset += 64;
    }
    if (offset < data.length) {
      this.buf.set(data.subarray(offset), 0);
      this.bufLen = data.length - offset;
    }
  }

  private compress(block: Uint8Array) {
    const w = this.w;
    for (let i = 0; i < 16; i += 1) {
      const j = i * 4;
      w[i] = ((block[j] << 24) | (block[j + 1] << 16) | (block[j + 2] << 8) | block[j + 3]) >>> 0;
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let a = this.h[0];
    let b = this.h[1];
    let c = this.h[2];
    let d = this.h[3];
    let e = this.h[4];
    let f = this.h[5];
    let g = this.h[6];
    let h = this.h[7];
    for (let i = 0; i < 64; i += 1) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + s1 + ch + K[i] + w[i]) >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    this.h[0] = (this.h[0] + a) >>> 0;
    this.h[1] = (this.h[1] + b) >>> 0;
    this.h[2] = (this.h[2] + c) >>> 0;
    this.h[3] = (this.h[3] + d) >>> 0;
    this.h[4] = (this.h[4] + e) >>> 0;
    this.h[5] = (this.h[5] + f) >>> 0;
    this.h[6] = (this.h[6] + g) >>> 0;
    this.h[7] = (this.h[7] + h) >>> 0;
  }

  hex() {
    const bits = this.bytes * 8;
    const padLen = this.bufLen < 56 ? 64 - this.bufLen : 128 - this.bufLen;
    const pad = new Uint8Array(padLen);
    pad[0] = 0x80;
    const view = new DataView(pad.buffer);
    view.setUint32(pad.length - 8, Math.floor(bits / 0x100000000));
    view.setUint32(pad.length - 4, bits >>> 0);
    const counted = this.bytes;
    this.feed(pad);
    this.bytes = counted;
    return [...this.h].map((word) => word.toString(16).padStart(8, "0")).join("");
  }
}

export function sha256Hex(text: string): string {
  return hashStrings([text]);
}

export function hashStrings(parts: readonly string[]): string {
  const hash = new Sha256();
  for (const part of parts) hash.update(part);
  return hash.hex();
}

/** ok: the checksum matches. none: an older file with no checksum. bad: the file was damaged or cut off. */
export function backupIntegrity(raw: string): "ok" | "none" | "bad" {
  const start = raw.charCodeAt(0) === 0xfeff ? 1 : 0;
  const mark = ',"integrity":';
  const at = raw.lastIndexOf(mark);
  if (at < start) return "none";
  const tail = raw.slice(at);
  const match = tail.match(/^,"integrity":"([a-f0-9]{64})"}\s*$/);
  if (!match) return "none";
  const hash = new Sha256();
  hash.update(raw, start, at);
  return hash.hex() === match[1] ? "ok" : "bad";
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "Not saved yet";
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
