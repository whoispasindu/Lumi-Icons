import * as catalog from "./catalog.js";
import type { IconDefinition, IconName } from "./types.js";

/** Every built-in icon by name. Importing this pulls in the whole catalog. */
export const icons = Object.fromEntries(
  Object.values(catalog).map((icon) => [icon.name, icon]),
) as unknown as Record<IconName, IconDefinition>;

/** Every built-in icon name, sorted alphabetically. */
export const iconNames = Object.keys(icons).sort() as IconName[];
