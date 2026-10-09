// src/pages/sitemap.xml.ts
import { getCollection } from "astro:content";
import { siteConfig } from "../config/site";

export async function GET() {
  // 1. Ambil data artikel dari koleksi "id" dan "en", saring yang bukan draf
  const idPosts = await getCollection(
    "id",
    ({ data }) => data.isDraft !== true,
  );
  const enPosts = await getCollection(
    "en",
    ({ data }) => data.isDraft !== true,
  );

  // 2. Urutkan artikel berdasarkan tanggal publikasi (Terbaru ke Terlama)
  idPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  enPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  // 3. Daftar halaman statis dan legal
  const staticPages = [
    "",
    "/blog",
    "/about",
    "/privacy-policy",
    "/disclaimer",
    "/terms-of-service",
    "/python-playground",
    "/en",
    "/en/blog",
    "/en/about",
    "/en/privacy-policy",
    "/en/disclaimer",
    "/en/terms-of-service",
  ];

  // Gunakan tanggal saat ini untuk halaman statis
  const staticLastMod = new Date().toISOString();

  // 4. Susun XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteConfig.url}${page}</loc>
    <lastmod>${staticLastMod}</lastmod>
  </url>`,
    )
    .join("")}
  ${idPosts
    .map((post) => {
      const lastModDate = new Date(post.data.pubDate).toISOString();
      return `
  <url>
    <loc>${siteConfig.url}/blog/${post.id}/</loc>
    <lastmod>${lastModDate}</lastmod>
  </url>`;
    })
    .join("")}
  ${enPosts
    .map((post) => {
      const lastModDate = new Date(post.data.pubDate).toISOString();
      return `
  <url>
    <loc>${siteConfig.url}/en/blog/${post.id}/</loc>
    <lastmod>${lastModDate}</lastmod>
  </url>`;
    })
    .join("")}
</urlset>`;

  // 5. Kembalikan sebagai respons XML
  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
