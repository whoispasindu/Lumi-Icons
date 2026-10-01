# @lumi-icons/react-native

```bash
npm i @lumi-icons/core @lumi-icons/react-native react-native-svg
```

```tsx
import { LumiIcon } from "@lumi-icons/react-native";

export function Launch() {
  return <LumiIcon name="rocket" size={48} color="#6a4dd8" animation="launch" label="Launch" />;
}
```

React Native has no DOM, so this package does not use the Web Component. It draws the same icon artwork with [`react-native-svg`](https://github.com/software-mansion/react-native-svg) and recreates each animation with the `Animated` API on the native driver, so motion runs on the UI thread.

Props: `name` (or `icon`), `size` (number, default `24`), `color` (default `black`), `animation`, `motion`, `label`, `style`, and `testID`.

- Motion follows the device's reduce-motion setting when `motion` is `"auto"`; `"reduced"` always holds still.
- With `label`, the icon is exposed to screen readers as an image with that name. Without it, the icon is decorative and hidden from them.

Requires React Native 0.73 or later (for `transformOrigin`) and `react-native-svg` 13 or later.

## Smaller bundles

`@lumi-icons/react-native` registers all icons so any `name` works. To ship only the icons you use, import from `/lean` and pass icon objects:

```tsx
import { LumiIcon } from "@lumi-icons/react-native/lean";
import { rocketIcon } from "@lumi-icons/core/icons";

<LumiIcon icon={rocketIcon} size={48} animation="launch" />;
```

`registerIcons` is re-exported from `/lean` for icons you want to use by name.
