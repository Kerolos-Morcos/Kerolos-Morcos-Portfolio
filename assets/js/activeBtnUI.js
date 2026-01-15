export function btnActive(btn) {
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
