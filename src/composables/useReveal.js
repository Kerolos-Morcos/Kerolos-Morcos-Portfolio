import { onMounted, onUnmounted } from "vue";

export function useReveal() {
  let observer;
  let mutationObserver;

  onMounted(() => {
    const root = document.getElementById("app");
    if (!root) return;

    const observeElement = (element) => {
      if (!element.classList.contains("is-visible")) observer.observe(element);
    };
    const observeWithin = (element) => {
      if (!(element instanceof Element)) return;
      if (element.matches("[data-reveal]")) observeElement(element);
      element.querySelectorAll("[data-reveal]").forEach(observeElement);
    };
    document.body.classList.add("reveal-ready");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      root.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.classList.contains("is-visible")) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -10% 0px" });

    observeWithin(root);
    mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(observeWithin));
    });
    mutationObserver.observe(root, { childList: true, subtree: true });
  });

  onUnmounted(() => {
    observer?.disconnect();
    mutationObserver?.disconnect();
    document.body.classList.remove("reveal-ready");
  });
}
