export const iconNames = [
  "cube", "box", "rocket", "heart", "star", "bell", "camera", "palette", "compass", "wand",
  "folder", "calendar", "lock", "globe", "mail", "bulb", "trophy", "cart", "chart", "chat",
  "home", "user", "users", "settings", "search", "menu", "close", "plus", "minus", "check",
  "arrowUp", "arrowDown", "arrowLeft", "arrowRight", "chevronUp", "chevronDown", "chevronLeft", "chevronRight",
  "download", "upload", "play", "pause", "stop", "refresh", "trash", "edit", "copy", "link", "externalLink",
  "info", "warning", "help", "eye", "eyeOff", "bookmark", "flag", "tag", "filter", "sliders", "grid", "list",
  "layout", "terminal", "code", "database", "server", "cloud", "wifi", "bluetooth", "battery", "phone", "monitor",
  "laptop", "tablet", "printer", "keyboard", "mouse", "headphones", "mic", "volume", "video", "image", "file",
  "fileText", "archive", "share", "send", "map", "pin", "navigation", "clock", "calendarDays", "briefcase", "shoppingBag",
  "creditCard", "wallet", "receipt", "package", "truck", "plane", "car", "bike", "coffee", "gift", "key", "shield",
  "unlock", "userAdd", "bellOff", "moon", "sun", "umbrella", "leaf", "flame", "sparkles", "smile", "thumbsUp",
  "plusCircle", "checkCircle", "alertCircle",
  // v0.2 expansion
  "logIn", "logOut", "save", "zoomIn", "zoomOut", "maximize", "minimize", "moreHorizontal", "moreVertical",
  "loader", "power", "paperclip", "scissors", "clipboard", "layers", "move", "hash", "history", "toggle",
  "crop", "userCheck", "scan", "sidebar", "undo", "redo", "arrowUpRight", "repeat", "shuffle",
  "chevronsUpDown", "sort", "bold", "italic", "underline", "strikethrough", "alignLeft", "alignCenter",
  "alignRight", "heading", "quote", "checklist", "type", "table", "gitBranch", "gitCommit", "gitMerge", "bug",
  "command", "braces", "workflow", "component", "cpu", "hardDrive", "watch", "gamepad", "tv", "plug", "signal",
  "qrCode", "music", "film", "volumeX", "skipForward", "skipBack", "book", "bookOpen", "newspaper",
  "folderOpen", "radio", "phoneCall", "megaphone", "rss", "reply", "atSign", "inbox", "dollarSign", "percent",
  "store", "barChart", "pieChart", "trendingUp", "trendingDown", "coins", "banknote", "calculator", "ticket",
  "shirt", "train", "bus", "ship", "anchor", "building", "mountain", "tent", "luggage", "route", "frown",
  "meh", "thumbsDown", "award", "badgeCheck", "xCircle", "target", "ban", "pill", "heartPulse", "activity",
  "stethoscope", "bandage", "medicalCross", "cloudRain", "snowflake", "droplet", "wind", "thermometer", "tree",
  "sprout", "zap", "brush", "wrench", "magnet", "gem", "crown", "glasses", "flask", "dice", "graduationCap",
  "hourglass",
  // v0.3 expansion
  "bookmarkPlus", "checkSquare", "minusCircle", "plusSquare", "crosshair", "locate", "expand", "shrink", "pointer",
  "hand", "backspace", "enter", "unlink", "clipboardCheck", "sidebarRight", "columns", "rows", "kanban",
  "window", "grip", "arrowUpLeft", "arrowDownRight", "arrowDownLeft", "chevronsLeft", "chevronsRight", "chevronsUp", "chevronsDown",
  "arrowLeftRight", "rotateCw", "rotateCcw", "listOrdered", "indent", "outdent", "wrapText", "paragraph", "pipette",
  "paintBucket", "penTool", "highlighter", "eraser", "ruler", "frame", "contrast", "circle", "square",
  "triangle", "hexagon", "filePlus", "fileCheck", "fileCode", "fileImage", "fileSpreadsheet", "fileArchive", "fileDown",
  "fileLock", "folderPlus", "gitPullRequest", "container", "network", "blocks", "bot", "cloudDownload", "cloudUpload",
  "cloudOff", "batteryCharging", "batteryLow", "wifiOff", "speaker", "webcam", "router", "usb", "cast",
  "playCircle", "rewind", "fastForward", "volumeHigh", "micOff", "videoOff", "disc", "playlist", "clapperboard",
  "aperture", "gallery", "captions", "pictureInPicture", "screenShare", "bellRing", "mailOpen", "messageCircle", "messages",
  "phoneOff", "contactBook", "languages", "userCircle", "userMinus", "person", "accessibility", "idCard", "shieldCheck",
  "shieldAlert", "fingerprint", "scanFace", "alarmClock", "timer", "calendarPlus", "calendarCheck", "euro", "piggyBank",
  "bank", "discount", "basket", "lineChart", "gauge", "presentation", "barcode", "packageCheck", "signpost",
  "bed", "fuel", "parking", "trafficCone", "planeTakeoff", "passport", "school", "factory", "starHalf",
  "alertOctagon", "laugh", "party", "hospital", "syringe", "brain", "dna", "ambulance", "microscope",
  "utensils", "pizza", "apple", "cake", "wine", "beer", "iceCream", "cherry", "egg",
  "burger", "cookie", "chefHat", "dumbbell", "medal", "ball", "puzzle", "infinity", "divide",
  "equal", "sigma", "pi", "cloudSun", "cloudLightning", "cloudSnow", "sunrise", "sunset", "rainbow",
  "waves", "flower", "feather", "recycle", "palmTree", "paw", "fish", "bird", "cat",
  "hammer", "lamp", "sofa", "door", "pushpin", "notebook", "stickyNote", "backpack", "scale",
] as const;

export type IconName = (typeof iconNames)[number];

/** Alternate names that resolve to a canonical icon. */
export const iconAliases = { x: "close" } as const satisfies Record<string, IconName>;
export type IconAlias = keyof typeof iconAliases;

export const iconCategories = [
  "interface", "layout", "arrows", "editor", "design", "files", "development", "devices", "media",
  "communication", "people", "security", "time", "commerce", "travel", "feedback", "health", "food",
  "games", "math", "weather", "nature", "objects",
] as const;
export type IconCategory = (typeof iconCategories)[number];

export const iconAnimations = ["none", "float", "spin", "pulse", "ring", "launch", "sparkle", "tilt"] as const;
export type IconAnimation = (typeof iconAnimations)[number];
export type MotionPreference = "auto" | "reduced";

export interface IconDefinition {
  name: IconName;
  label: string;
  category: IconCategory;
  /** Extra search terms, e.g. "delete" for trash. */
  tags: readonly string[];
  svg: string;
}
