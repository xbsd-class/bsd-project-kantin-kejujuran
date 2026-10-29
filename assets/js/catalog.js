export const fallbackProducts = [
  {id:'air-mineral-600',name:'Air Mineral',description:'Air mineral kemasan untuk menemani aktivitas sekolah.',categoryId:'minuman',price:3000,unit:'botol',stock:24,lowStockThreshold:6,image:'assets/images/products/air-mineral.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'},
  {id:'roti-cokelat',name:'Roti Cokelat',description:'Roti lembut dengan isian cokelat.',categoryId:'makanan',price:4000,unit:'buah',stock:12,lowStockThreshold:4,image:'assets/images/products/roti.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'},
  {id:'biskuit-susu',name:'Biskuit Susu',description:'Biskuit renyah dalam kemasan praktis.',categoryId:'makanan',price:2500,unit:'bungkus',stock:18,lowStockThreshold:5,image:'assets/images/products/biskuit.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'},
  {id:'teh-kotak',name:'Teh Kotak',description:'Minuman teh siap minum.',categoryId:'minuman',price:4000,unit:'kotak',stock:9,lowStockThreshold:4,image:'assets/images/products/teh.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'},
  {id:'pensil-2b',name:'Pensil 2B',description:'Pensil untuk menulis dan mengerjakan tugas.',categoryId:'alat-tulis',price:2000,unit:'batang',stock:15,lowStockThreshold:5,image:'assets/images/products/pensil.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'},
  {id:'buku-tulis',name:'Buku Tulis',description:'Buku tulis bergaris untuk catatan sekolah.',categoryId:'alat-tulis',price:5000,unit:'buku',stock:7,lowStockThreshold:3,image:'assets/images/products/buku.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'},
  {id:'penghapus',name:'Penghapus',description:'Penghapus putih untuk alat tulis sehari-hari.',categoryId:'perlengkapan-sekolah',price:1500,unit:'buah',stock:3,lowStockThreshold:5,image:'assets/images/products/penghapus.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'},
  {id:'mi-goreng',name:'Mi Goreng Cup',description:'Mi cup praktis. Perhatikan petunjuk penyajian pada kemasan.',categoryId:'makanan',price:6000,unit:'cup',stock:0,lowStockThreshold:4,image:'assets/images/products/mi.svg',isActive:true,updatedAt:'2026-10-29T08:00:00.000Z'}
];
export const fallbackCategories = [{id:'makanan',name:'Makanan',isActive:true},{id:'minuman',name:'Minuman',isActive:true},{id:'alat-tulis',name:'Alat Tulis',isActive:true},{id:'perlengkapan-sekolah',name:'Perlengkapan Sekolah',isActive:true},{id:'lainnya',name:'Lainnya',isActive:true}];
export const fallbackSettings = {name:'Kantin Kejujuran',logoPath:'assets/images/logo.svg',demoMode:true,catalogNote:'Harga dan jumlah stok pada katalog awal adalah data contoh. Ganti dan verifikasi sebelum digunakan di kantin sungguhan.',tagline:'Ambil Sesuai Kebutuhan, Bayar Sesuai Kejujuran.',description:'Kantin mandiri yang membangun kebiasaan jujur, tanggung jawab, dan saling percaya.',primaryColor:'#18734a',accentColor:'#f4c95d',operatingHours:'Hari sekolah · sesuai jadwal sekolah',manager:'Pengelola Kantin Sekolah',cashEnabled:true,qrisEnabled:false,qrisImage:'',qrisInstructions:'Gunakan QRIS resmi yang dipasang pengelola di area kantin.',catalogUpdatedAt:'2026-10-29T08:00:00.000Z',transparencyUpdatedAt:'2026-10-29T08:00:00.000Z',announcement:'Selamat datang! Pastikan barang yang diambil sesuai dengan catatan belanja.',publicSummaryAvailable:false,publicSummaryNote:'Data rekap bersama belum tersedia. Statistik perangkat tidak mewakili seluruh sekolah.'};
const fallbackAnnouncements = [{id:'welcome',title:'Selamat datang di Kantin Kejujuran',message:'Belanja mandiri dimulai dengan mencatat barang secara benar dan membayar sesuai total.',date:'2026-10-29',isActive:true}];
const fallbackTransparency = {updatedAt:'2026-10-29T08:00:00.000Z',hasVerifiedCommunityStats:false,hasReportedCommunitySummary:false,summary:null,method:'Rekap publik hanya diterbitkan setelah data dari perangkat yang berpartisipasi dikumpulkan, diperiksa, dan disetujui pengelola.',notes:['Riwayat transaksi pada HP bersifat lokal dan tidak otomatis terkumpul.','Status pembayaran pada catatan mandiri merupakan laporan pembeli sampai ada pemeriksaan resmi.','Informasi stok mengikuti katalog terakhir yang diterbitkan dan dapat berbeda dari kondisi fisik.']};
async function loadJSON(path, fallback) { try { const r=await fetch(`./data/${path}`,{cache:'no-cache'}); if(!r.ok) throw new Error(`HTTP ${r.status}`); return await r.json(); } catch(error){return fallback;} }
export async function loadPublicData(){
  const paths = await Promise.all([
    loadJSON('products.json',fallbackProducts), loadJSON('categories.json',fallbackCategories), loadJSON('settings.json',fallbackSettings), loadJSON('announcements.json',fallbackAnnouncements), loadJSON('transparency.json',fallbackTransparency)
  ]);
  const fallbackUsed = paths.some((v,i)=>v===([fallbackProducts,fallbackCategories,fallbackSettings,fallbackAnnouncements,fallbackTransparency][i]));
  const products = Array.isArray(paths[0]) ? paths[0] : fallbackProducts;
  const categories = Array.isArray(paths[1]) ? paths[1] : fallbackCategories;
  const settings = paths[2] && typeof paths[2]==='object' ? paths[2] : fallbackSettings;
  const announcements = Array.isArray(paths[3]) ? paths[3] : fallbackAnnouncements;
  const transparency = paths[4] && typeof paths[4]==='object' ? paths[4] : fallbackTransparency;
  return {products,categories,settings,announcements,transparency,fallbackUsed};
}
export const activeProducts = products => products.filter(p=>p && p.isActive!==false);
export const categoryName = (id,categories) => categories.find(c=>c.id===id)?.name || 'Lainnya';
export const stockLabel = p => p.stock===0?'Habis':p.stock<=Number(p.lowStockThreshold??5)?'Stok terbatas':'Tersedia';
export const stockClass = p => p.stock===0?'danger':p.stock<=Number(p.lowStockThreshold??5)?'warning':'success';
