export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export const money = value => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(Number.isFinite(Number(value)) ? Number(value) : 0).replace(/\u00a0/g,'');
export const shortDate = value => { const d = new Date(value); return Number.isNaN(d.getTime()) ? 'Tanggal tidak tersedia' : new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(d); };
export const dateTime = value => { const d = new Date(value); return Number.isNaN(d.getTime()) ? 'Waktu tidak tersedia' : new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short'}).format(d); };
export const uid = (prefix='KK') => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
export const slugify = value => String(value || '').toLocaleLowerCase('id-ID').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
export const safeFilename = value => slugify(value) || 'kantin-kejujuran';
export const icon = (name, size=18) => {
  const p = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    cart:'<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 8H5"/>',
    search:'<circle cx="10.8" cy="10.8" r="7.3"/><path d="m16.2 16.2 4.3 4.3"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    close:'<path d="m18 6-12 12M6 6l12 12"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    arrowLeft:'<path d="M19 12H5m6 6-6-6 6-6"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v5m0-8h.01"/>',
    alert:'<path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5m5-5v12"/>',
    printer:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6zM18 12h.01"/>',
    clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    receipt:'<path d="M4 3h16v18l-4-2-4 2-4-2-4 2Z"/><path d="M8 8h8m-8 4h8m-8 4h5"/>',
    wallet:'<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v16H6.5A2.5 2.5 0 0 1 4 17.5Z"/><path d="M4 7h15M15 12h5m-3-1v2"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h8m-8 4h8"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" transform="translate(-1 -1) scale(1.08)"/>',
    chart:'<path d="M3 3v18h18"/><path d="m18 9-5 5-4-4-4 5"/>',
    package:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/>',
    edit:'<path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15Z"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/>',
    moon:'<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.1-7.1-1.4 1.4M6.3 17.7l-1.4 1.4m14.2 0-1.4-1.4M6.3 6.3 4.9 4.9"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    coffee:'<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M17 10h2a2 2 0 1 1 0 4h-2M8 3v2m5-2v2"/>',
    leaf:'<path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-8 8-16Z"/><path d="M3 21c3-6 7-9 13-12"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/>',
    external:'<path d="M14 3h7v7m0-7-10 10"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3"/>',
    clipboard:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2m-7 6h8m-8 4h8"/>',
    message:'<path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.1-4.6A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    coins:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v5c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 10v5c0 1.7 3.6 3 8 3a19 19 0 0 0 4-.4M4 15v3c0 1.7 3.6 3 8 3"/>',
    checkCircle:'<circle cx="12" cy="12" r="10"/><path d="m8 12 2.5 2.5L16 9"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    sparkle:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2Z"/><path d="m19 15 1.1 2.4L22 18l-1.9.7L19 21l-.9-2.3L16 18l2.1-.6Z"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p[name]||p.info}</svg>`;
};
export function showToast(message, type='info') {
  const root = $('#toast-region'); if (!root) return;
  const symbol = type === 'success' ? 'checkCircle' : type === 'error' ? 'alert' : 'info';
  const item = document.createElement('div'); item.className = 'toast';
  item.innerHTML = `${icon(symbol,18)}<div>${escapeHtml(message)}</div>`;
  root.append(item); window.setTimeout(() => item.remove(), 4200);
}
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = filename; a.style.display = 'none'; document.body.append(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}
export function downloadJSON(value, filename='data.json') {
  downloadBlob(new Blob([JSON.stringify(value, null, 2)], {type:'application/json;charset=utf-8'}), filename);
}
export function downloadCSV(rows, filename='laporan.csv') {
  const csv = rows.map(row => row.map(v => { let text = String(v ?? ''); if (typeof v === 'string' && /^[=+@\-\t\r]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g,'""')}"`; }).join(';')).join('\r\n');
  downloadBlob(new Blob(['\ufeff', csv], {type:'text/csv;charset=utf-8'}), filename);
}
export async function readFileAsText(file, maxBytes=2_000_000) {
  if (!file) throw new Error('Pilih berkas terlebih dahulu.');
  if (file.size > maxBytes) throw new Error('Ukuran berkas terlalu besar (maksimal 2 MB).');
  return await file.text();
}
export function safeImage(src='') {
  const raw = String(src || '').trim();
  if (!raw || !/^(\.\/)?assets\/[a-z0-9_./-]+$/i.test(raw) || raw.includes('..')) return './assets/images/products/placeholder-product.svg';
  return `./${raw.replace(/^\.\//,'')}`;
}
export const formatDateInput = value => { const d = new Date(value); if (Number.isNaN(d.getTime())) return ''; return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
