import { icons } from "./icons.js";
import { iconAliases, type IconAlias, type IconName } from "./types.js";

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

export function resolveIconName(name: string | null): IconName | undefined {
  if (!name) return undefined;
  if (Object.hasOwn(icons, name)) return name as IconName;
  if (Object.hasOwn(iconAliases, name)) return iconAliases[name as IconAlias];
  return undefined;
}

const lengthPattern = /^(\d*\.?\d+)(px|em|rem|%|ch|ex|lh|vw|vh|vmin|vmax|pt|cqw|cqh)?$/;

/** A bare number is read as pixels; a number with a CSS unit ("2em", "1.5rem") is used as is. */
function toCssLength(value: string | null) {
  const match = value?.trim().match(lengthPattern);
  if (!match) return "";
  return `${match[1]}${match[2] ?? "px"}`;
}

const warnedNames = new Set<string>();

// Lets the module load where HTMLElement does not exist (Node, SSR); the element only
// becomes functional once defined in a browser.
const BaseElement = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as typeof HTMLElement;

export class LumiIcon extends BaseElement {
  static observedAttributes = ["name", "size", "color", "label"];

  #icon: HTMLSpanElement;
  #renderedName: IconName | undefined;

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

  connectedCallback() { this.#update(); }
  attributeChangedCallback() { this.#update(); }

  get name(): string { return this.getAttribute("name") ?? ""; }
  set name(value: IconName | IconAlias | (string & {})) { this.setAttribute("name", value); }

  #update() {
    const requested = this.getAttribute("name");
    const name = resolveIconName(requested);
    if (!name && requested && !warnedNames.has(requested)) {
      warnedNames.add(requested);
      console.warn(`<${tagName}>: unknown icon name "${requested}".`);
    }
    // Icon SVG is package-owned markup, never user input; only swap it when the name changes.
    if (name !== this.#renderedName) {
      this.#icon.innerHTML = name ? icons[name].svg : "";
      this.#renderedName = name;
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
