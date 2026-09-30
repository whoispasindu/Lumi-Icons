import { iconNames, type IconCategory, type IconDefinition, type IconName } from "./types.js";

const edge = `fill="none" stroke="currentColor" stroke-opacity=".78" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"`;
const svg = (paths: string) => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
const shadow = `<ellipse cx="13" cy="20.6" rx="7.2" ry="1.25" fill="currentColor" opacity=".13"/>`;
const top = `fill="currentColor" opacity=".50"`;
const front = `fill="currentColor" opacity=".88"`;
const side = `fill="currentColor" opacity=".30"`;
const shine = `fill="#fff" opacity=".34"`;

type Spec = { label: string; category: IconCategory; tags?: string[] };
type CoreSpec = Spec & { svg: string };
type GlyphSpec = Spec & { glyph: string };

// Every icon uses a projected shadow and at least two deliberately separated planes.
const coreIcons = {
  cube: { label: "Cube", category: "objects", tags: ["3d", "block"], svg: svg(`${shadow}<path d="m4 7.2 8-4.3 8 4.3-8 4.4Z" ${top}/><path d="m4 7.2 8 4.4V21l-8-4.4Z" ${front}/><path d="m12 11.6 8-4.4v9.4L12 21Z" ${side}/><path d="m4 7.2 8-4.3 8 4.3-8 4.4Zm8 4.4V21m8-13.8v9.4L12 21 4 16.6V7.2" ${edge}/><path d="m6.1 7.1 5.9-3.2 2.1 1.1-5.9 3.2Z" ${shine}/>` ) },
  box: { label: "Box", category: "objects", tags: ["package", "shipping"], svg: svg(`${shadow}<path d="M3.3 7.5 12 3l8.7 4.5-8.7 4.3Z" ${top}/><path d="m3.3 7.5 8.7 4.3V21l-8.7-4.5Z" ${front}/><path d="m12 11.8 8.7-4.3v9L12 21Z" ${side}/><path d="m3.3 7.5L12 3l8.7 4.5-8.7 4.3Zm0 0v9L12 21l8.7-4.5v-9M12 11.8V21m-4.7-14 8.7 4.5" ${edge}/><path d="m8.2 5 6.2 3.2-1.8.9-6.2-3.2Z" ${shine}/>` ) },
  rocket: { label: "Rocket", category: "objects", tags: ["launch", "startup", "deploy"], svg: svg(`${shadow}<path d="M12.8 3.1c4.7.2 7.4 2.7 7.7 6.8-1.9 3.6-5.2 6.9-9.7 8.8l-3.8-3.8c1.8-4.5 5.2-8 5.8-11.8Z" ${front}/><path d="M20.5 9.9c-.3 4.1-3.1 6.9-7.2 9l-2.5-2.5c4.5-2 7.8-5.3 9.7-8.5Z" ${side}/><path d="M12.8 3.1c4.7.2 7.4 2.7 7.7 6.8l-3.7 1.3-4-4Z" ${top}/><circle cx="15.4" cy="8.7" r="1.75" ${shine}/><circle cx="15.4" cy="8.7" r="1.75" ${edge}/><path d="m7.1 14.2-3.3.2 3.6 3.6.2-3.3m3.3 3.3-.2 3.3-3.6-3.6 3.3-.2M12.8 3.1c4.7.2 7.4 2.7 7.7 6.8-1.9 3.6-5.2 6.9-9.7 8.8l-3.8-3.8c1.8-4.5 5.2-8 5.8-11.8Z" ${edge}/>` ) },
  heart: { label: "Heart", category: "feedback", tags: ["like", "love", "favorite"], svg: svg(`${shadow}<path d="M20 8.4c0 4.9-8 9.9-8 9.9s-8-5-8-9.9A4.1 4.1 0 0 1 12 7a4.1 4.1 0 0 1 8 1.4Z" ${side}/><path d="M19 7.1c0 4.9-7.6 9.8-7.6 9.8S3.8 12 3.8 7.1a4.2 4.2 0 0 1 7.6-2.5A4.2 4.2 0 0 1 19 7.1Z" ${front}/><path d="M5 6.2a3 3 0 0 1 5.4-1.2l1 1.4-1.9 2.3L5 7.7Z" ${shine}/><path d="M19 7.1c0 4.9-7.6 9.8-7.6 9.8S3.8 12 3.8 7.1a4.2 4.2 0 0 1 7.6-2.5A4.2 4.2 0 0 1 19 7.1Z" ${edge}/>` ) },
  star: { label: "Star", category: "feedback", tags: ["favorite", "rating"], svg: svg(`${shadow}<path d="m12.8 4 2.4 5 5.5.8-4 3.9.9 5.5-5.3-2.8-5.3 2.8.9-5.5-4-3.9 5.5-.8Z" ${side}/><path d="m12 2.7 2.5 5.2 5.7.8-4.1 4 .9 5.7-5-2.7-5 2.7.9-5.7-4.1-4 5.7-.8Z" ${front}/><path d="m12 2.7 2.5 5.2-2.5 1.4-2.5-1.4Z" ${shine}/><path d="m12 2.7 2.5 5.2 5.7.8-4.1 4 .9 5.7-5-2.7-5 2.7.9-5.7-4.1-4 5.7-.8Z" ${edge}/>` ) },
  bell: { label: "Bell", category: "communication", tags: ["notification", "alert"], svg: svg(`${shadow}<path d="M6.3 16.3V10a5.7 5.7 0 0 1 11.4 0v6.3l1.7 2.4H4.6Z" ${side}/><path d="M5 15V9.3a5.8 5.8 0 0 1 11.6 0V15l1.7 2.4H3.3Z" ${front}/><path d="M8.2 5.2a5.8 5.8 0 0 1 7.2 2.2L13 9.2 8.2 7.4Z" ${top}/><path d="M9.5 20h5" ${edge}/><path d="M5 15V9.3a5.8 5.8 0 0 1 11.6 0V15l1.7 2.4H3.3Zm4.5 5h5" ${edge}/>` ) },
  camera: { label: "Camera", category: "media", tags: ["photo"], svg: svg(`${shadow}<path d="m6.2 7.7 2-3h7.1l1.8 3h2.2v10.5H6.2Z" ${top}/><path d="M3.2 8.8h16.1v9.4a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2Z" ${front}/><path d="m19.3 8.8 1.5-1v9.2a2 2 0 0 1-1.5 2Z" ${side}/><circle cx="11.4" cy="14.4" r="3.7" fill="#fff" opacity=".26"/><circle cx="11.4" cy="14.4" r="3.7" ${edge}/><circle cx="11.4" cy="14.4" r="1.8" fill="currentColor" opacity=".55"/><path d="m6.2 7.7 2-3h7.1l1.8 3h2.2v10.5H5.2a2 2 0 0 1-2-2V8.8h16.1l1.5-1v9.2a2 2 0 0 1-1.5 2" ${edge}/>` ) },
  palette: { label: "Palette", category: "design", tags: ["color", "design", "theme"], svg: svg(`${shadow}<path d="M13 4a8.5 8.5 0 1 1 0 17h1.1c1.7 0 2.4-2.2 1-3.2-.6-.4-.3-1.4.5-1.4h1.8A3.6 3.6 0 0 0 21 12c0-4.8-3.6-8-8-8Z" ${side}/><path d="M12 3a8.5 8.5 0 1 0 0 17h1.1c1.7 0 2.4-2.2 1-3.2-.6-.4-.3-1.4.5-1.4h1.8A3.6 3.6 0 0 0 20 11.7C20 6.9 16.4 3 12 3Z" ${front}/><circle cx="7.5" cy="10.7" r="1.15" fill="#fff" opacity=".65"/><circle cx="10.2" cy="7.3" r="1.15" fill="currentColor" opacity=".35"/><circle cx="14.7" cy="7.8" r="1.15" fill="currentColor" opacity=".35"/><path d="M12 3a8.5 8.5 0 1 0 0 17h1.1c1.7 0 2.4-2.2 1-3.2-.6-.4-.3-1.4.5-1.4h1.8A3.6 3.6 0 0 0 20 11.7C20 6.9 16.4 3 12 3Z" ${edge}/>` ) },
  compass: { label: "Compass", category: "travel", tags: ["explore", "direction"], svg: svg(`${shadow}<circle cx="13" cy="13" r="8.3" ${side}/><circle cx="12" cy="11.8" r="8.3" ${front}/><circle cx="12" cy="11.8" r="6.6" fill="#fff" opacity=".18"/><path d="m15.9 7.9-2.3 5.7-5.7 2.3 2.3-5.7Z" fill="#fff" opacity=".75"/><path d="m15.9 7.9-2.3 5.7-5.7 2.3 2.3-5.7Z" ${edge}/><circle cx="12" cy="11.8" r="8.3" ${edge}/>` ) },
  wand: { label: "Magic wand", category: "objects", tags: ["magic", "ai", "auto"], svg: svg(`${shadow}<path d="m12.7 11.5 1.9 1.9-8.1 8.1-2-2Z" ${side}/><path d="m11.5 10.3 1.9 1.9-8.1 8.1-2-2Z" ${front}/><path d="m11.5 10.3 1.9 1.9m-10.1 6.1 2 2 8.1-8.1-1.9-1.9Zm10.4-5.8v4m2-2h-4M6 3.8v3m1.5-1.5h-3m12 10v4m2-2h-4" ${edge}/><path d="m7.4 15.8 1.1 1.1-3.3 3.3-1.1-1.1Z" ${shine}/>` ) },
  folder: { label: "Folder", category: "files", tags: ["directory"], svg: svg(`${shadow}<path d="M4.3 7.1h6l1.9 2.1h7.5v9.4H4.3Z" ${side}/><path d="M3 8.3h17.3v8.6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" ${front}/><path d="M3 8.3 5.1 5h5.2l2 2.1h6.1l1.9 1.2Z" ${top}/><path d="M3 8.3 5.1 5h5.2l2 2.1h6.1l1.9 1.2v8.6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm0 0h17.3" ${edge}/>` ) },
  calendar: { label: "Calendar", category: "time", tags: ["date", "schedule"], svg: svg(`${shadow}<path d="M5.3 5.5h14v14H5.3Z" ${side}/><rect x="3.5" y="4" width="14" height="15" rx="1.8" ${front}/><path d="M3.5 8.5h14V5.8a1.8 1.8 0 0 0-1.8-1.8H5.3a1.8 1.8 0 0 0-1.8 1.8Z" ${top}/><path d="M7 2.7v3M14 2.7v3M3.5 8.5h14m-10 3.2h2m3 0h2m-7 3.5h2m3 0h2" ${edge}/><rect x="3.5" y="4" width="14" height="15" rx="1.8" ${edge}/>` ) },
  lock: { label: "Lock", category: "security", tags: ["security", "private", "password"], svg: svg(`${shadow}<path d="M6.4 10.3h11.2v9.4H6.4Z" ${side}/><rect x="4.4" y="9" width="11.2" height="9.4" rx="1.8" ${front}/><path d="M6.5 9V6.8a3.5 3.5 0 0 1 7 0V9" ${top}/><path d="M10 12.5v2.5" ${edge}/><circle cx="10" cy="12.3" r="1" fill="#fff" opacity=".6"/><rect x="4.4" y="9" width="11.2" height="9.4" rx="1.8" ${edge}/><path d="M6.5 9V6.8a3.5 3.5 0 0 1 7 0V9" ${edge}/>` ) },
  globe: { label: "Globe", category: "communication", tags: ["world", "web", "language"], svg: svg(`${shadow}<circle cx="13" cy="13" r="8.3" ${side}/><circle cx="12" cy="11.7" r="8.3" ${front}/><ellipse cx="12" cy="11.7" rx="3.4" ry="8.3" fill="#fff" opacity=".17"/><path d="M3.7 11.7h16.6M5.3 6.7h13.4M5.3 16.7h13.4" ${edge}/><circle cx="12" cy="11.7" r="8.3" ${edge}/><ellipse cx="12" cy="11.7" rx="3.4" ry="8.3" ${edge}/>` ) },
  mail: { label: "Mail", category: "communication", tags: ["email", "envelope", "inbox"], svg: svg(`${shadow}<path d="M5.2 7.7h14.3v10H5.2Z" ${side}/><path d="M3.3 6h14.3v10a2 2 0 0 1-2 2H5.3a2 2 0 0 1-2-2Z" ${front}/><path d="m3.3 6 7.1 5.4L17.6 6" ${top}/><path d="m3.3 16 5.4-4.7m8.9 4.7-5.4-4.7M3.3 6h14.3v10a2 2 0 0 1-2 2H5.3a2 2 0 0 1-2-2Z" ${edge}/><path d="m3.3 6 7.1 5.4L17.6 6" ${edge}/>` ) },
  bulb: { label: "Light bulb", category: "objects", tags: ["idea", "tip"], svg: svg(`${shadow}<path d="M9 16.4h6v3H9Z" ${side}/><path d="M7.4 10.2a4.6 4.6 0 1 1 8.1 3c-1 1-1.8 1.8-1.8 3.2H10c0-1.3-.8-2.3-1.7-3.2a4.5 4.5 0 0 1-.9-3Z" ${front}/><path d="M8.3 7.1a4.6 4.6 0 0 1 6.7 3.8l-2.4 1.2-4.3-2.5Z" ${shine}/><path d="M9.2 19.4h5.1M10 21h3.5M7.4 10.2a4.6 4.6 0 1 1 8.1 3c-1 1-1.8 1.8-1.8 3.2H10c0-1.3-.8-2.3-1.7-3.2a4.5 4.5 0 0 1-.9-3Z" ${edge}/>` ) },
  trophy: { label: "Trophy", category: "objects", tags: ["award", "win", "achievement"], svg: svg(`${shadow}<path d="M9.2 15.4h6v3.4H9.2Z" ${side}/><path d="M7.3 4.2h8.4v5.1c0 3-1.7 5.5-4.2 5.5s-4.2-2.5-4.2-5.5Z" ${front}/><path d="M7.3 5.4H4.5v2.4c0 2.2 1.3 3.8 3.5 4.1m7.7-6.5h2.8v2.4c0 2.2-1.3 3.8-3.5 4.1M11.5 14.8v3.6m-3.7.2h7.4" ${edge}/><path d="M7.3 4.2h8.4l-2.1 2.2H9.4Z" ${top}/><path d="M7.3 4.2h8.4v5.1c0 3-1.7 5.5-4.2 5.5s-4.2-2.5-4.2-5.5Z" ${edge}/>` ) },
  cart: { label: "Cart", category: "commerce", tags: ["shop", "checkout", "basket"], svg: svg(`${shadow}<path d="m5.7 6.8 1.9 9.2h9.7l1.8-6.9H7" ${side}/><path d="m3.5 5.1h2.2l1.9 9.2h9.7l1.8-6.9H7" ${front}/><path d="m7 7.4 11.9-.1-1.6 2.2H7.5Z" ${top}/><circle cx="8.6" cy="18.9" r="1.3" fill="currentColor" opacity=".62"/><circle cx="16.3" cy="18.9" r="1.3" fill="currentColor" opacity=".34"/><path d="m3.5 5.1h2.2l1.9 9.2h9.7l1.8-6.9H7m1.6 14.5h.01m7.7 0h.01" ${edge}/>` ) },
  chart: { label: "Chart", category: "commerce", tags: ["analytics", "graph", "stats"], svg: svg(`${shadow}<path d="M5.5 5.5h14v14h-14Z" ${side}/><path d="M3.5 4h14v14h-14Z" ${front}/><path d="m5.8 14.8 3.1-3 2.7 1.7 3.5-5" ${edge}/><path d="M3.5 4h14l2 1.5H5.5Z" ${top}/><path d="M3.5 4h14v14h-14Z" ${edge}/><circle cx="5.8" cy="14.8" r=".9" fill="#fff" opacity=".75"/><circle cx="11.6" cy="13.5" r=".9" fill="#fff" opacity=".75"/><circle cx="15.1" cy="8.5" r=".9" fill="#fff" opacity=".75"/>` ) },
  chat: { label: "Chat", category: "communication", tags: ["message", "comment"], svg: svg(`${shadow}<path d="M6.2 5.8h14v10.1H10l-4.5 3.2.7-3.2Z" ${side}/><path d="M3.8 4h14v10.1H7.6L3.1 17.3l.7-3.2Z" ${front}/><path d="M6.4 7.1h8.8M6.4 10.3h5.9" ${edge}/><path d="M3.8 4h14v10.1H7.6L3.1 17.3l.7-3.2Z" ${edge}/><path d="M5.4 5.7h6.5" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" stroke-linecap="round"/>` ) },
} satisfies Record<string, CoreSpec>;


const glyphSpecs = {
  home: { label: "Home", category: "interface", tags: ["house", "start"], glyph: `<path d="m4 11 8-6 8 6v8H4Z"/><path d="M9 19v-5h6v5"/>` },
  user: { label: "User", category: "people", tags: ["person", "account", "profile"], glyph: `<circle cx="12" cy="9" r="3"/><path d="M6.5 19c.5-3.2 2.3-5 5.5-5s5 1.8 5.5 5"/>` },
  users: { label: "Users", category: "people", tags: ["team", "group", "people"], glyph: `<circle cx="9" cy="9" r="2.5"/><circle cx="16" cy="10" r="2"/><path d="M4.5 19c.5-3.2 2-5 4.5-5s4 1.8 4.5 5m.7-4.3c2.6.2 4.1 1.6 4.5 4.3"/>` },
  settings: { label: "Settings", category: "interface", tags: ["gear", "preferences", "cog"], glyph: `<circle cx="12" cy="12" r="2.8"/><path d="m12 5 1 1.7 2-.1.8 1.8 1.8.8-.1 2 1.7 1-1.7 1 .1 2-1.8.8-.8 1.8-2-.1-1 1.7-1-1.7-2 .1-.8-1.8-1.8-.8.1-2-1.7-1 1.7-1-.1-2 1.8-.8.8-1.8 2 .1Z"/>` },
  search: { label: "Search", category: "interface", tags: ["find", "magnifier"], glyph: `<circle cx="10.5" cy="10.5" r="4.5"/><path d="m14 14 4 4"/>` },
  menu: { label: "Menu", category: "interface", tags: ["hamburger", "navigation"], glyph: `<path d="M6 8h12M6 12h12M6 16h12"/>` },
  close: { label: "Close", category: "interface", tags: ["x", "dismiss", "cancel"], glyph: `<path d="m7 7 10 10M17 7 7 17"/>` },
  plus: { label: "Plus", category: "interface", tags: ["add", "new"], glyph: `<path d="M12 6v12M6 12h12"/>` },
  minus: { label: "Minus", category: "interface", tags: ["remove", "subtract"], glyph: `<path d="M6 12h12"/>` },
  check: { label: "Check", category: "interface", tags: ["done", "confirm", "tick"], glyph: `<path d="m6 12 3.8 3.8L18 7.7"/>` },
  arrowUp: { label: "Arrow up", category: "arrows", glyph: `<path d="M12 18V6m-4 4 4-4 4 4"/>` },
  arrowDown: { label: "Arrow down", category: "arrows", glyph: `<path d="M12 6v12m4-4-4 4-4-4"/>` },
  arrowLeft: { label: "Arrow left", category: "arrows", tags: ["back"], glyph: `<path d="M18 12H6m4-4-4 4 4 4"/>` },
  arrowRight: { label: "Arrow right", category: "arrows", tags: ["next", "forward"], glyph: `<path d="M6 12h12m-4-4 4 4-4 4"/>` },
  chevronUp: { label: "Chevron up", category: "arrows", tags: ["collapse"], glyph: `<path d="m7 14 5-5 5 5"/>` },
  chevronDown: { label: "Chevron down", category: "arrows", tags: ["expand", "dropdown"], glyph: `<path d="m7 10 5 5 5-5"/>` },
  chevronLeft: { label: "Chevron left", category: "arrows", tags: ["previous"], glyph: `<path d="m14 7-5 5 5 5"/>` },
  chevronRight: { label: "Chevron right", category: "arrows", tags: ["next"], glyph: `<path d="m10 7 5 5-5 5"/>` },
  download: { label: "Download", category: "arrows", tags: ["save", "import"], glyph: `<path d="M12 5v9m-4-3 4 4 4-4M6 19h12"/>` },
  upload: { label: "Upload", category: "arrows", tags: ["export", "publish"], glyph: `<path d="M12 15V6m-4 4 4-4 4 4M6 19h12"/>` },
  play: { label: "Play", category: "media", tags: ["start", "video"], glyph: `<path d="m9 7 7 5-7 5Z" fill="#fff" stroke="none"/>` },
  pause: { label: "Pause", category: "media", glyph: `<path d="M9 7v10m6-10v10"/>` },
  stop: { label: "Stop", category: "media", glyph: `<rect x="8" y="8" width="8" height="8" rx="1" fill="#fff" stroke="none"/>` },
  refresh: { label: "Refresh", category: "interface", tags: ["reload", "sync", "retry"], glyph: `<path d="M17 9a5.5 5.5 0 1 0 .4 6M17 5v4h-4"/>` },
  trash: { label: "Trash", category: "interface", tags: ["delete", "remove", "bin"], glyph: `<path d="M7 8h10l-1 10H8Zm2-2h6m-4 4v5m2-5v5"/>` },
  edit: { label: "Edit", category: "interface", tags: ["pencil", "write", "rename"], glyph: `<path d="m7 17-1 1 1-4 7.5-7.5 3 3L10 17Zm5.5-8.5 3 3"/>` },
  copy: { label: "Copy", category: "interface", tags: ["duplicate", "clipboard"], glyph: `<rect x="8" y="7" width="9" height="10" rx="1"/><path d="M6 15H5V6a1 1 0 0 1 1-1h8"/>` },
  link: { label: "Link", category: "interface", tags: ["url", "chain"], glyph: `<path d="M10 14 8.5 15.5a3 3 0 0 1-4.2-4.2L7 8.6M14 10l1.5-1.5a3 3 0 1 1 4.2 4.2L17 15.4M9 12h6"/>` },
  externalLink: { label: "External link", category: "interface", tags: ["open", "new tab"], glyph: `<path d="M13 6h5v5m0-5-7 7M16 13v4H6V7h4"/>` },
  info: { label: "Info", category: "feedback", tags: ["about", "details"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M12 11v4m0-7h.01"/>` },
  warning: { label: "Warning", category: "feedback", tags: ["alert", "caution", "danger"], glyph: `<path d="M12 5 19 18H5Z"/><path d="M12 9v4m0 2h.01"/>` },
  help: { label: "Help", category: "feedback", tags: ["question", "support"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M10 10a2 2 0 1 1 3.4 1.4c-.9.8-1.4 1.2-1.4 2.6m0 2h.01"/>` },
  eye: { label: "Eye", category: "interface", tags: ["view", "show", "visible"], glyph: `<path d="M5 12s2.5-4 7-4 7 4 7 4-2.5 4-7 4-7-4-7-4Z"/><circle cx="12" cy="12" r="1.8"/>` },
  eyeOff: { label: "Eye off", category: "interface", tags: ["hide", "hidden", "invisible"], glyph: `<path d="M5 12s2.5-4 7-4c1.4 0 2.6.4 3.6.9M19 12s-2.5 4-7 4c-1.4 0-2.7-.4-3.7-1M5 5l14 14"/>` },
  bookmark: { label: "Bookmark", category: "interface", tags: ["save"], glyph: `<path d="M8 6h8v12l-4-2.5L8 18Z"/>` },
  flag: { label: "Flag", category: "interface", tags: ["report", "milestone"], glyph: `<path d="M7 19V6m0 1h9l-1.5 3L16 13H7"/>` },
  tag: { label: "Tag", category: "commerce", tags: ["label", "price"], glyph: `<path d="M6 8V6h6l6 6-4 4-6-6V8Z"/><circle cx="9" cy="9" r=".8" fill="#fff" stroke="none"/>` },
  filter: { label: "Filter", category: "interface", tags: ["funnel", "sort"], glyph: `<path d="M6 7h12l-4.5 5v4l-3 1v-5Z"/>` },
  sliders: { label: "Sliders", category: "interface", tags: ["adjust", "controls", "settings"], glyph: `<path d="M7 7h10M7 12h10M7 17h10"/><circle cx="10" cy="7" r="1.2"/><circle cx="14" cy="12" r="1.2"/><circle cx="9" cy="17" r="1.2"/>` },
  grid: { label: "Grid", category: "layout", tags: ["apps", "tiles"], glyph: `<rect x="7" y="7" width="4" height="4"/><rect x="13" y="7" width="4" height="4"/><rect x="7" y="13" width="4" height="4"/><rect x="13" y="13" width="4" height="4"/>` },
  list: { label: "List", category: "interface", tags: ["items", "bullets"], glyph: `<path d="M10 8h7M10 12h7M10 16h7"/><circle cx="7" cy="8" r=".6" fill="#fff" stroke="none"/><circle cx="7" cy="12" r=".6" fill="#fff" stroke="none"/><circle cx="7" cy="16" r=".6" fill="#fff" stroke="none"/>` },
  layout: { label: "Layout", category: "layout", tags: ["dashboard", "panels"], glyph: `<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M6 10h12M10 10v8"/>` },
  terminal: { label: "Terminal", category: "development", tags: ["console", "command", "cli"], glyph: `<path d="m8 9 3 3-3 3m5 0h3"/>` },
  code: { label: "Code", category: "development", tags: ["develop", "brackets"], glyph: `<path d="m9 8-3 4 3 4m6-8 3 4-3 4m-2-9-2 10"/>` },
  database: { label: "Database", category: "development", tags: ["storage", "data"], glyph: `<ellipse cx="12" cy="7" rx="5" ry="2"/><path d="M7 7v6c0 1.1 2.2 2 5 2s5-.9 5-2V7m-10 3c0 1.1 2.2 2 5 2s5-.9 5-2"/>` },
  server: { label: "Server", category: "development", tags: ["hosting", "rack"], glyph: `<rect x="6" y="7" width="12" height="4" rx="1"/><rect x="6" y="13" width="12" height="4" rx="1"/><path d="M8 9h.01M8 15h.01"/>` },
  cloud: { label: "Cloud", category: "devices", tags: ["weather", "storage"], glyph: `<path d="M7 16h9a3 3 0 0 0 .2-6 4.5 4.5 0 0 0-8.7 1A2.5 2.5 0 0 0 7 16Z"/>` },
  wifi: { label: "Wifi", category: "devices", tags: ["wireless", "network", "signal"], glyph: `<path d="M6 10a8.5 8.5 0 0 1 12 0m-9 3a4.2 4.2 0 0 1 6 0m-3 3h.01"/>` },
  bluetooth: { label: "Bluetooth", category: "devices", tags: ["wireless"], glyph: `<path d="m12 6 4 4-4 4V6Zm0 8 4 4-4 1v-5Zm-4-5 8 6m0-6-8 6"/>` },
  battery: { label: "Battery", category: "devices", tags: ["power", "charge"], glyph: `<rect x="6" y="8" width="11" height="8" rx="1"/><path d="M18 10v4M8 10h5v4H8Z" fill="#fff" stroke="none"/>` },
  phone: { label: "Phone", category: "devices", tags: ["mobile", "smartphone"], glyph: `<rect x="8.5" y="5" width="7" height="14" rx="1.4"/><path d="M11 16h2"/>` },
  monitor: { label: "Monitor", category: "devices", tags: ["screen", "desktop", "display"], glyph: `<rect x="6" y="6" width="12" height="9" rx="1"/><path d="M10 19h4m-2-4v4"/>` },
  laptop: { label: "Laptop", category: "devices", tags: ["computer", "notebook"], glyph: `<rect x="7" y="6" width="10" height="8" rx="1"/><path d="M5 16h14l-1 2H6Z"/>` },
  tablet: { label: "Tablet", category: "devices", tags: ["ipad"], glyph: `<rect x="8" y="5" width="8" height="14" rx="1"/><path d="M11 16h2"/>` },
  printer: { label: "Printer", category: "devices", tags: ["print"], glyph: `<path d="M8 9V6h8v3m-9 1h10a1 1 0 0 1 1 1v5H6v-5a1 1 0 0 1 1-1Zm1 6h8v3H8Z"/>` },
  keyboard: { label: "Keyboard", category: "devices", tags: ["typing", "input"], glyph: `<rect x="5" y="8" width="14" height="8" rx="1"/><path d="M8 11h.01m2 0h.01m2 0h.01m2 0h.01M8 14h8"/>` },
  mouse: { label: "Mouse", category: "devices", tags: ["pointer"], glyph: `<rect x="9" y="5" width="6" height="14" rx="3"/><path d="M12 5v4"/>` },
  headphones: { label: "Headphones", category: "media", tags: ["audio", "music", "support"], glyph: `<path d="M6 13v-1a6 6 0 0 1 12 0v1m-12 0h3v4H6Zm9 0h3v4h-3Z"/>` },
  mic: { label: "Microphone", category: "media", tags: ["microphone", "record", "voice"], glyph: `<rect x="10" y="6" width="4" height="8" rx="2"/><path d="M8 12a4 4 0 0 0 8 0m-4 4v3"/>` },
  volume: { label: "Volume", category: "media", tags: ["sound", "speaker", "audio"], glyph: `<path d="M7 10h3l3-3v10l-3-3H7Zm8 1a3 3 0 0 1 0 2"/>` },
  video: { label: "Video", category: "media", tags: ["camera", "record", "film"], glyph: `<rect x="6" y="8" width="8" height="8" rx="1"/><path d="m14 11 4-2v6l-4-2Z"/>` },
  image: { label: "Image", category: "media", tags: ["photo", "picture"], glyph: `<rect x="6" y="7" width="12" height="10" rx="1"/><circle cx="10" cy="10" r="1"/><path d="m7 16 4-4 2 2 2-2 2 4"/>` },
  file: { label: "File", category: "files", tags: ["document", "page"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3"/>` },
  fileText: { label: "File text", category: "files", tags: ["document", "text"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3M10 12h4m-4 3h4"/>` },
  archive: { label: "Archive", category: "files", tags: ["storage", "box"], glyph: `<path d="M6 8h12v10H6Zm-1-3h14v3H5Zm5 6h4"/>` },
  share: { label: "Share", category: "communication", tags: ["network", "social"], glyph: `<circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="8" r="1.5"/><circle cx="16" cy="16" r="1.5"/><path d="m9.3 11.2 5.4-2.4m-5.4 4 5.4 2.4"/>` },
  send: { label: "Send", category: "communication", tags: ["submit", "paper plane"], glyph: `<path d="m5 6 14 6-14 6 3-6Z"/><path d="M8 12h11"/>` },
  map: { label: "Map", category: "travel", tags: ["location"], glyph: `<path d="m6 7 4-2 4 2 4-2v12l-4 2-4-2-4 2Z"/><path d="M10 5v12m4-10v12"/>` },
  pin: { label: "Pin", category: "travel", tags: ["location", "marker", "place"], glyph: `<path d="M12 19s5-4.3 5-8a5 5 0 0 0-10 0c0 3.7 5 8 5 8Z"/><circle cx="12" cy="11" r="1.5"/>` },
  navigation: { label: "Navigation", category: "travel", tags: ["direction", "compass"], glyph: `<path d="m16.5 7.5-2.4 6-6 2.4 2.4-6Z"/>` },
  clock: { label: "Clock", category: "time", tags: ["time", "history"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M12 8v4l3 2"/>` },
  calendarDays: { label: "Calendar days", category: "time", tags: ["date", "schedule", "month"], glyph: `<rect x="6" y="7" width="12" height="11" rx="1"/><path d="M6 10h12M9 5v4m6-4v4m-6 4h.01m3 0h.01m3 0h.01m-6 3h.01m3 0h.01"/>` },
  briefcase: { label: "Briefcase", category: "objects", tags: ["work", "job", "business"], glyph: `<rect x="5" y="9" width="14" height="9" rx="1"/><path d="M9 9V7h6v2m-10 3h14m-8-1v2"/>` },
  shoppingBag: { label: "Shopping bag", category: "commerce", tags: ["shop", "store", "purchase"], glyph: `<path d="M7 9h10l1 10H6Zm3 0V7a2 2 0 0 1 4 0v2"/>` },
  creditCard: { label: "Credit card", category: "commerce", tags: ["payment", "billing"], glyph: `<rect x="5" y="8" width="14" height="9" rx="1"/><path d="M5 11h14m-10 3h3"/>` },
  wallet: { label: "Wallet", category: "commerce", tags: ["money", "payment"], glyph: `<path d="M6 7h10a2 2 0 0 1 2 2v8H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><path d="M14 11h5v4h-5Z"/>` },
  receipt: { label: "Receipt", category: "commerce", tags: ["invoice", "bill"], glyph: `<path d="M8 5h8v14l-2-1-2 1-2-1-2 1Z"/><path d="M10 9h4m-4 3h4"/>` },
  package: { label: "Package", category: "commerce", tags: ["shipping", "delivery", "parcel"], glyph: `<path d="m7 8 5-3 5 3v8l-5 3-5-3Z"/><path d="m7 8 5 3 5-3m-5 3v8"/>` },
  truck: { label: "Truck", category: "travel", tags: ["delivery", "shipping"], glyph: `<path d="M5 8h9v8H5Zm9 3h3l2 2v3h-5Z"/><circle cx="8" cy="17" r="1.3"/><circle cx="16" cy="17" r="1.3"/>` },
  plane: { label: "Plane", category: "travel", tags: ["flight", "airport"], glyph: `<path d="m5 13 14-6-5 5 3 4-2 1-4-3-3 2Z"/>` },
  car: { label: "Car", category: "travel", tags: ["vehicle", "drive"], glyph: `<path d="m6 15 1-5h10l1 5v3H6Z"/><path d="M8 10 9 8h6l1 2"/><circle cx="8" cy="17" r="1"/><circle cx="16" cy="17" r="1"/>` },
  bike: { label: "Bike", category: "travel", tags: ["bicycle", "cycling"], glyph: `<circle cx="7" cy="16" r="2.5"/><circle cx="17" cy="16" r="2.5"/><path d="m7 16 3-6h3l4 6m-7-6 2 6m-3-6H7m6 0h2"/>` },
  coffee: { label: "Coffee", category: "food", tags: ["cup", "break", "drink"], glyph: `<path d="M7 9h8v7a3 3 0 0 1-6 0V9Zm8 2h2a2 2 0 0 1 0 4h-2M8 6h6"/>` },
  gift: { label: "Gift", category: "commerce", tags: ["present", "reward"], glyph: `<rect x="6" y="10" width="12" height="8"/><path d="M5 8h14v3H5Zm7 0v10m0-10s-4-1-3-3c.7-1.3 3 1 3 3s2.3-4.3 3-3c1 2-3 3-3 3Z"/>` },
  key: { label: "Key", category: "security", tags: ["password", "access", "security"], glyph: `<circle cx="9" cy="11" r="3"/><path d="m11.2 13.2 5.3 5.3m-2-2 1.5-1.5m-3-1 1.5-1.5"/>` },
  shield: { label: "Shield", category: "security", tags: ["security", "protection"], glyph: `<path d="M12 5 18 7v5c0 3.6-2.5 5.7-6 7-3.5-1.3-6-3.4-6-7V7Z"/>` },
  unlock: { label: "Unlock", category: "security", tags: ["open", "security"], glyph: `<rect x="7" y="10" width="10" height="8" rx="1"/><path d="M9 10V8a3 3 0 0 1 5.5-1.7"/>` },
  userAdd: { label: "User add", category: "people", tags: ["invite", "signup", "person"], glyph: `<circle cx="10" cy="9" r="2.5"/><path d="M5.5 18c.5-3 2-4.5 4.5-4.5s4 1.5 4.5 4.5m4-7v5m-2.5-2.5h5"/>` },
  bellOff: { label: "Bell off", category: "communication", tags: ["mute", "silent"], glyph: `<path d="M7 16V10a5 5 0 0 1 .6-2.4M17 16v-6a5 5 0 0 0-7.5-4.3M5 18h14m-8 2h2M5 5l14 14"/>` },
  moon: { label: "Moon", category: "weather", tags: ["dark", "night"], glyph: `<path d="M16.5 16.5A6 6 0 0 1 8 8a6.5 6.5 0 1 0 8.5 8.5Z"/>` },
  sun: { label: "Sun", category: "weather", tags: ["light", "day", "brightness"], glyph: `<circle cx="12" cy="12" r="3"/><path d="M12 5V3m0 18v-2m7-7h2M3 12h2m12-5 1.4-1.4M5.6 18.4 7 17m10 1.4L15.6 17M7 7 5.6 5.6"/>` },
  umbrella: { label: "Umbrella", category: "weather", tags: ["weather", "rain", "insurance"], glyph: `<path d="M5 12a7 7 0 0 1 14 0Z"/><path d="M12 12v5a2 2 0 0 0 4 0"/>` },
  leaf: { label: "Leaf", category: "nature", tags: ["eco", "plant", "green"], glyph: `<path d="M18 6c-6 .2-10 3.2-10 8 0 2.5 1.5 4 3.5 4C16 18 18 12 18 6Z"/><path d="M7 18c2-3 4.5-5 8-6"/>` },
  flame: { label: "Flame", category: "nature", tags: ["fire", "hot", "trending"], glyph: `<path d="M12 19c3 0 5-2.2 5-5.1 0-3.8-3-5-3-8.1-2.7 1.8-5 4.7-5 8.1C9 16.8 10 19 12 19Z"/>` },
  sparkles: { label: "Sparkles", category: "feedback", tags: ["ai", "magic", "new"], glyph: `<path d="m9 5 .8 2.2L12 8l-2.2.8L9 11l-.8-2.2L6 8l2.2-.8ZM16 12l.9 2.6L19.5 16l-2.6.9L16 19.5l-.9-2.6-2.6-.9 2.6-.9Z"/>` },
  smile: { label: "Smile", category: "feedback", tags: ["happy", "emoji"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M9 14c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5M9.5 10h.01m5 0h.01"/>` },
  thumbsUp: { label: "Thumbs up", category: "feedback", tags: ["like", "approve"], glyph: `<path d="M8 11v7H5v-7Zm3 7h4.5a2 2 0 0 0 2-1.6l.7-3.5A1.5 1.5 0 0 0 16.7 11H14l.5-3a2 2 0 0 0-2-2l-2 5Z"/>` },
  plusCircle: { label: "Plus circle", category: "interface", tags: ["add", "create"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M12 9v6m-3-3h6"/>` },
  checkCircle: { label: "Check circle", category: "feedback", tags: ["success", "done", "verified"], glyph: `<circle cx="12" cy="12" r="6"/><path d="m9 12 2 2 4-4"/>` },
  alertCircle: { label: "Alert circle", category: "feedback", tags: ["error", "warning"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M12 9v4m0 2h.01"/>` },
  // Interface
  logIn: { label: "Log in", category: "interface", tags: ["sign in", "enter", "login"], glyph: `<path d="M13 5.5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4M5 12h9m-3-3 3 3-3 3"/>` },
  logOut: { label: "Log out", category: "interface", tags: ["sign out", "exit", "logout"], glyph: `<path d="M11 5.5H7a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4M10 12h9m-3-3 3 3-3 3"/>` },
  save: { label: "Save", category: "interface", tags: ["floppy", "disk", "store"], glyph: `<path d="M6.5 5h9L19 8.5V18a1 1 0 0 1-1 1H6.5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M8.5 5v3.5h6V5M8.5 19v-5h7v5"/>` },
  zoomIn: { label: "Zoom in", category: "interface", tags: ["magnify", "enlarge", "plus"], glyph: `<circle cx="10.5" cy="10.5" r="4.5"/><path d="m14 14 4 4M10.5 8.5v4m-2-2h4"/>` },
  zoomOut: { label: "Zoom out", category: "interface", tags: ["shrink", "minus"], glyph: `<circle cx="10.5" cy="10.5" r="4.5"/><path d="m14 14 4 4M8.5 10.5h4"/>` },
  maximize: { label: "Maximize", category: "interface", tags: ["fullscreen", "expand"], glyph: `<path d="M5 9V5h4m6 0h4v4m0 6v4h-4m-6 0H5v-4"/>` },
  minimize: { label: "Minimize", category: "interface", tags: ["exit fullscreen", "shrink"], glyph: `<path d="M9 5v4H5m14 0h-4V5m0 14v-4h4M5 15h4v4"/>` },
  moreHorizontal: { label: "More", category: "interface", tags: ["ellipsis", "options", "menu", "dots"], glyph: `<circle cx="7" cy="12" r="1.3" fill="#fff" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="#fff" stroke="none"/><circle cx="17" cy="12" r="1.3" fill="#fff" stroke="none"/>` },
  moreVertical: { label: "More vertical", category: "interface", tags: ["ellipsis", "options", "kebab", "dots"], glyph: `<circle cx="12" cy="7" r="1.3" fill="#fff" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="#fff" stroke="none"/><circle cx="12" cy="17" r="1.3" fill="#fff" stroke="none"/>` },
  loader: { label: "Loader", category: "interface", tags: ["loading", "spinner", "wait", "progress"], glyph: `<path d="M12 5v2.5M12 16.5V19M5 12h2.5m9 0H19M7 7l1.8 1.8m6.4 6.4L17 17M7 17l1.8-1.8m6.4-6.4L17 7"/>` },
  power: { label: "Power", category: "interface", tags: ["on", "off", "shutdown"], glyph: `<path d="M12 5v6"/><path d="M8.3 7.8a6 6 0 1 0 7.4 0"/>` },
  paperclip: { label: "Paperclip", category: "interface", tags: ["attach", "attachment"], glyph: `<path d="m17 11.5-5.3 5.3a3.2 3.2 0 0 1-4.5-4.5l6-6a2.1 2.1 0 0 1 3 3l-5.8 5.8a1 1 0 0 1-1.4-1.4l5.2-5.2"/>` },
  scissors: { label: "Scissors", category: "interface", tags: ["cut", "trim"], glyph: `<circle cx="7.5" cy="7.5" r="2.2"/><circle cx="7.5" cy="16.5" r="2.2"/><path d="M9.3 8.8 18 17M9.3 15.2 18 7"/>` },
  clipboard: { label: "Clipboard", category: "interface", tags: ["paste", "copy", "board"], glyph: `<path d="M9 6H7.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H15"/><rect x="9" y="4.5" width="6" height="3" rx=".8"/><path d="M9.5 12h5m-5 3h3"/>` },
  layers: { label: "Layers", category: "design", tags: ["stack", "arrange"], glyph: `<path d="m12 5 7 3.5-7 3.5-7-3.5Z"/><path d="m5 12 7 3.5 7-3.5M5 15.5l7 3.5 7-3.5"/>` },
  move: { label: "Move", category: "interface", tags: ["drag", "arrows", "position"], glyph: `<path d="M12 5v14M5 12h14M10 7l2-2 2 2m-4 10 2 2 2-2M7 10l-2 2 2 2m10-4 2 2-2 2"/>` },
  hash: { label: "Hash", category: "interface", tags: ["hashtag", "number", "channel"], glyph: `<path d="M10 5 8.5 19m7-14L14 19M6 9.5h13M5 14.5h13"/>` },
  history: { label: "History", category: "time", tags: ["recent", "time", "back"], glyph: `<path d="M5.5 12a6.5 6.5 0 1 0 2-4.7L5.5 9.3"/><path d="M5.5 5.8v3.5H9M12 8.5V12l2.5 1.5"/>` },
  toggle: { label: "Toggle", category: "interface", tags: ["switch", "on", "setting"], glyph: `<rect x="4.5" y="8" width="15" height="8" rx="4"/><circle cx="15.5" cy="12" r="2" fill="#fff" stroke="none"/>` },
  crop: { label: "Crop", category: "design", tags: ["trim", "image", "resize"], glyph: `<path d="M8 5v10a1 1 0 0 0 1 1h10M5 8h10a1 1 0 0 1 1 1v10"/>` },
  userCheck: { label: "User check", category: "people", tags: ["verified", "approved", "person"], glyph: `<circle cx="10" cy="9" r="2.5"/><path d="M5.5 18c.5-3 2-4.5 4.5-4.5s4 1.5 4.5 4.5M15.5 11.5 17 13l3-3"/>` },
  scan: { label: "Scan", category: "interface", tags: ["barcode", "focus", "frame"], glyph: `<path d="M5 9V6a1 1 0 0 1 1-1h3m6 0h3a1 1 0 0 1 1 1v3m0 6v3a1 1 0 0 1-1 1h-3m-6 0H6a1 1 0 0 1-1-1v-3M8 12h8"/>` },
  sidebar: { label: "Sidebar", category: "layout", tags: ["panel", "layout", "drawer"], glyph: `<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M10 5v14M7 8.5h1M7 11h1"/>` },

  // Arrows
  undo: { label: "Undo", category: "arrows", tags: ["back", "revert"], glyph: `<path d="M5.5 9H15a4 4 0 0 1 0 8h-4"/><path d="m8.5 6-3 3 3 3"/>` },
  redo: { label: "Redo", category: "arrows", tags: ["forward", "repeat"], glyph: `<path d="M18.5 9H9a4 4 0 0 0 0 8h4"/><path d="m15.5 6 3 3-3 3"/>` },
  arrowUpRight: { label: "Arrow up right", category: "arrows", tags: ["diagonal", "external", "trend"], glyph: `<path d="M7 17 17 7M9 7h8v8"/>` },
  repeat: { label: "Repeat", category: "arrows", tags: ["loop", "cycle"], glyph: `<path d="M5.5 11.5V10A2.5 2.5 0 0 1 8 7.5h10.5M16 5l2.5 2.5L16 10M18.5 12.5V14a2.5 2.5 0 0 1-2.5 2.5H5.5M8 19l-2.5-2.5L8 14"/>` },
  shuffle: { label: "Shuffle", category: "arrows", tags: ["random", "mix"], glyph: `<path d="M5 8h2.5c4.5 0 4.5 8 9 8H19m-2-2 2 2-2 2"/><path d="M5 16h2.5c1.3 0 2.2-.7 2.9-1.6m3.2-4.8c.7-.9 1.6-1.6 2.9-1.6H19m-2-2 2 2-2 2"/>` },
  chevronsUpDown: { label: "Chevrons up down", category: "arrows", tags: ["select", "sort", "expand"], glyph: `<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>` },
  sort: { label: "Sort", category: "arrows", tags: ["order", "descending", "arrange"], glyph: `<path d="M8 5v14m-3-3 3 3 3-3M13.5 6h5.5m-5.5 4h4m-4 4h2.5m-2.5 4h1"/>` },

  // Editor
  bold: { label: "Bold", category: "editor", tags: ["text", "format", "strong"], glyph: `<path d="M7.5 5H13a3.5 3.5 0 0 1 0 7H7.5Zm0 7H14a3.5 3.5 0 0 1 0 7H7.5Z"/>` },
  italic: { label: "Italic", category: "editor", tags: ["text", "format", "emphasis"], glyph: `<path d="M10 5h7M7 19h7M14 5l-4 14"/>` },
  underline: { label: "Underline", category: "editor", tags: ["text", "format"], glyph: `<path d="M8 5v6a4 4 0 0 0 8 0V5M6.5 19h11"/>` },
  strikethrough: { label: "Strikethrough", category: "editor", tags: ["text", "format", "delete"], glyph: `<path d="M16 8c-.6-1.8-2.1-3-4-3-2.2 0-4 1.3-4 3.2 0 1.3.8 2.2 2 2.8M5 12.5h14M8 16c.6 1.8 2.1 3 4 3 2.2 0 4-1.3 4-3.2 0-.5-.1-1-.3-1.4"/>` },
  alignLeft: { label: "Align left", category: "editor", tags: ["text", "paragraph"], glyph: `<path d="M5 7h14M5 12h9M5 17h11"/>` },
  alignCenter: { label: "Align center", category: "editor", tags: ["text", "paragraph", "middle"], glyph: `<path d="M5 7h14M8 12h8M6.5 17h11"/>` },
  alignRight: { label: "Align right", category: "editor", tags: ["text", "paragraph"], glyph: `<path d="M5 7h14M10 12h9M8 17h11"/>` },
  heading: { label: "Heading", category: "editor", tags: ["title", "text", "h1"], glyph: `<path d="M7 5v14M17 5v14M7 12h10"/>` },
  quote: { label: "Quote", category: "editor", tags: ["blockquote", "citation", "testimonial"], glyph: `<path d="M5.5 8.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V12c0 3-1.5 4.5-4 5M13.5 8.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V12c0 3-1.5 4.5-4 5M5.5 12h5m3 0h5"/>` },
  checklist: { label: "Checklist", category: "editor", tags: ["todo", "tasks", "list"], glyph: `<path d="M11 7h8m-8 5h8m-8 5h8M5 7l1.2 1.2L8.5 6M5 12l1.2 1.2 2.3-2.2M5 17l1.2 1.2 2.3-2.2"/>` },
  type: { label: "Type", category: "editor", tags: ["text", "font", "typography"], glyph: `<path d="M6 7.5V5h12v2.5M12 5v14m-2.5 0h5"/>` },
  table: { label: "Table", category: "editor", tags: ["grid", "spreadsheet", "data"], glyph: `<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M5 9.5h14M5 14h14M10 9.5V19"/>` },

  // Development
  gitBranch: { label: "Git branch", category: "development", tags: ["version control", "fork"], glyph: `<circle cx="8" cy="6.5" r="1.8"/><circle cx="8" cy="17.5" r="1.8"/><circle cx="16" cy="8.5" r="1.8"/><path d="M8 8.3v7.4M16 10.3c0 3.2-3.2 3.6-6.6 5.8"/>` },
  gitCommit: { label: "Git commit", category: "development", tags: ["version control", "node"], glyph: `<circle cx="12" cy="12" r="3"/><path d="M4.5 12H9m6 0h4.5"/>` },
  gitMerge: { label: "Git merge", category: "development", tags: ["version control", "pull request"], glyph: `<circle cx="7.5" cy="6.5" r="1.8"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="13" r="1.8"/><path d="M7.5 8.3v7.4m0-7.4c0 3 2.5 4.7 7.2 4.7"/>` },
  bug: { label: "Bug", category: "development", tags: ["issue", "error", "debug"], glyph: `<rect x="8" y="8" width="8" height="10.5" rx="4"/><path d="M10 8V7a2 2 0 0 1 4 0v1m-2 4.5v6M5 13.5h3m8 0h3M5.5 9.5 8 11m10.5-1.5L16 11M5.5 17.5 8 16m10.5 1.5L16 16"/>` },
  command: { label: "Command", category: "development", tags: ["keyboard", "shortcut", "cmd"], glyph: `<path d="M9 9h6v6H9Z"/><path d="M9 9V7.5A1.5 1.5 0 1 0 7.5 9H9m6 0V7.5A1.5 1.5 0 1 1 16.5 9H15m0 6v1.5a1.5 1.5 0 1 0 1.5-1.5H15m-6 0v1.5A1.5 1.5 0 1 1 7.5 15H9"/>` },
  braces: { label: "Braces", category: "development", tags: ["json", "code", "object"], glyph: `<path d="M9 5H8a2 2 0 0 0-2 2v3l-1.5 2L6 14v3a2 2 0 0 0 2 2h1m6-14h1a2 2 0 0 1 2 2v3l1.5 2-1.5 2v3a2 2 0 0 1-2 2h-1"/>` },
  workflow: { label: "Workflow", category: "development", tags: ["flow", "pipeline", "automation"], glyph: `<rect x="5" y="5" width="6" height="5" rx="1"/><rect x="13" y="14" width="6" height="5" rx="1"/><path d="M8 10v3a1.5 1.5 0 0 0 1.5 1.5H13"/>` },
  component: { label: "Component", category: "development", tags: ["module", "design system", "block"], glyph: `<path d="m12 4.5 2.5 2.5-2.5 2.5L9.5 7Zm0 10 2.5 2.5-2.5 2.5L9.5 17ZM7 9.5 9.5 12 7 14.5 4.5 12Zm10 0 2.5 2.5-2.5 2.5-2.5-2.5Z"/>` },

  // Devices
  cpu: { label: "CPU", category: "devices", tags: ["processor", "chip", "hardware"], glyph: `<rect x="7" y="7" width="10" height="10" rx="1"/><rect x="10" y="10" width="4" height="4" rx=".5"/><path d="M10 4.5V7m4-2.5V7m-4 10v2.5m4-2.5v2.5M4.5 10H7m-2.5 4H7m10-4h2.5M17 14h2.5"/>` },
  hardDrive: { label: "Hard drive", category: "devices", tags: ["storage", "disk", "hdd"], glyph: `<rect x="4.5" y="12.5" width="15" height="6" rx="1"/><path d="m4.5 13.5 2.3-6.7A1 1 0 0 1 7.8 6h8.4a1 1 0 0 1 1 .8l2.3 6.7M8 15.5h.01m3 0h.01"/>` },
  watch: { label: "Watch", category: "devices", tags: ["smartwatch", "time", "wearable"], glyph: `<circle cx="12" cy="12" r="4.5"/><path d="M12 10v2l1.2 1.2M9.6 8.1 10 5h4l.4 3.1m-4.8 7.8L10 19h4l.4-3.1"/>` },
  gamepad: { label: "Gamepad", category: "games", tags: ["game", "controller", "play"], glyph: `<path d="M8 8h8a4 4 0 0 1 3.9 4.8l-.6 3a2 2 0 0 1-3.4 1L14 15h-4l-1.9 1.8a2 2 0 0 1-3.4-1l-.6-3A4 4 0 0 1 8 8Z"/><path d="M8.5 10.5v3M7 12h3m5-.5h.01M17 13h.01"/>` },
  tv: { label: "TV", category: "devices", tags: ["television", "screen", "stream"], glyph: `<rect x="4.5" y="7" width="15" height="10" rx="1.5"/><path d="m9 4 3 3 3-3M9 19h6"/>` },
  plug: { label: "Plug", category: "devices", tags: ["power", "electric", "connect"], glyph: `<path d="M9 5v4m6-4v4M7 9h10v2a5 5 0 0 1-10 0Zm5 7v3"/>` },
  signal: { label: "Signal", category: "devices", tags: ["cellular", "bars", "strength"], glyph: `<path d="M6 18v-2m4 2v-5m4 5V10m4 8V6"/>` },
  qrCode: { label: "QR code", category: "devices", tags: ["scan", "barcode"], glyph: `<rect x="5" y="5" width="5" height="5" rx=".6"/><rect x="14" y="5" width="5" height="5" rx=".6"/><rect x="5" y="14" width="5" height="5" rx=".6"/><path d="M14 14h2v2h-2Zm3 3h2v2h-2Zm-3 2h.01M19 14h.01"/>` },

  // Media
  music: { label: "Music", category: "media", tags: ["song", "audio", "note"], glyph: `<path d="M9 16.5V6.5l9-1.5v10"/><circle cx="7" cy="16.5" r="2"/><circle cx="16" cy="15" r="2"/>` },
  film: { label: "Film", category: "media", tags: ["movie", "video", "cinema"], glyph: `<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M9 5v14m6-14v14M5 9h4m-4 6h4m6-6h4m-4 6h4"/>` },
  volumeX: { label: "Mute", category: "media", tags: ["volume off", "sound off", "silent"], glyph: `<path d="M5 10h3l4-3v10l-4-3H5Z"/><path d="m15 10 4 4m0-4-4 4"/>` },
  skipForward: { label: "Skip forward", category: "media", tags: ["next", "track"], glyph: `<path d="m6 7 7 5-7 5Z"/><path d="M17 7v10"/>` },
  skipBack: { label: "Skip back", category: "media", tags: ["previous", "track"], glyph: `<path d="m18 7-7 5 7 5Z"/><path d="M7 7v10"/>` },
  book: { label: "Book", category: "media", tags: ["read", "library", "docs"], glyph: `<path d="M6 16.5v-10A1.5 1.5 0 0 1 7.5 5H18v11H7.5a1.5 1.5 0 0 0 0 3H18"/>` },
  bookOpen: { label: "Book open", category: "media", tags: ["read", "docs", "guide"], glyph: `<path d="M12 7.5c-1.6-1.3-3.8-2-7-2V17c3.2 0 5.4.7 7 2 1.6-1.3 3.8-2 7-2V5.5c-3.2 0-5.4.7-7 2Zm0 0V19"/>` },
  newspaper: { label: "Newspaper", category: "media", tags: ["news", "article", "blog"], glyph: `<path d="M8 6h10a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6.5h3"/><path d="M8 17V6m3 3.5h5m-5 3h5m-5 3h3"/>` },
  folderOpen: { label: "Folder open", category: "files", tags: ["directory", "browse"], glyph: `<path d="M5 17V7a1 1 0 0 1 1-1h4l2 2h5a1 1 0 0 1 1 1v1"/><path d="M5 17.5 7.1 11a1 1 0 0 1 1-.7H19a.8.8 0 0 1 .8 1l-1.9 6.3a1 1 0 0 1-1 .7H6a1 1 0 0 1-1-.8Z"/>` },
  radio: { label: "Radio", category: "media", tags: ["broadcast", "fm", "podcast"], glyph: `<rect x="4.5" y="9" width="15" height="10" rx="1.5"/><path d="m7 9 9-4M7.5 12.5h3m-3 3h3"/><circle cx="15" cy="14" r="2"/>` },

  // Communication
  phoneCall: { label: "Call", category: "communication", tags: ["phone", "ring", "contact"], glyph: `<path d="M8.2 5.5 6.3 5.3A1.3 1.3 0 0 0 4.9 6.7c.3 6.7 5.7 12.1 12.4 12.4a1.3 1.3 0 0 0 1.4-1.4l-.2-1.9a1 1 0 0 0-.7-.9l-2.3-.8a1 1 0 0 0-1 .2l-1.3 1.1a9 9 0 0 1-4.6-4.6l1.1-1.3a1 1 0 0 0 .2-1l-.8-2.3a1 1 0 0 0-.9-.7Z"/><path d="M14 5a5 5 0 0 1 5 5m-5-2a2 2 0 0 1 2 2"/>` },
  megaphone: { label: "Megaphone", category: "communication", tags: ["announce", "marketing", "broadcast"], glyph: `<path d="M5 10v4h3l8 4V6l-8 4Z"/><path d="m8 14 1 4.5h2L10.3 15M18.5 10v4"/>` },
  rss: { label: "RSS", category: "communication", tags: ["feed", "subscribe", "blog"], glyph: `<path d="M6 11a7 7 0 0 1 7 7M6 6.5A11.5 11.5 0 0 1 17.5 18"/><circle cx="6.8" cy="17.2" r="1.2" fill="#fff" stroke="none"/>` },
  reply: { label: "Reply", category: "communication", tags: ["respond", "answer", "back"], glyph: `<path d="M10 7 5 12l5 5"/><path d="M5 12h9a5 5 0 0 1 5 5v1"/>` },
  atSign: { label: "At sign", category: "communication", tags: ["mention", "email", "@"], glyph: `<circle cx="12" cy="12" r="3"/><path d="M15 9v4.2a2 2 0 0 0 4 0V12a7 7 0 1 0-2.8 5.6"/>` },
  inbox: { label: "Inbox", category: "communication", tags: ["mail", "tray", "messages"], glyph: `<path d="M5 13 7 6h10l2 7v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"/><path d="M5 13h4l1 2h4l1-2h4"/>` },

  // Commerce
  dollarSign: { label: "Dollar", category: "commerce", tags: ["money", "currency", "price", "usd"], glyph: `<path d="M12 5v14M15.5 7.5h-4.7a2.3 2.3 0 0 0 0 4.5h2.4a2.3 2.3 0 0 1 0 4.5H8"/>` },
  percent: { label: "Percent", category: "commerce", tags: ["discount", "sale", "rate"], glyph: `<path d="M18 6 6 18"/><circle cx="7.5" cy="7.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/>` },
  store: { label: "Store", category: "commerce", tags: ["shop", "market", "building"], glyph: `<path d="M5 9 6.5 5h11L19 9"/><path d="M5 9a2.3 2.3 0 0 0 4.7 0 2.3 2.3 0 0 0 4.6 0A2.3 2.3 0 0 0 19 9M6 11v8h12v-8M10 19v-4h4v4"/>` },
  barChart: { label: "Bar chart", category: "commerce", tags: ["analytics", "stats", "graph"], glyph: `<path d="M5 19h14M7.5 15.5V12m4.5 3.5V7m4.5 8.5V10"/>` },
  pieChart: { label: "Pie chart", category: "commerce", tags: ["analytics", "share", "graph"], glyph: `<path d="M11 6a6.5 6.5 0 1 0 7 7h-7Z"/><path d="M13.5 4.5A6.5 6.5 0 0 1 19.5 10.5h-6Z"/>` },
  trendingUp: { label: "Trending up", category: "commerce", tags: ["growth", "increase", "profit"], glyph: `<path d="m5 16 5-5 3 3 6-6"/><path d="M15 8h4v4"/>` },
  trendingDown: { label: "Trending down", category: "commerce", tags: ["decline", "decrease", "loss"], glyph: `<path d="m5 8 5 5 3-3 6 6"/><path d="M15 16h4v-4"/>` },
  coins: { label: "Coins", category: "commerce", tags: ["money", "savings", "cash"], glyph: `<ellipse cx="10" cy="7.5" rx="5" ry="2"/><path d="M5 7.5v3c0 1.1 2.2 2 5 2s5-.9 5-2v-3M5 10.5v3c0 1.1 2.2 2 5 2 .5 0 1-.03 1.5-.1"/><circle cx="16" cy="15.5" r="3"/>` },
  banknote: { label: "Banknote", category: "commerce", tags: ["money", "cash", "bill"], glyph: `<rect x="4" y="7.5" width="16" height="9" rx="1.5"/><circle cx="12" cy="12" r="2"/><path d="M7 10.5v3m10-3v3"/>` },
  calculator: { label: "Calculator", category: "commerce", tags: ["math", "accounting", "compute"], glyph: `<rect x="6.5" y="4.5" width="11" height="14.5" rx="1.5"/><path d="M9 8h6M9 12h.01M12 12h.01M15 12h.01M9 15.5h.01M12 15.5h.01M15 15.5h.01"/>` },
  ticket: { label: "Ticket", category: "commerce", tags: ["event", "pass", "admission"], glyph: `<path d="M5 8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4Z"/><path d="M13.5 7v2m0 2.5v1m0 2.5v2"/>` },
  shirt: { label: "Shirt", category: "commerce", tags: ["clothing", "fashion", "apparel"], glyph: `<path d="M9.5 5 5 7.2l1.4 3.8L8 10.4V19h8v-8.6l1.6.6L19 7.2 14.5 5a2.5 2.5 0 0 1-5 0Z"/>` },

  // Travel
  train: { label: "Train", category: "travel", tags: ["rail", "transit", "subway"], glyph: `<rect x="6.5" y="4.5" width="11" height="11" rx="2.5"/><path d="M6.5 10h11M9.5 13h.01m5 0h.01M9 15.5 7.5 19m7.5-3.5 1.5 3.5"/>` },
  bus: { label: "Bus", category: "travel", tags: ["transit", "public transport"], glyph: `<rect x="5.5" y="5" width="13" height="11.5" rx="2"/><path d="M5.5 10.5h13m-10 3h.01m7 0h.01M8 16.5V19m8-2.5V19"/>` },
  ship: { label: "Ship", category: "travel", tags: ["boat", "cruise", "sea"], glyph: `<path d="M4.5 15 12 12.5l7.5 2.5-1.5 4H6Z"/><path d="M7 14.2V9h10v5.2M12 9V5.5m-2 0h4"/>` },
  anchor: { label: "Anchor", category: "travel", tags: ["marine", "port", "harbor"], glyph: `<circle cx="12" cy="6.5" r="1.8"/><path d="M12 8.3V19M8.5 11h7M6 13a6 6 0 0 0 12 0"/>` },
  building: { label: "Building", category: "travel", tags: ["office", "company", "city"], glyph: `<rect x="6" y="4.5" width="12" height="14.5" rx="1"/><path d="M9.5 8h1m3 0h1m-5 3.5h1m3 0h1M11 19v-3h2v3"/>` },
  mountain: { label: "Mountain", category: "travel", tags: ["hiking", "landscape", "outdoors"], glyph: `<path d="m4 18 6-10 4 6 2-3 4 7Z"/><path d="m8.2 11 1.8 1.2 1.8-1.2"/>` },
  tent: { label: "Tent", category: "travel", tags: ["camping", "outdoors"], glyph: `<path d="M12 5 4.5 18h15Z"/><path d="m12 11-3 7m3-7 3 7"/>` },
  luggage: { label: "Luggage", category: "travel", tags: ["suitcase", "baggage", "trip"], glyph: `<rect x="6.5" y="8" width="11" height="10" rx="1.5"/><path d="M10 8V5.5h4V8m-4.5 3v4m5-4v4M8.5 18v1m7-1v1"/>` },
  route: { label: "Route", category: "travel", tags: ["path", "directions", "journey"], glyph: `<circle cx="7" cy="17" r="2"/><circle cx="17" cy="7" r="2"/><path d="M9 17h6.5a2.5 2.5 0 0 0 0-5h-7a2.5 2.5 0 0 1 0-5H15"/>` },

  // Feedback
  frown: { label: "Frown", category: "feedback", tags: ["sad", "unhappy", "emoji"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M9 15.5c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5M9.5 10h.01m5 0h.01"/>` },
  meh: { label: "Meh", category: "feedback", tags: ["neutral", "emoji"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M9.5 14.5h5M9.5 10h.01m5 0h.01"/>` },
  thumbsDown: { label: "Thumbs down", category: "feedback", tags: ["dislike", "reject"], glyph: `<g transform="matrix(1 0 0 -1 0 24)"><path d="M8 11v7H5v-7Zm3 7h4.5a2 2 0 0 0 2-1.6l.7-3.5A1.5 1.5 0 0 0 16.7 11H14l.5-3a2 2 0 0 0-2-2l-2 5Z"/></g>` },
  award: { label: "Award", category: "feedback", tags: ["badge", "achievement", "prize"], glyph: `<circle cx="12" cy="9.5" r="4.5"/><path d="m9.5 13.3-1 5.7 3.5-2 3.5 2-1-5.7"/>` },
  badgeCheck: { label: "Verified", category: "feedback", tags: ["badge", "check", "trusted"], glyph: `<path d="m12 5 2 1.5h2.5V9l1.5 3-1.5 3v2.5H14L12 19l-2-1.5H7.5V15L6 12l1.5-3V6.5H10Z"/><path d="m9.5 12 1.8 1.8 3.2-3.3"/>` },
  xCircle: { label: "X circle", category: "feedback", tags: ["error", "cancel", "fail"], glyph: `<circle cx="12" cy="12" r="6"/><path d="m9.5 9.5 5 5m0-5-5 5"/>` },
  target: { label: "Target", category: "feedback", tags: ["goal", "aim", "focus"], glyph: `<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r=".9" fill="#fff" stroke="none"/>` },
  ban: { label: "Ban", category: "feedback", tags: ["block", "forbidden", "prohibited"], glyph: `<circle cx="12" cy="12" r="6.5"/><path d="m7.4 7.4 9.2 9.2"/>` },

  // Health
  pill: { label: "Pill", category: "health", tags: ["medicine", "drug", "pharmacy"], glyph: `<path d="M10.5 18.5a3.5 3.5 0 0 1-5-5l8-8a3.5 3.5 0 0 1 5 5Z"/><path d="m9.5 9.5 5 5"/>` },
  heartPulse: { label: "Heart pulse", category: "health", tags: ["heartbeat", "health", "vitals"], glyph: `<path d="M19 9.5c0 4.5-7 9-7 9s-7-4.5-7-9A3.7 3.7 0 0 1 12 7.8a3.7 3.7 0 0 1 7 1.7Z"/><path d="M5.5 12H9l1.5-2 2 4 1.5-2h4.5"/>` },
  activity: { label: "Activity", category: "health", tags: ["pulse", "monitor", "fitness"], glyph: `<path d="M4.5 12h3l2-5 4 10 2-5h4"/>` },
  stethoscope: { label: "Stethoscope", category: "health", tags: ["doctor", "medical", "checkup"], glyph: `<path d="M7.5 5H6v4a4 4 0 0 0 8 0V5h-1.5M10 13v1.5a4 4 0 0 0 8 0V13"/><circle cx="18" cy="11" r="2"/>` },
  bandage: { label: "Bandage", category: "health", tags: ["plaster", "first aid", "injury"], glyph: `<rect x="4.5" y="8.75" width="15" height="6.5" rx="3.25" transform="rotate(-45 12 12)"/><path d="M10.6 12h.01M12 10.6h.01M13.4 12h.01M12 13.4h.01"/>` },
  medicalCross: { label: "Medical cross", category: "health", tags: ["hospital", "emergency", "first aid"], glyph: `<path d="M10 5h4v5h5v4h-5v5h-4v-5H5v-4h5Z"/>` },

  // Nature
  cloudRain: { label: "Rain", category: "weather", tags: ["weather", "cloud", "storm"], glyph: `<path d="M7.5 14H16a3 3 0 0 0 .2-6 4.5 4.5 0 0 0-8.7 1A2.5 2.5 0 0 0 7.5 14Z"/><path d="m9 16.5-.8 2m4.3-2-.8 2m4.3-2-.8 2"/>` },
  snowflake: { label: "Snowflake", category: "weather", tags: ["winter", "cold", "weather"], glyph: `<path d="M12 5v14M6 8.5l12 7m-12 0 12-7M10 6l2 1.5L14 6m-4 12 2-1.5 2 1.5"/>` },
  droplet: { label: "Droplet", category: "nature", tags: ["water", "liquid", "humidity"], glyph: `<path d="M12 5s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9Z"/>` },
  wind: { label: "Wind", category: "weather", tags: ["weather", "air", "breeze"], glyph: `<path d="M4.5 9.5h9a2.5 2.5 0 1 0-2.5-2.5M4.5 13H17a2.5 2.5 0 1 1-2.5 2.5M4.5 16.5h6"/>` },
  thermometer: { label: "Thermometer", category: "weather", tags: ["temperature", "weather", "heat"], glyph: `<path d="M10 13V6a2 2 0 0 1 4 0v7a3.5 3.5 0 1 1-4 0Z"/><path d="M12 10v5"/>` },
  tree: { label: "Tree", category: "nature", tags: ["forest", "pine", "park"], glyph: `<path d="M12 4.5 7 11h2.5L6 16h12l-3.5-5H17Z"/><path d="M12 16v3"/>` },
  sprout: { label: "Sprout", category: "nature", tags: ["plant", "growth", "seedling"], glyph: `<path d="M12 19v-7"/><path d="M12 12c0-3-2-5-6-5 0 3.5 2 5 6 5Zm0-1c0-3 2-5 6-5 0 3.5-2 5-6 5Z"/>` },
  zap: { label: "Zap", category: "nature", tags: ["lightning", "energy", "fast", "power"], glyph: `<path d="M13 5 6.5 13h5l-1 6 7-8.5h-5Z"/>` },

  // Objects
  brush: { label: "Brush", category: "design", tags: ["paint", "art", "design"], glyph: `<path d="M18.5 5.5 11.2 13l-1.9-1.9L16.8 4a1.2 1.2 0 0 1 1.7 1.5Z"/><path d="M9.3 11.5c-2 0-3.3 1.4-3.3 3.3 0 1.2-.5 2.3-1.5 3.2 3.5.5 7.2-1 7.2-4.6"/>` },
  wrench: { label: "Wrench", category: "objects", tags: ["tool", "settings", "repair"], glyph: `<path d="M15.5 5.2a4 4 0 0 0-4.8 5.3l-5 5a1.8 1.8 0 0 0 2.6 2.6l5-5a4 4 0 0 0 5.3-4.8l-2.4 2.4-2.1-.5-.5-2.1Z"/>` },
  magnet: { label: "Magnet", category: "objects", tags: ["attract", "physics"], glyph: `<path d="M6 5.5h3.5v6a2.5 2.5 0 0 0 5 0v-6H18v6a6 6 0 0 1-12 0Z"/><path d="M6 9h3.5m5 0H18"/>` },
  gem: { label: "Gem", category: "objects", tags: ["diamond", "premium", "jewel"], glyph: `<path d="M8 5.5h8l3 4-7 9-7-9Z"/><path d="M5 9.5h14M10 5.5l-1.5 4 3.5 9 3.5-9-1.5-4"/>` },
  crown: { label: "Crown", category: "objects", tags: ["king", "premium", "vip"], glyph: `<path d="m5 8 3.5 3.5L12 6l3.5 5.5L19 8l-1.5 8.5h-11Z"/><path d="M6.5 19h11"/>` },
  glasses: { label: "Glasses", category: "objects", tags: ["spectacles", "vision", "read"], glyph: `<circle cx="7.5" cy="14" r="2.8"/><circle cx="16.5" cy="14" r="2.8"/><path d="M10.3 14h3.4M4.7 14 6 8m13.3 6L18 8"/>` },
  flask: { label: "Flask", category: "objects", tags: ["lab", "science", "experiment"], glyph: `<path d="M10 5v4.5L5.8 17a1.3 1.3 0 0 0 1.2 2h10a1.3 1.3 0 0 0 1.2-2L14 9.5V5M9 5h6M8 14h8"/>` },
  dice: { label: "Dice", category: "games", tags: ["game", "random", "chance"], glyph: `<rect x="5" y="5" width="14" height="14" rx="2.5"/><circle cx="9" cy="9" r="1" fill="#fff" stroke="none"/><circle cx="12" cy="12" r="1" fill="#fff" stroke="none"/><circle cx="15" cy="15" r="1" fill="#fff" stroke="none"/>` },
  graduationCap: { label: "Graduation cap", category: "objects", tags: ["education", "school", "learn"], glyph: `<path d="m12 6 8 4-8 4-8-4Z"/><path d="M7.5 11.8v3.7c2.5 2 6.5 2 9 0v-3.7M20 10v4.5"/>` },
  hourglass: { label: "Hourglass", category: "time", tags: ["time", "wait", "timer"], glyph: `<path d="M7 5h10M7 19h10M8 5v2a4 4 0 0 0 1.6 3.2L12 12l2.4-1.8A4 4 0 0 0 16 7V5M8 19v-2a4 4 0 0 1 1.6-3.2L12 12l2.4 1.8A4 4 0 0 1 16 17v2"/>` },

  // v0.3 expansion: Interface
  bookmarkPlus: { label: "Bookmark plus", category: "interface", tags: ["save", "add", "favorite"], glyph: `<path d="M8 6h8v12l-4-2.5L8 18Z"/><path d="M12 8.5v4m-2-2h4"/>` },
  checkSquare: { label: "Checkbox", category: "interface", tags: ["check square", "done", "selected", "todo"], glyph: `<rect x="5.5" y="5.5" width="13" height="13" rx="2"/><path d="m9 12 2.2 2.2L15.5 10"/>` },
  minusCircle: { label: "Minus circle", category: "interface", tags: ["remove", "subtract", "delete"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M9 12h6"/>` },
  plusSquare: { label: "Plus square", category: "interface", tags: ["add", "new", "create"], glyph: `<rect x="5.5" y="5.5" width="13" height="13" rx="2"/><path d="M12 9v6m-3-3h6"/>` },
  crosshair: { label: "Crosshair", category: "interface", tags: ["aim", "target", "focus"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M12 4.5V8m0 8v3.5M4.5 12H8m8 0h3.5"/>` },
  locate: { label: "Locate", category: "interface", tags: ["my location", "gps", "position"], glyph: `<circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="#fff" stroke="none"/><path d="M12 4.5V7m0 10v2.5M4.5 12H7m10 0h2.5"/>` },
  expand: { label: "Expand", category: "interface", tags: ["enlarge", "resize", "grow"], glyph: `<path d="M13.5 5H19v5.5M19 5l-5.5 5.5M10.5 19H5v-5.5M5 19l5.5-5.5"/>` },
  shrink: { label: "Shrink", category: "interface", tags: ["collapse", "resize", "reduce"], glyph: `<path d="M14 5v5h5m0-5-5 5m-4 9v-5H5m0 5 5-5"/>` },
  pointer: { label: "Pointer", category: "interface", tags: ["cursor", "mouse", "arrow", "click"], glyph: `<path d="m6 5 12 5.2-5.2 1.6L11 17Z"/><path d="m12.8 11.8 4.2 4.2"/>` },
  hand: { label: "Hand", category: "interface", tags: ["grab", "pan", "drag", "stop"], glyph: `<path d="M8 12V7.5a1.3 1.3 0 0 1 2.6 0V11m0-4.5V6a1.3 1.3 0 0 1 2.6 0v5m0-4a1.3 1.3 0 0 1 2.6 0v4.5m0-2.5a1.3 1.3 0 0 1 2.6 0V14a5 5 0 0 1-5 5h-1.2a5 5 0 0 1-3.9-1.9L5.5 14a1.3 1.3 0 0 1 2-1.6L8 13"/>` },
  backspace: { label: "Backspace", category: "interface", tags: ["delete", "erase", "key"], glyph: `<path d="M9 6h9a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 18 18H9l-5-6Z"/><path d="m11.5 9.5 5 5m0-5-5 5"/>` },
  enter: { label: "Enter", category: "interface", tags: ["return", "key", "submit"], glyph: `<path d="M18 6v5a3 3 0 0 1-3 3H6"/><path d="m9.5 10.5-3.5 3.5 3.5 3.5"/>` },
  unlink: { label: "Unlink", category: "interface", tags: ["broken link", "detach", "remove link"], glyph: `<path d="M8.5 12.5 6.8 14.2a2.4 2.4 0 0 0 3.4 3.4l1.7-1.7m3.6-4.4 1.7-1.7a2.4 2.4 0 0 0-3.4-3.4l-1.7 1.7M9 5.5v2m-3.5 1.5h2M15 18.5v-2m3.5-1.5h-2"/>` },
  clipboardCheck: { label: "Clipboard check", category: "interface", tags: ["done", "task", "copied"], glyph: `<path d="M9 6H7.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H15"/><rect x="9" y="4.5" width="6" height="3" rx=".8"/><path d="m9.5 13 1.8 1.8 3.5-3.5"/>` },

  // Layout
  sidebarRight: { label: "Sidebar right", category: "layout", tags: ["panel", "drawer", "inspector"], glyph: `<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M14 5v14m2-10.5h1M16 11h1"/>` },
  columns: { label: "Columns", category: "layout", tags: ["split", "vertical", "panes"], glyph: `<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M12 5v14"/>` },
  rows: { label: "Rows", category: "layout", tags: ["split", "horizontal", "stack"], glyph: `<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M5 12h14"/>` },
  kanban: { label: "Kanban", category: "layout", tags: ["board", "tasks", "project"], glyph: `<rect x="5" y="5" width="14" height="14" rx="1.5"/><path d="M9 8.5v6m3-6v3m3-3v8"/>` },
  window: { label: "Window", category: "layout", tags: ["app", "browser", "modal"], glyph: `<rect x="4.5" y="5.5" width="15" height="13" rx="1.5"/><path d="M4.5 9h15M7 7.3h.01M9 7.3h.01"/>` },
  grip: { label: "Grip", category: "layout", tags: ["drag handle", "reorder", "move"], glyph: `<circle cx="9.5" cy="7" r="1.1" fill="#fff" stroke="none"/><circle cx="14.5" cy="7" r="1.1" fill="#fff" stroke="none"/><circle cx="9.5" cy="12" r="1.1" fill="#fff" stroke="none"/><circle cx="14.5" cy="12" r="1.1" fill="#fff" stroke="none"/><circle cx="9.5" cy="17" r="1.1" fill="#fff" stroke="none"/><circle cx="14.5" cy="17" r="1.1" fill="#fff" stroke="none"/>` },

  // Arrows
  arrowUpLeft: { label: "Arrow up left", category: "arrows", tags: ["diagonal", "northwest"], glyph: `<path d="M17 17 7 7m0 8V7h8"/>` },
  arrowDownRight: { label: "Arrow down right", category: "arrows", tags: ["diagonal", "southeast"], glyph: `<path d="m7 7 10 10m0-8v8H9"/>` },
  arrowDownLeft: { label: "Arrow down left", category: "arrows", tags: ["diagonal", "southwest"], glyph: `<path d="M17 7 7 17m0-8v8h8"/>` },
  chevronsLeft: { label: "Chevrons left", category: "arrows", tags: ["first", "rewind", "pagination"], glyph: `<path d="m12 7-5 5 5 5m6-10-5 5 5 5"/>` },
  chevronsRight: { label: "Chevrons right", category: "arrows", tags: ["last", "forward", "pagination"], glyph: `<path d="m6 7 5 5-5 5m6-10 5 5-5 5"/>` },
  chevronsUp: { label: "Chevrons up", category: "arrows", tags: ["top", "collapse"], glyph: `<path d="m7 12 5-5 5 5m-10 6 5-5 5 5"/>` },
  chevronsDown: { label: "Chevrons down", category: "arrows", tags: ["bottom", "expand"], glyph: `<path d="m7 6 5 5 5-5m-10 6 5 5 5-5"/>` },
  arrowLeftRight: { label: "Arrow left right", category: "arrows", tags: ["swap", "exchange", "transfer"], glyph: `<path d="M5 9h14m-3-3 3 3-3 3m3 3H5m3-3-3 3 3 3"/>` },
  rotateCw: { label: "Rotate clockwise", category: "arrows", tags: ["rotate", "turn", "redo"], glyph: `<path d="M18.3 14.5a6.5 6.5 0 1 1-1.6-6.9L19 10"/><path d="M19 5.5V10h-4.5"/>` },
  rotateCcw: { label: "Rotate counterclockwise", category: "arrows", tags: ["rotate", "turn", "undo"], glyph: `<path d="M5.7 14.5a6.5 6.5 0 1 0 1.6-6.9L5 10"/><path d="M5 5.5V10h4.5"/>` },

  // Editor
  listOrdered: { label: "Numbered list", category: "editor", tags: ["ordered list", "steps", "numbers"], glyph: `<path d="M11 7h8m-8 5h8m-8 5h8M6 6.5l1-.8v3.8M5.5 14.5a1 1 0 0 1 2 .2c0 .8-2 1.3-2 2.3h2"/>` },
  indent: { label: "Indent", category: "editor", tags: ["tab", "increase indent"], glyph: `<path d="M5 6h14m-8 4h8m-8 4h8M5 18h14M5 9.5 8 12l-3 2.5"/>` },
  outdent: { label: "Outdent", category: "editor", tags: ["decrease indent"], glyph: `<path d="M5 6h14m-8 4h8m-8 4h8M5 18h14M8 9.5 5 12l3 2.5"/>` },
  wrapText: { label: "Wrap text", category: "editor", tags: ["line break", "text flow"], glyph: `<path d="M5 7h14M5 12h11a2.5 2.5 0 0 1 0 5h-3m1.5-1.5L13 17l1.5 1.5M5 17h4"/>` },
  paragraph: { label: "Paragraph", category: "editor", tags: ["pilcrow", "text", "formatting"], glyph: `<path d="M13 5v14m4-14v14m1.5-14H11a4 4 0 0 0 0 8h2"/>` },

  // Design
  pipette: { label: "Pipette", category: "design", tags: ["eyedropper", "color picker", "sample"], glyph: `<path d="m13 8 3 3-7 7H6v-3Z"/><path d="m12 7 5 5m-2-6 1.3-1.3a2 2 0 0 1 2.9 2.9L17.9 9"/>` },
  paintBucket: { label: "Paint bucket", category: "design", tags: ["fill", "color", "paint"], glyph: `<path d="m6 11 6-6 6.5 6.5-6 6a1.5 1.5 0 0 1-2.1 0L6 13.1a1.5 1.5 0 0 1 0-2.1Z"/><path d="M6.5 11.5h12M8.5 5.5 11 8"/><path d="M19 14.5s1.5 1.8 1.5 2.8a1.5 1.5 0 0 1-3 0c0-1 1.5-2.8 1.5-2.8Z"/>` },
  penTool: { label: "Pen tool", category: "design", tags: ["vector", "bezier", "draw", "nib"], glyph: `<path d="M12 5.5 17 11l-2 6H9l-2-6Z"/><path d="M12 5.5V11M9 17v2h6v-2"/><circle cx="12" cy="12" r="1.2"/>` },
  highlighter: { label: "Highlighter", category: "design", tags: ["marker", "highlight", "annotate"], glyph: `<path d="m9 14 6.5-6.5a1.8 1.8 0 0 1 2.5 2.5L11.5 16.5"/><path d="m9 14-1.5 1.5 2.5 2.5 1.5-1.5m-4-1L5 18h3"/>` },
  eraser: { label: "Eraser", category: "design", tags: ["erase", "clear", "rubber"], glyph: `<path d="M8.5 18 5.5 15a1.5 1.5 0 0 1 0-2.1l7.4-7.4a1.5 1.5 0 0 1 2.1 0l3.5 3.5a1.5 1.5 0 0 1 0 2.1L12.5 18Z"/><path d="M9.5 9 15 14.5M12.5 18H19"/>` },
  ruler: { label: "Ruler", category: "design", tags: ["measure", "size", "scale"], glyph: `<rect x="4.5" y="9" width="15" height="6" rx="1" transform="rotate(-45 12 12)"/><path d="m6.7 13.1 1.8 1.7m.3-3.9 1.1 1.1m1-3.2 1.8 1.8m.3-3.9 1 1"/>` },
  frame: { label: "Frame", category: "design", tags: ["artboard", "crop marks", "canvas"], glyph: `<path d="M8 4.5v15m8-15v15M4.5 8h15m-15 8h15"/>` },
  contrast: { label: "Contrast", category: "design", tags: ["theme", "brightness", "half"], glyph: `<circle cx="12" cy="12" r="6.5"/><path d="M12 5.5a6.5 6.5 0 0 1 0 13Z" fill="#fff" stroke="none"/>` },
  circle: { label: "Circle", category: "design", tags: ["shape", "round", "radio"], glyph: `<circle cx="12" cy="12" r="6.5"/>` },
  square: { label: "Square", category: "design", tags: ["shape", "box", "checkbox"], glyph: `<rect x="5.5" y="5.5" width="13" height="13" rx="2"/>` },
  triangle: { label: "Triangle", category: "design", tags: ["shape", "delta"], glyph: `<path d="M12 5.5 19 18H5Z"/>` },
  hexagon: { label: "Hexagon", category: "design", tags: ["shape", "polygon", "honeycomb"], glyph: `<path d="m12 5 6 3.5v7L12 19l-6-3.5v-7Z"/>` },

  // Files
  filePlus: { label: "File plus", category: "files", tags: ["new file", "add", "create"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-4 3v5m-2.5-2.5h5"/>` },
  fileCheck: { label: "File check", category: "files", tags: ["approved", "done", "verified"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-6.5 5.5 1.7 1.7 3-3"/>` },
  fileCode: { label: "File code", category: "files", tags: ["script", "source", "developer"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-5 4-1.5 1.5L11 15m2-3 1.5 1.5L13 15"/>` },
  fileImage: { label: "File image", category: "files", tags: ["picture", "photo", "graphic"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-6.5 8.5 2-2.5 1.2 1.2 1.3-1.7 1 3M10.5 11h.01"/>` },
  fileSpreadsheet: { label: "Spreadsheet", category: "files", tags: ["excel", "csv", "table", "sheet"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-6 3h4v5h-4Zm0 2.5h4M12 11v5"/>` },
  fileArchive: { label: "File archive", category: "files", tags: ["zip", "compressed", "archive"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-5-3v1.5m0 1.5v1.5m0 1.5v1.5M10 14h2v2h-2Z"/>` },
  fileDown: { label: "File download", category: "files", tags: ["download", "save", "export"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-4 3v5m-2-2 2 2 2-2"/>` },
  fileLock: { label: "File lock", category: "files", tags: ["private", "protected", "secure"], glyph: `<path d="M8 5h5l3 3v11H8Z"/><path d="M13 5v3h3m-6 6h4v3h-4Zm1 0v-1a1 1 0 0 1 2 0v1"/>` },
  folderPlus: { label: "Folder plus", category: "files", tags: ["new folder", "add", "directory"], glyph: `<path d="M4.5 8a1.5 1.5 0 0 1 1.5-1.5h3.5l1.8 2H18a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 18 18H6a1.5 1.5 0 0 1-1.5-1.5Z"/><path d="M12 11v5m-2.5-2.5h5"/>` },

  // Development
  gitPullRequest: { label: "Pull request", category: "development", tags: ["git", "merge request", "review"], glyph: `<circle cx="7.5" cy="6.5" r="1.8"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/><path d="M7.5 8.3v7.4m9 0V10a2.5 2.5 0 0 0-2.5-2.5h-3m1.5-1.5L11 7.5 12.5 9"/>` },
  container: { label: "Container", category: "development", tags: ["docker", "shipping", "deploy"], glyph: `<rect x="4.5" y="7" width="15" height="10" rx="1"/><path d="M8 9.5v5m2.7-5v5m2.6-5v5m2.7-5v5"/>` },
  network: { label: "Network", category: "development", tags: ["topology", "nodes", "infrastructure"], glyph: `<rect x="9.5" y="4.5" width="5" height="4" rx=".8"/><rect x="4.5" y="15" width="5" height="4" rx=".8"/><rect x="14.5" y="15" width="5" height="4" rx=".8"/><path d="M12 8.5V12M7 15v-1.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V15"/>` },
  blocks: { label: "Blocks", category: "development", tags: ["modules", "integrations", "apps"], glyph: `<rect x="5" y="12" width="7" height="7" rx="1"/><rect x="12" y="12" width="7" height="7" rx="1"/><rect x="12" y="5" width="7" height="7" rx="1"/>` },
  bot: { label: "Bot", category: "development", tags: ["robot", "ai", "assistant", "automation"], glyph: `<rect x="5.5" y="8.5" width="13" height="9.5" rx="2.5"/><path d="M12 8.5v-3m-1 0h2m-3.5 7v1.5m5-1.5v1.5M3.5 13v2m17-2v2"/>` },
  cloudDownload: { label: "Cloud download", category: "development", tags: ["sync", "fetch", "download"], glyph: `<path d="M8.5 14H7a2.5 2.5 0 0 1 .5-5 4.5 4.5 0 0 1 8.7-1 3 3 0 0 1-.2 6h-1"/><path d="M12 10.5V18m-2.5-2.5L12 18l2.5-2.5"/>` },
  cloudUpload: { label: "Cloud upload", category: "development", tags: ["sync", "backup", "upload"], glyph: `<path d="M8.5 14H7a2.5 2.5 0 0 1 .5-5 4.5 4.5 0 0 1 8.7-1 3 3 0 0 1-.2 6h-1"/><path d="M12 18v-7.5M9.5 13l2.5-2.5 2.5 2.5"/>` },
  cloudOff: { label: "Cloud off", category: "development", tags: ["offline", "disconnected"], glyph: `<path d="M7 16h9a3 3 0 0 0 .2-6 4.5 4.5 0 0 0-8.7 1A2.5 2.5 0 0 0 7 16Z"/><path d="m5 5 14 14"/>` },

  // Devices
  batteryCharging: { label: "Battery charging", category: "devices", tags: ["power", "charge", "energy"], glyph: `<rect x="4.5" y="8" width="13" height="8" rx="1.5"/><path d="M19.5 10.5v3m-8-4-2 2.5h3l-2 2.5"/>` },
  batteryLow: { label: "Battery low", category: "devices", tags: ["power", "empty", "warning"], glyph: `<rect x="4.5" y="8" width="13" height="8" rx="1.5"/><path d="M19.5 10.5v3"/><path d="M7 10.5h2.5v3H7Z" fill="#fff" stroke="none"/>` },
  wifiOff: { label: "Wifi off", category: "devices", tags: ["offline", "no signal", "disconnected"], glyph: `<path d="M6 10a8.5 8.5 0 0 1 5-2.4m3.5.4A8.5 8.5 0 0 1 18 10m-9 3a4.2 4.2 0 0 1 3-1.2m0 4.2h.01M5 5l14 14"/>` },
  speaker: { label: "Speaker", category: "devices", tags: ["audio", "sound", "music"], glyph: `<rect x="7" y="4.5" width="10" height="14.5" rx="2"/><circle cx="12" cy="14" r="2.5"/><path d="M12 8h.01"/>` },
  webcam: { label: "Webcam", category: "devices", tags: ["camera", "video call", "meeting"], glyph: `<circle cx="12" cy="10" r="5"/><circle cx="12" cy="10" r="1.8"/><path d="M8.5 18.5h7M12 15v3.5"/>` },
  router: { label: "Router", category: "devices", tags: ["network", "internet", "modem"], glyph: `<rect x="4.5" y="13" width="15" height="5.5" rx="1.5"/><path d="M7.5 15.8h.01m3 0h.01M16 13V9.5m-2.5-2a3.5 3.5 0 0 1 5 0M12 5.5a6 6 0 0 1 8 0"/>` },
  usb: { label: "USB", category: "devices", tags: ["port", "connection", "cable"], glyph: `<path d="M12 5.5v11m0-11-1.5 2h3ZM8 10.5V12l4 2.5 4-2V10"/><circle cx="12" cy="17.5" r="1.5"/><path d="M7 8.5h2v2H7Z"/><circle cx="16" cy="9" r="1.1"/>` },
  cast: { label: "Cast", category: "devices", tags: ["screen mirror", "chromecast", "stream"], glyph: `<path d="M5 8V7a1.5 1.5 0 0 1 1.5-1.5h11A1.5 1.5 0 0 1 19 7v10a1.5 1.5 0 0 1-1.5 1.5H13"/><path d="M5 12a6.5 6.5 0 0 1 6.5 6.5M5 15.2a3.3 3.3 0 0 1 3.3 3.3M5 18.5h.01"/>` },

  // Media
  playCircle: { label: "Play circle", category: "media", tags: ["start", "video", "watch"], glyph: `<circle cx="12" cy="12" r="6.5"/><path d="m10.5 9.5 4 2.5-4 2.5Z"/>` },
  rewind: { label: "Rewind", category: "media", tags: ["back", "previous"], glyph: `<path d="M12 7.5 6 12l6 4.5Zm7 0L13 12l6 4.5Z"/>` },
  fastForward: { label: "Fast forward", category: "media", tags: ["skip", "next", "speed"], glyph: `<path d="m12 7.5 6 4.5-6 4.5Zm-7 0 6 4.5-6 4.5Z"/>` },
  volumeHigh: { label: "Volume high", category: "media", tags: ["sound", "loud", "audio"], glyph: `<path d="M5 10h3l4-3v10l-4-3H5Z"/><path d="M15 10a3 3 0 0 1 0 4m2.5-6.5a6.5 6.5 0 0 1 0 9"/>` },
  micOff: { label: "Mic off", category: "media", tags: ["mute", "microphone", "silent"], glyph: `<rect x="10" y="6" width="4" height="8" rx="2"/><path d="M8 12a4 4 0 0 0 6.5 3.1M16 12v-.5M12 16v3M5 5l14 14"/>` },
  videoOff: { label: "Video off", category: "media", tags: ["camera off", "no video"], glyph: `<rect x="5" y="8" width="9" height="8" rx="1"/><path d="m14 11 4.5-2.5v7L14 13M5 5l14 14"/>` },
  disc: { label: "Disc", category: "media", tags: ["album", "cd", "vinyl", "record"], glyph: `<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.8"/><path d="M8.2 10a4.2 4.2 0 0 1 2-2"/>` },
  playlist: { label: "Playlist", category: "media", tags: ["queue", "music list", "tracks"], glyph: `<path d="M5 7h10M5 11h10M5 15h5"/><path d="m13 12.5 5.5 3-5.5 3Z"/>` },
  clapperboard: { label: "Clapperboard", category: "media", tags: ["film", "movie", "production"], glyph: `<path d="M5 10h14v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5Z"/><path d="m5 10-.5-3 13.5-2.5.5 3M8.5 6.2l2 3.2m2.5-4 2 3.2"/>` },
  aperture: { label: "Aperture", category: "media", tags: ["lens", "shutter", "photography"], glyph: `<circle cx="12" cy="12" r="6.5"/><path d="m14.5 6-5 8.7M18 11H9.5m6 6.5-3.8-6.6m-2.2 7.1 5-8.7M6 13h8.5M8.5 6.5l3.8 6.6"/>` },
  gallery: { label: "Gallery", category: "media", tags: ["images", "photos", "album"], glyph: `<rect x="8" y="5" width="11" height="10" rx="1.2"/><path d="M5 8.5V17a1.5 1.5 0 0 0 1.5 1.5H15M10 13l2.5-2.5 1.5 1.5 1.5-1.5 2.5 2.5"/><circle cx="11.5" cy="8.3" r=".9"/>` },
  captions: { label: "Captions", category: "media", tags: ["subtitles", "cc", "accessibility"], glyph: `<rect x="4.5" y="6.5" width="15" height="11" rx="2"/><path d="M11 10.3a2 2 0 1 0 0 3.4m6-3.4a2 2 0 1 0 0 3.4"/>` },
  pictureInPicture: { label: "Picture in picture", category: "media", tags: ["pip", "mini player", "overlay"], glyph: `<rect x="4.5" y="6" width="15" height="12" rx="1.5"/><rect x="11.5" y="11.5" width="5.5" height="4" rx=".8"/>` },
  screenShare: { label: "Screen share", category: "media", tags: ["present", "share screen", "meeting"], glyph: `<rect x="4.5" y="5.5" width="15" height="10" rx="1.5"/><path d="M9.5 19h5M12 15.5V19m0-6V8m-2 2 2-2 2 2"/>` },

  // Communication
  bellRing: { label: "Bell ring", category: "communication", tags: ["notification", "alarm", "ringing"], glyph: `<path d="M8 15v-4a4 4 0 0 1 8 0v4l1.5 2h-11Z"/><path d="M10.5 19h3M5 8.5a6 6 0 0 1 1.8-3M19 8.5a6 6 0 0 0-1.8-3"/>` },
  mailOpen: { label: "Mail open", category: "communication", tags: ["read", "email", "envelope"], glyph: `<path d="M5 10.5v7a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-7L12 5.5Z"/><path d="m5 10.5 7 4.5 7-4.5"/>` },
  messageCircle: { label: "Message circle", category: "communication", tags: ["chat", "comment", "bubble"], glyph: `<path d="M12 5.5a6.5 6.5 0 0 1 0 13 6.4 6.4 0 0 1-3-.7l-3.5 1 1-3.3A6.5 6.5 0 0 1 12 5.5Z"/>` },
  messages: { label: "Messages", category: "communication", tags: ["conversation", "chat", "discussion"], glyph: `<path d="M6.5 5h7A1.5 1.5 0 0 1 15 6.5V11a1.5 1.5 0 0 1-1.5 1.5H9l-4 3V6.5A1.5 1.5 0 0 1 6.5 5Z"/><path d="M17.5 9.5h.5a1.5 1.5 0 0 1 1.5 1.5v8l-3-2.5h-5A1.5 1.5 0 0 1 10 15v-.5"/>` },
  phoneOff: { label: "Phone off", category: "communication", tags: ["hang up", "end call", "decline"], glyph: `<path d="M8.2 5.5 6.3 5.3A1.3 1.3 0 0 0 4.9 6.7c.3 6.7 5.7 12.1 12.4 12.4a1.3 1.3 0 0 0 1.4-1.4l-.2-1.9a1 1 0 0 0-.7-.9l-2.3-.8a1 1 0 0 0-1 .2l-1.3 1.1a9 9 0 0 1-4.6-4.6l1.1-1.3a1 1 0 0 0 .2-1l-.8-2.3a1 1 0 0 0-.9-.7Z"/><path d="m19 5-6 6"/>` },
  contactBook: { label: "Contacts", category: "communication", tags: ["address book", "people", "directory"], glyph: `<rect x="6" y="4.5" width="12" height="14.5" rx="1.5"/><circle cx="12" cy="10" r="2"/><path d="M9 15.5c.5-1.6 1.5-2.5 3-2.5s2.5.9 3 2.5M4.5 8h3m-3 3.5h3m-3 3.5h3"/>` },
  languages: { label: "Languages", category: "communication", tags: ["translate", "localization", "i18n"], glyph: `<path d="M5 7h7M8.5 5.5V7c0 3-1.5 5.5-3.5 7m1.5-4c1 2 2.5 3 4.5 3.5"/><path d="m12 19 3-7 3 7m-5-2h4"/>` },

  // People
  userCircle: { label: "User circle", category: "people", tags: ["account", "profile", "avatar"], glyph: `<circle cx="12" cy="12" r="7"/><circle cx="12" cy="10.5" r="2.3"/><path d="M8 16.8c.8-1.5 2.2-2.3 4-2.3s3.2.8 4 2.3"/>` },
  userMinus: { label: "User minus", category: "people", tags: ["remove user", "unfollow", "person"], glyph: `<circle cx="10" cy="9" r="2.5"/><path d="M5.5 18c.5-3 2-4.5 4.5-4.5s4 1.5 4.5 4.5m1.5-5h4.5"/>` },
  person: { label: "Person", category: "people", tags: ["human", "standing", "individual"], glyph: `<circle cx="12" cy="5.8" r="1.6"/><path d="M8 10h8m-4 0v4m-2.5 5 2.5-5 2.5 5"/>` },
  accessibility: { label: "Accessibility", category: "people", tags: ["wheelchair", "a11y", "disability"], glyph: `<g transform="translate(0 -1)"><circle cx="13" cy="5.5" r="1.4"/><path d="m8 9.5 4.5-1.5 2 1-1 4H17l1.5 4.5M13.5 13h-3"/><path d="M9.5 12.5a4 4 0 1 0 4.8 5"/></g>` },
  idCard: { label: "ID card", category: "people", tags: ["identity", "badge", "license"], glyph: `<rect x="4.5" y="6" width="15" height="12" rx="1.5"/><circle cx="9.5" cy="11" r="1.8"/><path d="M7 15.5c.4-1.3 1.3-2 2.5-2s2.1.7 2.5 2M14 10h3m-3 3h3"/>` },

  // Security
  shieldCheck: { label: "Shield check", category: "security", tags: ["secure", "protected", "verified"], glyph: `<path d="M12 5 18 7v5c0 3.6-2.5 5.7-6 7-3.5-1.3-6-3.4-6-7V7Z"/><path d="m9.5 12 1.8 1.8 3.2-3.3"/>` },
  shieldAlert: { label: "Shield alert", category: "security", tags: ["threat", "warning", "unsafe"], glyph: `<path d="M12 5 18 7v5c0 3.6-2.5 5.7-6 7-3.5-1.3-6-3.4-6-7V7Z"/><path d="M12 9v3.5m0 2.5h.01"/>` },
  fingerprint: { label: "Fingerprint", category: "security", tags: ["biometric", "touch id", "identity"], glyph: `<path d="M8 17.5c.5-1 .8-2.3.8-3.5v-2a3.2 3.2 0 0 1 6.4 0v1.5M12 12v2.5c0 1.8-.6 3.4-1.5 4.7m4.7-3.2c-.2 1-.5 2-1 2.8M6 14.5V12a6 6 0 0 1 10.5-4M18 11v1.5"/>` },
  scanFace: { label: "Face ID", category: "security", tags: ["face scan", "biometric", "recognition"], glyph: `<path d="M5 9V6.5A1.5 1.5 0 0 1 6.5 5H9m6 0h2.5A1.5 1.5 0 0 1 19 6.5V9m0 6v2.5a1.5 1.5 0 0 1-1.5 1.5H15m-6 0H6.5A1.5 1.5 0 0 1 5 17.5V15m4.5-.5c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1M10 10h.01M14 10h.01"/>` },

  // Time
  alarmClock: { label: "Alarm clock", category: "time", tags: ["wake up", "reminder", "alert"], glyph: `<circle cx="12" cy="13" r="5.5"/><path d="M12 10.5V13l1.8 1.2M5 7l2.5-2m11.5 2-2.5-2M8 18.5 7 19.5m9-1 1 1"/>` },
  timer: { label: "Timer", category: "time", tags: ["stopwatch", "countdown", "duration"], glyph: `<circle cx="12" cy="13" r="5.5"/><path d="M10 4.5h4m-2 0v3m0 5.5 2-2m3-3.5 1.2-1.2"/>` },
  calendarPlus: { label: "Calendar plus", category: "time", tags: ["add event", "schedule", "new"], glyph: `<rect x="5.5" y="6.5" width="13" height="12" rx="1.5"/><path d="M5.5 10h13M9 5v3m6-3v3m-3 4v4.5m-2.25-2.25h4.5"/>` },
  calendarCheck: { label: "Calendar check", category: "time", tags: ["event done", "booked", "confirmed"], glyph: `<rect x="5.5" y="6.5" width="13" height="12" rx="1.5"/><path d="M5.5 10h13M9 5v3m6-3v3m-5.5 6.3 1.7 1.7 3.3-3.3"/>` },

  // Commerce
  euro: { label: "Euro", category: "commerce", tags: ["money", "currency", "eur"], glyph: `<path d="M17 7.5a5.5 5.5 0 1 0 0 9M5.5 10.5h7m-7 3h7"/>` },
  piggyBank: { label: "Piggy bank", category: "commerce", tags: ["savings", "money", "budget"], glyph: `<path d="M6 11.5a5.5 4.5 0 0 1 5.5-4.5h2a5 5 0 0 1 4.3 2.5H19v4h-1.4a5 5 0 0 1-1.6 2V18h-2.5v-1.5h-3V18H8v-2.7a4.6 4.6 0 0 1-2-3.8Z"/><path d="M14.5 10h.01M6 11.5c-1 0-1.5-.5-1.5-1.5"/>` },
  bank: { label: "Bank", category: "commerce", tags: ["landmark", "finance", "institution"], glyph: `<path d="M5 9.5 12 5l7 4.5ZM6 19h12M7 11v5.5m3.3-5.5v5.5m3.4-5.5v5.5M17 11v5.5"/>` },
  discount: { label: "Discount", category: "commerce", tags: ["sale", "percent", "badge", "offer"], glyph: `<path d="m12 5 2 1.5h2.5V9l1.5 3-1.5 3v2.5H14L12 19l-2-1.5H7.5V15L6 12l1.5-3V6.5H10Z"/><path d="m9.8 14.2 4.4-4.4M9.8 10h.01m4.4 4.2h.01"/>` },
  basket: { label: "Basket", category: "commerce", tags: ["shopping", "groceries", "cart"], glyph: `<path d="M5 10h14l-1.5 8h-11Z"/><path d="m8.5 10 2.5-5m4.5 5L13 5m-3.5 8v2.5m5-2.5v2.5"/>` },
  lineChart: { label: "Line chart", category: "commerce", tags: ["analytics", "graph", "stats"], glyph: `<path d="M5 5v14h14"/><path d="m8 14 3-3.5 2.5 2 4.5-5"/>` },
  gauge: { label: "Gauge", category: "commerce", tags: ["speed", "performance", "meter", "dashboard"], glyph: `<path d="M5.5 16a7 7 0 1 1 13 0"/><path d="m12 13 3-4"/><circle cx="12" cy="13.5" r="1" fill="#fff" stroke="none"/>` },
  presentation: { label: "Presentation", category: "commerce", tags: ["slides", "board", "meeting"], glyph: `<path d="M4.5 5.5h15m-14 0v8a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-8M12 14.5v2m-3 2.5 3-2.5 3 2.5"/>` },
  barcode: { label: "Barcode", category: "commerce", tags: ["scan", "product", "sku"], glyph: `<path d="M5.5 6v12M8 6v12m3-12v12m2.5-12v12m3-12v12m2-12v12"/>` },
  packageCheck: { label: "Package delivered", category: "commerce", tags: ["delivered", "shipping", "order"], glyph: `<path d="m5 8 5-3 5 3v7l-5 3-5-3Z"/><path d="m5 8 5 3 5-3m-5 3v7m5-1.5 1.5 1.5 3-3"/>` },

  // Travel
  signpost: { label: "Signpost", category: "travel", tags: ["direction", "way", "guide"], glyph: `<path d="M12 4.5v15M6 7h9.5l2 2-2 2H6Zm12 6H9.5l-2 2 2 2H18"/>` },
  bed: { label: "Bed", category: "travel", tags: ["hotel", "sleep", "rest"], glyph: `<path d="M4.5 18V6.5m0 7.5h15v4m0-4v-2.5a2 2 0 0 0-2-2H11v4.5"/><circle cx="7.8" cy="11.3" r="1.5"/>` },
  fuel: { label: "Fuel", category: "travel", tags: ["gas station", "petrol", "energy"], glyph: `<path d="M6 19V6.5A1.5 1.5 0 0 1 7.5 5h5A1.5 1.5 0 0 1 14 6.5V19M5 19h10M6 10h8m0 1h1.5a1.5 1.5 0 0 1 1.5 1.5v3a1 1 0 0 0 2 0V9l-2-2"/>` },
  parking: { label: "Parking", category: "travel", tags: ["car park", "garage", "p"], glyph: `<rect x="5.5" y="5.5" width="13" height="13" rx="2"/><path d="M10 16V8.5h2.5a2.2 2.2 0 0 1 0 4.4H10"/>` },
  trafficCone: { label: "Traffic cone", category: "travel", tags: ["construction", "caution", "roadwork"], glyph: `<path d="M10.5 5h3l3.5 12H7Z"/><path d="M9.3 9.5h5.4m-6.5 4h7.6M5 17.5h14"/>` },
  planeTakeoff: { label: "Departure", category: "travel", tags: ["plane takeoff", "flight", "airport"], glyph: `<path d="M4.5 19h15"/><path d="m5 13.5 2.5 2.3 11-4.3a1.6 1.6 0 0 0-1.1-3l-3.4 1.2-5-3.3-1.7.7 3 4-3 1.1-1.5-1.1Z"/>` },
  passport: { label: "Passport", category: "travel", tags: ["travel document", "identity", "visa"], glyph: `<rect x="6" y="4.5" width="12" height="14.5" rx="1.5"/><circle cx="12" cy="10.5" r="2.8"/><path d="M9.2 10.5h5.6M12 7.7c-.8.8-1.2 1.7-1.2 2.8s.4 2 1.2 2.8c.8-.8 1.2-1.7 1.2-2.8s-.4-2-1.2-2.8M9.5 16h5"/>` },
  school: { label: "School", category: "travel", tags: ["education", "building", "campus"], glyph: `<path d="M4.5 19h15M6 19v-8.5h12V19M12 5l7 5.5H5Z"/><path d="M10.5 19v-3.5h3V19"/>` },
  factory: { label: "Factory", category: "travel", tags: ["industry", "manufacturing", "plant"], glyph: `<path d="M4.5 19v-8L9 8v3l4.5-3v3L18 8V5h1.5v14Z"/><path d="M8 15h1m3 0h1m3 0h1"/>` },

  // Feedback
  starHalf: { label: "Star half", category: "feedback", tags: ["rating", "review", "half"], glyph: `<path d="m12 5 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7L5.2 10l4.7-.7Z"/><path d="M12 5v10.8L7.8 18l.8-4.7L5.2 10l4.7-.7Z" fill="#fff" stroke="none"/>` },
  alertOctagon: { label: "Alert octagon", category: "feedback", tags: ["stop", "error", "danger"], glyph: `<path d="M9.3 5h5.4L19 9.3v5.4L14.7 19H9.3L5 14.7V9.3Z"/><path d="M12 8.5v4m0 3h.01"/>` },
  laugh: { label: "Laugh", category: "feedback", tags: ["happy", "joy", "emoji"], glyph: `<circle cx="12" cy="12" r="6"/><path d="M9 13h6a3 3 0 0 1-6 0Zm.5-3h.01m5 0h.01"/>` },
  party: { label: "Party", category: "feedback", tags: ["celebrate", "confetti", "congrats"], glyph: `<path d="m5 19 3.5-9.5 6 6Z"/><path d="M12 7.5c0-1 .5-2 1.5-2.5m3 7c1 0 2-.5 2.5-1.5M15 5h.01M19 8.5h.01M17 7l1-1m-6.5 5.5 1-2"/>` },

  // Health
  hospital: { label: "Hospital", category: "health", tags: ["clinic", "medical", "emergency"], glyph: `<rect x="5.5" y="5" width="13" height="14" rx="1.5"/><path d="M12 8v5m-2.5-2.5h5M10 19v-3h4v3"/>` },
  syringe: { label: "Syringe", category: "health", tags: ["vaccine", "injection", "needle"], glyph: `<path d="m15.5 6.5 2 2-8 8-2-2Z"/><path d="m16.5 7.5 2-2m-1-1 2 2m-11 9-3 3m7-9 1 1m-3 1 1 1"/>` },
  brain: { label: "Brain", category: "health", tags: ["mind", "think", "neuroscience", "ai"], glyph: `<path d="M12 6.5a2.5 2.5 0 0 0-4.5-.5A2.5 2.5 0 0 0 5.5 9a2.5 2.5 0 0 0 0 4 2.5 2.5 0 0 0 2 3.5 2.5 2.5 0 0 0 4.5 1Zm0 0a2.5 2.5 0 0 1 4.5-.5A2.5 2.5 0 0 1 18.5 9a2.5 2.5 0 0 1 0 4 2.5 2.5 0 0 1-2 3.5 2.5 2.5 0 0 1-4.5 1"/>` },
  dna: { label: "DNA", category: "health", tags: ["genetics", "biology", "helix"], glyph: `<path d="M8 5c0 4.5 8 4.5 8 7s-8 2.5-8 7m8-14c0 4.5-8 4.5-8 7s8 2.5 8 7M9 7h6M9 17h6m-4.8-7.5h3.6m-3.6 5h3.6"/>` },
  ambulance: { label: "Ambulance", category: "health", tags: ["emergency", "paramedic", "vehicle"], glyph: `<path d="M6.2 16.5H4.5V8a1 1 0 0 1 1-1H14v9.5m0-6.5h3l2.5 3v3.5h-1.7M14 16.5h-4.2"/><circle cx="8" cy="16.5" r="1.8"/><circle cx="16" cy="16.5" r="1.8"/><path d="M9.3 9.5v3m-1.5-1.5h3"/>` },
  microscope: { label: "Microscope", category: "health", tags: ["lab", "science", "research"], glyph: `<path d="M5.5 19h13m-3.5 0a5.5 5.5 0 0 0-3-9.6M5.5 15.5H12"/><path d="m9 4.5 2.6 1.5-3 5.2L6 9.7Z"/><path d="m7.3 11-1 1.8"/>` },

  // Food
  utensils: { label: "Utensils", category: "food", tags: ["restaurant", "fork", "knife", "dining"], glyph: `<path d="M6 5v14M4.5 5v3.5a1.5 1.5 0 0 0 3 0V5"/><path d="M17 19V5c-2 1-3 3.5-3 6.5V13h3"/>` },
  pizza: { label: "Pizza", category: "food", tags: ["slice", "fast food", "italian"], glyph: `<path d="M12 19 5 7.5a13 13 0 0 1 14 0Z"/><path d="M6.3 9.7a11 11 0 0 1 11.4 0"/><circle cx="10.5" cy="11.5" r=".9" fill="#fff" stroke="none"/><circle cx="13.5" cy="13.5" r=".9" fill="#fff" stroke="none"/><circle cx="12.8" cy="10.5" r=".7" fill="#fff" stroke="none"/>` },
  apple: { label: "Apple", category: "food", tags: ["fruit", "healthy", "snack"], glyph: `<path d="M12 8.5c-1.5-1-5.5-1.3-6 3 0 4 2.5 7.5 4.5 7.5.7 0 1-.3 1.5-.3s.8.3 1.5.3c2 0 4.5-3.5 4.5-7.5-.5-4.3-4.5-4-6-3Z"/><path d="M12 8.5c0-1.7.8-3 2.5-3.5"/>` },
  cake: { label: "Cake", category: "food", tags: ["birthday", "dessert", "celebration"], glyph: `<path d="M5 19h14M6 19v-6a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 18 13v6M6 15.5c1 .8 2 .8 3 0s2-.8 3 0 2 .8 3 0 2-.8 3 0M9 11.5V9m3 2.5V9m3 2.5V9M9 6.5v.01m3-.01v.01m3-.01v.01"/>` },
  wine: { label: "Wine", category: "food", tags: ["glass", "drink", "bar"], glyph: `<path d="M8.5 5h7l.5 4a4 4 0 0 1-8 0Z"/><path d="M12 13v6m-3 0h6M8.2 8h7.6"/>` },
  beer: { label: "Beer", category: "food", tags: ["mug", "drink", "pub"], glyph: `<path d="M7 8h8v9.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 7 17.5Z"/><path d="M15 10h1.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H15M7 8a2 2 0 0 1 1.5-3.2 2.2 2.2 0 0 1 3.8-.3A2 2 0 0 1 15 6.5V8m-5 3v5m3-5v5"/>` },
  iceCream: { label: "Ice cream", category: "food", tags: ["dessert", "cone", "sweet"], glyph: `<path d="m8 11.5 4 7.5 4-7.5M10 14.5h4"/><path d="M7.5 11.5a4.5 4.5 0 1 1 9 0Z"/>` },
  cherry: { label: "Cherry", category: "food", tags: ["fruit", "berry"], glyph: `<circle cx="8" cy="15.5" r="3"/><circle cx="16" cy="15.5" r="3"/><path d="M8 12.5c1-3 2.5-5.5 5-7.5 1 2.5 2.2 4.5 3 7.5M13 5l3-.5"/>` },
  egg: { label: "Egg", category: "food", tags: ["breakfast", "protein"], glyph: `<path d="M12 5c-3 0-5.5 5-5.5 8.5A5.5 5.5 0 0 0 12 19a5.5 5.5 0 0 0 5.5-5.5C17.5 10 15 5 12 5Z"/>` },
  burger: { label: "Burger", category: "food", tags: ["hamburger", "fast food", "sandwich"], glyph: `<path d="M5.5 11a6.5 5 0 0 1 13 0Z"/><path d="M5 14h14M5.5 16.5h13a1 1 0 0 1-1 2h-11a1 1 0 0 1-1-2ZM9 8.5h.01M12 7.5h.01M15 8.5h.01"/>` },
  cookie: { label: "Cookie", category: "food", tags: ["biscuit", "snack", "consent"], glyph: `<path d="M12 5a7 7 0 1 0 7 7 2.5 2.5 0 0 1-3-3 2.5 2.5 0 0 1-4-4Z"/><path d="M9 11h.01M11 15h.01M15 14h.01M8.5 14.5h.01"/>` },
  chefHat: { label: "Chef hat", category: "food", tags: ["cooking", "kitchen", "recipe"], glyph: `<path d="M8 14v-1.5A3 3 0 0 1 8.7 7a3.3 3.3 0 0 1 6.6 0 3 3 0 0 1 .7 5.5V14Z"/><path d="M8 14v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4M8 16h8"/>` },

  // Games
  dumbbell: { label: "Dumbbell", category: "games", tags: ["fitness", "gym", "workout"], glyph: `<rect x="6.5" y="7" width="2.5" height="10" rx="1"/><rect x="15" y="7" width="2.5" height="10" rx="1"/><path d="M9 12h6m-8.5-2.5h-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1m11-5h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1"/>` },
  medal: { label: "Medal", category: "games", tags: ["winner", "prize", "achievement"], glyph: `<circle cx="12" cy="14.5" r="4.5"/><path d="m9 10.8-3-5.8h4l2 3.5m3 2.3 3-5.8h-4l-1 1.8M12 12.5v4"/>` },
  ball: { label: "Ball", category: "games", tags: ["basketball", "sports", "play"], glyph: `<circle cx="12" cy="12" r="6.5"/><path d="M5.5 12h13M12 5.5v13M7.4 7.4a6.5 6.5 0 0 1 0 9.2m9.2-9.2a6.5 6.5 0 0 0 0 9.2"/>` },
  puzzle: { label: "Puzzle", category: "games", tags: ["piece", "plugin", "extension"], glyph: `<path d="M6 7h3.5a2 2 0 1 1 4 0H17v3.5a2 2 0 1 1 0 4V18H6v-3.5a2 2 0 1 0 0-4Z"/>` },

  // Math
  infinity: { label: "Infinity", category: "math", tags: ["forever", "unlimited", "loop"], glyph: `<path d="M12 12c-1.5-2-3-3-4.5-3a3 3 0 0 0 0 6c1.5 0 3-1 4.5-3s3-3 4.5-3a3 3 0 0 1 0 6c-1.5 0-3-1-4.5-3Z"/>` },
  divide: { label: "Divide", category: "math", tags: ["division", "operator"], glyph: `<path d="M6 12h12"/><circle cx="12" cy="7.5" r="1.2" fill="#fff" stroke="none"/><circle cx="12" cy="16.5" r="1.2" fill="#fff" stroke="none"/>` },
  equal: { label: "Equal", category: "math", tags: ["equals", "operator", "same"], glyph: `<path d="M6 9.5h12m-12 5h12"/>` },
  sigma: { label: "Sigma", category: "math", tags: ["sum", "total", "summation"], glyph: `<path d="M17 7V5.5H7l5 6.5-5 6.5h10V17"/>` },
  pi: { label: "Pi", category: "math", tags: ["constant", "circle", "number"], glyph: `<path d="M6 8h12M9.5 8v10M15 8v8a1.5 1.5 0 0 0 2.5 1"/>` },

  // Weather
  cloudSun: { label: "Partly cloudy", category: "weather", tags: ["cloud sun", "forecast", "mild"], glyph: `<path d="M8.5 18H16a3 3 0 0 0 .2-6 4.5 4.5 0 0 0-7.9-.4A3.2 3.2 0 0 0 8.5 18Z"/><path d="M8.2 9.2a3 3 0 0 0-2.8 3.2M7.5 4.5v1.2M3.9 6.2l.9.9M3 10h1.2"/>` },
  cloudLightning: { label: "Storm", category: "weather", tags: ["thunder", "lightning", "cloud"], glyph: `<path d="M7.5 14H16a3 3 0 0 0 .2-6 4.5 4.5 0 0 0-8.7 1A2.5 2.5 0 0 0 7.5 14Z"/><path d="m12.5 12.5-2 3.5h3l-2 3.5"/>` },
  cloudSnow: { label: "Snow", category: "weather", tags: ["winter", "cloud", "cold"], glyph: `<path d="M7.5 14H16a3 3 0 0 0 .2-6 4.5 4.5 0 0 0-8.7 1A2.5 2.5 0 0 0 7.5 14Z"/><path d="M9 16.5h.01M12 16.5h.01M15 16.5h.01M10.5 18.5h.01M13.5 18.5h.01"/>` },
  sunrise: { label: "Sunrise", category: "weather", tags: ["morning", "dawn"], glyph: `<path d="M12 5v4M9.5 7.5 12 5l2.5 2.5M5 18.5h14m-11.5-3a4.5 4.5 0 0 1 9 0m-11-3 1.2.8m12.8-.8-1.2.8"/>` },
  sunset: { label: "Sunset", category: "weather", tags: ["evening", "dusk"], glyph: `<path d="M12 9V5M9.5 6.5 12 9l2.5-2.5M5 18.5h14m-11.5-3a4.5 4.5 0 0 1 9 0m-11-3 1.2.8m12.8-.8-1.2.8"/>` },
  rainbow: { label: "Rainbow", category: "weather", tags: ["colorful", "pride", "after rain"], glyph: `<path d="M4.5 16a7.5 7.5 0 0 1 15 0m-12 0a4.5 4.5 0 0 1 9 0m-6 0a1.5 1.5 0 0 1 3 0"/>` },

  // Nature
  waves: { label: "Waves", category: "nature", tags: ["water", "ocean", "sea"], glyph: `<path d="M5 9c1.2 0 1.2-1 2.3-1s1.2 1 2.4 1 1.2-1 2.3-1 1.2 1 2.4 1 1.2-1 2.3-1 1.1 1 2.3 1M5 13c1.2 0 1.2-1 2.3-1s1.2 1 2.4 1 1.2-1 2.3-1 1.2 1 2.4 1 1.2-1 2.3-1 1.1 1 2.3 1M5 17c1.2 0 1.2-1 2.3-1s1.2 1 2.4 1 1.2-1 2.3-1 1.2 1 2.4 1 1.2-1 2.3-1 1.1 1 2.3 1"/>` },
  flower: { label: "Flower", category: "nature", tags: ["tulip", "spring", "garden"], glyph: `<path d="M12 19v-7"/><path d="M8 5.5 10 7.5 12 5l2 2.5 2-2V9a4 4 0 0 1-8 0Z"/><path d="M12 16c-1.5-2-3.5-2.5-5-2 .5 1.8 2.5 3 5 2Zm0 0c1.5-2 3.5-2.5 5-2-.5 1.8-2.5 3-5 2Z"/>` },
  feather: { label: "Feather", category: "nature", tags: ["light", "quill", "write"], glyph: `<path d="M18 6c-4-1.5-9 0-10.5 5.5L7 17l5.5-.5C18 15 19.5 10 18 6Z"/><path d="M5.5 19 15 9.5M8.5 13H13"/>` },
  recycle: { label: "Recycle", category: "nature", tags: ["sustainability", "eco", "reuse"], glyph: `<path d="M7 13.5 5.5 16a1.5 1.5 0 0 0 1.3 2.3H10M8.3 9.8l2.4-4.1a1.5 1.5 0 0 1 2.6 0l1.2 2.1M16 12l1.5 2.5a1.5 1.5 0 0 1-1.3 2.3h-2.7"/><path d="m8.5 16.8 1.5 1.5-1.5 1.5M6.2 9.5l2.1.3.6-2m8.4 1.6-1.2 2.6-2.4-.9"/>` },
  palmTree: { label: "Palm tree", category: "nature", tags: ["beach", "tropical", "vacation"], glyph: `<path d="M12.5 19c0-4-1-7-2.5-9.5"/><path d="M10 9.5c-1.5-2.5-4-3-5.5-2 2 0 3.5.8 4.5 2.5m1-.5c.5-2.5 3-4 5.5-3.5-1.5.5-3 1.5-4 3m-1.5.5c2.5-.5 5 .5 6 2.5-1.5-.8-3.5-1-5-.5m-1-2c-2.5.5-4 2.5-4 4.5.8-1.5 2-2.5 3.5-3M8.5 19h8"/>` },
  paw: { label: "Paw", category: "nature", tags: ["pet", "animal", "dog", "cat"], glyph: `<circle cx="8" cy="10" r="1.6"/><circle cx="11" cy="7" r="1.6"/><circle cx="15" cy="7.5" r="1.6"/><circle cx="17.5" cy="11" r="1.6"/><path d="M12.5 11c-2 0-5 3.5-5 5.5 0 1.5 1.2 2.5 2.5 2.5 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5c1.3 0 2.5-1 2.5-2.5 0-2-3-5.5-5-5.5Z"/>` },
  fish: { label: "Fish", category: "nature", tags: ["animal", "sea", "seafood"], glyph: `<path d="M5 12c2.5-3.5 6-5 9-5 2.5 0 4.5 2 5 5-.5 3-2.5 5-5 5-3 0-6.5-1.5-9-5Z"/><path d="M5 12 3.5 9M5 12l-1.5 3m12-4.5h.01"/>` },
  bird: { label: "Bird", category: "nature", tags: ["animal", "fly", "tweet"], glyph: `<path d="M16 7h.01M4.5 18c4 0 8-1.5 10.5-5 1.5-2 1.5-3.5 1.5-4.5a2.5 2.5 0 0 0-5 0V11L7 14"/><path d="M16.5 8.5 19 9l-2.5 1M11 11.5C9.5 10.5 8 10 6 10"/>` },
  cat: { label: "Cat", category: "nature", tags: ["animal", "pet", "kitten"], glyph: `<path d="M6 6.5 8 10a7 6 0 0 1 8 0l2-3.5.5 6.5a6.5 6 0 0 1-13 0Z"/><path d="M9.5 13h.01m5 0h.01M11 15.5l1 .8 1-.8"/>` },

  // Objects
  hammer: { label: "Hammer", category: "objects", tags: ["tool", "build", "construction"], glyph: `<g transform="translate(0 -.8)"><path d="m13.5 9.5-8 8a1.4 1.4 0 0 0 2 2l8-8"/><path d="m11.5 7.5 3-3 1 1 2 .5 2 2-3 3-2-2-1.5.5Z"/></g>` },
  lamp: { label: "Lamp", category: "objects", tags: ["light", "desk lamp", "furniture"], glyph: `<path d="M9 4.5h6l2.5 6.5h-11Z"/><path d="M12 11v7.5m-3.5 0h7"/>` },
  sofa: { label: "Sofa", category: "objects", tags: ["couch", "furniture", "living room"], glyph: `<path d="M6.5 11V8.5A1.5 1.5 0 0 1 8 7h8a1.5 1.5 0 0 1 1.5 1.5V11"/><path d="M4.5 12.5a1.5 1.5 0 0 1 3 0V14h9v-1.5a1.5 1.5 0 0 1 3 0V17h-15ZM6 17v1.5m12-1.5v1.5"/>` },
  door: { label: "Door", category: "objects", tags: ["entrance", "exit", "room"], glyph: `<path d="M7 19V5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5V19M5 19h14m-5-7h.01"/>` },
  pushpin: { label: "Pushpin", category: "objects", tags: ["pin", "attach", "sticky"], glyph: `<path d="M12 15v4M8.5 15h7l-1-2.5V7.5a1.5 1.5 0 0 0 0-3h-4a1.5 1.5 0 0 0 0 3v5Z"/>` },
  notebook: { label: "Notepad", category: "objects", tags: ["notebook", "notes", "memo"], glyph: `<rect x="6" y="6" width="12" height="13" rx="1.5"/><path d="M9 4.5v3m3-3v3m3-3v3M9 11h6m-6 3h4"/>` },
  stickyNote: { label: "Sticky note", category: "objects", tags: ["note", "post-it", "reminder"], glyph: `<path d="M6.5 5h11A1.5 1.5 0 0 1 19 6.5V14l-5 5H6.5A1.5 1.5 0 0 1 5 17.5v-11A1.5 1.5 0 0 1 6.5 5Z"/><path d="M14 19v-3.5a1 1 0 0 1 1-1h4"/>` },
  backpack: { label: "Backpack", category: "objects", tags: ["bag", "school", "hiking"], glyph: `<path d="M7 9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v8.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 17.5Z"/><path d="M10 6V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1m-4.5 7h5v3h-5Z"/>` },
  scale: { label: "Scale", category: "objects", tags: ["balance", "justice", "law", "compare"], glyph: `<path d="M12 5v14m-3.5 0h7m-9-11.5h11"/><path d="m6.5 7.5-2 4.5a2 2 0 0 0 4 0Zm11 0-2 4.5a2 2 0 0 0 4 0Z"/>` },
} satisfies Record<string, GlyphSpec>;

const strokeStyle = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;
// The side face is the glyph stamped at small steps along the light direction (the same
// down-right depth the core icons use). Stamps overlap into one continuous solid; the group
// opacity is applied once, so overlaps do not darken into visible ghost outlines.
const depth = { x: 1.05, y: 1.3, steps: [1, 0.75, 0.5, 0.25] };

const extrudeGlyph = (glyph: string) => {
  const solid = glyph.replaceAll('fill="#fff"', 'fill="currentColor"');
  const rim = glyph.replaceAll('fill="#fff"', 'fill="none"');
  const offset = (value: number) => Number(value.toFixed(3));
  const side = depth.steps.map((step) => `<g transform="translate(${offset(depth.x * step)} ${offset(depth.y * step)})">${solid}</g>`).join("");
  return svg(
    `${shadow}<g opacity=".36" stroke="currentColor" stroke-width="1.6" ${strokeStyle}>${side}</g>` +
    `<g stroke="currentColor" stroke-width="1.6" ${strokeStyle}>${solid}</g>` +
    `<g transform="translate(-.2 -.3)" stroke="#fff" stroke-opacity=".4" stroke-width=".55" ${strokeStyle}>${rim}</g>`,
  );
};

type DrawnName = keyof typeof coreIcons | keyof typeof glyphSpecs;
// Compile-time check that the drawings and `iconNames` match exactly, in both directions.
const drawingsMatchNames: [IconName] extends [DrawnName] ? ([DrawnName] extends [IconName] ? true : never) : never = true;
void drawingsMatchNames;

const specs: Record<IconName, CoreSpec | GlyphSpec> = { ...coreIcons, ...glyphSpecs };

const define = (name: IconName): IconDefinition => {
  const spec = specs[name];
  return {
    name,
    label: spec.label,
    category: spec.category,
    tags: spec.tags ?? [],
    svg: "svg" in spec ? spec.svg : extrudeGlyph(spec.glyph),
  };
};

export const icons: Record<IconName, IconDefinition> = Object.fromEntries(
  iconNames.map((name) => [name, define(name)]),
) as Record<IconName, IconDefinition>;
