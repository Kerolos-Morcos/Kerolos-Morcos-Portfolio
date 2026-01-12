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
// Theme Reset Button
const resetThemeBtn = document.getElementById("reset-settings");
// Font Buttons
const fontBtns = document.querySelectorAll(".font-option");

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
    accent: "#a855f7",
  },
  {
    name: "Pink Orange",
    primary: "#ec4899",
    secondary: "#f97316",
    accent: "#fb923c",
  },
  {
    name: "Green Emerald",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#34d399",
  },
  {
    name: "Blue Cyan",
    primary: "#3b82f6",
    secondary: "#06b6d4",
    accent: "#22d3ee",
  },
  {
    name: "Red Rose",
    primary: "#ef4444",
    secondary: "#f43f5e",
    accent: "#fb7185",
  },
  {
    name: "Amber Orange",
    primary: "#f59e0b",
    secondary: "#ea580c",
    accent: "#fbbf24",
  },
];
// Create Theme Color Buttons
let btns = [];
createColorBtns();
function createColorBtns() {
  themes.forEach((theme, index) => {
    const btn = document.createElement("button");
    setBtnAttributes(btn, theme, index);
    btn.addEventListener("click", () => {
      setThemeStyle(theme); // change html style
      btns.forEach(removeActiveBtnClass); // remove active
      setActiveBtnClass(btn); // add active class to the current clicked btn
    });
    colorsGrid.appendChild(btn);
  });
}

// Get Saved Theme
getSavedTheme();
function getSavedTheme() {
  const savedTheme = localStorage.getItem("themeStyle");
  if (savedTheme) {
    html.style.cssText = savedTheme;
  }
}

// Setting Button Attributes
function setBtnAttributes(btn, theme, index) {
  btn.className =
    "w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm";
  btn.title = theme.name;
  btn.dataset.primary = theme.primary;
  btn.dataset.secondary = theme.secondary;
  btn.dataset.accent = theme.accent;
  btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
  btns.push(btn);
  // default & active
  const savedActiveTheme = localStorage.getItem("activeTheme");
  if (savedActiveTheme && btn.title === savedActiveTheme) {
    setActiveBtnClass(btn);
  }
  if (!savedActiveTheme && index === 0) {
    setActiveBtnClass(btn);
  }
}

// Setting Theme Style
function setThemeStyle(theme) {
  const themeStyle = `
    --color-primary: ${theme.primary};
    --color-secondary: ${theme.secondary};
    --color-accent: ${theme.accent};
  `;
  html.style.cssText = themeStyle;
  localStorage.setItem("themeStyle", themeStyle);
  localStorage.setItem("activeTheme", theme.name);
}
// Reset Active Button Class
function removeActiveBtnClass(btn) {
  btn.classList.remove(
    "ring-2",
    "ring-primary",
    "ring-offset-2",
    "ring-offset-white",
    "dark:ring-offset-slate-900"
  );
}
// Set Active Button Class
function setActiveBtnClass(btn) {
  btn.classList.add(
    "ring-2",
    "ring-primary",
    "ring-offset-2",
    "ring-offset-white",
    "dark:ring-offset-slate-900"
  );
}
// Reset Theme
resetTheme();
function resetTheme() {
  resetThemeBtn.addEventListener("click", () => {
    localStorage.removeItem("selectedFont");
    localStorage.removeItem("activeTheme");
    localStorage.removeItem("themeStyle");
    html.style.cssText = `
    --color-primary: #6366f1;
    --color-secondary: #8b5cf6;
    --color-accent: #a855f7;
  `;
    btns.forEach(removeActiveBtnClass);
    setActiveBtnClass(btns[0]);
  });
}

// Font Selection
const fonts = ["font-tajawal", "font-cairo", "font-alexandria"];
document.body.classList.remove(fonts[0]); // remove default html font (tajawal)
let storageFont = localStorage.getItem("selectedFont") || fonts[0];
document.body.classList.add(storageFont);
fontSelection();
function fontSelection() {
  fontBtns.forEach((btn) => {
    const btnFont = `font-${btn.dataset.font}`;
    if (btnFont === storageFont) {
      btnActive(btn);
    }
    btn.addEventListener("click", () => {
      document.body.classList.remove(...fonts); // Remove Old Font
      fontBtns.forEach(btnReset); // Remove Active
      document.body.classList.add(btnFont); // Add The New Font
      btnActive(btn); // Add Active
      storageFont = btnFont; // Update The Storage
      localStorage.setItem("selectedFont", btnFont);
    });
  });
}
// Reset Font Button UI
function btnReset(btn) {
  btn.setAttribute("aria-checked", "false");
  btn.classList.remove(
    "active",
    "border-primary",
    "border-2",
    "bg-slate-50",
    "dark:bg-slate-800"
  );
  btn.classList.add("border-slate-200", "dark:border-slate-700");
}
// Set Font Button UI (Active)
function btnActive(btn) {
  btn.setAttribute("aria-checked", "true");
  btn.classList.add(
    "active",
    "border-primary",
    "border-2",
    "bg-slate-50",
    "dark:bg-slate-800"
  );
  btn.classList.remove("border-slate-200", "dark:border-slate-700");
}
