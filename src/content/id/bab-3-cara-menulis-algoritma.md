---
title: "Fundamental Python Bab 3: Cara Menulis Algoritma (Cetak Biru Aplikasi)"
description: "Belajar menulis algoritma melalui kalimat deskriptif, flowchart, dan pseudocode. Jangan membuat kode berantakan hanya karena malas merancang cetak biru."
pubDate: 2026-10-10T10:10:00+07:00
coverImage: "/images/bab-3-cara-menulis-algoritma.webp"
tags:
  ["tutorial-python", "dasar-pemrograman", "pseudocode", "flowchart", "pemula"]
isDraft: false
---

Di **[Bab 2 sebelumnya](/blog/bab-2-mengenal-pemrograman-dan-bahasa)**, kita telah menyadari sebuah ironi besar: komputer adalah mesin yang sangat cepat, tetapi sangat bodoh. Ia menelan instruksi secara harfiah.

Jika kemarin Anda mencoba memecah instruksi "menyuruh robot DUM-E membuka pintu", Anda pasti merasakan betapa melelahkannya menstrukturkan bahasa mesin. Karena komputer menuntut instruksi yang sangat rinci dan kaku, seorang _programmer_ pantang hukumnya langsung mengetik baris kode (_coding_) ketika berhadapan dengan sebuah masalah.

Sama seperti membangun rumah yang membutuhkan gambar rancangan dari arsitek, membangun sebuah aplikasi juga membutuhkan cetak biru (_blueprint_) sebelum diubah menjadi baris kode.

Jika Anda pernah menonton serial _Prison Break_, Anda pasti tahu bahwa karakter utamanya, Michael Scofield, tidak asal masuk ke dalam penjara Fox River dan berharap bisa melarikan diri begitu saja. Ia mengumpulkan informasi, memetakan setiap koridor, menghitung jadwal penjaga, dan merancang seluruh langkah pelariannya dengan sangat presisi hingga ia menato cetak biru tersebut di sekujur tubuhnya. Ia menyusun algoritma pelarian.

## Tragedi Kode Berantakan dan Sistem yang Jebol

Dulu, di masa awal saya belajar pemrograman, saya pernah menjadi _developer_ yang arogan. Saya merasa sudah cukup pintar untuk langsung mengeksekusi kode tanpa coret-coret di kertas.

Saat itu, saya sedang membuat fitur autentikasi (_Login_). Tanpa merancang algoritma, saya langsung mengetik kode untuk mengecek _email_ dan _password_. Hasilnya? Kode saya penuh dengan pengulangan `if` (kondisi) yang sangat berantakan dan bertumpuk-tumpuk. Pengecekan _email_ harus ini dan itu, lalu di dalamnya ada lagi pengecekan _password_ yang berbelit-belit.

Aplikasi itu memang berjalan, tapi kodenya sangat panjang dan kotor (_spaghetti code_). Saya sampai pusing sendiri membacanya. Pada akhirnya, saya harus membongkar ulang dan merapikannya dari nol. Membuang waktu berhari-hari untuk sebuah kesalahan yang bisa dihindari jika saya membuat cetak birunya dalam 10 menit.

Dampak dari merancang algoritma secara asal-asalan bisa jauh lebih fatal dari sekadar kode yang kotor. Semasa kuliah dulu, saya pernah iseng melakukan _audit_ keamanan pada _website_ kampus saya sendiri. Tanpa sengaja, saya menemukan celah masif pada sistem autentikasi pendaftaran mahasiswanya.

Sistem tersebut bisa di-_bypass_ (dilewati) tanpa perlu registrasi sama sekali! Kesalahan konyol ini terjadi karena _developer_-nya menulis algoritma yang ngasal. Mereka mengeksekusi verifikasi keamanan menggunakan _raw JavaScript_ di sisi _client_ (pengguna) dan tidak melakukan perlindungan apa pun di sisi _server_. Siapa pun yang sedikit mengerti kode bisa memanipulasinya dengan mudah.

Itulah mengapa cetak biru sangat penting. Ia bukan sekadar panduan mengetik; ia adalah pertahanan pertama logika aplikasi Anda.

## 3 Cara Menulis Algoritma (Aturan Baku yang Sebenarnya Bebas)

![Ilustrasi Arsitek Perangkat Lunak](/images/ilustrasi-arsitek-perangkat-lunak.webp)

Secara teknis, penulisan algoritma itu bersifat bebas. Tidak ada _compiler_ yang akan memberikan layar _error_ merah jika Anda salah eja. Syarat utamanya hanya tiga: **mudah dibaca, mudah dimengerti, dan mudah dipahami**.

Namun, agar para _programmer_ di seluruh dunia memiliki standar komunikasi yang sama, kita menyepakati tiga cara umum untuk menuliskan algoritma:

### 1. Kalimat Deskriptif (Teks Prosedur)

Ini adalah penulisan algoritma yang paling mirip dengan bahasa manusia sehari-hari. Strukturnya dibagi menjadi tiga bagian:

- **Judul:** Disertai penjelasan singkat tujuan algoritma.
- **Deklarasi:** Daftar "kardus penyimpanan" atau persiapan (variabel, tipe data, konstanta).
- **Deskripsi:** Langkah-langkah eksekusinya.

Mari kita gunakan satu contoh konsisten: **Menghitung Luas Persegi Panjang**.

**Contoh Kalimat Deskriptif:**

```text
Algoritma Menghitung Luas Persegi Panjang
{ Menghitung luas persegi panjang, mulai dari menerima input panjang dan lebar, menghitung luasnya, dan mencetak/menampilkan hasilnya }

Deklarasi:
panjang = integer (tipe data bilangan bulat)
lebar = integer (tipe data bilangan bulat)
luas = integer (tipe data bilangan bulat)

Deskripsi:
1. Input nilai panjang dan lebar.
2. Hitung luas = panjang * lebar.
3. Tampilkan hasil perhitungannya.
```

### 2. Flowchart (Diagram Visual)

![Ilustrasi Flowchart Pemrograman](/images/flowchart.webp)

Manusia memproses gambar lebih cepat daripada teks. _Flowchart_ mengubah kalimat deskriptif di atas menjadi notasi grafis atau diagram.

Untuk dasar ini, Anda hanya perlu fokus pada 5 simbol utama:

1. **Terminal (Oval):** Menandakan _Start_ (Mulai) dan _End_ (Selesai).
2. **Flow Lines (Panah):** Menunjukkan arah aliran eksekusi dari atas ke bawah.
3. **Data (Jajar Genjang):** Digunakan untuk proses _Input_ (meminta data) dan _Output_ (menampilkan data).
4. **Process (Persegi Panjang):** Digunakan untuk operasi matematika atau pengisian nilai.
5. **Decision (Belah Ketupat):** Titik persimpangan kondisi (_If/Else_), biasanya memiliki panah "Ya" dan "Tidak".

**Contoh Kalimat Flowchart:**
![Flowchart Luas Persegi Panjang](/images/contoh-flowchart-luas-persgi-panjang.webp)

### 3. Pseudocode (Jembatan Menuju Kode Asli)

![Ilustrasi Pseudocode](/images/ilustrasi-pseudocode.webp)

_Pseudocode_ secara harfiah berarti "kode semu". Ini adalah bahasa tingkat menengah yang menggabungkan logika pemrograman dengan bahasa manusia.

Penulisannya mirip seperti kode tingkat tinggi (seperti Python), namun Anda dibebaskan dari aturan sintaks yang ketat. Yang terpenting, alur logikanya tergambar dengan jelas.

**Contoh Pseudocode (Luas Persegi Panjang):**

```text
panjang: integer
lebar: integer
luas: integer

input(panjang)
input(lebar)

luas = panjang * lebar

cetak(luas)
```

Bisa Anda lihat? _Pseudocode_ ini sangat ringkas, rapi, dan sudah 90% siap diterjemahkan langsung ke dalam bahasa Python di _text editor_ Anda.

---

## Tantangan Bab 3: Menyusun Cetak Biru Pertama Anda

Sebelum kita akhirnya membuka layar hitam dan mengetik kode Python pertama kita di bab selanjutnya, Anda harus membuktikan bahwa Anda bisa merancang sebuah cetak biru dasar.

Kita sudah melihat bagaimana algoritma **Luas Persegi Panjang** ditulis. Sekarang, saya ingin Anda merancang algoritma untuk saudara dekatnya.

**Tugas Anda:**
Tuliskan algoritma dalam bentuk **Pseudocode** untuk menghitung **Luas Segitiga**.
_(Petunjuk Rumus: Luas Segitiga = 0.5 * alas * tinggi)._

Tentukan apa saja variabel yang harus dideklarasikan, apa yang harus di-_input_, bagaimana proses hitungnya, dan pastikan Anda mencetak hasilnya. Simpan _pseudocode_ Anda di Notepad atau tuliskan langsung di kolom komentar di bawah!

Di materi selanjutnya, kita akan membawa _pseudocode_ ini ke dalam _Playground_ dan menghidupkannya!

_(Artikel ini adalah Bagian ke-3 dari Seri Fundamental Python)._

[Baca Selanjutnya: Bab 4 - Berkenalan dengan Python & Senjata Kita >>](/blog/bab-4-berkenalan-dengan-python)
