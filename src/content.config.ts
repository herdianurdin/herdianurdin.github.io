// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Definisi koleksi bahasa Indonesia
const id = defineCollection({
  // Loader glob mencari semua file .md dan .mdx di folder id
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/id" }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(10), // Sesuaikan batas karakter jika perlu
    pubDate: z.date(),
    coverImage: z
      .string()
      .default(
        "https://placehold.co/1200x600/000000/c6ff00?text=Herdi.Dev+Journal",
      ),
    tags: z.array(z.string()).optional(),
    isDraft: z.boolean().default(false),
  }),
});

// Definisi koleksi bahasa Inggris
const en = defineCollection({
  // Loader glob mencari semua file .md dan .mdx di folder en
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/en" }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(10),
    pubDate: z.date(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isDraft: z.boolean().default(false),
  }),
});

// Ekspor koleksi agar dikenali oleh Astro
export const collections = { id, en };
