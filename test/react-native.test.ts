// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { bake, cubicBezier, motions } from "../packages/react-native/src/motion";
import { iconNames, icons } from "../src/icons";
import { iconAnimations } from "../src/types";

describe("React Native motion", () => {
  it("has a spec for every animation", () => {
    expect(Object.keys(motions).sort()).toEqual(iconAnimations.filter((a) => a !== "none").sort());
  });

  it("uses well-formed keyframe tracks that loop without a jump", () => {
    for (const [name, spec] of Object.entries(motions)) {
      for (const [trackName, track] of Object.entries(spec.tracks)) {
        const label = `${name}.${trackName}`;
        expect(track.input.length, label).toBe(track.output.length);
        expect(track.input[0], label).toBe(0);
        expect(track.input.at(-1), label).toBe(1);
        for (let i = 1; i < track.input.length; i++) expect(track.input[i], label).toBeGreaterThan(track.input[i - 1]);
        // The last frame must equal the first (a full turn counts as equal) or each loop would visibly snap.
        const [first, last] = [track.output[0], track.output.at(-1)!];
        const wraps = trackName.startsWith("rotate") ? (last - first) % 360 === 0 : last === first;
        expect(wraps, label).toBe(true);
      }
    }
  });

  it("matches CSS ease-in-out", () => {
    const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 5);
    expect(easeInOut(0.25)).toBeCloseTo(0.1291, 3); // the standard value for CSS ease-in-out
  });

  it("bakes easing into keyframes and keeps the original keyframes exact", () => {
    const float = motions.float.tracks.translateY!;
    const baked = bake(float, "ease-in-out");
    for (let i = 1; i < baked.input.length; i++) expect(baked.input[i]).toBeGreaterThan(baked.input[i - 1]);
    for (const [index, stop] of float.input.entries()) {
      expect(baked.output[baked.input.indexOf(stop)]).toBeCloseTo(float.output[index], 10);
    }
    // Halfway through the rise the eased value is halfway there (the curve is symmetric).
    expect(baked.output[baked.input.findIndex((x) => Math.abs(x - 0.25) < 1e-9)]).toBeCloseTo(-0.04, 5);
    // Linear tracks are left untouched.
    expect(bake(motions.spin.tracks.rotate!, "linear")).toEqual(motions.spin.tracks.rotate);
  });
});

describe("icon markup for react-native-svg", () => {
  it("is well-formed XML (SvgXml parses strictly, unlike HTML)", () => {
    const parser = new DOMParser();
    for (const name of iconNames) {
      const doc = parser.parseFromString(icons[name].svg, "application/xml");
      expect(doc.querySelector("parsererror"), name).toBeNull();
      expect(doc.documentElement.nodeName, name).toBe("svg");
    }
  });
});
