import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const app = fs.readFileSync(new URL('assets/js/app.js', root), 'utf8');
const styles = fs.readFileSync(new URL('assets/css/components.css', root), 'utf8') + fs.readFileSync(new URL('assets/css/responsive.css', root), 'utf8');
const settings = JSON.parse(fs.readFileSync(new URL('data/settings.json', root), 'utf8'));
const transparency = JSON.parse(fs.readFileSync(new URL('data/transparency.json', root), 'utf8'));
const readme = fs.readFileSync(new URL('README.md', root), 'utf8');
const workflow = fs.readFileSync(new URL('.github/workflows/deploy.yml', root), 'utf8');

for (const marker of [
  "const DASHBOARD_PINS = { admin: '4826', seller: '7361' }",
  'function roleForRoute()', 'function roleUnlocked(role)', 'function unlockRole(role)', 'function lockRole(role)',
  'function renderAdminCustomize()', 'function renderSellerPOS()', 'function renderSellerStock()', 'function renderSellerReports()',
  'data-form="pin-login"', 'data-form="admin-customize"', 'data-asset-upload',
  "data-asset-name=\"qris-kantin\"", "data-action=\"export-transparency-summary\"",
  "seller-shift-open", "seller-pos-checkout"
]) assert.ok(app.includes(marker), `Expected dashboard marker: ${marker}`);

assert.ok(styles.includes('.pin-gate'), 'PIN gate styles exist');
assert.ok(styles.includes('.quick-action-grid'), 'Seller quick action styles exist');
assert.equal(settings.showHero, true, 'hero is enabled by default');
assert.equal(settings.qrisEnabled, false, 'QRIS stays disabled until configured');
assert.equal(transparency.hasReportedCommunitySummary, false, 'public summary is off by default');
assert.ok(readme.includes('sinkronisasi realtime') || readme.includes('sinkronisasi real-time'), 'README explains realtime limitations');
assert.ok(readme.includes('4826') && readme.includes('7361'), 'README documents default demo PINs');
assert.ok(app.includes('data-action=\"reset-revenue\"'), 'admin can reset displayed revenue');
assert.ok(app.includes('data-action=\"reset-stock\"'), 'admin can reset stock');
assert.ok(app.includes('data-action=\"product-delete\"'), 'admin can delete any default/draft product');
assert.ok(app.includes('enableContainerDiscount') && app.includes('whatsappAdminNumber'), 'own-container discount is configurable with WhatsApp');
assert.ok(app.includes('container-proof-sent') && app.includes('containerDiscountStatusLabel'), 'discount proof state is acknowledged and recorded');
assert.ok(app.includes('enableCheckout') && app.includes('enableProductManagement'), 'features can be toggled');
assert.ok(workflow.includes('pull_request:') && workflow.includes('workflow_dispatch:'), 'workflow validates pull requests and supports manual runs');
assert.ok(workflow.includes('actions/configure-pages@v6') && workflow.includes('actions/upload-pages-artifact@v5') && workflow.includes('actions/deploy-pages@v5'), 'workflow configures and deploys GitHub Pages');
assert.ok(workflow.includes('tests/render-smoke.mjs') && workflow.includes('scripts/validate-project.mjs'), 'workflow validates project data and rendering before deployment');

console.log('PASS admin and seller PIN route wiring markers');
console.log('PASS admin customization and QRIS/image upload markers');
console.log('PASS seller POS/shift/report feature markers');
console.log('PASS public summary defaults and GitHub-only limitations documented');
