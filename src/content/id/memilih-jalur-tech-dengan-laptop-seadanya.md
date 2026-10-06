---
title: "Quarter-Life Crisis di Ruang BEM: Memilih Jalur Tech dengan Laptop Seadanya"
description: "Kisah nyata dari semester 7: kepanikan pra-kelulusan, tragedi laptop Celeron, janji manis Kampus Merdeka, dan realita memilih bidang Web, Mobile, Game, atau AI."
pubDate: 2026-10-07T16:00:00+07:00
coverImage: "/images/quarter-life-crisis-tech-path.webp"
tags: ["jurnal", "software-engineer", "kampus-merdeka", "mindset", "kehidupan"]
isDraft: false
---

Di tahun 2022, saat kami menginjak semester 7, sebuah diskusi krisis eksistensial meledak di ruang sekretariat BEM Fakultas Teknik. Di luar ruangan, suara tawa mahasiswa lain yang sedang asyik "mabar" menggema di lorong kampus tanpa beban. Namun di dalam ruangan itu, saya dan dua orang teman dihadapkan pada realitas yang menakutkan: status mahasiswa kami akan segera _expired_, modal kuliah yang keluar sudah sangat banyak, namun _skill_ kami untuk menghadapi dunia industri masih nol besar.

Saat itu, saya masih seorang generalis—bisa sedikit-sedikit tentang banyak hal, namun tidak menguasai apa pun. Diskusi kami berpusat pada satu pertanyaan krusial: _"Untuk mengejar Usulan Penelitian (UP) dan persiapan kerja nanti, kita harus fokus ke bidang software engineering yang mana?"_

## Janji Manis Kampus Merdeka dan Realita Hardware

Sebelum membedah ranah teknologi, kami sempat merencanakan pelarian melalui program Kampus Merdeka. Ekspektasi kami saat itu sangat tinggi: mendapat ilmu industri, menghindari kelas kampus yang monoton, dan tentunya, mendapat suntikan uang saku untuk bertahan hidup.

Kenyataannya menghantam kami dengan keras. Kementerian mengubah kebijakan untuk _batch_ 3 di angkatan kami; uang saku ditiadakan. Lebih parah lagi, pihak kampus mengingkari janjinya terkait konversi SKS, sehingga kami tetap dipaksa mengikuti kelas reguler di tengah padatnya jadwal KKN, usulan penelitian, dan tugas proyek Kampus Merdeka. Teman saya yang jago desain akhirnya membatalkan keikutsertaannya. Saya dan satu teman lain memilih nekat lanjut.

Di tengah keputusasaan itu, kami membedah spesifikasi laptop yang kami miliki untuk menentukan bidang apa yang sanggup kami garap. Kami tertawa miris. Di antara kami, laptop saya—sebuah Dell Latitude E5450 (Core i5 Gen 5, RAM 16GB, SSD 256GB)—adalah kasta tertinggi. Teman-teman saya harus bertempur menggunakan laptop prosesor Celeron lama dengan RAM yang hanya 4 hingga 8 GB.

## Membedah 4 Pilar Teknologi (Berdasarkan Spesifikasi Pas-Pasan)

Dengan modal perangkat seadanya, saya mulai menjabarkan realita dari keempat bidang utama dalam pengembangan perangkat lunak kepada mereka:

### 1. Web Development: Kanvas Luas Penyelamat Celeron

Saya menjelaskan bahwa bidang web saat ini sangat amat luas. Bukan sekadar web statis untuk desktop, tapi dengan teknologi _Progressive Web Apps_ (PWA) dan _Single Page Applications_ (SPA), web bisa berfungsi layaknya aplikasi _mobile native_, bahkan bisa digunakan untuk membuat _game_.

- **Pondasi Dasar:** HTML, CSS, dan JavaScript murni (manipulasi DOM, bukan sekadar algoritma dasar).
- **Ekosistem:** Di _frontend_, Anda akan bertemu Node.js, TypeScript, dan _framework_ raksasa seperti React.js atau Next.js. Di _backend_, bahasanya lebih bervariasi.
- **Realita Hardware:** Ini adalah bidang paling aman untuk laptop Celeron. Anda hanya butuh _code editor_ dan _browser_.
- **Tantangan:** Karena ekosistem dan peluang kerjanya teramat sangat luas, jika tidak ada pengarahan, Anda bisa hilang arah di tengah jalan.

### 2. Mobile Development: Perang Arsitektur

Hanya ada dua pemain utama: Android dan iOS. Jika tidak punya MacBook, lupakan pengembangan iOS kecuali Anda mau mengambil risiko ilegal membuat _Hackintosh_. Untuk Android, ada dua jalur:

- **Native (Android Studio/Kotlin):** Dikhususkan untuk OS tersebut. Hasil aplikasinya sangat cepat dan optimal, tapi _coding_-nya sulit dan **sangat berat**. Laptop Celeron teman saya terbukti gagal total saat mencoba menginstal dan membuka Android Studio.
- **Cross-Platform (Flutter):** Bisa dijalankan di banyak platform sekaligus. _Coding_-nya jauh lebih mudah, apalagi ada fitur _Hot Reload_ (kode diubah, UI langsung berubah tanpa perlu _compile_ ulang dari nol). Performanya sedikit lebih lambat dari Native, tapi ini adalah penyelamat bagi _hardware_ spesifikasi menengah. Teman saya akhirnya terpaksa beralih ke Flutter.

### 3. Game Development: Jebakan Fisika dan Blue Screen

Teman saya yang menyukai desain karakter awalnya merasa ini adalah jalurnya. Kenyataannya, _game development_ menuntut keahlian logika matematika tingkat tinggi, pemahaman fisika simulasi, hingga kalkulasi perpindahan koordinat matriks.

- **Tantangan Ekosistem:** Waktu _development_ sangat lama karena harus memikirkan cerita, karakter, dan aset visual.
- **Tragedi Hardware:** Teman saya memaksakan diri menginstal _game engine_ Unity bajakan. Hasilnya bisa ditebak: laptopnya mengalami _freeze_ dan _blue screen_. Ia sempat mencoba Godot yang lebih ringan, namun akhirnya menyerah dan beralih membuat web jualan desain untuk tugas akhirnya (meski sekadar purwarupa penelitian).

### 4. Machine Learning & AI: Ranah Kaum Puris

Bagi yang membenci Matematika dan tidak bisa Bahasa Inggris, saya sarankan jangan sentuh bidang ini.
Di sini Anda dituntut untuk menganalisis dan mengolah _dataset_ raksasa, serta melatih model AI (_data training_). Semuanya murni bergantung pada kalkulus dan statistika, dengan literatur yang wajib berbahasa Inggris. Nantinya, model AI ini pun tetap membutuhkan tim Web atau Mobile agar bisa diimplementasikan ke dalam antarmuka yang bisa digunakan pengguna.

## Beban Moral, Ekonomi, dan Realitas Pasca-Kelulusan

Laptop yang _freeze_ saat melakukan _build_ dan menatap layar penuh _error_ merah selama sebulan penuh menjadi makanan sehari-hari. Demi memperpanjang napas laptop-laptop tua itu, kami semua akhirnya bermigrasi total ke sistem operasi Linux.

Namun, tekanan terberat bukanlah pada _error_ baris kode, melainkan beban sosial-ekonomi. Teman saya menunggak SPP hingga 2-3 semester dan nyaris putus kuliah, namun keluarganya mendesak agar ia tetap menyelesaikannya. Saya sendiri beruntung SPP lunas, namun saya menjalani hari-hari tanpa uang jajan sama sekali. Kami adalah anak-anak dari keluarga menengah ke bawah. Di masa itulah, alasan terkuat saya membangun akun Play Console muncul: saya butuh jalan keluar.

Ekspektasi keluarga kami sangat tinggi. Mereka membayangkan gelar sarjana di tahun 2023 adalah tiket instan menuju pekerjaan bergaji besar. Realitanya? Kami semua menganggur selama hampir tiga bulan pertama.

Bukan karena tidak ada tawaran kerja, tapi kami tidak memiliki modal sepeser pun untuk merantau. Selama 2,5 tahun masa pandemi, _networking_ kami terkunci hanya di lingkaran teman kampus yang itu-itu saja. Kami tidak punya kenalan di industri, dan kalah telak dalam persaingan. Teman saya akhirnya disuruh pulang kampung. Kami menerima pekerjaan apa saja, termasuk menjadi guru honorer di Sekolah Dasar dengan gaji yang tidak menutup biaya operasional harian. Masa-masa itu adalah fase depresi dan frustrasi yang sangat pekat.

## Ke Mana Kami Sekarang?

Tiga tahun setelah diskusi di ruang BEM itu, jalan kami sepenuhnya terpisah.

Teman desainer saya akhirnya meninggalkan _coding_ dan kembali fokus 100% di bidang desain. Teman yang lain, karena kesibukannya sebagai guru honorer, perlahan meninggalkan mimpinya di dunia _software engineering_.

Saya sendiri? Terjebak dalam ironi. Tuntutan administrasi sebagai guru dan operator di sekolah kecil memaksa saya menjadi pasif. Selama hampir tiga tahun terakhir, saya hanya melakukan _maintenance_ pada aplikasi-aplikasi saya di Play Store. Namun, [aplikasi-aplikasi itulah satu-satunya artefak digital yang saya pertahankan](https://play.google.com/store/search?q=pub%3AHerdi%20Herdianurdin&c=apps) sebagai bentuk tanggung jawab atas keilmuan yang pernah saya pelajari.

Ada kerinduan yang besar untuk kembali menulis kode secara aktif. Keterbatasan _hardware_ yang menua dan _skill_ yang mulai tumpul memang menjadi kendala, tetapi rencananya, di bulan November 2026 ini saya akan kembali membuka dokumentasi dan mulai belajar lagi. Semoga kali ini, keadaan berpihak pada saya.
