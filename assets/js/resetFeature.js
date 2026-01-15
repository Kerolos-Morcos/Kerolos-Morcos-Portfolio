// Reset Theme
import { btnActive } from "./activeBtnUI.js";
import { fontBtns, fonts } from "./fontSelectionFeature.js";
import {
  btns,
  html,
  removeActiveBtnClass,
  setActiveBtnClass,
} from "./index.js";
import { btnReset } from "./resetFontUI.js";
const resetThemeBtn = document.getElementById("reset-settings");
export function resetTheme() {
  resetThemeBtn.addEventListener("click", () => {
    document.body.classList.remove(...fonts);
    document.body.classList.add(fonts[0]);
    fontBtns.forEach(btnReset);
    for (const fontBtn of fontBtns) {
      if (fontBtn.dataset.font === "tajawal") {
        btnActive(fontBtn);
      }
    }
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
