import { registerIcons } from "@lumi-icons/core/element";
import type { IconAlias, IconAnimation, IconDefinition, IconName, MotionPreference } from "@lumi-icons/core/element";
import { defineComponent, h } from "vue";
import type { PropType } from "vue";

/** Vue binding for the framework-independent <lumi-icon> element. */
export const LumiIcon = defineComponent({
  name: "LumiIcon",
  inheritAttrs: false,
  props: {
    /** The icon to show. Alternatively pass `icon`. */
    name: { type: String as PropType<IconName | IconAlias> },
    /** An icon definition from "@lumi-icons/core/icons"; lets bundlers ship only the icons you use. */
    icon: { type: Object as PropType<IconDefinition<string>> },
    /** Pixels as a number, or any CSS length such as "1.5em". */
    size: [Number, String],
    color: String,
    animation: String as PropType<IconAnimation>,
    motion: String as PropType<MotionPreference>,
    /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
    label: String,
  },
  setup(props, { attrs }) {
    return () => {
      // Registering is idempotent, so doing it while rendering is safe and keeps SSR output complete.
      if (props.icon) registerIcons(props.icon);
      const { icon, name, ...rest } = props;
      return h("lumi-icon", { ...attrs, ...rest, name: icon ? icon.name : name });
    };
  },
});

export type { IconAlias, IconAnimation, IconDefinition, IconName, MotionPreference } from "@lumi-icons/core/element";
