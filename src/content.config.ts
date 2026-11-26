import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const contentIdSchema = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/,
  "Translation slug must match a lowercase kebab-case content ID.",
);

const postSchema = z.object({
  title: z.string(),
  description: z.string().min(10),
  pubDate: z.date(),
  updatedDate: z.date().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isDraft: z.boolean().default(false),
  enSlug: contentIdSchema.optional(),
  idSlug: contentIdSchema.optional(),
  faq: z
    .array(
      z.object({
        q: z.string(),
        a: z.string(),
      }),
    )
    .optional(),
}).refine(
  (data) => !data.updatedDate || data.updatedDate >= data.pubDate,
  { path: ["updatedDate"], message: "updatedDate cannot be earlier than pubDate." },
);

const id = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/id" }),
  schema: postSchema,
});

const en = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/en" }),
  schema: postSchema,
});

export const collections = { id, en };
