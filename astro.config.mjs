import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";
import rehypeLocalImageAttributes from "./scripts/rehype-local-image-attributes.mjs";
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
      ],
    }),
  },

  image: {
    domains: ["placehold.co", "ui-avatars.com"],
  },

  build: {
    inlineStylesheets: "always",
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
