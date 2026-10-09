---
title: "Fundamental Python Bab 8: Persimpangan Jalan (Gerbang Logika & Kondisi)"
description: "Program yang cerdas harus bisa mengambil keputusan sendiri. Pelajari operator relasi, tabel logika, dan aturan ketat spasi (indentasi) di Python."
pubDate: 2026-10-10T10:35:00+07:00
coverImage: "/images/bab-8-pengkondisian-if-else-python.webp"
tags:
  [
    "tutorial-python",
    "dasar-pemrograman",
    "if-else",
    "operator-logika",
    "pemula",
  ]
isDraft: false
---

Di **[Bab 7 sebelumnya](/blog/bab-7-operator-aritmatika-python)**, aplikasi kita telah berevolusi dari sekadar beo yang mengulang teks menjadi kalkulator yang mampu berhitung. Namun, kehidupan ini bukanlah sebuah jalan lurus yang hanya berisi hitung-hitungan matematis.

Kehidupan nyata dipenuhi dengan persimpangan dan pengambilan keputusan. _Jika_ hari ini Anda baru gajian, Anda memutuskan beli kopi mahal; _jika tidak_, Anda cukup minum air putih dari rumah. _Jika_ rencana A gagal, Anda harus mengevaluasi keadaan dan mengeksekusi rencana B.

Sebuah program yang hebat harus bisa mereplika cara kerja hidup manusia tersebut. Secara teori formal, inilah yang disebut dengan **Pengkondisian (Control Flow)**. Pengkondisian adalah sebuah mekanisme di mana program mampu mengevaluasi suatu syarat (menimbang apakah kondisinya Benar atau Salah), lalu secara otomatis memutuskan blok kode mana yang akan dijalankan berdasarkan hasil evaluasi tersebut.

Aplikasi tidak boleh berjalan buta menabrak tembok; ia harus bisa "berpikir".

## Doctor Strange dan Pencarian Realitas

![Ilustrasi Doctor Strange Infinity War](/images/ilustrasi-doctor-strange.webp)

Untuk memvisualisasikan bagaimana mekanisme "mengevaluasi syarat" ini bekerja, ingatlah momen epik dalam film _Avengers: Infinity War_. Saat itu, Doctor Strange menggunakan _Time Stone_ untuk menelusuri 14.000.605 kemungkinan masa depan dari pertarungan mereka melawan Thanos.

Apa yang dilakukan Doctor Strange pada dasarnya adalah mengeksekusi pengkondisian (evaluasi logika) secara ekstrem. Ia mengecek masa depan pertama: _Apakah kita menang? Salah (False)._ Ia mengecek yang kedua: _Apakah kita menang? Salah (False)._ Ia terus melakukan pengecekan berlapis (multi-kondisi) hingga akhirnya ia menemukan **satu** saja realitas yang bernilai _Benar (True)_.

Dalam pemrograman Python, kita akan membangun "mata batin" Doctor Strange tersebut agar aplikasi kita bisa menyeleksi kondisi mana yang _True_ dan mana yang _False_. Namun, sebelum membangunnya, ada satu hukum mutlak yang harus Anda patuhi.

## Tragedi Spasi: Latihan Kesabaran di Teks Editor

Dalam bahasa pemrograman terdahulu (seperti PHP, C++, atau Java), blok percabangan logika biasanya dibungkus menggunakan tanda kurung kurawal `{ }`. Selama kurungnya pas, mau kodenya diketik berantakan pun program akan tetap berjalan.

Python membuang tradisi kurung kurawal itu dan menggantinya dengan **Indentasi (Indentation)**, yaitu keharusan memberikan spasi atau _Tab_ yang menjorok ke dalam pada blok kode tertentu.

Saya punya pengalaman berharga tentang hal ini. Dulu, saya sengaja belajar _coding_ murni menggunakan teks editor bawaan sistem operasi Linux bernama _Xed_. Saya menolak menggunakan fitur _autocomplete_ (penyelesai otomatis). Masa transisi itu sangat memusingkan. Di Python, **kurang atau lebih satu spasi saja pada blok logika akan membuat seluruh program Anda _error_ total** (_IndentationError_).

Mengapa saya menyiksa diri? Karena pemrograman bukan sekadar menghafal sintaks, melainkan melatih **kesabaran, ketelitian, dan kemampuan _problem solving_**. Jika Anda terbiasa teliti mendeteksi satu spasi yang hilang, Anda akan tangguh menghadapi masalah (_bug_) sebesar apa pun di masa depan.

## 1. Operator Relasi (Membangun Timbangan)

Agar komputer bisa memutuskan apakah sebuah kondisi itu _True_ atau _False_, ia butuh "timbangan" untuk membandingkan dua buah nilai. Timbangan ini disebut **Operator Relasi**.

- `==` **(Sama dengan):** Digunakan untuk mengecek apakah nilai kiri dan kanan persis sama. (Hati-hati: Satu tanda `=` untuk memasukkan data ke variabel, sedangkan dua tanda `==` untuk membandingkan).
- \`!=\` **(Tidak sama dengan):** Kebalikan dari `==`. Akan bernilai _True_ jika kedua nilainya berbeda.
- `<` **(Lebih kecil dari)**
- `>` **(Lebih besar dari)**
- \`<=\` **(Lebih kecil ATAU sama dengan)**
- \`>=\` **(Lebih besar ATAU sama dengan)**

**Contoh Konkret Perbedaan `>` dan \`>=\` yang sering mengecoh:**
Bayangkan batas umur masuk bioskop adalah 17 tahun.

- Jika Anda menulis kode `umur > 17` (Lebih besar dari 17), maka anak yang umurnya **pas 17 tahun** tidak akan bisa masuk, karena hasilnya _False_. Mesin menuntut umur minimal 18.
- Jika Anda menulis **\`umur >= 17\`** (Lebih besar ATAU sama dengan 17), maka anak yang umurnya **pas 17 tahun** diizinkan masuk, karena 17 sama dengan 17 (_True_).

## 2. Operator Logika (Menggabungkan Banyak Syarat)

Sering kali, satu syarat saja tidak cukup. Bagaimana jika syarat masuk bioskop adalah: _Harus bawa tiket DAN berumur 17 tahun ke atas_? Untuk menggabungkan syarat-syarat ini, kita menggunakan **Operator Logika** (Gerbang Logika).

**A. Logika `and` (Si Perfeksionis)**
Logika `and` mengharuskan **SEMUA** syarat bernilai benar. Jika ada satu saja yang salah, maka seluruh keputusan dianggap salah.

| Syarat 1 (Bawa Tiket) | Syarat 2 (Umur \>= 17) | Hasil Akhir (`and`)    |
| :-------------------- | :--------------------- | :--------------------- |
| _True_ (Bawa)         | _True_ (Umur 18)       | **True (Boleh Masuk)** |
| _True_ (Bawa)         | _False_ (Umur 15)      | **False (Dilarang)**   |
| _False_ (Tidak)       | _True_ (Umur 20)       | **False (Dilarang)**   |
| _False_ (Tidak)       | _False_ (Umur 15)      | **False (Dilarang)**   |

**B. Logika `or` (Si Santai)**
Logika `or` sangat toleran. Asalkan ada **SALAH SATU** saja syarat yang terpenuhi (_True_), maka hasil akhirnya akan dianggap benar.

| Syarat 1 (Nilai MTK Bagus) | Syarat 2 (Nilai Fisika Bagus) | Hasil Akhir (`or`)      |
| :------------------------- | :---------------------------- | :---------------------- |
| _False_ (MTK Jelek)        | _True_ (Fisika Bagus)         | **True (Lulus Ujian)**  |
| _True_ (MTK Bagus)         | _False_ (Fisika Jelek)        | **True (Lulus Ujian)**  |
| _True_ (MTK Bagus)         | _True_ (Fisika Bagus)         | **True (Lulus Ujian)**  |
| _False_ (MTK Jelek)        | _False_ (Fisika Jelek)        | **False (Tidak Lulus)** |

**C. Logika `not` (Si Pemberontak)**
Tugasnya hanya satu: membalikkan realitas. Jika sebuah kondisi awalnya _True_, `not` akan merubahnya menjadi _False_, begitu pula sebaliknya.

---

## 3. Eksekusi Pengkondisian (If, Elif, Else)

![Ilustrasi Blok If Else Python](/images/ilustrasi-blok-if-else.webp)

Sekarang, mari kita terjemahkan logika di atas ke dalam struktur keputusan bahasa Python. Perhatikan baik-baik bagian yang menjorok ke dalam (Indentasi)!

### A. Satu Kondisi (`if`)

Ini adalah keputusan tunggal. Jika syarat terpenuhi (_True_), komputer akan mengeksekusi blok kode yang menjorok ke dalam. Jika tidak (_False_), komputer akan **mengabaikan total** blok tersebut dan tidak menampilkan apa-apa.

```python
uang = 20000

# Mengevaluasi: Apakah 20000 lebih besar sama dengan 25000? (False)
if uang >= 25000:
    # Kode di bawah ini DIABAIKAN dan tidak akan pernah dieksekusi mesin
    print("Saya beli kopi susu mahal!")

print("Program selesai berjalan.") # Hanya ini yang akan muncul di layar
```

### B. Dua Kondisi (`if - else`)

Keputusan bercabang dua. Jika kondisi `if` gagal (_False_), maka blok `else` (selain itu) akan menjadi tempat pelarian terakhir yang **pasti** dieksekusi oleh mesin.

```python
uang = 20000

# Evaluasi: False
if uang >= 25000:
    print("Saya beli kopi susu mahal!")
else:
    # Karena syarat 'if' di atas gagal, mesin secara otomatis melompat ke sini
    print("Uang tidak cukup, saya minum air putih saja dari rumah.")
```

### C. Multi-Kondisi (`if - elif - else`)

Inilah teknik penelusuran jutaan masa depan ala Doctor Strange. Mesin akan mengecek berurutan dari atas ke bawah. Begitu mesin menemukan **satu** kondisi yang _True_, ia akan menjalankan blok tersebut dan **mengabaikan semua sisa pengecekan di bawahnya**.

```python
nilai = 85

if nilai >= 90:      # Evaluasi 1: False (85 tidak lebih besar dari 90)
    print("Grade A")
elif nilai >= 80:    # Evaluasi 2: True! (85 lebih besar dari 80)
    print("Grade B") # Mesin mencetak ini, lalu langsung KELUAR dari blok logika
elif nilai >= 75:    # Pengecekan ini diabaikan / tidak akan dibaca mesin lagi
    print("Grade C")
else:                # Ini juga diabaikan
    print("Remedial")
```

---

## Tantangan Bab 8: Aplikasi Penilai KKM

Mari kita gabungkan ilmu dari Bab 5 (Input), Bab 6 (Variabel/Tipe Data), dan materi Pengkondisian ini ke dalam studi kasus nyata. Sebagai tenaga pengajar, setiap akhir semester saya selalu berhadapan dengan logika pengelompokan nilai siswa berdasarkan batas Kriteria Ketuntasan Minimal (KKM).

**Tugas Anda:**
Buatlah **Aplikasi Penilai KKM Sekolah** di **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)**.

1. Program harus meminta _input_ **Nama Siswa** (Ingat, ini tipe data Teks/String).
2. Program meminta _input_ **Nilai Akhir**. (Wajib diubah menjadi angka dengan pembungkus `int()` atau `float()`!).
3. Buat struktur multi-kondisi (`if-elif-else`) dengan syarat berikut:
   - Jika nilai `>= 90`, cetak: `"Selamat [Nama Siswa], Anda mendapatkan predikat A."`
   - Jika nilai `>= 80`, cetak: `"Bagus [Nama Siswa], Anda mendapatkan predikat B."`
   - Jika nilai `>= 75`, cetak: `"[Nama Siswa], Anda mendapat predikat C (Lulus KKM)."`
   - Jika nilainya di bawah 75 (Gunakan penutup `else`), cetak: `"Mohon maaf [Nama Siswa], Anda harus mengikuti Remedial."`

Susun kodenya di **[Python Quest Playground](https://herdianurdin.my.id/python-quest/#/playground)**. Hati-hati dengan **spasi (indentasi)** Anda! Jika program berjalan mulus, mengelompokkan nilai dengan benar, dan bebas dari _IndentationError_, _copy_ mahakarya Anda dan _paste_ di kolom komentar!

_(Artikel ini adalah Bagian ke-8 dari Seri Fundamental Python)._

[Baca Selanjutnya: Bab 9 - Perulangan Tanpa Henti (Looping) >>](/blog/bab-9-perulangan-looping-python)
