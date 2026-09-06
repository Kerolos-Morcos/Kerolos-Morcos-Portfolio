import { createApp } from "vue";
import App from "./App.vue";
import "../assets/css/style.css";
import "./assets/portfolio-overrides.css";
import "./assets/portfolio-v2.css";
import { initializeTheme } from "./theme";
import { initializeMotionTokens } from './motion';
import { magnetic, spotlight } from './directives/pointerMotion';
import { trackClick } from './lib/analytics';

initializeTheme();
initializeMotionTokens();

createApp(App).directive('magnetic', magnetic).directive('spotlight', spotlight).directive('track', trackClick).mount("#app");
