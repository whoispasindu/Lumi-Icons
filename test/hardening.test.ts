// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { getIcon, LumiIcon, registerIcons } from "../src/index";
import { icons } from "../src/icons";

const inner = (element: LumiIcon) => element.shadowRoot!.querySelector<HTMLElement>(".icon")!;
const store = () => (globalThis as Record<symbol, { listeners: Set<unknown> }>)[Symbol.for("lumi-icons.registry.v1")];
const policyKey = Symbol.for("lumi-icons.trusted-types-policy.v1");
const global = globalThis as Record<PropertyKey, unknown>;

function mount(attributes: Record<string, string> = {}) {
  const element = document.createElement("lumi-icon");
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  document.body.append(element);
  return element;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("registry", () => {
  it("ignores input that is not an icon instead of throwing", () => {
    for (const input of [undefined, null, "rocket", 42, {}, [], [null], { a: undefined }, { name: "", svg: "<svg/>" }]) {
      expect(() => registerIcons(input as never)).not.toThrow();
    }
    expect(getIcon("")).toBeUndefined();
  });

  it("is shared between two copies of the package", async () => {
    vi.resetModules();
    const secondCopy = await import("../src/registry");
    const custom = { name: "second-copy-icon", label: "", category: "objects", tags: [], svg: "<svg></svg>" } as const;
    secondCopy.registerIcons(custom);
    expect(getIcon("second-copy-icon")).toBe(custom); // visible to the first copy
    expect(secondCopy.getIcon("rocket")).toBe(icons.rocket); // and the other way around
  });

  it("does not keep listeners for removed elements", () => {
    const before = store().listeners.size;
    const elements = Array.from({ length: 50 }, () => mount({ name: "rocket" }));
    expect(store().listeners.size).toBe(before + 50);
    elements.forEach((element) => element.remove());
    expect(store().listeners.size).toBe(before);
    // Re-attaching subscribes again exactly once.
    document.body.append(elements[0]);
    document.body.append(elements[0]);
    expect(store().listeners.size).toBe(before + 1);
  });
});

describe("<lumi-icon> robustness", () => {
  it("renders nothing, without throwing, for hostile or odd names", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    for (const name of ["__proto__", "constructor", "hasOwnProperty", "<img src=x onerror=alert(1)>", " ", "ROCKET"]) {
      const element = mount({ name });
      expect(inner(element).childElementCount).toBe(0);
      expect(element.shadowRoot!.querySelector("img")).toBeNull();
    }
  });

  it("clears the icon when the icon property is set to null or a non-icon", () => {
    const element = mount({ name: "rocket" });
    element.icon = null;
    expect(element.hasAttribute("name")).toBe(false);
    expect(inner(element).childElementCount).toBe(0);
    element.icon = icons.heart;
    element.icon = {} as never;
    expect(inner(element).childElementCount).toBe(0);
  });

  it("applies properties that were set before the element was defined", async () => {
    // A fresh tag stands in for "the library loaded after the app set the property".
    const element = document.createElement("lumi-icon-late") as LumiIcon;
    element.icon = icons.heart;
    document.body.append(element);
    customElements.define("lumi-icon-late", class extends LumiIcon {});
    expect(element.getAttribute("name")).toBe("heart");
    expect(inner(element).querySelector("svg")).not.toBeNull();
  });

  it("survives many rapid attribute changes and ends in the last state", () => {
    const element = mount();
    for (let i = 0; i < 500; i++) {
      element.setAttribute("name", i % 2 ? "rocket" : "heart");
      element.setAttribute("size", String(i));
    }
    expect(element.icon).toBe(icons.rocket);
    expect(inner(element).style.getPropertyValue("--lumi-icon-size")).toBe("499px");
  });
});

describe("Trusted Types", () => {
  afterEach(() => {
    delete global[policyKey];
    delete global.trustedTypes;
  });

  it("draws through a \"lumi-icons\" policy when the browser has Trusted Types", () => {
    delete global[policyKey];
    const createHTML = vi.fn((markup: string) => markup);
    const createPolicy = vi.fn((_name: string, rules: { createHTML(markup: string): string }) => ({ createHTML: (markup: string) => createHTML(rules.createHTML(markup)) }));
    global.trustedTypes = { createPolicy };

    const element = mount({ name: "anchor" });
    expect(createPolicy).toHaveBeenCalledWith("lumi-icons", expect.anything());
    expect(createHTML).toHaveBeenCalledWith(icons.anchor.svg);
    expect(inner(element).querySelector("svg")).not.toBeNull();

    mount({ name: "atom" });
    expect(createPolicy).toHaveBeenCalledTimes(1); // created once, then reused
  });

  it("reports once, without throwing, when the page's CSP blocks the policy", () => {
    delete global[policyKey];
    global.trustedTypes = { createPolicy: () => { throw new TypeError("Policy not allowed by CSP"); } };
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    // Simulate enforcement as browsers do it: every innerHTML sink rejects plain strings.
    let owner: object | null = document.createElement("template");
    while (owner && !Object.getOwnPropertyDescriptor(owner, "innerHTML")) owner = Object.getPrototypeOf(owner);
    const original = Object.getOwnPropertyDescriptor(owner!, "innerHTML")!;
    Object.defineProperty(owner!, "innerHTML", {
      ...original,
      set(value: unknown) {
        if (typeof value === "string" && value !== "") throw new TypeError("This document requires 'TrustedHTML' assignment.");
        original.set!.call(this, value);
      },
    });
    try {
      // Icons that have not been drawn before, so nothing comes from the parsed-template cache.
      const fresh = (name: string) => ({ name, label: name, category: "objects", tags: [], svg: '<svg viewBox="0 0 24 24"><circle r="4"/></svg>' } as const);
      registerIcons(fresh("tt-one"), fresh("tt-two"));
      const element = mount();
      expect(() => element.setAttribute("name", "tt-one")).not.toThrow();
      element.setAttribute("name", "tt-two");
      expect(inner(element).childElementCount).toBe(0);
    } finally {
      Object.defineProperty(owner!, "innerHTML", original);
    }

    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0][0])).toContain("trusted-types lumi-icons");
  });

  it("parses each icon once and clones it for every other element", () => {
    const custom = { name: "parse-once", label: "", category: "objects", tags: [], svg: '<svg viewBox="0 0 24 24"><rect width="4" height="4"/></svg>' } as const;
    registerIcons(custom);
    const parses = vi.fn((markup: string) => markup);
    delete global[policyKey];
    global.trustedTypes = { createPolicy: () => ({ createHTML: parses }) };
    const elements = Array.from({ length: 20 }, () => mount({ name: "parse-once" }));
    expect(parses).toHaveBeenCalledTimes(1);
    expect(elements.every((element) => inner(element).querySelector("rect"))).toBe(true);
    // Each element gets its own nodes, not shared ones.
    expect(inner(elements[0]).firstChild).not.toBe(inner(elements[1]).firstChild);
  });
});
