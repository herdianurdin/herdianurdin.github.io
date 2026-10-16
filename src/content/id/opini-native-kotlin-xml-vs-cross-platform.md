---
title: "Mengapa Saya Bertahan dengan Native Kotlin (XML): Realita Developer Spesifikasi Menengah"
description: "Di tengah tren Flutter dan Jetpack Compose, ini alasan pragmatis mengapa arsitektur Native Kotlin & XML tetap menjadi raja untuk laptop berspesifikasi terbatas."
pubDate: 2026-10-16T10:00:00+07:00
coverImage: "/images/opini-native-kotlin-xml-vs-cross-platform.webp"
enSlug: "why-i-stick-with-native-kotlin-xml"
tags:
  [
    "android-developer",
    "kotlin-android",
    "jetpack-compose",
    "flutter-vs-react-native",
    "opini-teknis",
  ]
isDraft: false
---

Coba buka LinkedIn atau grup komunitas _programmer_ hari ini. Anda pasti akan dihujani oleh narasi seperti: _"Flutter adalah masa depan!"_, _"React Native memangkas waktu development!"_, atau _"Segera tinggalkan XML dan beralihlah ke Jetpack Compose!"_

Narasi tersebut sering kali memicu rasa FOMO (_Fear Of Missing Out_) yang parah bagi _developer_ pemula. Namun, mari kita singkirkan sejenak ego teknologi tersebut dan menatap satu realita yang paling sering diabaikan oleh para _tech influencer_: **Spesifikasi perangkat keras (hardware) yang kita miliki.**

Sebagai seorang _Solo Android Developer_ yang juga berprofesi sebagai guru, saya tidak memiliki kemewahan untuk menggunakan Macbook Pro M-Series terbaru. Mesin tempur saya adalah laptop kelas pekerja dengan spesifikasi menengah.

Di artikel ini, saya ingin membagikan opini teknis mengapa saya—setelah berkelana mencoba berbagai _framework_ modern—memilih pulang dan bertahan pada arsitektur klasik **Native Kotlin dan XML**.

## Ilusi Cross-Platform: Dependency Hell dan Ukuran APK

![Ilustrasi programmer frustrasi menghadapi error dependency package yang usang pada framework cross-platform](/images/ilustrasi-dependency-hell.webp)

Jauh sebelum saya mendalami bahasa pemrograman Kotlin, cinta pertama saya jatuh pada **[React Native](https://reactnative.dev/)** dan **[Flutter](https://flutter.dev/)**. Janjinya amat manis: tulis kode satu kali, aplikasi bisa berjalan mulus di Android dan iOS.

Namun, masa itu berakhir cepat saat saya berbenturan dengan realita teknis di lapangan:

1. **Tragedi _Dependency Hell_:** Di ekosistem React Native, kemudahan JavaScript dibayar mahal dengan ukuran folder `node_modules` yang rakus memori. Setiap kali saya ingin melakukan pemeliharaan aplikasi (_maintenance_) setelah beberapa bulan, selalu ada _library_ pihak ketiga yang usang (_deprecated_) atau memicu _error_ fatal karena bentrok versi.
2. **Ukuran Aplikasi (APK size) yang Membengkak:** Flutter memang jauh lebih stabil secara performa dibandingkan React Native. Sayangnya, ukuran APK yang dihasilkan sangat bengkak. Aplikasi sederhana yang seharusnya hanya 3 MB bisa melonjak menjadi 20 MB lebih karena Flutter harus menyertakan _engine rendering_ C++ miliknya sendiri.

Bagi target pasar saya di Indonesia, ukuran _file_ yang besar adalah alasan utama pengguna melakukan _uninstall_. Seperti yang pernah saya singgung dalam **[Bongkar Realita Pendapatan AdMob Indonesia](/blog/realita-pendapatan-admob-indonesia-2026)**, mempertahankan _User Experience (UX)_ dan kestabilan aplikasi adalah kunci utama jika Anda ingin bertahan lama di industri ini.

## Patah Hati dengan Jetpack Compose

Jika _framework_ lintas platform bukan jawabannya, bukankah Google sudah merilis **[Jetpack Compose](https://developer.android.com/compose)** untuk ekosistem Native? Ya, benar. Compose adalah UI _toolkit_ modern yang deklaratif, bersih, dan cepat ditulis.

Sayangnya, "masa depan" itu ternyata belum siap untuk spesifikasi laptop saya.

Saat mengikuti pelatihan Android pada 2022, saya menggunakan laptop **Dell Latitude E5450 (Intel Core i5 Gen 5, RAM 16GB, SSD 256GB)**. Saat mencoba fitur `@Preview` di Jetpack Compose, kipas laptop saya langsung menyala seperti mesin jet, _Android Studio_ seketika membeku (_hang_), dan waktu _rendering_-nya sangat menyiksa.

Maju ke tahun 2024, saya telah melakukan _upgrade_ ke **Dell Latitude 5300 (Intel Core i5 Gen 8, Windows 11)**. Saya kembali menantang Compose. Hasilnya? Proses _rendering preview_ saat mengetik kode masih terlalu lamban. Ritme kerja saya hancur karena lebih banyak waktu terbuang untuk menunggu _loading bar Build_ selesai dibandingkan menulis logika kode.

Jetpack Compose adalah teknologi brilian, tetapi memaksakan diri menggunakannya di mesin yang terbatas hanya akan membunuh produktivitas _coding_ Anda.

## Keunggulan Native Kotlin + XML untuk Spesifikasi Terbatas

![Ilustrasi aplikasi Android Native offline-first berukuran sangat kecil di bawah 10 MB dan stabil digunakan](/images/ilustrasi-offline-first-app.webp)

Akhirnya, saya kembali ke pangkuan kombinasi klasik: Native Kotlin dan XML. Ini bukanlah sebuah kemunduran, melainkan keputusan paling pragmatis. Berikut adalah tiga keunggulan tak terbantahkan dari arsitektur ini:

### 1. Rendering UI Instan dan Bebas Hang

Menulis _layout_ UI menggunakan XML di Android Studio ibarat bernapas lega. Fitur _Design Preview_ XML bekerja sangat ringan dan instan tanpa membebani CPU. Meskipun XML memiliki batasan struktur yang kaku, batasan ini justru memaksa kita untuk lebih disiplin dalam mendesain hierarki komponen—sebuah prinsip yang sejalan dengan **[Teori Dasar UI/UX Designer](/blog/apa-itu-ui-ux-designer-wireframe-mockup)** yang ideal.

### 2. Diet Ketat APK (Di Bawah 10 MB)

Karena aplikasi Native Kotlin murni bertumpu pada komponen bawaan sistem operasi Android, hasil kompilasinya sangatlah ramping. Sebagai bukti, aplikasi **[Asmaul Husna Arti dan Makna](https://play.google.com/store/apps/details?id=audio_dakwah.asmaul_husna_99.audio_belajar_asmaul_husna)** yang saya kembangkan sendirian dengan arsitektur ini memiliki _output_ APK **di bawah 10 MB**. Aplikasi ultra-ringan ini sukses menembus 50.000+ unduhan tanpa keluhan memori penuh dari pengguna.

### 3. Ekosistem "Offline-First" yang Tahan Banting

Fokus utama saya sering kali membangun arsitektur _offline-first_ (aplikasi yang berjalan penuh tanpa internet). Di ekosistem _cross-platform_, _library database_ lokal sering kali dikelola oleh pihak ketiga dan rawan ditinggalkan pembuatnya (_abandoned_).

Di ekosistem Native Android, saya menggunakan **[Room Database](https://developer.android.com/training/data-storage/room)**. Ini adalah _library_ resmi langsung dari Google. Ia dijamin selalu kompatibel dengan OS Android versi terbaru. Merawat aplikasi dalam siklus 3 hingga 5 tahun ke depan terasa jauh lebih aman secara teknis.

## Kesimpulan: Jangan Menjadi Korban FOMO

Jika Anda memiliki PC _gaming_ dengan spesifikasi dewa atau seri Macbook terbaru, silakan melesat ke masa depan bersama Jetpack Compose, Flutter, atau React Native.

Namun, jika Anda adalah _developer_ yang sedang merintis dengan spesifikasi mesin terbatas, jangan biarkan gengsi dan FOMO menghalangi produktivitas Anda. Pengguna di Play Store tidak akan pernah membedah kode Anda untuk melihat apakah Anda menggunakan Compose atau XML. Mereka hanya peduli: **Apakah aplikasinya ringan, tidak _crash_, dan memecahkan masalah mereka?**

Bertahanlah dengan Native Kotlin dan XML. Rilis karya Anda, rawat penggunanya, dan kelak saat _hardware_ Anda sudah mumpuni, barulah kita sama-sama melangkah ke teknologi selanjutnya. _Keep it simple, keep coding!_
