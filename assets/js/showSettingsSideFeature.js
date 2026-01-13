// Gear Settings Theme
export const gearBtn = document.getElementById("settings-toggle");
export const settingsSide = document.getElementById("settings-sidebar");
export const closeSettingsBtn = document.getElementById("close-settings");
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
showGearOptions();
export function showGearOptions() {
  settingsSide.classList.toggle("translate-x-full"); // add and remove the class
  !settingsSide.classList.contains("translate-x-full") // If gear options is opened
    ? (gearBtn.style.transform = "translate(-20rem, -50%)")
    : (gearBtn.style.transform = "translateY(-50%)");
}
// Close Gear Options
closeGearOptions();
export function closeGearOptions() {
  settingsSide.classList.add("translate-x-full");
  gearBtn.style.transform = "translateY(-50%)";
  settingsSide.setAttribute("aria-hidden", "false");
}
// Close Gear Options When Click Outside Its Container
closeSideOutside();
export function closeSideOutside() {
  document.body.addEventListener("click", function (e) {
    if (
      !settingsSide.classList.contains("translate-x-full") &&
      !settingsSide.contains(e.target) &&
      !gearBtn.contains(e.target)
    ) {
      closeGearOptions();
    }
  });
}
