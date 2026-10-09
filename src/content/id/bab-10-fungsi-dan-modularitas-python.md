---
title: "Fundamental Python Bab 10: Meracik Cetakan Pabrik (Fungsi / Function)"
description: "Jangan menulis ulang kode yang sama. Pelajari konsep modularitas, beda parameter dan argumen, serta rahasia return melalui pembuatan Fungsi."
pubDate: 2026-10-10T10:45:00+07:00
coverImage: "/images/bab-10-fungsi-dan-modularitas-python.webp"
tags:
  [
    "tutorial-python",
    "dasar-pemrograman",
    "fungsi",
    "function-python",
    "pemula",
  ]
isDraft: false
---

Selamat! Anda telah mencapai bab puncak dari Seri Fundamental Python ini. Dari **[Bab 5](/blog/bab-5-input-dan-output-python)** hingga **[Bab 9](/blog/bab-9-perulangan-looping-python)**, Anda telah menguasai Input, Tipe Data, Operator Matematika, Pengkondisian, dan Perulangan.

Sekarang, bayangkan Anda ingin membuat sebuah aplikasi berskala besar. Di Bab 9, kita belajar bahwa _Looping_ berguna untuk mengeksekusi kode berulang kali di satu tempat yang sama. Namun, bagaimana jika ada satu barisan logika yang sama persis, tetapi Anda butuh memanggilnya di puluhan halaman yang berbeda-beda?

Mengkopi dan mem-_paste_ barisan kode tersebut secara manual di mana-mana adalah sebuah bencana.

## Tragedi UI Android dan Logika Mesin Pabrik

Di awal karier saya sebagai pengembang aplikasi Android (_Android Developer_), saya belum memahami konsep _Design System_ dan Modularisasi. Saat membuat desain antarmuka (UI), saya bisa menulis puluhan baris kode yang sama persis secara berulang-ulang hanya untuk mengatur warna, bayangan, dan lengkungan dari sebuah tombol (_button_) di setiap halaman aplikasi.

Suatu hari, saya memutuskan untuk sedikit mengubah warna dasar tombol tersebut. Akibatnya? Saya harus menelusuri ratusan baris kode, membuka puluhan halaman satu per satu, dan merevisi kode warnanya secara manual. Itu adalah mimpi buruk yang sangat membuang waktu dan menguras emosi.

Sejak saat itu, saya sadar akan pentingnya **Modularisasi**. Saya menyadari bahwa bentuk dasar tombol itu semuanya sama. Yang membedakan hanyalah **teks di dalam tombolnya** dan **aksi saat ditekan**. Saya pun menciptakan satu buah cetakan tombol universal (sebuah modul baku). Setelah cetakan itu jadi, saya tidak perlu lagi menulis ulang desain tombol dari nol. Saya cukup "memanggil" cetakan tersebut dan menyisipkan teks yang berbeda-beda.

Di dunia nyata, konsep modularitas ini bekerja persis seperti mesin pabrik. Pabrik otomotif tidak membuat pintu mobil dari nol dengan memanaskan dan menempa besi setiap kali ada pesanan. Mereka membuat satu "cetakan baku". Saat pesanan datang, mereka tinggal memanggil cetakan tersebut.

## Iron Man dan Otomatisasi Zirah

![Ilustrasi Iron Man Suit Up](/images/ilustrasi-ironman-suits.webp)

Untuk memvisualisasikan cara kerjanya, bayangkan Tony Stark di film _Iron Man_. Saat tiba-tiba diserang musuh di jalanan, Tony Stark tidak punya waktu untuk melebur besi, memasang kabel sirkuit, dan merakit pelontar energi dari awal secara manual.

Jauh hari sebelumnya, ia sudah merakit modul-modul zirah tersebut di laboratoriumnya dan membungkusnya dalam satu sistem cetakan. Saat bahaya datang, ia hanya perlu memanggil satu perintah otomatis (misalnya `deploy_suit()`). Sistem akan langsung bekerja merakit zirahnya secara instan.

Secara teori formal, cetakan mesin atau modul zirah ini kita sebut sebagai **Fungsi (Function)**.
Fungsi adalah sekumpulan blok kode terorganisir dan independen yang dirancang untuk menyelesaikan satu tugas spesifik yang sama. Secara sederhana, fungsi adalah "mesin pabrik mini" di dalam program Anda: Anda cukup memasukkan bahan baku, mesin memprosesnya, dan mengeluarkan hasil yang seragam tanpa Anda perlu tahu kerumitan roda gigi di dalamnya.

Di Python, kita menggunakan kata kunci `def` (singkatan dari _Define_ / Definisikan) untuk membangun mesin pabrik kita sendiri.

---

## 1. Merakit Fungsi Dasar (`def`)

Mari kita buat sebuah cetakan sapaan paling sederhana di **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)**.

```python
# Tahap 1: Membuat cetakan mesin (Program belum jalan, baru disimpan di memori)
def sapa_pengunjung():
    print("Selamat datang di aplikasi kami!")
    print("Semoga hari Anda menyenangkan.")

# Tahap 2: Menekan tombol sakelar mesin (Memanggil fungsi)
sapa_pengunjung()
sapa_pengunjung()
```

**Perhatikan:** Blok kode yang ada di dalam `def` (menjorok ke dalam) **tidak akan dieksekusi** sampai Anda benar-benar memanggil nama fungsinya di bagian bawah. Karena kita memanggilnya dua kali, sapaannya akan tercetak dua kali tanpa kita harus menulis ulang kalimat `print`-nya.

## 2. Parameter vs Argumen (Jangan Sampai Tertukar!)

Fungsi di atas terlalu kaku. Bagaimana jika kita ingin menyapanya secara spesifik sesuai nama pengunjungnya? Di sinilah pemula sering kali salah paham dan tertukar istilah. Kita butuh **Parameter** dan **Argumen**.

Perbedaannya sangat jelas secara eksplisit:

- **Parameter:** Adalah variabel kosong yang diletakkan di dalam tanda kurung _saat Anda membuat (mendefinisikan) fungsi_. Ibaratnya, ini adalah **mangkok kosong** di dalam mesin pabrik yang siap menampung bahan baku.
- **Argumen:** Adalah nilai nyata atau data asli yang Anda lempar ke dalam tanda kurung _saat Anda memanggil fungsi tersebut_. Ibaratnya, ini adalah **bahan baku sungguhan** yang Anda tuangkan ke dalam mangkok tadi.

```python
# 'nama_user' adalah PARAMETER (Mangkok kosong di dalam cetakan)
def sapa_pengunjung(nama_user):
    print("Selamat datang, " + nama_user + "!")

# "Herdi" dan "Tony Stark" adalah ARGUMEN (Bahan baku nyata yang dikirim masuk)
sapa_pengunjung("Herdi")
sapa_pengunjung("Tony Stark")
```

## 3. Pintu Keluar: `print` vs `return` (Analogi ATM)

![Ilustrasi Mesin ATM Print vs Return](/images/ilustrasi-mesin-atm.webp)

Ini adalah konsep paling krusial dalam pembuatan fungsi. Apa bedanya Fungsi yang diakhiri dengan perintah `print` dengan Fungsi yang diakhiri dengan perintah `return`? Mari gunakan analogi **Mesin ATM**.

- **Fungsi tanpa pengembalian (hanya `print`):** Ibarat Anda menekan menu **Cek Saldo** di ATM. Mesin ATM akan memproses perintah Anda dan sekadar _menampilkan_ angka Rp100.000 di layar. Anda bisa melihat angkanya, tetapi Anda **tidak bisa** mengambil angka di layar itu untuk dibawa ke kasir dan dibelikan kopi. Nilainya hanya tayang sekejap di layar lalu hangus.
- **Fungsi dengan pengembalian (`return`):** Ibarat Anda melakukan **Tarik Tunai**. Mesin ATM memproses perintah Anda, lalu mengeluarkan uang fisik (nilai) dari celah mesin. Uang (_value_) tersebut kini benar-benar ada di tangan Anda. Anda bisa menyimpannya ke dalam dompet (Variabel), atau langsung dipakai untuk jajan (dioperasikan dengan matematika lain).

Mari kita buat kedua fungsi tersebut secara berdampingan agar Anda bisa melihat perbedaannya secara nyata:

```python
# 1. Fungsi TANPA Pengembalian (Simulasi Cek Saldo)
def cek_saldo():
    saldo_sementara = 100000
    print("Saldo Anda saat ini: Rp", saldo_sementara)
    # Nilai hanya dicetak ke layar, tidak bisa diambil/diolah mesin lagi

# 2. Fungsi DENGAN Pengembalian (Simulasi Tarik Tunai)
def tarik_tunai(jumlah_tarik):
    uang_fisik = jumlah_tarik
    return uang_fisik # Mesin benar-benar mengeluarkan nilai nyata ke luar celah mesin

# ---------------- EKSEKUSI PROGRAM ---------------- #

# Kita panggil fungsi Cek Saldo (Hanya mencetak teks di layar)
cek_saldo()

# Kita panggil fungsi Tarik Tunai, dan uang yang keluar ditangkap ke dalam variabel 'dompet'
isi_dompet = tarik_tunai(50000)

# Karena uang Tarik Tunai tersebut nyata (return) dan sudah disimpan di dalam dompet,
# kita bisa membelanjakannya! (Misal: dikurangi angka 20.000 untuk jajan kopi)
print("Saya jajan kopi Rp 20.000, sisa uang di dompet:", isi_dompet - 20000)
```

Jika fungsi `tarik_tunai` di atas hanya menggunakan `print(uang_fisik)` alih-alih `return`, maka Anda tidak akan bisa menguranginya dengan angka 20.000 di baris paling bawah. Program Anda akan menjadi _error_ karena sesungguhnya tidak ada nilai nyata yang dikembalikan ke sistem.

---

## Tantangan Terakhir: Boss Fight (Kalkulator Menu)

Ini adalah ujian akhir (_Boss Fight_) Anda. Kita akan merangkai semua ilmu menjadi satu mahakarya: **Program Kalkulator Interaktif Bangun Datar**.

Program ini akan menggunakan perulangan tanpa henti (`while True`) untuk menampilkan menu. Jika pengguna menekan "1", program memanggil Fungsi Luas Segitiga. Jika "2", memanggil Fungsi Luas Persegi Panjang. Jika "3", putaran waktu dihentikan (`break`).

**Tugas Anda:**
Saya telah menyusun kerangka cetakan pabriknya di bawah ini. Tugas Anda adalah melengkapi bagian-bagian yang kosong (`___`) dengan logika sintaks yang tepat, berdasarkan ilmu dari Bab 5 hingga Bab 10!

```python
# 1. Definisikan Fungsi Luas Segitiga (Wajib gunakan return)
def luas_segitiga(alas, tinggi):
    ___ 0.5 * alas * tinggi

# 2. Definisikan Fungsi Luas Persegi Panjang (Wajib gunakan return)
def luas_persegi_panjang(panjang, lebar):
    ___ panjang * lebar

# 3. Perulangan Menu Utama (Time Loop)
___ True:
    print("\n--- MENU KALKULATOR ---")
    print("1. Hitung Luas Segitiga")
    print("2. Hitung Luas Persegi Panjang")
    print("3. Keluar")

    # Input pilihan (Ingat tipe data input selalu teks!)
    pilihan = input("Masukkan pilihan (1/2/3): ")

    ___ pilihan == "1":
        a = float(input("Masukkan alas: "))
        t = float(input("Masukkan tinggi: "))
        # Memanggil fungsi luas_segitiga dan argumennya dicetak
        print("Hasil Luas Segitiga:", luas_segitiga(a, t))

    ___ pilihan == "2":
        p = float(input("Masukkan panjang: "))
        l = float(input("Masukkan lebar: "))
        # Memanggil fungsi luas_persegi_panjang
        print("Hasil Luas Persegi Panjang:", ___(p, l))

    ___ pilihan == "3":
        print("Terima kasih telah menggunakan kalkulator!")
        ___  # Hancurkan perulangan waktu ini!

    ___:
        print("Pilihan tidak valid, coba lagi.")
```

Berhasilkah Anda menyelesaikannya di **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)** tanpa menemukan _IndentationError_ atau _TypeError_? Jika iya, salin seluruh kode rampung Anda dan pamerkan di kolom komentar! Anda kini resmi telah menamatkan fondasi dasar logika mesin.

_(Artikel ini adalah Bagian ke-10 sekaligus penutup dari Seri Fundamental Python. Teruslah berkarya, merakit cetakan, dan menulis kode!)_
