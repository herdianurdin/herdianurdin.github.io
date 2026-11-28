#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const errors = [];

const config = read("src/config/site.ts");
const requiredProfiles = {
  youtube: "https://www.youtube.com/@herdianurdin",
  facebook: "https://web.facebook.com/herdianurdin3",
  instagram: "https://instagram.com/herdianurdin",
  tiktok: "https://tiktok.com/@herdianurdin",
};

for (const [name, url] of Object.entries(requiredProfiles)) {
  if (!config.includes(`${name}: "${url}"`)) {
    errors.push(`siteConfig.socials.${name} must match the supplied profile URL.`);
  }
}

const socialLinks = read("src/components/author/SocialLinks.astro");
for (const label of ["YouTube", "Facebook", "Instagram", "TikTok"]) {
  if (!socialLinks.includes(`label: "${label}"`)) {
    errors.push(`SocialLinks is missing the visible ${label} link.`);
  }
}
if (!/target="_blank"/.test(socialLinks) || !/rel="noopener noreferrer"/.test(socialLinks)) {
  errors.push("External social links must open safely in a new browsing context.");
}

const seo = read("src/components/SeoHead.astro");
if (!/\.\.\.Object\.values\(siteConfig\.socials\)/.test(seo)) {
  errors.push("Person.sameAs must include the configured social profiles.");
}

for (const [file, label] of [
  ["src/components/home/HeroProfile.astro", "homepage author profile"],
  ["src/components/author/AuthorIdentityCard.astro", "About author identity card"],
]) {
  if (!/<SocialLinks\s+language=\{language\}/.test(read(file))) {
    errors.push(`${label} must display the shared social-links component.`);
  }
}

if (errors.length) {
  console.error(`Social profile validation failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Social profile validation passed: four supplied URLs, visible profile links, safe external-link attributes, and Person.sameAs are consistent.");
}
