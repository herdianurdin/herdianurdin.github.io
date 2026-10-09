---
title: "Fundamental Python Bab 4: Berkenalan dengan Python dan Senjata Utama Kita"
description: "Mengapa hacker, inovator AI, dan raksasa teknologi memilih Python? Mari bongkar sejarahnya dan mulai eksekusi baris kode pertama Anda."
pubDate: 2026-10-10T10:15:00+07:00
coverImage: "/images/bab-4-berkenalan-dengan-python.webp"
tags: ["tutorial-python", "dasar-pemrograman", "sejarah-python", "pemula"]
isDraft: false
---

Pada **[Bab 3 sebelumnya](/blog/bab-3-cara-menulis-algoritma)**, Anda telah membuktikan bahwa Anda tidak gegabah. Anda telah berhasil merancang _Pseudocode_ (cetak biru) untuk menghitung luas segitiga. Anda telah menyusun logika dengan aman di atas kertas.

Sekarang, saatnya kita membuka layar hitam sesungguhnya dan menerjemahkan logika tersebut ke dalam bahasa pemrograman tingkat tinggi. Dan bahasa yang akan menemani perjalanan kita adalah **Python**.

Namun, dari ribuan bahasa pemrograman yang ada di dunia, mengapa kita harus repot-repot memilih Python? Mengapa bukan Java, C++, atau JavaScript?

## Keajaiban di Akhir Tahun 2020 (Pengalaman Pribadi)

Saya menemukan jawaban dari pertanyaan di atas melalui pengalaman personal. Tepat di akhir tahun 2020, saya mengikuti kelas _Machine Learning_ dari Dicoding. Sebelumnya, saya adalah pemakai setia bahasa Pascal dan C++.

Di bahasa pemrograman lama seperti C++ atau Java, jika Anda hanya ingin menyuruh komputer menampilkan teks di layar, Anda harus menuliskan ritual kode yang panjang dan kaku:

```cpp
#include <iostream>
int main() {
    std::cout << "Tampilkan teks ini";
    return 0;
}
```

Namun, saat saya masuk ke kelas _Machine Learning_ tersebut dan berkenalan dengan Python, saya benar-benar tercengang. Untuk menampilkan teks yang sama, di Python saya hanya perlu menulis **satu baris** tanpa basa-basi:

```python
print("Tampilkan teks ini")
```

Sintaksnya sangat manusiawi, bersih, ringkas, dan tidak dipenuhi oleh tanda kurung kurawal atau titik koma yang sering membuat _programmer_ frustrasi (seperti yang saya ceritakan di Bab 2). Python benar-benar membiarkan kita fokus pada solusi (algoritma), bukan pada kerumitan tata bahasa.

## Bahasa Sakti Para Hacker dan Inovator

![Ilustrasi Hacker dan Python](/images/hacker-python.webp)

Di tahun 2020 itu juga, saya sedang gemar-gemarnya mencoba berbagai distro Linux, hingga akhirnya jatuh hati pada Linux Mint edisi Debian. Di dalam ekosistem Linux, saya mencoba mempelajari berbagai _tools_ untuk _cybersecurity_.

Fakta mengejutkannya: rata-rata _tools_ peretasan jaringan (_cybersecurity_) dan otomatisasi ternyata dibangun menggunakan Python! Berbekal rasa penasaran, saya bahkan berhasil membuat perangkat lunak _bot_ otomatis (_auto-viewer_ YouTube dan _auto-visitor_ situs) murni menggunakan Python yang dipadukan dengan _library_ Selenium. Python bisa digunakan untuk membuat _website_, aplikasi _mobile_, perangkat lunak _desktop_, hingga _script_ peretasan.

Jika Anda perhatikan, reputasi "sakti" ini sering direpresentasikan dalam _pop culture_.
Pernahkah Anda menonton serial _Mr. Robot_? Saat karakter utamanya, Elliot Alderson, sedang menembus keamanan _server_ raksasa di layar terminalnya, bahasa yang ia ketik adalah Python. Atau mari kita lihat drama Korea fenomenal tahun 2020, _Start-Up_. Saat karakter Nam Do-san dan tim Samsan Tech sedang mengembangkan model _Artificial Intelligence_ (AI) cerdas mereka, mereka juga menggunakan bahasa Python.

## Monty Python dan Misteri Logo Ular

![Ilustrasi Sejarah Python](/images/sejarah-python.webp)

Meskipun saat ini ia menjadi tulang punggung AI dan teknologi masa depan, sejarah kelahiran Python ternyata sangat sederhana dan sedikit konyol.

Python diciptakan pada tahun 1991 oleh seorang _programmer_ jenius asal Belanda bernama **Guido van Rossum**. Banyak orang mengira nama "Python" diambil dari nama ular piton raksasa. Kenyataannya, Guido mengambil nama tersebut dari grup komedi televisi asal Inggris favoritnya, yaitu _Monty Python's Flying Circus_. Guido ingin menciptakan sebuah bahasa yang tidak hanya kuat, tetapi juga menyenangkan (_fun_) untuk digunakan.

Lalu, jika asalnya dari nama grup komedi, mengapa logonya berbentuk dua ekor ular (berwarna biru dan kuning)?

Jawabannya adalah karena adaptasi komunitas. Karena kata "Python" terlanjur memiliki makna literal "ular piton" di telinga masyarakat global, komunitas teknologi secara alami mengadopsi simbol ular berbisa tersebut sebagai maskot, yang melambangkan kekuatan dan kelincahan bahasa ini.

## Peluang Karier: Dari Pemula hingga Raksasa Teknologi

Menguasai Python adalah sebuah investasi jangka panjang. Karena bahasa ini ibarat pisau lipat Swiss Army, peluang kariernya sangatlah luas.

- **Web Developer:** Menggunakan _framework_ seperti Django atau FastAPI (dipakai oleh Instagram dan Pinterest).
- **Data Scientist & AI Engineer:** Menggunakan pustaka ( _library_ ) khusus untuk melatih kecerdasan buatan, seperti yang dilakukan raksasa Google dan OpenAI (pembuat ChatGPT).
- **Cybersecurity / Penetration Tester:** Menulis _script_ otomatis untuk menguji keamanan _server_ perusahaan.

## Senjata Kita: Python Quest Playground

![Ilustrasi Cloud Playground](/images/playground-python.webp)

Biasanya, rintangan terberat bagi pemula (terutama yang memiliki laptop spesifikasi rendah atau prosesor Celeron lama) adalah saat proses instalasi. Menginstal Python, mengatur _Environment Variable_, dan memasang kode editor (IDE) di laptop sering kali menimbulkan banyak _error_ instalasi yang mematikan semangat belajar di hari pertama.

Untuk mengatasi hal tersebut, kita akan melewatkan proses instalasi lokal yang merepotkan. Saya telah menyediakan sebuah "laboratorium _cloud_" yang sangat ringan dan bisa dibuka langsung dari _browser_ (Google Chrome/Firefox) Anda, apa pun jenis laptop Anda!

Perkenalkan senjata utama kita selama seri tutorial ini:
👉 **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)**

Di _website_ tersebut, Anda bisa mengetikkan kode di layar kiri, menekan tombol **Jalankan**, dan langsung melihat hasilnya secara _real-time_ di layar kanan. Tanpa instalasi, tanpa membebani RAM laptop Anda.

---

## Tantangan Bab 4: Pemberontakan Pertama Anda

Sepanjang sejarah ilmu komputer, ada sebuah tradisi tidak tertulis. Setiap kali seorang _programmer_ mempelajari bahasa baru, baris kode pertama yang wajib mereka cetak ke layar adalah `"Hello, World!"`.

Tradisi itu sudah terlalu membosankan. Kita akan membuat gebrakan baru. Kita akan mendeklarasikan diri kepada komputer bahwa Anda bukan lagi sekadar pengguna, melainkan sang pencipta.

**Tugas Anda:**

1. Buka tautan **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)**.
2. Di kolom teks (editor), ketikkan perintah ini secara persis (perhatikan huruf kecil pada perintah awal dan tanda kutip ganda yang mengapit teks):

```python
print("Halo mesin, saya adalah majikan barumu!")
```

3. Tekan tombol **Jalankan**.

Jika teks tersebut muncul di layar, selamat! Anda baru saja mengeksekusi instruksi Python pertama Anda. Salin (_copy_) baris kode yang berhasil Anda jalankan tersebut, lalu pamerkan di kolom komentar di bawah sebagai tanda absen bahwa mesin telah takluk di tangan Anda!

Di materi selanjutnya, kita akan mulai bermain-main dengan komunikasi interaktif, di mana komputer tidak hanya menampilkan teks, tetapi juga menanyakan informasi kepada Anda.

_(Artikel ini adalah Bagian ke-4 dari Seri Fundamental Python)._

[Baca Selanjutnya: Bab 5 - Berbicara dengan Mesin (Input & Output) >>](/blog/bab-5-input-dan-output-python)
