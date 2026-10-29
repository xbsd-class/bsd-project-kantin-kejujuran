import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
class StorageMock {
  constructor(){ this.data = new Map(); }
  getItem(k){ return this.data.has(k) ? this.data.get(k) : null; }
  setItem(k,v){ this.data.set(k,String(v)); }
  removeItem(k){ this.data.delete(k); }
  key(i){ return [...this.data.keys()][i] ?? null; }
  get length(){ return this.data.size; }
}
globalThis.localStorage = new StorageMock();
globalThis.sessionStorage = new StorageMock();
const nodes = new Map();
const nodeFor = key => {
  if (!nodes.has(key)) nodes.set(key, {
    innerHTML:'', hidden:false, style:{}, dataset:{}, value:'', checked:false,
    classList:{toggle(){}}, addEventListener(){}, remove(){}, append(){}, click(){}, focus(){},
    querySelector(){return null;}, querySelectorAll(){return []},
    setAttribute(){}, removeAttribute(){}, textContent:'',
  });
  return nodes.get(key);
};
const handlers = new Map();
globalThis.document = {
  querySelector: sel => nodeFor(sel),
  querySelectorAll: () => [],
  getElementById: id => nodes.get(`#${id}`) || null,
  createElement: tag => ({tagName:tag.toUpperCase(),id:'',className:'',style:{},textContent:'',innerHTML:'',dataset:{},append(){},remove(){},click(){},addEventListener(){},setAttribute(){}}),
  addEventListener(type,fn){ const key=`document:${type}`; const list=handlers.get(key)||[];list.push(fn);handlers.set(key,list); },
  body:{classList:{toggle(){}}},
  head:{append(){}},
};
globalThis.location = {hash:'#/home'};
globalThis.window = {
  addEventListener(type,fn){ const list=handlers.get(type)||[];list.push(fn);handlers.set(type,list); },
  matchMedia(){return {matches:false};}, scrollTo(){}, setTimeout, clearTimeout,
};
globalThis.fetch = async input => {
  const name = String(input).replace(/^\.\/data\//,'');
  const file = path.join(root,'data',name);
  try { const contents=fs.readFileSync(file,'utf8'); return {ok:true,status:200,json:async()=>JSON.parse(contents)}; }
  catch { return {ok:false,status:404,json:async()=>({})}; }
};
await import('../assets/js/app.js?render-smoke=1');
await new Promise(resolve=>setTimeout(resolve,25));
const main = nodeFor('#main-content');
assert.ok(main.innerHTML.includes('Kejujuran Dimulai dari'), 'buyer home renders');

function changeRoute(hash){
  location.hash=hash;
  for(const fn of handlers.get('hashchange')||[]) fn();
}
changeRoute('#/admin');
assert.ok(main.innerHTML.includes('Dashboard Admin'), 'admin route renders PIN gate');
sessionStorage.setItem('kantin-kejujuran:dashboard-unlocked:admin',String(Date.now()+60_000));
changeRoute('#/admin/customize');
assert.ok(main.innerHTML.includes('Studio landing page'), 'admin customization renders after unlocking');
const publicSettings=JSON.parse(fs.readFileSync(path.join(root,'data','settings.json'),'utf8'));
localStorage.setItem('kantin-kejujuran:v1:settingsDraft',JSON.stringify(publicSettings));
changeRoute('#/admin');
assert.equal(localStorage.getItem('kantin-kejujuran:v1:settingsDraft'),null,'a draft matching the pushed public settings is cleared');
changeRoute('#/seller');
assert.ok(main.innerHTML.includes('Dashboard Penjual'), 'seller route renders PIN gate');
sessionStorage.setItem('kantin-kejujuran:dashboard-unlocked:seller',String(Date.now()+60_000));
changeRoute('#/seller/sales');
assert.ok(main.innerHTML.includes('Kasir / POS lokal'), 'seller POS renders after unlocking');
const publicProducts=JSON.parse(fs.readFileSync(path.join(root,'data','products.json'),'utf8'));
localStorage.setItem('kantin-kejujuran:v1:catalogDraft',JSON.stringify(publicProducts));
changeRoute('#/seller');
assert.equal(localStorage.getItem('kantin-kejujuran:v1:catalogDraft'),null,'a draft matching the pushed public catalog is cleared');
changeRoute('#/admin/data');
sessionStorage.setItem('kantin-kejujuran:dashboard-unlocked:admin',String(Date.now()+60_000));
changeRoute('#/admin/data');
assert.ok(main.innerHTML.includes('Buat rekap dari transaksi terkumpul'), 'admin data export controls render');
console.log('PASS buyer home render');
console.log('PASS admin PIN gate and customization page render');
console.log('PASS seller PIN gate and POS page render');
console.log('PASS admin publication and transparency-summary controls render');
console.log('PASS matching local drafts reconcile after published settings/catalog are loaded');
