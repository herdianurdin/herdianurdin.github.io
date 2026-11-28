import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const sourceRoot = 'src';
const globalCssPath = 'src/styles/global.css';
const globalCss = await readFile(globalCssPath, 'utf8');
const errors = [];
const files = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (/\.(astro|css|js|ts)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
}

await walk(sourceRoot);

const requiredColorTokens = [
  '--color-brand-lime',
  '--color-brand-cyan',
  '--color-brand-fuchsia',
  '--color-brand-fuchsia-readable',
  '--color-brand-danger',
  '--color-social-youtube',
  '--color-social-facebook',
  '--color-social-instagram',
  '--color-social-tiktok',
  '--color-surface-page',
  '--color-surface-panel',
  '--color-surface-card',
  '--color-border-muted',
  '--color-copy-muted',
  '--color-editor',
  '--color-editor-panel',
  '--color-editor-gutter',
];

for (const token of requiredColorTokens) {
  if (!globalCss.includes(`${token}:`)) {
    errors.push(`Missing color token ${token} in ${globalCssPath}`);
  }
}

const usedShadowTokens = new Set();
const rawBrandUtilities = [];
const rawBrandShadows = [];
const requiredSemanticUtilities = [
  ['bg-surface-page', '--color-surface-page'],
  ['bg-surface-panel', '--color-surface-panel'],
  ['bg-surface-card', '--color-surface-card'],
  ['text-copy-muted', '--color-copy-muted'],
  ['text-brand-fuchsia-readable', '--color-brand-fuchsia-readable'],
  ['border-border-muted', '--color-border-muted'],
];
const semanticUtilitiesFound = new Set();

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const relPath = relative('.', file);

  for (const match of source.matchAll(/\bshadow-neo-[a-z0-9-]+\b/g)) {
    usedShadowTokens.add(match[0]);
  }

  for (const [utility] of requiredSemanticUtilities) {
    if (new RegExp(`(?:^|[\\s'"\\x60])${utility}(?:$|[\\s'"\\x60])`).test(source)) {
      semanticUtilitiesFound.add(utility);
    }
  }

  const colorUtilities = /(?:\b[a-z-]+:)*(?:bg|text|border|decoration|placeholder|outline|ring|fill|stroke)-\[\s*#(?:c6ff00|00e5ff|d946ef|ff0055|282a36|1e1e1e)\s*\]/gi;
  for (const match of source.matchAll(colorUtilities)) {
    rawBrandUtilities.push(`${relPath}: ${match[0]}`);
  }

  const shadowUtilities = /\bshadow-\[[^\]]*#(?:c6ff00|00e5ff|d946ef|ff0055|fff|ffffff|000)\b[^\]]*\]/gi;
  for (const match of source.matchAll(shadowUtilities)) {
    rawBrandShadows.push(`${relPath}: ${match[0]}`);
  }
}

for (const className of [...usedShadowTokens].sort()) {
  const themeName = `--${className}`;
  if (!globalCss.includes(`${themeName}:`)) {
    errors.push(`Class ${className} has no matching ${themeName} theme token.`);
  }
}

for (const [utility, token] of requiredSemanticUtilities) {
  if (!globalCss.includes(`${token}:`)) {
    errors.push(`Missing semantic color token ${token} in ${globalCssPath}`);
  }
  if (!semanticUtilitiesFound.has(utility)) {
    errors.push(`Semantic utility ${utility} is defined but not used by any source component.`);
  }
}

for (const item of rawBrandUtilities) errors.push(`Hardcoded brand color utility remains: ${item}`);
for (const item of rawBrandShadows) errors.push(`Hardcoded brand shadow remains: ${item}`);

if (errors.length) {
  console.error(`Design token validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Design token validation passed: ${files.length} source/style files scanned, ` +
    `${requiredColorTokens.length} color tokens and ${usedShadowTokens.size} shadow tokens verified.`,
  );
}
