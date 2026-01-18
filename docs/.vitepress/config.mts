import { defineConfig } from "vitepress";

const githubUser = "vlavid";

export default defineConfig({
  title: "Victor Lavid",
  description:
    "Compartiendo aprendizajes sobre AWS, DevOps y estrategia de carrera tech. Un espacio para crecer juntos en la nube.",

  head: [
    ["meta", { name: "author", content: "Victor Lavid" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "AWS, DevOps, Crecimiento Profesional, Cloud, Sharing Knowledge",
      },
    ],
    [
      "meta",
      { property: "og:title", content: "Victor Lavid | Creciendo en la Nube" },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Compartiendo aprendizajes sobre AWS, DevOps y estrategia de carrera tech.",
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
      { text: "Sobre mí", link: "/about" },
      { text: "Recursos", link: "/learning" },
      { text: "Blog", link: "/blog/" },
      { text: "Proyectos", link: "/projects" },
    ],

    socialLinks: [
      { icon: "github", link: `https://github.com/${githubUser}` },
      { icon: "linkedin", link: "https://linkedin.com/in/vlavid" },
    ],

    footer: {
      message: "Hecho con 💜 para la comunidad.",
      copyright: `© ${new Date().getFullYear()} Victor Lavid`,
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
