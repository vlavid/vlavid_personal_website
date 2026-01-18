# vlavid Personal Website

Sitio web personal construido con VitePress.

## Desarrollo local

```bash
npm install
npm run docs:dev
```

## Build

```bash
npm run docs:build
```

## Deploy

Push a `main` y GitHub Actions desplegará automáticamente en GitHub Pages.

## Estructura

```
docs/
├── .vitepress/
│   ├── config.mts       # Configuración
│   └── theme/           # Tema personalizado
├── public/              # Assets estáticos (CV, logos)
├── index.md             # Home
├── about.md             # About + CV
├── projects.md          # GitHub repos
├── learning.md          # Learning Hub
└── blog/                # Posts
```
