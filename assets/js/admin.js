import {Store,saveOrThrow} from './storage.js';
import {validateProduct} from './validation.js';
import {slugify,uid} from './utils.js';
export function getDraftProducts(publicProducts){const draft=Store.get('catalogDraft',null);return Array.isArray(draft)?draft:structuredClone(publicProducts);}
export function saveDraftProducts(products){saveOrThrow('catalogDraft',products);return products;}
export function getDraftCategories(publicCategories){const draft=Store.get('categoryDraft',null);return Array.isArray(draft)?draft:structuredClone(publicCategories);}
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
