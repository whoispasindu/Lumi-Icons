import "../src";
import { icons } from "../src/icons";
import { iconNames, type IconAnimation, type IconName } from "../src/types";
import "./style.css";

class AppPlayground extends HTMLElement {
  #selected: IconName = "rocket";
  #animation: IconAnimation = "launch";
  #color = "#6a4dd8";
  #size = 112;

  connectedCallback() { this.render(); }
  private render() {
    this.innerHTML = `
      <main>
        <header><a class="wordmark" href="#top">threed<span>icons</span></a><div class="header-note">Web Components first <i></i> framework ready</div></header>
        <section class="intro" id="top"><div><p class="eyebrow">OPEN SOURCE ICON SYSTEM</p><h1>Depth that moves<br>with your interface.</h1><p class="lede">A tiny, animated 3D icon language for product teams. Designed in TypeScript, delivered as one custom element.</p></div><div class="hero-icon"><three-icon name="${this.#selected}" size="154" color="${this.#color}" animation="${this.#animation}"></three-icon><span>LIVE COMPONENT</span></div></section>
        <section class="studio"><div class="preview"><p class="panel-label">COMPONENT PREVIEW</p><div class="stage"><three-icon name="${this.#selected}" size="${this.#size}" color="${this.#color}" animation="${this.#animation}" label="${icons[this.#selected].label}"></three-icon></div><code>&lt;three-icon name="${this.#selected}" animation="${this.#animation}" /&gt;</code></div>
        <div class="controls"><p class="panel-label">TUNE IT</p><label>Icon <select data-control="icon">${iconNames.map((name) => `<option value="${name}" ${name === this.#selected ? "selected" : ""}>${icons[name].label}</option>`).join("")}</select></label><label>Motion <select data-control="animation">${(["none", "float", "spin", "pulse", "ring", "launch", "sparkle", "tilt"] as IconAnimation[]).map((a) => `<option value="${a}" ${a === this.#animation ? "selected" : ""}>${a}</option>`).join("")}</select></label><label>Color <input data-control="color" type="color" value="${this.#color}" /></label><label>Size <span>${this.#size}px</span><input data-control="size" type="range" min="48" max="160" value="${this.#size}" /></label></div></section>
        <section class="catalog"><div class="catalog-head"><div><p class="eyebrow">V0.1 / FIRST RELEASE</p><h2>One hundred twenty-one icons. One dimensional language.</h2></div><button data-action="play">Replay motion</button></div><div class="grid">${iconNames.map((name) => `<button class="tile ${name === this.#selected ? "active" : ""}" data-icon="${name}"><three-icon name="${name}" size="44" color="${this.#color}" animation="${name === this.#selected ? this.#animation : "none"}"></three-icon><span>${icons[name].label}</span></button>`).join("")}</div></section>
        <footer><span>MIT licensed</span><span>Built for the open web</span><span>React + Vue wrappers next</span></footer>
      </main>`;
    this.querySelectorAll<HTMLButtonElement>("[data-icon]").forEach((button) => button.onclick = () => { this.#selected = button.dataset.icon as IconName; this.render(); });
    this.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-control]").forEach((control) => control.oninput = () => { const key = control.dataset.control; if (key === "icon") this.#selected = control.value as IconName; if (key === "animation") this.#animation = control.value as IconAnimation; if (key === "color") this.#color = control.value; if (key === "size") this.#size = Number(control.value); this.render(); });
    this.querySelector<HTMLButtonElement>("[data-action=play]")!.onclick = () => this.render();
  }
}
customElements.define("app-playground", AppPlayground);
