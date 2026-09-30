import { icons } from "./icons";
import type { IconAnimation, IconName, MotionPreference } from "./types";

const animationValues: IconAnimation[] = ["none", "float", "spin", "pulse", "ring", "launch", "sparkle", "tilt"];

export class ThreeIcon extends HTMLElement {
  static observedAttributes = ["name", "size", "color", "animation", "motion", "label"];
  #shadow = this.attachShadow({ mode: "open" });

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  get name(): IconName { return (this.getAttribute("name") || "cube") as IconName; }
  set name(value: IconName) { this.setAttribute("name", value); }

  private render() {
    const icon = icons[this.name] || icons.cube;
    const size = Number(this.getAttribute("size") || 24);
    const animation = this.getAttribute("animation") || "none";
    const motion = (this.getAttribute("motion") || "auto") as MotionPreference;
    const label = this.getAttribute("label") || icon.label;
    const validAnimation = animationValues.includes(animation as IconAnimation) ? animation : "none";
    const decorative = !this.hasAttribute("label");
    this.#shadow.innerHTML = `
      <style>
        :host { display:inline-flex; width:${size}px; height:${size}px; color:${this.getAttribute("color") || "currentColor"}; vertical-align:middle; }
        .icon { width:100%; height:100%; display:grid; place-items:center; transform-origin:center; animation: var(--three-animation, none); }
        svg { width:100%; height:100%; overflow:visible; filter: drop-shadow(1px 2px 1px color-mix(in srgb, currentColor 22%, transparent)); }
        :host([animation="float"]) .icon { --three-animation: float 2.4s ease-in-out infinite; }
        :host([animation="spin"]) .icon { --three-animation: spin 2.7s linear infinite; }
        :host([animation="pulse"]) .icon { --three-animation: pulse 1.6s ease-in-out infinite; }
        :host([animation="ring"]) .icon { --three-animation: ring 2.2s ease-in-out infinite; transform-origin:50% 14%; }
        :host([animation="launch"]) .icon { --three-animation: launch 2.2s cubic-bezier(.25,.8,.25,1) infinite; }
        :host([animation="sparkle"]) .icon { --three-animation: sparkle 1.7s ease-in-out infinite; }
        :host([animation="tilt"]) .icon { --three-animation: tilt 2.4s ease-in-out infinite; }
        @keyframes float { 50% { transform: translateY(-8%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 50% { transform: scale(.88); opacity:.65; } }
        @keyframes ring { 8%,24% { transform:rotate(12deg) } 16%,32% { transform:rotate(-12deg) } 40%,100% { transform:rotate(0) } }
        @keyframes launch { 40% { transform:translate(12%,-12%) rotate(8deg) } 58%,100% { transform:translate(0) rotate(0) } }
        @keyframes sparkle { 50% { transform:scale(1.12) rotate(10deg); filter:brightness(1.2); } }
        @keyframes tilt { 50% { transform:perspective(80px) rotateY(22deg) rotateX(-8deg); } }
        @media (prefers-reduced-motion: reduce) { .icon { animation:none !important; } }
      </style>
      <span class="icon" role="img" aria-label="${decorative ? "" : label}" aria-hidden="${decorative}">${icon.svg}</span>`;
    if (motion === "reduced") this.#shadow.querySelector<HTMLElement>(".icon")?.style.setProperty("animation", "none");
    this.setAttribute("data-animation", validAnimation);
  }
}

export function defineThreeIcons() {
  if (!customElements.get("three-icon")) customElements.define("three-icon", ThreeIcon);
}
