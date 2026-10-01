// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerIcons } from "../src/index";
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

  it("renders nothing and warns once, after the current task, for an unknown name", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const element = mount({ name: "not-an-icon" });
    mount({ name: "not-an-icon" });
    expect(inner(element).innerHTML).toBe("");
    expect(warn).not.toHaveBeenCalled(); // deferred: the icon could still be registered
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain("notAnIconIcon"); // points at the export to import
    warn.mockRestore();
  });

  it("does not warn when the icon is registered later in the same task", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const element = mount({ name: "late-icon" });
    expect(inner(element).innerHTML).toBe("");
    registerIcons({ ...icons.star, name: "late-icon" });
    expect(inner(element).innerHTML).toBe(parsed(icons.star.svg)); // re-rendered on registration
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("renders a custom registered icon", () => {
    const custom = { name: "brand-mark", label: "Brand", category: "objects", tags: [], svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"/></svg>' } as const;
    registerIcons(custom);
    expect(inner(mount({ name: "brand-mark" })).querySelector("circle")).not.toBeNull();
  });

  it("accepts an icon definition through the icon property", () => {
    const element = mount({});
    element.icon = icons.trophy;
    expect(element.getAttribute("name")).toBe("trophy");
    expect(inner(element).innerHTML).toBe(parsed(icons.trophy.svg));
    expect(element.icon).toBe(icons.trophy);
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
