<script setup>
const props = defineProps({
  lang: { type: String, required: true },
  t: { type: Function, required: true },
  activeSection: { type: String, default: "hero-section" },
  menuOpen: { type: Boolean, default: false },
  menuReady: { type: Boolean, default: false },
  isDark: { type: Boolean, default: true },
});

const emit = defineEmits(["toggle-menu", "close-menu", "navigate", "change-language", "toggle-theme"]);

const navItems = [
  { id: "hero-section", label: "nav.home", href: "#hero-section" },
  { id: "about", label: "nav.about", href: "#about" },
  { id: "portfolio", label: "nav.projects", href: "#portfolio" },
  { id: "experience", label: "nav.experience", href: "#experience" },
  { id: "testimonials", label: "nav.testimonials", href: "#testimonials" },
  { id: "contact", label: "nav.contact", href: "#contact" },
];

function handleNavigation(event, item) {
  if (!props.menuOpen) return;
  event.preventDefault();
  emit("navigate", item.id);
}
function handleLanguageChange() {
  emit("change-language", props.lang === "ar" ? "en" : "ar");
  emit("close-menu");
}
function handleThemeChange() {
  emit("toggle-theme");
  emit("close-menu");
}

</script>

<template>
  <nav id="header" class="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none" role="navigation" :aria-label="t('nav.contact')">
    <div class="container mx-auto px-4 md:px-8 py-5 flex justify-between items-center">
      <a href="#hero-section" class="flex items-center gap-3" @click="$emit('close-menu')" aria-label="Kerolos Morcos home">
        <span class="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center" aria-hidden="true">
          <i class="fa-solid fa-code text-white text-xl"></i>
        </span>
        <span class="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{{ t('about.titleAccent') }}</span>
      </a>

      <button class="mobile-menu-btn w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 items-center justify-center" type="button" :aria-label="menuOpen ? t('nav.closeMenu') : t('nav.menu')" :aria-expanded="menuOpen" aria-controls="primary-navigation" @click="$emit('toggle-menu')">
        <i :class="menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
      </button>

      <button v-if="menuOpen" class="mobile-menu-backdrop fixed inset-0 z-[60] bg-slate-950/30" type="button" :aria-label="t('nav.closeMenu')" @click="$emit('close-menu')"></button>

      <div id="primary-navigation" class="nav-links flex gap-8 items-center" :class="{ active: menuOpen, 'is-ready': menuReady }" role="menubar">
        <a v-for="item in navItems" :key="item.id" :href="item.href" role="menuitem" :class="{ active: activeSection === item.id }" :aria-current="activeSection === item.id ? 'page' : undefined" @click="handleNavigation($event, item)">{{ t(item.label) }}</a>
        <button class="language-switcher inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-interactive" type="button" :aria-label="t('nav.language')" @click="handleLanguageChange">
          <i class="fa-solid fa-language" aria-hidden="true"></i>
          <span>{{ t('nav.language') }}</span>
        </button>
        <button id="theme-toggle-button" class="relative w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded-full transition-interactive duration-300 hover:ring-2 hover:ring-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" type="button" :aria-label="t('nav.theme')" :aria-pressed="isDark" @click="handleThemeChange">
          <span class="theme-toggle-circle absolute top-1 left-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center transition-transform duration-300" :class="{ 'translate-x-8': isDark }">
            <i v-if="!isDark" class="fa-solid fa-sun text-amber-500 text-sm" aria-hidden="true"></i>
            <i v-else class="fa-solid fa-moon text-indigo-400 text-sm" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>
