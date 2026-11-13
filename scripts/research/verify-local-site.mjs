import { mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = join(ROOT, 'docs', 'qa');
await mkdir(out, { recursive: true });

async function loadPlaywright() {
    try { return await import('playwright-core'); } catch {}
    const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
    const { createRequire } = await import('node:module');
    return createRequire(join(local, 'package.json'))(local);
}

const pw = await loadPlaywright();
const browser = await pw.chromium.launch({ headless: true });

// 1. Desktop captures
const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'id-ID',
});
const desktopPage = await desktopCtx.newPage();

const desktopRoutes = [
    { url: 'http://sanubari.test/', name: 'desktop-home.png' },
    { url: 'http://sanubari.test/shop', name: 'desktop-shop.png' },
    { url: 'http://sanubari.test/shop/arabika-karo-blueberry-wethulled-infused', name: 'desktop-product.png' },
    { url: 'http://sanubari.test/keranjang', name: 'desktop-cart.png' },
    { url: 'http://sanubari.test/panduan-seduh', name: 'desktop-brew-guide.png' },
    { url: 'http://sanubari.test/wholesale', name: 'desktop-wholesale.png' },
    { url: 'http://sanubari.test/kunjungi', name: 'desktop-visit.png' },
];

for (const r of desktopRoutes) {
    try {
        await desktopPage.goto(r.url, { waitUntil: 'networkidle', timeout: 15000 });
        await desktopPage.waitForTimeout(600);
        await desktopPage.screenshot({ path: join(out, r.name) });
        console.log(`Saved desktop: ${r.name}`);
    } catch (e) {
        console.error(`Failed ${r.name}`, e.message);
    }
}

// 2. Mobile captures (iPhone 14)
const mobileCtx = await browser.newContext({
    ...pw.devices['iPhone 14'],
    locale: 'id-ID',
});
const mobilePage = await mobileCtx.newPage();

const mobileRoutes = [
    { url: 'http://sanubari.test/', name: 'mobile-home.png' },
    { url: 'http://sanubari.test/shop', name: 'mobile-shop.png' },
    { url: 'http://sanubari.test/shop/arabika-karo-blueberry-wethulled-infused', name: 'mobile-product.png' },
    { url: 'http://sanubari.test/keranjang', name: 'mobile-cart.png' },
];

for (const r of mobileRoutes) {
    try {
        await mobilePage.goto(r.url, { waitUntil: 'networkidle', timeout: 15000 });
        await mobilePage.waitForTimeout(600);
        await mobilePage.screenshot({ path: join(out, r.name) });
        console.log(`Saved mobile: ${r.name}`);
    } catch (e) {
        console.error(`Failed ${r.name}`, e.message);
    }
}

await browser.close();
console.log('All QA captures saved in docs/qa/');
