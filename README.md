# Kantin Kejujuran — GitHub Pages Edition

Website kantin mandiri sekolah yang menekankan kejujuran, transparansi, dan kemudahan penggunaan. Dibangun dengan HTML, CSS, dan JavaScript vanilla serta hanya memerlukan **repository GitHub dan GitHub Pages** untuk publikasi.

> **Penting:** produk, harga, jam operasional, dan stok yang disertakan adalah **data contoh**. Ganti dan periksa seluruh data sebelum digunakan di kantin sungguhan.

## Fitur versi pertama

- Beranda responsif, katalog produk dari JSON, pencarian, filter kategori, filter ketersediaan, dan pengurutan.
- Detail produk, keranjang dengan kuantitas dan subtotal, serta perhitungan rupiah menggunakan bilangan bulat.
- Alur checkout dengan konfirmasi pembeli, pilihan pembayaran yang dikonfigurasi, pencatatan transaksi lokal, bukti transaksi, cetak / simpan PDF melalui browser, dan riwayat perangkat.
- Dashboard pengelola untuk ringkasan lokal, draft produk dan kategori, arsip produk, ekspor JSON katalog, impor katalog dengan validasi dan konfirmasi, impor/ekspor transaksi, dan laporan CSV.
- Pencatatan mutasi stok, rekonsiliasi tunai/QRIS, transparansi publik, panduan interaktif, masukan anonim lokal, pengaturan tema, ekspor cadangan, dan informasi penyimpanan.
- Aset SVG lokal, manifest web app, navigasi hash, path relatif untuk URL repository GitHub Pages, desain mobile-first, akses keyboard, dan dukungan `prefers-reduced-motion`.

## Cara menerbitkan melalui GitHub

1. Buat repository baru di GitHub, misalnya `kantin-kejujuran`.
2. Unggah seluruh isi folder proyek ini ke **root** repository. Pastikan `index.html`, `data/`, `assets/`, dan `manifest.json` berada langsung di root, bukan di dalam folder bertingkat lain.
3. Buka **Settings → Pages** di repository.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch utama (umumnya `main`) dan folder **`/(root)`**, lalu tekan **Save**.
6. Tunggu status publikasi GitHub Pages selesai, kemudian buka alamat yang diberikan GitHub.
7. Untuk pembaruan berikutnya, commit atau push perubahan kode dan data ke branch yang sama. Tidak perlu Node.js, npm, proses build, atau GitHub Actions khusus.

Untuk repository `https://username.github.io/kantin-kejujuran/`, semua aset menggunakan path relatif sehingga tidak mengasumsikan website berada di root domain.

## Struktur berkas

```text
kantin-kejujuran/
├── index.html
├── 404.html
├── README.md
├── manifest.json
├── data/
│   ├── products.json
│   ├── categories.json
│   ├── settings.json
│   ├── announcements.json
│   └── transparency.json
└── assets/
    ├── css/
    │   ├── style.css
    │   ├── components.css
    │   └── responsive.css
    ├── js/
    │   ├── app.js
    │   ├── admin.js
    │   ├── cart.js
    │   ├── catalog.js
    │   ├── reports.js
    │   ├── storage.js
    │   ├── transactions.js
    │   ├── utils.js
    │   └── validation.js
    └── images/
        ├── logo.svg
        ├── hero-kantin.svg
        └── products/
```

## Cara mengubah katalog bersama

1. Buka `#/admin/products` di website. Dashboard ini bukan halaman admin yang terlindungi; jangan mengandalkan URL untuk keamanan.
2. Tambah atau sunting produk pada draft lokal. Perubahan disimpan hanya pada browser tersebut.
3. Pilih **Ekspor Katalog JSON**. Browser akan mengunduh file `products-github.json`.
4. Periksa isinya, lalu ganti berkas `data/products.json` di repository dengan isi file ekspor. Nama file dalam repository harus tetap `products.json`.
5. Commit perubahan dan tunggu GitHub Pages memperbarui versi publik.

Data kategori dapat diekspor dari halaman dashboard **Kategori**. Pengaturan publik bisa disunting melalui **Pengaturan → Ekspor settings.json**. Semua angka, harga, jam, informasi QRIS, dan pengumuman publik harus diverifikasi sebelum diterbitkan.

## Mengimpor laporan transaksi

1. Pada perangkat siswa, buka **Riwayat transaksi lokal → Ekspor riwayat** atau unduh bukti transaksi JSON.
2. Siswa menyerahkan file melalui prosedur manual yang disepakati sekolah.
3. Pada perangkat pengelola, buka `#/admin/transactions`, pilih file JSON, periksa ringkasan, lalu konfirmasi impor.
4. Ekspor laporan gabungan sebagai CSV untuk rekap. ID duplikat yang sudah dikenal akan dilewati.

Data impor tetap diberi label sebagai hasil impor. Laporan tidak otomatis lengkap dan status pembayaran tidak otomatis terverifikasi.

## Batasan penting arsitektur statis

GitHub Pages hanya menyajikan file statis. Versi ini tidak memakai server aplikasi atau database bersama, sehingga:

- `localStorage` terpisah pada setiap browser / perangkat; transaksi siswa tidak otomatis masuk ke dashboard pengelola.
- Draft produk, kategori, pengaturan, stok, masukan, dan rekonsiliasi tidak langsung mengubah file di GitHub. Publikasi dilakukan melalui ekspor dan commit / push manual.
- Stok dari JSON adalah stok pada pembaruan terakhir, bukan stok real-time.
- Dashboard tersedia untuk siapa pun yang mengetahui alamatnya. Tidak ada autentikasi admin yang aman atau kontrol akses server-side; jangan simpan data rahasia di sana.
- Status pembayaran hanyalah laporan pembeli sampai diverifikasi manual berdasarkan uang fisik atau sumber bukti resmi.
- QRIS hanya ditampilkan jika pengelola mengatur path gambar resmi lokal di repository dan mengaktifkannya pada `data/settings.json`. Website tidak membuat QRIS sendiri atau memverifikasi pembayaran.
- Data lokal dapat diedit atau dihapus oleh pengguna / browser. Gunakan ekspor cadangan secara berkala.
- Tidak ada pengiriman masukan atau data ke layanan eksternal.

Jika suatu saat sekolah memerlukan sinkronisasi real-time, kontrol akses kuat, stok bersama, atau verifikasi pembayaran otomatis, hal tersebut membutuhkan arsitektur backend yang berbeda; fitur tersebut sengaja tidak disimulasikan dalam versi GitHub-only ini.

## Pengujian

Pemeriksaan yang dilakukan saat pembuatan:

- Sintaks seluruh modul JavaScript diperiksa dengan `node --check`.
- Seluruh berkas JSON awal berhasil diparse; ID produk, integer harga, path gambar lokal, dan import modul diperiksa.
- Tes logika tanpa dependensi tersedia pada `tests/smoke.mjs`. Untuk menjalankannya secara opsional, gunakan Node.js 22 atau lebih baru: `node --experimental-default-type=module tests/smoke.mjs`. Node.js tidak diperlukan untuk menerbitkan website.
- Peninjauan struktur path relatif dan konfigurasi static hosting.

Tes logika bukan pengganti uji interaksi visual di semua browser dan ukuran layar. Setelah GitHub Pages aktif, cek katalog, tambah/ubah kuantitas, checkout, cetak bukti, ekspor katalog, dan impor berkas di HP serta laptop sebelum dipakai secara operasional.
