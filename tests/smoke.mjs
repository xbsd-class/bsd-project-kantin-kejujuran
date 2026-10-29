import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateProductsImport, validateImportedTransactions} from '../assets/js/validation.js';
import {addToCart, changeQuantity, cartTotals} from '../assets/js/cart.js';
import {createTransaction, getTransactions, importTransactions, getImportedTransactions} from '../assets/js/transactions.js';

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

console.log('PASS catalog validation and duplicate IDs');
console.log('PASS integer-rupiah cart totals and quantity changes');
console.log('PASS transaction snapshot, local storage, and reported-payment status');
console.log('PASS import validation and transaction duplicate handling');
