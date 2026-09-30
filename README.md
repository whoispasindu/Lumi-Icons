# Lumi Icons

Animated, lightweight 3D icons for the web. The core package is framework-independent Web Components: use it in HTML, React, Vue, Svelte, or any framework that understands custom elements.

```html
<three-icon name="rocket" size="48" color="#6750d6" animation="launch"></three-icon>
<script type="module" src="@lumi-icons/core"></script>
```

## Package architecture

```
src/                Publishable @lumi-icons/core source
  icons.ts          SVG catalog and semantic icon definitions
  three-icon.ts     <three-icon> custom element and animation layer
  types.ts          Public names, motion, and icon types
playground/         Vite catalog and interaction sandbox
dist/core/          Published ESM + declarations (after build)
dist/playground/    Static Vite playground (after build)
```

The published core entry exports `defineThreeIcons`, `ThreeIcon`, `icons`, and the `IconName` / `IconAnimation` types. Add `@lumi-icons/react` and `@lumi-icons/vue` as thin wrapper packages which peer-depend on this core package. They should only map props and events to `<three-icon>`; icon SVG and animation logic stay in `core`.

## Framework wrappers

The workspace includes `@lumi-icons/react` and `@lumi-icons/vue`. Both register the core element for you and accept the same `name`, `size`, `color`, `animation`, `motion`, and `label` props.

```tsx
import { ThreeIcon } from "@lumi-icons/react";

<ThreeIcon name="rocket" animation="launch" size={40} />;
```

```vue
<ThreeIcon name="rocket" animation="launch" :size="40" />
```

## Included icons

121 icons across object, interface, system, media, commerce, transport, and feedback categories. The original twenty are hand-constructed isometric objects; the 101-icon expansion uses self-extruded glyphs with offset depth strokes and cast shadows, never a background tile.

## Animation API

Set `animation` to `none`, `float`, `spin`, `pulse`, `ring`, `launch`, `sparkle`, or `tilt`. `motion="reduced"` guarantees a still icon, and reduced-motion user preferences are respected automatically.

## Local development

```bash
npm install
npm run dev
```
