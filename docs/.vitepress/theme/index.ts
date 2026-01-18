import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import "./custom.css";
import GitHubProjects from "./components/GitHubProjects.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("GitHubProjects", GitHubProjects);
  },
} satisfies Theme;
