import { nextTick, onMounted, onUnmounted } from "vue";

const EASING = "cubic-bezier(.22, 1, .36, 1)";
const PROFILES = {
  mobile: { duration: 720, distance: 22, heading: 20, stagger: 60, maxDelay: 280, opacity: 0, rootMargin: "0px 0px -12% 0px" },
  tablet: { duration: 820, distance: 28, heading: 26, stagger: 75, maxDelay: 300, opacity: 0, rootMargin: "0px 0px -14% 0px" },
  desktop: { duration: 880, distance: 32, heading: 32, stagger: 80, maxDelay: 320, opacity: 0, rootMargin: "0px 0px -14% 0px" },
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
  const prepared = new Map();
  const profile = () => PROFILES[window.innerWidth <= 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop"];
  const shouldEnroll = (element) => {
    const mobileVariant = element.dataset.motionMobile;
    return window.innerWidth <= 640 ? mobileVariant !== "skip" : mobileVariant !== "only";
  };

  function entranceState(element, settings) {
    const distance = element.hasAttribute("data-motion-heading") ? settings.heading : settings.distance;
    let transform = `translateY(${distance}px)`;
    if (element.dataset.motion === "fade-in") transform = "none";
    if (element.dataset.motion === "fade-side" && window.innerWidth >= 1024) {
      const direction = document.documentElement.dir === "rtl" ? -1 : 1;
      const side = element.dataset.motionSide === "end" ? -1 : 1;
      transform = `translateX(${16 * direction * side}px)`;
    }
    return { opacity: settings.opacity, transform };
  }

  function prepare(element) {
    if (prepared.has(element) || completed.has(element) || !element.isConnected) return;
    const initial = entranceState(element, profile());
    prepared.set(element, { opacity: element.style.opacity, transform: element.style.transform });
    // Preparation only happens while the group is below the initial viewport.
    // Its structural section remains untouched, so geometry never changes.
    element.style.opacity = String(initial.opacity);
    element.style.transform = initial.transform;
  }

  function restorePrepared(element) {
    const original = prepared.get(element);
    if (!original) return;
    element.style.opacity = original.opacity;
    element.style.transform = original.transform;
    prepared.delete(element);
  }

  function completeVisible(section) {
    completedSections.add(section);
    targetsFor(section).forEach((element) => {
      completed.add(element);
      restorePrepared(element);
    });
  }

  function finishAnimations() {
    [...animations.entries()].forEach(([element, animation]) => {
      completed.add(element);
      animation.cancel();
      restorePrepared(element);
    });
    animations.clear();
  }

  function settle() {
    observer?.disconnect();
    waiting.clear();
    finishAnimations();
    [...prepared.keys()].forEach((element) => restorePrepared(element));
  }

  function animate(element, hero = false) {
    if (completed.has(element) || reducedMotion.matches || document.hidden || !element.isConnected) return;
    const settings = profile();
    const step = Math.max(0, Number(element.dataset.motionStep) || 0);
    const initial = entranceState(element, settings);
    const animation = element.animate([
      initial,
      { opacity: 1, transform: "none" },
    ], {
      id: hero ? "entrance-hero" : "entrance-section-group",
      duration: settings.duration,
      delay: Math.min(settings.maxDelay, step * settings.stagger),
      easing: EASING,
      fill: "both",
    });
    completed.add(element);
    animations.set(element, animation);
    const release = () => {
      animations.delete(element);
      restorePrepared(element);
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
    // One section trigger coordinates only its presentation groups: heading,
    // content, cards, and CTA — never every individual child.
    targetsFor(section).forEach((element) => animate(element));
  }

  function isInitiallyVisible(section) {
    const trigger = triggerFor(section);
    if (!trigger) return true;
    const rect = trigger.getBoundingClientRect();
    return rect.bottom <= 0 || rect.top < window.innerHeight || rect.width === 0 || rect.height === 0;
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
        entries.forEach((entry) => {
          const section = waiting.get(entry.target);
          if (!section) return;

          // The only mid-session skip is a group that a single exceptionally
          // large scroll has already carried entirely above the viewport.
          if (!entry.isIntersecting) {
            if (entry.boundingClientRect.bottom <= 0) {
              waiting.delete(entry.target);
              observer.unobserve(entry.target);
              completeVisible(section);
            }
            return;
          }

          waiting.delete(entry.target);
          observer.unobserve(entry.target);
          coordinate(section);
        });
      }, { threshold: 0, rootMargin: profile().rootMargin });

      sections.forEach(({ section, trigger }) => {
        // First-viewport and restored content remains visible. Only below-fold
        // presentation groups are prepared before their one-time entrance.
        if (!trigger || isInitiallyVisible(section)) {
          completeVisible(section);
          return;
        }
        presentationTargets(section).forEach((element) => prepare(element));
        waiting.set(trigger, section);
        observer.observe(trigger);
      });
    }

    // Hero has its own immediate, sequenced entrance and is never observer-led.
    const navigation = performance.getEntriesByType("navigation")[0];
    if (window.scrollY === 0 && !window.location.hash && navigation?.type !== "back_forward" && navigation?.type !== "reload") {
      root.querySelectorAll("[data-motion-hero]").forEach((element) => animate(element, true));
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("resize", settle, { passive: true });
    reducedMotion.addEventListener("change", handleReducedMotion);
  });

  onUnmounted(() => {
    disposed = true;
    settle();
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("pageshow", handlePageShow);
    window.removeEventListener("resize", settle);
    reducedMotion?.removeEventListener("change", handleReducedMotion);
  });
}
