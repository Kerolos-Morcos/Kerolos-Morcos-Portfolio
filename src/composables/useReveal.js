import { onMounted, onUnmounted } from "vue";

export function useReveal() {
  let observer;
  let mutationObserver;
  let revealEnabled = false;
  const observedElements = new WeakSet();

  onMounted(() => {
    const root = document.getElementById("app");
    if (!root) return;

    const targets = root.querySelectorAll("[data-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const revealElement = (element) => {
      if (element.classList.contains("is-visible")) return;
      element.classList.remove("reveal-pending");
      element.classList.add("is-visible");
      observer.unobserve(element);
    };

    const isNearViewport = (element) => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rect = element.getBoundingClientRect();
      return rect.bottom > -viewportHeight * 0.2 && rect.top < viewportHeight * 1.2;
    };

    const observeElement = (element) => {
      if (observedElements.has(element) || element.classList.contains("is-visible")) return;
      observedElements.add(element);
      observer.observe(element);
      element.classList.add("reveal-pending");

      if (revealEnabled && isNearViewport(element)) revealElement(element);
    };

    const observeWithin = (element) => {
      if (!(element instanceof Element)) return;
      if (element.matches("[data-reveal]")) observeElement(element);
      element.querySelectorAll("[data-reveal]").forEach(observeElement);
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) revealElement(entry.target);
      });
    }, {
      threshold: 0,
      rootMargin: "0px 0px 10% 0px",
    });

    // Register every initial target before enabling the CSS that can hide it.
    targets.forEach((element) => {
      observedElements.add(element);
      observer.observe(element);
    });
    targets.forEach((element) => element.classList.add("reveal-pending"));
    document.documentElement.classList.add("reveal-enabled");
    revealEnabled = true;

    // Reveal targets already in or near the initial viewport immediately.
    targets.forEach((element) => {
      if (isNearViewport(element)) revealElement(element);
    });

    mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach(observeWithin);
      });
    });
    mutationObserver.observe(root, { childList: true, subtree: true });
  });

  onUnmounted(() => {
    observer?.disconnect();
    mutationObserver?.disconnect();
    if (revealEnabled) document.documentElement.classList.remove("reveal-enabled");
  });
}
