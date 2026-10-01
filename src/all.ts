// Registers every built-in icon. "@lumi-icons/core" imports this first, so the full catalog is
// available before the element is defined and any <lumi-icon> on the page renders immediately.
import { icons } from "./icons.js";
import { registerIcons } from "./registry.js";

registerIcons(icons);
