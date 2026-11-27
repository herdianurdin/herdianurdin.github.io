# Panduan Membuat Artikel Secara Manual

Panduan ini mengikuti `src/content.config.ts`, route Astro, `BlogLayout.astro`, komponen TOC, dan validator konten yang ada.

## 1. Lokasi dan format file

Artikel disimpan sebagai Markdown (`.md`) atau MDX (`.mdx`):

```text
src/content/id/<content-id>.md
src/content/en/<content-id>.md
```

Untuk artikel biasa, utamakan `.md`. Gunakan `.mdx` hanya ketika memang membutuhkan komponen/JSX MDX.

Content ID berasal dari path relatif di dalam folder bahasa tanpa ekstensi.

Contoh:

| File | Content ID | URL |
|---|---|---|
| `src/content/id/cara-kerja-komputer.md` | `cara-kerja-komputer` | `/blog/cara-kerja-komputer/` |
| `src/content/en/how-computers-work.md` | `how-computers-work` | `/en/blog/how-computers-work/` |
| `src/content/id/python/dasar-variabel.md` | `python/dasar-variabel` | `/blog/python/dasar-variabel/` |

Gunakan huruf kecil, angka, dan tanda hubung. Hindari spasi, underscore, huruf kapital, dan karakter khusus pada nama file.

## 2. Frontmatter resmi

Schema didefinisikan dalam `src/content.config.ts`.

| Field | Wajib? | Penjelasan |
|---|---|---|
| `title` | Ya | Judul artikel. |
| `description` | Ya | Ringkasan, minimal 10 karakter. Dipakai sebagai deskripsi SEO/social. |
| `pubDate` | Ya | Tanggal publikasi; harus dapat diparse sebagai Date. Gunakan ISO 8601. |
| `updatedDate` | Tidak | Tanggal pembaruan nyata; jika diisi tidak boleh lebih awal dari `pubDate`. |
| `coverImage` | Tidak | URL gambar, sebaiknya path lokal `/images/...`. |
| `tags` | Tidak | Array string untuk label artikel. |
| `isDraft` | Tidak | Boolean; default `false`. Untuk pekerjaan belum siap, set `true` secara eksplisit. |
| `enSlug` | ID saja | Content ID artikel terjemahan Inggris. |
| `idSlug` | EN saja | Content ID artikel terjemahan Indonesia. |
| `faq` | Tidak | Array item `{ q, a }` untuk bagian FAQ. |

### Aturan tanggal

Gunakan tanggal dengan zona waktu eksplisit, misalnya:

```yaml
pubDate: 2026-11-28T09:00:00+07:00
updatedDate: 2026-11-30T14:30:00+07:00
```

Untuk waktu UTC dapat memakai `Z`. Hindari tanggal pembaruan palsu; isi `updatedDate` hanya ketika ada pembaruan substansial yang memang perlu dicatat. Schema memeriksa agar `updatedDate >= pubDate`.

## 3. Cara membuat artikel Indonesia

1. Tentukan topik, pembaca sasaran, tujuan tulisan, dan kata kunci utama.
2. Tentukan content ID dengan lowercase kebab-case.
3. Buat file baru di `src/content/id/`.
4. Isi frontmatter valid.
5. Tulis isi artikel memakai Markdown.
6. Siapkan cover bila ada; taruh file di `public/images/`.
7. Tambahkan tautan internal hanya ke artikel yang benar-benar ada dan sudah terbit.
8. Jalankan validator dan build.
9. Periksa preview lokal sebelum publish.

Contoh file minimal:

```markdown
---
title: "Mengenal Variabel dalam Python"
description: "Penjelasan variabel Python untuk pemula, mulai dari konsep penyimpanan nilai hingga contoh kode sederhana."
pubDate: 2026-11-28T09:00:00+07:00
coverImage: "/images/mengenal-variabel-python.webp"
tags: ["python", "pemrograman", "pemula"]
isDraft: true
---

Tulis paragraf pembuka yang menjelaskan masalah atau pertanyaan pembaca.

## Apa Itu Variabel?

Jelaskan konsep dengan bahasa yang sesuai dengan target pembaca.

```python
nama = "Budi"
print(nama)
```
```

Template siap salin ada pada [article-template.id.md](examples/article-template.id.md). Artikel contoh lebih lengkap ada pada [sample-article.id.md](examples/sample-article.id.md).

## 4. Cara membuat versi Inggris

Versi Inggris dibuat sebagai file terpisah di `src/content/en/`. Jangan menaruh artikel Inggris di folder `id` atau sebaliknya.

Jika artikel merupakan terjemahan/pasangan, tambahkan relasi dua arah:

**Artikel ID**

```yaml
enSlug: "python-variables"
```

**Artikel EN**

```yaml
idSlug: "variabel-python"
```

Kedua slug harus sama persis dengan content ID file pasangan. Kedua artikel juga harus memiliki nilai `isDraft` yang sama. Jika pasangan belum tersedia, jangan menambahkan slug relasi secara spekulatif; artikel boleh diterbitkan tanpa pasangan.

Contoh lengkap: [sample-article.en.md](examples/sample-article.en.md).

## 5. Menulis isi artikel

### Struktur yang disarankan

Struktur ini rekomendasi editorial, bukan persyaratan schema:

1. Pembuka: masalah, konteks, atau pertanyaan yang relevan.
2. Penjelasan konsep dan istilah.
3. Contoh konkret atau studi kasus.
4. Langkah, prosedur, atau analisis.
5. Batasan, risiko, atau kesalahan yang sering terjadi.
6. Kesimpulan dan langkah pembaca berikutnya.

Sesuaikan struktur dengan jenis artikel. Artikel pengalaman/opini tidak harus dipaksa menjadi tutorial langkah demi langkah.

### Heading

- Jangan menulis H1 (`#`) di body artikel. `BlogLayout` sudah menghasilkan H1 dari `title`.
- Gunakan H2 (`##`) untuk bagian utama.
- Gunakan H3 (`###`) untuk subbagian.
- H4-H6 boleh dipakai bila memang diperlukan, tetapi tidak masuk TOC saat ini.
- Heading H2/H3 diolah Astro dan ditampilkan oleh `TableOfContents.astro`.

### Pemformatan

```markdown
**Tebal**
*Miring*
~~Coret~~
`inline code`

> Blockquote untuk kutipan atau catatan.

- Daftar satu
- Daftar dua

1. Langkah satu
2. Langkah dua
```

### Kode

Gunakan fenced code block dan sebutkan bahasa:

````markdown
```python
nama = "Budi"
print(nama)
```
````

Shiki diatur dengan tema Dracula dan `wrap: true`. Gunakan bahasa yang sesuai agar syntax highlighting benar. Jangan memasukkan output seolah-olah kode yang dieksekusi bila belum diverifikasi.

### Tabel

Gunakan tabel Markdown untuk data yang memang lebih mudah dibandingkan secara kolom. Layout artikel memberi wrapper horizontal untuk tabel di layar sempit.

```markdown
| Perintah | Fungsi |
|---|---|
| `print()` | Menampilkan output |
| `input()` | Menerima input |
```

Hindari tabel terlalu lebar. Pada mobile, tabel digulir horizontal.

## 6. Menyisipkan gambar

### Gambar lokal (disarankan)

1. Simpan aset di `public/images/`.
2. Gunakan nama file deskriptif lowercase kebab-case.
3. Gunakan WebP bila sesuai dan kompres gambar.
4. Referensikan dengan path `/images/nama-file.webp`.

```markdown
Gunakan path gambar lokal seperti `/images/diagram-input-proses-output.webp` pada Markdown.
```

Plugin `rehype-local-image-attributes.mjs` mencoba menambahkan:

- `loading="lazy"` bila belum tersedia,
- `decoding="async"` bila belum tersedia,
- `width` dan `height` dari dimensi intrinsik file lokal bila dapat dibaca.

Jangan menganggap fitur ini bekerja pada URL eksternal. Untuk URL eksternal, pastikan sumber stabil, punya izin pakai, dan berikan keterangan/atribut dimensi bila perlu.

### Cover image

Contoh frontmatter:

```yaml
coverImage: "/images/mengenal-variabel-python.webp"
```

Layout artikel menampilkan cover 1200×630 dengan eager load dan fetch priority tinggi. Cover di artikel juga digunakan sebagai dasar gambar social preview dan `BlogPosting` schema. Pastikan cover benar-benar tersedia.

Jika `coverImage` tidak diisi, SEO head memakai `/images/og-default.webp` sebagai gambar default.

## 7. Menyematkan video YouTube

Jangan menempelkan iframe YouTube langsung untuk pola embed standar. `BlogLayout` mengenali facade `.youtube-defer`, kemudian membuat placeholder dan memuat iframe setelah pengguna mengaktifkan video.

Contoh:

```html
<div class="youtube-defer" data-video="dQw4w9WgXcQ"></div>
```

`data-video` harus berupa ID video 11 karakter URL-safe, bukan URL lengkap. Script memvalidasi pola ID tersebut. Jika ID tidak valid, placeholder dihapus. Pastikan video bisa diakses publik dan relevan.

## 8. FAQ

Schema mendukung array `faq` di frontmatter. Contoh:

```yaml
faq:
  - q: "Apakah variabel Python perlu deklarasi tipe?"
    a: "Tidak untuk penggunaan normal. Python menggunakan dynamic typing."
  - q: "Apakah nama variabel boleh diawali angka?"
    a: "Tidak. Nama variabel harus diawali huruf atau underscore."
```

FAQ ditampilkan setelah slot konten artikel dalam bagian yang berjudul sesuai bahasa. FAQ tidak menggantikan penjelasan di isi utama.

## 9. Tautan internal

Gunakan link Markdown ke URL artikel canonical yang diakhiri slash:

```markdown
[Baca pengenalan algoritma] (contoh URL: `/blog/bab-1-mengenal-algoritma-dan-pola-pikir/`)
```

Link ke koleksi Inggris:

```markdown
[Read the Python introduction] (example URL: `/en/blog/python-introduction/`)
```

`check:links` memeriksa tautan artikel internal di artikel terbit agar target sesuai dengan artikel yang terbit. Hindari tautan ke draft atau slug yang tidak ada. URL path artikel harus sesuai dengan nama file relatif.

Link eksternal otomatis diberi `target="_blank"` dan `rel="noopener noreferrer"` oleh `rehype-external-links`.

## 10. Draft dan publikasi

- Saat menulis/merevisi artikel yang belum siap, gunakan `isDraft: true`.
- Draft dikecualikan dari `getCollection` pada route artikel, arsip, homepage, RSS, dan sitemap.
- Untuk menerbitkan, ubah `isDraft: false` atau hapus field (default schema adalah `false`). Praktik yang disarankan: isi eksplisit agar status terlihat jelas.
- Perhatikan status draft pada kedua artikel jika pasangan terjemahan sudah dideklarasikan.

## 11. SEO artikel

`SeoHead.astro` mengambil `title`, `description`, `coverImage`, tanggal, language, dan translation slug untuk membuat:

- `<title>` dan meta description,
- canonical dengan trailing slash,
- hreflang untuk artikel pasangan bila relasi tersedia,
- Open Graph dan Twitter Card,
- JSON-LD `BlogPosting`,
- author `Person` dan URL profile.

Jangan menulis canonical/hreflang manual di Markdown. Jangan memakai `updatedDate` hanya untuk mengubah tanggal tanpa perubahan artikel.

## 12. Checklist sebelum publikasi

- [ ] File berada di folder bahasa yang benar.
- [ ] Nama file lowercase kebab-case dan URL yang dihasilkan sudah dipahami.
- [ ] `title`, `description`, `pubDate` tersedia dan valid.
- [ ] `description` minimal 10 karakter dan merangkum isi, bukan keyword stuffing.
- [ ] `updatedDate` valid dan tidak lebih awal dari `pubDate`.
- [ ] `coverImage` ada di `public/images/` dan path benar.
- [ ] `isDraft` sesuai rencana publikasi.
- [ ] Jika punya terjemahan, `enSlug`/`idSlug` dua arah dan status draft sama.
- [ ] Body tidak memiliki H1 kedua.
- [ ] Heading H2/H3 membentuk hierarki yang masuk akal.
- [ ] Gambar punya alt yang bermakna atau alt kosong bila dekoratif.
- [ ] Kode sudah diuji atau labeli dengan jelas sebagai ilustrasi.
- [ ] Tautan internal mengarah ke artikel terbit.
- [ ] Kutipan, angka, klaim, dan gambar memiliki sumber/izin yang sesuai.
- [ ] `npm run build` lulus.
- [ ] Preview artikel diperiksa di desktop dan mobile.

## 13. Perintah validasi

```bash
npm run check:content
npm run check:links
npm run check:seo
npm run check:structured-data
npm run check:page-metadata
npm run check:social-meta
npm run check:image-assets
npm run check:onpage
npm run build
```

Untuk panduan setup dan arti tiap validator, lihat [DEVELOPMENT.md](DEVELOPMENT.md).
