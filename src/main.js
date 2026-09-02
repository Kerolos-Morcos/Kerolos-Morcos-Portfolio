import { createApp } from "vue";
import App from "./App.vue";
import "../assets/css/style.css";
import "./assets/portfolio-overrides.css";
import { initializeDocumentLanguage } from "./composables/usePortfolio";
import { initializeTheme } from "./theme";

initializeDocumentLanguage();
initializeTheme();

createApp(App).mount("#app");
