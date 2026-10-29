import {Store,saveOrThrow} from './storage.js';
import {validateProduct} from './validation.js';
import {slugify,uid} from './utils.js';
function stableSerialize(value){
  if(Array.isArray(value))return `[${value.map(stableSerialize).join(',')}]`;
  if(value&&typeof value==='object')return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function draftMatchesPublished(draft,published){
  try{return stableSerialize(draft)===stableSerialize(published);}catch{return false;}
}
export function getDraftProducts(publicProducts){
  const draft=Store.get('catalogDraft',null);
  if(!Array.isArray(draft))return structuredClone(publicProducts);
  // When the pushed catalog matches this draft, discard it so later public updates aren't shadowed locally.
  if(draftMatchesPublished(draft,publicProducts)){Store.remove('catalogDraft');return structuredClone(publicProducts);}
  return draft;
}
export function saveDraftProducts(products){saveOrThrow('catalogDraft',products);return products;}
export function getDraftCategories(publicCategories){
  const draft=Store.get('categoryDraft',null);
  if(!Array.isArray(draft))return structuredClone(publicCategories);
  if(draftMatchesPublished(draft,publicCategories)){Store.remove('categoryDraft');return structuredClone(publicCategories);}
  return draft;
}
export function saveDraftCategories(categories){saveOrThrow('categoryDraft',categories);return categories;}
export function upsertProduct(formValue,products,editingId=''){
  const candidate={...formValue,id:editingId||formValue.id||slugify(formValue.name)};
  const checked=validateProduct(candidate,products,editingId);
  if(!checked.valid) return checked;
  const out=products.filter(p=>p.id!==editingId);
  out.unshift(checked.value);
  saveDraftProducts(out);
  return {valid:true,value:checked.value,products:out};
}
export function createStockMovement(input){
  const movement={id:uid('STK'),productId:input.productId,type:input.type,quantity:Number(input.quantity),note:String(input.note||'').trim(),createdAt:new Date().toISOString(),source:'local'};
  if(!Number.isSafeInteger(movement.quantity)||movement.quantity<0||(movement.quantity===0&&movement.type!=='penyesuaian'))throw new Error('Jumlah mutasi harus berupa bilangan bulat non-negatif untuk penyesuaian, atau positif untuk mutasi lainnya.');
  const list=Store.get('stockMovements',[]);saveOrThrow('stockMovements',[movement,...list]);return movement;
}
export function saveReconciliation(input){
  const row={id:uid('REK'),date:input.date,method:input.method,reported:Number(input.reported),actual:Number(input.actual),note:String(input.note||'').trim(),status:input.status||'belum-diverifikasi',createdAt:new Date().toISOString()};
  if(!Number.isSafeInteger(row.reported)||row.reported<0||!Number.isSafeInteger(row.actual)||row.actual<0)throw new Error('Nilai harus berupa rupiah bulat yang tidak negatif.');
  const list=Store.get('reconciliations',[]);saveOrThrow('reconciliations',[row,...list]);return row;
}
