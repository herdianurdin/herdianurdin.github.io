#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const mainLandmarkFiles = [
  "src/components/archive/ArchivePage.astro",
  "src/components/playgrounds/PlaygroundsDirectory.astro",
  "src/layouts/BlogLayout.astro",
  "src/layouts/PlaygroundLayout.astro",
  "src/pages/404.astro",
  "src/pages/about.astro",
  "src/pages/disclaimer.astro",
  "src/pages/en/about.astro",
  "src/pages/en/disclaimer.astro",
  "src/pages/en/index.astro",
  "src/pages/en/privacy-policy.astro",
  "src/pages/en/terms-of-service.astro",
  "src/pages/index.astro",
  "src/pages/privacy-policy.astro",
  "src/pages/terms-of-service.astro",
];

for (const relativePath of mainLandmarkFiles) {
  const source = read(relativePath);
  const mainTags = source.match(/<main\b[^>]*>/gs) ?? [];
  if (mainTags.length !== 1) {
    failures.push(`${relativePath}: expected exactly one main landmark, found ${mainTags.length}`);
    continue;
  }
  if (!/\bid="main-content"/.test(mainTags[0])) {
    failures.push(`${relativePath}: main landmark is missing id="main-content"`);
  }
  if (!/\btabindex="-1"/.test(mainTags[0])) {
    failures.push(`${relativePath}: main landmark must be programmatically focusable (tabindex="-1")`);
  }
}

const translations = read("src/config/site.ts");
for (const [locale, label] of [["id", "Lewati ke konten utama"], ["en", "Skip to main content"]]) {
  if (!translations.includes(`skipToContent: "${label}"`)) {
    failures.push(`src/config/site.ts: missing ${locale} skip-link label`);
  }
}

for (const relativePath of ["src/layouts/BaseLayout.astro", "src/layouts/BlogLayout.astro"]) {
  const source = read(relativePath);
  if (!/href="#main-content"/.test(source) || !/\{t\.skipToContent\}/.test(source)) {
    failures.push(`${relativePath}: localized skip link to #main-content is missing`);
  }
}

const playgroundLayout = read("src/layouts/PlaygroundLayout.astro");
const playgroundPage = read("src/pages/python-playground.astro");
if (!/href="#playground-heading"/.test(playgroundLayout)) {
  failures.push("Playground layout: skip link target #playground-heading is missing");
}
if (!/id="playground-heading"[^>]*tabindex="-1"/.test(playgroundPage)) {
  failures.push("Python Playground: skip-link heading target is missing or not focusable");
}
if (!/href="\/playgrounds\/"/.test(playgroundPage)) {
  failures.push("Python Playground: app header must provide a route back to the Playgrounds directory");
}

const header = read("src/components/Header.astro");
const headerScript = header.slice(header.indexOf("<script is:inline>"));
if (!/role="progressbar"/.test(header) || !/aria-valuemin="0"/.test(header) || !/aria-valuemax="100"/.test(header) || !/aria-valuenow="0"/.test(header)) {
  failures.push("Article reading progress: accessible progressbar semantics are incomplete");
}
if (!/requestAnimationFrame\(updateProgress\)/.test(headerScript)) {
  failures.push("Article reading progress: scroll updates should be scheduled with requestAnimationFrame");
}

const archive = read("src/components/archive/ArchivePage.astro");
if (!/aria-label=\{language === "id" \? "Navigasi halaman" : "Page navigation"\}/.test(archive)) {
  failures.push("Archive pagination: language-aware navigation label is missing");
}
if (!/aria-current="page"/.test(archive)) {
  failures.push("Archive pagination: current page is not identified semantically");
}
const currentPageSpan = archive.match(/<span[^>]*aria-current="page"[^>]*>/)?.[0] ?? "";
if (!currentPageSpan || /\bhidden\b/.test(currentPageSpan)) {
  failures.push("Archive pagination: current-page indicator must remain available at mobile widths");
}

const articleCard = read("src/components/ui/ArticleCard.astro");
if (!/aria-hidden="true"\s+tabindex="-1"[\s\S]*?alt=""/.test(articleCard)) {
  failures.push("Article card: hidden decorative cover image should use an empty alt attribute");
}

for (const href of ["href={journalUrl}", "href={playgroundsUrl}", "href={aboutUrl}"]) {
  if (!header.includes(href)) failures.push(`Header: primary navigation link is missing (${href})`);
}
if (!/aria-current=\{isJournal \? 'page' : undefined\}/.test(header)) {
  failures.push("Header: active journal navigation state is not exposed with aria-current");
}
if (!/aria-current=\{isPlaygrounds \? 'page' : undefined\}/.test(header)) {
  failures.push("Header: active Playgrounds directory state is not exposed with aria-current");
}
if (!/<details class="group relative md:hidden">/.test(header)) {
  failures.push("Header: mobile navigation should use a native details disclosure");
}
if (!/site-container flex items-center justify-between gap-2 py-3 sm:gap-3/.test(header)) {
  failures.push("Header: shared container and compact mobile spacing are required");
}
if (!/inline-flex min-h-11 items-center/.test(header)) {
  failures.push("Header: primary navigation targets should have a comfortable minimum touch height");
}
if (!/hidden shrink-0 items-center gap-2 md:flex md:gap-4[\s\S]*?<LanguageSwitcher/.test(header)) {
  failures.push("Header: language controls should stay in the desktop header only");
}
if (!/border-t-2 border-border-muted px-4 py-3[\s\S]*?languageLabel[\s\S]*?<LanguageSwitcher/.test(header)) {
  failures.push("Mobile navigation: language switcher should live inside the expanded menu");
}
if (!/w-\[min\(22rem,calc\(100vw-2rem\)\)\]/.test(header)) {
  failures.push("Mobile navigation: menu panel should fit narrow viewports without horizontal overflow");
}

const languageSwitcher = read("src/components/header/LanguageSwitcher.astro");
if (!/min-h-10/.test(languageSwitcher)) {
  failures.push("Language switcher: controls should have a comfortable minimum touch height");
}
if (!/gap-1 font-mono text-xs sm:gap-2 sm:text-sm/.test(languageSwitcher) || !/px-2 py-2[^\"]*sm:px-3/.test(languageSwitcher)) {
  failures.push("Language switcher: compact mobile sizing should avoid crowding the primary header");
}

const blogLayout = read("src/layouts/BlogLayout.astro");
if (!/const profileUrl = language === "id" \? "\/about\/" : "\/en\/about\/"/.test(blogLayout)) {
  failures.push("Article byline: author link must resolve to the localized profile page");
}
if (!/site-reading/.test(blogLayout)) {
  failures.push("Article body: shared reading measure class is missing");
}
if (!/frontmatter\.description/.test(blogLayout)) {
  failures.push("Article header: visible article summary is missing");
}
if (/const tables = document\.querySelectorAll\("\.prose table"\)/.test(blogLayout)) {
  failures.push("Article tables: avoid wrapping tables through post-load DOM mutation; use CSS overflow instead");
}

const relatedArticles = read("src/components/article/RelatedArticles.astro");
const relatedUtility = read("src/utils/related-articles.mjs");
if (!/visiblePosts\.map/.test(relatedArticles) || !/import \{ RELATED_ARTICLES_LIMIT \}/.test(relatedArticles) || !/posts\.slice\(0, RELATED_ARTICLES_LIMIT\)/.test(relatedArticles) || !/aria-labelledby="related-articles-heading"/.test(relatedArticles)) {
  failures.push("Related articles: related links must be semantically grouped and rendered from the computed list");
}
for (const route of ["src/pages/blog/[...slug].astro", "src/pages/en/blog/[...slug].astro"]) {
  const source = read(route);
  if (!/getRelatedArticles/.test(source) || !/related-articles\.mjs/.test(source)) {
    failures.push(`${route}: related articles must be limited to relevant same-language posts, at most three`);
  }
}
if (!/sharedTagCount > 0/.test(relatedUtility) || !/slice\(0, safeLimit\)/.test(relatedUtility)) {
  failures.push("Related articles: selection utility must exclude unrelated posts and enforce a result limit");
}
if (!/RelatedArticles posts=\{relatedPosts\}/.test(blogLayout)) {
  failures.push("Article layout: computed related articles are not rendered");
}

const toc = read("src/components/article/TableOfContents.astro");
const detailsTag = toc.match(/<details\b([^>]*)>/)?.[0] ?? "";
if (!detailsTag || /\bopen(?:=|\s|>)/.test(detailsTag)) {
  failures.push("Table of contents: it should be collapsed by default to prioritize the article content");
}
if (/site-reading/.test(toc) || !/<div class="site-reading">[\s\S]*?<TableOfContents headings=/.test(blogLayout)) {
  failures.push("Table of contents: it should inherit the single shared article reading wrapper");
}

const seoHead = read("src/components/SeoHead.astro");
if (!/language === "id" \? "\/about\/" : "\/en\/about\/"/.test(seoHead)) {
  failures.push("Structured author profile: localized profile URL is missing");
}

for (const pagePath of ["src/pages/index.astro", "src/pages/en/index.astro"]) {
  const homepage = read(pagePath);
  const editorialHero = homepage.indexOf("<EditorialHero");
  const latestJournal = homepage.indexOf("latest-journal-heading");
  const authorProfile = homepage.indexOf("<HeroProfile");
  const portfolio = homepage.indexOf("<Portfolio");
  if (editorialHero < 0 || latestJournal < 0 || authorProfile < 0 || portfolio < 0) {
    failures.push(`${pagePath}: editorial hero, journal list, author profile, and portfolio are all required`);
  } else if (!(editorialHero < latestJournal && latestJournal < authorProfile && authorProfile < portfolio)) {
    failures.push(`${pagePath}: homepage order should prioritize journals before author profile and portfolio`);
  }
}

const editorialHeroSource = read("src/components/home/EditorialHero.astro");
const heroArtworkPath = "public/assets/graphics/editorial-hero-blueprint.svg";
const heroArtwork = path.join(root, heroArtworkPath);
if (!editorialHeroSource.includes('/assets/graphics/editorial-hero-blueprint.svg') || !fs.existsSync(heroArtwork)) {
  failures.push("Editorial hero: lightweight decorative SVG background asset is missing or points to a retired path");
}
if (!/aria-hidden="true"/.test(editorialHeroSource) || !/pointer-events: none/.test(editorialHeroSource)) {
  failures.push("Editorial hero: decorative background must remain non-interactive and hidden from assistive technology");
}
if (!/href={journalUrl}/.test(editorialHeroSource) || !/href={playgroundsUrl}/.test(editorialHeroSource)) {
  failures.push("Editorial hero: primary and secondary CTAs must point to the journal archive and Playgrounds directory");
}
if (/python-playground/.test(editorialHeroSource) || /Python Playground/.test(editorialHeroSource)) {
  failures.push("Editorial hero: secondary CTA should lead to the Playgrounds directory, not a single tool");
}
if ((translations.match(/browsePlaygrounds:/g) ?? []).length !== 2) {
  failures.push("Editorial hero: Playgrounds CTA must have Indonesian and English labels");
}
if ((translations.match(/languageLabel:/g) ?? []).length !== 2) {
  failures.push("Mobile navigation: language label must be localized in both languages");
}
const heroArtworkSource = read(heroArtworkPath);
if (heroArtworkSource.length > 5000 || /<script\b|\son[a-z]+=/i.test(heroArtworkSource)) {
  failures.push("Editorial hero: SVG must remain small and passive (no script/event attributes)");
}
const requiredStaticAssets = [
  "public/assets/icons/favicon-96x96.png",
  "public/assets/icons/apple-touch-icon.png",
  "public/assets/icons/icon-192.png",
  "public/assets/icons/icon-512.png",
  "public/certificates/sertifikat-dicoding-sib-kotlin.webp",
];
for (const assetPath of requiredStaticAssets) {
  if (!fs.existsSync(path.join(root, assetPath))) {
    failures.push(`Required static asset is missing: ${assetPath}`);
  }
}

const seoHeadSource = read("src/components/SeoHead.astro");
if (!seoHeadSource.includes('/assets/icons/favicon-96x96.png') || !seoHeadSource.includes('/assets/icons/apple-touch-icon.png')) {
  failures.push("SEO head: favicon and Apple touch icon must use the relocated static asset paths");
}
const manifest = JSON.parse(read("public/manifest.json"));
if (!manifest.icons?.some((icon) => icon.src === "/assets/icons/icon-192.png") || !manifest.icons?.some((icon) => icon.src === "/assets/icons/icon-512.png")) {
  failures.push("Web app manifest: 192px and 512px icons must use the relocated static asset paths");
}
const certificateArticle = read("src/content/id/jejak-panjang-belajar-ngoding-otodidak.md");
if (!certificateArticle.includes("/certificates/sertifikat-dicoding-sib-kotlin.webp")) {
  failures.push("Article certificate link must use the relocated public certificate path");
}

const archiveSearch = read("src/components/archive/ArchiveSearch.astro");
if (!/role="search"/.test(archiveSearch) || !/aria-label=\{t\.searchResultsLabel\}/.test(archiveSearch) || !/role="status"/.test(archiveSearch) || !/aria-live="polite"/.test(archiveSearch)) {
  failures.push("Archive search: results label and polite status announcement are required");
}
if (!/<ul[\s\S]*?id="archive-search-results"[\s\S]*?hidden/.test(archiveSearch) || /id="archive-search-results"[^>]*class="[^"]*\bhidden\b/.test(archiveSearch)) {
  failures.push("Archive search: results should use the native hidden attribute without a persistent Tailwind hidden class");
}
if (!/if \(query\.length < 2\)[\s\S]*?archiveResults\) archiveResults\.hidden = false[\s\S]*?pagination\) pagination\.hidden = false/.test(archiveSearch)) {
  failures.push("Archive search: short queries must restore the default article grid and pagination");
}
if (!/catch \{[\s\S]*?archiveResults\) archiveResults\.hidden = false[\s\S]*?pagination\) pagination\.hidden = false/.test(archiveSearch)) {
  failures.push("Archive search: a failed search request must preserve the normal archive fallback");
}
if (!/link\.textContent = entry\.title/.test(archiveSearch) || /innerHTML/.test(archiveSearch)) {
  failures.push("Archive search: result content must be created safely without HTML string injection");
}
const searchIndex = read("src/pages/search-index.json.ts");
if (!/getCollection\("id", \(\{ data \}\) => data\.isDraft !== true\)/.test(searchIndex) || !/getCollection\("en", \(\{ data \}\) => data\.isDraft !== true\)/.test(searchIndex)) {
  failures.push("Archive search index: both language collections must exclude drafts");
}
if (!/url: `\/blog\/\$\{post\.id\}\/`/.test(searchIndex) || !/url: `\/en\/blog\/\$\{post\.id\}\/`/.test(searchIndex)) {
  failures.push("Archive search index: localized article URLs must use the existing routes");
}

const contentWrappers = read("scripts/rehype-content-wrappers.mjs");
if (!/className: \["table-scroll"\]/.test(contentWrappers) || !/tagName === "table"/.test(contentWrappers)) {
  failures.push("Markdown tables: a compile-time scroll wrapper preserving native table markup is required");
}
if (!/rehypeContentWrappers/.test(read("astro.config.mjs"))) {
  failures.push("Markdown tables: compile-time table wrapper plugin is not registered in Astro config");
}

const authorIdentity = read("src/components/author/AuthorIdentityCard.astro");
for (const page of ["src/pages/about.astro", "src/pages/en/about.astro"]) {
  if (!/AuthorIdentityCard language=/.test(read(page))) {
    failures.push(`${page}: visible author identity card is missing`);
  }
}
for (const href of ["siteConfig.github", "siteConfig.linkedin", "siteConfig.playStore"]) {
  if (!authorIdentity.includes(href)) failures.push(`Author identity card: public evidence link is missing (${href})`);
}
if (!/loading="eager"/.test(authorIdentity) || !/fetchpriority="high"/.test(authorIdentity)) {
  failures.push("Author profile: top-of-page profile image should expose its intended loading priority");
}

const footer = read("src/components/Footer.astro");
if (!footer.includes('href={language == "id" ? "/editorial-policy/" : "/en/editorial-policy/"}') || !footer.includes("{t.editorialPolicy}")) {
  failures.push("Footer: localized editorial policy link is missing");
}
if (!/class="site-container/.test(footer)) {
  failures.push("Footer: content must align to the shared site container");
}
const editorialPolicyId = read("src/pages/editorial-policy.astro");
const editorialPolicyEn = read("src/pages/en/editorial-policy.astro");
const editorialContent = read("src/components/EditorialPolicyContent.astro");
for (const [name, source] of [["ID", editorialPolicyId], ["EN", editorialPolicyEn]]) {
  if (!source.includes("<EditorialPolicyContent")) failures.push(`Editorial policy ${name}: shared policy content is not rendered`);
}
for (const section of ["Experience", "References", "AI", "Updates and corrections"]) {
  if (!editorialContent.toLowerCase().includes(section.toLowerCase())) failures.push(`Editorial policy: ${section} guidance is missing`);
}
if (!/target="_blank" rel="noopener noreferrer"/.test(editorialContent)) {
  failures.push("Editorial policy: external correction/report link must be protected");
}
const sitemapSource = read("src/pages/sitemap.xml.ts");
for (const route of ['"/editorial-policy/"', '"/en/editorial-policy/"', '"/playgrounds/"', '"/en/playgrounds/"']) {
  if (!sitemapSource.includes(route)) failures.push(`Sitemap: expected static route is missing (${route})`);
}
if (!/editorial-policy/.test(seoHead)) {
  failures.push("Editorial policy: metadata layout should treat the policy page as a non-monetized informational page");
}
if (!/<main id="main-content" tabindex="-1"/.test(editorialContent)) {
  failures.push("Editorial policy: shared page content must provide the single focusable main landmark");
}
if (!/<div class="site-reading">[\s\S]*?<header[\s\S]*?<div class="prose prose-invert prose-lg max-w-none/.test(editorialContent)) {
  failures.push("Editorial policy: heading and body should share the fixed reading wrapper");
}

const playgroundsDirectory = read("src/components/playgrounds/PlaygroundsDirectory.astro");
const playgroundCatalog = read("src/config/playgrounds.mjs");
for (const route of ["src/pages/playgrounds/index.astro", "src/pages/en/playgrounds/index.astro"]) {
  if (!/PlaygroundsDirectory language=/.test(read(route))) {
    failures.push(`${route}: localized Playgrounds directory must render the shared directory component`);
  }
}
if (!/playgroundCatalog\.map/.test(playgroundsDirectory) || !/playground\.href/.test(playgroundsDirectory)) {
  failures.push("Playgrounds directory: cards must be generated from the centralized playground catalog");
}
if (!/id: "python"/.test(playgroundCatalog) || !/href: "\/python-playground\/"/.test(playgroundCatalog)) {
  failures.push("Playgrounds catalog: the existing Python Playground route must remain registered");
}
if (!header.includes("href={playgroundsUrl}") || header.includes('href="/python-playground/"')) {
  failures.push("Header: main navigation should target the Playgrounds directory, not one implementation");
}

const giscus = read("src/components/article/Giscus.astro");
if (!/<h2\b/.test(giscus)) {
  failures.push("Article discussion: section heading should use H2 after the article H1/content hierarchy");
}

if (failures.length > 0) {
  console.error(`UI baseline validation failed (${failures.length} issue(s)):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`UI baseline validation passed: ${mainLandmarkFiles.length} main landmarks, localized skip links, primary navigation, editorial-first homepages, article reading width/byline, collapsed TOC, Playground directory, progress semantics, pagination, and decorative images checked.`);
}
