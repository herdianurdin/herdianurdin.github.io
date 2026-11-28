/**
 * @typedef {Object} RelatedArticleSource
 * @property {string} id
 * @property {{ title: string, description: string, pubDate: Date, tags?: string[] }} data
 *
 * @typedef {Object} RelatedArticle
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 */

export const RELATED_ARTICLES_LIMIT = 3;

/**
 * Select up to `limit` same-collection articles sharing the most tags.
 * Ties are resolved by publication date, then title for deterministic builds.
 *
 * @param {RelatedArticleSource} currentPost
 * @param {readonly RelatedArticleSource[]} posts
 * @param {number} [limit]
 * @returns {RelatedArticle[]}
 */
export function getRelatedArticles(currentPost, posts, limit = RELATED_ARTICLES_LIMIT) {
  const currentTags = new Set(
    (currentPost.data.tags ?? [])
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
  );
  if (currentTags.size === 0) return [];

  const safeLimit = Number.isFinite(limit)
    ? Math.min(RELATED_ARTICLES_LIMIT, Math.max(0, Math.floor(limit)))
    : RELATED_ARTICLES_LIMIT;
  if (safeLimit === 0) return [];

  return posts
    .filter((candidate) => candidate.id !== currentPost.id)
    .map((candidate) => {
      const sharedTagCount = new Set(
        (candidate.data.tags ?? [])
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => currentTags.has(tag)),
      ).size;
      return { candidate, sharedTagCount };
    })
    .filter(({ sharedTagCount }) => sharedTagCount > 0)
    .sort((a, b) => {
      if (a.sharedTagCount !== b.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }
      const dateDifference = b.candidate.data.pubDate.valueOf() - a.candidate.data.pubDate.valueOf();
      if (dateDifference !== 0) return dateDifference;
      return a.candidate.data.title.localeCompare(b.candidate.data.title);
    })
    .slice(0, safeLimit)
    .map(({ candidate }) => ({
      id: candidate.id,
      title: candidate.data.title,
      description: candidate.data.description,
      tags: candidate.data.tags ?? [],
    }));
}
