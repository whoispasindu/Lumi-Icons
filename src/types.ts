import type * as Catalog from "./catalog.js";

/** Every built-in icon name, derived from the catalog so a new icon needs only its catalog line. */
export type IconName = (typeof Catalog)[keyof typeof Catalog]["name"];

/** Alternate names that resolve to a canonical icon. */
export const iconAliases = { x: "close" } as const satisfies Record<string, IconName>;
export type IconAlias = keyof typeof iconAliases;

export const iconCategories = [
  "interface", "layout", "arrows", "editor", "design", "files", "development", "devices", "media",
  "communication", "people", "security", "time", "commerce", "travel", "feedback", "health", "food",
  "games", "math", "weather", "nature", "objects",
] as const;
export type IconCategory = (typeof iconCategories)[number];

export const iconAnimations = ["none", "float", "spin", "pulse", "ring", "launch", "sparkle", "tilt"] as const;
export type IconAnimation = (typeof iconAnimations)[number];
export type MotionPreference = "auto" | "reduced";

/**
 * An icon the element can draw. Built-in icons come from the catalog; you can also register your
 * own with any unique `name` and an `svg` drawn on a 24×24 viewBox.
 */
export interface IconDefinition<N extends string = IconName> {
  readonly name: N;
  readonly label: string;
  readonly category: IconCategory;
  /** Extra search terms, e.g. "delete" for trash. */
  readonly tags: readonly string[];
  readonly svg: string;
}
