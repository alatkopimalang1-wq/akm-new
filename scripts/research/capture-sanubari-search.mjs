import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });

// 1. Desktop Home & Hero
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_desktop_hero_updated.png' });

// 2. Open Search Modal via search button
const searchBtn = await page.$('header button[aria-label*="Cari Kopi"]');
if (searchBtn) {
  await searchBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_search_modal_zero_state.png' });

  // Type query 'kawi'
  const input = await page.$('input[placeholder*="Cari kopi"]');
  if (input) {
    await input.fill('kawi');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_search_modal_query_kawi.png' });
  }
}

// 3. Mobile View of Hero & Search
const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
await mobilePage.waitForTimeout(1000);
await mobilePage.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_hero_updated.png' });

// Open Search on Mobile
const mobileSearchBtn = await mobilePage.$('header button[aria-label="Cari Kopi"]');
if (mobileSearchBtn) {
  await mobileSearchBtn.click();
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_search_modal.png' });
}

await browser.close();
console.log('Sanubari verification screenshots captured successfully!');
