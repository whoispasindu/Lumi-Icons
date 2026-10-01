import type { IconAnimation } from "@lumi-icons/core";

/** A keyframe track: progress stops (0–1) and the value at each stop. */
export interface Track {
  input: number[];
  output: number[];
}

type TrackName = "translateX" | "translateY" | "rotate" | "rotateX" | "rotateY" | "scale" | "opacity";
type Easing = "linear" | "ease-in-out" | "launch";

export interface MotionSpec {
  duration: number;
  /** Easing between each pair of keyframes, as CSS applies it. */
  easing: Easing;
  /** Values are: translate in fractions of the icon size, rotations in degrees, scale and opacity as numbers. */
  tracks: Partial<Record<TrackName, Track>>;
  /** CSS-style transform origin, e.g. "50% 14%". */
  origin?: string;
  /** Perspective distance as a multiple of the icon size. */
  perspective?: number;
}

export type Motion = Exclude<IconAnimation, "none">;

// These mirror the @keyframes in @lumi-icons/core so an icon moves the same on web and native.
export const motions: Record<Motion, MotionSpec> = {
  float: { duration: 2400, easing: "ease-in-out", tracks: { translateY: { input: [0, 0.5, 1], output: [0, -0.08, 0] } } },
  spin: { duration: 2700, easing: "linear", tracks: { rotate: { input: [0, 1], output: [0, 360] } } },
  pulse: {
    duration: 1600,
    easing: "ease-in-out",
    tracks: { scale: { input: [0, 0.5, 1], output: [1, 0.88, 1] }, opacity: { input: [0, 0.5, 1], output: [1, 0.65, 1] } },
  },
  ring: {
    duration: 2200,
    easing: "ease-in-out",
    origin: "50% 14%",
    tracks: { rotate: { input: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 1], output: [0, 12, -12, 12, -12, 0, 0] } },
  },
  launch: {
    duration: 2200,
    easing: "launch",
    tracks: {
      translateX: { input: [0, 0.4, 0.58, 1], output: [0, 0.12, 0, 0] },
      translateY: { input: [0, 0.4, 0.58, 1], output: [0, -0.12, 0, 0] },
      rotate: { input: [0, 0.4, 0.58, 1], output: [0, 8, 0, 0] },
    },
  },
  sparkle: {
    duration: 1700,
    easing: "ease-in-out",
    tracks: { scale: { input: [0, 0.5, 1], output: [1, 1.12, 1] }, rotate: { input: [0, 0.5, 1], output: [0, 10, 0] } },
  },
  tilt: {
    duration: 2400,
    easing: "ease-in-out",
    perspective: 3.3,
    tracks: { rotateY: { input: [0, 0.5, 1], output: [0, 22, 0] }, rotateX: { input: [0, 0.5, 1], output: [0, -8, 0] } },
  },
};

/** CSS cubic-bezier(x1, y1, x2, y2) as a function of progress. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bezier = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // x(t) is monotonic for valid CSS curves, so bisection finds t reliably.
    let low = 0;
    let high = 1;
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      if (bezier(mid, x1, x2) < x) low = mid;
      else high = mid;
    }
    return bezier((low + high) / 2, y1, y2);
  };
}

const easings: Record<Easing, (x: number) => number> = {
  linear: (x) => x,
  "ease-in-out": cubicBezier(0.42, 0, 0.58, 1),
  launch: cubicBezier(0.25, 0.8, 0.25, 1),
};

/**
 * Native-driver animations cannot run JS easing functions, so each eased segment is baked into
 * extra keyframes. Linear interpolation over them then follows the CSS curve closely.
 */
export function bake(track: Track, easing: Easing, samplesPerSegment = 12): Track {
  if (easing === "linear") return track;
  const ease = easings[easing];
  const input: number[] = [];
  const output: number[] = [];
  for (let segment = 0; segment < track.input.length - 1; segment++) {
    const [x0, x1] = [track.input[segment], track.input[segment + 1]];
    const [y0, y1] = [track.output[segment], track.output[segment + 1]];
    for (let step = 0; step < samplesPerSegment; step++) {
      const local = step / samplesPerSegment;
      input.push(x0 + (x1 - x0) * local);
      output.push(y0 + (y1 - y0) * ease(local));
    }
  }
  input.push(track.input[track.input.length - 1]);
  output.push(track.output[track.output.length - 1]);
  return { input, output };
}
