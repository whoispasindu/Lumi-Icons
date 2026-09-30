import "@lumi-icons/core";
import { defineComponent, h } from "vue";
import type { PropType } from "vue";
import type { IconAlias, IconAnimation, IconName, MotionPreference } from "@lumi-icons/core";

/** Vue binding for the framework-independent <lumi-icon> element. */
export const LumiIcon = defineComponent({
  name: "LumiIcon",
  inheritAttrs: false,
  props: {
    name: { type: String as PropType<IconName | IconAlias>, required: true },
    /** Pixels as a number, or any CSS length such as "1.5em". */
    size: [Number, String],
    color: String,
    animation: String as PropType<IconAnimation>,
    motion: String as PropType<MotionPreference>,
    /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
    label: String,
  },
  setup(props, { attrs }) {
    return () => h("lumi-icon", { ...attrs, ...props });
  },
});

export type { IconAlias, IconAnimation, IconName, MotionPreference } from "@lumi-icons/core";
