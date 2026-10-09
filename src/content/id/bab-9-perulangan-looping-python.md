---
title: "Fundamental Python Bab 9: Menolak Jadi Pekerja Paksa (Perulangan / Looping)"
description: "Kemalasan adalah kebajikan tertinggi seorang programmer. Pelajari cara menyuruh komputer melakukan pekerjaan repetitif dengan for, while, dan break."
pubDate: 2026-10-10T10:40:00+07:00
coverImage: "/images/bab-9-perulangan-looping-python.webp"
tags: ["tutorial-python", "dasar-pemrograman", "looping", "for-while", "pemula"]
isDraft: false
---

Di **[Bab 8 sebelumnya](/blog/bab-8-pengkondisian-if-else-python)**, kita telah membuat aplikasi kita menjadi lebih cerdas karena mampu mengambil keputusannya sendiri melalui struktur `if-else`. Kini, saatnya kita melipatgandakan kekuatan aplikasi tersebut.

Ada sebuah pepatah terkenal di dunia teknologi: _"Kemalasan adalah sifat terbaik yang bisa dimiliki oleh seorang programmer."_

Tentu saja, ini bukan kemalasan dalam arti berbaring seharian tanpa melakukan apa-apa. Ini adalah kemalasan yang cerdas. Di dunia nyata, kita dipaksa untuk melakukan rutinitas yang repetitif dan membosankan setiap hari—makan, mandi, menempuh perjalanan sekolah atau kantor—dan kita tidak bisa melewatkan siklus tersebut.

Namun, ketika duduk di depan komputer, seorang _programmer_ menolak keras untuk menjadi pekerja manual.

## Otomatisasi dan Menolak Bekerja Dua Kali

Sebagai seorang _developer_, saya mengelola beberapa aplikasi di Google Play Store dan mempublikasikan konten web. Dulu, saya bisa menghabiskan waktu berjam-jam hanya untuk melakukan pekerjaan repetitif: mengklik tombol _rename_ pada ratusan file gambar, atau mengonversi format `.png` ke `.webp` satu per satu. Saya juga harus memantau metrik organik (_App Store Optimization_) aplikasi saya secara manual setiap hari.

Karena merasa "malas" dan kelelahan membuang waktu untuk rutinitas tersebut, saya akhirnya merancang sebuah skrip Python dan perintah otomatis dadakan. Hasilnya? Pekerjaan konversi gambar dan penarikan data metrik yang tadinya memakan waktu berjam-jam, kini selesai hanya dalam satu detik dengan satu kali klik.

Skrip tersebut mengambil alih pekerjaan repetitif itu tanpa pernah mengeluh, tanpa meminta istirahat, dan tanpa melakukan kesalahan (_human error_). Rahasia di balik keajaiban otomatisasi ini adalah konsep yang kita sebut dengan **Perulangan (Looping)**.

Secara teori formal, **Iterasi (Perulangan)** adalah sebuah struktur kontrol aliran (_control flow_) yang memungkinkan satu blok kode dieksekusi berkali-kali secara berulang, baik berdasarkan jumlah iterasi yang sudah pasti, maupun berdasarkan evaluasi suatu kondisi logika.

## Doctor Strange dan Jebakan Waktu

![Ilustrasi Doctor Strange Time Loop](/images/ilustrasi-doctor-strange-time-loop.webp)

Untuk memahami konsep perulangan yang bergantung pada kondisi, ingatlah momen klimaks dalam film _Doctor Strange_ (2016). Strange menghadapi entitas kosmik raksasa bernama Dormammu yang jauh lebih kuat darinya. Ia tahu ia tidak bisa menang secara fisik.

Apa yang ia lakukan? Strange menggunakan sihir untuk menjebak Dormammu di dalam sebuah siklus waktu tanpa batas (_infinite loop_). Setiap kali Dormammu membunuh Strange, waktu mereset dirinya kembali ke awal dengan kalimat ikonik: _"Dormammu, I've come to bargain!"_

Siklus itu berulang ratusan kali dan tidak akan pernah berhenti, KECUALI satu syarat atau kondisi terpenuhi: Dormammu menyerah. Dalam pemrograman, kita menggunakan logika yang sama persis untuk mengeksekusi perulangan.

Di Python, kita memiliki dua senjata utama untuk melakukan hal ini: **For Loop** dan **While Loop**.

---

## 1. Perulangan Pasti (`for` Loop)

Perulangan `for` digunakan ketika Anda **sudah mengetahui secara pasti** berapa kali pekerjaan tersebut harus diulang. Ibarat Anda disuruh berlari memutari lapangan sebanyak 5 kali.

Di Python, `for` biasanya dipasangkan dengan fungsi `range()`, yang bertugas menciptakan deret angka sebagai batas perulangan. Buka **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)** dan jalankan kode ini:

```python
# Komputer akan mengulang kode di bawahnya sebanyak 5 kali
for angka in range(5):
    print("Saya tidak akan mengulangi kesalahan yang sama, janji ke-", angka)
```

Jika Anda menjalankannya, Anda mungkin akan terkejut. Komputer akan mencetak kalimat tersebut berurutan, tetapi angkanya dimulai dari `0` hingga `4` (bukan 1 sampai 5). Mengapa demikian?

Di dunia ilmu komputer, ada satu hukum baku yang disebut **Zero-based indexing**. Mesin komputer selalu mulai menghitung dari angka **Nol (0)**. Jadi, ketika Anda meminta mesin menghitung 5 langkah, ia akan menghitung: `0, 1, 2, 3, 4`. Totalnya tetap tepat 5 langkah, hanya saja titik awalnya adalah nol.

## 2. Perulangan Kondisional (`while` Loop)

Berbeda dengan `for`, perulangan `while` digunakan ketika Anda **tidak tahu pasti berapa kali ia harus berulang**. Perulangan ini hanya bergantung pada sebuah kondisi logika. _Selama kondisinya bernilai True, perulangan akan terus berjalan._ Inilah mantra _time-loop_ milik Doctor Strange.

```python
baterai = 3

# Selama nilai baterai lebih besar dari 0, blok di bawah ini terus dieksekusi
while baterai > 0:
    print("Baterai masih ada:", baterai, "persen. Mesin menyala!")

    # Ini sangat PENTING! Kita harus mengurangi nilai baterai
    # Jika tidak dikurangi, baterai akan selalu bernilai 3, dan perulangan tidak akan pernah berhenti!
    baterai = baterai - 1

print("Baterai habis, mesin mati.")
```

## 3. Kendali Putaran (`break` dan `continue`)

![Ilustrasi Kendali Putran](/images/ilustrasi-kendali-putaran.webp)

Terkadang, Anda ingin menginterupsi sebuah putaran waktu di tengah jalan, seperti Doctor Strange yang membatalkan mantranya saat Dormammu akhirnya menyerah. Untuk memanipulasi putaran mesin, kita menggunakan dua perintah khusus:

- **`break` (Hancurkan):** Perintah ini secara paksa akan menghancurkan dan menghentikan seluruh perulangan seketika, tidak peduli apakah kondisinya masih _True_ atau batasannya belum selesai.
- **`continue` (Lompati):** Perintah ini hanya melewatkan (men-_skip_) siklus putaran yang _saat ini_ sedang berjalan, dan langsung menyuruh mesin melompat ke siklus putaran berikutnya.

Perhatikan bedanya dalam kode ini:

```python
for angka in range(1, 6): # Deret angka 1 sampai 5
    if angka == 3:
        continue # Saat angka mencapai 3, abaikan perintah print di bawah, langsung lompat ke 4
    if angka == 5:
        break    # Saat angka mencapai 5, HANCURKAN perulangan sepenuhnya!

    print("Mengeksekusi angka:", angka)

# Hasil di layar hanya akan mencetak angka 1 dan 2.
# Angka 3 di-skip (continue), dan di angka 5 program hancur (break).
```

---

## Tantangan Bab 9: Meretas Sistem Keamanan (Brute-Force)

Mari kita padukan ilmu Bab 8 (If-Else) dengan Bab 9 (While Loop & Break).

Bayangkan Anda sedang membuat sebuah sistem _Login_ keamanan. Anda ingin mesin terus-menerus menanyakan _password_ secara berulang-ulang tanpa henti, dan siklus tersebut **hanya** bisa dihancurkan (`break`) jika pengguna memasukkan _password_ yang benar.

**Tugas Anda:**
Saya telah membuat kerangka kodenya di bawah ini, tetapi saya sengaja mengosongkan beberapa perintah kuncinya (ditandai dengan `___`). Lengkapilah kode tersebut di **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)**!

```python
# 'while True' akan menciptakan perulangan waktu abadi (Infinite Loop)
___ True:
    tebakan = ___("Masukkan kata sandi rahasia: ")

    ___ tebakan == "algoritma2026":
        print("Akses Diterima! Selamat datang di sistem.")
        ___ # Hancurkan perulangan abadi ini karena password sudah benar!
    ___:
        print("Akses Ditolak! Coba lagi.")

print("Sistem telah terbuka, perulangan berhenti.")
```

Ganti bagian yang kosong (`___`) dengan logika sintaks yang tepat (`while`, `input`, `if`, `else`, atau `break`). Jika Anda berhasil merakit sistemnya, _copy_ kode utuh Anda dan _paste_ di kolom komentar!

_(Artikel ini adalah Bagian ke-9 dari Seri Fundamental Python)._

[Baca Selanjutnya: Bab 10 - Menyusun Fungsi / Blueprint Terakhir >>](/blog/bab-10-fungsi-dan-modularitas-python)
