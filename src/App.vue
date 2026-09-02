<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import AboutSection from "./components/AboutSection.vue";
import ContactSection from "./components/ContactSection.vue";
import ExperienceSection from "./components/ExperienceSection.vue";
import FooterSection from "./components/FooterSection.vue";
import HeroSection from "./components/HeroSection.vue";
import Navbar from "./components/Navbar.vue";
import ProjectsSection from "./components/ProjectsSection.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import SkillsSection from "./components/SkillsSection.vue";
import StatisticsSection from "./components/StatisticsSection.vue";
import TestimonialsSection from "./components/TestimonialsSection.vue";
import { usePortfolio } from "./composables/usePortfolio";
import { useReveal } from "./composables/useReveal";

const { lang, isDark, font, themeName, themes, t, setLanguage, setFont, toggleTheme, chooseTheme, resetSettings } = usePortfolio();
useReveal();
const activeSection = ref("hero-section");
const menuOpen = ref(false);
const settingsOpen = ref(false);
const showScrollTop = ref(false);
const sectionIds = ["hero-section", "about", "skills-section", "portfolio", "experience", "testimonials", "statistics-section", "contact"];
let scrollFrame;
let sectionObserver;

function updateScrollState() {
  showScrollTop.value = window.scrollY > 300;
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
function scheduleScrollState() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = undefined;
    updateScrollState();
  });
}

function observeActiveSections() {
  sectionObserver?.disconnect();
  if (!("IntersectionObserver" in window)) return;

  const activationOffset = (document.getElementById("header")?.offsetHeight || 85) + 24;
  const observationLineHeight = Math.max(1, window.innerHeight - activationOffset - 1);
  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activeSection.value = entry.target.id;
    });
  }, {
    rootMargin: `-${activationOffset}px 0px -${observationLineHeight}px`,
    threshold: 0,
  });

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

function closeSettingsOnOutsideClick(event) {
  if (settingsOpen.value && !event.target.closest("#settings-sidebar") && !event.target.closest("#settings-toggle")) settingsOpen.value = false;
}

watch(lang, () => { menuOpen.value = false; });

onMounted(() => {
  scheduleScrollState();
  observeActiveSections();
  window.addEventListener("scroll", scheduleScrollState, { passive: true });
  window.addEventListener("resize", observeActiveSections, { passive: true });
  document.addEventListener("click", closeSettingsOnOutsideClick);
});

onUnmounted(() => {
  window.cancelAnimationFrame(scrollFrame);
  sectionObserver?.disconnect();
  window.removeEventListener("scroll", scheduleScrollState);
  window.removeEventListener("resize", observeActiveSections);
  document.removeEventListener("click", closeSettingsOnOutsideClick);
});
</script>

<template>
  <a href="#main-content" class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">{{ t('a11y.skip') }}</a>
  <Navbar :lang="lang" :t="t" :active-section="activeSection" :menu-open="menuOpen" :is-dark="isDark" @toggle-menu="menuOpen = !menuOpen" @close-menu="menuOpen = false" @change-language="setLanguage" @toggle-theme="toggleTheme" />

  <main id="main-content">
    <HeroSection :lang="lang" :t="t" />
    <AboutSection :lang="lang" :t="t" />
    <SkillsSection :lang="lang" :t="t" />
    <ProjectsSection :lang="lang" :t="t" />
    <ExperienceSection :lang="lang" :t="t" />
    <TestimonialsSection :lang="lang" :t="t" />
    <StatisticsSection :t="t" />
    <ContactSection :lang="lang" :t="t" />
  </main>

  <FooterSection :t="t" />

  <button id="scroll-to-top" class="fixed left-8 bottom-8 bg-gradient-to-tr from-primary to-accent hover:from-secondary hover:to-primary text-white w-14 h-14 rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/50 flex items-center justify-center transition-all duration-300 z-50 hover:scale-110 group" :class="showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'" type="button" :aria-label="t('a11y.scrollTop')" @click="scrollToTop"><i class="fa-solid fa-rocket text-2xl transform -rotate-45 group-hover:translate-y-[-3px] transition-transform duration-300" aria-hidden="true"></i></button>
  <SettingsPanel :is-open="settingsOpen" :lang="lang" :t="t" :themes="themes" :theme-name="themeName" :font="font" @close="settingsOpen = $event" @set-font="setFont" @set-theme="chooseTheme" @reset="resetSettings" />
</template>
