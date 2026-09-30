---
title: "Panduan Penulisan Konten Jurnal (Markdown Guide)"
description: "Dokumentasi lengkap cara menulis artikel, memformat teks, menyisipkan gambar, hingga menyematkan video YouTube di dalam jurnal Herdi.Dev dengan gaya Neo-Brutalism."
pubDate: 2026-09-30T21:00:00Z
coverImage: "https://placehold.co/1200x630/000000/c6ff00.png?text=Markdown+Style+Guide"
tags: ["panduan", "markdown", "dokumentasi"]
isDraft: true
---

Selamat datang di panduan penulisan jurnal! Halaman ini berfungsi sebagai referensi (_cheatsheet_) sekaligus demonstrasi langsung bagaimana mesin Astro dan Tailwind CSS v4 merender elemen-elemen Markdown menjadi desain Neo-Brutalism yang garang.

## Pemformatan Teks Dasar

Anda dapat menggunakan sintaks Markdown standar untuk memberikan penekanan pada teks:

- **Teks Tebal (Bold):** Gunakan bintang ganda seperti **teks ini**.
- _Teks Miring (Italic):_ Gunakan bintang tunggal seperti _teks ini_.
- ~~Teks Coret (Strikethrough):~~ Gunakan tilde ganda seperti ~~teks ini~~.
- `Kode Sebaris (Inline Code)`: Gunakan _backtick_ tunggal untuk menyorot nama variabel atau perintah singkat.

> **Kutipan (Blockquote)**
> Ini adalah contoh blok kutipan. Sangat cocok digunakan untuk mengutip pernyataan penting, menyoroti peringatan, atau sekadar memberikan catatan tambahan di tengah artikel.

---

## Hierarki Judul (Headings)

Gunakan tanda pagar (`#`) untuk membuat struktur dokumen. (Catatan: Hindari penggunaan H1 `#` di dalam konten karena H1 sudah digunakan secara eksklusif untuk judul artikel utama di bagian atas halaman).

### Ini adalah Judul H3

#### Ini adalah Judul H4

##### Ini adalah Judul H5

---

## Daftar (Lists)

Daftar sangat penting untuk memecah informasi kompleks menjadi poin-poin yang mudah dibaca.

**Daftar Tidak Berurutan (Unordered List):**

- Kopi Hitam
- Papan Ketik Mekanis
- Monitor Ultrawide
  - Kabel HDMI (Sub-item)
  - Kabel DisplayPort (Sub-item)

**Daftar Berurutan (Ordered List):**

1. Siapkan secangkir kopi.
2. Buka Visual Studio Code.
3. Jalankan perintah `npm run dev`.
4. Mulai menulis kode tanpa henti.

---

## Blok Kode (Code Blocks)

Karena kita menggunakan integrasi Shiki bawaan Astro dengan tema `dracula`, Anda cukup menggunakan _backtick_ tiga kali diikuti nama bahasanya. Skrip CSS global kita akan secara otomatis membungkusnya dengan batas putih tebal dan bayangan neon.

```javascript
// Contoh fungsi JavaScript sederhana
function sapaPengembang(nama) {
  const pesan = `Halo, ${nama}! Selamat datang di zona Neo-Brutalism.`;
  console.log(pesan);
  return pesan;
}

sapaPengembang("Herdi");
```

```css
/* Contoh konfigurasi CSS Tailwind */
@theme {
  --color-neon: #c6ff00;
  --color-cyan: #00e5ff;
}
```

---

## Tabel Neo-Brutalism

Berkat kelas `.prose table` khusus yang telah kita modifikasi di `global.css`, tabel standar Markdown akan otomatis disulap menjadi tabel bergaya retro dengan tajuk (header) berwarna neon dan garis batas yang tegas. Pembungkus gulir horizontal ( _horizontal scroll_ ) juga akan ditambahkan secara otomatis oleh skrip di `BlogLayout`.

| Nama Properti | Tipe Data | Keterangan                                     | Status Wajib |
| :------------ | :-------: | :--------------------------------------------- | :----------: |
| `title`       |  String   | Judul utama artikel jurnal.                    |      Ya      |
| `pubDate`     |   Date    | Tanggal publikasi (Gunakan format ISO 8601).   |      Ya      |
| `coverImage`  |    URL    | Tautan gambar sampul.                          |    Tidak     |
| `isDraft`     |  Boolean  | Jika `true`, artikel disembunyikan dari rilis. |      Ya      |

---

## Menyisipkan Gambar

Gunakan sintaks standar Markdown untuk menyisipkan gambar. Astro akan merendernya di dalam aliran teks.

![Ilustrasi Koding di Malam Hari](https://placehold.co/800x400/000000/00e5ff.png?text=Ilustrasi+Gambar+Markdown)

---

## Menyematkan Video YouTube (Lazy Load)

Ini adalah fitur spesial di blog ini. Jangan gunakan tag `<iframe>` bawaan YouTube karena akan memperlambat waktu muat ( _loading_ ) halaman secara drastis.

Sebagai gantinya, sisipkan elemen HTML `div` dengan kelas `youtube-defer` dan berikan ID video pada atribut `data-video`. Skrip khusus kita di `BlogLayout.astro` akan merendernya menjadi kotak bergaya Neo-Brutalism interaktif yang baru memuat video saat diklik.

_(Contoh: Jika URL videonya adalah `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, maka ID-nya adalah `dQw4w9WgXcQ`)_.

<div class="youtube-defer" data-video="dQw4w9WgXcQ"></div>

---

Semua elemen di atas telah dioptimalkan untuk memastikan pengalaman membaca yang maksimal, rasio kontras yang lolos uji aksesibilitas, dan performa pemuatan laman secepat kilat!
