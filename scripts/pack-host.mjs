/**
 * Build the self-hosted copy: one folder of files, no server.
 * Output is artifacts/rivetcare-host and artifacts/rivetcare-host.zip.
 * Never written into public/.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "artifacts", "rivetcare-host");
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;

execFileSync(process.execPath, ["scripts/with-app-env.mjs", "vite", "build", "--config", "vite.host.config.ts"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    VITE_HOST_EDITION: "1",
    PATH: `${join(root, "node_modules", ".bin")}:${process.env.PATH ?? ""}`,
  },
});

const swPath = join(out, "sw.js");
writeFileSync(swPath, readFileSync(swPath, "utf8").replaceAll("__BOOK_VERSION__", version));
writeFileSync(join(out, "version.txt"), `${version}\n`);

rmSync(join(out, "__grok"), { recursive: true, force: true });
rmSync(join(out, "rivetcare-host.zip"), { force: true });

const indexPath = join(out, "host", "index.html");
const index = readFileSync(indexPath, "utf8");
writeFileSync(join(out, "index.html"), index);
rmSync(join(out, "host"), { recursive: true, force: true });
for (const page of ["privacy", "support"]) {
  const dir = join(out, page);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), index);
}

writeFileSync(
  join(out, "_redirects"),
  "/* /index.html 200\n",
);

writeFileSync(
  join(out, "HOST.txt"),
  [
    "RivetCare self-hosted copy",
    `Version ${version}`,
    "",
    "Put this folder at the root of a website, not in a subfolder.",
    "Serve it over https.",
    "If a file is missing, serve index.html. Netlify and Cloudflare Pages already do that from _redirects.",
    "Privacy is /privacy and Support is /support. Both are included.",
    "Each phone keeps its own records. Nothing is stored on the server.",
    "Do not put this folder inside the published Grok app.",
    "",
  ].join("\n"),
);

const zip = join(root, "artifacts", "rivetcare-host.zip");
rmSync(zip, { force: true });
execFileSync(
  "python3",
  [
    "-c",
    "import sys, zipfile\nfrom pathlib import Path\nroot = Path(sys.argv[1])\nzip_path = Path(sys.argv[2])\nwith zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:\n    for path in root.rglob('*'):\n        if path.is_file():\n            z.write(path, path.relative_to(root).as_posix())\n",
    out,
    zip,
  ],
  { stdio: "inherit" },
);
const saleCode = readFileSync(join(root, "src", "lib", "pass-code.ts"), "utf8").match(/PASS_CODE = "([^"]+)"/)?.[1] ?? "";
writeFileSync(
  join(root, "artifacts", "SALE-CODE.txt"),
  `Put this code on the Gumroad receipt. It is not inside the site folder.\n${saleCode}\n`,
);
