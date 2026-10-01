// "@lumi-icons/core/element": the <lumi-icon> element and icon registry, with no icon artwork.
// Pair it with "@lumi-icons/core/icons" to ship only the icons an app uses:
//
//   import { registerIcons } from "@lumi-icons/core/element";
//   import { rocketIcon, heartIcon } from "@lumi-icons/core/icons";
//   registerIcons(rocketIcon, heartIcon);
export { defineLumiIcons, LumiIcon, tagName } from "./lumi-icon.js";
export { getIcon, onIconsChange, registerIcons, resolveIconName, type IconInput } from "./registry.js";
export { iconAliases, iconAnimations, iconCategories } from "./types.js";
export type { IconAlias, IconAnimation, IconCategory, IconDefinition, IconName, MotionPreference } from "./types.js";

import { defineLumiIcons } from "./lumi-icon.js";
defineLumiIcons();
