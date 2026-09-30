# @threedicons/vue

```vue
<script setup lang="ts">
import { ThreeIcon } from "@threedicons/vue";
</script>

<template>
  <ThreeIcon name="rocket" :size="32" color="#6a4dd8" animation="launch" label="Launch" />
</template>
```

This wrapper delegates icon registration, SVG rendering, and motion to `@threedicons/core`.
