import { nextTick, onMounted, onUnmounted } from "vue";

const EASING = "cubic-bezier(.22, 1, .36, 1)";
const PROFILES = {
  mobile: { duration: 340, distance: 6, heading: 5, stagger: 18, maxDelay: 72, opacity: 0.62, lead: 0.18, maxConcurrent: 3, activationInset: 0 },
  tablet: { duration: 580, distance: 15, heading: 13, stagger: 45, maxDelay: 180, opacity: 0.28, lead: 0.12, activationInset: 0 },
  desktop: { duration: 680, distance: 22, heading: 17, stagger: 65, maxDelay: 260, opacity: 0.16, lead: 0.12, activationInset: 72 },
};

export function useEntranceMotion() {
  let observer;
  let root;
  let reducedMotion;
  let disposed = false;
  const waiting = new Set();
  const animations = new Map();
  const profile = () => PROFILES[window.innerWidth <= 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop"];

  function finishAnimations() {
    // Underlying styles are always visible. Cancel releases opacity/transform
    // immediately, including when the browser suspends a tab during a delay.
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  }

  function settle() {
    observer?.disconnect();
    waiting.clear();
    finishAnimations();
  }

  function animate(element, hero = false) {
    if (reducedMotion.matches || document.hidden || !element.isConnected) return;
    const settings = profile();
    // Mobile keeps a hard cap on concurrent non-Hero entrances. Any excess
    // target remains at its normal fully visible style instead of queueing.
    if (!hero && settings.maxConcurrent && animations.size >= settings.maxConcurrent) return;
    const step = Math.min(4, Math.max(0, Number(element.dataset.motionStep) || 0));
    const distance = element.hasAttribute("data-motion-heading") ? settings.heading : settings.distance;
    let transform = `translateY(${distance}px)`;
    if (element.dataset.motion === "fade-in") transform = "none";
    if (element.dataset.motion === "fade-side" && window.innerWidth >= 1024) {
      const direction = document.documentElement.dir === "rtl" ? -1 : 1;
      const side = element.dataset.motionSide === "end" ? -1 : 1;
      transform = `translateX(${18 * direction * side}px)`;
    }

    // Backwards fill coordinates only the short active entrance delay.
    // There is no forwards fill or CSS hiding queued/completed content.
    // A readable opacity floor also protects fast desktop/tablet scrolling.
    const animation = element.animate([
      { opacity: settings.opacity, transform },
      { opacity: 1, transform: "none" },
    ], {
      id: hero ? "entrance-hero" : "entrance-section",
      duration: settings.duration,
      delay: Math.min(settings.maxDelay, step * settings.stagger),
      easing: EASING,
      fill: "backwards",
    });
    animations.set(element, animation);
    const release = () => animations.delete(element);
    animation.onfinish = release;
    animation.oncancel = release;
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
    // Child carousels choose their first responsive page during mount.
    // Enroll that initial composition only; replacements use their own
    // existing transitions and never start another section entrance.
    await nextTick();
    if (disposed) return;
    root = document.getElementById("app");
    if (!root || !("animate" in Element.prototype)) return;
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || document.hidden) return;

    const height = window.innerHeight;
    const lead = Math.round(height * profile().lead);
    const initial = [...root.querySelectorAll("[data-motion]:not([data-motion-hero])")]
      .filter((element) => window.innerWidth > 640 || element.dataset.motionMobile !== "skip")
      .map((element) => ({ element, rect: element.getBoundingClientRect() }));

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        // These reads run once per entering target, never in a scroll loop.
        const incoming = entries.filter((entry) => entry.isIntersecting && waiting.has(entry.target))
          .map((entry) => ({ entry, rect: entry.target.getBoundingClientRect() }));
        incoming.forEach(({ entry, rect }) => {
          waiting.delete(entry.target);
          observer.unobserve(entry.target);
          // A late callback or a fast jump must not fade out readable content.
          // Visible/above-viewport targets simply retain their default styles.
          const settings = profile();
          // Desktop may start in the final 72px of the viewport. This retains
          // a visible entrance when observer delivery lands at the bottom edge,
          // while mobile/tablet keep the stricter no-fade-in-view safeguard.
          if (performance.now() - entry.time > 100 || rect.top < window.innerHeight - settings.activationInset || rect.width === 0 || rect.height === 0) return;
          animate(entry.target);
        });
      }, { threshold: 0, rootMargin: `${lead}px 0px ${lead}px 0px` });

      initial.forEach(({ element, rect }) => {
        if (rect.top <= height + lead || rect.width === 0 || rect.height === 0) return;
        waiting.add(element);
        observer.observe(element);
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
