export { icons } from "./icons.js";
export { defineLumiIcons, LumiIcon, resolveIconName, tagName } from "./lumi-icon.js";
export { iconAliases, iconAnimations, iconCategories, iconNames } from "./types.js";
export type { IconAlias, IconAnimation, IconCategory, IconDefinition, IconName, MotionPreference } from "./types.js";

import { defineLumiIcons } from "./lumi-icon.js";
defineLumiIcons();
