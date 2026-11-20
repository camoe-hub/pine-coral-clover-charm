import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** A static site. No TanStack server. Put the folder at the root of a host. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "artifacts/rivetcare-host",
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL("./host/index.html", import.meta.url)),
    },
  },
});
