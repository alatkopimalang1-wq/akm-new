import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const buttons = await page.$$('header button');
for (const btn of buttons) {
  const html = await btn.innerHTML();
  if (html.includes('13.793') || html.includes('viewBox="0 0 24 24"')) {
    await btn.click();
    break;
  }
}

await page.waitForTimeout(1000);

const searchInput = await page.$('input[placeholder="Cari disini"]');
if (searchInput) {
  console.log('Typing "fest" into search modal...');
  await searchInput.fill('fest');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_search_modal_live_results.png' });
}

await browser.close();
console.log('Live search captured!');
