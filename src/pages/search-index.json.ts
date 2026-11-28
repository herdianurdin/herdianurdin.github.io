import { getCollection } from "astro:content";

interface SearchEntry {
  id: string;
  language: "id" | "en";
  title: string;
  description: string;
  tags: string[];
  pubDate: string;
  url: string;
}

export async function GET() {
  const [indonesianPosts, englishPosts] = await Promise.all([
    getCollection("id", ({ data }) => data.isDraft !== true),
    getCollection("en", ({ data }) => data.isDraft !== true),
  ]);

  const newestFirst = <T extends { data: { pubDate: Date; title: string } }>(posts: T[]) =>
    [...posts].sort((a, b) => {
      const dateDifference = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
      return dateDifference || a.data.title.localeCompare(b.data.title);
    });

  const entries: SearchEntry[] = [
    ...newestFirst(indonesianPosts).map((post) => ({
      id: post.id,
      language: "id" as const,
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags ?? [],
      pubDate: post.data.pubDate.toISOString(),
      url: `/blog/${post.id}/`,
    })),
    ...newestFirst(englishPosts).map((post) => ({
      id: post.id,
      language: "en" as const,
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags ?? [],
      pubDate: post.data.pubDate.toISOString(),
      url: `/en/blog/${post.id}/`,
    })),
  ];

  return new Response(JSON.stringify(entries), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
