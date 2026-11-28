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

### Validasi source sebelum build

| Perintah | Script | Tujuan |
|---|---|---|
| `npm run check:content` | `scripts/check-content-relations.mjs` | Validasi file collection, content ID, relasi ID/EN, dan status draft |
| `npm run check:links` | `scripts/check-internal-links.mjs` | Memastikan link artikel internal menuju artikel terbit |
| `npm run check:design-tokens` | `scripts/check-design-tokens.mjs` | Memvalidasi warna dan shadow tokens |
| `npm run check:ui-basics` | `scripts/check-ui-basics.mjs` | Landmark, skip link, navigasi, TOC, Playground, pagination, dan gambar dekoratif |
| `npm run check:layout-system` | `scripts/check-layout-system.mjs` | Container, reading measure, dan konsistensi layout editorial |
| `npm run check:playground-catalog` | `scripts/check-playground-catalog.mjs` | ID, route, metadata lokal, dan direktori Playground |
| `npm run check:markdown-wrappers` | `scripts/check-markdown-wrappers.mjs` | Struktur wrapper tabel dan urutan konten Markdown |
| `npm run check:related-articles` | `scripts/check-related-articles.mjs` | Relevansi tag, deduplikasi, urutan deterministik, dan batas tiga artikel |
| `npm run check:social-profiles` | `scripts/check-social-profiles.mjs` | URL profil sosial, link terlihat, keamanan external-link, dan `Person.sameAs` |
| `npm run check:author-cards` | `scripts/check-author-cards.mjs` | Layout profil/About/footer penulis, foto, hover/focus, dan kontras sosial |
| `npm run check:responsive-images` | `scripts/check-responsive-images.mjs` | Lokasi source image, path konten, breakpoint, width sets, dan format output |
| `npm run check:sharp-image-service` | `scripts/check-sharp-image-service.mjs` | Sharp, binary platform, Node.js CI, dan konfigurasi image service |

### Post-build checks dan utilitas

| Perintah | Script | Tujuan |
|---|---|---|
| `npm run check:seo` | `scripts/check-seo.mjs` | Sitemap, canonical, noindex, trailing slash, hreflang |
| `npm run check:route-links` | `scripts/check-route-links.mjs` | Link internal pada static HTML menuju route canonical |
| `npm run check:structured-data` | `scripts/check-structured-data.mjs` | JSON-LD dan BlogPosting |
| `npm run check:page-metadata` | `scripts/check-page-metadata.mjs` | Title dan meta description |
| `npm run check:social-meta` | `scripts/check-social-meta.mjs` | Open Graph dan Twitter metadata |
| `npm run check:image-assets` | `scripts/check-image-assets.mjs` | Gambar lokal, srcset, social preview, dan atribut aksesibilitas |
| `npm run check:onpage` | `scripts/check-onpage.mjs` | Heading kosong, accessible link name, anchor generik, dan heading-level skips |
| `npm run check:production-seo` | `scripts/check-production-seo.mjs` | Smoke test SEO pada situs live; dijalankan terpisah |
| `npm run report:build-size` | `scripts/report-build-size.mjs` | Ringkasan ukuran HTML/CSS/gambar dalam `dist/` |

`npm run build` menjalankan 12 source validators, `astro check`, `astro build`, kemudian seluruh post-build checks (SEO, route links, structured data, page metadata, social metadata, image assets, dan on-page). `check:production-seo` dan `report:build-size` tidak termasuk dalam build default.

## 5. Urutan kerja konten lokal

1. Buat file baru dengan `isDraft: true` saat belum siap terbit.
2. Simpan gambar artikel/cover di `src/assets/images/`; gunakan path relatif dari file Markdown.
3. Gunakan `public/assets/` atau subfolder `public/` lain hanya untuk aset statis yang perlu URL tetap.
4. Jalankan `npm run check:content`, `npm run check:links`, dan `npm run check:responsive-images`.
5. Jalankan `npm run build`.
6. Jalankan `npm run preview`.
7. Periksa artikel, link, gambar, TOC, tabel, code block, dan layout mobile.
8. Ubah draft status menjadi false saat siap, lalu build ulang dan pastikan sitemap/RSS memiliki item yang sesuai.

## 6. Menangani gambar

Jika checker menyatakan image file missing:

- Pastikan sumber lokal ada di `src/assets/images/`.
- Pastikan path pada Markdown/frontmatter relatif terhadap file `.md`/`.mdx`; untuk artikel root koleksi biasanya diawali `../../assets/images/`.
- Pastikan resolusi path tetap berada di dalam `src/assets/`; jangan memakai `/images/...` atau path ke `public/images/`.
- Perhatikan kapitalisasi nama file; production Linux case-sensitive.
- Hindari spasi/karakter khusus pada nama aset.
- Untuk favicon, ikon manifest, grafis SVG statis, dan sertifikat, periksa folder `public/` sesuai jenisnya.

`check:responsive-images` juga memastikan breakpoint Markdown dan kelompok ukuran komponen tetap sesuai konfigurasi yang telah diuji. Jangan mengubah kandidat ukuran secara massal tanpa membandingkan hasil build dan kualitas visual.

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
