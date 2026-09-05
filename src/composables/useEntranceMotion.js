import { nextTick, onMounted, onUnmounted } from "vue";

const EASING = "cubic-bezier(.22, 1, .36, 1)";
const PROFILES = {
  mobile: { duration: 520, distance: 12, heading: 11, stagger: 30, maxDelay: 135, opacity: 0.12, rootMargin: "0px 0px -3% 0px", maxConcurrent: 4, staleAfter: 180 },
  tablet: { duration: 600, distance: 20, heading: 17, stagger: 50, maxDelay: 200, opacity: 0.08, rootMargin: "0px 0px -5% 0px", maxConcurrent: 4, staleAfter: 180 },
  desktop: { duration: 660, distance: 24, heading: 20, stagger: 55, maxDelay: 220, opacity: 0.05, rootMargin: "0px 0px -6% 0px", maxConcurrent: 4, staleAfter: 180 },
};

export function useEntranceMotion() {
  let observer;
  let root;
  let reducedMotion;
  let disposed = false;
  const waiting = new Map();
  const completed = new WeakSet();
  const completedSections = new WeakSet();
  const animations = new Map();
  const activeSectionAnimations = new Set();
  const profile = () => PROFILES[window.innerWidth <= 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop"];
  const shouldEnroll = (element) => {
    const mobileVariant = element.dataset.motionMobile;
    return window.innerWidth <= 640 ? mobileVariant !== "skip" : mobileVariant !== "only";
  };

  function finishAnimations() {
    // Underlying styles are always visible. Cancel releases the compositor
    // animation immediately, including when the browser suspends a tab.
    animations.forEach((animation, element) => {
      completed.add(element);
      animation.cancel();
    });
    animations.clear();
    activeSectionAnimations.clear();
  }

  function settle() {
    observer?.disconnect();
    waiting.clear();
    finishAnimations();
  }

  function animate(element, hero = false) {
    if (completed.has(element) || reducedMotion.matches || document.hidden || !element.isConnected) return;
    const settings = profile();
    // Sections use no more than four visual groups. Any excess remains visible
    // rather than creating a delayed waterfall after a fast navigation.
    if (!hero && activeSectionAnimations.size >= settings.maxConcurrent) {
      completed.add(element);
      return;
    }
    const step = Math.min(4, Math.max(0, Number(element.dataset.motionStep) || 0));
    const distance = element.hasAttribute("data-motion-heading") ? settings.heading : settings.distance;
    let transform = `translateY(${distance}px)`;
    if (element.dataset.motion === "fade-in") transform = "none";
    if (element.dataset.motion === "fade-side" && window.innerWidth >= 1024) {
      const direction = document.documentElement.dir === "rtl" ? -1 : 1;
      const side = element.dataset.motionSide === "end" ? -1 : 1;
      transform = `translateX(${16 * direction * side}px)`;
    }

    const animation = element.animate([
      { opacity: settings.opacity, transform },
      { opacity: 1, transform: "none" },
    ], {
      id: hero ? "entrance-hero" : "entrance-section-group",
      duration: settings.duration,
      delay: Math.min(settings.maxDelay, step * settings.stagger),
      easing: EASING,
      fill: "backwards",
    });
    completed.add(element);
    animations.set(element, animation);
    if (!hero) activeSectionAnimations.add(element);
    const release = () => {
      animations.delete(element);
      activeSectionAnimations.delete(element);
    };
    animation.onfinish = release;
    animation.oncancel = release;
  }

  function presentationTargets(section) {
    return [...section.querySelectorAll("[data-motion]")]
      .filter((element) => element.closest("[data-motion-section]") === section)
      .filter((element) => shouldEnroll(element));
  }

  function targetsFor(section) {
    return presentationTargets(section).filter((element) => !completed.has(element));
  }

  function triggerFor(section) {
    const targets = presentationTargets(section);
    return targets.find((element) => element.hasAttribute("data-motion-heading")) || targets[0];
  }

  function coordinate(section) {
    if (completedSections.has(section)) return;
    completedSections.add(section);
    // Every presentation group shares the same observer callback and timing
    // origin. Internal delays express hierarchy without independent triggers.
    targetsFor(section).forEach((element) => animate(element));
  }

  function isInitiallyVisible(section) {
    const trigger = triggerFor(section);
    if (!trigger) return true;
    const rect = trigger.getBoundingClientRect();
    return rect.bottom <= 0 || rect.top < window.innerHeight;
  }

  function isTooDeepToAnimate(section) {
    const trigger = triggerFor(section);
    if (!trigger) return true;
    const rect = trigger.getBoundingClientRect();
    // Normal entries begin near the lower edge. Only a heading that has
    // already reached the upper half is considered too late to animate.
    return rect.bottom <= 0 || rect.top < window.innerHeight * 0.45;
  }

  function handleVisibility() {
    if (document.hidden) settle();
  }

  function handlePageShow(event) {
    if (event.persisted) settle();
  }

  function handleReducedMotion() {
    if (reducedMotion.matches) settle();
  }

  onMounted(async () => {
    // Child carousels choose their first responsive page before the
    // coordinator reads the initial composition.
    await nextTick();
    if (disposed) return;
    root = document.getElementById("app");
    if (!root || !("animate" in Element.prototype)) return;
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || document.hidden) return;

    const sections = [...root.querySelectorAll("[data-motion-section]")]
      .filter((section) => !completedSections.has(section))
      .map((section) => ({ section, trigger: triggerFor(section) }));

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        const incoming = entries.filter((entry) => entry.isIntersecting && waiting.has(entry.target));
        incoming.forEach((entry) => {
          const trigger = entry.target;
          const section = waiting.get(trigger);
          waiting.delete(trigger);
          observer.unobserve(trigger);
          const rect = trigger.getBoundingClientRect();
          // Late deliveries and restored/deep viewports stay visible. A normal
          // entry is judged from its heading trigger, not the section padding.
          if (performance.now() - entry.time > profile().staleAfter || isTooDeepToAnimate(section) || rect.width === 0 || rect.height === 0) {
            completedSections.add(section);
            targetsFor(section).forEach((element) => completed.add(element));
            return;
          }
          coordinate(section);
        });
      }, { threshold: 0, rootMargin: profile().rootMargin });

      sections.forEach(({ section, trigger }) => {
        // Initial content remains fully visible. During later scrolling the
        // same section uses its first presentation group as a precise trigger.
        if (!trigger || isInitiallyVisible(section) || trigger.getBoundingClientRect().width === 0 || trigger.getBoundingClientRect().height === 0) {
          completedSections.add(section);
          targetsFor(section).forEach((element) => completed.add(element));
          return;
        }
        waiting.set(trigger, section);
        observer.observe(trigger);
      });
    }

    // Hero gets a compact initial sequence, independent of scroll observers.
    // Reload/back/deep links retain immediately visible content.
    const navigation = performance.getEntriesByType("navigation")[0];
    if (window.scrollY === 0 && !window.location.hash && navigation?.type !== "back_forward" && navigation?.type !== "reload") {
      root.querySelectorAll("[data-motion-hero]").forEach((element) => animate(element, true));
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("resize", finishAnimations, { passive: true });
    root.addEventListener("focusin", finishAnimations);
    root.addEventListener("pointerdown", finishAnimations, { passive: true });
    reducedMotion.addEventListener("change", handleReducedMotion);
  });

  onUnmounted(() => {
    disposed = true;
    settle();
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("pageshow", handlePageShow);
    window.removeEventListener("resize", finishAnimations);
    root?.removeEventListener("focusin", finishAnimations);
    root?.removeEventListener("pointerdown", finishAnimations);
    reducedMotion?.removeEventListener("change", handleReducedMotion);
  });
}
