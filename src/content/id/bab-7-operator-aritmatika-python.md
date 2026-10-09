---
title: "Fundamental Python Bab 7: Matematika Mesin (Operator Aritmatika)"
description: "Singkirkan mitos bahwa programmer harus jago kalkulus. Komputerlah yang bertugas menghitung, kita hanya perlu menyusun logikanya."
pubDate: 2026-10-10T10:30:00+07:00
coverImage: "/images/bab-7-operator-aritmatika-python.webp"
tags: ["tutorial-python", "dasar-pemrograman", "operator-matematika", "pemula"]
isDraft: false
---

Di **[Bab 6 sebelumnya](/blog/bab-6-variabel-dan-tipe-data-python)**, kita telah belajar cara menyiapkan memori (variabel) dan menyortir tipe data untuk menampung informasi. Namun, data yang hanya diam di dalam kotak penyimpanan tentu tidak memiliki nilai guna. Data tersebut harus diolah.

Dan ketika kita berbicara tentang pengolahan data di dalam komputer, ujung-ujungnya kita akan selalu bermuara pada satu hal: **Matematika**.

Mendengar kata tersebut, sebagian dari Anda mungkin langsung menghela napas panjang atau membayangkan papan tulis yang penuh dengan rumus memusingkan. Tolong, jangan buru-buru menutup artikel ini. Mari kita hancurkan tembok ketakutan itu terlebih dahulu.

## Mitos Kalkulus dan Kakak Tingkat yang Menipu

Ada sebuah mitos besar dan menyesatkan di luar sana yang berbunyi: _"Untuk menjadi seorang programmer, kamu harus jago matematika tingkat dewa, menguasai kalkulus, dan paham aljabar kompleks."_

Saya sendiri pernah menjadi korban mitos ini. Di masa awal orientasi mahasiswa baru jurusan Informatika, seorang kakak tingkat (kating) menakut-nakuti kami. Ia mendoktrin bahwa jurusan ini adalah murni tentang matematika rumit dan siapa pun yang lemah dalam berhitung pasti akan gagal.

Meski saya kebetulan lulusan SMA jurusan MIPA dan cukup terbiasa dengan angka, peringatan itu tetap membuat saya waspada. Saya kemudian memutuskan untuk belajar secara autodidak, menelan buku Algoritma Dasar setebal lebih dari 900 halaman. Namun, dari ratusan halaman tersebut, saya menemukan sebuah fakta yang sangat bertolak belakang dengan ucapan kating saya.

Faktanya, matematika di sekolah dan matematika di dalam pemrograman adalah dua hal yang sangat berbeda.

Dalam matematika sekolah, Anda diwajibkan memecahkan masalah dan menghitung rumus dari A sampai Z secara manual menggunakan otak Anda. Sebaliknya, dalam pemrograman, **Anda sama sekali tidak perlu menghitung hasilnya**. Tugas Anda hanyalah membangun "kerangka jalan" atau logikanya, lalu membiarkan mesin komputer yang melakukan perhitungan kasarnya dalam hitungan milidetik.

Kecuali Anda kelak memilih spesialisasi di bidang _Data Science_ atau _Artificial Intelligence_ (Kecerdasan Buatan), memprogram aplikasi web atau kasir sehari-hari justru lebih banyak menggunakan logika _tambah-kurang-kali-bagi_ biasa. Lucunya, beberapa tahun kemudian saya baru menyadari bahwa kating yang dulu menakut-nakuti kami itu bukanlah seorang praktisi _developer_ di industri nyata. Rasanya agak tertipu, bukan?

## The Imitation Game: Mesin yang Tidak Pernah Lelah

![Ilustrasi Alan Turing dan Mesin Christopher](/images/ilustrasi-mesin-enigma.webp)

Konsep "membiarkan mesin yang berhitung" ini sebenarnya bukanlah sebuah kemalasan, melainkan fondasi sejarah lahirnya komputer itu sendiri.

Jika Anda butuh bukti visual, tontonlah _The Imitation Game (2014)_. Film ini mengisahkan Alan Turing, bapak ilmu komputer, saat ia ditugaskan memecahkan kode rahasia _Enigma_ milik militer Jerman pada Perang Dunia II.

Turing dan tim matematikawan terbaiknya segera menyadari satu hal: otak manusia mustahil sanggup menghitung jutaan kombinasi kode tersebut secara manual setiap harinya. Oleh karena itu, alih-alih menghitung di atas kertas, Turing memilih untuk membangun sebuah mesin bernama _Christopher_. Manusialah yang merancang algoritma dan kerangka logikanya, tetapi mesinlah yang melakukan eksekusi hitungan kasarnya karena mesin tidak pernah merasa lelah.

Kini, di era modern, Anda adalah sang arsitek logika tersebut, dan bahasa Python adalah mesin _Christopher_ Anda.

## Jebakan Input: Mengapa 5 + 10 = 510?

![Ilustrasi Jebakan Input 5 + 10 = 510?](/images/ilustrasi-jebakan-matematika-programmer.webp)

Namun, sebelum Anda mulai dengan penuh semangat menyuruh mesin Python Anda berhitung, ada satu "jebakan" konyol yang hampir selalu menelan korban para pemula.

Mari kita buktikan. Buka **[Python Playground](/python-playground)** Anda, dan ketikkan kode penjumlahan sederhana di bawah ini:

```python
angka1 = input("Masukkan angka pertama: ")
angka2 = input("Masukkan angka kedua: ")

hasil = angka1 + angka2
print("Hasil penjumlahannya adalah: " + hasil)
```

Silakan jalankan. Masukkan angka `5` pada pertanyaan pertama, lalu angka `10` pada pertanyaan kedua. Berapa hasil yang keluar di layar?
Bukannya `15`, komputer justru dengan polosnya menjawab **`510`**.

Mengapa aplikasi hitung kita tiba-tiba menjadi bodoh?
Jika Anda menyimak materi di Bab 5 dan Bab 6 dengan saksama, Anda pasti tahu letak kesalahannya. Perintah `input()` diciptakan dengan satu aturan kaku: ia akan **SELALU** menangkap apa pun ketikan Anda sebagai tipe data teks (`String`).

Karena mesin menganggap angka 5 dan 10 tersebut sebagai sebuah teks, maka tanda tambah (`+`) tidak dilihat sebagai rumus matematika. Mesin melihatnya sebagai perintah untuk **menyambung kata** (persis seperti menyambung suku kata `"Kupu" + "kupu"` menjadi `"Kupukupu"`). Itulah mengapa teks `"5"` disambung dengan teks `"10"` menghasilkan teks `"510"`.

**Solusi: Konversi Tipe Data**
Agar mesin bisa berhitung, Anda harus mengubah wujud teks tersebut menjadi angka murni (_Integer_ atau _Float_) terlebih dahulu. Caranya adalah dengan "membungkus" perintah `input` tersebut menggunakan `int()` atau `float()`. Perhatikan perbaikannya:

```python
# Bungkus dengan int() untuk langsung mengubah teks yang diketik menjadi bilangan bulat
angka1 = int(input("Masukkan angka pertama: "))
angka2 = int(input("Masukkan angka kedua: "))

# Karena wujudnya sudah angka, tanda + akan menjumlahkannya secara matematika
hasil = angka1 + angka2

# Saat akan dicetak (print) bersama kalimat, ubah kembali angkanya menjadi teks (str)
print("Hasil penjumlahannya adalah: " + str(hasil))
```

## Operator Aritmatika Python (Teori Formal)

Setelah Anda berhasil menjinakkan tipe data dan menyingkirkan jebakan teks, barulah mesin benar-benar siap menerima perintah matematika Anda.

Secara teori formal, **Operator Aritmatika** adalah simbol-simbol khusus yang digunakan oleh _compiler_ atau _interpreter_ untuk melakukan operasi matematika dasar terhadap satu atau beberapa nilai (yang disebut sebagai _operand_).

Beberapa simbol matematika di dalam pemrograman Python memiliki sedikit perbedaan wujud dengan apa yang biasa Anda tulis di buku sekolah:

### 1. Operator Dasar

- **Penjumlahan (`+`)**: `5 + 3` hasilnya `8`
- **Pengurangan (`-`)**: `5 - 3` hasilnya `2`
- **Perkalian (`*`)**: Tidak menggunakan tanda silang (x). Python menggunakan tanda bintang atau _asterisk_. `5 * 3` hasilnya `15`
- **Pembagian Desimal (`/`)**: Menggunakan garis miring. Di Python, hasil pembagian tunggal akan **selalu** bertipe data _Float_ (desimal), meskipun angkanya bulat. `10 / 2` hasilnya `5.0`

### 2. Operator Lanjutan

Selain empat operator di atas, Python memiliki operator sakti yang akan sangat sering Anda gunakan untuk memecahkan masalah logika ke depannya:

- **Pangkat (`**`)**: Jika di kalkulator biasa pangkat ditulis dengan `^`, di Python kita menggunakan bintang ganda.
  Contoh: `2 ** 3` (Artinya 2 pangkat 3), hasilnya `8`.
- **Pembagian Bulat (`//`)**: Ini digunakan jika Anda ingin membagi angka, tetapi bagian desimalnya langsung dibuang atau dibulatkan ke bawah.
  Contoh: `10 // 3` hasilnya `3` (bukan 3.333).
- **Modulo / Sisa Bagi (`%`)**: Ini adalah operator yang paling unik dan sering mengecoh. Modulo tidak mencari hasil bagi, melainkan mencari **sisa** dari hasil bagi tersebut.
  Contoh: `10 % 3` hasilnya `1`. (Karena 10 dibagi 3 maksimal adalah 9, dan masih tersisa angka 1). Logika modulo ini adalah senjata utama _programmer_ untuk mengecek apakah sebuah angka itu bernilai ganjil atau genap.

---

## Tantangan Bab 7: Mewujudkan Cetak Biru Segitiga

Berbekal seluruh operator di atas, kini giliran Anda untuk menciptakan mesin hitung Anda sendiri.

Di [Bab 3](/blog/bab-3-cara-menulis-algoritma), saya pernah menantang Anda untuk merancang _Pseudocode_ (cetak biru) untuk membuat **Kalkulator Luas Segitiga**. Saat itu, program tersebut baru sebatas angan-angan di atas kertas. Hari ini, Anda sudah memiliki semua ilmu yang dibutuhkan untuk mewujudkannya: mulai dari `print()`, `input()`, Variabel, Konversi Tipe Data (`float`), hingga Operator Perkalian (`*`).

**Tugas Anda:**
Terjemahkan cetak biru Anda menjadi **Kalkulator Luas Segitiga** nyata di _Playground_!

1. Program harus meminta _input_ nilai **alas** dari pengguna.
2. Program harus meminta _input_ nilai **tinggi** dari pengguna.
3. Komputer harus menghitung luasnya dengan rumus matematika: `0.5 * alas * tinggi`
4. _(Petunjuk: Ingat jebakan sebelumnya! Jangan lupa bungkus `input` Anda dengan `float()` karena ukuran alas dan tinggi bisa berupa angka desimal)._
5. Tampilkan hasil akhir perhitungannya ke layar menggunakan `print()`.

Jika mesin kalkulator Anda tidak lagi menyambung teks melainkan berhasil menghitung luas dengan benar, _copy-paste_ mahakarya Anda di kolom komentar di bawah ini! Anda secara resmi telah mengubah sebuah cetak biru menjadi aplikasi yang berfungsi nyata!

_(Artikel ini adalah Bagian ke-7 dari Seri Fundamental Python)._

[Baca Selanjutnya: Bab 8 - Gerbang Logika (If dan Else) >>](/blog/bab-8-pengkondisian-if-else-python)
