import { iconAliases, type IconAlias, type IconDefinition } from "./types.js";

type AnyIcon = IconDefinition<string>;
/** One icon, a list of icons, or an object of icons (such as `import * as icons from "@lumi-icons/core/icons"`). */
export type IconInput = AnyIcon | readonly AnyIcon[] | { readonly [key: string]: AnyIcon };

// Shared through a global symbol, so an app that ends up with two copies of this package (two
// versions in node_modules, or a CDN build next to a bundled one) still has a single registry:
// icons registered through either copy appear in whichever copy defined <lumi-icon>.
interface Store { readonly icons: Map<string, AnyIcon>; readonly listeners: Set<() => void> }
const storeKey = Symbol.for("lumi-icons.registry.v1");
const store: Store = ((globalThis as { [storeKey]?: Store })[storeKey] ??= { icons: new Map(), listeners: new Set() });
const registry = store.icons;
const listeners = store.listeners;

// Object.hasOwn is missing on some engines the data is used on (older Hermes in React Native).
const hasOwn = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);
const isIcon = (value: unknown): value is AnyIcon =>
  typeof value === "object" && value !== null && typeof (value as AnyIcon).name === "string" && (value as AnyIcon).name !== "" && "svg" in value;

/**
 * Makes icons available to <lumi-icon> and the framework components. Registering the same icon again is a no-op;
 * registering a different icon under an existing name replaces it everywhere.
 *
 * An icon's `svg` is inserted as markup, so only register artwork you trust (your own files, never user input).
 */
export function registerIcons(...inputs: IconInput[]) {
  let changed = false;
  const add = (icon: AnyIcon) => {
    if (registry.get(icon.name) === icon) return;
    registry.set(icon.name, icon);
    changed = true;
  };
  for (const input of inputs) {
    if (isIcon(input)) add(input);
    // Anything else that is not a list or an object of icons (undefined, a string...) is ignored.
    else if (typeof input === "object" && input !== null) {
      for (const icon of Array.isArray(input) ? input : Object.values(input)) if (isIcon(icon)) add(icon);
    }
  }
  // Elements waiting for an icon re-render once it arrives.
  if (changed) listeners.forEach((listener) => listener());
}

/** The registered name an input refers to, following aliases such as "x" → "close". */
export function resolveIconName(name: string | null | undefined): string | undefined {
  if (!name) return undefined;
  if (registry.has(name)) return name;
  if (hasOwn(iconAliases, name)) {
    const target = iconAliases[name as IconAlias];
    return registry.has(target) ? target : undefined;
  }
  return undefined;
}

export function getIcon(name: string | null | undefined): AnyIcon | undefined {
  const resolved = resolveIconName(name);
  return resolved === undefined ? undefined : registry.get(resolved);
}

/** Calls `listener` whenever icons are registered. Returns an unsubscribe function. */
export function onIconsChange(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
