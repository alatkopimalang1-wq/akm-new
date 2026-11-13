import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

async function main() {
    const browser = await pw.chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto('http://sanubari.test/shop/arabika-karo-blueberry-wethulled-infused', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Find and click select trigger
    const trigger = await page.$('button[data-slot="select-trigger"]');
    if (trigger) {
        await trigger.click();
        await page.waitForTimeout(400);
    }

    await page.screenshot({ path: 'storage/app/public/sanubari-select-animated.png' });
    await browser.close();
    console.log('Animated select screenshot captured successfully!');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
