import {Store,saveOrThrow} from './storage.js';
import {uid} from './utils.js';
import {cartDetails,clearCart} from './cart.js';
export function getTransactions(){return Store.get('transactions',[]).filter(t=>t&&typeof t.id==='string').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));}
export function getImportedTransactions(){return Store.get('importedTransactions',[]).filter(t=>t&&typeof t.id==='string').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));}
export function allKnownTransactions(){return [...getTransactions().map(t=>({...t,sourceLabel:'Perangkat ini'})),...getImportedTransactions().map(t=>({...t,sourceLabel:'Hasil impor'}))];}
export function createTransaction(products,paymentMethod,options={}){
  const detail=cartDetails(products);
  if(!detail.length)throw new Error('Keranjang masih kosong.');
  const missing=detail.find(i=>!i.product||i.product.isActive===false||Number(i.product.stock)<=0);
  if(missing)throw new Error(`Produk ${missing.product?.name||missing.productId} tidak tersedia di katalog terakhir. Periksa keranjang sebelum melanjutkan.`);
  const items=detail.map(i=>({productId:i.product.id,name:i.product.name,categoryId:i.product.categoryId,unit:i.product.unit||'buah',unitPrice:Math.round(Number(i.product.price)),quantity:i.qty,subtotal:Math.round(Number(i.product.price))*i.qty,image:i.product.image||''}));
  const subtotal=items.reduce((sum,i)=>sum+i.subtotal,0);
  if(!Number.isSafeInteger(subtotal)||subtotal<0)throw new Error('Perhitungan subtotal tidak valid. Periksa harga produk.');
  if(!['cash','qris'].includes(paymentMethod))throw new Error('Pilih metode pembayaran yang tersedia.');
  const wantsDiscount=options.containerDiscountApplied===true;
  const percent=wantsDiscount?Math.max(0,Math.min(50,Math.round(Number(options.containerDiscountPercent)||0))):0;
  const discountAmount=percent>0?Math.min(subtotal,Math.round(subtotal*percent/100)):0;
  const total=subtotal-discountAmount;
  const transaction={id:uid('KK'),createdAt:new Date().toISOString(),items,subtotal,discountAmount,discountPercent:percent,discountReason:discountAmount?'Wadah sendiri':'',containerDiscountStatus:discountAmount?'pengajuan-bukti-whatsapp-menunggu-pemeriksaan':'tidak-ada',containerDiscountStatusLabel:discountAmount?'Diskon diajukan; bukti WhatsApp menunggu pemeriksaan':'Tidak ada diskon wadah',total,paymentMethod,paymentStatus:'reported-paid',paymentStatusLabel:'Dilaporkan sudah dibayar',reconciliationStatus:'not-checked',source:'local',sourceLabel:'Transaksi lokal pada perangkat ini',currency:'IDR',schemaVersion:1};
  const list=getTransactions();
  saveOrThrow('transactions',[transaction,...list]);
  try { clearCart(); } catch(error) { Store.set('transactions',list); throw new Error(`Transaksi belum dapat diselesaikan karena keranjang gagal diperbarui. ${error.message}`); }
  return transaction;
}
export function importTransactions(list){
  const existing=getImportedTransactions();const localIds=new Set([...getTransactions(),...existing].map(t=>t.id));
  const duplicates=list.filter(t=>localIds.has(t.id));
  const fresh=list.filter(t=>!localIds.has(t.id));
  saveOrThrow('importedTransactions',[...fresh.map(t=>({...t,source:'imported',sourceLabel:'Hasil impor'})),...existing]);
  return {imported:fresh.length,duplicates:duplicates.map(t=>t.id)};
}
export function transactionTotals(transactions){return transactions.reduce((acc,t)=>{acc.count++;acc.total+=Number(t.total)||0;if(t.paymentMethod==='cash')acc.cash+=Number(t.total)||0;if(t.paymentMethod==='qris')acc.qris+=Number(t.total)||0;return acc;},{count:0,total:0,cash:0,qris:0});}
