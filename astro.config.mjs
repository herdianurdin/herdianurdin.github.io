import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";
import rehypeLocalImageAttributes from "./scripts/rehype-local-image-attributes.mjs";
import rehypeContentWrappers from "./scripts/rehype-content-wrappers.mjs";
import { unified } from "@astrojs/markdown-remark";

export default defineConfig({
  site: "https://herdianurdin.my.id",

  // Target deployment: GitHub Pages serves pre-rendered static files.
  output: "static",
  trailingSlash: "always",

  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener", "noreferrer"],
          },
        ],
        rehypeLocalImageAttributes,
        rehypeContentWrappers,
      ],
    }),
  },

  image: {
    domains: ["placehold.co", "ui-avatars.com"],
    // Markdown images stored under src/ receive a small responsive srcset at build time.
    // Three breakpoints balance mobile, standard desktop, and high-density reading screens.
    // Editorial cover/profile components use explicit, shared Image width sets.
    layout: "constrained",
    responsiveStyles: true,
    breakpoints: [480, 800, 1440],
  },

  build: {
    // Keep tiny CSS inline; emit larger shared styles as cacheable assets.
    inlineStylesheets: "auto",
  },

  // 2. Tambahkan blok vite ini untuk memproses Tailwind v4
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    // tailwind() sudah DIHAPUS dari sini
    mdx(),
  ],

  compressHTML: true,
});
