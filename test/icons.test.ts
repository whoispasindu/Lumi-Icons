import { describe, expect, it } from "vitest";
import { icons } from "../src/icons";
import { iconAliases, iconCategories, iconNames } from "../src/types";

describe("icon catalog", () => {
  it("defines every name exactly once", () => {
    expect(new Set(iconNames).size).toBe(iconNames.length);
    expect(Object.keys(icons).sort()).toEqual([...iconNames].sort());
  });

  it("gives every icon a label, a known category, and an svg", () => {
    for (const name of iconNames) {
      const icon = icons[name];
      expect(icon.name).toBe(name);
      expect(icon.label.length).toBeGreaterThan(0);
      expect(iconCategories).toContain(icon.category);
      expect(icon.svg).toMatch(/^<svg viewBox="0 0 24 24"[^>]*>.*<\/svg>$/s);
    }
  });

  it("has no duplicate drawings", () => {
    const seen = new Map<string, string>();
    for (const name of iconNames) {
      const duplicate = seen.get(icons[name].svg);
      expect(duplicate, `${name} duplicates ${duplicate}`).toBeUndefined();
      seen.set(icons[name].svg, name);
    }
  });

  it("has well-formed path data in every drawing", () => {
    const arity: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
    for (const name of iconNames) {
      for (const [, d] of icons[name].svg.matchAll(/\sd="([^"]*)"/g)) {
        const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g) ?? [];
        // Everything in the attribute must be a command, a number, or a separator.
        expect(d.replace(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?|[\s,]/g, ""), `${name}: stray characters in "${d}"`).toBe("");
        expect(tokens[0]?.toLowerCase(), `${name}: path must start with a move`).toBe("m");
        let command = "";
        let args: string[] = [];
        const flush = () => {
          const n = arity[command.toLowerCase()];
          if (n === 0) expect(args, `${name}: Z takes no arguments in "${d}"`).toHaveLength(0);
          else expect(args.length > 0 && args.length % n === 0, `${name}: ${command} got ${args.length} numbers in "${d}"`).toBe(true);
          if (command.toLowerCase() === "a") {
            for (let i = 0; i < args.length; i += 7) {
              expect(["0", "1"], `${name}: arc flags in "${d}"`).toContain(args[i + 3]);
              expect(["0", "1"], `${name}: arc flags in "${d}"`).toContain(args[i + 4]);
            }
          }
        };
        for (const token of tokens) {
          if (/[a-zA-Z]/.test(token)) {
            if (command) flush();
            expect(arity, `${name}: unknown command ${token}`).toHaveProperty(token.toLowerCase());
            command = token;
            args = [];
          } else {
            args.push(token);
          }
        }
        flush();
      }
    }
  });

  it("points aliases at real icons that are not names themselves", () => {
    for (const [alias, target] of Object.entries(iconAliases)) {
      expect(iconNames).toContain(target);
      expect(iconNames).not.toContain(alias);
    }
  });
});
