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
const menuReady = ref(false);
const settingsOpen = ref(false);
const showScrollTop = ref(false);
const sectionIds = ["hero-section", "about", "skills-section", "portfolio", "experience", "testimonials", "statistics-section", "contact"];
let scrollFrame;
let sectionObserver;
let menuReadyFrame;
let lockedScrollY = 0;
let bodyScrollLockSnapshot;

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

function handleMenuNavigation(sectionId) {
  const target = document.getElementById(sectionId);
  const shouldNavigate = activeSection.value !== sectionId && target;
  menuOpen.value = false;
  if (!shouldNavigate) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setBodyScrollLock(locked) {
  if (typeof document === "undefined") return;

  if (locked) {
    if (bodyScrollLockSnapshot) return;
    lockedScrollY = window.scrollY;
    bodyScrollLockSnapshot = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("menu-scroll-locked");
    return;
  }

  if (!bodyScrollLockSnapshot) return;
  const scrollY = lockedScrollY;
  Object.entries(bodyScrollLockSnapshot).forEach(([property, value]) => {
    document.body.style[property] = value;
  });
  bodyScrollLockSnapshot = undefined;
  document.documentElement.classList.remove("menu-scroll-locked");
  window.scrollTo(0, scrollY);
}

watch(menuOpen, (open) => {
  if (open) settingsOpen.value = false;
  setBodyScrollLock(open);
}, { flush: "post" });

function closeMenuOnEscape(event) {
  if (event.key === "Escape" && menuOpen.value) menuOpen.value = false;
}

onMounted(() => {
  scheduleScrollState();
  observeActiveSections();
  menuReadyFrame = window.requestAnimationFrame(() => { menuReady.value = true; });
  window.addEventListener("scroll", scheduleScrollState, { passive: true });
  window.addEventListener("resize", observeActiveSections, { passive: true });
  document.addEventListener("click", closeSettingsOnOutsideClick);
  document.addEventListener("keydown", closeMenuOnEscape);
});

onUnmounted(() => {
  window.cancelAnimationFrame(menuReadyFrame);
  setBodyScrollLock(false);
  window.cancelAnimationFrame(scrollFrame);
  sectionObserver?.disconnect();
  window.removeEventListener("scroll", scheduleScrollState);
  window.removeEventListener("resize", observeActiveSections);
  document.removeEventListener("click", closeSettingsOnOutsideClick);
  document.removeEventListener("keydown", closeMenuOnEscape);
});
</script>

<template>
  <a href="#main-content" class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">{{ t('a11y.skip') }}</a>
  <Navbar :lang="lang" :t="t" :active-section="activeSection" :menu-open="menuOpen" :menu-ready="menuReady" :is-dark="isDark" @toggle-menu="menuOpen = !menuOpen" @close-menu="menuOpen = false" @navigate="handleMenuNavigation" @change-language="setLanguage" @toggle-theme="toggleTheme" />

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
  <SettingsPanel :is-open="settingsOpen" :menu-open="menuOpen" :lang="lang" :t="t" :themes="themes" :theme-name="themeName" :font="font" @close="settingsOpen = $event" @set-font="setFont" @set-theme="chooseTheme" @reset="resetSettings" />
</template>
