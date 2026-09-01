import { onMounted, onUnmounted } from "vue";

export function useReveal() {
  let observer;
  let mutationObserver;

  onMounted(() => {
    const root = document.getElementById("app");
    if (!root) return;

    const elements = () => [...root.querySelectorAll("[data-reveal]")].filter((element) => !element.classList.contains("is-visible"));
    document.body.classList.add("reveal-ready");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      root.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    const observeElements = () => elements().forEach((element) => observer.observe(element));
    observeElements();
    mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(root, { childList: true, subtree: true });
  });

  onUnmounted(() => {
    observer?.disconnect();
    mutationObserver?.disconnect();
    document.body.classList.remove("reveal-ready");
  });
}
