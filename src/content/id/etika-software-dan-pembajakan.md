---
title: "Dari Pembajak Menjadi Pengembang: Memahami Harga Sebuah Karya dan Kode Etik Software"
description: "Sebuah refleksi perjalanan meninggalkan doktrin sesat pembajakan perangkat lunak, migrasi ke Open Source, hingga memahami dilema monetisasi sebagai indie developer."
pubDate: 2026-10-06T10:00:00Z
coverImage: "/images/etika-software-dan-pembajakan.webp"
tags: ["jurnal", "opini", "open-source", "indie-developer", "mindset"]
isDraft: false
---

Menjadi seorang _software engineer_ tidak hanya merombak cara saya berpikir secara logis, tetapi juga menghancurkan paradigma lama saya tentang hak kekayaan intelektual.

Dulu, sebagai mahasiswa dengan kondisi ekonomi menengah ke bawah, menggunakan perangkat lunak bajakan adalah hal yang lumrah. Dari sistem operasi hingga aplikasi penunjang tugas kuliah di laptop Dell Latitude E5450 lama saya, semuanya hasil _crack_. Saat itu, saya merasa "berhak" membajak karena keterbatasan finansial, tanpa menyadari dampak etis dari tindakan tersebut.

## Doktrin Sesat dan Pelarian ke Linux

Pembenaran saya atas pembajakan dulu diperparah oleh doktrin seorang guru IT di masa SMA. Beliau adalah sosok yang jenius namun arogan. Salah satu doktrinnya yang paling menyesatkan adalah, _"Hak cipta itu tidak ada, karena semua ilmu dan karya pada dasarnya berasal dari Tuhan."_

Pernyataan absurd itu membodohi saya selama bertahun-tahun. Titik balik pertama terjadi bukan karena kesadaran moral, melainkan karena frustrasi teknis. Sistem operasi Windows saat itu terasa sangat berat, berantakan, dan tidak optimal untuk laptop tua. Saya akhirnya memutuskan bermigrasi ke Linux.

Di ekosistem Linux inilah mata saya terbuka. Saya mulai berinteraksi dengan _Open Source Software_ (OSS), membaca dokumentasi, dan membedah ratusan ribu baris kode milik orang lain yang dibagikan secara bebas.

Saat mencoba membuat aplikasi Android pertama saya—sebuah [MP3 Player sederhana yang dimodifikasi dari _source code_ publik](https://github.com/herdianurdin/mp-simple-music-player-2021)—saya baru menyadari betapa rumit, melelahkan, dan memusingkannya membangun sebuah perangkat lunak. Dari sana, rasa hormat terhadap jerih payah _developer_ mulai tumbuh.

## Dialog Halal-Haram: Nasihat yang Mengubah Arah

Kesadaran teknis itu kemudian disempurnakan oleh sebuah tamparan moral dari salah satu dosen saya. Beliau menceritakan pengalaman masa lalunya saat masih aktif bekerja sebagai desainer grafis menggunakan Photoshop dan CorelDraw bajakan.

Usahanya sangat lancar dan menghasilkan pundi-pundi rupiah yang menghidupi keluarganya. Namun, ada harga tak kasat mata yang harus dibayar: perasaannya selalu hampa, keluarganya tidak tenang, dan anak-anaknya sering sakit-sakitan. Setelah melakukan introspeksi, beliau menyadari bahwa alat yang digunakan untuk mencari nafkah—_software_ bajakan—adalah hasil curian. Harta yang dihasilkan darinya menjadi tidak berkah (haram).

Sejak hari itu, dosen saya beralih menggunakan perangkat lunak _open-source_ gratis seperti **Krita**, **GIMP**, dan **Inkscape** untuk desainnya, lalu perlahan membeli lisensi resmi saat keuangannya membaik.

> **Prinsip Baru:** Jika Anda tidak mampu membeli perangkat lunak berbayar, gunakan alternatif _Open Source_. Membajak karya orang lain untuk mencari keuntungan pribadi adalah pencurian, terlepas dari apa pun pembenarannya.

## Realitas Saat Ini: Harga Software Menyetarai Hardware

Berbekal kesadaran tersebut, saya berkomitmen untuk "berhijrah". Saat mulai memiliki penghasilan dari mengajar di sekolah menengah kejuruan dan pengembangan aplikasi, saya menyisihkan uang secara disiplin untuk membeli lisensi _software_.

Hari ini, seluruh ekosistem di laptop dan ponsel saya 100% orisinal. Mulai dari menunjang produktivitas dengan **Microsoft Office 2024 Student & Home** dan **PDF Element**, melakukan _editing_ video dengan **Filmora 14**, hingga koleksi _game_ yang saya beli secara legal di **Steam**. Belum lagi deretan aplikasi dan _game_ premium yang saya beli khusus untuk ponsel.

Jika saya hitung kembali dan bandingkan dengan aset perangkat keras (_hardware_), ada sebuah realitas finansial yang cukup menarik:

| Komponen                    | Spesifikasi / Keterangan                                | Estimasi Nilai (Rp)              |
| :-------------------------- | :------------------------------------------------------ | :------------------------------- |
| **Hardware (Laptop)**       | Dell Latitude 5300 (Core i5 Gen 8, RAM 16GB, SSD 256GB) | 2.999.000                        |
| **OS Windows 11**           | Lisensi Orisinal (OEM) bawaan perangkat                 | Termasuk dalam laptop            |
| **Lisensi Software & Game** | Office 2024, Filmora 14, PDF Element, Steam, App Ponsel | **Hampir menyentuh Rp3.000.000** |

Meskipun total nilai _software_ yang saya beli hampir menyentuh harga fisik laptopnya sendiri, ekspektasi bahwa "software orisinal pasti jauh lebih cepat dari bajakan" ternyata tidak sepenuhnya benar. Secara performa komputasi, perbedaannya nyaris tidak ada. Namun, ada satu hal yang tidak bisa diretas: **ketenangan pikiran dan kebanggaan.**

## Sisi Lain dari Sang Pengembang (Indie Dev)

Sebagai _developer_ yang aplikasinya digunakan oleh banyak orang di Play Store, saya sangat memahami pentingnya apresiasi pengguna. Saya juga yakin bahwa jika saya menghargai karya orang lain, karya saya kelak akan dihargai.

Jika tujuan murni saya hanya untuk amal, saya tidak akan memasang iklan. Namun realitanya, kondisi finansial dan gaji sebagai guru honorer memiliki batasan. _Revenue_ dari iklan (AdMob) adalah penyambung napas bagi operasional saya.

Saya sangat menyadari keluhan pengguna terkait aplikasi yang terkadang melambat. Dari penelusuran _log stack trace_ di konsol, saya tahu persis bahwa sebagian besar masalah **ANR (Application Not Responding)** justru disebabkan oleh antrean muat iklan (_ad load_) yang memblokir _UI Thread_.

Lalu, mengapa saya tidak membuat aplikasi versi berbayar (_Premium/Pay-Once_) tanpa iklan?

1. **Aksesibilitas:** Saya ingin aplikasi saya (seperti simulasi ujian dan edukasi) tetap bisa diakses secara gratis oleh siapa saja, terutama mereka yang senasib dengan saya di masa lalu.
2. **Birokrasi:** Mengelola aplikasi berbayar membutuhkan legalitas dokumen yang rumit, serta menghindari sorotan administratif yang saat ini belum siap saya hadapi sendirian.

Menghargai jerih payah _developer_ adalah langkah awal menjadi bagian dari ekosistem teknologi yang sehat. Pengembang juga manusia yang butuh makan. Jika Anda belum mampu membeli karya mereka, gunakanlah _software_ alternatif. Jangan merampas hak mereka dengan melakukan pembajakan, karena bisa jadi, di dalam harta yang Anda dapatkan, terdapat hak mereka yang seharusnya Anda sisihkan.
