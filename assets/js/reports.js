import {downloadCSV,downloadJSON,safeFilename} from './utils.js';
import {Store} from './storage.js';
import {getTransactions,getImportedTransactions} from './transactions.js';
export function exportProducts(products){downloadJSON(products,'products-github.json');}
export function exportTransactionsJSON(transactions,filename='transaksi-lokal.json'){downloadJSON({exportedAt:new Date().toISOString(),type:'kantin-kejujuran-transactions',schemaVersion:1,transactions},filename);}
export function exportTransactionsCSV(transactions,filename='laporan-transaksi.csv'){
  const rows=[['ID Transaksi','Tanggal','Metode','Status Pembayaran','Total (Rp)','Sumber','Rincian Barang']];
  transactions.forEach(t=>rows.push([t.id,t.createdAt,t.paymentMethod==='cash'?'Tunai':'QRIS',t.paymentStatusLabel||t.paymentStatus||'Belum diperiksa',Number(t.total)||0,t.sourceLabel||t.source||'Tidak diketahui',(t.items||[]).map(i=>`${i.name} x${i.quantity} @${i.unitPrice??i.price}`).join(' | ')]));
  downloadCSV(rows,filename);
}
export function exportBackup(){
  const createdAt=new Date().toISOString();
  Store.set('lastBackupAt',createdAt);
  const local={
    cart:Store.get('cart',[]),
    transactions:getTransactions(),
    importedTransactions:getImportedTransactions(),
    catalogDraft:Store.get('catalogDraft',null),
    categoryDraft:Store.get('categoryDraft',null),
    settingsLocal:Store.get('settingsLocal',{}),
    settingsDraft:Store.get('settingsDraft',{}),
    feedback:Store.get('feedback',[]),
    stockMovements:Store.get('stockMovements',[]),
    reconciliations:Store.get('reconciliations',[]),
    guideProgress:Store.get('guideProgress',0),
    lastBackupAt:createdAt
  };
  downloadJSON({app:'Kantin Kejujuran',backupVersion:1,createdAt,local},'cadangan-kantin-kejujuran.json');
}
export function exportFeedbackCSV(feedback){downloadCSV([['ID Lokal','Tanggal','Kategori','Pesan','Status'],...feedback.map(f=>[f.id,f.createdAt,f.category,f.message,f.status])],'masukan-kantin.csv');}
export function exportStockCSV(moves){downloadCSV([['ID','ID Produk','Jenis','Kuantitas','Alasan','Waktu'],...moves.map(m=>[m.id,m.productId,m.type,m.quantity,m.note,m.createdAt])],'mutasi-stok-lokal.csv');}
export function exportReconciliationCSV(rows){downloadCSV([['ID','Tanggal Pemeriksaan','Metode','Nilai Dilaporkan','Nilai Aktual','Selisih','Catatan','Status'],...rows.map(r=>[r.id,r.date,r.method,Number(r.reported)||0,Number(r.actual)||0,(Number(r.actual)||0)-(Number(r.reported)||0),r.note,r.status])],'rekonsiliasi-lokal.csv');}
export function productExportFilename(){return `products-github-${safeFilename(new Date().toISOString().slice(0,10))}.json`;}
