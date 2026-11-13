#!/usr/bin/env node
/**
 * Real mobile capture (device emulation, not a narrow desktop window).
 *
 *   node scripts/research/capture-mobile.mjs [url] [outDirName]
 *   default: https://ottencoffee.co.id/  ->  docs/research/screenshots/otten-mobile/
 *
 * Emulates iPhone 14 (390x844, DPR 3, touch, mobile Safari UA) so the site serves
 * its mobile layout. Saves: full-page screenshot, viewport-by-viewport slices,
 * DOM outline of top-level sections (tag, classes, size, radius) and the HTML.
 * Uses the Playwright already installed for Antigravity (no npm install needed).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const url = process.argv[2] ?? 'https://ottencoffee.co.id/';
const out = join(ROOT, 'docs', 'research', 'screenshots', process.argv[3] ?? 'otten-mobile');

async function loadPlaywright() {
    try { return await import('playwright-core'); } catch {}
    const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
    return createRequire(join(local, 'package.json'))(local);
}

const pw = await loadPlaywright();
const device = pw.devices['iPhone 14'];
await mkdir(out, { recursive: true });

const browser = await pw.chromium.launch({ headless: true });
const ctx = await browser.newContext({ ...device, locale: 'id-ID' });
const page = await ctx.newPage();
console.log(`device: iPhone 14 ${device.viewport.width}x${device.viewport.height} dpr=${device.deviceScaleFactor} mobile=${device.isMobile}`);
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3000);

// Close common popups/modals (cookie consent, app-download sheet, smart banner)
async function dismissPopups() {
    for (let pass = 0; pass < 3; pass++) {
        for (const sel of ['button:has-text("Setuju")', 'button:has-text("Tutup")', 'button:has-text("Nanti")', '.modal-dimmer ~ * [class*="close" i]', '[class*="modal" i] svg', '[aria-label*="close" i]']) {
            const els = page.locator(sel);
            const n = Math.min(await els.count().catch(() => 0), 4);
            for (let k = 0; k < n; k++) {
                const el = els.nth(k);
                if (await el.isVisible().catch(() => false)) await el.click({ timeout: 1500 }).catch(() => {});
            }
        }
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(600);
    }
    // Last resort: remove leftover overlays so the layout underneath is visible
    await page.evaluate(() => {
        document.querySelectorAll('.modal-dimmer, .cookie-consent-modal, [class*="bottom-sheet" i], [class*="BottomSheet" i]').forEach((n) => n.remove());
        document.querySelectorAll('body *').forEach((n) => {
            const s = getComputedStyle(n);
            if (s.position === 'fixed' && n.getBoundingClientRect().height > window.innerHeight * 0.5) n.remove();
        });
        document.body.style.overflow = 'auto';
    });
}
await page.screenshot({ path: join(out, '00-raw-first-view.png') });
await page.addStyleTag({
    content: `
        .modal-dimmer, .cookie-consent-modal, .sc-ctwKVn, .sc-kyCyAI, .sc-hENMEE, #assistant-icon,
        [class*="bottom-sheet" i], [class*="BottomSheet" i], [class*="BottomSheets" i],
        div:has(> * > h4:has-text("Lebih Murah di Aplikasi")),
        div:has(> button:has-text("Buka di Aplikasi")), div:has(> * > button:has-text("Buka di Aplikasi")) {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        body { overflow: auto !important; }
    `
});
await dismissPopups();
await page.screenshot({ path: join(out, '00-first-view-with-popups-removed.png') });

// Trigger lazy content by scrolling through the page
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 400) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(250); }
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);

const vh = device.viewport.height;
const total = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < Math.min(total, 6000); y += vh) {
    await page.evaluate((v) => {
        window.scrollTo(0, v);
    }, y);
    await page.waitForTimeout(600);
    await page.screenshot({ path: join(out, `slice-${String(++i).padStart(2, '0')}.png`) });
}
await page.evaluate(() => window.scrollTo(0, 0));

// Section outline: elements >= 60% width & >= 80px tall, walked from <main>/<body>
const outline = await page.evaluate(() => {
    const W = window.innerWidth;
    const res = [];
    const walk = (el, depth) => {
        for (const c of el.children) {
            const r = c.getBoundingClientRect();
            const cs = getComputedStyle(c);
            if (cs.display === 'none' || r.height < 80 || r.width < W * 0.6) continue;
            const big = r.height > window.innerHeight * 2.5;
            if (big && depth < 6) { walk(c, depth + 1); continue; }
            const imgs = c.querySelectorAll('img').length;
            const scrollX = [...c.querySelectorAll('*')].some((n) => { const s = getComputedStyle(n); return (s.overflowX === 'auto' || s.overflowX === 'scroll') && n.scrollWidth > n.clientWidth + 10; });
            const heading = c.querySelector('h1,h2,h3,[class*="title" i]')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 60) ?? '';
            res.push({ top: Math.round(r.top + scrollY), height: Math.round(r.height), width: Math.round(r.width), tag: c.tagName.toLowerCase(), cls: (c.className?.toString() ?? '').slice(0, 80), radius: cs.borderRadius, heading, imgs, horizontalScroll: scrollX });
        }
    };
    walk(document.querySelector('main') ?? document.body, 0);
    return res.sort((a, b) => a.top - b.top);
});
await writeFile(join(out, 'outline.json'), JSON.stringify({ url, device: 'iPhone 14', viewport: device.viewport, dpr: device.deviceScaleFactor, userAgent: device.userAgent, pageHeight: total, sections: outline }, null, 2));
await writeFile(join(out, 'page.html'), await page.content());

// Menu drawer (hamburger / kategori)
for (const sel of ['[aria-label*="menu" i]', 'button:has-text("Kategori")', '[class*="hamburger" i]', '[class*="burger" i]']) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
        await el.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(1200);
        await page.screenshot({ path: join(out, 'menu-open.png') });
        break;
    }
}

await browser.close();
console.log(`saved ${i} slices + full-page.png + outline.json (${outline.length} sections) -> ${out}`);
