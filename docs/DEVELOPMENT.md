# Development, Scripts, dan Troubleshooting

## 1. Environment

- Node.js 24.x (CI menggunakan Node 24)
- npm yang disertakan dengan Node
- Git
- Editor teks/IDE, misalnya VS Code

Gunakan dependency persis dari lockfile:

```bash
npm ci
```

Jangan menghapus `package-lock.json`. `npm ci` akan gagal atau menghasilkan environment yang berbeda jika lockfile tidak ada/tidak selaras.

## 2. Konfigurasi TypeScript

File `tsconfig.json` di root repository saat ini berisi:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "astro"
  }
}
```

Arti konfigurasi:

- `extends: "astro/tsconfigs/strict"` mewarisi konfigurasi TypeScript strict yang disediakan Astro. Tujuannya menangkap kesalahan tipe lebih awal, termasuk pada file `.astro` yang diperiksa melalui `astro check`.
- `jsx: "preserve"` mempertahankan JSX agar pemrosesan JSX ditangani oleh toolchain Astro/Vite, bukan diubah lebih awal oleh TypeScript.
- `jsxImportSource: "astro"` menetapkan sumber tipe/runtime JSX yang sesuai dengan integrasi Astro.

Pedoman perubahan:

1. Pertahankan preset strict sebagai basis.
2. Definisikan tipe `Props` pada komponen Astro yang memiliki input.
3. Gunakan tipe collection Astro dan schema Zod yang sudah ada; hindari `any` hanya untuk membungkam diagnostic.
4. Bila perlu menambah `compilerOptions`, pastikan opsi tersebut kompatibel dengan versi Astro/TypeScript pada lockfile dan jalankan `npx astro check` serta `npm run build`.
5. Jangan menyalin konfigurasi `tsconfig.json` generik dari proyek React/Vite lain tanpa mengecek kebutuhan Astro.

## 3. Perintah umum

```bash
npm run dev       # Astro dev server; host 0.0.0.0
npm run build     # Validator + Astro check + static build + validator output
npm run preview   # Preview dist hasil build
```

## 4. Scripts validasi

| Perintah | Script | Tujuan |
|---|---|---|
| `npm run check:content` | `scripts/check-content-relations.mjs` | Validasi file collection, content ID, relasi ID/EN dan status draft |
| `npm run check:links` | `scripts/check-internal-links.mjs` | Memastikan link artikel internal menuju artikel terbit |
| `npm run check:design-tokens` | `scripts/check-design-tokens.mjs` | Mencegah penggunaan warna/shadow brand hardcoded dan memeriksa token shadow |
| `npm run check:ui-basics` | `scripts/check-ui-basics.mjs` | Memeriksa landmark main, skip link, Playground target, reading progress, pagination dan cover dekoratif |
| `npm run check:seo` | `scripts/check-seo.mjs` | Validasi SEO output build |
| `npm run check:route-links` | `scripts/check-route-links.mjs` | Scan link internal di static HTML |
| `npm run check:structured-data` | `scripts/check-structured-data.mjs` | Validasi JSON-LD dan BlogPosting |
| `npm run check:page-metadata` | `scripts/check-page-metadata.mjs` | Title dan meta description pada halaman sitemap |
| `npm run check:social-meta` | `scripts/check-social-meta.mjs` | Open Graph/Twitter metadata |
| `npm run check:image-assets` | `scripts/check-image-assets.mjs` | Gambar lokal, dimensi, format, social images, dan warning atribut |
| `npm run check:onpage` | `scripts/check-onpage.mjs` | H1/heading, accessible name tautan, teks anchor generik |
| `npm run check:production-seo` | `scripts/check-production-seo.mjs` | Pemeriksaan SEO terhadap situs live; tidak termasuk build default |
| `npm run report:build-size -- <dir...>` | `scripts/report-build-size.mjs` | Perbandingan ukuran HTML/CSS output build |

`npm run build` menjalankan content, links, design tokens, UI basics, `astro check`, `astro build`, SEO, route links, structured data, page metadata, social metadata, image assets, dan on-page checker.

## 5. Urutan kerja konten lokal

1. Buat file baru dengan `isDraft: true` saat belum siap terbit.
2. Tambahkan gambar ke `public/images/` bila perlu.
3. Jalankan `npm run check:content` dan `npm run check:links`.
4. Jalankan `npm run build`.
5. Jalankan `npm run preview`.
6. Periksa artikel, link, gambar, TOC, tabel, code block, dan layout mobile.
7. Ubah draft status menjadi false saat siap.
8. Build ulang dan pastikan sitemap/RSS memiliki item yang sesuai.

## 6. Menangani gambar

Jika checker menyatakan image file missing:

- Pastikan file benar-benar ada di `public/images/`.
- Path di Markdown harus `/images/filename.webp`.
- Perhatikan kapitalisasi nama file; production Linux case-sensitive.
- Hindari spasi/karakter khusus.

Peringatan `decoding` pada `profile.webp` yang telah terlihat pada baseline adalah warning, bukan error build. Jangan menambahkan atribut secara serampangan pada gambar LCP/hero; nilai strategi loading dan decoding sesuai posisi dan konteks render.

## 7. Tipe data dan schema

Jika `astro check` melaporkan frontmatter:

- periksa field yang required,
- `description` tidak boleh kurang dari 10 karakter,
- format tanggal dapat diparse,
- `updatedDate` tidak boleh lebih awal dari `pubDate`,
- `enSlug` hanya di collection `id`, `idSlug` hanya di collection `en`,
- slug harus lowercase kebab-case.

Jangan mengatasi schema error dengan menurunkan tipe atau menambah `any` tanpa alasan.

## 8. Tautan internal

`check:links` hanya mengecek link artikel internal yang ditemukan pada konten artikel terbit. Ia mengabaikan teks di fenced code dan inline code, serta melewatkan draft. Pastikan path artikel benar-benar sesuai content ID yang terbit.

Route artikel Indonesia diawali `/blog/`, Inggris `/en/blog/`. URL internal harus menggunakan trailing slash.

## 9. Troubleshooting umum

### `npm ci` gagal karena lockfile tidak ada

Pastikan `package-lock.json` di root repo dan tracked oleh Git. Jangan mematikan cache setup-node sebagai cara mengatasi lockfile hilang. Commit lockfile bersama perubahan package manifest.

### Dependency audit menemukan kerentanan

Jalankan `npm audit` dan `npm ls <package>`. Periksa jalur dependency sebelum melakukan perubahan. Hindari `npm audit fix --force` tanpa review perubahan major. Repository saat audit ini menggunakan override:

```json
"overrides": {
  "@tailwindcss/typography": {
    "postcss-selector-parser": "6.1.5"
  }
}
```

Pertahankan override sampai versi upstream dan lockfile ditinjau ulang. Jalankan `npm install`, `npm ls`, `npm audit`, dan `npm run build` setelah perubahan dependency.

### Astro check menghasilkan error tipe

Perbaiki tipe prop/collection di sumber. Periksa definisi `Props`, schema Zod, dan binding `Astro.props`. Hindari cast ke `any` sebagai jalan pintas.

### CSS tidak terlihat di preview

Pastikan `npm run build` selesai, lihat `dist/`, periksa request CSS di Network, dan pastikan URL aset sesuai. Konfigurasi `inlineStylesheets: "auto"` mengeluarkan stylesheet besar sebagai file aset dan membiarkan yang kecil inline.

### Checker on-page menyebut link tanpa teks

Periksa apakah tautan benar-benar memiliki accessible name. Tautan dekoratif yang sengaja disembunyikan dari accessibility tree menggunakan kombinasi `aria-hidden="true"` dan `tabindex="-1"` saja yang dikecualikan checker. Jangan menambahkan pengecualian global untuk tautan kosong.

### Build gagal di GitHub tetapi lulus lokal

Periksa Node version, lockfile tracked, case-sensitive path, command yang sama dengan `npm run build`, dan log job GitHub Actions. CI berjalan pada Linux.

## 10. File yang tidak boleh di-commit

`.gitignore` mengecualikan `node_modules/`, `dist/`, `.astro/`, log npm, file environment, dan file sementara editor/OS. Jangan menambahkan `.env` atau kredensial ke repository.
