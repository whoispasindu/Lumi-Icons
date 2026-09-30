export const iconNames = [
  "cube", "box", "rocket", "heart", "star", "bell", "camera", "palette", "compass", "wand",
  "folder", "calendar", "lock", "globe", "mail", "bulb", "trophy", "cart", "chart", "chat",
  "home", "user", "users", "settings", "search", "menu", "close", "plus", "minus", "check", "x",
  "arrowUp", "arrowDown", "arrowLeft", "arrowRight", "chevronUp", "chevronDown", "chevronLeft", "chevronRight",
  "download", "upload", "play", "pause", "stop", "refresh", "trash", "edit", "copy", "link", "externalLink",
  "info", "warning", "help", "eye", "eyeOff", "bookmark", "flag", "tag", "filter", "sliders", "grid", "list",
  "layout", "terminal", "code", "database", "server", "cloud", "wifi", "bluetooth", "battery", "phone", "monitor",
  "laptop", "tablet", "printer", "keyboard", "mouse", "headphones", "mic", "volume", "video", "image", "file",
  "fileText", "archive", "share", "send", "map", "pin", "navigation", "clock", "calendarDays", "briefcase", "shoppingBag",
  "creditCard", "wallet", "receipt", "package", "truck", "plane", "car", "bike", "coffee", "gift", "key", "shield",
  "unlock", "userAdd", "bellOff", "moon", "sun", "umbrella", "leaf", "flame", "sparkles", "smile", "thumbsUp",
  "plusCircle", "checkCircle", "alertCircle",
] as const;

export type IconName = (typeof iconNames)[number];
export type IconAnimation = "none" | "float" | "spin" | "pulse" | "ring" | "launch" | "sparkle" | "tilt";
export type MotionPreference = "auto" | "reduced";

export interface IconDefinition {
  name: IconName;
  label: string;
  viewBox?: string;
  svg: string;
}
