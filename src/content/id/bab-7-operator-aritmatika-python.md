---
title: "Fundamental Python Bab 7: Matematika Mesin (Operator Aritmatika)"
description: "Singkirkan mitos programmer harus jago kalkulus. Pelajari operator aritmatika Python (+, -, *, /, //, %) dan aturan urutan prioritas (PEMDAS)."
pubDate: 2026-10-10T10:30:00+07:00
coverImage: "/images/bab-7-operator-aritmatika-python.webp"
tags: ["tutorial-python", "dasar-pemrograman", "operator-matematika", "pemula"]
isDraft: false
---

Di **[Bab 6: Variabel dan Tipe Data](/blog/bab-6-variabel-dan-tipe-data-python)** sebelumnya, kita telah belajar cara menyiapkan memori dan menyortir tipe data untuk menampung informasi. Namun, data yang hanya diam di dalam kotak penyimpanan tentu tidak memiliki nilai guna. Data tersebut harus diolah.

Dan ketika kita berbicara tentang pengolahan data di dalam komputer, ujung-ujungnya kita akan selalu bermuara pada satu hal: **Matematika**.

Mendengar kata tersebut, sebagian dari Anda mungkin langsung menghela napas panjang atau membayangkan papan tulis yang penuh dengan rumus memusingkan. Tolong, jangan buru-buru menutup artikel ini. Mari kita hancurkan tembok ketakutan itu terlebih dahulu.

## Mitos Kalkulus: Realitas Matematika dalam Pemrograman

Ada sebuah mitos besar dan menyesatkan di luar sana yang berbunyi: _"Untuk menjadi seorang programmer, kamu harus jago matematika tingkat dewa, menguasai kalkulus, dan paham aljabar kompleks."_

Saya sendiri pernah menjadi korban mitos ini. Di masa awal orientasi mahasiswa baru jurusan Informatika, seorang kakak tingkat menakut-nakuti kami. Ia mendoktrin bahwa jurusan ini murni tentang matematika rumit dan siapa pun yang lemah dalam berhitung pasti akan gagal. Tentu saja, itu membuat saya waspada.

Namun, setelah terjun ke dunia industri dan mengembangkan aplikasi secara nyata, saya menemukan sebuah fakta yang sangat bertolak belakang dengan ucapan senior saya tersebut.

Faktanya, **matematika di sekolah dan matematika di dalam pemrograman adalah dua hal yang sangat berbeda.**

Dalam matematika sekolah, Anda diwajibkan memecahkan masalah dan menghitung rumus dari A sampai Z secara manual menggunakan otak Anda. Sebaliknya, dalam pemrograman, **Anda sama sekali tidak perlu menghitung hasilnya**. Tugas Anda hanyalah membangun "kerangka jalan" atau logikanya, lalu membiarkan mesin komputer yang melakukan perhitungan kasarnya dalam hitungan milidetik.

Kecuali Anda kelak memilih spesialisasi di bidang _Data Science_ atau _Artificial Intelligence_ (Kecerdasan Buatan), memprogram aplikasi web atau kasir sehari-hari justru lebih banyak menggunakan logika _tambah-kurang-kali-bagi_ biasa. Anda merancang algoritmanya, dan biarkan bahasa Python (atau mesin _compiler_ Anda) yang menjadi kalkulator tak kenal lelah.

## Jebakan Input: Mengapa di Python 5 + 10 = 510?

![Ilustrasi programmer pemula yang kebingungan karena komputer menyambung angka teks alih-alih menjumlahkannya](/images/ilustrasi-jebakan-matematika-programmer.webp)

Namun, sebelum Anda mulai menyuruh mesin Python Anda berhitung, ada satu "jebakan" konyol yang sering menelan korban pemula. Buka **[Python Playground](/python-playground)** Anda, dan ketikkan kode di bawah ini:

```python
angka1 = input("Masukkan angka pertama: ")
angka2 = input("Masukkan angka kedua: ")

hasil = angka1 + angka2
print("Hasil penjumlahannya adalah: " + hasil)
```

Silakan jalankan. Masukkan angka `5` pada pertanyaan pertama, lalu `10` pada pertanyaan kedua. Berapa hasil yang keluar? Bukannya `15`, komputer justru dengan polosnya menjawab **`510`**.

Mengapa aplikasi hitung kita tiba-tiba menjadi bodoh? Jika Anda menyimak materi tentang **[Fungsi Input di Bab 5](/blog/bab-5-input-dan-output-python)** dengan saksama, Anda pasti tahu letak kesalahannya. Perintah `input()` diciptakan dengan satu aturan kaku: ia akan **SELALU** menangkap apa pun ketikan Anda sebagai tipe data teks (_String_).

Karena mesin menganggap angka 5 dan 10 tersebut sebagai teks, maka tanda tambah (`+`) tidak dilihat sebagai rumus matematika, melainkan perintah untuk **menyambung kata** (persis seperti menyambung `"Kupu"` dan `"kupu"` menjadi `"Kupukupu"`).

**Solusi: Konversi Tipe Data (Type Casting)**
Agar mesin bisa berhitung, Anda harus mengubah wujud teks tersebut menjadi angka murni (_Integer_ atau _Float_) terlebih dahulu menggunakan `int()` atau `float()`.

```python
# Bungkus dengan int() untuk mengubah teks menjadi bilangan bulat
angka1 = int(input("Masukkan angka pertama: "))
angka2 = int(input("Masukkan angka kedua: "))

# Karena wujudnya sudah angka, tanda + akan memicu penjumlahan matematika
hasil = angka1 + angka2

# Saat akan dicetak (print) bersama kalimat teks, ubah kembali hasilnya menjadi teks (str)
print("Hasil penjumlahannya adalah: " + str(hasil))
```

## Daftar Referensi Operator Aritmatika Python

Secara teori formal, **Operator Aritmatika** adalah simbol-simbol khusus yang digunakan untuk melakukan operasi matematika dasar terhadap nilai atau variabel (disebut sebagai _operand_). Berikut adalah daftar operator matematika di Python yang akan Anda gunakan sehari-hari:

| Nama Operator          | Simbol Python | Contoh Kode | Hasil Output | Penjelasan                                                            |
| :--------------------- | :-----------: | :---------- | :----------- | :-------------------------------------------------------------------- |
| **Penjumlahan**        |      `+`      | `5 + 3`     | `8`          | Menjumlahkan dua nilai angka.                                         |
| **Pengurangan**        |      `-`      | `5 - 3`     | `2`          | Mengurangkan nilai kedua dari nilai pertama.                          |
| **Perkalian**          |      `*`      | `5 * 3`     | `15`         | Mengalikan nilai (Python tidak menggunakan tanda 'x').                |
| **Pembagian Desimal**  |      `/`      | `10 / 2`    | `5.0`        | Membagi angka. Hasilnya selalu berupa desimal (_Float_).              |
| **Pembagian Bulat**    |     `//`      | `10 // 3`   | `3`          | Membagi angka, tetapi membuang pecahan desimalnya (tanpa pembulatan). |
| **Sisa Bagi (Modulo)** |      `%`      | `10 % 3`    | `1`          | Mencari sisa dari hasil pembagian (10 dibagi 3 bersisa 1).            |
| **Pangkat**            |     `**`      | `2 ** 3`    | `8`          | Memangkatkan nilai (Contoh: 2 pangkat 3).                             |

### Aturan Prioritas Eksekusi Matematika (PEMDAS)

Jika Anda menggabungkan beberapa operator dalam satu baris rumus, operator mana yang akan dieksekusi lebih dulu oleh Python? Komputer mengikuti aturan matematika universal yang disebut **PEMDAS**:

1. **P**arentheses (Tanda Kurung `()`)
2. **E**xponents (Pangkat `**`)
3. **M**ultiplication & **D**ivision (Kali `*` & Bagi `/`)
4. **A**ddition & **S**ubtraction (Tambah `+` & Kurang `-`)

Contoh: `hasil = 5 + 2 * 3`. Python akan mengalikan 2 * 3 lebih dulu, baru menambahkannya dengan 5. Hasil akhirnya adalah `11`, bukan 21!

## Studi Kasus Nyata: Kegunaan Modulo (%) dan Pembagian Bulat (//)

Sebagai _developer_, operator tambah, kurang, kali, dan bagi mungkin sudah sangat jelas fungsinya. Namun, pemula sering kebingungan: _kapan kita menggunakan Pembagian Bulat (//) dan Modulo (%) di aplikasi dunia nyata?_

Mari saya bedah dari pengalaman saya mengembangkan aplikasi _native_ Android:

**1. Studi Kasus Pembagian Bulat (`//`) untuk Skor Ujian**
Dalam aplikasi edukasi yang saya kembangkan seperti **[Bimbel & Simulasi CAT CPNS](https://play.google.com/store/apps/details?id=tescpnsasn.simulasicatcpns.bimbelcpnsjadiasn)**, saya sering berurusan dengan perhitungan skor akhir pengguna. Jika skor total (misal 250) dibagi dengan jumlah soal (misal 3), hasil normalnya adalah `83.33333333`. Angka desimal panjang ini sangat jelek jika ditampilkan di layar pengguna. Alih-alih menulis baris kode pembulatan yang panjang, saya cukup menggunakan pembagian bulat (`//`), sehingga Python langsung membuang desimalnya dan menampilkan angka bulat bersih `83`.

**2. Studi Kasus Modulo (`%`) untuk Timer Aplikasi**
Saat saya merakit sistem hitung mundur (_timer_) manual untuk aplikasi **[Tes Potensi Akademik (TPA) Pro](https://play.google.com/store/apps/details?id=psikotes.tespotensiakademikbappenas.ujiantpa)**, mesin komputer hanya menerima hitungan dalam bentuk "detik" mentah. Jika waktu tersisa adalah **130 detik**, bagaimana cara menampilkannya menjadi teks **"2 Menit 10 Detik"**?
Di sinilah kombinasi sakti `//` dan `%` bekerja:

- Mencari Menit: `130 // 60` hasilnya **2** (Menit).
- Mencari Detik: `130 % 60` hasilnya **10** (Sisa detik).

Coba jalankan simulasi algoritma _timer_ tersebut di _Playground_ Anda:

```python
print("--- Simulasi Timer Waktu TPA Pro ---")
total_detik = 130
menit = total_detik // 60   # Berapa kali 60 pas di dalam 130?
detik_sisa = total_detik % 60 # Berapa sisa detiknya?
print("Waktu tersisa:", menit, "Menit", detik_sisa, "Detik")
```

---

## Tantangan Bab 7: Mewujudkan Cetak Biru Kalkulator

Berbekal seluruh pengetahuan operator di atas, kini giliran Anda untuk menciptakan mesin hitung Anda sendiri.

Di **[Bab 3: Cara Menulis Algoritma](/blog/bab-3-cara-menulis-algoritma)**, saya pernah menantang Anda untuk merancang _Pseudocode_ (cetak biru) Kalkulator Luas Segitiga. Saat itu, program tersebut baru sebatas coretan di atas kertas. Hari ini, Anda sudah memiliki semua amunisi sintaksis untuk mewujudkannya secara nyata.

**Tugas Anda:**
Terjemahkan cetak biru Anda menjadi **Kalkulator Luas Segitiga** nyata di terminal _Playground_!

1. Program harus meminta _input_ nilai **alas** dari pengguna.
2. Program harus meminta _input_ nilai **tinggi** dari pengguna.
3. Komputer harus menghitung luasnya dengan rumus matematika: `0.5 * alas * tinggi`
4. _(Petunjuk: Jangan lupa bungkus perintah `input` Anda dengan `float()` karena ukuran alas dan tinggi bisa berupa angka desimal)._
5. Tampilkan hasil akhir perhitungannya ke layar menggunakan `print()`.

Jika kalkulator Anda tidak lagi menyambung teks melainkan berhasil menghitung luas segitiga dengan benar, _copy-paste_ mahakarya tersebut di kolom komentar di bawah ini! Anda secara resmi telah mengubah sebuah cetak biru menjadi aplikasi hitung yang berfungsi secara komputasional.

_(Artikel ini adalah Bagian ke-7 dari Seri Fundamental Python)._

**[Baca Selanjutnya: Bab 8 - Persimpangan Jalan (Gerbang Logika & Kondisi) >>](/blog/bab-8-pengkondisian-if-else-python)**
