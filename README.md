# Kantin Kejujuran — GitHub Pages + Actions Edition

Website kantin mandiri sekolah dengan beranda pembeli, katalog, keranjang, checkout, bukti transaksi, riwayat, dashboard admin, dan dashboard penjual. Website menggunakan HTML, CSS, JavaScript vanilla, aset lokal, dan data publik pada repository GitHub.

## Berkas workflow sudah disertakan

File wajib: `.github/workflows/deploy.yml`.

Workflow ini:
- berjalan pada `push` ke branch `main`;
- berjalan pada pull request ke `main` untuk pemeriksaan tanpa deployment;
- bisa dijalankan dari tab Actions lewat `workflow_dispatch`;
- memeriksa struktur file, sintaks JavaScript, JSON/aset, lalu menjalankan tes aplikasi;
- menerbitkan GitHub Pages secara otomatis jika pemeriksaan berhasil.

### Cara memasang paket

1. Unduh dan ekstrak ZIP ini ke komputer.
2. Buka repository `https://github.com/xbsd-class/bsd-project-kantin-kejujuran`.
3. Unggah **isi** folder hasil ekstrak ke root repository (jangan mengunggah folder pembungkusnya sebagai satu folder bertingkat). Pastikan folder tersembunyi `.github/workflows/` ikut masuk.
4. Commit ke branch `main`.
5. Buka **Settings → Pages → Build and deployment → Source** dan pilih **GitHub Actions**.
6. Buka tab **Actions** dan pastikan workflow `Validate and deploy Kantin Kejujuran` selesai dengan tanda centang hijau.

Jika repository sudah memiliki `deploy.yml` yang salah, gunakan file dari paket ini pada path tepat `.github/workflows/deploy.yml`. Jangan letakkan file workflow di root repository.

## Penggunaan dan autosave

- Keranjang, transaksi, pengaturan lokal, draft produk/kategori, shift, mutasi stok, dan masukan disimpan otomatis pada browser yang digunakan.
- Perubahan antar-tab pada perangkat dan origin yang sama akan memperbarui tampilan melalui event penyimpanan browser.
- Dashboard admin dan penjual terpisah pada URL `#/admin` dan `#/seller`.
- PIN demo antarmuka: admin `4826`, penjual `7361`. PIN ini bukan keamanan server-side; jangan simpan rahasia atau data sensitif di aplikasi statis.
- Fitur reset pendapatan mengatur penanda periode, sedangkan reset stok menata stok draft pada browser tersebut. Tindakan ini tidak mengubah data pada HP lain.
- Bukti transaksi merupakan catatan lokal, bukan konfirmasi penerimaan pembayaran.
- Diskon wadah sendiri merupakan permohonan yang menunggu pemeriksaan manual oleh admin melalui WhatsApp; website tidak dapat memastikan bukti benar-benar dikirim atau memverifikasi pembayaran secara otomatis.

## Penting: batas sinkronisasi

GitHub Actions memproses file yang sudah masuk ke repository. Ia **tidak dapat membaca `localStorage` dari browser siswa/penjual**. GitHub Pages tidak menyediakan database atau endpoint tulis bersama untuk website statis.

Karena itu:
- Katalog dan pengaturan yang berada di repository akan diperbarui bagi semua pengunjung setelah perubahan di-commit dan GitHub Pages selesai deploy.
- Data yang disimpan lewat dashboard di browser tidak otomatis menjadi file di repository.
- Transaksi dari beberapa HP tidak bisa dihimpun melalui sinkronisasi realtime hanya dengan GitHub Pages + Actions.
- Tidak ada token GitHub yang ditanam di JavaScript publik, karena token tulis dapat disalahgunakan untuk mengubah repository.
- Panel impor JSON di antarmuka dihapus supaya pemakaian harian tidak bergantung pada impor berkas. Fitur cadangan dan ekspor laporan tetap tersedia untuk arsip, bukan sinkronisasi otomatis.

Untuk sinkronisasi transaksi antarperangkat yang benar-benar otomatis diperlukan layanan penyimpanan bersama dengan autentikasi/jalur tulis aman. Itu berada di luar kemampuan GitHub Pages saja. Workflow di proyek ini mengotomatiskan validasi dan deployment, bukan membuat database.

## Informasi contoh

Produk, harga, stok, dan metode pembayaran bawaan merupakan data contoh. Periksa dan sesuaikan sebelum dipakai dalam operasional nyata. QRIS nonaktif sampai pengelola menyiapkannya.

## Pengujian yang bisa dijalankan oleh GitHub Actions

- Sintaks JavaScript.
- Validasi JSON, ID produk, harga integer rupiah, dan aset lokal.
- Tes logika katalog, keranjang, transaksi, pengaturan fitur, serta diskon wadah.
- Tes render beranda, dashboard PIN, halaman checkout, dan panel otomatisasi GitHub.
