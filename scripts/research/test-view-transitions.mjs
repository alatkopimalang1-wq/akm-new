import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

async function main() {
    const browser = await pw.chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    console.log('Navigating to homepage...');
    await page.goto('http://sanubari.test/', { waitUntil: 'networkidle' });

    // Scroll to see CountingNumber
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'storage/app/public/sanubari-counting-number.png' });
    console.log('CountingNumber screenshot saved.');

    // Click on Brew Guide in header
    console.log('Testing View Transition navigation to brew guide...');
    await page.click('a[href="/panduan-seduh"]');
    await page.waitForTimeout(600);

    // Go to first guide
    const firstGuideLink = await page.$('a[href*="/panduan-seduh/"]');
    if (firstGuideLink) {
        await firstGuideLink.click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: 'storage/app/public/sanubari-brew-guide-interactive.png' });
        console.log('Brew guide screenshot saved.');
    }

    // Go to blog
    console.log('Testing blog with ScrollProgress...');
    await page.goto('http://sanubari.test/blog/jejak-kopi-lereng-gunung-kawi', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'storage/app/public/sanubari-blog-scroll-progress.png' });
    console.log('Blog scroll progress screenshot saved.');

    await browser.close();
    console.log('All visual verifications completed successfully!');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
