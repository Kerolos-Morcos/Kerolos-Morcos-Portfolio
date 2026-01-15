export function btnReset(btn) {
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