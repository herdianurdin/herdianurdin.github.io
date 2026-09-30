import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://herdianurdin.my.id",

  markdown: {
    shikiConfig: {
      theme: "dracula",
      wrap: true,
    },
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
    sitemap({
      filter: (page) => !page.includes("/404") && !page.includes("/rss.xml"),
    }),
    mdx(),
  ],

  compressHTML: true,
});
