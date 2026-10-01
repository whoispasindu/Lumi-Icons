import { getIcon, onIconsChange, registerIcons } from "@lumi-icons/core/element";
import type { IconAlias, IconAnimation, IconDefinition, IconName, MotionPreference } from "@lumi-icons/core/element";
import { memo, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { AccessibilityInfo, Animated, Easing } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { bake, motions, type Motion } from "./motion.js";

interface CommonProps {
  /** Width and height in density-independent pixels. */
  size?: number;
  /** Any React Native color. Every shade of the 3D icon is derived from it. */
  color?: string;
  animation?: IconAnimation;
  /** "reduced" always holds still; "auto" also follows the OS reduce-motion setting. */
  motion?: MotionPreference;
  /** Accessible name. Without it the icon is decorative and hidden from screen readers. */
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Use an icon by `name`, or pass its definition as `icon` (from "@lumi-icons/core/icons") to ship only the icons you use. */
export type LumiIconProps = CommonProps & (
  | { name: IconName | IconAlias; icon?: never }
  | { icon: IconDefinition<string>; name?: never }
);

/* One shared subscription to the OS reduce-motion setting, however many icons are mounted. */
let reduceMotion = false;
let subscribed = false;
const listeners = new Set<() => void>();
function setReduceMotion(value: boolean) {
  reduceMotion = value;
  listeners.forEach((listener) => listener());
}
function subscribeReduceMotion(listener: () => void) {
  listeners.add(listener);
  if (!subscribed) {
    subscribed = true;
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion, () => {});
    AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
  }
  return () => { listeners.delete(listener); };
}
const useReduceMotion = () => useSyncExternalStore(subscribeReduceMotion, () => reduceMotion, () => false);

const warned = new Set<string>();

function motionStyle(motion: Motion, progress: Animated.Value, size: number) {
  const spec = motions[motion];
  const baked = (source: Parameters<typeof bake>[0]) => bake(source, spec.easing);
  const numeric = (source: Parameters<typeof bake>[0], scale = 1) => {
    const { input, output } = baked(source);
    return progress.interpolate<number>({ inputRange: input, outputRange: output.map((value) => value * scale) });
  };
  const degrees = (source: Parameters<typeof bake>[0]) => {
    const { input, output } = baked(source);
    return progress.interpolate<string>({ inputRange: input, outputRange: output.map((value) => `${value}deg`) });
  };
  const { translateX, translateY, rotate, rotateX, rotateY, scale, opacity } = spec.tracks;

  // Same order as the CSS transforms: perspective, translate, then rotations and scale.
  const transform = [
    ...(spec.perspective ? [{ perspective: spec.perspective * size }] : []),
    ...(translateX ? [{ translateX: numeric(translateX, size) }] : []),
    ...(translateY ? [{ translateY: numeric(translateY, size) }] : []),
    ...(rotate ? [{ rotate: degrees(rotate) }] : []),
    ...(rotateY ? [{ rotateY: degrees(rotateY) }] : []),
    ...(rotateX ? [{ rotateX: degrees(rotateX) }] : []),
    ...(scale ? [{ scale: numeric(scale) }] : []),
  ];

  return {
    transform,
    ...(opacity ? { opacity: numeric(opacity) } : {}),
    ...(spec.origin ? { transformOrigin: spec.origin } : {}),
  } as Animated.WithAnimatedValue<ViewStyle>;
}

/** Lumi's animated 3D icons for React Native, drawn with react-native-svg. */
export const LumiIcon = memo(function LumiIcon({
  name,
  icon,
  size = 24,
  color = "black",
  animation = "none",
  motion = "auto",
  label,
  style,
  testID,
}: LumiIconProps) {
  const key = icon ? icon.name : name;
  // A passed icon is drawn directly. A name is looked up, re-rendering if that icon is registered later.
  const lookUp = () => (icon ? undefined : getIcon(key));
  const registered = useSyncExternalStore(onIconsChange, lookUp, lookUp);
  const definition = icon ?? registered;
  // Registering notifies other mounted icons, so it happens after render, never during it
  // (React forbids updating one component while rendering another).
  useEffect(() => { if (icon) registerIcons(icon); }, [icon]);

  useEffect(() => {
    if (definition || warned.has(key)) return;
    warned.add(key);
    console.warn(`<LumiIcon>: no icon named "${key}" is registered. Import "@lumi-icons/react-native" for every icon, or pass icon={...} from "@lumi-icons/core/icons".`);
  }, [definition, key]);

  const osReduceMotion = useReduceMotion();
  const active: Motion | null = animation !== "none" && motion !== "reduced" && !osReduceMotion && definition ? animation : null;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, { toValue: 1, duration: motions[active].duration, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => {
      loop.stop();
      progress.setValue(0);
    };
  }, [active, progress]);

  const animatedStyle = useMemo(() => (active ? motionStyle(active, progress, size) : null), [active, progress, size]);

  return (
    <Animated.View
      testID={testID}
      style={[{ width: size, height: size }, style, animatedStyle]}
      accessible={Boolean(label)}
      accessibilityRole={label ? "image" : undefined}
      accessibilityLabel={label}
      importantForAccessibility={label ? "yes" : "no-hide-descendants"}
      accessibilityElementsHidden={!label}
    >
      {definition ? <SvgXml xml={definition.svg} width={size} height={size} color={color} /> : null}
    </Animated.View>
  );
});

export { motions } from "./motion.js";
export type { IconAlias, IconAnimation, IconDefinition, IconName, MotionPreference } from "@lumi-icons/core/element";
