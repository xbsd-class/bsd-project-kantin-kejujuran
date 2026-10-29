# Laporan Pemeriksaan QA — Kantin Kejujuran

Tanggal pemeriksaan: 29 Oktober 2026

## Hasil

Pemeriksaan dilakukan pada HTML/JavaScript lokal dengan pengujian browser terisolasi dan simulasi penyimpanan browser. Pengujian tidak dilakukan terhadap URL GitHub Pages yang telah dipublikasikan.

- [LULUS] Sintaks JavaScript inline `index.html` dan `admin.html` lolos `node --check`.
- [LULUS] `kantin-config.json` dapat diparse sebagai JSON dan berisi empat produk awal.
- [LULUS] Login admin dengan PIN awal membuka dashboard; PIN salah tetap berada di layar login.
- [LULUS] Tambah produk, edit harga, arsipkan, aktifkan kembali, dan ekspor katalog berjalan.
- [LULUS] Pengaturan admin dapat disimpan di perangkat.
- [LULUS] Stok dapat ditambah/diubah, reset stok mengembalikan nilai stok awal, dan mutasi stok dicatat.
- [LULUS] Impor transaksi melewati validasi dan ID duplikat dalam batch yang sama tidak dihitung berulang.
- [LULUS] Verifikasi manual status transaksi, ekspor CSV, dan hitung selisih rekonsiliasi berjalan.
- [LULUS] Reset pendapatan mengubah penghitung pendapatan menjadi nol tanpa menghapus riwayat transaksi; transaksi lama dikecualikan dari penghitung setelah reset.
- [LULUS] Katalog menampilkan empat produk; produk dapat dimasukkan ke keranjang dan drawer keranjang dapat dibuka.
- [LULUS] Checkout menampilkan judul “Squidward's Checkout”, kode Shellback Reward yang valid menerapkan diskon sesuai konfigurasi, dan layar konfirmasi menampilkan “Squid's Eye Check!”.
- [LULUS] Simulasi transaksi dengan total awal Rp6.000 dan diskon 10% menghitung diskon Rp600 serta total Rp5.400; stok lokal Gantungan Kunci turun dari 9 menjadi 8.
- [LULUS] Transaksi, feedback Bubble Board, dan berkas bukti transaksi JSON berhasil dibuat pada simulasi.
- [LULUS] Saat `localStorage` berisi JSON dengan bentuk yang tidak sesuai, aplikasi memakai fallback dan tidak menghasilkan runtime error dalam skenario yang diuji.
- [LULUS] Tidak ditemukan horizontal overflow pada lebar viewport 320, 360, 390, 768, 1024, dan 1440 piksel untuk storefront maupun admin.
- [LULUS] Tidak ada runtime error atau console error pada interaksi browser yang diujikan.

## Perbaikan yang dilakukan

1. Memperbaiki error urutan deklarasi fungsi `clone` yang menghentikan skrip admin sebelum event login dipasang.
2. Menambahkan fungsi normalisasi ID produk yang sebelumnya tidak tersedia sehingga alur tambah produk dapat berjalan.
3. Melindungi akses `sessionStorage` dari kegagalan lingkungan browser tertentu.
4. Menangani data lokal dengan struktur rusak dan memvalidasi impor transaksi.
5. Membuat reset pendapatan tetap mempertahankan riwayat transaksi untuk audit.
6. Mencatat mutasi saat reset stok dan memperjelas input penyesuaian stok fisik.
7. Memperbaiki lebar header mobile dan memeriksa enam breakpoint.

## Batasan yang belum bisa dihapus tanpa backend

- Transaksi, stok, pendapatan, feedback, dan draft admin tetap tersimpan secara lokal pada browser/perangkat yang menyimpannya.
- Transaksi pada HP siswa tidak otomatis masuk ke HP admin. Data harus dikumpulkan melalui prosedur ekspor/impor manual.
- Halaman dan PIN admin berbasis JavaScript tidak memberikan autentikasi yang aman karena source code situs statis dapat dibaca publik.
- QRIS tidak terverifikasi otomatis. Status laporan pembeli perlu dibandingkan oleh pengelola dengan sumber pembayaran resmi.
- Gambar QRIS, QR WhatsApp, dan nomor WhatsApp merchant harus diisi oleh pemilik sebelum digunakan sungguhan.

## Catatan verifikasi

Hasil di atas menggambarkan pengujian otomatis dan interaksi lokal yang benar-benar dijalankan. Pengujian langsung di URL GitHub Pages, dengan gambar QR asli, serta pada perangkat fisik belum dilakukan karena URL deployment dan berkas QR belum tersedia.
