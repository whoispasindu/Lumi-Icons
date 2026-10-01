// @vitest-environment happy-dom
// The lean entry: no icon artwork is registered unless the app provides it. This file runs in its own
// worker, so the full catalog from the primary entry's test can't leak in.
import "@angular/compiler";
import { ApplicationRef, Component, provideZonelessChangeDetection, signal } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { afterEach, expect, it } from "vitest";
import { getIcon } from "@lumi-icons/core/element";
import { cubeIcon, rocketIcon } from "@lumi-icons/core/icons";
import { LumiIconComponent } from "../dist/fesm2022/lumi-icons-angular-lean.mjs";

const Host = Component({
  selector: "test-host",
  imports: [LumiIconComponent],
  template: `<lumi-icon id="by-name" name="cube" /><lumi-icon id="by-icon" [icon]="icon()" />`,
})(class Host { icon = signal(rocketIcon); });

let destroy: (() => void) | undefined;
afterEach(() => { destroy?.(); destroy = undefined; });

it("ships no artwork: icons render only when the app provides them", async () => {
  document.body.innerHTML = "<test-host></test-host>";
  const app = await bootstrapApplication(Host, { providers: [provideZonelessChangeDetection()] });
  destroy = () => app.destroy();
  const inner = (id: string) => document.getElementById(id)!.shadowRoot!.querySelector(".icon")!;

  // By name, without registering: nothing is drawn, because the lean entry bundles no icons.
  expect(getIcon("cube")).toBeUndefined();
  expect(inner("by-name").innerHTML).toBe("");

  // Through [icon]: registered on the fly and drawn.
  expect(document.getElementById("by-icon")!.getAttribute("name")).toBe("rocket");
  expect(inner("by-icon").querySelector("svg")).not.toBeNull();

  // Registering later makes the by-name icon appear without any re-render from Angular.
  const { registerIcons } = await import("@lumi-icons/core/element");
  registerIcons(cubeIcon);
  app.injector.get(ApplicationRef).tick();
  expect(inner("by-name").querySelector("svg")).not.toBeNull();
});
