import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const jsonFiles = [
  'data/products.json',
  'data/categories.json',
  'data/settings.json',
  'data/announcements.json',
  'data/transparency.json',
  'manifest.json',
];
const parsed = new Map();
for (const relative of jsonFiles) {
  const full = path.join(root, relative);
  assert.ok(fs.existsSync(full), `Required file missing: ${relative}`);
  parsed.set(relative, JSON.parse(fs.readFileSync(full, 'utf8')));
}

const products = parsed.get('data/products.json');
const categories = parsed.get('data/categories.json');
const settings = parsed.get('data/settings.json');
assert.ok(Array.isArray(products), 'products.json must contain an array');
assert.ok(Array.isArray(categories), 'categories.json must contain an array');
assert.equal(new Set(products.map(p => p.id)).size, products.length, 'Product IDs must be unique');
assert.equal(new Set(categories.map(c => c.id)).size, categories.length, 'Category IDs must be unique');
const categoryIds = new Set(categories.map(c => c.id));
for (const product of products) {
  assert.ok(typeof product.id === 'string' && product.id.trim(), 'Every product needs an ID');
  assert.ok(typeof product.name === 'string' && product.name.trim(), `Product ${product.id} needs a name`);
  assert.ok(Number.isSafeInteger(product.price) && product.price >= 0, `Product ${product.id} price must be an integer rupiah amount`);
  assert.ok(Number.isSafeInteger(product.stock) && product.stock >= 0, `Product ${product.id} stock must be a nonnegative integer`);
  assert.ok(categoryIds.has(product.categoryId), `Product ${product.id} uses unknown category ${product.categoryId}`);
  const image = String(product.image || '');
  assert.ok(/^assets\/[a-z0-9_./-]+$/i.test(image) && !image.includes('..') && !image.includes('//'), `Product ${product.id} image must use a safe repository-local path`);
  assert.ok(fs.existsSync(path.join(root, image)), `Product image not found: ${image}`);
}
for (const key of ['enableCart','enableCheckout','enableProductManagement','enableRevenueReset','enableStockReset','enableSellerPOS','enableStockManagement','enableTransactions','enableAnonymousFeedback','enableTransparency','enableContainerDiscount']) {
  assert.equal(typeof settings[key], 'boolean', `settings.${key} must be a boolean toggle`);
}
assert.ok(Number.isSafeInteger(settings.containerDiscountPercent) && settings.containerDiscountPercent >= 1 && settings.containerDiscountPercent <= 50, 'containerDiscountPercent must be between 1 and 50');
assert.ok(typeof settings.whatsappAdminNumber === 'string', 'whatsappAdminNumber must be a string');
assert.ok(/^\d{0,15}$/.test(settings.whatsappAdminNumber), 'whatsappAdminNumber must contain digits only or be empty');
if (settings.enableContainerDiscount) assert.ok(settings.whatsappAdminNumber.length >= 8, 'Own-container discount needs a configured WhatsApp admin number');
for (const relative of ['index.html','404.html','assets/js/app.js','assets/js/transactions.js','.github/workflows/deploy.yml','tests/smoke.mjs','tests/dashboard-static-smoke.mjs','tests/render-smoke.mjs']) assert.ok(fs.existsSync(path.join(root, relative)), `Required application or automation file missing: ${relative}`);
const workflow = fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
assert.ok(workflow.includes('branches:') && workflow.includes('- main'), 'GitHub Actions workflow must listen to the main branch');
assert.ok(workflow.includes('actions/deploy-pages@v5'), 'GitHub Pages deployment action must be configured');

console.log(`PASS parsed ${jsonFiles.length} JSON files`);
console.log(`PASS ${products.length} product records, unique IDs, categories, integer prices/stocks, and local image assets`);
console.log('PASS feature toggles and own-container discount settings');
