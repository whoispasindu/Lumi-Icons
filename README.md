# Lumi Icons

Animated, lightweight 3D icons for the web. 427 icons, one framework-independent Web Component, zero dependencies, about 29 KB gzipped. Use it in plain HTML, React, Vue, Svelte, or anything else that renders custom elements.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@lumi-icons/core/+esm"></script>

<lumi-icon name="rocket" size="48" color="#6a4dd8" animation="launch"></lumi-icon>
```

## Install

```bash
npm i @lumi-icons/core
```

```js
import "@lumi-icons/core"; // registers <lumi-icon>
```

### React

```bash
npm i @lumi-icons/core @lumi-icons/react
```

```tsx
import { LumiIcon } from "@lumi-icons/react";

<LumiIcon name="rocket" animation="launch" size={40} label="Launch" />;
```

### Vue

```bash
npm i @lumi-icons/core @lumi-icons/vue
```

```vue
<script setup lang="ts">
import { LumiIcon } from "@lumi-icons/vue";
</script>

<template>
  <LumiIcon name="rocket" animation="launch" :size="40" label="Launch" />
</template>
```

Both wrappers register the core element for you and accept the same props as the element's attributes. Importing any of the packages during server-side rendering is safe; the element comes to life in the browser.

## API

| Attribute   | Values                                                                    | Default        |
| ----------- | ------------------------------------------------------------------------- | -------------- |
| `name`      | Any icon name (see the catalog). Aliases such as `x` → `close` also work. | —              |
| `size`      | Pixels (`48`) or a CSS length (`2em`, `1.5rem`)                           | `24px`         |
| `color`     | Any CSS color. Omit it to inherit `currentColor`.                         | `currentColor` |
| `animation` | `none` `float` `spin` `pulse` `ring` `launch` `sparkle` `tilt`            | `none`         |
| `motion`    | `auto` follows the OS reduced-motion setting; `reduced` always holds still | `auto`         |
| `label`     | Accessible name. Without it the icon is decorative (`aria-hidden`).       | —              |

Styling hooks:

```css
lumi-icon { --lumi-icon-size: 32px; }   /* size without the attribute */
lumi-icon::part(icon) { opacity: .9; }  /* reach inside the shadow root */
```

The package also exports `icons` (name → `{ label, category, tags, svg }`), `iconNames`, `iconCategories`, `iconAnimations`, `iconAliases`, `resolveIconName`, and the `LumiIcon` element class, plus matching TypeScript types. `<lumi-icon>` is registered in `HTMLElementTagNameMap`, so `document.querySelector("lumi-icon")` is typed.

An unknown `name` renders nothing and logs a single console warning.

## Icons

427 icons in 23 categories: interface, layout, arrows, editor, design, files, development, devices, media, communication, people, security, time, commerce, travel, feedback, health, food, games, math, weather, nature, and objects. The first twenty are hand-constructed isometric objects; the rest are glyphs extruded along the same light direction, with a solid side face, a cast shadow, and a rim highlight, so the whole set shares one lighting model. Every shade is derived from a single color, so any brand color works.

Browse by category, search by name or tag, and copy HTML/React/Vue snippets or standalone SVG files in the playground: `pnpm dev`.

## Repository layout

```
src/                @lumi-icons/core source
  icons.ts          SVG catalog, categories, and search tags
  lumi-icon.ts      <lumi-icon> custom element and animation layer
  types.ts          Public names, categories, motion, and icon types
packages/react      @lumi-icons/react wrapper
packages/vue        @lumi-icons/vue wrapper
playground/         Vite catalog and interaction sandbox (index.html is its page)
test/               Vitest suites (catalog, element, SSR import)
```

## Development

This repo uses [pnpm](https://pnpm.io) workspaces.

```bash
pnpm install
pnpm dev              # playground at http://localhost:5173
pnpm test             # unit tests
pnpm build            # type-check, build core to dist/core, build the playground
pnpm build:wrappers   # build the React and Vue packages (after pnpm build)
```

## License

MIT
