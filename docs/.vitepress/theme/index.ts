import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { h } from "vue";
import "./custom.css";
import GitHubProjects from "./components/GitHubProjects.vue";
import Newsletter from "./components/Newsletter.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "doc-after": () => h(Newsletter),
    });
  },
  enhanceApp({ app }) {
    app.component("GitHubProjects", GitHubProjects);
    app.component("Newsletter", Newsletter);
  },
} satisfies Theme;
