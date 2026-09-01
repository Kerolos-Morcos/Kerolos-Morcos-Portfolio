export const themes = [
  { name: "Purple Blue", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
  { name: "Pink Orange", primary: "#ec4899", secondary: "#f97316", accent: "#fb923c" },
  { name: "Green Emerald", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
  { name: "Blue Cyan", primary: "#3b82f6", secondary: "#06b6d4", accent: "#22d3ee" },
  { name: "Red Rose", primary: "#ef4444", secondary: "#f43f5e", accent: "#fb7185" },
  { name: "Amber Orange", primary: "#f59e0b", secondary: "#ea580c", accent: "#fbbf24" },
];

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((character) => character + character).join("")
    : normalized;
  const number = Number.parseInt(value, 16);
  return `${number >> 16} ${(number >> 8) & 255} ${number & 255}`;
}

export function getTheme(name) {
  return themes.find((theme) => theme.name === name) || themes[0];
}

export function applyThemeTokens(theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const tokenValues = {
    "--color-primary": theme.primary,
    "--color-secondary": theme.secondary,
    "--color-accent": theme.accent,
    "--accent-primary": theme.primary,
    "--accent-secondary": theme.secondary,
    "--accent-tertiary": theme.accent,
    "--accent-primary-rgb": hexToRgb(theme.primary),
    "--accent-secondary-rgb": hexToRgb(theme.secondary),
    "--accent-tertiary-rgb": hexToRgb(theme.accent),
    "--accent-gradient": `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
    "--accent-gradient-reverse": `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})`,
  };

  Object.entries(tokenValues).forEach(([property, value]) => root.style.setProperty(property, value));
}

export function initializeTheme() {
  if (typeof document === "undefined") return;
  const savedTheme = typeof localStorage === "undefined" ? null : localStorage.getItem("activeTheme");
  const savedMode = typeof localStorage === "undefined" ? null : localStorage.getItem("theme");
  applyThemeTokens(getTheme(savedTheme));
  document.documentElement.classList.toggle("dark", savedMode !== "light");
}
