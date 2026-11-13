import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

async function run() {
  const browser = await pw.chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  const grid = await page.$('.grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
  if (grid) {
    await grid.screenshot({
      path: 'C:/Users/didik/.gemini/antigravity-ide/brain/89890266-7a24-4760-813b-3f9307ab49dd/homepage_product_cards_1_1.png'
    });
    console.log('Homepage product grid screenshot saved!');
  }

  // Also capture the Rekomendasi Biji Kopi carousel
  const recSection = await page.$('section:has-text("Rekomendasi Biji Kopi")');
  if (recSection) {
    await recSection.screenshot({
      path: 'C:/Users/didik/.gemini/antigravity-ide/brain/89890266-7a24-4760-813b-3f9307ab49dd/rekomendasi_biji_kopi_1_1.png'
    });
    console.log('Rekomendasi Biji Kopi screenshot saved!');
  }

  // Also check /shop
  await page.goto('http://sanubari.test/shop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const shopGrid = await page.$('.grid.grid-cols-2.sm\\:grid-cols-3.lg\\:grid-cols-4');
  if (shopGrid) {
    await shopGrid.screenshot({
      path: 'C:/Users/didik/.gemini/antigravity-ide/brain/89890266-7a24-4760-813b-3f9307ab49dd/shop_product_cards_1_1.png'
    });
    console.log('Shop product grid screenshot saved!');
  }

  await browser.close();
}

run().catch(console.error);
