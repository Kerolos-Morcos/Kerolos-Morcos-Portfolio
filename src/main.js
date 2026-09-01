import { createApp } from "vue";
import App from "./App.vue";
import "../assets/css/style.css";
import "./assets/portfolio-overrides.css";
import { initializeTheme } from "./theme";

initializeTheme();

createApp(App).mount("#app");
