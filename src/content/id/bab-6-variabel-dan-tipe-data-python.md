---
title: "Fundamental Python Bab 6: Variabel dan Tipe Data (Menyortir Memori Mesin)"
description: "Jangan biarkan kode Anda menjadi gudang yang berantakan. Pelajari teori formal variabel, aturan penamaan, dan klasifikasi tipe data dasar di Python."
pubDate: 2026-10-10T10:25:00+07:00
coverImage: "/images/bab-6-variabel-dan-tipe-data-python.webp"
tags:
  ["tutorial-python", "dasar-pemrograman", "variabel", "tipe-data", "pemula"]
isDraft: false
---

Pada **[Bab 5 sebelumnya](/blog/bab-5-input-dan-output-python)**, kita telah membuat komputer mampu mendengarkan ketikan pengguna melalui perintah `input()`. Namun, ada satu celah logika dalam proses tersebut: saat komputer bertanya dan Anda menjawab, ke mana jawaban itu pergi? Jika tidak disimpan, data tersebut akan menguap dan dilupakan oleh mesin sedetik kemudian.

Agar komputer memiliki "ingatan", kita harus mengatur ruang penyimpanannya. Dan berbicara soal ruang penyimpanan, saya memiliki sebuah pengalaman buruk yang tidak akan pernah saya lupakan.

## Tragedi Gudang Arsip dan Logika WALL-E

![Ilustrasi Tragedi Gudang Arsip](/images/ilustrasi-tragedi-gudang-arsip.webp)

Beberapa tahun yang lalu, saya pernah merangkap tugas untuk mengelola arsip dokumen kesiswaan. Suatu hari, ada pihak yang mendadak membutuhkan satu dokumen Kartu Keluarga spesifik milik seorang siswa.

Itu seharusnya menjadi tugas sederhana. Namun, yang terjadi adalah kepanikan luar biasa. Ribuan dokumen—mulai dari foto, fotokopi ijazah, hingga berkas administrasi guru—semuanya dibuang dan ditumpuk begitu saja ke dalam satu lemari besar tanpa map, tanpa label nama, dan tanpa dipisahkan berdasarkan jenisnya. Saya harus membongkar seluruh isi lemari selama berjam-jam hanya untuk menemukan satu lembar kertas.

Kekacauan semacam inilah yang paling dibenci oleh komputer.

Di Jepang, pemerintah menerapkan aturan pengelolaan limbah yang sangat ketat. Anda harus menyortir sampah sesuai jenisnya (plastik dengan plastik, kertas dengan kertas). Jika Anda mencampurnya, petugas kebersihan akan menolak mengangkutnya. Konsep ini juga digambarkan dengan sangat indah dalam film animasi _WALL-E_. Robot kecil itu bisa bertahan hidup di bumi yang hancur karena ia secara teliti menyortir dan mengelompokkan setiap material rongsokan yang ia temukan.

Sistem _compiler_ (pembaca kode) di dalam pemrograman bekerja persis seperti petugas kebersihan Jepang atau robot _WALL-E_. Jika Anda memasukkan data ke dalam memori komputer tanpa memberinya label yang jelas dan tanpa mendeklarasikan jenis datanya, sistem akan menolak mengeksekusi program tersebut, atau aplikasi Anda akan berujung pada _error_ yang fatal.

Untuk mencegah aplikasi Anda menjadi gudang arsip yang berantakan, kita harus memahami tiga konsep fundamental manajemen memori: **Variabel, Konstanta, dan Tipe Data.**

---

## 1. Variabel dan Konstanta

Dalam analogi dunia nyata, jika memori komputer adalah sebuah gudang besar, maka kita membutuhkan tempat-tempat penampungan (seperti kardus atau map) untuk meletakkan barang secara rapi.

Secara teori formal akademis, **Variabel** adalah lokasi atau ruang alokasi di dalam memori utama komputer (RAM) yang diberi nama (_identifier_) khusus. Sederhananya, variabel adalah tempat untuk menampung suatu nilai di memori, di mana nilai atau isi data tersebut bersifat dinamis (dapat diubah-ubah kapan saja selama program dieksekusi).

Contoh variabel di Python:

```python
umur = 17      # Program mengalokasikan memori bernama 'umur' berisi angka 17
umur = 18      # Nilai di dalam memori tersebut kini diganti menjadi 18
print(umur)    # Akan mencetak angka 18
```

Sebaliknya, **Konstanta** adalah ruang alokasi memori yang nilainya bersifat tetap dan tidak boleh diubah setelah pertama kali dideklarasikan. Walaupun di bahasa Python tidak ada pengunci sistem yang mutlak untuk menahan perubahan nilai, para _programmer_ global memiliki sebuah kesepakatan (_konvensi_): **jika nama variabel ditulis menggunakan HURUF KAPITAL SEMUA, maka itu adalah konstanta dan Anda dilarang keras mengubah nilainya di baris kode mana pun.**

```python
PI = 3.14
GRAVITASI = 9.8
```

## 2. Aturan Penamaan Variabel (Identifier)

Sama halnya dengan map arsip yang membutuhkan label jelas agar mudah dicari, penamaan variabel (_identifier_) tidak boleh dilakukan sembarangan.

Saat me-_review_ kode milik orang lain, momen paling menjengkelkan adalah ketika saya menemukan variabel dengan nama satu huruf seperti `t`, `x`, `y`, atau singkatan aneh seperti `dt1`. Membaca kode seperti itu memaksa saya berubah menjadi _Sherlock Holmes_, memecahkan misteri ratusan baris kode hanya untuk menebak data apa yang sebenarnya sedang disimpan di dalam variabel `t` tersebut.

**Aturan Emas:** Nama variabel harus mendeskripsikan secara jelas nilai yang ditampungnya.

Karena spasi (` `) dilarang digunakan dalam pembuatan nama variabel, dunia rekayasa perangkat lunak menciptakan beberapa standar gaya penulisan kata:

- `camelCase`: Kata pertama huruf kecil, awal kata selanjutnya huruf besar. (Contoh: `namaLengkapSiswa`)
- `PascalCase`: Setiap awal kata menggunakan huruf besar. (Contoh: `NamaLengkapSiswa`)
- `kebab-case`: Menggunakan tanda strip atau sate. (Contoh: `nama-lengkap-siswa`)
- `snake_case`: Menggunakan garis bawah / _underscore_. (Contoh: `nama_lengkap_siswa`)

**Catatan Mutlak:** Di ekosistem Python, standar baku (_best practice_) yang disepakati untuk penulisan nama variabel adalah **`snake_case`**.

Selain itu, ada tiga larangan keras yang akan membuat sistem Python Anda langsung _error_ (Sintaks Tidak Valid):

1. Tidak boleh diawali dengan angka. (Contoh salah: `1nama = "Budi"`)
2. Tidak boleh mengandung simbol khusus selain _underscore_. (Contoh salah: `nama@siswa = "Budi"`)
3. Tidak boleh menggunakan kata kunci atau perintah bawaan Python (_Reserved Words_). (Contoh salah: `print = "Budi"`, atau `if = 10`)

## 3. Tipe Data Dasar

![Ilustrasi Tipe Data Dasar](/images/ilustrasi-tipe-data-dasar.webp)

Setelah ruang memori disiapkan dan diberi nama yang benar, hal selanjutnya adalah menentukan **jenis** datanya. Komputer memproses teks, angka bulat, dan angka desimal dengan cara dan alokasi memori yang sangat berbeda.

Secara teori formal, **Tipe Data** adalah klasifikasi yang memberi tahu _compiler_ atau _interpreter_ tentang jenis dari nilai yang dapat ditampung oleh suatu variabel. Tipe data ini pada akhirnya akan menentukan operasi matematika atau logika apa saja yang diizinkan terhadap nilai tersebut.

Berikut adalah 4 tipe data paling fundamental di Python yang wajib Anda kuasai:

- **String (`str`):** Tipe data untuk teks, huruf, kalimat, atau kumpulan karakter (termasuk angka yang tidak akan dihitung, seperti nomor telepon). **Wajib diapit oleh tanda kutip** tunggal (`'`) atau ganda (`"`).
  ```python
  nama_aplikasi = "Buku Algoritma"
  nomor_hp = "08123456789"
  ```
- **Integer (`int`):** Tipe data untuk bilangan bulat utuh (tidak memiliki koma). Bisa bernilai positif maupun negatif. Ditulis langsung tanpa tanda kutip.
  ```python
  jumlah_unduhan = 4500
  suhu_ruangan = -5
  ```
- **Float (`float`):** Tipe data untuk bilangan pecahan atau desimal. Ingat, dalam standar internasional dan pemrograman, **pemisah desimal menggunakan titik (`.`), bukan koma (`,`)**.
  ```python
  berat_badan = 65.5
  rating_aplikasi = 4.8
  ```
- **Boolean (`bool`):** Tipe data nilai logika yang hanya memiliki dua kemungkinan mutlak: `True` (Benar) atau `False` (Salah). Sangat penting bahwa **huruf pertamanya wajib kapital**. Tipe data ini ibarat sakelar untuk menentukan kondisi logika hidup atau mati.
  ```python
  status_aktif = True
  sedang_hujan = False
  ```

---

## Tantangan Bab 6: Misi Inspeksi Sintaks

Pemahaman terhadap aturan variabel dan tipe data adalah pondasi yang tidak bisa ditawar. Mari kita uji ketajaman mata Anda dalam melakukan inspeksi kode.

**Tugas Anda:**
Di bawah ini terdapat empat baris kode Python yang ditulis oleh _programmer_ ceroboh. Penamaan variabelnya sangat buruk, melanggar aturan baku, dan tidak sesuai standar Python.

```python
x = "Buku Algoritma"
2data = 2026
status-aktif = True
UangSaku = 15000.50
```

1. **Perbaiki keempat nama variabel di atas** agar mematuhi aturan penamaan Python, menggunakan standar penulisan _snake_case_, dan benar-benar mendeskripsikan data yang ditampungnya! (Hindari penggunaan variabel rahasia seperti `x` atau awalan angka seperti `2data`).
2. Tentukan apa **Tipe Data** dari masing-masing nilai di atas secara berurutan!

Silakan tuliskan jawaban perbaikan variabel dan analisis tipe data Anda di kolom komentar di bawah ini! Jangan biarkan sistem menolak kode Anda!

_(Artikel ini adalah Bagian ke-6 dari Seri Fundamental Python)._

[Baca Selanjutnya: Bab 7 - Operator (Matematika Mesin) >>](/blog/bab-7-operator-aritmatika-python)
