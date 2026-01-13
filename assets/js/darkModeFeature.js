import { html } from "./index.js";
const darkThemeBtn = document.getElementById("theme-toggle-button");
export function darkTheme() {
  if (localStorage.getItem("theme") === "light") {
    html.classList.remove("dark");
  }
  // toggle dark
  darkThemeBtn.addEventListener("click", () => {
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}
