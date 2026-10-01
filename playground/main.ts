import { iconNames, icons, resolveIconName } from "../src";
import { iconAnimations, iconCategories, type IconAnimation, type IconCategory, type IconName } from "../src/types";
import "./style.css";

type Stage = "light" | "dark" | "tint";
type CodeTab = "html" | "react" | "vue" | "angular" | "react-native";

const swatches = [
  { color: "#6a4dd8", name: "Violet" },
  { color: "#2f7de1", name: "Blue" },
  { color: "#10a37f", name: "Green" },
  { color: "#e9a23b", name: "Amber" },
  { color: "#ef6b4a", name: "Coral" },
  { color: "#e2458a", name: "Pink" },
  { color: "#23222d", name: "Ink" },
];

const featured: IconName[] = [
  "rocket", "heart", "star", "bell", "home", "search", "settings", "user",
  "mail", "chat", "calendar", "lock", "cart", "camera", "cloud", "sparkles",
  "trash", "download", "checkCircle", "globe", "zap", "trophy", "folder", "bulb",
];

const categoryIcons: Record<IconCategory, IconName> = {
  interface: "settings", layout: "layout", arrows: "arrowRight", editor: "type", design: "palette",
  files: "file", development: "code", devices: "laptop", media: "play", communication: "chat",
  people: "user", security: "lock", time: "clock", commerce: "cart", travel: "plane", feedback: "star",
  health: "heartPulse", food: "pizza", games: "gamepad", math: "sigma", weather: "cloudSun",
  nature: "leaf", objects: "cube",
};

const ladderSizes = [16, 20, 24, 32, 48];
const defaults = { color: swatches[0].color, size: 36, animation: "float" as IconAnimation, reduced: false };
const storageKey = "lumi-playground";

/* ---------- Helpers ---------- */

const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector)!;
const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(selector)];
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> = {}, attrs: Record<string, string> = {}) => {
  const node = Object.assign(document.createElement(tag), props);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
};
const icon = (name: IconName, size?: number) => el("lumi-icon", {}, size ? { name, size: String(size) } : { name });
const titleCase = (value: string) => value[0].toUpperCase() + value.slice(1);
const byName = (name: IconName) => icons[name];
const isColor = (value: unknown): value is string => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

function loadSaved(): Partial<typeof defaults> {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    return {
      ...(isColor(saved.color) ? { color: saved.color } : {}),
      ...(Number.isFinite(saved.size) && saved.size >= 16 && saved.size <= 64 ? { size: saved.size } : {}),
      ...(iconAnimations.includes(saved.animation) ? { animation: saved.animation } : {}),
      ...(typeof saved.reduced === "boolean" ? { reduced: saved.reduced } : {}),
    };
  } catch {
    return {};
  }
}

function save() {
  const { color, size, animation, reduced } = state;
  try { localStorage.setItem(storageKey, JSON.stringify({ color, size, animation, reduced })); } catch { /* storage unavailable */ }
}

const root = document.documentElement;
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);

const state = {
  ...defaults,
  ...loadSaved(),
  selected: null as IconName | null,
  stage: (isDark() ? "dark" : "light") as Stage,
  tab: "html" as CodeTab,
  lean: false,
  query: "",
};

$$("[data-icon-count]").forEach((node) => { node.textContent = String(iconNames.length); });
$$("[data-category-count]").forEach((node) => { node.textContent = String(iconCategories.length); });

/* ---------- Toast + clipboard ---------- */

const toast = $("[data-toast]");
let toastTimer: number | undefined;
function showToast(message: string) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 1600);
}

async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied ${what}`);
  } catch {
    showToast("Copy failed. Select the text to copy it manually.");
  }
}

$$<HTMLButtonElement>("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copy(button.dataset.copy!, "install command"));
});

/* ---------- Theme ---------- */

const themeIcon = $("[data-theme-icon]");
const syncThemeIcon = () => themeIcon.setAttribute("name", isDark() ? "sun" : "moon");
$("[data-theme-toggle]").addEventListener("click", () => {
  const next = isDark() ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("lumi-theme", next); } catch { /* storage unavailable: theme lasts for this visit */ }
  syncThemeIcon();
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncThemeIcon);
syncThemeIcon();

/* ---------- Tiles ---------- */

const explorer = $("[data-explorer]");
const hoverIcons = new WeakMap<HTMLButtonElement, HTMLElement>();

function createTile(name: IconName) {
  const tile = el("button", { className: "tile", type: "button", title: byName(name).label }, { "data-icon": name, "aria-haspopup": "dialog" });
  const glyph = icon(name);
  tile.append(glyph, el("span", { className: "tile-label", textContent: byName(name).label }));
  hoverIcons.set(tile, glyph);
  return tile;
}

// One set of delegated listeners serves every tile, however many are created later.
explorer.addEventListener("click", (event) => {
  const tile = (event.target as Element).closest<HTMLButtonElement>(".tile");
  if (tile) openDrawer(tile.dataset.icon as IconName, tile);
});
explorer.addEventListener("pointerover", (event) => {
  const tile = (event.target as Element).closest<HTMLButtonElement>(".tile");
  const glyph = tile && hoverIcons.get(tile);
  if (glyph && !glyph.hasAttribute("animation") && state.animation !== "none" && !state.reduced) glyph.setAttribute("animation", state.animation);
});
explorer.addEventListener("pointerout", (event) => {
  const tile = (event.target as Element).closest<HTMLButtonElement>(".tile");
  if (!tile || tile.contains(event.relatedTarget as Node)) return;
  hoverIcons.get(tile)?.removeAttribute("animation");
});

const featuredGrid = $("[data-featured]");
featuredGrid.append(...featured.map(createTile));

/* ---------- Categories ---------- */

const categoryOrder = [...iconCategories];
const namesByCategory = new Map(categoryOrder.map((category) => [category, iconNames.filter((name) => byName(name).category === category)]));
// Prev/next in the drawer follow the order the catalog shows icons in.
const browseOrder = categoryOrder.flatMap((category) => namesByCategory.get(category)!);
const browseIndex = new Map(browseOrder.map((name, index) => [name, index]));

const categoryList = $("[data-category-list]");
const sections = new Map<IconCategory, HTMLDetailsElement>();

for (const category of categoryOrder) {
  const names = namesByCategory.get(category)!;
  const details = el("details", { className: "category" }, { id: `category-${category}` });
  const summary = el("summary");
  const badge = el("span", { className: "cat-badge" });
  badge.append(icon(categoryIcons[category], 24));
  const text = el("span", { className: "cat-text" });
  text.append(el("strong", { textContent: titleCase(category) }), el("span", { textContent: `${names.length} icons` }));
  const peek = el("span", { className: "cat-peek" }, { "aria-hidden": "true" });
  peek.append(...names.slice(0, 6).map((name) => icon(name, 20)));
  summary.append(badge, text, peek, icon("chevronDown", 18));
  summary.lastElementChild!.classList.add("toggle-chevron");

  const grid = el("div", { className: "grid" });
  details.append(summary, grid);
  // Tiles are built the first time a section opens, so the page starts light.
  details.addEventListener("toggle", () => {
    if (details.open && !grid.childElementCount) grid.append(...names.map(createTile));
    syncToggleAll();
  });
  sections.set(category, details);
  categoryList.append(details);
}

const toggleAll = $<HTMLButtonElement>("[data-toggle-all]");
function syncToggleAll() {
  const allOpen = [...sections.values()].every((details) => details.open);
  toggleAll.textContent = allOpen ? "Collapse all" : "Expand all";
}
toggleAll.addEventListener("click", () => {
  const open = ![...sections.values()].every((details) => details.open);
  sections.forEach((details) => { details.open = open; });
});

/* Sidebar navigation */

const nav = $("[data-category-nav]");
const navButtons = new Map<string, HTMLButtonElement>();
function addNavItem(key: string, label: string, iconName: IconName, count: number, onSelect: () => void) {
  const button = el("button", { className: "nav-item", type: "button" });
  button.append(icon(iconName, 20), el("span", { textContent: label }), el("span", { className: "nav-count", textContent: String(count) }));
  button.addEventListener("click", () => {
    navButtons.forEach((other) => other.removeAttribute("aria-current"));
    button.setAttribute("aria-current", "true");
    if (state.query) setQuery("");
    onSelect();
  });
  navButtons.set(key, button);
  const item = el("li");
  item.append(button);
  nav.append(item);
}
addNavItem("popular", "Popular", "sparkles", featured.length, () => featuredGrid.closest("section")!.scrollIntoView({ behavior: "smooth", block: "start" }));
for (const category of categoryOrder) {
  addNavItem(category, titleCase(category), categoryIcons[category], namesByCategory.get(category)!.length, () => {
    const details = sections.get(category)!;
    details.open = true;
    details.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* ---------- Search ---------- */

const search = $<HTMLInputElement>("[data-search]");
const explorerMain = $(".explorer-main");
const browse = $("[data-browse]");
const results = $("[data-results]");
const resultsGrid = $("[data-results-grid]");
const resultCount = $("[data-result-count]");
const empty = $("[data-empty]");
const clearSearch = $<HTMLButtonElement>("[data-clear-search]");
const shortcut = $("[data-shortcut]");
const resultTiles = new Map<IconName, HTMLButtonElement>();
let resultOrder: IconName[] = [];

shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "/";

/** Lower is better; -1 means no match. Every term must match something. */
function score(name: IconName, terms: string[]) {
  const { label, category, tags } = byName(name);
  const fields = [name.toLowerCase(), label.toLowerCase()];
  let total = 0;
  for (const term of terms) {
    let best = -1;
    for (const field of fields) {
      if (field === term) best = 0;
      else if (field.startsWith(term) && (best < 0 || best > 1)) best = 1;
      else if (field.includes(term) && (best < 0 || best > 2)) best = 2;
    }
    if (best < 0 && tags.some((tag) => tag.includes(term))) best = 3;
    if (best < 0 && category.includes(term)) best = 4;
    if (best < 0) return -1;
    total += best;
  }
  return total;
}

function runSearch() {
  const query = state.query.trim().toLowerCase();
  browse.hidden = query !== "";
  results.hidden = query === "";
  clearSearch.hidden = query === "";
  shortcut.hidden = query !== "";
  if (!query) { resultOrder = []; return; }

  if (!resultTiles.size) for (const name of iconNames) resultTiles.set(name, createTile(name));
  const terms = query.split(/\s+/);
  resultOrder = iconNames
    .map((name) => [name, score(name, terms)] as const)
    .filter(([, value]) => value >= 0)
    .sort((a, b) => a[1] - b[1] || browseIndex.get(a[0])! - browseIndex.get(b[0])!)
    .map(([name]) => name);

  resultsGrid.replaceChildren(...resultOrder.map((name) => resultTiles.get(name)!));
  resultCount.textContent = `${resultOrder.length} ${resultOrder.length === 1 ? "icon matches" : "icons match"} “${state.query.trim()}”`;
  empty.hidden = resultOrder.length > 0;
  $("[data-empty-query]").textContent = state.query.trim();
  // Typing while scrolled deep into the categories would leave the results above the viewport.
  if (results.getBoundingClientRect().top < 0) explorerMain.scrollIntoView({ block: "start" });
}

function setQuery(value: string) {
  search.value = value;
  state.query = value;
  runSearch();
}

search.addEventListener("input", () => { state.query = search.value; runSearch(); });
clearSearch.addEventListener("click", () => { setQuery(""); search.focus(); });
$$<HTMLButtonElement>("[data-suggest]").forEach((button) => button.addEventListener("click", () => { setQuery(button.dataset.suggest!); search.focus(); }));

document.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement;
  const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
  // `key` can be missing on synthetic events (e.g. Chrome autofill), so read it defensively.
  const key = event.key?.toLowerCase() ?? "";
  const openSearch = (key === "/" && !typing) || (key === "k" && (event.metaKey || event.ctrlKey));
  if (openSearch && !drawer.open) {
    event.preventDefault();
    search.focus();
    search.select();
    search.scrollIntoView({ block: "nearest" });
  }
  if (event.key === "Escape" && target === search && search.value) { event.preventDefault(); setQuery(""); }
});

/* ---------- Customizer ---------- */

const swatchHost = $("[data-swatches]");
const customColor = $<HTMLInputElement>("[data-color]");
const swatchButtons = swatches.map(({ color, name }) => {
  const button = el("button", { className: "swatch", type: "button", title: name }, { "aria-label": name, "data-swatch": color });
  button.style.setProperty("--swatch", color);
  button.addEventListener("click", () => { state.color = color; update(); });
  swatchHost.insertBefore(button, customColor.parentElement);
  return button;
});
customColor.addEventListener("input", () => { state.color = customColor.value; update(); });

const sizeInput = $<HTMLInputElement>("[data-size]");
const sizeOutput = $("[data-size-output]");
sizeInput.addEventListener("input", () => { state.size = Number(sizeInput.value); update(); });

const reducedInput = $<HTMLInputElement>("[data-reduced]");
reducedInput.addEventListener("change", () => { state.reduced = reducedInput.checked; update(); });

const animationButtons = $$("[data-animations]").flatMap((host) =>
  iconAnimations.map((animation) => {
    const button = el("button", { className: "chip", type: "button", textContent: titleCase(animation) }, { "data-animation": animation });
    button.addEventListener("click", () => { state.animation = animation; update(); });
    host.append(button);
    return button;
  }),
);

$("[data-reset]").addEventListener("click", () => {
  Object.assign(state, defaults);
  update();
  showToast("Customizer reset");
});

const customizerToggle = $<HTMLButtonElement>("[data-customizer-toggle]");
const customizerBody = $("#customizer-body");
function setCustomizerOpen(open: boolean) {
  customizerToggle.setAttribute("aria-expanded", String(open));
  customizerBody.hidden = !open;
}
customizerToggle.addEventListener("click", () => setCustomizerOpen(customizerToggle.getAttribute("aria-expanded") !== "true"));
// On small screens the customizer starts folded so the icons come first.
if (matchMedia("(max-width: 959px)").matches) setCustomizerOpen(false);

/* ---------- Drawer ---------- */

const drawer = $<HTMLDialogElement>("[data-drawer]");
const preview = $("[data-preview]");
const stageView = $("[data-stage-view]");
const ladder = $("[data-ladder]");
const ladderIcons = ladderSizes.map((size) => {
  const glyph = el("lumi-icon", {}, { size: String(size) });
  const item = el("div", { className: "ladder-item" });
  item.append(glyph, el("span", { textContent: `${size}px` }));
  ladder.append(item);
  return glyph;
});
const tagsHost = $("[data-d-tags]");
const code = $("[data-code]");
const codeTabs = $$<HTMLButtonElement>("[data-tab]");
let returnFocus: HTMLElement | null = null;

function openDrawer(name: IconName, from?: HTMLElement) {
  state.selected = name;
  if (from) returnFocus = from;
  update();
  if (!drawer.open) drawer.showModal();
  history.replaceState(null, "", `#${name}`);
}

function step(direction: 1 | -1) {
  if (!state.selected) return;
  const order = resultOrder.length ? resultOrder : browseOrder;
  const index = order.indexOf(state.selected);
  const next = order[(index + direction + order.length) % order.length];
  openDrawer(next);
}

// Cleanup runs directly rather than only from the dialog's `close` event, which browsers
// queue as a task (and can hold back in background tabs). It is safe to run twice.
function onDrawerClosed() {
  if (state.selected === null) return;
  state.selected = null;
  history.replaceState(null, "", location.pathname + location.search);
  if (returnFocus) {
    returnFocus.focus();
  } else {
    // No sensible return target (e.g. opened from the decorative hero): never leave focus inside
    // the closed dialog or the aria-hidden hero, where the browser may otherwise restore it.
    const active = document.activeElement as HTMLElement | null;
    if (active && (drawer.contains(active) || active.closest("[data-hero]"))) active.blur();
  }
}
function closeDrawer() {
  if (drawer.open) drawer.close();
  onDrawerClosed();
}
drawer.addEventListener("close", onDrawerClosed);
// A click on the dialog element itself (not its content) is a click on the backdrop.
drawer.addEventListener("click", (event) => { if (event.target === drawer) closeDrawer(); });
drawer.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { event.preventDefault(); closeDrawer(); return; }
  if (event.target instanceof HTMLInputElement) return;
  if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
  if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
});
$("[data-d-close]").addEventListener("click", closeDrawer);
$("[data-d-prev]").addEventListener("click", () => step(-1));
$("[data-d-next]").addEventListener("click", () => step(1));
$$<HTMLButtonElement>("[data-stage]").forEach((button) => {
  button.addEventListener("click", () => { state.stage = button.dataset.stage as Stage; update(); });
});
codeTabs.forEach((tab) => tab.addEventListener("click", () => { state.tab = tab.dataset.tab as CodeTab; update(); }));

tagsHost.addEventListener("click", (event) => {
  const tag = (event.target as Element).closest<HTMLButtonElement>("[data-tag]");
  if (!tag) return;
  closeDrawer();
  setQuery(tag.dataset.tag!);
  search.scrollIntoView({ behavior: "smooth", block: "center" });
});

/** A self-contained SVG file: the chosen color is baked in, since there is no CSS to inherit from. */
function standaloneSvg(name: IconName) {
  return byName(name).svg
    .replace("<svg ", `<svg xmlns="http://www.w3.org/2000/svg" width="${state.size}" height="${state.size}" `)
    .replace(' aria-hidden="true"', "")
    .replaceAll("currentColor", state.color);
}

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
$("[data-copy-svg]").addEventListener("click", () => state.selected && copy(standaloneSvg(state.selected), "SVG"));
$("[data-download-svg]").addEventListener("click", () => {
  if (!state.selected) return;
  const url = URL.createObjectURL(new Blob([standaloneSvg(state.selected)], { type: "image/svg+xml" }));
  const link = el("a", { href: url, download: `${kebab(state.selected)}.svg` });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Downloaded ${kebab(state.selected)}.svg`);
});
$("[data-copy-name]").addEventListener("click", () => state.selected && copy(state.selected, "icon name"));
const tabNames: Record<CodeTab, string> = { html: "HTML", react: "React", vue: "Vue", angular: "Angular", "react-native": "React Native" };
$("[data-copy-code]").addEventListener("click", () => copy(snippet(), `${tabNames[state.tab]} snippet`));

const leanInput = $<HTMLInputElement>("[data-lean]");
leanInput.addEventListener("change", () => { state.lean = leanInput.checked; update(); });

/** The icon's export in "@lumi-icons/core/icons", e.g. "rocket" → "rocketIcon". */
const exportName = (name: string) => `${name}Icon`;

function snippet() {
  const { selected, animation, color, size, reduced, tab, lean } = state;
  const name = selected ?? "rocket";
  const icon = exportName(name);
  // "Only this icon" swaps the name for the icon definition, so bundlers keep just this icon.
  const attrs: [string, string | number | { ref: string }][] = [
    lean && tab !== "html" ? ["icon", { ref: tab === "angular" ? "icon" : icon }] : ["name", name],
    ["size", size],
    ["color", color],
  ];
  if (animation !== "none") attrs.push(["animation", animation]);
  if (reduced) attrs.push(["motion", "reduced"]);
  const format = ([key, value]: [string, string | number | { ref: string }]) => {
    const expression = typeof value === "object" ? value.ref : typeof value === "number" ? String(value) : undefined;
    if (expression === undefined) return `${key}="${value}"`;
    if (tab === "react" || tab === "react-native") return `${key}={${expression}}`;
    if (tab === "vue") return `:${key}="${expression}"`;
    if (tab === "angular") return `[${key}]="${expression}"`;
    return `${key}="${expression}"`;
  };
  const body = attrs.map(format).join(" ");
  const element = tab === "html" ? `<lumi-icon ${body}></lumi-icon>` : tab === "angular" ? `<lumi-icon ${body} />` : `<LumiIcon ${body} />`;
  if (!lean) return element;

  const fromIcons = `import { ${icon} } from "@lumi-icons/core/icons";`;
  switch (tab) {
    case "html":
      return `<script type="module">\n  import { registerIcons } from "@lumi-icons/core/element";\n  ${fromIcons}\n  registerIcons(${icon});\n</script>\n\n${element}`;
    case "react":
      return `import { LumiIcon } from "@lumi-icons/react/lean";\n${fromIcons}\n\n${element}`;
    case "react-native":
      return `import { LumiIcon } from "@lumi-icons/react-native/lean";\n${fromIcons}\n\n${element}`;
    case "vue":
      return `<script setup lang="ts">\nimport { LumiIcon } from "@lumi-icons/vue/lean";\n${fromIcons}\n</script>\n\n${element}`;
    case "angular":
      return `import { LumiIconComponent } from "@lumi-icons/angular/lean";\n${fromIcons}\n\n// In the component: imports: [LumiIconComponent], icon = ${icon};\n${element}`;
  }
}

/** Renders the snippet as highlighted DOM nodes (textContent only, no markup parsing). */
function renderCode() {
  code.replaceChildren();
  const text = snippet();
  // Attribute names may be bound: :size (Vue) or [size] (Angular).
  const pattern = /(<\/?[\w-]+|\/?>)|([:\w\-[\]]+)(=)("[^"]*"|\{[^}]*\})/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    // Keep anything between tokens verbatim, so nothing the pattern misses is ever dropped.
    code.append(text.slice(last, match.index));
    if (match[1]) code.append(el("span", { className: "tok-tag", textContent: match[1] }));
    else code.append(el("span", { className: "tok-attr", textContent: match[2] }), match[3], el("span", { className: "tok-value", textContent: match[4] }));
    last = match.index + match[0].length;
  }
  code.append(text.slice(last));
}

function renderDrawer(name: IconName) {
  const { label, category, tags } = byName(name);
  $("[data-d-category]").textContent = category;
  $("[data-d-label]").textContent = label;
  $("[data-d-name]").textContent = name;

  for (const target of [preview, ...ladderIcons]) {
    target.setAttribute("name", name);
    target.setAttribute("color", state.color);
    if (state.reduced) target.setAttribute("motion", "reduced");
    else target.removeAttribute("motion");
  }
  preview.setAttribute("label", label);
  preview.setAttribute("animation", state.animation);
  stageView.dataset.stage = state.stage;
  $$<HTMLButtonElement>("[data-stage]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.stage === state.stage)));

  tagsHost.replaceChildren(
    ...[category, ...tags].map((tag) => el("button", { className: "tag", type: "button", textContent: tag }, { "data-tag": tag, title: `Search “${tag}”` })),
  );
  codeTabs.forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.tab === state.tab));
    tab.tabIndex = tab.dataset.tab === state.tab ? 0 : -1;
  });
  renderCode();
}

/* ---------- Render ---------- */

function update() {
  explorer.style.setProperty("--icon-color", state.color);
  explorer.style.setProperty("--lumi-icon-size", `${state.size}px`);
  swatchButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.swatch === state.color)));
  customColor.value = state.color;
  customColor.parentElement!.classList.toggle("active", !swatches.some((swatch) => swatch.color === state.color));
  sizeInput.value = String(state.size);
  sizeOutput.textContent = `${state.size}px`;
  reducedInput.checked = state.reduced;
  leanInput.checked = state.lean;
  animationButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.animation === state.animation)));
  if (state.selected) renderDrawer(state.selected);
  save();
}

update();
syncToggleAll();

// A link like /#heart opens that icon's details.
function openFromHash() {
  let requested: string;
  try {
    requested = decodeURIComponent(location.hash.slice(1));
  } catch {
    return; // A malformed link such as /#%E0 must not stop the rest of the page from loading.
  }
  const name = resolveIconName(requested) as IconName | undefined;
  if (name && name !== state.selected) openDrawer(name);
}
openFromHash();
window.addEventListener("hashchange", openFromHash);

/* ---------- Platforms ---------- */

interface Platform {
  id: string;
  name: string;
  icon: IconName;
  /** Accent for the platform's chip and tab. */
  color: string;
  note: string;
  install: string;
  file: string;
  code: string;
}

const platforms: Platform[] = [
  {
    id: "html", name: "HTML", icon: "code", color: "#e34c26",
    note: "Any page, no build step: load the Web Component from a CDN (or install it for your bundler).",
    install: "npm i @lumi-icons/core", file: "index.html",
    code: `<script type="module" src="https://cdn.jsdelivr.net/npm/@lumi-icons/core/+esm"></script>

<lumi-icon name="rocket" size="48" animation="launch"></lumi-icon>`,
  },
  {
    id: "react", name: "React", icon: "atom", color: "#149eca",
    note: "A typed component with ref forwarding. Safe to import during server-side rendering (Next.js, Remix).",
    install: "npm i @lumi-icons/core @lumi-icons/react", file: "Launch.tsx",
    code: `import { LumiIcon } from "@lumi-icons/react";

export function Launch() {
  return <LumiIcon name="rocket" size={48} animation="launch" />;
}`,
  },
  {
    id: "vue", name: "Vue", icon: "leaf", color: "#42b883",
    note: "A Vue 3 component with typed props. Safe for SSR (Nuxt).",
    install: "npm i @lumi-icons/core @lumi-icons/vue", file: "Launch.vue",
    code: `<script setup lang="ts">
import { LumiIcon } from "@lumi-icons/vue";
</script>

<template>
  <LumiIcon name="rocket" :size="48" animation="launch" />
</template>`,
  },
  {
    id: "angular", name: "Angular", icon: "shield", color: "#dd0031",
    note: "A standalone component with typed signal inputs. No CUSTOM_ELEMENTS_SCHEMA needed.",
    install: "npm i @lumi-icons/core @lumi-icons/angular", file: "launch.component.ts",
    code: `import { Component } from "@angular/core";
import { LumiIconComponent } from "@lumi-icons/angular";

@Component({
  selector: "app-launch",
  imports: [LumiIconComponent],
  template: \`<lumi-icon name="rocket" [size]="48" animation="launch" />\`,
})
export class LaunchComponent {}`,
  },
  {
    id: "react-native", name: "React Native", icon: "phone", color: "#0e9fc7",
    note: "A native renderer: the same icons drawn with react-native-svg, animated on the UI thread. Follows the OS reduce-motion setting.",
    install: "npm i @lumi-icons/core @lumi-icons/react-native react-native-svg", file: "Launch.tsx",
    code: `import { LumiIcon } from "@lumi-icons/react-native";

export function Launch() {
  return <LumiIcon name="rocket" size={48} color="#6a4dd8" animation="launch" />;
}`,
  },
  {
    id: "svelte", name: "Svelte & more", icon: "flame", color: "#ff3e00",
    note: "Svelte, Solid, Lit, Astro, and any other framework that renders custom elements use the Web Component directly.",
    install: "npm i @lumi-icons/core", file: "Launch.svelte",
    code: `<script>
  import "@lumi-icons/core";
</script>

<lumi-icon name="rocket" size="48" animation="launch"></lumi-icon>`,
  },
];

const platformTabs = $("[data-platform-tabs]");
const platformPanel = $("[data-platform-panel]");
let activePlatform = platforms[0];

const platformTabButtons = platforms.map((platform) => {
  const tab = el("button", { className: "platform-tab", type: "button", id: `platform-tab-${platform.id}` }, { role: "tab", "aria-controls": "platform-panel" });
  tab.style.setProperty("--platform", platform.color);
  tab.append(icon(platform.icon, 22), el("span", { textContent: platform.name }));
  tab.addEventListener("click", () => selectPlatform(platform));
  platformTabs.append(tab);
  return tab;
});
platformPanel.id = "platform-panel";

// Arrow keys move between tabs, per the ARIA tabs pattern.
platformTabs.addEventListener("keydown", (event) => {
  const index = platforms.indexOf(activePlatform);
  const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: platforms.length - 1 }[event.key];
  if (next === undefined) return;
  event.preventDefault();
  selectPlatform(platforms[(next + platforms.length) % platforms.length], { focus: true });
});

function selectPlatform(platform: Platform, { focus = false } = {}) {
  activePlatform = platform;
  platformTabButtons.forEach((tab, index) => {
    const selected = platforms[index] === platform;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  platformPanel.setAttribute("aria-labelledby", `platform-tab-${platform.id}`);
  platformPanel.style.setProperty("--platform", platform.color);
  $("[data-platform-note]").textContent = platform.note;
  $("[data-platform-install-text]").textContent = platform.install;
  $("[data-platform-file]").textContent = platform.file;
  $("[data-platform-code]").textContent = platform.code;
}
$("[data-platform-install]").addEventListener("click", () => copy(activePlatform.install, "install command"));
$("[data-platform-copy]").addEventListener("click", () => copy(activePlatform.code, `${activePlatform.name} example`));
selectPlatform(activePlatform);

// "Works with" chips in the hero jump to that platform's tab.
const platformChips = $("[data-platform-chips]");
for (const platform of platforms) {
  const link = el("a", { className: "platform-chip", href: "#usage" });
  link.style.setProperty("--platform", platform.color);
  link.append(icon(platform.icon, 18), el("span", { textContent: platform.name }));
  link.addEventListener("click", () => selectPlatform(platform));
  const item = el("li");
  item.append(link);
  platformChips.append(item);
}

/* ---------- Hero light table ---------- */

// 32 tiles around the 2×2 logo in a 6×6 grid.
const heroIcons: IconName[] = [
  "rocket", "heart", "star", "bell", "camera", "palette",
  "compass", "wand", "bulb", "trophy", "chat", "globe",
  "sparkles", "music", "gem", "pizza",
  "gamepad", "zap", "cloudSun", "leaf",
  "bot", "crown", "headphones", "mail", "cart", "flame",
  "calendar", "lock", "folder", "chart", "coffee", "gift",
];
// Icons that have a motion that suits them; the rest float.
const heroMotion: Partial<Record<IconName, IconAnimation>> = {
  rocket: "launch", bell: "ring", heart: "pulse", star: "sparkle", sparkles: "sparkle", gem: "sparkle",
  compass: "tilt", globe: "spin", zap: "pulse", trophy: "tilt", crown: "sparkle", flame: "pulse",
};
const heroColors = swatches.slice(0, 6).map((swatch) => swatch.color);

const hero = $("[data-hero]");
const heroGrid = $("[data-hero-grid]");
const heroHint = $("[data-hero-hint]");
const heroTiles = heroIcons.map((name) => {
  const tile = el("button", { className: "hero-tile", type: "button", tabIndex: -1, title: byName(name).label });
  const glyph = icon(name);
  tile.append(glyph);
  // The stage is aria-hidden, so focus should not be sent back into it when the drawer closes.
  tile.addEventListener("click", () => { returnFocus = null; openDrawer(name); });
  heroGrid.append(tile);
  return { tile, glyph, name, x: 0, y: 0, lit: -1, moving: false };
});

const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const light = { x: 0, y: 0, targetX: 0, targetY: 0, radius: 0 };
let pointer: { x: number; y: number } | null = null;
let heroVisible = true;
let frame = 0;

// Tile centers in grid pixels. offsetLeft/Top ignore the lift transform, so lit tiles don't shift their own center.
function measureHero() {
  const cell = heroGrid.clientWidth / 6;
  for (const tile of heroTiles) {
    tile.x = tile.tile.offsetLeft + tile.tile.offsetWidth / 2;
    tile.y = tile.tile.offsetTop + tile.tile.offsetHeight / 2;
    // Colors run diagonally (+1 per column, +2 per row), so no two neighbours share one.
    const column = Math.floor(tile.x / cell);
    const row = Math.floor(tile.y / cell);
    tile.tile.style.setProperty("--tile-color", heroColors[(column + row * 2) % heroColors.length]);
  }
  light.radius = heroGrid.clientWidth * 0.42;
}

function renderHero() {
  hero.style.setProperty("--lx", `${heroGrid.offsetLeft + light.x}px`);
  hero.style.setProperty("--ly", `${heroGrid.offsetTop + light.y}px`);
  for (const tile of heroTiles) {
    const raw = Math.max(0, 1 - Math.hypot(tile.x - light.x, tile.y - light.y) / light.radius);
    const lit = raw * raw * (3 - 2 * raw); // smoothstep: a soft edge to the beam
    if (Math.abs(lit - tile.lit) > 0.005) {
      tile.lit = lit;
      tile.tile.style.setProperty("--lit", lit.toFixed(3));
    }
    // Only touch the animation attribute when it changes, not every frame.
    const moving = lit > 0.55 && !motionQuery.matches;
    if (moving !== tile.moving) {
      tile.moving = moving;
      if (moving) tile.glyph.setAttribute("animation", heroMotion[tile.name] ?? "float");
      else tile.glyph.removeAttribute("animation");
    }
  }
}

function tick(time: number) {
  frame = 0;
  if (!pointer) {
    // Idle: the beam wanders on a slow Lissajous path.
    const w = heroGrid.clientWidth;
    const h = heroGrid.clientHeight;
    light.targetX = w * (0.5 + 0.38 * Math.sin(time * 0.00042));
    light.targetY = h * (0.5 + 0.36 * Math.sin(time * 0.00067 + 1.2));
  }
  light.x += (light.targetX - light.x) * 0.08;
  light.y += (light.targetY - light.y) * 0.08;
  renderHero();
  if (heroVisible && !document.hidden) frame = requestAnimationFrame(tick);
}

function startHero() {
  if (motionQuery.matches) {
    // Still mode: no wandering or easing. The light sits where it was put.
    cancelAnimationFrame(frame);
    frame = 0;
    light.x = light.targetX;
    light.y = light.targetY;
    renderHero();
    return;
  }
  if (!frame && heroVisible && !document.hidden) frame = requestAnimationFrame(tick);
}

function pointAt(event: PointerEvent) {
  const rect = heroGrid.getBoundingClientRect();
  pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  light.targetX = pointer.x;
  light.targetY = pointer.y;
  heroHint.classList.add("hidden");
  startHero();
}
hero.addEventListener("pointermove", pointAt);
hero.addEventListener("pointerdown", pointAt);
hero.addEventListener("pointerleave", () => { pointer = null; startHero(); });

new ResizeObserver(() => { measureHero(); startHero(); }).observe(heroGrid);
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; startHero(); }).observe(hero);
document.addEventListener("visibilitychange", startHero);
motionQuery.addEventListener("change", startHero);

measureHero();
light.x = light.targetX = heroGrid.clientWidth / 2;
light.y = light.targetY = heroGrid.clientHeight * 0.3;
heroHint.textContent = matchMedia("(hover: hover)").matches ? "Move your cursor to light them up" : "Tap an icon to explore it";
startHero();
