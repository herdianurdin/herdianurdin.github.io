import { readFile } from "node:fs/promises";

const files = {
  home: "src/components/home/HeroProfile.astro",
  about: "src/components/author/AuthorIdentityCard.astro",
  article: "src/components/article/AuthorBox.astro",
  socials: "src/components/author/SocialLinks.astro",
};

const [sources, themeCss] = await Promise.all([
  Promise.all(
    Object.entries(files).map(async ([key, path]) => [key, await readFile(path, "utf8")]),
  ).then(Object.fromEntries),
  readFile("src/styles/global.css", "utf8"),
]);
const failures = [];

function requirePattern(key, pattern, description) {
  if (!pattern.test(sources[key])) failures.push(`${files[key]}: ${description}`);
}

function forbidPattern(key, pattern, description) {
  if (pattern.test(sources[key])) failures.push(`${files[key]}: ${description}`);
}

// Homepage: preserve the full portrait and keep the shared social component.
requirePattern("home", /aspect-square[^\n]*object-contain/, "homepage portrait must preserve its full composition");
forbidPattern("home", /object-cover/, "homepage portrait must not be cropped");
requirePattern("home", /SocialLinks/, "homepage must use the shared social link component");

// About: use the full content width and keep the portrait centered above the details at every breakpoint.
requirePattern("about", /w-full max-w-none grid-cols-1/, "About card should fill its available content width without a desktop width cap");
requirePattern("about", /flex w-full items-center justify-center[^\n]*border-b-2/, "About portrait area should be full-width, centered, and placed above the details");
requirePattern("about", /w-28 max-w-full object-contain sm:w-36/, "About portrait should stay centered, responsive, and uncropped");
forbidPattern("about", /sm:grid-cols-\[|sm:w-fit|max-w-\[44rem\]/, "About card must not switch back to a side-by-side or narrow content-fit layout");
requirePattern("about", /PROFIL & KARYA[\s\S]*?siteConfig\.github[\s\S]*?siteConfig\.linkedin[\s\S]*?siteConfig\.playStore/, "professional links must be grouped separately from social links");
requirePattern("about", /MEDIA SOSIAL[\s\S]*?<SocialLinks/, "social links need their own clearly labelled group");
forbidPattern("about", /max-w-5xl/, "About card should not be forced to a broad fixed maximum width");
forbidPattern("about", /object-cover/, "About portrait must not be cropped");
requirePattern("about", /\.profile-link\s*\{[^}]*background:\s*var\(--color-surface-page\)/s, "professional links should be neutral before interaction");
requirePattern("about", /\.profile-link:is\(:hover, :focus-visible\)[\s\S]*?background:\s*var\(--color-brand-cyan\)/, "professional link accent should appear on hover or keyboard focus");

// Article footer: stack and center the portrait on mobile, then use a full-width text column.
requirePattern("article", /flex flex-col items-center[^\n]*text-center sm:flex-row[^\n]*sm:text-left/, "article footer must stack and center its portrait on mobile, then align horizontally at sm");
requirePattern("article", /class="h-16 w-16 shrink-0[^\"]*object-contain/, "article avatar must be compact and uncropped");
requirePattern("article", /<div class="w-full min-w-0">[\s\S]*?<p class="mt-2 text-sm leading-relaxed/, "article author text must use the available width without a narrow max-width constraint");
requirePattern("article", /href=\{profileUrl\}/, "author name should link to the localized profile page");
forbidPattern("article", /max-w-\[58ch\]|PROFIL LENGKAP|FULL PROFILE/i, "remove the narrow bio width and oversized profile CTA");
forbidPattern("article", /object-cover/, "article avatar must not be cropped");

// Shared social links: neutral at rest; brand color only on hover/focus.
for (const brand of ["youtube", "facebook", "instagram", "tiktok"]) {
  requirePattern("socials", new RegExp(`social-link--${brand}`), `${brand} needs a dedicated hover treatment`);
}
requirePattern("socials", /background:\s*var\(--color-surface-page\);[\s\S]*?color:\s*var\(--color-white\);/, "social buttons must use a neutral default appearance");
requirePattern("socials", /\.social-link:is\(:hover, :focus-visible\)[\s\S]*?background:\s*var\(--social-hover-bg\)[\s\S]*?color:\s*var\(--social-hover-fg\)/, "brand colors must appear on hover and keyboard focus only");
requirePattern("socials", /min-height:\s*2\.75rem/, "social links should meet the 44px minimum target height");
requirePattern("socials", /:focus-visible\s*\{[^}]*outline:/s, "social links need a visible keyboard focus indicator");
requirePattern("socials", /prefers-reduced-motion:\s*reduce/, "social link motion must respect reduced-motion preferences");
requirePattern("socials", /target="_blank"[\s\S]*?rel="noopener noreferrer"/, "external social links must use safe new-tab attributes");
const socialBaseRule = sources.socials.match(/\.social-link\s*\{([^}]*)\}/s)?.[1] ?? "";
if (/background:\s*var\(--social-hover-bg\)/.test(socialBaseRule)) {
  failures.push(`${files.socials}: brand hover color must not be the default background`);
}

function luminance(hex) {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const rgb = [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  const linear = rgb.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const fg = luminance(foreground);
  const bg = luminance(background);
  if (fg === null || bg === null) return null;
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const brand of ["youtube", "facebook", "instagram", "tiktok"]) {
  const selector = new RegExp(`\\.social-link--${brand}\\s*\\{([^}]*)\\}`, "s");
  const match = sources.socials.match(selector);
  if (!match) continue;
  const background = match[1].match(/--social-hover-bg:\s*var\((--color-[a-z-]+)\)/);
  const foreground = match[1].match(/--social-hover-fg:\s*var\((--color-(?:black|white))\)/);
  if (!background || !foreground) {
    failures.push(`${files.socials}: ${brand} hover must use centralized foreground and background tokens`);
    continue;
  }
  const backgroundHex = themeCss.match(new RegExp(`${background[1]}:\\s*(#[0-9a-fA-F]{6})\\s*;`))?.[1];
  const foregroundHex = foreground[1] === "--color-black" ? "#000000" : "#ffffff";
  if (!backgroundHex) {
    failures.push(`src/styles/global.css: missing color value for ${background[1]}`);
    continue;
  }
  const ratio = contrastRatio(foregroundHex, backgroundHex);
  if (ratio === null || ratio < 4.5) {
    failures.push(`${files.socials}: ${brand} hover label contrast is ${ratio?.toFixed(2) ?? "invalid"}:1; expected at least 4.5:1`);
  }
}

if (failures.length) {
  console.error(`Author/profile UI validation failed (${failures.length} issue(s)):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Author/profile UI validation passed: About card fills its content width with a centered top portrait, article footer stacks on mobile and fills its text column, portraits remain uncropped, and social brand colors are hover/focus-only with at least 4.5:1 contrast.");
}
