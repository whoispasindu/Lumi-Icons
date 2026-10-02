import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// The demo imports the built package (dist/core), the same files npm users get.
// `pnpm demo` rebuilds it first.
const dist = (file) => fileURLToPath(new URL(`../dist/core/${file}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@lumi-icons\/core$/, replacement: dist("index.js") },
      { find: /^@lumi-icons\/core\/element$/, replacement: dist("element.js") },
      { find: /^@lumi-icons\/core\/icons$/, replacement: dist("catalog.js") },
    ],
  },
  server: { port: 5174 },
  build: { outDir: "dist", emptyOutDir: true },
});
