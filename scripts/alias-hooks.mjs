import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../src/", import.meta.url);

function fileFor(specifier) {
  const base = fileURLToPath(new URL(specifier.slice(2), root));
  for (const suffix of ["", ".ts", ".tsx", ".mjs", ".js", ".json", "/index.ts"]) {
    if (existsSync(base + suffix)) return pathToFileURL(base + suffix).href;
  }
  return pathToFileURL(base).href;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(fileFor(specifier), context);
    }
    return nextResolve(specifier, context);
  },
});
