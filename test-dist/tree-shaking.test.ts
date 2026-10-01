// @vitest-environment node
// Builds tiny apps against the *built* package (dist), as a user's bundler would see it, including the
// package.json "sideEffects" field, then inspects what ends up in the minified bundle. Run after `build:core`.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build, type Rollup } from "vite";
import { afterAll, describe, expect, it } from "vitest";

const dist = fileURLToPath(new URL("../dist/core/", import.meta.url)).replace(/\\/g, "/");
const dirs: string[] = [];
afterAll(() => dirs.forEach((dir) => rmSync(dir, { recursive: true, force: true })));

async function bundle(code: string) {
  const dir = mkdtempSync(join(tmpdir(), "lumi-shake-"));
  dirs.push(dir);
  const entry = join(dir, "entry.ts");
  writeFileSync(entry, code);
  const result = await build({
    configFile: false,
    logLevel: "silent",
    build: { write: false, minify: true, lib: { entry, formats: ["es"], fileName: "app" } },
  });
  const outputs = (Array.isArray(result) ? result : [result]) as Rollup.RollupOutput[];
  const js = outputs.flatMap((o) => o.output).filter((c): c is Rollup.OutputChunk => c.type === "chunk").map((c) => c.code).join("\n");
  return { js, gzip: gzipSync(js).length };
}

describe("tree-shaking", () => {
  it("ships only the imported icons with @lumi-icons/core/element + /icons", async () => {
    const { js, gzip } = await bundle(`
      import { registerIcons } from "${dist}element.js";
      import { rocketIcon, heartIcon } from "${dist}catalog.js";
      registerIcons(rocketIcon, heartIcon);
    `);
    expect(js).toContain('"rocket"');
    expect(js).toContain('"heart"');
    // A sample of icons that were not imported, across categories and both drawing styles.
    for (const absent of ['"croissant"', '"telescope"', '"cube"', '"gitBranch"', '"Magic wand"']) expect(js).not.toContain(absent);
    expect(gzip).toBeLessThan(6 * 1024);
  }, 60_000);

  it("ships the whole catalog with the zero-config @lumi-icons/core entry", async () => {
    const { js, gzip } = await bundle(`import "${dist}index.js";`);
    for (const present of ['"croissant"', '"telescope"', '"cube"', '"gitBranch"']) expect(js).toContain(present);
    expect(gzip).toBeGreaterThan(30 * 1024);
  }, 60_000);
});
