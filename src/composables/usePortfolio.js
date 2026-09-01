import { computed, onMounted, ref, watch } from "vue";
import { locales, translate } from "../i18n";

const themes = [
  { name: "Purple Blue", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
  { name: "Pink Orange", primary: "#ec4899", secondary: "#f97316", accent: "#fb923c" },
  { name: "Green Emerald", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
  { name: "Blue Cyan", primary: "#3b82f6", secondary: "#06b6d4", accent: "#22d3ee" },
];
const fonts = ["tajawal", "alexandria", "cairo"];

export function usePortfolio() {
  const lang = ref(localStorage.getItem("portfolio-language") || "ar");
  const isDark = ref(localStorage.getItem("theme") !== "light");
  const font = ref(localStorage.getItem("selectedFont")?.replace("font-", "") || "tajawal");
  const themeName = ref(localStorage.getItem("activeTheme") || themes[0].name);
  const locale = computed(() => locales[lang.value]);
  const t = (path) => translate(lang.value, path);

  function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-accent", theme.accent);
    themeName.value = theme.name;
    localStorage.setItem("activeTheme", theme.name);
  }
  function setLanguage(nextLanguage) { lang.value = nextLanguage; }
  function setFont(nextFont) {
    font.value = nextFont;
    document.body.classList.remove(...fonts.map((item) => `font-${item}`));
    document.body.classList.add(`font-${nextFont}`);
    localStorage.setItem("selectedFont", `font-${nextFont}`);
  }
  function toggleTheme() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark", isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  }
  function chooseTheme(name) { applyTheme(themes.find((theme) => theme.name === name) || themes[0]); }
  function resetSettings() { setFont("tajawal"); chooseTheme(themes[0].name); isDark.value = true; document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
  function updateDocumentMeta() {
    document.documentElement.lang = lang.value;
    document.documentElement.dir = lang.value === "ar" ? "rtl" : "ltr";
    document.title = locale.value.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", locale.value.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", locale.value.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", locale.value.meta.description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", locale.value.meta.locale);
    localStorage.setItem("portfolio-language", lang.value);
  }
  onMounted(() => {
    document.documentElement.classList.toggle("dark", isDark.value);
    setFont(font.value);
    applyTheme(themes.find((theme) => theme.name === themeName.value) || themes[0]);
    updateDocumentMeta();
  });
  watch(lang, updateDocumentMeta);
  return { lang, isDark, font, themeName, themes, locale, t, setLanguage, setFont, toggleTheme, chooseTheme, resetSettings };
}
