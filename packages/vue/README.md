# @lumi-icons/vue

```bash
npm i @lumi-icons/core @lumi-icons/vue
```

```vue
<script setup lang="ts">
import { LumiIcon } from "@lumi-icons/vue";
</script>

<template>
  <LumiIcon name="rocket" :size="32" color="#6a4dd8" animation="launch" label="Launch" />
</template>
```

Props: `name` (or `icon`), `size` (number of pixels or CSS length), `color`, `animation`, `motion`, `label`. Other attributes are passed through to the `<lumi-icon>` element.

This wrapper delegates icon registration, SVG rendering, and motion to `@lumi-icons/core`, and is safe to import during server-side rendering.

## Smaller bundles

`@lumi-icons/vue` registers all icons so any `name` works. To ship only the icons you use, import from `/lean` and pass icon objects:

```vue
<script setup lang="ts">
import { LumiIcon } from "@lumi-icons/vue/lean";
import { rocketIcon } from "@lumi-icons/core/icons";
</script>

<template>
  <LumiIcon :icon="rocketIcon" :size="32" animation="launch" />
</template>
```

`registerIcons` is re-exported from `/lean` for icons you want to use by name.
