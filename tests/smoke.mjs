import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateProductsImport, validateImportedTransactions} from '../assets/js/validation.js';
import {addToCart, changeQuantity, cartTotals} from '../assets/js/cart.js';
import {createTransaction, getTransactions, importTransactions, getImportedTransactions} from '../assets/js/transactions.js';
import {getDraftProducts, getDraftCategories} from '../assets/js/admin.js';
import {Store} from '../assets/js/storage.js';

class LocalStorageMock {
  constructor(){this.map=new Map();}
  getItem(key){return this.map.has(key)?this.map.get(key):null;}
  setItem(key,value){this.map.set(key,String(value));}
  removeItem(key){this.map.delete(key);}
  key(index){return [...this.map.keys()][index] ?? null;}
  get length(){return this.map.size;}
}
globalThis.localStorage = new LocalStorageMock();
const products = JSON.parse(fs.readFileSync(new URL('../data/products.json', import.meta.url), 'utf8'));

const validated = validateProductsImport(products);
assert.equal(validated.length, products.length, 'valid catalog imports');
assert.throws(()=>validateProductsImport([products[0],products[0]]), /ID produk/, 'duplicate product IDs rejected');

addToCart(products[0]);
addToCart(products[1], 2);
assert.equal(cartTotals(products).count, 3, 'cart quantity totals');
assert.equal(cartTotals(products).total, 11000, 'cart total in integer rupiah');
changeQuantity(products[1].id, -1);
assert.equal(cartTotals(products).total, 7000, 'quantity updates subtotal and total');

const tx = createTransaction(products, 'cash');
assert.equal(tx.total, 7000, 'transaction total matches final cart');
assert.equal(tx.paymentStatus, 'reported-paid', 'payment remains reported, not verified');
assert.equal(getTransactions().length, 1, 'transaction is saved locally');
assert.equal(cartTotals(products).count, 0, 'cart is cleared after local transaction save');
assert.equal(tx.items[0].unitPrice, 3000, 'transaction keeps a unit-price snapshot');

const wrapper = {type:'kantin-kejujuran-transactions', transactions:[tx]};
const imported = validateImportedTransactions(wrapper);
assert.equal(importTransactions(imported).duplicates.length, 1, 'already-known transaction ID is skipped');
assert.throws(()=>validateImportedTransactions([tx,tx]), /ID transaksi/, 'duplicate IDs inside one file rejected');
assert.equal(getImportedTransactions().length, 0, 'duplicate transaction is not imported twice');

addToCart(products[0]);
const discounted = createTransaction(products, 'cash', {containerDiscountApplied:true, containerDiscountPercent:5});
assert.equal(discounted.subtotal, 3000, 'discount keeps the order subtotal');
assert.equal(discounted.discountAmount, 150, 'container discount is rounded to integer rupiah');
assert.equal(discounted.total, 2850, 'discounted total is calculated from integer rupiah');
assert.equal(discounted.containerDiscountStatus, 'pengajuan-bukti-whatsapp-menunggu-pemeriksaan', 'discount remains pending manual WhatsApp review');

const publishedProducts=structuredClone(products);
const editedProducts=structuredClone(products);editedProducts[0].price+=500;
Store.set('catalogDraft',editedProducts);
assert.equal(getDraftProducts(publishedProducts)[0].price,publishedProducts[0].price+500,'edited draft is retained before publication');
Store.set('catalogDraft',structuredClone(publishedProducts));
assert.deepEqual(getDraftProducts(publishedProducts),publishedProducts,'draft equal to newly published catalog is reconciled');
assert.equal(Store.get('catalogDraft',null),null,'matching local product draft is cleared after publication');
const cats=JSON.parse(fs.readFileSync(new URL('../data/categories.json', import.meta.url), 'utf8'));
Store.set('categoryDraft',structuredClone(cats));
assert.deepEqual(getDraftCategories(cats),cats,'matching category draft is reconciled after publication');
assert.equal(Store.get('categoryDraft',null),null,'matching local category draft is cleared after publication');

console.log('PASS catalog validation and duplicate IDs');
console.log('PASS integer-rupiah cart totals and quantity changes');
console.log('PASS transaction snapshot, local storage, and reported-payment status');
console.log('PASS configurable container discount amount and pending WhatsApp-review status');
console.log('PASS import validation and transaction duplicate handling');
console.log('PASS local product/category drafts reconcile when their exported data is published');
