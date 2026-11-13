import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });

const slides = await page.evaluate(() => {
  const img = document.querySelector('img[src*="hero_banner"]');
  const container = img?.closest('[style*="aspect-ratio"]');
  if (!container) return { error: 'container not found' };
  
  const children = Array.from(container.children);
  return {
    containerStyle: container.getAttribute('style'),
    containerClass: container.className,
    parentClass: container.parentElement?.className,
    parentStyle: container.parentElement?.getAttribute('style'),
    children: children.map((c, i) => ({
      index: i,
      className: c.className,
      style: c.getAttribute('style'),
      rect: c.getBoundingClientRect(),
      imgSrc: c.querySelector('img')?.src
    })),
    buttons: Array.from(container.parentElement?.querySelectorAll('button') || []).map(b => ({
      className: b.className,
      style: b.getAttribute('style'),
      html: b.outerHTML
    })),
    pagination: container.parentElement?.parentElement?.querySelector('[class*="pagination"], [class*="indicator"]')?.outerHTML
  };
});

console.log('--- ARTATIX SLIDER FULL STRUCTURE ---');
console.log(JSON.stringify(slides, null, 2));

// Mobile check
const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });

const mobileSlides = await mobilePage.evaluate(() => {
  const img = document.querySelector('img[src*="hero_banner"]');
  const container = img?.closest('[style*="aspect-ratio"]');
  if (!container) return { error: 'mobile container not found' };
  return {
    containerStyle: container.getAttribute('style'),
    containerClass: container.className,
    rect: container.getBoundingClientRect(),
    children: Array.from(container.children).map((c, i) => ({
      index: i,
      className: c.className,
      style: c.getAttribute('style'),
      rect: c.getBoundingClientRect()
    }))
  };
});

console.log('--- ARTATIX MOBILE SLIDER ---');
console.log(JSON.stringify(mobileSlides, null, 2));

await browser.close();
