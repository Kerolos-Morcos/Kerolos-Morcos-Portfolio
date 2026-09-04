import { onMounted, onUnmounted } from "vue";

export function useReveal() {
  let observer;
  let mutationObserver;
  let revealFallbackTimer;
  let revealScrollFrame;
  let revealScrollHandler;
  let revealReady = false;

  onMounted(() => {
    const root = document.getElementById("app");
    if (!root) return;

    const isNearViewport = (element) => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rect = element.getBoundingClientRect();
      return rect.bottom > -viewportHeight * 0.2 && rect.top < viewportHeight * 1.2;
    };
    const revealElement = (element) => {
      if (element.classList.contains("is-visible")) return;
      element.classList.remove("reveal-pending");
      element.classList.add("is-visible");
      observer?.unobserve(element);
    };
    const revealViewportTargets = () => {
      revealScrollFrame = undefined;
      const viewportPoints = [0.12, 0.32, 0.52, 0.72, 0.92];
      const seenTargets = new Set();
      viewportPoints.forEach((point) => {
        document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * point).forEach((node) => {
          let target = node.closest?.("[data-reveal]");
          while (target) {
            if (target.classList.contains("reveal-pending") && !seenTargets.has(target)) {
              seenTargets.add(target);
              revealElement(target);
            }
            target = target.parentElement?.closest?.("[data-reveal]");
          }
        });
      });
    };
    revealScrollHandler = () => {
      if (!revealReady || revealScrollFrame) return;
      revealScrollFrame = window.requestAnimationFrame(revealViewportTargets);
    };
    const observedElements = new WeakSet();
    const observeElement = (element) => {
      if (observedElements.has(element) || element.classList.contains("is-visible")) return;
      observedElements.add(element);
      element.classList.add("reveal-pending");
      observer.observe(element);
      if (revealReady && isNearViewport(element)) revealElement(element);
    };
    const observeWithin = (element) => {
      if (!(element instanceof Element)) return;
      if (element.matches("[data-reveal]")) observeElement(element);
      element.querySelectorAll("[data-reveal]").forEach(observeElement);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      root.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.classList.contains("is-visible")) return;
        revealElement(entry.target);
      });
    }, {
      threshold: 0,
      rootMargin: window.matchMedia("(max-width: 768px)").matches ? "12% 0px 24% 0px" : "0px",
    });

    observeWithin(root);
    document.body.classList.add("reveal-ready");
    revealReady = true;
    root.querySelectorAll("[data-reveal].reveal-pending").forEach((element) => {
      if (isNearViewport(element)) revealElement(element);
    });
    revealFallbackTimer = window.setTimeout(() => {
      root.querySelectorAll("[data-reveal].reveal-pending").forEach((element) => {
        if (isNearViewport(element)) revealElement(element);
      });
    }, 250);

    mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(observeWithin));
    });
    mutationObserver.observe(root, { childList: true, subtree: true });
    window.addEventListener("scroll", revealScrollHandler, { passive: true });
  });

  onUnmounted(() => {
    window.clearTimeout(revealFallbackTimer);
    window.cancelAnimationFrame(revealScrollFrame);
    observer?.disconnect();
    mutationObserver?.disconnect();
    if (revealScrollHandler) window.removeEventListener("scroll", revealScrollHandler);
    document.body.classList.remove("reveal-ready");
  });
}
