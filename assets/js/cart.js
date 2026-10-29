import {Store,saveOrThrow} from './storage.js';
export const getCart = () => Store.get('cart',[]).filter(i=>i&&typeof i.productId==='string'&&Number.isSafeInteger(Number(i.qty))&&Number(i.qty)>0).map(i=>({productId:i.productId,qty:Number(i.qty)}));
export function setCart(items){saveOrThrow('cart',items);return items;}
export function addToCart(product,qty=1){
  if(!product||product.isActive===false||Number(product.stock)<=0) throw new Error('Produk ini sedang tidak tersedia.');
  const list=getCart(); const found=list.find(i=>i.productId===product.id);
  if(found) found.qty += qty; else list.push({productId:product.id,qty});
  if(found?.qty>99 || qty>99) throw new Error('Maksimal 99 unit untuk satu produk.');
  setCart(list); return list;
}
export function changeQuantity(productId,delta){
  const list=getCart();const it=list.find(i=>i.productId===productId);if(!it)return list;
  it.qty += delta;if(it.qty<=0)return removeFromCart(productId);if(it.qty>99)throw new Error('Maksimal 99 unit untuk satu produk.');setCart(list);return list;
}
export function removeFromCart(productId){const list=getCart().filter(i=>i.productId!==productId);setCart(list);return list;}
export function clearCart(){setCart([]);}
export function cartDetails(products){return getCart().map(item=>{const p=products.find(x=>x.id===item.productId);return p?{...item,product:p,subtotal:Math.round(Number(p.price))*item.qty,available:p.isActive!==false&&Number(p.stock)>0}: {...item,product:null,subtotal:0,available:false};});}
export function cartTotals(products){const items=cartDetails(products);return {items,count:items.reduce((n,i)=>n+i.qty,0),total:items.reduce((n,i)=>n+i.subtotal,0),unavailable:items.filter(i=>!i.available)};}
