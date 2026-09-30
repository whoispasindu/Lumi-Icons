import "@lumi-icons/core";
import { createElement, forwardRef } from "react";
import type { HTMLAttributes, Ref } from "react";
import type { IconAnimation, IconName, MotionPreference } from "@lumi-icons/core";

export interface ThreeIconProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  name: IconName;
  size?: number;
  color?: string;
  animation?: IconAnimation;
  motion?: MotionPreference;
  label?: string;
}

/** React binding for the framework-independent <three-icon> element. */
export const ThreeIcon = forwardRef(function ThreeIcon(
  { name, size, color, animation, motion, label, ...htmlProps }: ThreeIconProps,
  ref: Ref<HTMLElement>,
) {
  return createElement("three-icon", {
    ...htmlProps,
    ref,
    name,
    ...(size !== undefined ? { size } : {}),
    ...(color !== undefined ? { color } : {}),
    ...(animation !== undefined ? { animation } : {}),
    ...(motion !== undefined ? { motion } : {}),
    ...(label !== undefined ? { label } : {}),
  });
});

export type { IconAnimation, IconName, MotionPreference } from "@lumi-icons/core";
