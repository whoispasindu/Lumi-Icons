import "@lumi-icons/core";
import { defineComponent, h } from "vue";
import type { PropType } from "vue";
import type { IconAnimation, IconName, MotionPreference } from "@lumi-icons/core";

export const ThreeIcon = defineComponent({
  name: "ThreeIcon",
  inheritAttrs: false,
  props: {
    name: { type: String as PropType<IconName>, required: true },
    size: Number,
    color: String,
    animation: String as PropType<IconAnimation>,
    motion: String as PropType<MotionPreference>,
    label: String,
  },
  setup(props, { attrs }) {
    return () => h("three-icon", { ...attrs, ...props });
  },
});

export type { IconAnimation, IconName, MotionPreference } from "@lumi-icons/core";
