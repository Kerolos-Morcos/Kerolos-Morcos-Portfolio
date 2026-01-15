import { btnActive } from "./activeBtnUI.js";
import { btnReset } from "./resetFontUI.js";

export const fontBtns = document.querySelectorAll(".font-option");
export const fonts = ["font-tajawal", "font-cairo", "font-alexandria"];
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
