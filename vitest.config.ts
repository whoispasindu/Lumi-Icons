import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The Angular package tests run against its built output: `pnpm --filter @lumi-icons/angular test`.
    // test-dist needs a built dist: `pnpm test:dist`.
    exclude: [...configDefaults.exclude, "packages/angular/**", "test-dist/**"],
  },
});
