// src/pages/rss.xml.js
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  // Tambahkan || [] di akhir pemanggilan ID dan EN
  const idPosts =
    (await getCollection("id", ({ data }) => data.isDraft !== true)) || [];
  const enPosts =
    (await getCollection("en", ({ data }) => data.isDraft !== true)) || [];

  const allPosts = [...idPosts, ...enPosts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  // 3. Bangun struktur XML
  return rss({
    title: "Herdi Herdianurdin | Jurnal IT",
    description:
      "Dokumentasi eksperimen teknis, optimasi performa, dan pemecahan masalah perangkat lunak Android & Web.",
    site: context.site, // Mengambil properti 'site' dari astro.config.mjs
    items: allPosts.map((post) => {
      const isEnglish = post.collection === "en";
      const urlPrefix = isEnglish ? "/en/blog/" : "/blog/";

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `${urlPrefix}${post.id}`, // <-- Ubah dari post.slug menjadi post.id
      };
    }),
    customData: `<language>id-id</language>`,
  });
}
