import {slugify} from './utils.js';
export function validateProduct(input, existing=[], originalId='') {
  const errors = {};
  const name = String(input.name ?? '').trim();
  const price = Number(input.price);
  const stock = Number(input.stock);
  const threshold = Number(input.lowStockThreshold ?? 5);
  const categoryId = String(input.categoryId ?? '').trim();
  if (name.length < 2 || name.length > 90) errors.name = 'Nama produk harus terdiri dari 2–90 karakter.';
  if (!Number.isSafeInteger(price) || price < 0 || price > 100000000) errors.price = 'Harga harus berupa rupiah bulat yang valid.';
  if (!Number.isSafeInteger(stock) || stock < 0 || stock > 1000000) errors.stock = 'Stok harus berupa bilangan bulat 0 atau lebih.';
  if (!Number.isSafeInteger(threshold) || threshold < 0 || threshold > 1000000) errors.lowStockThreshold = 'Ambang stok tidak valid.';
  if (!categoryId) errors.categoryId = 'Pilih kategori produk.';
  const candidateId = String(input.id || slugify(name));
  if (!candidateId || candidateId.length > 90) errors.id = 'ID produk tidak valid.';
  if (existing.some(p => p.id === candidateId && p.id !== originalId)) errors.id = 'ID produk sudah digunakan. Ubah nama atau ID.';
  const image = String(input.image || 'assets/images/products/placeholder-product.svg');
  if (!/^(\.\/)?assets\/[a-z0-9_./-]+$/i.test(image) || image.includes('..')) errors.image = 'Gunakan path aset gambar lokal di folder assets/ tanpa URL eksternal atau path keluar folder.';
  return {valid:Object.keys(errors).length===0, errors, value:{id:candidateId,name,description:String(input.description??'').trim().slice(0,500),categoryId,price,unit:String(input.unit||'buah').trim().slice(0,24),stock,lowStockThreshold:threshold,image,isActive:input.isActive!==false,updatedAt:new Date().toISOString()}};
}
export function validateProductsImport(value) {
  if (!Array.isArray(value)) throw new Error('Format JSON katalog harus berupa array produk.');
  if (value.length > 1000) throw new Error('Katalog berisi terlalu banyak produk (maksimal 1.000).');
  const ids = new Set();
  const out = [];
  value.forEach((p,i)=>{
    if (!p || typeof p!=='object' || Array.isArray(p)) throw new Error(`Produk ke-${i+1} bukan objek yang valid.`);
    const result = validateProduct(p, out, '');
    if (!result.valid) throw new Error(`Produk ke-${i+1} (${String(p.name||'tanpa nama').slice(0,40)}): ${Object.values(result.errors)[0]}`);
    if(ids.has(result.value.id)) throw new Error(`ID produk \"${result.value.id}\" muncul lebih dari sekali.`);
    ids.add(result.value.id);
    out.push({...result.value, updatedAt: typeof p.updatedAt==='string' ? p.updatedAt : new Date().toISOString()});
  });
  return out;
}
export function validateImportedTransactions(value) {
  const list = Array.isArray(value) ? value : value?.transactions;
  if (!Array.isArray(list)) throw new Error('Berkas harus berisi array transaksi atau objek dengan properti transactions.');
  if(list.length>10000) throw new Error('Maksimal 10.000 transaksi per berkas.');
  const seenIds = new Set();
  return list.map((tx,i)=>{
    if(!tx || typeof tx!=='object' || typeof tx.id!=='string' || !Array.isArray(tx.items)) throw new Error(`Struktur transaksi ke-${i+1} tidak valid.`);
    if(seenIds.has(tx.id)) throw new Error(`ID transaksi \"${tx.id}\" muncul lebih dari sekali di dalam berkas.`);
    seenIds.add(tx.id);
    const total = Number(tx.total);
    if(!Number.isSafeInteger(total)||total<0) throw new Error(`Total transaksi ke-${i+1} tidak valid.`);
    if(!tx.items.every(it=>Number.isSafeInteger(Number(it.quantity))&&Number(it.quantity)>0&&Number.isSafeInteger(Number(it.unitPrice??it.price))&&Number(it.unitPrice??it.price)>=0)) throw new Error(`Rincian barang transaksi ke-${i+1} tidak valid.`);
    return {...tx, source:'imported', importedAt:new Date().toISOString()};
  });
}
