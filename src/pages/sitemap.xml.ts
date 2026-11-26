import { getCollection } from "astro:content";
import { siteConfig } from "../config/site";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toAbsoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export async function GET() {
  const [idPosts, enPosts] = await Promise.all([
    getCollection("id", ({ data }) => data.isDraft !== true),
    getCollection("en", ({ data }) => data.isDraft !== true),
  ]);

  const staticPages = [
    "/",
    "/about/",
    "/privacy-policy/",
    "/disclaimer/",
    "/terms-of-service/",
    "/python-playground/",
    "/en/",
    "/en/about/",
    "/en/privacy-policy/",
    "/en/disclaimer/",
    "/en/terms-of-service/",
  ];

  // Archive pages intentionally use noindex, so they are not listed here.
  const entries: SitemapEntry[] = staticPages.map((path) => ({
    loc: toAbsoluteUrl(path),
  }));

  const sortedIdPosts = [...idPosts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const sortedEnPosts = [...enPosts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  for (const post of sortedIdPosts) {
    entries.push({
      loc: toAbsoluteUrl(`/blog/${post.id}/`),
      // Only use lastmod when an actual content update date was supplied.
      ...(post.data.updatedDate
        ? { lastmod: post.data.updatedDate.toISOString() }
        : {}),
    });
  }

  for (const post of sortedEnPosts) {
    entries.push({
      loc: toAbsoluteUrl(`/en/blog/${post.id}/`),
      ...(post.data.updatedDate
        ? { lastmod: post.data.updatedDate.toISOString() }
        : {}),
    });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
