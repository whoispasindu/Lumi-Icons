import { defineConfig } from "vitest/config";

// Runs against the built dist, so `pnpm build` must run first (the root suite excludes this package).
export default defineConfig({
  test: { include: ["test/**/*.test.ts"] },
});
