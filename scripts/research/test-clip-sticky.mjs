import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.setContent(`
  <div style="overflow-x: clip; min-height: 2000px;">
    <header style="position: sticky; top: 0; height: 60px; background: red; z-index: 10;">HEADER</header>
    <div style="height: 1500px; background: yellow;">CONTENT</div>
  </div>
`);

await page.evaluate(() => window.scrollBy(0, 400));
const headerRect = await page.evaluate(() => {
  return document.querySelector('header').getBoundingClientRect();
});
console.log('Header rect with overflow-x: clip after scroll:', headerRect);
await browser.close();
