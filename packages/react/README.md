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

Props: `name` (or `icon`), `size` (number of pixels or CSS length), `color`, `animation`, `motion`, `label`, plus any HTML attribute. The ref points at the underlying `<lumi-icon>` element.

This wrapper delegates icon registration, SVG rendering, and motion to `@lumi-icons/core`, and is safe to import during server-side rendering.

## Smaller bundles

`@lumi-icons/react` registers all icons so any `name` works. To ship only the icons you use, import from `/lean` and pass icon objects:

```tsx
import { LumiIcon } from "@lumi-icons/react/lean";
import { rocketIcon } from "@lumi-icons/core/icons";

<LumiIcon icon={rocketIcon} size={32} animation="launch" />;
```

Pass either `name` or `icon`, not both. `registerIcons` is re-exported from `/lean` for icons you want to use by name.
