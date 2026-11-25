import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const [idPosts, enPosts] = await Promise.all([
    getCollection("id", ({ data }) => data.isDraft !== true),
    getCollection("en", ({ data }) => data.isDraft !== true),
  ]);

  const allPosts = [...idPosts, ...enPosts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: "Herdi Herdianurdin | Jurnal IT",
    description:
      "Dokumentasi eksperimen teknis, optimasi performa, dan pemecahan masalah perangkat lunak Android & Web.",
    site: context.site,
    items: allPosts.map((post) => {
      const isEnglish = post.collection === "en";
      const urlPrefix = isEnglish ? "/en/blog/" : "/blog/";

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `${urlPrefix}${post.id}/`,
      };
    }),
  });
}
