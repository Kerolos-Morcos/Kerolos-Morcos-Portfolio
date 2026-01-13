import { activeLinks } from "./activeLinkFeature.js";
import { darkTheme } from "./darkModeFeature.js";
import { resetTheme } from "./resetFeature.js";
import { scrollToTopFeature } from "./scrollToTopFeature.js";
import { gearBtn } from "./showSettingsSideFeature.js";

export const html = document.querySelector("html");

// Theme Palette Container
const colorsGrid = document.getElementById("theme-colors-grid");

// Font Buttons
export const fontBtns = document.querySelectorAll(".font-option");
export const fonts = ["font-tajawal", "font-cairo", "font-alexandria"];

// Scroll To Top Feature
scrollToTopFeature();

// Active Links Feature
activeLinks();

// Dark Mode Feature
darkTheme();

// Settings Side
gearBtn;

// Themes Colors Array Objects
const themes = [
  {
    name: "Purple Blue",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#a855f7",
  },
  {
    name: "Pink Orange",
    primary: "#ec4899",
    secondary: "#f97316",
    accent: "#fb923c",
  },
  {
    name: "Green Emerald",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#34d399",
  },
  {
    name: "Blue Cyan",
    primary: "#3b82f6",
    secondary: "#06b6d4",
    accent: "#22d3ee",
  },
  {
    name: "Red Rose",
    primary: "#ef4444",
    secondary: "#f43f5e",
    accent: "#fb7185",
  },
  {
    name: "Amber Orange",
    primary: "#f59e0b",
    secondary: "#ea580c",
    accent: "#fbbf24",
  },
];
// Create Theme Color Buttons
export let btns = [];
createColorBtns();
function createColorBtns() {
  themes.forEach((theme, index) => {
    const btn = document.createElement("button");
    setBtnAttributes(btn, theme, index);
    btn.addEventListener("click", () => {
      setThemeStyle(theme); // change html style
      btns.forEach(removeActiveBtnClass); // remove active
      setActiveBtnClass(btn); // add active class to the current clicked btn
    });
    colorsGrid.appendChild(btn);
  });
}

// Get Saved Theme
getSavedTheme();
function getSavedTheme() {
  const savedTheme = localStorage.getItem("themeStyle");
  if (savedTheme) {
    html.style.cssText = savedTheme;
  }
}

// Setting Button Attributes
function setBtnAttributes(btn, theme, index) {
  btn.className =
    "w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm";
  btn.title = theme.name;
  btn.dataset.primary = theme.primary;
  btn.dataset.secondary = theme.secondary;
  btn.dataset.accent = theme.accent;
  btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
  btns.push(btn);
  // default & active
  const savedActiveTheme = localStorage.getItem("activeTheme");
  if (savedActiveTheme && btn.title === savedActiveTheme) {
    setActiveBtnClass(btn);
  }
  if (!savedActiveTheme && index === 0) {
    setActiveBtnClass(btn);
  }
}

// Setting Theme Style
function setThemeStyle(theme) {
  const themeStyle = `
    --color-primary: ${theme.primary};
    --color-secondary: ${theme.secondary};
    --color-accent: ${theme.accent};
  `;
  html.style.cssText = themeStyle;
  localStorage.setItem("themeStyle", themeStyle);
  localStorage.setItem("activeTheme", theme.name);
}
// Reset Active Button Class
export function removeActiveBtnClass(btn) {
  btn.classList.remove(
    "ring-2",
    "ring-primary",
    "ring-offset-2",
    "ring-offset-white",
    "dark:ring-offset-slate-900"
  );
}
// Set Active Button Class
export function setActiveBtnClass(btn) {
  btn.classList.add(
    "ring-2",
    "ring-primary",
    "ring-offset-2",
    "ring-offset-white",
    "dark:ring-offset-slate-900"
  );
}
// Font Selection
document.body.classList.remove(fonts[0]); // remove default html font (tajawal)
let storageFont = localStorage.getItem("selectedFont") || fonts[0];
document.body.classList.add(storageFont);
fontSelection();
function fontSelection() {
  fontBtns.forEach((btn) => {
    const btnFont = `font-${btn.dataset.font}`;
    if (btnFont === storageFont) {
      btnActive(btn);
    }
    btn.addEventListener("click", () => {
      document.body.classList.remove(...fonts); // Remove Old Font
      fontBtns.forEach(btnReset); // Remove Active
      document.body.classList.add(btnFont); // Add The New Font
      btnActive(btn); // Add Active
      storageFont = btnFont; // Update The Storage
      localStorage.setItem("selectedFont", btnFont);
    });
  });
}
// Reset Font Button UI
export function btnReset(btn) {
  btn.setAttribute("aria-checked", "false");
  btn.classList.remove(
    "active",
    "border-primary",
    "border-2",
    "bg-slate-50",
    "dark:bg-slate-800"
  );
  btn.classList.add("border-slate-200", "dark:border-slate-700");
}
// Set Font Button UI (Active)
export function btnActive(btn) {
  btn.setAttribute("aria-checked", "true");
  btn.classList.add(
    "active",
    "border-primary",
    "border-2",
    "bg-slate-50",
    "dark:bg-slate-800"
  );
  btn.classList.remove("border-slate-200", "dark:border-slate-700");
}

// Reset Theme
resetTheme();
