# Kantin Kejujuran — GitHub Pages Edition

Website kantin mandiri bernuansa laut dengan HTML, CSS, dan JavaScript vanilla. Halaman storefront (`index.html`) berisi CSS dan JavaScript dalam satu file supaya relatif mudah diedit manual. `admin.html` adalah dashboard pengelola terpisah. `kantin-config.json` berisi katalog serta pengaturan publik yang dapat dibagikan lewat repository.

## Fitur

- Katalog interaktif **Krabby Picks**, pencarian, kategori, pengurutan, dan status stok.
- Keranjang dengan jumlah, subtotal, dan perhitungan Rupiah.
- Alur **Squidward's Checkout**, pernyataan kejujuran, kode **Shellback Reward**, tampilan QRIS, konfirmasi manual, dan bukti transaksi.
- Tahap **Squid's Eye Check!** dengan tautan WhatsApp jika nomor admin sudah dikonfigurasi.
- Halaman **Squidward approves!** dengan cetak/simpan PDF, unduh bukti JSON, dan **Bubble Board** untuk rating serta kritik/saran.
- Riwayat transaksi lokal, manajemen katalog, reset stok, reset pendapatan, ekspor/impor produk dan transaksi, rekonsiliasi, mutasi stok, pengaturan voucher, dan backup.
- Semua aset visual ilustrasi utama dibuat inline dalam HTML; tidak membutuhkan framework, npm, server aplikasi, atau library CDN.

## Data produk awal

| Produk | Harga | Stok awal |
|---|---:|---:|
| Gantungan Kunci | Rp6.000/pcs | 9 |
| Bakpau Kacang Hijau | Rp2.000/pcs | 20 |
| Dimsum Sayur | Rp2.500/pcs | 20 |
| Jus Buah | Rp6.000/cup | 20 |

## Memasang QRIS dan WhatsApp

1. Buat folder `assets` di repository jika belum ada.
2. Simpan gambar QRIS resmi merchant sebagai `assets/qris.png`.
3. Simpan QR akun WhatsApp resmi sebagai `assets/whatsapp-qr.png` (opsional).
4. Buka `kantin-config.json`, lalu isi `whatsappNumber` dengan nomor WhatsApp dalam format internasional tanpa `+`, spasi, atau tanda hubung. Contoh format: `62812xxxxxxxx`.
5. Pastikan `qrisImage` berisi `assets/qris.png` dan `whatsappQrImage` berisi `assets/whatsapp-qr.png`.
6. Commit gambar dan perubahan konfigurasi ke GitHub. Jangan menggunakan QRIS palsu atau gambar QRIS yang belum dicek nama penerimanya.

Jika file QR belum ada, website sengaja menampilkan placeholder dan keterangan agar tidak menyesatkan.

## Mengubah kode akses dashboard

Di bagian atas script pada `admin.html`, ubah:

```js
const ADMIN_PIN = 'KJ2026';
```

menjadi kode yang kamu pilih. Ini hanya pengunci tampilan, **bukan autentikasi aman**: karena kode ada di JavaScript yang dikirim ke browser, orang yang memahami source code dapat menemukannya. Jangan simpan data rahasia atau mengandalkan halaman ini untuk keamanan produksi. GitHub Pages tanpa backend tidak bisa menyediakan akses admin yang benar-benar privat.

## Mengubah voucher Shellback Reward

- Atur `voucherCode` dan `discountPercent` dari dashboard admin. Voucher diberikan secara manual via WhatsApp setelah pembeli mengonfirmasi membawa wadah sendiri.
- Tekan **Ekspor untuk GitHub** untuk mengunduh `kantin-config.json`.
- Unggah file ekspor itu ke root repository dan commit perubahan agar seluruh pengunjung membaca konfigurasi baru.
- Kode voucher yang ditanam dalam situs statis tidak bisa dianggap rahasia/sekali pakai. Siapa pun yang tahu kodenya dapat menirunya. Pemberian kode lewat WhatsApp adalah alur manual, bukan validasi server.

## Cara menerbitkan di GitHub Pages

1. Buat repository baru di GitHub, misalnya `kantin-kejujuran`.
2. Unggah `index.html`, `admin.html`, `kantin-config.json`, `README.md`, dan folder `assets` bila sudah diisi gambar QR.
3. Buka **Settings → Pages** pada repository.
4. Di bagian **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, kemudian tekan **Save**.
6. Tunggu proses Pages dari GitHub selesai, lalu buka URL yang ditampilkan di bagian Pages. Alamat umumnya berbentuk `https://USERNAME.github.io/REPOSITORY/`.
7. Setelah mengubah kode atau konfigurasi, commit perubahan ke branch yang diterbitkan. GitHub Pages akan memperbarui berkas statis.

Tak perlu Node.js, npm, build, backend, database berbayar, atau layanan deployment lain.

## Catatan penting tentang arsitektur statis

GitHub Pages menyajikan file statis. `localStorage` terpisah per browser/perangkat, sehingga:

- Keranjang, transaksi, feedback, stok sesudah transaksi, dan angka pendapatan disimpan di perangkat yang membuatnya.
- Transaksi dari HP siswa **tidak otomatis masuk** ke dashboard admin di laptop/HP pemilik.
- Reset pendapatan mengatur ulang penghitung pendapatan tanpa menghapus riwayat transaksi. ID transaksi yang sudah ada dikecualikan dari penghitung; transaksi baru tetap dihitung.
- Reset stok mengembalikan stok lokal ke nilai awal produk dan mencatat perubahan tersebut di mutasi stok.
- Perubahan katalog dari dashboard tidak otomatis mengubah situs publik; ekspor `kantin-config.json`, lalu commit ke GitHub.
- Status pembayaran setelah pembeli menekan tombol adalah **“Dilaporkan sudah dibayar”**, bukan pembayaran yang telah diverifikasi. Admin harus memeriksa bukti resmi.
- Screenshot bukti transfer harus dilampirkan sendiri di WhatsApp. Website tidak mengirim file gambar secara otomatis.
- QRIS ditampilkan sebagai aset; situs ini tidak memverifikasi pembayaran otomatis dan tidak terhubung ke payment gateway.
- Rating/masukan lokal tidak otomatis terkumpul dari semua perangkat.

Untuk penggunaan kelas, cara tanpa backend adalah menggunakan satu perangkat/kios untuk transaksi, atau meminta siswa mengirimkan bukti/berkas transaksi secara manual lalu mengimpor JSON ke dashboard. Untuk stok dan pendapatan yang benar-benar tersinkron real-time dengan admin, diperlukan backend/database bersama—hal ini memang tidak tersedia pada GitHub Pages saja.

## Penyesuaian kode

- Storefront: semua CSS dan JavaScript ada di `index.html`.
- Dashboard: CSS dan JavaScript ada di `admin.html`.
- Produk, voucher publik, path QRIS, dan nomor WhatsApp: `kantin-config.json`.
- Ilustrasi produk: fungsi `productArt()` pada `index.html` (untuk visual kartu) dan `productEmoji()` pada `admin.html` (untuk daftar admin).

## Pemeriksaan yang dilakukan

Versi proyek ini disusun dengan HTML/CSS/JavaScript vanilla dan tanpa request wajib ke API eksternal. Lakukan pengujian akhir di browser setelah mengunggah ke GitHub Pages—terutama alur checkout, QRIS yang sudah diganti dengan gambar resmi, tautan WhatsApp, serta ukuran layar HP. Stok/pendapatan lintas perangkat sengaja tidak diklaim sebagai fitur tersinkron.
