// @vitest-environment node
import { expect, it } from "vitest";

it("can be imported where the DOM does not exist (SSR)", async () => {
  expect(typeof HTMLElement).toBe("undefined");
  const core = await import("../src/index");
  expect(core.iconNames.length).toBeGreaterThan(200);
  expect(core.icons.rocket.svg).toContain("<svg");
});
