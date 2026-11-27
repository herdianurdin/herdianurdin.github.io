# Deployment ke GitHub Pages

## 1. Ringkasan

Repository dipublikasikan ke GitHub Pages menggunakan workflow `.github/workflows/deploy.yml`. Build Astro menghasilkan static files di `dist/`, lalu artifact Pages diunggah dan dipublikasikan oleh job deploy.

Domain publik: `https://herdianurdin.my.id`.

## 2. Trigger

Workflow berjalan pada:

- `push` ke branch `main`.
- `workflow_dispatch` (manual run).

Job deploy memiliki guard `if: github.ref == 'refs/heads/main'`. Manual run dari branch selain `main` dapat menjalankan build, tetapi tidak menerbitkan situs produksi.

## 3. Urutan job

### Build

1. `actions/checkout@v7`
2. `actions/setup-node@v7` dengan Node `24` dan npm cache.
3. `npm ci`
4. `npm run build`
5. `actions/upload-pages-artifact@v5` dengan `path: ./dist`

### Deploy

- Menunggu job build melalui `needs: build`.
- Memakai environment `github-pages`.
- Menjalankan `actions/deploy-pages@v5`.
- Hanya berlaku saat ref adalah `refs/heads/main`.

## 4. Permission

Workflow memakai default `permissions: {}`.

- Build job: `contents: read`.
- Deploy job: `pages: write`, `id-token: write`.

Jangan menaikkan izin global tanpa kebutuhan. Izin deploy hanya diperlukan pada job yang mengunggah deployment Pages menggunakan OIDC.

## 5. Concurrency

Concurrency group memakai workflow dan ref:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Ini memisahkan proses antar-ref sehingga run branch pengembangan tidak membatalkan run dari branch lain.

## 6. Syarat repository

- `package.json` dan `package-lock.json` berada di root.
- `package-lock.json` harus tracked di Git karena `npm ci` dan npm cache bergantung padanya.
- GitHub Pages source dan environment `github-pages` dikonfigurasi di repository settings.
- Domain disimpan melalui `public/CNAME`/konfigurasi Pages yang sesuai.
- Artifact build harus menyertakan file `dist/` yang dihasilkan `npm run build`.

## 7. Rilis

Sebelum merge/push ke `main`:

1. `npm ci`.
2. `npm audit`.
3. `npm run build`.
4. `npm run preview` dan lakukan QA manual.
5. Periksa `git diff --check` dan staged file.
6. Pastikan tidak ada `node_modules`, `dist`, `.env`, atau file lokal rahasia.
7. Push/merge ke `main`.
8. Pantau workflow build dan deploy.
9. Periksa situs produksi, Network, console, sitemap, RSS, dan fungsi utama.

## 8. Rollback

Jika deployment menghasilkan masalah:

1. Identifikasi commit yang menyebabkan regresi.
2. Revert commit tersebut melalui Git, bukan mengedit file hasil build di GitHub Pages.
3. Push revert ke `main`.
4. Pantau workflow sampai deployment rollback selesai.
5. Verifikasi ulang production.

Jangan menghapus artifact atau memodifikasi branch secara force-push sebagai rollback normal.

## 9. Pembaruan GitHub Actions

Workflow saat ini memakai checkout v7, setup-node v7, upload-pages-artifact v5, deploy-pages v5. Saat memperbarui action, periksa dokumentasi resmi, kompatibilitas Node runtime, permission, dan release notes. Untuk supply-chain hardening yang lebih tinggi, pertimbangkan pinning setiap action ke full commit SHA yang diverifikasi dan dependabot/Renovate untuk pembaruan terkontrol.
