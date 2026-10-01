import { registerIcons } from "@lumi-icons/core/element";
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from "@angular/core";
import type { IconAlias, IconAnimation, IconDefinition, IconName, MotionPreference } from "@lumi-icons/core/element";

/**
 * Angular binding for the framework-independent <lumi-icon> element.
 *
 * The component's host *is* the custom element: Angular creates <lumi-icon>, the browser upgrades
 * it, and the inputs are reflected as attributes. No CUSTOM_ELEMENTS_SCHEMA is needed, and inputs
 * are typed. Icon rendering and motion stay in @lumi-icons/core.
 *
 * "@lumi-icons/angular/lean" ships no icon artwork: pass `[icon]="rocketIcon"` (from
 * "@lumi-icons/core/icons") or call registerIcons once. "@lumi-icons/angular" registers every icon.
 */
@Component({
  selector: "lumi-icon",
  template: "",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.name]": "resolvedName()",
    "[attr.size]": "size() ?? null",
    "[attr.color]": "color() ?? null",
    "[attr.animation]": "animation() ?? null",
    "[attr.motion]": "motion() ?? null",
    "[attr.label]": "label() ?? null",
  },
})
export class LumiIconComponent {
  /** The icon to show. Alternatively pass `icon`. */
  readonly name = input<IconName | IconAlias>();
  /** An icon definition from "@lumi-icons/core/icons"; lets bundlers ship only the icons you use. */
  readonly icon = input<IconDefinition<string>>();
  /** Pixels as a number, or any CSS length such as "1.5em". */
  readonly size = input<number | string>();
  readonly color = input<string>();
  readonly animation = input<IconAnimation>();
  readonly motion = input<MotionPreference>();
  /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
  readonly label = input<string>();

  protected readonly resolvedName = computed(() => {
    const icon = this.icon();
    // Registering is idempotent; it runs before the name reaches the element, so the icon draws at once.
    if (icon) registerIcons(icon);
    return icon ? icon.name : (this.name() ?? null);
  });
}

export { registerIcons } from "@lumi-icons/core/element";
export type { IconAlias, IconAnimation, IconDefinition, IconName, MotionPreference } from "@lumi-icons/core/element";
