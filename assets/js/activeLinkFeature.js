const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-links a");
const navHeight = document.getElementById("header").offsetHeight;
export function activeLinks() {
  document
    .querySelector('.nav-links a[href="#hero-section"]')
    .classList.add("active");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 10;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });
    links.forEach((link) => link.classList.remove("active"));
    const activeLink = document.querySelector(
      `.nav-links a[href="#${current}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  });
}
