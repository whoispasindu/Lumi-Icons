<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/logo-lockup-dark.svg" />
    <img src="brand/logo-lockup-light.svg" alt="Lumi Icons" width="288" height="64" />
  </picture>
</h1>

Animated, lightweight 3D icons for the web and mobile. 828 icons, zero dependencies, and tree-shakable: 20 icons cost about 5 KB gzipped. One framework-independent Web Component for HTML, React, Vue, Angular, Svelte, and anything else that renders custom elements, plus a native renderer for React Native.

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

### Angular

```bash
npm i @lumi-icons/core @lumi-icons/angular
```

```ts
import { Component } from "@angular/core";
import { LumiIconComponent } from "@lumi-icons/angular";

@Component({
  selector: "app-launch",
  imports: [LumiIconComponent],
  template: `<lumi-icon name="rocket" animation="launch" [size]="40" label="Launch" />`,
})
export class LaunchComponent {}
```

A standalone component with typed signal inputs (Angular 17.1+). No `CUSTOM_ELEMENTS_SCHEMA` needed.

The React, Vue, and Angular packages register the core element for you and accept the same props as the element's attributes. Importing any of them during server-side rendering is safe; the element comes to life in the browser.

### React Native

```bash
npm i @lumi-icons/core @lumi-icons/react-native react-native-svg
```

```tsx
import { LumiIcon } from "@lumi-icons/react-native";

<LumiIcon name="rocket" size={40} color="#6a4dd8" animation="launch" label="Launch" />;
```

React Native has no DOM, so this package is a native renderer: it draws the same artwork with `react-native-svg` and recreates every animation with `Animated` on the native driver. It follows the device's reduce-motion setting.

### Svelte, Solid, Lit, Astro, and others

Any framework that renders custom elements uses the Web Component directly: `import "@lumi-icons/core"`, then write `<lumi-icon name="rocket"></lumi-icon>`.

## Smaller bundles

`import "@lumi-icons/core"` registers every icon (about 58 KB gzipped), so any name works with zero setup. For production apps, import the element and only the icons you use; bundlers drop the rest:

```js
import { registerIcons } from "@lumi-icons/core/element"; // the element, no artwork (~2.4 KB)
import { rocketIcon, heartIcon } from "@lumi-icons/core/icons"; // one export per icon: "<name>Icon"

registerIcons(rocketIcon, heartIcon);
// <lumi-icon name="rocket"> now renders; an app using 20 icons ships about 5 KB gzipped.
```

Every framework package has a matching lean entry and an `icon` prop that registers the icon for you:

| Package | Everything by name | Only what you import |
| --- | --- | --- |
| React | `@lumi-icons/react` | `@lumi-icons/react/lean` with `<LumiIcon icon={rocketIcon} />` |
| Vue | `@lumi-icons/vue` | `@lumi-icons/vue/lean` with `<LumiIcon :icon="rocketIcon" />` |
| Angular | `@lumi-icons/angular` | `@lumi-icons/angular/lean` with `<lumi-icon [icon]="rocketIcon" />` |
| React Native | `@lumi-icons/react-native` | `@lumi-icons/react-native/lean` with `<LumiIcon icon={rocketIcon} />` |

The element also accepts `el.icon = rocketIcon`. Icons registered after an element renders appear immediately. You can register your own artwork too: any object with a unique `name`, a `label`, a `category`, `tags`, and an `svg` drawn on a 24×24 viewBox.

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

The package also exports `registerIcons`, `getIcon`, `resolveIconName`, `onIconsChange`, every icon as `<name>Icon`, `icons` (name → `{ name, label, category, tags, svg }`), `iconNames`, `iconCategories`, `iconAnimations`, `iconAliases`, and the `LumiIcon` element class, plus matching TypeScript types. `<lumi-icon>` is registered in `HTMLElementTagNameMap`, so `document.querySelector("lumi-icon")` is typed.

A name that is not registered renders nothing. If it is still missing once the current task finishes, a single console warning names the export to import.

## Security and Content-Security-Policy

- Attribute and prop values are applied through the CSSOM and `setAttribute`, never as markup, so they cannot inject HTML or CSS.
- Works under a strict CSP such as `default-src 'self'; style-src 'self'`: styles use a constructable stylesheet and the CSSOM, not inline `style` attributes.
- On pages that enforce [Trusted Types](https://developer.mozilla.org/docs/Web/API/Trusted_Types_API), add the icon policy: `trusted-types lumi-icons`.
- An icon's `svg` is inserted as markup. Register only artwork you control, never icon definitions built from user input.

See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Browser support

Current versions of Chrome, Edge, Firefox, and Safari (Chrome/Edge 90+, Firefox 90+, Safari 15+). Browsers without `color-mix()` (Safari before 16.2) draw the icons without the soft drop shadow. In React Native, see the version requirements in [packages/react-native](packages/react-native/README.md).

## Icons

828 icons in 23 categories: interface, layout, arrows, editor, design, files, development, devices, media, communication, people, security, time, commerce, travel, feedback, health, food, games, math, weather, nature, and objects. The first twenty are hand-constructed isometric objects; the rest are glyphs extruded along the same light direction, with a solid side face, a cast shadow, and a rim highlight, so the whole set shares one lighting model. Every shade is derived from a single color, so any brand color works.

Browse by category, search by name or tag, and copy HTML/React/Vue snippets or standalone SVG files in the playground: `pnpm dev`.

## Repository layout

```
src/                @lumi-icons/core source
  catalog.ts        Every icon, one export per line (adding an icon = adding a line)
  define.ts         The solid/glyph factories and the shared 3D extrusion
  registry.ts       registerIcons / getIcon: what <lumi-icon> can draw
  lumi-icon.ts      <lumi-icon> custom element and animation layer
  element.ts        "@lumi-icons/core/element" entry (no artwork)
  index.ts, all.ts  "@lumi-icons/core" entry (registers everything)
  types.ts          Icon names (derived from the catalog), categories, motion types
packages/react      @lumi-icons/react wrapper
packages/vue        @lumi-icons/vue wrapper
packages/angular    @lumi-icons/angular standalone component (built with ng-packagr)
packages/react-native  @lumi-icons/react-native native renderer (react-native-svg + Animated)
playground/         Vite catalog and interaction sandbox (index.html is its page)
test/               Vitest suites (catalog, element, SSR import, React Native motion)
test-dist/          Tests on the built package, e.g. real tree-shaking with Vite/Rollup
brand/              Logo: mark (logo.svg), single-color mark, and light/dark lockups
```

## Development

This repo uses [pnpm](https://pnpm.io) workspaces.

```bash
pnpm install
pnpm dev              # playground at http://localhost:5173
pnpm test             # unit tests
pnpm build            # type-check, build core to dist/core, build the playground
pnpm test:dist        # bundle-size and tree-shaking checks on dist (after pnpm build)
pnpm build:wrappers   # build the React, Vue, Angular, and React Native packages
pnpm test:angular     # boot real Angular apps against the built Angular package
```

## License

MIT
