# @lumi-icons/react

```bash
npm i @lumi-icons/core @lumi-icons/react
```

```tsx
import { LumiIcon } from "@lumi-icons/react";

export function Save() {
  return <LumiIcon name="box" size={32} color="#6a4dd8" animation="float" label="Save" />;
}
```

Props: `name`, `size` (number of pixels or CSS length), `color`, `animation`, `motion`, `label`, plus any HTML attribute. The ref points at the underlying `<lumi-icon>` element.

This wrapper delegates icon registration, SVG rendering, and motion to `@lumi-icons/core`, and is safe to import during server-side rendering.
