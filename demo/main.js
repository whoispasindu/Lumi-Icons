import { iconAnimations, iconCategories, iconNames, icons } from "@lumi-icons/core";
import logo from "../brand/logo.svg";
import pkg from "../package.json";
import { features, runChecks } from "./checks.js";

const $ = (selector) => document.querySelector(selector);
const titleCase = (value) => value[0].toUpperCase() + value.slice(1);

function iconElement(name, attributes = {}) {
  const element = document.createElement("lumi-icon");
  element.setAttribute("name", name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
}

function labelled(element, text) {
  const item = document.createElement("div");
  item.className = "sample";
  const caption = document.createElement("span");
  caption.textContent = text;
  item.append(element, caption);
  return item;
}

// The logo lives outside this folder, so it comes through Vite rather than a relative URL.
$("[data-logo]").src = logo;
$("[data-favicon]").href = logo;

/* ---------- Theme ---------- */

const root = document.documentElement;
const themeButton = $("[data-theme-toggle]");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
function syncThemeIcon() { themeButton.firstElementChild.setAttribute("name", isDark() ? "sun" : "moon"); }
themeButton.addEventListener("click", () => {
  root.dataset.theme = isDark() ? "light" : "dark";
  syncThemeIcon();
});
syncThemeIcon();

/* ---------- Toast ---------- */

const toast = $("[data-toast]");
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copy(text, what) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied ${what}`);
  } catch {
    showToast("Copying is blocked here; select the text instead");
  }
}

/* ---------- Health check ---------- */

const sandbox = $("[data-sandbox]");
const checkList = $("[data-checks]");
const summary = $("[data-summary]");
let lastReport = "";

const statusIcon = { pass: "check", fail: "close", skip: "minus" };

function renderFeatures() {
  const host = $("[data-features]");
  host.replaceChildren(...features().map(({ name, value, note }) => {
    const chip = document.createElement("span");
    chip.className = `feature ${value ? "on" : "off"}`;
    chip.title = note;
    chip.textContent = `${name}: ${value ? "yes" : "no"}`;
    return chip;
  }));
}

async function health() {
  summary.textContent = "Running checks…";
  summary.className = "summary";
  const started = performance.now();
  const results = await runChecks(sandbox);
  const ms = Math.round(performance.now() - started);

  checkList.replaceChildren(...results.map(({ name, status, detail }) => {
    const item = document.createElement("li");
    item.className = `check ${status}`;
    const title = document.createElement("strong");
    title.textContent = name;
    const text = document.createElement("span");
    text.textContent = detail ?? "";
    item.append(iconElement(statusIcon[status], { size: 20, label: status }), title, text);
    return item;
  }));

  const failed = results.filter((result) => result.status === "fail").length;
  const passed = results.filter((result) => result.status === "pass").length;
  summary.textContent = failed
    ? `${failed} of ${results.length} checks failed in this browser.`
    : `All ${passed} checks passed in this browser${passed < results.length ? ` (${results.length - passed} skipped)` : ""}. Took ${ms} ms.`;
  summary.className = `summary ${failed ? "bad" : "good"}`;

  lastReport = [
    `Lumi Icons ${pkg.version} health check`,
    `Browser: ${navigator.userAgent}`,
    `Screen: ${screen.width}×${screen.height} @${devicePixelRatio}x`,
    "",
    ...results.map(({ name, status, detail }) => `[${status.toUpperCase()}] ${name}${detail ? ` — ${detail}` : ""}`),
    "",
    ...features().map(({ name, value }) => `${name}: ${value ? "yes" : "no"}`),
  ].join("\n");
}

$("[data-rerun]").addEventListener("click", health);
$("[data-copy-report]").addEventListener("click", () => copy(lastReport, "the report"));

/* ---------- Showcase ---------- */

const animationIcons = { float: "cloud", spin: "settings", pulse: "heart", ring: "bell", launch: "rocket", sparkle: "sparkles", tilt: "cube" };
$("[data-animations]").append(
  ...Object.entries(animationIcons).map(([animation, name]) => labelled(iconElement(name, { size: 40, animation }), animation)),
);
$("[data-sizes]").append(...[16, 24, 32, 48, 64, 96].map((size) => labelled(iconElement("star", { size }), `${size}px`)));
$("[data-colors]").append(
  ...["#6a4dd8", "#e5484d", "#f76b15", "#ffb224", "#30a46c", "#0090ff"].map((color) => labelled(iconElement("palette", { size: 40, color }), color)),
);

/* ---------- All icons ---------- */

const grid = $("[data-grid]");
const search = $("[data-search]");
const category = $("[data-category]");
const animation = $("[data-animation]");
const size = $("[data-size]");
const color = $("[data-color]");

category.append(...iconCategories.map((value) => new Option(titleCase(value), value)));
animation.append(...iconAnimations.map((value) => new Option(titleCase(value), value)));

const tiles = iconNames.map((name) => {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tile";
  button.title = icons[name].label;
  const caption = document.createElement("span");
  caption.textContent = name;
  button.append(iconElement(name), caption);
  button.addEventListener("click", () => copy(`<lumi-icon name="${name}"></lumi-icon>`, `<lumi-icon name="${name}">`));
  item.append(button);
  return { item, icon: button.firstElementChild, text: [name, icons[name].label, ...icons[name].tags].join(" ").toLowerCase(), category: icons[name].category };
});
grid.append(...tiles.map((tile) => tile.item));

function filter() {
  const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let shown = 0;
  for (const tile of tiles) {
    const visible = (!category.value || tile.category === category.value) && words.every((word) => tile.text.includes(word));
    tile.item.hidden = !visible;
    if (visible) shown++;
  }
  $("[data-count]").textContent = `${shown} of ${tiles.length}`;
  $("[data-empty]").hidden = shown > 0;
}

function style() {
  grid.style.setProperty("--lumi-icon-size", `${size.value}px`);
  grid.style.color = color.value;
  $("[data-size-out]").textContent = size.value;
  for (const tile of tiles) {
    if (animation.value === "none") tile.icon.removeAttribute("animation");
    else tile.icon.setAttribute("animation", animation.value);
  }
}

search.addEventListener("input", filter);
category.addEventListener("change", filter);
for (const control of [animation, size, color]) control.addEventListener("input", style);
filter();
style();

/* ---------- Start ---------- */

$("[data-meta]").textContent = `@lumi-icons/core ${pkg.version} · ${iconNames.length} icons · ${iconCategories.length} categories`;
renderFeatures();
health();
