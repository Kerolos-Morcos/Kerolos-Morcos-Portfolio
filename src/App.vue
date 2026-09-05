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
import { useEntranceMotion } from "./composables/useEntranceMotion";

const { lang, isDark, font, themeName, themes, t, setLanguage, setFont, toggleTheme, chooseTheme, resetSettings } = usePortfolio();
useEntranceMotion();
const activeSection = ref("hero-section");
const menuOpen = ref(false);
const menuReady = ref(false);
const settingsOpen = ref(false);
const showScrollTop = ref(false);
const sectionIds = ["hero-section", "about", "skills-section", "portfolio", "experience", "testimonials", "statistics-section", "contact"];
let scrollFrame;
let sectionObserver;
let menuReadyFrame;
let menuScrollLockSnapshot;
let activeSectionObserverKey;

function updateScrollState() {
  const nextVisible = window.scrollY > 300;
  if (nextVisible !== showScrollTop.value) showScrollTop.value = nextVisible;
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
  if (!("IntersectionObserver" in window)) return;

  const headerHeight = document.getElementById("header")?.offsetHeight || 85;
  const viewportHeight = window.innerHeight;
  const observerKey = `${headerHeight}:${viewportHeight}`;
  if (observerKey === activeSectionObserverKey) return;
  activeSectionObserverKey = observerKey;

  sectionObserver?.disconnect();
  const activationOffset = headerHeight + 24;
  const observationLineHeight = Math.max(1, viewportHeight - activationOffset - 1);
  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && activeSection.value !== entry.target.id) activeSection.value = entry.target.id;
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
  closeMenu();
  if (!shouldNavigate) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function closeMenu() {
  const wasOpen = menuOpen.value;
  menuOpen.value = false;
  if (wasOpen) document.querySelector(".mobile-menu-btn")?.focus({ preventScroll: true });
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
    return;
  }
  menuOpen.value = true;
}

function runMenuStateChange(update) {
  const root = document.documentElement;
  const body = document.body;
  const previousRootAnchor = root.style.overflowAnchor;
  const previousBodyAnchor = body.style.overflowAnchor;
  root.style.overflowAnchor = "none";
  body.style.overflowAnchor = "none";
  update();
  window.requestAnimationFrame(() => {
    root.style.overflowAnchor = previousRootAnchor;
    body.style.overflowAnchor = previousBodyAnchor;
  });
}

function handleLanguageChange(nextLanguage) {
  runMenuStateChange(() => setLanguage(nextLanguage));
}

function handleThemeChange() {
  runMenuStateChange(toggleTheme);
}

function preventBackgroundScroll(event) {
  if (event.target instanceof Element && event.target.closest("#primary-navigation")) return;
  event.preventDefault();
}

function setMenuScrollLock(locked) {
  if (typeof document === "undefined") return;

  if (locked) {
    if (menuScrollLockSnapshot) return;
    menuScrollLockSnapshot = {
      htmlOverscrollBehavior: document.documentElement.style.overscrollBehavior,
      bodyOverscrollBehavior: document.body.style.overscrollBehavior,
    };
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    document.addEventListener("wheel", preventBackgroundScroll, { capture: true, passive: false });
    document.addEventListener("touchmove", preventBackgroundScroll, { capture: true, passive: false });
    return;
  }

  if (!menuScrollLockSnapshot) return;
  document.removeEventListener("wheel", preventBackgroundScroll, true);
  document.removeEventListener("touchmove", preventBackgroundScroll, true);
  document.documentElement.style.overscrollBehavior = menuScrollLockSnapshot.htmlOverscrollBehavior;
  document.body.style.overscrollBehavior = menuScrollLockSnapshot.bodyOverscrollBehavior;
  menuScrollLockSnapshot = undefined;
}

watch(menuOpen, (open) => {
  if (open) settingsOpen.value = false;
  setMenuScrollLock(open);
}, { flush: "post" });

function closeMenuOnEscape(event) {
  if (event.key === "Escape" && menuOpen.value) closeMenu();
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
  setMenuScrollLock(false);
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
  <Navbar :lang="lang" :t="t" :active-section="activeSection" :menu-open="menuOpen" :menu-ready="menuReady" :is-dark="isDark" @toggle-menu="toggleMenu" @close-menu="closeMenu" @navigate="handleMenuNavigation" @change-language="handleLanguageChange" @toggle-theme="handleThemeChange" />

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

  <button id="scroll-to-top" class="scroll-top-transition fixed left-8 bottom-8 bg-gradient-to-tr from-primary to-accent hover:from-secondary hover:to-primary text-white w-14 h-14 rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/50 flex items-center justify-center z-50 group" :class="showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'" type="button" :aria-label="t('a11y.scrollTop')" @click="scrollToTop"><i class="fa-solid fa-rocket text-2xl transform -rotate-45 group-hover:translate-y-[-3px] transition-transform duration-300" aria-hidden="true"></i></button>
  <SettingsPanel :is-open="settingsOpen" :menu-open="menuOpen" :lang="lang" :t="t" :themes="themes" :theme-name="themeName" :font="font" @close="settingsOpen = $event" @set-font="setFont" @set-theme="chooseTheme" @reset="resetSettings" />
</template>
