# Kantin Kejujuran — GitHub Pages Edition

Website kantin mandiri sekolah yang menekankan kejujuran, transparansi, dan kemudahan penggunaan. Dibangun dengan HTML, CSS, dan JavaScript vanilla serta hanya memerlukan **repository GitHub dan GitHub Pages** untuk publikasi.

> **Penting:** produk, harga, jam operasional, dan stok yang disertakan adalah **data contoh**. Ganti dan periksa seluruh data sebelum digunakan di kantin sungguhan.

## Fitur versi pertama

- Beranda responsif, katalog produk dari JSON, pencarian, filter kategori, filter ketersediaan, dan pengurutan.
- Detail produk, keranjang dengan kuantitas dan subtotal, serta perhitungan rupiah menggunakan bilangan bulat.
- Alur checkout dengan konfirmasi pembeli, pilihan pembayaran yang dikonfigurasi, pencatatan transaksi lokal, bukti transaksi, cetak / simpan PDF melalui browser, dan riwayat perangkat.
- Dashboard Admin dan dashboard Penjual terpisah dengan gerbang PIN antarmuka; kustomisasi landing page, tambah/edit/hapus produk, reset pendapatan kumulatif, reset semua stok ke 0, POS penjual, shift, stok operasional, impor/ekspor laporan, dan rekonsiliasi lokal.
- Diskon wadah sendiri yang dapat dikustomisasi (persentase dan WhatsApp admin) dengan langkah kirim bukti serta status pengajuan yang menunggu pemeriksaan manual; alur keranjang/checkout bertahap seperti marketplace tanpa menyalin merek atau aset pihak lain.
- Switchboard untuk mengaktifkan atau menonaktifkan fitur utama pembeli dan pengelola dari pengaturan admin.
- Pencatatan mutasi stok, shift penjual, rekap penjualan agregat untuk halaman transparansi, rekonsiliasi tunai/QRIS, panduan interaktif, masukan anonim lokal, pengaturan tema, ekspor cadangan, dan informasi penyimpanan.
- Aset SVG lokal, manifest web app, navigasi hash, path relatif untuk URL repository GitHub Pages, desain mobile-first, akses keyboard, dan dukungan `prefers-reduced-motion`.

## Publikasi otomatis dengan GitHub Actions (disarankan)

Versi ini sudah menyertakan `.github/workflows/deploy.yml`. Workflow akan berjalan saat ada `push` ke branch `main`, dapat dijalankan manual dari tab **Actions**, dan menjalankan pemeriksaan pada pull request.

1. Unggah **seluruh isi folder proyek** ke root repository GitHub. Pastikan `.github/workflows/deploy.yml`, `index.html`, `data/`, `assets/`, `scripts/`, dan `tests/` ikut terunggah. Jangan mengunggah folder pembungkus `kantin-kejujuran` sebagai satu folder di dalam repository.
2. Commit file ke branch `main` (jika branch utamamu bernama lain, ubah `main` di `.github/workflows/deploy.yml` agar cocok).
3. Buka repository → **Settings → Pages**.
4. Pada **Build and deployment → Source**, pilih **GitHub Actions**.
5. Buka tab **Actions** dan pilih workflow **Validate and deploy Kantin Kejujuran**. Pastikan job validasi dan deploy berstatus sukses.
6. Buka URL yang ditampilkan di Settings → Pages. Setiap push selanjutnya akan divalidasi, dites, dan diterbitkan otomatis jika semua pemeriksaan lulus.

Workflow menjalankan pemeriksaan sintaks JavaScript, validasi JSON dan aset lokal, tiga tes proyek, menyiapkan berkas statis, lalu menerbitkan GitHub Pages. Tidak perlu Node.js/npm di komputer pengguna untuk deployment; Node.js hanya digunakan pada runner GitHub Actions.

> Workflow ini mengotomatiskan validasi dan publikasi file yang sudah masuk ke repository. Workflow **tidak** membaca `localStorage` HP, mengambil transaksi dari WhatsApp, ataupun mengirim transaksi dari website ke repository. Tidak ada token penulis yang ditaruh dalam JavaScript publik.

### Jika website sudah dipublikasikan dari branch

Mengubah **Source** dari `Deploy from a branch` ke `GitHub Actions` membuat workflow menjadi mekanisme deployment utama. Jangan menjalankan dua alur publikasi paralel untuk proyek yang sama. Setelah pengaturan tersimpan dan workflow sukses, perubahan yang di-commit akan diterbitkan melalui Actions.

### Publikasi perubahan dari dashboard

Dashboard admin menyimpan draft di browser perangkat admin. Saat kamu menekan ekspor, file JSON akan diunduh. Unggah file hasil ekspor ke lokasi yang benar di repository lalu commit; GitHub Actions akan memvalidasi dan memublikasikannya. Upload gambar juga memiliki langkah manual: unggah file gambar ke `assets/uploads/` atau `assets/images/products/`, kemudian commit bersama JSON yang menunjuk ke file tersebut.


## Fitur baru: reset, produk, dan diskon wadah

- **Reset pendapatan** pada ringkasan admin atau halaman transaksi hanya mengatur penanda waktu mulai hitung pendapatan kumulatif. Sistem mengunduh cadangan transaksi terlebih dahulu dan **tidak menghapus riwayat transaksi**. Penanda reset berada di browser admin saat ini; ia tidak mengubah data pada perangkat lain.
- **Reset stok** mengubah stok seluruh produk di draft admin menjadi `0`, mengunduh cadangan katalog, dan menambahkan catatan mutasi. Untuk menerbitkan hasilnya, ekspor katalog lalu commit `data/products.json` ke GitHub. Stok ini bukan stok bersama real-time.
- **Tambah, edit, arsip, dan hapus produk** bekerja pada draft lokal. Tombol hapus menghilangkan produk dari draft hasil ekspor, tetapi snapshot barang pada transaksi lama tetap tersimpan.
- **Diskon wadah sendiri** dapat diaktifkan dari Admin → Kustomisasi landing page → Pengaturan fitur aplikasi. Isi nomor WhatsApp admin dalam format internasional (angka saja, contohnya berawalan `62`) dan atur persentase 1–50%. Pembeli perlu membuka tautan WhatsApp dari checkout, mengirim bukti, lalu menyatakan bukti sudah dikirim. Aplikasi mencatat diskon sebagai **pengajuan yang menunggu pemeriksaan admin**. Website statis tidak dapat membuktikan isi chat WhatsApp; persetujuan akhir tetap perlu pemeriksaan manual. Nomor WhatsApp yang dimasukkan pada `settings.json` menjadi informasi publik di repository/website, jadi gunakan nomor resmi pengelola, bukan nomor pribadi yang tidak ingin dipublikasikan.
- **Switchboard fitur** ada di Admin → Kustomisasi landing page → Pengaturan fitur aplikasi. Switchboard bisa mengaktifkan/menonaktifkan keranjang, checkout, pengelolaan produk/kategori, reset pendapatan, reset stok, POS penjual, manajemen stok, laporan/transaksi, masukan anonim, transparansi, dan diskon wadah. Simpan draft, ekspor `settings.json`, lalu commit untuk menerapkan perubahan pada versi publik. Tombol ekspor konfigurasi tetap tersedia agar fitur dapat diaktifkan kembali.
- **PIN bawaan** tetap Admin `4826` dan Penjual `7361`. PIN adalah pengunci antarmuka saja, bukan autentikasi yang aman karena GitHub Pages mengirim source code ke browser.

## Batas otomatisasi GitHub Actions

GitHub Actions hanya dapat memproses file yang ada di repository atau peristiwa yang dikirim ke GitHub. Ia tidak dapat melihat transaksi yang hanya disimpan dalam browser siswa. Untuk tetap memakai GitHub saja, pengumpulan laporan transaksi lintas perangkat perlu melalui ekspor dan penyerahan berkas ke pengelola; sebaiknya hanya publikasikan rekap agregat, bukan detail pembelian siswa, pada repository publik. Tidak ada sinkronisasi transaksi real-time antar-HP dalam arsitektur statis ini.

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
- GitHub Actions menjalankan semua pemeriksaan di atas secara otomatis setiap push ke `main` dan pada pull request.
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
