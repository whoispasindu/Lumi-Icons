// Health checks that run in the visitor's browser against the built package.
// Each check returns { status: "pass" | "fail" | "skip", detail? }.
import { getIcon, iconAnimations, iconNames, registerIcons } from "@lumi-icons/core";

const pass = (detail) => ({ status: "pass", detail });
const fail = (detail) => ({ status: "fail", detail });
const skip = (detail) => ({ status: "skip", detail });
const nextTask = () => new Promise((resolve) => setTimeout(resolve, 0));
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
let customRuns = 0;

/** Mounts a <lumi-icon> in the off-screen sandbox and returns it with its inner drawing element. */
function mount(sandbox, attributes = {}, parentStyle = "") {
  const parent = document.createElement("div");
  parent.style.cssText = parentStyle;
  const element = document.createElement("lumi-icon");
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  parent.append(element);
  sandbox.append(parent);
  const inner = element.shadowRoot?.querySelector(".icon");
  return { element, inner, parent };
}

/** Runs fn while console.warn is silenced, so expected warnings do not look like errors. */
async function quietly(fn) {
  const warn = console.warn;
  console.warn = () => {};
  try {
    return await fn();
  } finally {
    await nextTask(); // the element reports unknown names after the current task
    console.warn = warn;
  }
}

export const checks = [
  {
    name: "<lumi-icon> is defined",
    run: () => (customElements.get("lumi-icon") ? pass() : fail("customElements.get('lumi-icon') is undefined")),
  },
  {
    name: "Every icon is registered",
    run: () => {
      const missing = iconNames.filter((name) => !getIcon(name));
      return missing.length ? fail(`Missing: ${missing.slice(0, 10).join(", ")}`) : pass(`${iconNames.length} icons`);
    },
  },
  {
    name: "Every icon draws visible artwork",
    run: (sandbox) => {
      const broken = [];
      const fragment = document.createDocumentFragment();
      const elements = iconNames.map((name) => {
        const element = document.createElement("lumi-icon");
        element.setAttribute("name", name);
        fragment.append(element);
        return element;
      });
      sandbox.append(fragment);
      for (const element of elements) {
        const svg = element.shadowRoot?.querySelector("svg");
        let box;
        try { box = svg?.getBBox(); } catch { box = undefined; }
        if (!svg || !box || box.width === 0 || box.height === 0) broken.push(element.getAttribute("name"));
      }
      return broken.length ? fail(`${broken.length} broken: ${broken.slice(0, 12).join(", ")}`) : pass(`${elements.length} icons checked`);
    },
  },
  {
    name: "Aliases resolve (x → close)",
    run: (sandbox) => {
      const { element } = mount(sandbox, { name: "x" });
      return element.icon?.name === "close" ? pass() : fail(`x rendered ${element.icon?.name ?? "nothing"}`);
    },
  },
  {
    name: "Unknown names render nothing",
    run: (sandbox) => quietly(() => {
      const { inner } = mount(sandbox, { name: "definitely-not-an-icon" });
      return inner && inner.childElementCount === 0 ? pass() : fail("Something was drawn");
    }),
  },
  {
    name: "size sets pixels and CSS lengths",
    run: (sandbox) => {
      const px = mount(sandbox, { name: "star", size: "40" }).inner.getBoundingClientRect().width;
      const em = mount(sandbox, { name: "star", size: "2em" }, "font-size: 10px").inner.getBoundingClientRect().width;
      return Math.round(px) === 40 && Math.round(em) === 20 ? pass("40 → 40px, 2em → 20px") : fail(`40 → ${px}px, 2em → ${em}px`);
    },
  },
  {
    name: "color sets the icon color; default follows the text color",
    run: (sandbox) => {
      const own = getComputedStyle(mount(sandbox, { name: "heart", color: "#ff0000" }).inner).color;
      const inherited = getComputedStyle(mount(sandbox, { name: "heart" }, "color: rgb(0, 0, 255)").inner).color;
      return own === "rgb(255, 0, 0)" && inherited === "rgb(0, 0, 255)" ? pass() : fail(`color="#ff0000" → ${own}; inherited → ${inherited}`);
    },
  },
  {
    name: "Every animation runs",
    run: (sandbox) => {
      if (reducedMotion()) return skip("Your system asks for reduced motion, so icons correctly hold still");
      const still = iconAnimations
        .filter((animation) => animation !== "none")
        .filter((animation) => getComputedStyle(mount(sandbox, { name: "star", animation }).inner).animationName === "none");
      return still.length ? fail(`Not animating: ${still.join(", ")}`) : pass(`${iconAnimations.length - 1} animations`);
    },
  },
  {
    name: 'motion="reduced" holds still',
    run: (sandbox) => {
      const { inner } = mount(sandbox, { name: "star", animation: "spin", motion: "reduced" });
      return getComputedStyle(inner).animationName === "none" ? pass() : fail("Still animating");
    },
  },
  {
    name: "label makes the icon an accessible image",
    run: (sandbox) => {
      const labelled = mount(sandbox, { name: "bell", label: "Notifications" }).inner;
      const decorative = mount(sandbox, { name: "bell" }).inner;
      const ok = labelled.getAttribute("role") === "img" && labelled.getAttribute("aria-label") === "Notifications" &&
        decorative.getAttribute("aria-hidden") === "true";
      return ok ? pass() : fail("Wrong role/aria attributes");
    },
  },
  {
    name: "Attribute values cannot inject markup",
    run: (sandbox) => {
      const payload = `"><img src=x onerror="window.__lumiPwned=1"><style>*{}</style>`;
      const { element } = mount(sandbox, { name: "star", label: payload, color: `red;} ${payload}`, size: `1px;} ${payload}` });
      const injected = element.shadowRoot.querySelector("img, style") || window.__lumiPwned;
      return injected ? fail("Markup was injected") : pass();
    },
  },
  {
    name: "registerIcons adds custom icons, even after an element is shown",
    run: (sandbox) => quietly(() => {
      // A new name on every run: once registered, an icon stays registered.
      const name = `demo-custom-icon-${++customRuns}`;
      const { element } = mount(sandbox, { name });
      const before = element.shadowRoot.querySelector("svg");
      registerIcons({ name, label: "Custom", category: "objects", tags: [], svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>' });
      const after = element.shadowRoot.querySelector("circle");
      return !before && after ? pass() : fail(before ? "Drew before registration" : "Did not appear after registration");
    }),
  },
];

/** Browser features worth knowing about when comparing results across browsers. */
export function features() {
  const supports = (property) => typeof CSS !== "undefined" && CSS.supports(property);
  return [
    { name: "Constructable stylesheets", value: "adoptedStyleSheets" in Document.prototype, note: "falls back to <style> without them" },
    { name: "color-mix()", value: supports("color: color-mix(in srgb, red 50%, blue)"), note: "without it the soft drop shadow is skipped" },
    { name: "Trusted Types", value: "trustedTypes" in window, note: "used through the lumi-icons policy" },
    { name: "Reduced motion", value: reducedMotion(), note: "on means animations hold still" },
  ];
}

export async function runChecks(sandbox) {
  const results = [];
  for (const check of checks) {
    let result;
    try {
      result = await check.run(sandbox);
    } catch (error) {
      result = fail(`Threw: ${error instanceof Error ? error.message : String(error)}`);
    }
    results.push({ name: check.name, ...result });
  }
  sandbox.replaceChildren();
  return results;
}
