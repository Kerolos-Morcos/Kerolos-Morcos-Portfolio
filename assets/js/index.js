// Scroll To Top
const scrollToTopBtn = document.getElementById("scroll-to-top");
// Active Links
const sections = document.querySelectorAll("section");
const links = document.querySelectorAll(".nav-links a");
const navHeight = document.getElementById("header").offsetHeight;
// Dark Mode
const darkThemeBtn = document.getElementById("theme-toggle-button");
const html = document.querySelector("html");
// Gear Settings Theme
const gearBtn = document.getElementById("settings-toggle");
const settingsSide = document.getElementById("settings-sidebar");
const closeSettingsBtn = document.getElementById("close-settings");

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

// Dark Mode Feature
darkTheme();
function darkTheme() {
  if (localStorage.getItem("theme") === "light") {
    html.classList.remove("dark");
  }
  // toggle dark
  darkThemeBtn.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Gear Icon Theming
// Close Button
closeSettingsBtn.addEventListener("click", showGearOptions);
// Show Settings Sidebar
gearBtn.addEventListener("click", showGearOptions);
function showGearOptions() {
  settingsSide.classList.toggle("translate-x-full");
  !settingsSide.classList.contains("translate-x-full")
    ? (gearBtn.style.transform = "translate(-20rem, -50%)")
    : (gearBtn.style.transform = "translateY(-50%)");
}
