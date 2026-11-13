import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', (msg) => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message, err.stack));

await page.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const appHtml = await page.evaluate(() => document.getElementById('app')?.innerHTML);
console.log('App element innerHTML length:', appHtml?.length ?? 0);
console.log('Snippet:', appHtml?.slice(0, 500));

await browser.close();
