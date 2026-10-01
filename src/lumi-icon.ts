import { getIcon, onIconsChange, registerIcons } from "./registry.js";
import type { IconAlias, IconDefinition, IconName } from "./types.js";

export const tagName = "lumi-icon";

const css = `
  :host { display:inline-flex; vertical-align:middle; line-height:0; }
  :host([hidden]) { display:none; }
  .icon {
    width:var(--lumi-icon-size, 24px); height:var(--lumi-icon-size, 24px);
    display:grid; place-items:center; transform-origin:center; animation:var(--lumi-animation, none);
  }
  svg { width:100%; height:100%; overflow:visible; filter:drop-shadow(1px 2px 1px color-mix(in srgb, currentColor 22%, transparent)); }
  :host([animation="float"]) { --lumi-animation: lumi-float 2.4s ease-in-out infinite; }
  :host([animation="spin"]) { --lumi-animation: lumi-spin 2.7s linear infinite; }
  :host([animation="pulse"]) { --lumi-animation: lumi-pulse 1.6s ease-in-out infinite; }
  :host([animation="ring"]) { --lumi-animation: lumi-ring 2.2s ease-in-out infinite; }
  :host([animation="ring"]) .icon { transform-origin:50% 14%; }
  :host([animation="launch"]) { --lumi-animation: lumi-launch 2.2s cubic-bezier(.25,.8,.25,1) infinite; }
  :host([animation="sparkle"]) { --lumi-animation: lumi-sparkle 1.7s ease-in-out infinite; }
  :host([animation="tilt"]) { --lumi-animation: lumi-tilt 2.4s ease-in-out infinite; }
  :host([motion="reduced"]) .icon { animation:none; }
  @keyframes lumi-float { 50% { transform:translateY(-8%); } }
  @keyframes lumi-spin { to { transform:rotate(360deg); } }
  @keyframes lumi-pulse { 50% { transform:scale(.88); opacity:.65; } }
  @keyframes lumi-ring { 8%,24% { transform:rotate(12deg) } 16%,32% { transform:rotate(-12deg) } 40%,100% { transform:rotate(0) } }
  @keyframes lumi-launch { 40% { transform:translate(12%,-12%) rotate(8deg) } 58%,100% { transform:translate(0) rotate(0) } }
  @keyframes lumi-sparkle { 50% { transform:scale(1.12) rotate(10deg); filter:brightness(1.2); } }
  @keyframes lumi-tilt { 50% { transform:perspective(80px) rotateY(22deg) rotateX(-8deg); } }
  @media (prefers-reduced-motion: reduce) { .icon { animation:none !important; } }
`;

// One stylesheet shared by every instance, instead of a <style> copy per icon.
let sharedSheet: CSSStyleSheet | null | undefined;
function getSharedSheet() {
  if (sharedSheet === undefined) {
    try {
      sharedSheet = new CSSStyleSheet();
      sharedSheet.replaceSync(css);
    } catch {
      sharedSheet = null; // Constructable stylesheets unsupported: fall back to a <style> element.
    }
  }
  return sharedSheet;
}

const lengthPattern = /^(\d*\.?\d+)(px|em|rem|%|ch|ex|lh|vw|vh|vmin|vmax|pt|cqw|cqh)?$/;

/** A bare number is read as pixels; a number with a CSS unit ("2em", "1.5rem") is used as is. */
function toCssLength(value: string | null) {
  const match = value?.trim().match(lengthPattern);
  if (!match) return "";
  return `${match[1]}${match[2] ?? "px"}`;
}

const warnedNames = new Set<string>();

/** "rocket" → "rocketIcon", the icon's export name in @lumi-icons/core/icons. */
const exportName = (name: string) => `${name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())}Icon`;

// Icons may be registered after an element connects (e.g. a later registerIcons call), so an unknown
// name is only reported if it is still unknown once the current task has finished.
function warnIfStillMissing(name: string) {
  if (warnedNames.has(name)) return;
  setTimeout(() => {
    if (getIcon(name) || warnedNames.has(name)) return;
    warnedNames.add(name);
    console.warn(
      `<${tagName}>: no icon named "${name}" is registered. Import "@lumi-icons/core" to register every icon, ` +
      `or register just this one: registerIcons(${exportName(name)}) with ${exportName(name)} from "@lumi-icons/core/icons".`,
    );
  }, 0);
}

// Sites that enforce Trusted Types (CSP `require-trusted-types-for 'script'`) reject plain strings in
// innerHTML. Icon markup goes through a "lumi-icons" policy instead; such sites allow it with
// `trusted-types lumi-icons`. The policy is kept on a global symbol so a second copy of this package
// reuses it rather than failing to create a duplicate.
interface HtmlPolicy { createHTML(markup: string): unknown }
type PolicyFactory = { createPolicy(name: string, rules: { createHTML(markup: string): string }): HtmlPolicy };
const policyKey = Symbol.for("lumi-icons.trusted-types-policy.v1");
function trustedHTML(markup: string): string {
  const global = globalThis as { trustedTypes?: PolicyFactory; [policyKey]?: HtmlPolicy | null };
  if (global[policyKey] === undefined) {
    try {
      global[policyKey] = global.trustedTypes?.createPolicy("lumi-icons", { createHTML: (input) => input }) ?? null;
    } catch {
      global[policyKey] = null; // The page's CSP does not allow the "lumi-icons" policy.
    }
  }
  const policy = global[policyKey];
  return (policy ? policy.createHTML(markup) : markup) as string;
}

// Parsing markup is the main cost of showing many icons, so each icon is parsed once into a template
// and every element after that clones the parsed nodes.
const parsedIcons = new WeakMap<IconDefinition<string>, HTMLTemplateElement>();
function iconNodes(definition: IconDefinition<string>, into: Document) {
  let template = parsedIcons.get(definition);
  if (!template) {
    template = document.createElement("template");
    template.innerHTML = trustedHTML(definition.svg);
    parsedIcons.set(definition, template);
  }
  return into.importNode(template.content, true);
}

let reportedDrawError = false;
function reportDrawError(name: string, error: unknown) {
  if (reportedDrawError) return;
  reportedDrawError = true;
  console.error(
    `<${tagName}>: could not draw "${name}". If this page's Content-Security-Policy enforces Trusted Types, ` +
    `allow the icon policy with "trusted-types lumi-icons".`, error,
  );
}

const isIconDefinition = (value: unknown): value is IconDefinition<string> =>
  typeof value === "object" && value !== null && typeof (value as IconDefinition<string>).name === "string" &&
  (value as IconDefinition<string>).name !== "";

// Lets the module load where HTMLElement does not exist (Node, SSR); the element only
// becomes functional once defined in a browser.
const BaseElement = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as typeof HTMLElement;

export class LumiIcon extends BaseElement {
  static observedAttributes = ["name", "size", "color", "label"];

  #icon: HTMLSpanElement;
  #rendered: IconDefinition<string> | undefined;
  #unsubscribe: (() => void) | undefined;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const sheet = getSharedSheet();
    if (sheet) {
      root.adoptedStyleSheets = [sheet];
    } else {
      const style = document.createElement("style");
      style.textContent = css;
      root.append(style);
    }
    this.#icon = document.createElement("span");
    this.#icon.className = "icon";
    this.#icon.setAttribute("part", "icon");
    root.append(this.#icon);
  }

  connectedCallback() {
    // A framework or script may set these properties before the element was defined; those values were
    // stored on the instance and hide the class's setters, so re-apply them through the setters.
    this.#upgradeProperty("icon");
    this.#upgradeProperty("name");
    this.#unsubscribe ??= onIconsChange(() => this.#update());
    this.#update();
  }
  disconnectedCallback() {
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
  }
  attributeChangedCallback() { this.#update(); }

  get name(): string { return this.getAttribute("name") ?? ""; }
  set name(value: IconName | IconAlias | (string & {})) { this.setAttribute("name", value); }

  /** The icon currently drawn. Setting an icon definition registers it and shows it; null or undefined clears it. */
  get icon(): IconDefinition<string> | undefined { return this.#rendered; }
  set icon(definition: IconDefinition<string> | null | undefined) {
    if (isIconDefinition(definition)) {
      registerIcons(definition);
      this.setAttribute("name", definition.name);
    } else {
      this.removeAttribute("name");
    }
  }

  #upgradeProperty(property: "icon" | "name") {
    if (!Object.prototype.hasOwnProperty.call(this, property)) return;
    const value = (this as Record<typeof property, unknown>)[property];
    delete (this as Partial<Record<typeof property, unknown>>)[property];
    (this as Record<typeof property, unknown>)[property] = value;
  }

  #update() {
    const requested = this.getAttribute("name");
    const definition = getIcon(requested);
    if (!definition && requested) warnIfStillMissing(requested);
    // Icon SVG is registered artwork, never attribute input; only swap it when the icon changes.
    if (definition !== this.#rendered) {
      this.#rendered = definition;
      this.#icon.replaceChildren();
      if (definition) {
        try {
          this.#icon.append(iconNodes(definition, this.ownerDocument));
        } catch (error) {
          reportDrawError(definition.name, error);
        }
      }
    }

    // Attribute values go through the CSSOM and setAttribute, never into markup, so they cannot inject HTML or CSS.
    this.#icon.style.setProperty("--lumi-icon-size", toCssLength(this.getAttribute("size")));
    // Clear first: the CSSOM ignores an invalid color, which would otherwise keep the previous one.
    this.#icon.style.color = "";
    this.#icon.style.color = this.getAttribute("color") ?? "";

    const label = this.getAttribute("label");
    if (label) {
      this.#icon.setAttribute("role", "img");
      this.#icon.setAttribute("aria-label", label);
      this.#icon.removeAttribute("aria-hidden");
    } else {
      this.#icon.removeAttribute("role");
      this.#icon.removeAttribute("aria-label");
      this.#icon.setAttribute("aria-hidden", "true");
    }
  }
}

export function defineLumiIcons() {
  if (typeof customElements === "undefined") return;
  if (!customElements.get(tagName)) customElements.define(tagName, LumiIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    "lumi-icon": LumiIcon;
  }
}
