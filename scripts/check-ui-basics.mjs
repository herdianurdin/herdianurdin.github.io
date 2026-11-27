import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const mainLandmarkFiles = [
  'src/components/archive/ArchivePage.astro',
  'src/layouts/BlogLayout.astro',
  'src/layouts/PlaygroundLayout.astro',
  'src/pages/404.astro',
  'src/pages/about.astro',
  'src/pages/disclaimer.astro',
  'src/pages/en/about.astro',
  'src/pages/en/disclaimer.astro',
  'src/pages/en/index.astro',
  'src/pages/en/privacy-policy.astro',
  'src/pages/en/terms-of-service.astro',
  'src/pages/index.astro',
  'src/pages/privacy-policy.astro',
  'src/pages/terms-of-service.astro',
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

const translations = read('src/config/site.ts');
for (const [locale, label] of [['id', 'Lewati ke konten utama'], ['en', 'Skip to main content']]) {
  if (!translations.includes(`skipToContent: "${label}"`)) {
    failures.push(`src/config/site.ts: missing ${locale} skip-link label`);
  }
}

for (const relativePath of ['src/layouts/BaseLayout.astro', 'src/layouts/BlogLayout.astro']) {
  const source = read(relativePath);
  if (!/href="#main-content"/.test(source) || !/\{t\.skipToContent\}/.test(source)) {
    failures.push(`${relativePath}: localized skip link to #main-content is missing`);
  }
}

const playgroundLayout = read('src/layouts/PlaygroundLayout.astro');
const playgroundPage = read('src/pages/python-playground.astro');
if (!/href="#playground-heading"/.test(playgroundLayout)) {
  failures.push('Playground layout: skip link target #playground-heading is missing');
}
if (!/id="playground-heading"[^>]*tabindex="-1"/.test(playgroundPage)) {
  failures.push('Python Playground: skip-link heading target is missing or not focusable');
}

const header = read('src/components/Header.astro');
const headerScript = header.slice(header.indexOf('<script is:inline>'));
if (!/role="progressbar"/.test(header) || !/aria-valuemin="0"/.test(header) || !/aria-valuemax="100"/.test(header) || !/aria-valuenow="0"/.test(header)) {
  failures.push('Article reading progress: accessible progressbar semantics are incomplete');
}
if (!/requestAnimationFrame\(updateProgress\)/.test(headerScript)) {
  failures.push('Article reading progress: scroll updates should be scheduled with requestAnimationFrame');
}

const archive = read('src/components/archive/ArchivePage.astro');
if (!/aria-label=\{language === "id" \? "Navigasi halaman" : "Page navigation"\}/.test(archive)) {
  failures.push('Archive pagination: language-aware navigation label is missing');
}
if (!/aria-current="page"/.test(archive)) {
  failures.push('Archive pagination: current page is not identified semantically');
}
const currentPageSpan = archive.match(/<span[^>]*aria-current="page"[^>]*>/)?.[0] ?? '';
if (!currentPageSpan || /\bhidden\b/.test(currentPageSpan)) {
  failures.push('Archive pagination: current-page indicator must remain available at mobile widths');
}

const articleCard = read('src/components/ui/ArticleCard.astro');
if (!/aria-hidden="true"\s+tabindex="-1"[\s\S]*?alt=""/.test(articleCard)) {
  failures.push('Article card: hidden decorative cover image should use an empty alt attribute');
}

if (failures.length > 0) {
  console.error(`UI baseline validation failed (${failures.length} issue(s)):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`UI baseline validation passed: ${mainLandmarkFiles.length} main landmarks, localized skip links, Playground target, article progress semantics, bilingual pagination, and decorative card images checked.`);
}
