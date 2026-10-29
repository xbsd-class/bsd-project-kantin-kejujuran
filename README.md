# Kantin Kejujuran — GitHub Pages Edition

Website kantin mandiri sekolah yang menekankan kejujuran, transparansi, dan kemudahan penggunaan. Dibangun dengan HTML, CSS, dan JavaScript vanilla serta hanya memerlukan **repository GitHub dan GitHub Pages** untuk publikasi.

> **Penting:** produk, harga, jam operasional, dan stok yang disertakan adalah **data contoh**. Ganti dan periksa seluruh data sebelum digunakan di kantin sungguhan.

## Fitur versi pertama

- Beranda responsif, katalog produk dari JSON, pencarian, filter kategori, filter ketersediaan, dan pengurutan.
- Detail produk, keranjang dengan kuantitas dan subtotal, serta perhitungan rupiah menggunakan bilangan bulat.
- Alur checkout dengan konfirmasi pembeli, pilihan pembayaran yang dikonfigurasi, pencatatan transaksi lokal, bukti transaksi, cetak / simpan PDF melalui browser, dan riwayat perangkat.
- Dashboard Admin dan dashboard Penjual terpisah dengan gerbang PIN antarmuka; kustomisasi landing page, pengelolaan draft produk/kategori, POS penjual, shift, stok operasional, impor/ekspor laporan, dan rekonsiliasi lokal.
- Pencatatan mutasi stok, shift penjual, rekap penjualan agregat untuk halaman transparansi, rekonsiliasi tunai/QRIS, panduan interaktif, masukan anonim lokal, pengaturan tema, ekspor cadangan, dan informasi penyimpanan.
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

1. Buka `#/admin`, masukkan PIN Admin `4826`, lalu masuk ke menu **Produk**. PIN ini hanyalah pengunci antarmuka dan bukan keamanan sesungguhnya.
2. Tambah atau sunting produk pada draft lokal. Perubahan disimpan hanya pada browser tersebut.
3. Pilih **Ekspor katalog**. Browser mengunduh file `products.json`.
4. Buka repository GitHub, unggah file tersebut untuk menggantikan `data/products.json`, lalu commit.
5. Tunggu GitHub Pages selesai menerbitkan perubahan; siswa akan melihat versi publik terbaru setelah memuat ulang halaman.

Kategori dapat diekspor dari menu **Kategori**. Pengaturan landing page, nama kantin, warna, bagian beranda, logo, banner, pengumuman, dan QRIS diatur di **Admin → Kustomisasi landing page**, lalu diekspor menjadi `data/settings.json`. Pengumuman dan transparansi juga dapat diekspor dari menu **Ekspor & impor**. Setelah penjual menyerahkan JSON dan admin mengimpornya, tombol **Buat rekap dari transaksi terkumpul** menyiapkan angka agregat saja (jumlah transaksi dan nilai yang dilaporkan) untuk `data/transparency.json`; file ini baru dibagikan setelah admin memeriksa dan mengunggahnya ke GitHub. Semua harga, jam, stok, pengumuman, dan informasi QRIS harus diverifikasi sebelum diterbitkan.

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
- Dashboard memiliki halaman PIN terpisah (Admin `4826`, Penjual `7361`) untuk mencegah akses kasual pada antarmuka. Namun PIN dan logika pembukaannya ada di JavaScript; siapa pun yang dapat membaca source repository dapat menemukannya atau melewati gerbang. Ini bukan autentikasi aman dan tidak boleh melindungi data rahasia.
- Status pembayaran hanyalah laporan pembeli sampai diverifikasi manual berdasarkan uang fisik atau sumber bukti resmi.
- QRIS hanya ditampilkan jika pengelola mengatur path gambar resmi lokal di repository dan mengaktifkannya pada `data/settings.json`. Website tidak membuat QRIS sendiri atau memverifikasi pembayaran.
- Data lokal dapat diedit atau dihapus oleh pengguna / browser. Gunakan ekspor cadangan secara berkala.
- Tidak ada pengiriman masukan atau data ke layanan eksternal.

Jika suatu saat sekolah memerlukan sinkronisasi real-time, kontrol akses kuat, stok bersama, atau verifikasi pembayaran otomatis, hal tersebut membutuhkan arsitektur backend yang berbeda; fitur tersebut sengaja tidak disimulasikan dalam versi GitHub-only ini.

## Pengujian

Pemeriksaan yang dilakukan saat pembuatan:

- Sintaks seluruh modul JavaScript diperiksa dengan `node --check`.
- Seluruh berkas JSON awal berhasil diparse; ID produk, integer harga, path gambar lokal, dan import modul diperiksa.
- Tes logika tanpa dependensi tersedia pada `tests/smoke.mjs`: validasi katalog, total keranjang rupiah, snapshot transaksi, status pembayaran, validasi impor, dan ID duplikat.
- `tests/dashboard-static-smoke.mjs` memeriksa keberadaan bagian PIN admin/penjual, kustomisasi landing page, upload QRIS/aset, POS penjual, dan alur publikasi file.
- `tests/render-smoke.mjs` memakai mock DOM untuk memeriksa render beranda pembeli, gerbang PIN, halaman kustomisasi admin, POS penjual, dan kontrol publikasi admin. Ini bukan pengujian visual browser penuh.
- Untuk menjalankan seluruh tes secara opsional, gunakan Node.js 22 atau lebih baru dari root proyek:
  `node --experimental-default-type=module tests/smoke.mjs`
  `node --experimental-default-type=module tests/dashboard-static-smoke.mjs`
  `node --experimental-default-type=module tests/render-smoke.mjs`
- Pemeriksaan sintaks modul JavaScript, parsing semua berkas JSON, dan keberadaan aset pada katalog/settings juga dijalankan setelah perubahan. Node.js tidak diperlukan untuk menerbitkan website.
- Pengujian interaksi visual langsung pada browser dan semua ukuran layar belum dapat dipastikan dari lingkungan pengembangan ini; lakukan pemeriksaan akhir setelah GitHub Pages aktif.
- Peninjauan struktur path relatif dan konfigurasi static hosting.

Tes logika bukan pengganti uji interaksi visual di semua browser dan ukuran layar. Setelah GitHub Pages aktif, cek katalog, tambah/ubah kuantitas, checkout, cetak bukti, ekspor katalog, dan impor berkas di HP serta laptop sebelum dipakai secara operasional.


## Dashboard Admin dan Penjual

Rute dashboard yang dapat dibuka langsung:

- Admin: `https://USERNAME.github.io/REPOSITORY/#/admin`
- Penjual: `https://USERNAME.github.io/REPOSITORY/#/seller`

PIN bawaan versi ini:

- **Admin: `4826`** — mengelola kustomisasi landing page, produk, kategori, pengaturan QRIS, laporan, dan publikasi file.
- **Penjual: `7361`** — mencatat penjualan lewat POS, shift lokal, stok operasional, serta mengekspor laporan.

PIN tersebut hanyalah kunci antarmuka pada sisi browser. Source code GitHub Pages bersifat publik bagi siapa pun yang dapat membuka repository, sehingga PIN hardcoded dapat ditemukan dan tidak boleh dipakai untuk melindungi data rahasia. Untuk mengganti PIN bawaan, ubah konstanta `DASHBOARD_PINS` di `assets/js/app.js`, lalu commit/push perubahan. Jangan menaruh informasi pribadi siswa atau bukti pembayaran sensitif di repository.

## Kustomisasi landing page dan gambar QRIS

1. Masuk ke `#/admin` dan masukkan PIN admin. Buka menu **Kustomisasi landing page**.
2. Ubah teks hero, tombol, kartu, langkah-langkah, pengumuman, warna, informasi operasional, bagian landing page yang tampil, dan pengaturan pembayaran. Simpan draft.
3. Untuk logo, gambar hero, atau QRIS, pilih gambar PNG/JPG/WebP maksimal 1,2 MB. Browser akan mengunduh salinannya dan mengisi path yang diperlukan di pengaturan.
4. Unggah file gambar yang terunduh ke path di kolom pengaturan (misalnya `assets/uploads/qris-kantin.png`) menggunakan **Add file → Upload files** di GitHub. Pastikan nama/path sama dengan yang tercantum pada settings.
5. Tekan **Ekspor settings.json**, lalu unggah hasilnya menggantikan `data/settings.json`. Commit semua file gambar dan JSON pada GitHub. Setelah GitHub Pages selesai menerbitkan perubahan, pembeli melihat versi baru saat halaman dimuat ulang.
6. Katalog produk, kategori, pengumuman, dan transparansi juga mengikuti pola ekspor JSON lalu push file masing-masing ke folder `data/`.

Gambar yang dipilih dapat dipratinjau di browser pengelola, tetapi gambar tersebut **belum menjadi aset publik** sampai file aslinya diunggah ke repository. Untuk QRIS, gunakan gambar resmi dari pengelola dan pastikan path yang diterbitkan benar. Aplikasi tidak memverifikasi pembayaran.

## Batas sinkronisasi GitHub-only

GitHub Pages tidak menyediakan API tulis atau database bersama untuk aplikasi statis ini. Perubahan pengaturan/katalog dapat disebarkan bersama setelah JSON dan aset dipush dan deployment selesai. Itu bukan sinkronisasi realtime: tidak ada perubahan lintas perangkat yang terjadi hanya karena tombol disimpan di dashboard. Transaksi penjual, shift, mutasi stok, serta catatan pembeli tetap tersimpan pada browser masing-masing sampai diekspor dan dipindahkan secara manual. Untuk mengumpulkan rekap, penjual mengekspor laporan lalu admin mengimpornya ke perangkat admin. Admin dapat mengekspor `transparency.json` yang berisi angka agregat dari data terkumpul tanpa ID transaksi atau rincian barang. Setelah file itu dipush dan deployment selesai, halaman transparansi pembeli menampilkan rekap laporan yang terkumpul dengan catatan bahwa angka belum membuktikan penerimaan uang. Data hanya mencakup berkas yang benar-benar dikumpulkan.

PIN terpisah antara Admin dan Penjual membedakan alur antarmuka, bukan hak akses yang aman. Siapa pun yang memiliki akses ke source code atau mengubah JavaScript dapat melewati gerbang PIN. Arsitektur GitHub-only tidak cocok untuk autentikasi admin yang sungguh aman atau transaksi terpusat realtime.
