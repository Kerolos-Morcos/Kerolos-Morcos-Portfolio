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
// Theme Palette Container
const colorsGrid = document.getElementById("theme-colors-grid");

// Scroll To Top Feature
scrollToTopFeature();
function scrollToTopFeature() {
  // On Scroll Event (Show the button)
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
closeSettingsBtn.addEventListener("click", closeGearOptions);
// Show Settings Sidebar & Stop Bubbling
gearBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  showGearOptions();
});
// Stop Bubbling in Container
settingsSide.addEventListener("click", function (e) {
  e.stopPropagation();
});
// Show Gear Options
function showGearOptions() {
  settingsSide.classList.toggle("translate-x-full"); // add and remove the class
  !settingsSide.classList.contains("translate-x-full") // If gear options is opened
    ? (gearBtn.style.transform = "translate(-20rem, -50%)")
    : (gearBtn.style.transform = "translateY(-50%)");
}
// Close Gear Options
function closeGearOptions() {
  settingsSide.classList.add("translate-x-full");
  gearBtn.style.transform = "translateY(-50%)";
}
// Close Gear Options When Click Outside Its Container
document.body.addEventListener("click", function (e) {
  if (
    !settingsSide.classList.contains("translate-x-full") &&
    !settingsSide.contains(e.target) &&
    !gearBtn.contains(e.target)
  ) {
    closeGearOptions();
  }
});

// Themes Colors Array Objects
const themes = [
  {
    name: "Purple Blue",
    primary: "#6366f1",
    secondary: "#8b5cf6",
  },
  {
    name: "Pink Orange",
    primary: "#ec4899",
    secondary: "#f97316",
  },
  {
    name: "Green Emerald",
    primary: "#10b981",
    secondary: "#059669",
  },
  {
    name: "Blue Cyan",
    primary: "#3b82f6",
    secondary: "#06b6d4",
  },
  {
    name: "Red Rose",
    primary: "#ef4444",
    secondary: "#f43f5e",
  },
  {
    name: "Amber Orange",
    primary: "#f59e0b",
    secondary: "#ea580c",
  },
];
// Create Theme Color Buttons
let btns = [];
themes.forEach((theme, index) => {
  const btn = document.createElement("button");
  btn.className =
    "w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm";
  btn.title = theme.name;
  btn.dataset.primary = theme.primary;
  btn.dataset.secondary = theme.secondary;
  btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
  btns.push(btn);
  // default
  if (index === 0) {
    btn.classList.add(
      "ring-2",
      "ring-primary",
      "ring-offset-2",
      "ring-offset-white",
      "dark:ring-offset-slate-900"
    );
  }
  btn.addEventListener("click", () => {
    btns.forEach((btn) => {
      // remove any classes
      btn.classList.remove(
        "ring-2",
        "ring-primary",
        "ring-offset-2",
        "ring-offset-white",
        "dark:ring-offset-slate-900"
      );
    });
    // add active class to the current clicked btn
    btn.classList.add(
      "ring-2",
      "ring-primary",
      "ring-offset-2",
      "ring-offset-white",
      "dark:ring-offset-slate-900"
    );
  });
  colorsGrid.appendChild(btn);
});
