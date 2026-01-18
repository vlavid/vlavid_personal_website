import { defineConfig } from "vitepress";

const githubUser = "vlavid";

export default defineConfig({
  title: "vlavid | AWS & DevOps Engineer",
  description:
    "Platform Engineer especializado en AWS, DevOps, SRE y LLM Operations. 15+ servicios 24/7, alta volumetría y observabilidad enterprise.",

  head: [
    ["meta", { name: "author", content: "vlavid" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "AWS, DevOps, SRE, Platform Engineer, Cloud Architecture, Observability, LLM, Grafana",
      },
    ],
    [
      "meta",
      { property: "og:title", content: "vlavid | AWS & DevOps Engineer" },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Platform Engineer especializado en AWS, DevOps, SRE y LLM Operations",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  ],

  themeConfig: {
    logo: "/logo.svg",

    nav: [
      { text: "Inicio", link: "/" },
      { text: "About", link: "/about" },
      { text: "Projects", link: "/projects" },
      { text: "Learning", link: "/learning" },
      { text: "Blog", link: "/blog/" },
    ],

    socialLinks: [
      { icon: "github", link: `https://github.com/${githubUser}` },
      { icon: "linkedin", link: "https://linkedin.com/in/vlavid" },
    ],

    footer: {
      message: "AWS & DevOps | SRE | LLM Operations",
      copyright: `© ${new Date().getFullYear()} vlavid`,
    },

    search: {
      provider: "local",
    },
  },

  vite: {
    define: {
      __GITHUB_USER__: JSON.stringify(githubUser),
    },
  },
});
