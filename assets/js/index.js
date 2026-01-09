// Scroll To Top
const scrollToTopBtn = document.getElementById("scroll-to-top");
// Active Links
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-links a");
const navHeight = document.getElementById("header").offsetHeight;

// Scroll To Top Feature
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

// Active Links Feature
activeLinks();
function activeLinks() {
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 10;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });
    links.forEach((link) => link.classList.remove("active"));
    document
      .querySelector(`.nav-links a[href="#${current}"]`)
      .classList.add("active");
  });
}
