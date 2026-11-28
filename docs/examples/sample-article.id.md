---
title: "Mengenal Variabel Python Melalui Contoh Sederhana"
description: "Belajar memahami variabel Python, aturan penamaan, dan cara memakai nilai dalam program kecil untuk pembaca pemula."
pubDate: 2026-11-28T09:00:00+07:00
coverImage: "../../assets/images/ilustrasi-tipe-data-dasar.webp"
tags: ["python", "pemrograman", "pemula", "variabel"]
isDraft: true
enSlug: "understanding-python-variables"
faq:
  - q: "Apakah Python harus mendeklarasikan tipe variabel?"
    a: "Tidak untuk penggunaan umum. Python menentukan tipe berdasarkan nilai yang diberikan."
  - q: "Apakah nama variabel boleh diawali angka?"
    a: "Tidak. Nama variabel harus diawali huruf atau underscore."
---

Saat membuat program, kita sering perlu menyimpan informasi sementara: nama pengguna, jumlah barang, atau status proses. Di Python, salah satu cara paling dasar untuk menyimpan nilai tersebut adalah menggunakan **variabel**.

## Apa Itu Variabel?

Variabel adalah nama yang kita gunakan untuk merujuk pada sebuah nilai. Bayangkan label pada kotak: label membantu kita mengetahui isi kotak tanpa harus mengingat posisi kotaknya.

```python
nama = "Budi"
umur = 17

print(nama)
print(umur)
```

Pada contoh di atas, `nama` merujuk pada teks `"Budi"`, sedangkan `umur` merujuk pada bilangan `17`.

## Aturan Dasar Penamaan

Beberapa aturan yang perlu diingat:

- Nama variabel dapat berisi huruf, angka, dan underscore.
- Nama tidak boleh diawali angka.
- Nama variabel peka terhadap huruf besar dan kecil (`nama` berbeda dari `Nama`).
- Hindari memakai kata kunci Python sebagai nama variabel.
- Pilih nama yang menjelaskan maksud data.

Contoh:

```python
nama_siswa = "Alya"
jumlah_buku = 4
sudah_login = True

print(nama_siswa, jumlah_buku, sudah_login)
```

## Kesalahan yang Sering Terjadi

Nama seperti `2nama` tidak valid karena diawali angka. Nama `nama-siswa` juga bukan nama variabel biasa karena tanda hubung diperlakukan sebagai operator pengurangan. Gunakan `nama_siswa` atau `namaSiswa`.

```python
# Benar
nama_siswa = "Alya"

# Salah: uncomment baris berikut untuk melihat SyntaxError
# 2nama = "Alya"
# nama-siswa = "Alya"
```

## Kesimpulan

Variabel memberi nama pada nilai sehingga program lebih mudah dibaca dan diubah. Mulailah dengan nama yang sederhana dan deskriptif. Setelah memahami variabel, pelajari tipe data agar tahu operasi apa yang dapat dilakukan pada setiap nilai.
