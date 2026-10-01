import { defineConfig } from "vitest/config";

// Tests that need the built package (dist): run with `pnpm test:dist` after `pnpm build:core`.
export default defineConfig({
  test: { include: ["test-dist/**/*.test.ts"] },
});
