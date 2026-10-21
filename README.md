# Matías Blanc — Portfolio

Portfolio y blog personal construido con [Astro](https://astro.build), donde comparto mis proyectos, apuntes y posts sobre desarrollo.

## ✨ Características

- ⚡ HTML estático generado con Astro; las métricas de rendimiento requieren una auditoría reproducible
- 🔍 SEO-friendly con URLs canónicas y Open Graph
- 🗺️ Sitemap y RSS feed generados automáticamente
- 📝 Contenido en Markdown y MDX con tipado de frontmatter
- 🎨 Estilos con Tailwind CSS 4 y tipografía personalizada
- 🧩 Componentes interactivos con React

## 🛠️ Stack

| Tecnología | Uso |
| --- | --- |
| [Astro](https://astro.build) | Framework del sitio |
| [React](https://react.dev) | Islas interactivas |
| [Tailwind CSS](https://tailwindcss.com) | Estilos |
| [MDX](https://mdxjs.com) | Contenido de posts y proyectos |
| [Bun](https://bun.sh) | Runtime y gestor de paquetes |

## 🚀 Proyectos destacados

- **Portfolio** — este sitio
- **ITF App** — [enlace al repo](https://github.com/MatiasBlanc)
- **Dotfiles** — [enlace al repo](https://github.com/MatiasBlanc)

## 📁 Estructura del proyecto

```text
├── public/          # Assets estáticos (imágenes, favicon)
├── src/
│   ├── components/  # Componentes Astro y React
│   ├── content/     # Colecciones: blog, projects, copilot
│   ├── layouts/     # Layouts base
│   ├── pages/       # Rutas del sitio
│   ├── consts.ts    # Constantes globales
│   └── global.css   # Estilos globales
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Acción |
| :--- | :--- |
| `bun install` | Instala las dependencias |
| `bun dev` | Inicia el servidor de desarrollo en `localhost:4321` |
| `bun build` | Genera el sitio de producción en `./dist/` |
| `bun run check:seo` | Compila y valida metadatos, imágenes, JSON-LD, enlaces, sitemap, RSS y borradores |
| `bun preview` | Previsualiza el build localmente |
| `bun astro check` | Revisa tipos y HTML del proyecto |

## SEO y visibilidad en IA

Ver [diagnóstico y plan SEO/GEO](./docs/seo-geo.md) para los pasos en Search Console, la estrategia editorial y los límites de las validaciones locales.

La imagen social se genera desde `src/assets/social-card.svg`. Para actualizarla:

```bash
node --input-type=module -e "import sharp from 'sharp'; await sharp('src/assets/social-card.svg').png().toFile('public/social-card.png');"
```

## 🌐 Sitio en vivo

El sitio está desplegado en **[mb.madeinchile.tech](https://mb.madeinchile.tech)**.

## 📄 Licencia

[MIT](./LICENSE)

## 🙌 Créditos

Tema original basado en [Bear Blog](https://github.com/HermanMartinus/bearblog/), adaptado y extendido con Tailwind CSS.
