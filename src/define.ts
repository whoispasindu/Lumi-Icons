import type { IconCategory, IconDefinition } from "./types.js";

// Shared fills for the hand-built 3D icons: every shade derives from currentColor.
export const edge = `fill="none" stroke="currentColor" stroke-opacity=".78" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"`;
export const shadow = `<ellipse cx="13" cy="20.6" rx="7.2" ry="1.25" fill="currentColor" opacity=".13"/>`;
export const top = `fill="currentColor" opacity=".50"`;
export const front = `fill="currentColor" opacity=".88"`;
export const side = `fill="currentColor" opacity=".30"`;
export const shine = `fill="#fff" opacity=".34"`;

const wrap = (body: string) => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;

const strokeStyle = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;
// The side face is the glyph stamped at small steps along the light direction (the same
// down-right depth the 3D icons use). Stamps overlap into one continuous solid; the group
// opacity is applied once, so overlaps do not darken into visible ghost outlines.
const depth = { x: 1.05, y: 1.3, steps: [1, 0.75, 0.5, 0.25] };

function extrude(glyph: string) {
  const solidGlyph = glyph.replace(/fill="#fff"/g, 'fill="currentColor"');
  const rim = glyph.replace(/fill="#fff"/g, 'fill="none"');
  const offset = (value: number) => Number(value.toFixed(3));
  const sideFace = depth.steps
    .map((step) => `<g transform="translate(${offset(depth.x * step)} ${offset(depth.y * step)})">${solidGlyph}</g>`)
    .join("");
  return wrap(
    `${shadow}<g opacity=".36" stroke="currentColor" stroke-width="1.6" ${strokeStyle}>${sideFace}</g>` +
    `<g stroke="currentColor" stroke-width="1.6" ${strokeStyle}>${solidGlyph}</g>` +
    `<g transform="translate(-.2 -.3)" stroke="#fff" stroke-opacity=".4" stroke-width=".55" ${strokeStyle}>${rim}</g>`,
  );
}

// The SVG is built on first use and cached, so defining hundreds of icons costs almost nothing up front.
function lazyIcon<N extends string>(
  name: N, label: string, category: IconCategory, tags: readonly string[], render: () => string,
): IconDefinition<N> {
  let svg: string | undefined;
  return {
    name, label, category, tags,
    get svg() {
      if (svg === undefined) svg = render();
      return svg;
    },
  };
}

/** An icon drawn as separate 3D faces (the original isometric set). `body` is the SVG content. */
export function solid<N extends string>(name: N, label: string, category: IconCategory, tags: readonly string[], body: string) {
  return lazyIcon(name, label, category, tags, () => wrap(body));
}

/** A line glyph extruded into 3D along the shared light direction. `markup` is the flat glyph. */
export function glyph<N extends string>(name: N, label: string, category: IconCategory, tags: readonly string[], markup: string) {
  return lazyIcon(name, label, category, tags, () => extrude(markup));
}
