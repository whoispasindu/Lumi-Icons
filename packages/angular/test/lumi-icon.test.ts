// @vitest-environment happy-dom
// Boots a real Angular app against the *built* package (dist), i.e. exactly what users install.
// The partial-compiled component is linked at runtime by @angular/compiler.
import "@angular/compiler";
import { ApplicationRef, Component, provideZonelessChangeDetection, signal } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { afterEach, describe, expect, it } from "vitest";
import { icons } from "@lumi-icons/core";
import { LumiIconComponent } from "../dist/fesm2022/lumi-icons-angular.mjs";

// A decorator applied as a function, so the test needs no decorator transform.
const Host = Component({
  selector: "test-host",
  imports: [LumiIconComponent],
  template: `<lumi-icon name="rocket" [size]="size()" [color]="color()" [animation]="animation()" [label]="label()" />`,
})(
  class Host {
    size = signal<number | undefined>(40);
    color = signal<string | undefined>("#6a4dd8");
    animation = signal<"launch" | "spin" | undefined>("launch");
    label = signal<string | undefined>("Launch");
  },
);

type HostInstance = InstanceType<typeof Host>;

async function mount() {
  document.body.innerHTML = "<test-host></test-host>";
  const app = await bootstrapApplication(Host, { providers: [provideZonelessChangeDetection()] });
  const host = app.components[0].instance as HostInstance;
  const element = document.querySelector("lumi-icon")!;
  const settle = async () => { app.injector.get(ApplicationRef).tick(); await Promise.resolve(); };
  return { app, host, element, settle };
}

let destroy: (() => void) | undefined;
afterEach(() => { destroy?.(); destroy = undefined; });

describe("@lumi-icons/angular", () => {
  it("renders the real <lumi-icon> custom element with its inputs as attributes", async () => {
    const { app, element } = await mount();
    destroy = () => app.destroy();

    expect(customElements.get("lumi-icon")).toBeDefined();
    expect(element.getAttribute("name")).toBe("rocket");
    expect(element.getAttribute("size")).toBe("40");
    expect(element.getAttribute("color")).toBe("#6a4dd8");
    expect(element.getAttribute("animation")).toBe("launch");
    expect(element.getAttribute("label")).toBe("Launch");

    // The core element did its job inside the Angular-created host.
    const inner = element.shadowRoot!.querySelector(".icon")!;
    const expected = document.createElement("span");
    expected.innerHTML = icons.rocket.svg;
    expect(inner.innerHTML).toBe(expected.innerHTML);
    expect(inner.getAttribute("aria-label")).toBe("Launch");
  });

  it("updates attributes when inputs change and removes them when unset", async () => {
    const { app, host, element, settle } = await mount();
    destroy = () => app.destroy();

    host.size.set(64);
    host.animation.set("spin");
    host.label.set(undefined);
    await settle();

    expect(element.getAttribute("size")).toBe("64");
    expect(element.getAttribute("animation")).toBe("spin");
    expect(element.hasAttribute("label")).toBe(false);
    expect(element.shadowRoot!.querySelector(".icon")!.getAttribute("aria-hidden")).toBe("true");
  });
});
