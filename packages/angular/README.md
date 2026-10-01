# @lumi-icons/angular

```bash
npm i @lumi-icons/core @lumi-icons/angular
```

```ts
import { Component } from "@angular/core";
import { LumiIconComponent } from "@lumi-icons/angular";

@Component({
  selector: "app-launch",
  imports: [LumiIconComponent],
  template: `<lumi-icon name="rocket" [size]="48" color="#6a4dd8" animation="launch" label="Launch" />`,
})
export class LaunchComponent {}
```

A standalone component with typed signal inputs: `name` (or `icon`), `size` (number of pixels or CSS length), `color`, `animation`, `motion`, and `label`. It requires Angular 17.1 or later.

The component's host is the `<lumi-icon>` custom element itself, so no `CUSTOM_ELEMENTS_SCHEMA` is needed. Icon rendering and motion come from `@lumi-icons/core`, which is safe to import during server-side rendering.

## Smaller bundles

`@lumi-icons/angular` registers all icons so any `name` works. To ship only the icons you use, import from `@lumi-icons/angular/lean` and bind icon objects to the `icon` input:

```ts
import { Component } from "@angular/core";
import { LumiIconComponent } from "@lumi-icons/angular/lean";
import { rocketIcon } from "@lumi-icons/core/icons";

@Component({
  selector: "app-launch",
  imports: [LumiIconComponent],
  template: `<lumi-icon [icon]="rocket" [size]="48" animation="launch" />`,
})
export class LaunchComponent {
  protected readonly rocket = rocketIcon;
}
```

`registerIcons` is re-exported from `/lean` for icons you want to use by name.
