---
title: "Vibe Engineering vs Vibe Coding: Analogi Liburan dan Tragedi Race Condition"
description: "Pahami perbedaan mendasar vibe engineering vs vibe coding. Belajar dari studi kasus LMS Python Quest, tragedi Firebase, dan rahasia prompt AI terstruktur."
pubDate: 2026-10-19T08:00:00+07:00
coverImage: "/images/vibe-engineering-vs-vibe-coding.webp"
tags:
  [
    "vibe-coding",
    "vibe-engineering",
    "react-js",
    "firebase",
    "studi-kasus",
    "prompt-engineering",
  ]
isDraft: false
---

Di kelas Rekayasa Perangkat Lunak, saya sering melihat siswa yang terkena fenomena FOMO AI—rasa takut tertinggal karena belum menggunakan kecerdasan buatan untuk merakit aplikasi secara instan. Untuk meluruskan pola pikir mereka, saya biasanya menggunakan sebuah analogi liburan.

Bayangkan Anda ingin pergi berlibur.

Jika Anda menggunakan pendekatan **Vibe Coding**, Anda akan langsung melompat ke dalam mobil dan menginjak gas tanpa tahu arah, tanpa rencana anggaran, dan tanpa memesan hotel. Hasilnya? Anda mungkin sampai di suatu tempat, tetapi kemungkinan besar Anda akan tersesat, kehabisan uang, atau tidur di pinggir jalan.

Sebaliknya, **Vibe Engineering** adalah ketika Anda duduk sejenak untuk menyusun rencana. Anda menentukan kota tujuan, menghitung _budget_, membuat _itinerary_ kegiatan, dan memesan tiket sejak jauh hari. Perjalanan Anda menjadi terstruktur, aman, dan efisien.

Analogi ini sangat relevan di dunia pemrograman modern. Di artikel ini, kita akan membedah secara teknis perbandingan **vibe engineering vs vibe coding**, membedah gaya _prompt_ (perintah AI) yang digunakan, dan menarik pelajaran penting dari tragedi sistem yang pernah saya alami sendiri.

## Miskonsepsi AI dan Eksperimen Python Quest

Sebelum kita membedah lebih jauh, ada satu miskonsepsi yang sering mampir ke saya: _"Apakah semua aplikasi buatan Bapak murni hasil ketikan AI?"_

Jawabannya: Tentu tidak. Untuk aplikasi Android yang tayang di Play Store, saya sangat selektif. Saya tetap **[bertahan dengan Native Kotlin dan XML](/blog/opini-native-kotlin-xml-vs-cross-platform)** karena saya membutuhkan kestabilan arsitektur luring (_offline-first_). Di ekosistem _mobile_ ini, AI hanya saya gunakan sebagai asisten kecil untuk mencari _bug_ pemanggilan iklan (_AdMob_), bukan untuk merakit sistem dari nol.

Namun, untuk ranah pengembangan _web_, ceritanya berbeda. Saya melakukan eksperimen ekstrem menggunakan kecerdasan buatan secara penuh.

Hasil dari eksperimen itu adalah **[Python Quest](https://herdianurdin.my.id/python-quest/)**, sebuah _Learning Management System_ (LMS) interaktif untuk belajar logika pemrograman Python. Proyek inilah yang menjadi medan ujian sesungguhnya untuk melihat batas antara sekadar "memerintah AI" dan "merekayasa sistem dengan AI".

## Praktik Vibe Engineering: Merancang Sebelum Mengetik

![Ilustrasi programmer menyusun cetak biru arsitektur di papan tulis sebelum memberikan instruksi kepada robot AI](/images/ilustrasi-programmer-dengan-cetak-biru.webp)

Platform Python Quest dibangun menggunakan **[React JS](https://react.dev/)**, di-_hosting_ gratis melalui GitHub Pages, dan ditenagai oleh **[Firebase](https://firebase.google.com/)** untuk sistem autentikasi serta _database_ waktu nyata (_realtime_).

Jika saya menggunakan pendekatan _vibe coding_ amatir, saya pasti langsung menyuruh mesin: _"Buatkan saya web LMS pakai React dan Firebase."_

Namun, saya memilih pendekatan **vibe engineering**. Langkah yang saya lakukan di awal sama sekali tidak menyentuh kode operasional:

1.  **Perdebatan Database:** Saya merancang skema _database_ berformat JSON secara manual, lalu melemparkannya ke **[Google AI Studio (Gemini)](https://aistudio.google.com/)**. Saya menantang AI untuk merevisi struktur tersebut agar kinerjanya tidak rakus dan melebihi batas kuota gratis Firebase.
2.  **Pembuatan Mock UI:** Setelah kerangka _database_ disetujui, saya menyuruh AI membangun Antarmuka Pengguna (UI) secara total menggunakan data palsu (_mock data_). Pada tahap ini, saya melarang keras AI untuk menyentuh sistem autentikasi atau _database_.
3.  **Audit Arsitektur Visual:** Meskipun sudah dikendalikan, kode UI yang dihasilkan AI masih sering berantakan dan tidak modular (berlawanan dengan **[prinsip dasar UI/UX yang baik](/blog/apa-itu-ui-ux-designer-wireframe-mockup)**). Saya harus turun tangan melakukan pembersihan (_refactoring_) agar struktur _folder_ dan komponennya rapi sebelum melangkah ke tahap selanjutnya.

## Tragedi Firebase: Ketika Vibe Coding Menjadi Bencana

Meskipun fondasinya sudah direncanakan matang, mesin AI tetaplah mesin yang bisa berhalusinasi. Bencana sesungguhnya muncul ketika desain antarmuka sudah rampung, lalu saya meminta AI untuk menerapkan sistem Autentikasi (membagi hak akses antara _Admin_ dan _Player_).

Di sinilah sistem mulai kacau:

- **Tragedi Routing:** Logika navigasi AI hancur balau. Halaman publik seperti _landing page_ yang seharusnya bebas diakses tiba-tiba terkunci, menyebabkan pengguna gagal masuk ke dalam sistem.
- **Tragedi Race Condition:** Ini adalah _bug_ yang paling mematikan di pemrograman. Saat mengimplementasikan _Firebase Realtime Database_, AI gagal menyusun logika antrean data (_asynchronous_). Akibatnya, saat _Player A_ mengirim kode, dan _Player B_ melakukan hal yang sama dalam waktu berdekatan, data mereka saling bertabrakan dan tertimpa.
- **Tragedi Kuota:** Kode pencarian data (_query_) buatan AI sangat tidak efisien. Saat diuji coba oleh 20 pengguna secara bersamaan, performa aplikasi melambat drastis dan kuota Firebase saya langsung terkuras habis dalam sekejap.

Coba bayangkan jika saya tidak memiliki **[fondasi logika algoritma dasar](/blog/bab-1-mengenal-algoritma-dan-pola-pikir)**. Saya pasti tidak akan tahu letak masalah _Race Condition_ tersebut, dan aplikasi itu kemungkinan besar akan mati sebelum dirilis.

## Perbedaan Prompt: Amatir vs Arsitek

![Ilustrasi perbandingan dokumen spesifikasi PRD yang tebal dan rapi melawan selembar kertas kosong dengan satu coretan](/images/ilustrasi-dokumen-prd-vs-dokumen-kosong.webp)

Dari rentetan tragedi di atas, kita bisa memetik satu kesimpulan penting: perbedaan utama antara kuli ketik dan insinyur terletak pada cara mereka meracik perintah (_Prompting_).

**Prompt Vibe Coding (Amatir):**
Biasanya hanya berupa kalimat pendek yang tidak memiliki konteks atau batasan sistem.

> _"Buatkan saya aplikasi LMS seperti Ruangguru pakai React."_
> _(Hasilnya: Kode berantakan, logika saling tabrak, dan gagal saat di-hosting)._

**Prompt Vibe Engineering (Profesional):**
Tidak ada _prompt_ satu baris yang ajaib. Seorang insinyur akan menyiapkan dokumen teknis (_Product Requirements Document_ / PRD) terlebih dahulu ke dalam kolom _chat_ AI.

> _"Saya melampirkan dokumen PRD, kerangka sistem (fitur, UI, arsitektur), dan skenario pengujian. Tugas pertama Anda: Bangun komponen UI Header dan Sidebar menggunakan React JS dengan mock-data, tanpa menyentuh integrasi API/Database terlebih dahulu. Pastikan komponen modular dan mudah dibaca."_

## Kesimpulan

Banyak pihak di media sosial yang menjual ilusi bahwa aplikasi keren bisa diciptakan hanya dengan satu kali klik. Realitanya, penulisan kode murni oleh AI tanpa perencanaan (_vibe coding_) hanya akan menghasilkan "sampah digital" yang penuh _bug_, boros memori, dan tidak dapat dikembangkan di masa depan.

Jika Anda ingin bertahan dan relevan di industri ini, jadilah seorang perancang sistem. Susun rencana liburan aplikasi Anda, periksa kerangka kerjanya, bangun antarmukanya secara bertahap, dan audit setiap kode yang disodorkan oleh AI. Kecerdasan buatan itu luar biasa, tetapi pastikan kitalah yang memegang kendali logikanya!
