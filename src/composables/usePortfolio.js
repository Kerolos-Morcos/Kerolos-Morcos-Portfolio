import { computed, onMounted, ref, watch } from "vue";
import { locales, translate } from "../i18n";
import { applyColorMode, applyThemeTokens, getInitialThemeMode, getTheme, themes } from "../theme";
const fonts = ["tajawal", "alexandria", "cairo"];
const LANGUAGE_STORAGE_KEY = "portfolio-language";
export const DEFAULT_LANGUAGE = "en";

function readStorage(key) {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getInitialLanguage() {
  const savedLanguage = readStorage(LANGUAGE_STORAGE_KEY);
  return savedLanguage === "ar" || savedLanguage === "en" ? savedLanguage : DEFAULT_LANGUAGE;
}

export function applyDocumentLanguage(language) {
  if (typeof document === "undefined") return;
  const nextLanguage = language === "ar" ? "ar" : DEFAULT_LANGUAGE;
  document.documentElement.lang = nextLanguage;
  document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
}

export function initializeDocumentLanguage() {
  applyDocumentLanguage(getInitialLanguage());
}

export function usePortfolio() {
  const lang = ref(getInitialLanguage());
  const isDark = ref(getInitialThemeMode() === "dark");
  const font = ref(readStorage("selectedFont")?.replace("font-", "") || "tajawal");
  const themeName = ref(readStorage("activeTheme") || themes[0].name);
  const locale = computed(() => locales[lang.value]);
  const t = (path) => translate(lang.value, path);

  function applyTheme(theme) {
    applyThemeTokens(theme);
    themeName.value = theme.name;
    localStorage.setItem("activeTheme", theme.name);
  }
  function setLanguage(nextLanguage) {
    if (nextLanguage !== "ar" && nextLanguage !== "en") return;
    lang.value = nextLanguage;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }
  function setFont(nextFont) {
    font.value = nextFont;
    document.body.classList.remove(...fonts.map((item) => `font-${item}`));
    document.body.classList.add(`font-${nextFont}`);
    localStorage.setItem("selectedFont", `font-${nextFont}`);
  }
  function toggleTheme() {
    isDark.value = !isDark.value;
    applyColorMode(isDark.value ? "dark" : "light");
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  }
  function chooseTheme(name) { applyTheme(getTheme(name)); }
  function resetSettings() { setFont("tajawal"); chooseTheme(themes[0].name); isDark.value = true; applyColorMode("dark"); localStorage.setItem("theme", "dark"); }
  function updateDocumentMeta() {
    applyDocumentLanguage(lang.value);
    document.title = locale.value.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", locale.value.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", locale.value.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", locale.value.meta.description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", locale.value.meta.locale);
  }
  onMounted(() => {
    document.documentElement.classList.toggle("dark", isDark.value);
    setFont(font.value);
    applyTheme(getTheme(themeName.value));
    updateDocumentMeta();
  });
  watch(lang, updateDocumentMeta);
  return { lang, isDark, font, themeName, themes, locale, t, setLanguage, setFont, toggleTheme, chooseTheme, resetSettings };
}
