import { icons, resolveIconName } from "../src";
import { iconAnimations, iconCategories, iconNames, type IconAnimation, type IconCategory, type IconName } from "../src/types";
import "./style.css";

type Stage = "light" | "dark" | "tint";
type CodeTab = "html" | "react" | "vue";

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
  returnFocus?.focus();
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
$("[data-copy-code]").addEventListener("click", () => copy(snippet(), `${state.tab === "html" ? "HTML" : titleCase(state.tab)} snippet`));

function snippet() {
  const { selected, animation, color, size, reduced, tab } = state;
  const attrs: [string, string | number][] = [["name", selected ?? "rocket"], ["size", size], ["color", color]];
  if (animation !== "none") attrs.push(["animation", animation]);
  if (reduced) attrs.push(["motion", "reduced"]);
  const format = ([key, value]: [string, string | number]) => {
    if (typeof value === "number" && tab === "react") return `${key}={${value}}`;
    if (typeof value === "number" && tab === "vue") return `:${key}="${value}"`;
    return `${key}="${value}"`;
  };
  const body = attrs.map(format).join(" ");
  return tab === "html" ? `<lumi-icon ${body}></lumi-icon>` : `<LumiIcon ${body} />`;
}

/** Renders the snippet as highlighted DOM nodes (textContent only, no markup parsing). */
function renderCode() {
  code.replaceChildren();
  const pattern = /(<\/?[\w-]+|\/?>)|([:\w-]+)(=)("[^"]*"|\{[^}]*\})|(\s+)/g;
  for (const match of snippet().matchAll(pattern)) {
    if (match[1]) code.append(el("span", { className: "tok-tag", textContent: match[1] }));
    else if (match[2]) code.append(el("span", { className: "tok-attr", textContent: match[2] }), match[3], el("span", { className: "tok-value", textContent: match[4] }));
    else code.append(match[5] ?? "");
  }
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
  animationButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.animation === state.animation)));
  if (state.selected) renderDrawer(state.selected);
  save();
}

update();
syncToggleAll();

// A link like /#heart opens that icon's details.
function openFromHash() {
  const name = resolveIconName(decodeURIComponent(location.hash.slice(1)));
  if (name && name !== state.selected) openDrawer(name);
}
openFromHash();
window.addEventListener("hashchange", openFromHash);
