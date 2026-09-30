import "@lumi-icons/core";
import { createElement, forwardRef } from "react";
import type { HTMLAttributes, Ref } from "react";
import type { IconAlias, IconAnimation, IconName, LumiIcon as LumiIconElement, MotionPreference } from "@lumi-icons/core";

export interface LumiIconProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  name: IconName | IconAlias;
  /** Pixels as a number, or any CSS length such as "1.5em". */
  size?: number | string;
  color?: string;
  animation?: IconAnimation;
  motion?: MotionPreference;
  /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
  label?: string;
}

/** React binding for the framework-independent <lumi-icon> element. */
export const LumiIcon = forwardRef(function LumiIcon(
  { name, size, color, animation, motion, label, ...htmlProps }: LumiIconProps,
  ref: Ref<LumiIconElement>,
) {
  return createElement("lumi-icon", {
    ...htmlProps,
    ref,
    name,
    ...(size !== undefined ? { size: String(size) } : {}),
    ...(color !== undefined ? { color } : {}),
    ...(animation !== undefined ? { animation } : {}),
    ...(motion !== undefined ? { motion } : {}),
    ...(label !== undefined ? { label } : {}),
  });
});

export type { IconAlias, IconAnimation, IconName, MotionPreference } from "@lumi-icons/core";
