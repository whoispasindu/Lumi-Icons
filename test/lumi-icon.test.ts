// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { icons } from "../src/icons";
import type { LumiIcon } from "../src/lumi-icon";

function mount(attributes: Record<string, string>) {
  const element = document.createElement("lumi-icon");
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  document.body.append(element);
  return element;
}

const inner = (element: LumiIcon) => element.shadowRoot!.querySelector<HTMLElement>(".icon")!;

/** The DOM re-serializes markup (e.g. self-closing tags), so compare against parsed markup. */
function parsed(markup: string) {
  const container = document.createElement("span");
  container.innerHTML = markup;
  return container.innerHTML;
}

afterEach(() => { document.body.innerHTML = ""; });

describe("<lumi-icon>", () => {
  it("is registered", () => {
    expect(customElements.get("lumi-icon")).toBeDefined();
  });

  it("renders the named icon and swaps it when the name changes", () => {
    const element = mount({ name: "rocket" });
    expect(inner(element).innerHTML).toBe(parsed(icons.rocket.svg));
    element.setAttribute("name", "heart");
    expect(inner(element).innerHTML).toBe(parsed(icons.heart.svg));
  });

  it("resolves aliases", () => {
    expect(inner(mount({ name: "x" })).innerHTML).toBe(parsed(icons.close.svg));
  });

  it("renders nothing and warns once for an unknown name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const element = mount({ name: "not-an-icon" });
    mount({ name: "not-an-icon" });
    expect(inner(element).innerHTML).toBe("");
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("does not treat Object.prototype keys as icon names", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(inner(mount({ name: "toString" })).innerHTML).toBe("");
    warn.mockRestore();
  });

  it("is decorative without a label and an accessible image with one", () => {
    const element = mount({ name: "bell" });
    expect(inner(element).getAttribute("aria-hidden")).toBe("true");
    expect(inner(element).hasAttribute("role")).toBe(false);

    element.setAttribute("label", "Notifications");
    expect(inner(element).getAttribute("role")).toBe("img");
    expect(inner(element).getAttribute("aria-label")).toBe("Notifications");
    expect(inner(element).hasAttribute("aria-hidden")).toBe(false);
  });

  it("reads numeric sizes as pixels and accepts CSS lengths", () => {
    const element = mount({ name: "cube", size: "48" });
    expect(inner(element).style.getPropertyValue("--lumi-icon-size")).toBe("48px");
    element.setAttribute("size", "2em");
    expect(inner(element).style.getPropertyValue("--lumi-icon-size")).toBe("2em");
  });

  it("uses one shared stylesheet for every instance", () => {
    const a = mount({ name: "cube" });
    const b = mount({ name: "box" });
    expect(a.shadowRoot!.adoptedStyleSheets).toHaveLength(1);
    expect(a.shadowRoot!.adoptedStyleSheets[0]).toBe(b.shadowRoot!.adoptedStyleSheets[0]);
  });

  describe("does not let attribute values inject markup", () => {
    const payload = `"><img src=x onerror="window.__pwned=true"><style>*{}</style>`;

    it("via label", () => {
      const element = mount({ name: "star", label: payload });
      expect(element.shadowRoot!.querySelector("img")).toBeNull();
      expect(inner(element).getAttribute("aria-label")).toBe(payload);
    });

    it("via color", () => {
      const element = mount({ name: "star", color: `red; } </style>${payload}` });
      expect(element.shadowRoot!.querySelector("img")).toBeNull();
      expect(element.shadowRoot!.querySelector("style")).toBeNull();
    });

    it("via size", () => {
      const element = mount({ name: "star", size: `24px; } ${payload}` });
      expect(element.shadowRoot!.querySelector("img")).toBeNull();
      expect(inner(element).style.getPropertyValue("--lumi-icon-size")).toBe("");
    });
  });

  it("drops an invalid color instead of keeping the previous one", () => {
    const element = mount({ name: "star", color: "red" });
    expect(inner(element).style.color).toBe("red");
    element.setAttribute("color", "not a color");
    expect(inner(element).style.color).toBe("");
  });
});
