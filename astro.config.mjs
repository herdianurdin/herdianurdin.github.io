import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";
import { unified } from "@astrojs/markdown-remark";

export default defineConfig({
  site: "https://herdianurdin.my.id",

  prefetch: {
    prefetchAll: true,
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
      ],
    }),
  },

  image: {
    domains: ["placehold.co", "ui-avatars.com"],
    dangerouslyProcessSVG: true,
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
