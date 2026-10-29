const PREFIX = 'kantin-kejujuran:v1:';
const fallbackValues = {
  cart: [], transactions: [], catalogDraft: null, categoryDraft: null, importedTransactions: [],
  settingsLocal: {theme:'light', primaryColor:'#18734a', accentColor:'#f4c95d', lowStockThreshold:5},
  feedback: [], stockMovements: [], reconciliations: [], guideProgress: 0, lastBackupAt: null, sellerCart: [], sellerShift: null, sellerShiftHistory: [], assetPreviews: {}
};
function key(name){ return PREFIX + name; }
export const Store = {
  get(name, fallback=undefined) {
    const def = fallback === undefined ? fallbackValues[name] : fallback;
    try {
      const raw = localStorage.getItem(key(name));
      if (raw === null) return structuredCloneSafe(def);
      return JSON.parse(raw);
    } catch (error) {
      return structuredCloneSafe(def);
    }
  },
  set(name, value) {
    try { localStorage.setItem(key(name), JSON.stringify(value)); return true; }
    catch (error) { return false; }
  },
  remove(name) { try { localStorage.removeItem(key(name)); return true; } catch { return false; } },
  clearAll() { try { Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).forEach(k=>localStorage.removeItem(k)); return true; } catch { return false; } },
  key(name){return key(name)},
  getUsage(){
    try { let bytes=0; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); if(k?.startsWith(PREFIX)) bytes += (k.length + localStorage.getItem(k).length)*2;} return bytes; }
    catch {return 0;}
  }
};
function structuredCloneSafe(value){
  if (value === undefined) return undefined;
  try { return structuredClone(value); } catch { return JSON.parse(JSON.stringify(value)); }
}
export function saveOrThrow(name, value){
  if (!Store.set(name,value)) throw new Error('Penyimpanan browser gagal. Ruang mungkin penuh atau penyimpanan dinonaktifkan. Ekspor cadangan bila masih memungkinkan.');
  return value;
}
