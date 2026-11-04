---
title: "Materi Dasar Komputer: Fungsi Motherboard, CPU, RAM, SSD, dan PSU"
description: "Membedah anatomi perangkat keras komputer. Pahami fungsi motherboard, CPU, perbedaan RAM dan SSD, komparasi kecepatan PCIe, hingga peran vital PSU dan Wattage."
pubDate: 2026-11-05T08:00:00+07:00
coverImage: "/images/komponen-inti-komputer-motherboard-cpu-ram-ssd-psu.webp"
tags: ["dasar-komputer", "hardware", "komponen-komputer", "smk-rpl", "smk-tkj"]
isDraft: false
---

Pada **[materi sebelumnya](/blog/cara-kerja-komputer-siklus-input-proses-output)**, kita sudah sepakat bahwa wujud fisik (raga) komputer membutuhkan _software_ dan instruksi dari _brainware_ agar siklus kerjanya bisa berjalan. Kini, saatnya kita membuka pelindung _casing_ PC dan melihat langsung apa saja "organ dalam" yang menggerakkan mesin tersebut.

Sebagai pemula, mengetahui cara menekan tombol _power_ saja tidaklah cukup. Kamu harus memahami fungsi spesifik dari setiap keping elektronik yang tertanam di dalamnya, agar kelak bisa melakukan perbaikan atau perakitan secara mandiri.

Di Modul 2B ini, kita akan membedah anatomi komponen yang paling krusial: _Motherboard_ sebagai tulang punggung, CPU sebagai otak, PSU sebagai jantung kelistrikan, serta memahami teknologi daya ingat komputer melalui RAM dan media penyimpanan modern (_Storage_).

## 1. Tulang Punggung dan Sang Otak (Motherboard & CPU)

Jika komputer dibongkar, hal pertama yang paling menyita ruang adalah sebuah papan sirkuit raksasa yang menempel di dasar _casing_. Papan ini disebut **[Motherboard](https://id.wikipedia.org/wiki/Papan_induk)** (Papan Induk).

Fungsi utama _motherboard_ adalah sebagai tulang punggung atau "jalan tol" infrastruktur data. Papan ini mengoordinasikan lalu lintas komunikasi dari semua komponen keras lainnya. Di atasnya terdapat berbagai macam slot dan soket, mulai dari slot penempatan RAM, jalur khusus kartu grafis (PCIe), hingga lubang _port_ USB yang biasa kamu gunakan di bagian belakang komputer.

Di tengah-tengah _motherboard_ tersebut, tertancap sebuah cip berbentuk persegi kecil yang disebut **CPU (Central Processing Unit)**. Jika _motherboard_ adalah tulang punggungnya, maka CPU adalah otaknya.

CPU bertugas mengeksekusi semua instruksi dari _software_, melakukan perhitungan matematika supercepat, dan mendikte alur kerja mesin. Karena beroperasi dengan kecepatan tinggi, CPU menghasilkan suhu panas yang ekstrem. Oleh sebab itu, ia selalu diolesi oleh pasta termal (_thermal paste_), lalu ditutup dengan **heatsink** (bongkahan logam bersirip khusus untuk menyerap panas), dan diakhiri dengan **cooling fan** (kipas pendingin) di bagian teratas agar suhunya tetap terjaga dan tidak meleleh.

## 2. Analogi Tipe Orang: Perbedaan RAM dan Penyimpanan

![Ilustrasi dua karakter. Satu karakter berlari sangat cepat namun kehilangan kertas dari tangannya untuk melambangkan RAM, sedangkan karakter lain berjalan santai membawa brankas besi untuk melambangkan Storage](/images/perbedaan-ram-ssd-analogi-memori.webp)

Banyak siswa baru yang kebingungan mengapa komputer membutuhkan dua jenis memori sekaligus: RAM (_Random Access Memory_) dan Penyimpanan Utama (HDD/SSD). Untuk membedakan karakteristik keduanya, saya sering mengibaratkannya dengan sifat ingatan manusia:

1.  **Tipe "Langsung ingat, tapi mudah lupa" (Ini adalah RAM):**
    RAM bekerja dengan kecepatan kilat. Ia bertugas menampung data aplikasi yang _sedang berjalan_ saat ini. Namun, sifatnya sementara (_volatile_). Begitu aliran listrik komputer dimatikan, semua ingatan di dalam keping RAM akan hilang terhapus tanpa sisa.
2.  **Tipe "Susah ingat, dan tidak lupa" (Ini adalah HDD Klasik):**
    _Hard Disk Drive_ (HDD) lawas masih menggunakan piringan cakram magnetik mekanis yang berputar. Ia butuh waktu lambat untuk memuat data (susah ingat). Tapi kehebatannya, data yang disimpan di sini bersifat permanen. Walau kabel listrik dicabut, datamu tetap aman.
3.  **Tipe "Langsung ingat, dan tidak lupa" (Ini adalah SSD):**
    _Solid State Drive_ (SSD) adalah teknologi memori generasi modern. Ia menggabungkan kecepatan kilat dengan daya ingat permanen, menjadikannya standar wajib untuk perakitan komputer masa kini.

### Mengapa Kapasitas RAM Itu Penting?

Dalam ujian kejuruan, sering muncul pertanyaan esai: _"**Jelaskan hubungan antara kapasitas RAM dengan performa komputer**"_.

Untuk menjawabnya, gunakan logika "Meja Kerja". Anggap RAM adalah meja belajarmu, sedangkan HDD/SSD adalah lemari arsip di sudut ruangan. Jika mejamu berukuran kecil (RAM 4GB), kamu hanya bisa menaruh satu buku. Jika ingin membuka buku lain, kamu harus merapikan meja, berjalan ke lemari, dan mengambil buku baru (proses pemindahan ini membuat komputer terasa _lag_ atau macet).

Kesimpulannya: Kapasitas RAM yang besar memastikan CPU memiliki ruang yang luas untuk menaruh banyak aplikasi secara bersamaan (_multitasking_). Dengan begitu, CPU tidak perlu membuang waktu mengantre untuk mengambil data dari lemari penyimpanan (SSD).

## 3. Komparasi Storage: Mengapa SSD Lebih Cepat dari HDD?

![Ilustrasi perbandingan visual antara bentuk SSD SATA yang berupa kotak pipih lebar di sebelah kiri, dan kepingan cip SSD NVMe M2 yang mungil serta tanpa kabel di sebelah kanan](/images/perbedaan-ssd-sata-dan-nvme.webp)

Banyak pengguna awam bertanya, mengapa SSD terasa lebih kencang? Jawabannya terletak pada arsitektur fisiknya. HDD mencari data secara mekanik dengan memutar piringan logam, sedangkan SSD membaca data secara elektrik melalui cip memori _flash_ (NAND), persis seperti _flashdisk_ namun berkapasitas raksasa. Ketiadaan komponen mekanik yang berputar ini membuat waktu respons SSD menjadi nyaris instan.

Di pasaran, terdapat dua jenis antarmuka SSD yang mendominasi. Mengetahui **perbedaan SSD SATA dan SSD NVMe** adalah ilmu wajib bagi seorang teknisi:

- **SSD SATA:** Bentuk fisiknya menyerupai kotak pipih dan dihubungkan ke _motherboard_ menggunakan kabel data (SATA). Kecepatannya dibatasi oleh kemampuan maksimal kabel tersebut (sekitar 550 MB/s).
- **SSD NVMe (M.2):** Bentuk fisiknya sekecil kepingan permen karet dan langsung ditancapkan ke atas _motherboard_ tanpa kabel. Ia menggunakan jalur data khusus berkecepatan tinggi yang disebut PCIe (_Peripheral Component Interconnect Express_).

Kecepatan SSD NVMe sangat bergantung pada generasi PCIe dan jumlah jalurnya (_lanes_). Anggaplah generasi PCIe sebagai "batas maksimal kecepatan jalan tol", dan _lanes_ (seperti x4) adalah "jumlah lajur mobilnya".

Berikut adalah tabel komparasi kecepatan baca maksimal dari berbagai media penyimpanan:

| Komponen Penyimpanan | Teknologi Dasar | Kecepatan Baca Maksimal | Jalur Antarmuka    |
| :------------------- | :-------------- | :---------------------- | :----------------- |
| **HDD 7200 RPM**     | Cakram Magnetik | ~160 MB/s               | Kabel SATA         |
| **SSD SATA III**     | Flash Memory    | ~550 MB/s               | Kabel SATA         |
| **SSD NVMe Gen 3**   | Flash Memory    | ~3.500 MB/s             | Slot PCIe 3.0 (x4) |
| **SSD NVMe Gen 4**   | Flash Memory    | ~7.500 MB/s             | Slot PCIe 4.0 (x4) |
| **SSD NVMe Gen 5**   | Flash Memory    | ~14.000 MB/s            | Slot PCIe 5.0 (x4) |

Tabel di atas memperlihatkan lonjakan performa yang luar biasa. Jika kamu memasang SSD NVMe Gen 4, komputer bisa membaca data hingga 46 kali lipat lebih cepat daripada HDD cakram biasa!

Bagi kamu yang mengambil fokus jurusan RPL, penggunaan **SSD untuk coding** adalah investasi perangkat keras yang tidak bisa ditawar. Saat kamu menjalankan program peramban besar atau me-_compile_ (menerjemahkan) **[ratusan baris kode algoritma](/blog/bab-1-mengenal-algoritma-dan-pola-pikir)**, CPU harus membaca ribuan _file_ berukuran kecil secara serentak. Menggunakan HDD lawas hanya akan membuang waktu produktifmu untuk menunggu proses _loading_.

## 4. Jantung Kelistrikan (PSU) dan Pentingnya Wattage

Komponen terakhir namun paling fatal jika diremehkan pemula adalah _Power Supply Unit_. Secara definitif, **fungsi dari power supply unit PSU dalam komputer adalah** untuk menyuplai dan memompa daya listrik ke seluruh perangkat keras.

Tegangan listrik dari tiang PLN yang masuk ke rumahmu adalah arus bolak-balik (AC) bertegangan sangat tinggi. Komponen komputer tidak sanggup menelan arus listrik sekasar itu. PSU bertugas sebagai "jantung" yang menerima listrik AC, lalu mengubah dan menyaringnya menjadi arus searah (DC) yang stabil, bersih, dan bertegangan rendah (12V, 5V, dan 3.3V). Setelah disaring, barulah listrik disalurkan ke _motherboard_ dan perangkat lain menggunakan kabel _power_.

**Perhatikan Kapasitas Daya (Wattage)**
Setiap PSU memiliki spesifikasi kapasitas daya maksimal atau _**Wattage**_ (misalnya 450W, 550W, 750W, hingga di atas 1000W). Memilih _wattage_ yang tepat sangatlah penting. Sebagai aturan dasar, PSU tidak boleh bekerja di kapasitas tertingginya terus-menerus. Jika total kebutuhan listrik seluruh komponen komputermu adalah 400W, maka kamu tidak boleh membeli PSU berukuran 400W. Kamu harus memberikan ruang napas (_headroom_) dengan membeli PSU minimal 550W atau 600W.

Membangun PC dengan prosesor tercanggih namun dipasangkan dengan PSU murahan tanpa sertifikasi yang kapasitas dayanya "palsu" adalah sebuah kesalahan fatal. Listrik DC yang dihasilkan tidak akan stabil. Akibatnya, komputer akan sering mati mendadak (_restart_) saat dibebani pekerjaan berat, atau yang paling mengerikan: terjadi korsleting yang menghanguskan seluruh komponen komputermu.

---

Kini kamu telah mengetahui raga utama komputermu: Tulang Punggung (Motherboard), Otak (CPU), Ingatan Sementara (RAM), Ingatan Permanen Cepat (SSD), dan Jantung Kelistrikan (PSU).

Di **Modul 3** selanjutnya, kita akan beralih ke sesi praktik. Kita akan mengenakan peralatan K3LH (Kesehatan dan Keselamatan Kerja) dan mempraktikkan langsung langkah demi langkah merakit semua kepingan ini menjadi satu sistem komputer yang utuh!
