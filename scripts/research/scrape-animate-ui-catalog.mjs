import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const pw = createRequire(join(local, 'package.json'))(local);
const browser = await pw.chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://animate-ui.com/docs', { waitUntil: 'networkidle' });

const items = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="/docs"]'));
    const unique = new Map();
    for (const a of anchors) {
        const href = a.getAttribute('href');
        const text = a.innerText.trim();
        if (href && text && !unique.has(href)) {
            unique.set(href, text);
        }
    }
    return Array.from(unique.entries()).map(([href, text]) => ({ href, text }));
});

console.log(JSON.stringify(items, null, 2));
await browser.close();
