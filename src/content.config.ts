import { defineCollection, type SchemaContext } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const contentIdSchema = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/,
  "Translation slug must match a lowercase kebab-case content ID.",
);

const createPostSchema = ({ image }: SchemaContext) => z.object({
  title: z.string(),
  description: z.string().min(10),
  pubDate: z.date(),
  updatedDate: z.date().optional(),
  // Local cover paths resolve relative to each Markdown file and are processed by Astro.
  // Absolute URLs remain supported for remote/demo content.
  coverImage: z.union([image(), z.url()]).optional(),
  coverImageAlt: z.string().trim().min(3).optional(),
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
  schema: createPostSchema,
});

const en = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/en" }),
  schema: createPostSchema,
});

export const collections = { id, en };
