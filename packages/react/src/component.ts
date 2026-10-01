import { registerIcons } from "@lumi-icons/core/element";
import type { IconAlias, IconAnimation, IconDefinition, IconName, LumiIcon as LumiIconElement, MotionPreference } from "@lumi-icons/core/element";
import { createElement, forwardRef, version } from "react";
import type { HTMLAttributes, Ref } from "react";

interface CommonProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  /** Pixels as a number, or any CSS length such as "1.5em". */
  size?: number | string;
  color?: string;
  animation?: IconAnimation;
  motion?: MotionPreference;
  /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
  label?: string;
}

// React 18 passes props to custom elements as attributes under their React names, so className would
// become a literal "classname" attribute; React 19 maps it to class itself.
const classProp = Number.parseInt(version, 10) < 19 ? "class" : "className";

/** Use an icon by `name`, or pass its definition as `icon` (from "@lumi-icons/core/icons") to ship only the icons you use. */
export type LumiIconProps = CommonProps & (
  | { name: IconName | IconAlias; icon?: never }
  | { icon: IconDefinition<string>; name?: never }
);

/** React binding for the framework-independent <lumi-icon> element. */
export const LumiIcon = forwardRef(function LumiIcon(
  { name, icon, size, color, animation, motion, label, className, ...htmlProps }: LumiIconProps,
  ref: Ref<LumiIconElement>,
) {
  // Registering is idempotent, so doing it while rendering is safe and keeps SSR output complete.
  if (icon) registerIcons(icon);
  return createElement("lumi-icon", {
    ...htmlProps,
    ...(className !== undefined ? { [classProp]: className } : {}),
    ref,
    name: icon ? icon.name : name,
    ...(size !== undefined ? { size: String(size) } : {}),
    ...(color !== undefined ? { color } : {}),
    ...(animation !== undefined ? { animation } : {}),
    ...(motion !== undefined ? { motion } : {}),
    ...(label !== undefined ? { label } : {}),
  });
});

export type { IconAlias, IconAnimation, IconDefinition, IconName, MotionPreference } from "@lumi-icons/core/element";
