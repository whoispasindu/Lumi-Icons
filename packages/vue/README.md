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

Props: `name`, `size` (number of pixels or CSS length), `color`, `animation`, `motion`, `label`. Other attributes are passed through to the `<lumi-icon>` element.

This wrapper delegates icon registration, SVG rendering, and motion to `@lumi-icons/core`, and is safe to import during server-side rendering.
