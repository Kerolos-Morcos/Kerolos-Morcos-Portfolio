// Scroll To Top
const scrollToTopBtn = document.getElementById("scroll-to-top");

scrollToTopFeature();
function scrollToTopFeature() {
  // On Scroll Event
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove("opacity-0", "invisible");
      scrollToTopBtn.classList.add("opacity-100", "visible");
    } else {
      scrollToTopBtn.classList.add("opacity-0", "invisible");
      scrollToTopBtn.classList.remove("opacity-100", "visible");
    }
  });
  // On Click Event
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
