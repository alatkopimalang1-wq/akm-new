import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });

// 1. Mobile check
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileErrors = [];
mobile.on('pageerror', err => mobileErrors.push(err.message));
mobile.on('console', msg => {
  if (msg.type() === 'error') mobileErrors.push(msg.text());
});

await mobile.goto('http://sanubari.test/', { waitUntil: 'networkidle' });

// Check overflow on mobile
const overflowElements = await mobile.evaluate(() => {
  const elements = Array.from(document.querySelectorAll('*'));
  const viewportWidth = window.innerWidth;
  const overflowing = [];

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.right > viewportWidth + 1 || el.scrollWidth > viewportWidth + 1) {
      overflowing.push({
        tag: el.tagName,
        id: el.id,
        className: el.className,
        rect: { right: rect.right, width: rect.width },
        scrollWidth: el.scrollWidth,
        viewportWidth
      });
    }
  }
  return overflowing;
});

console.log('--- MOBILE OVERFLOW ELEMENTS ---');
console.log(JSON.stringify(overflowElements.slice(0, 10), null, 2));

// Screenshot before scroll
await mobile.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_top.png' });

// Scroll down mobile
await mobile.evaluate(() => window.scrollBy(0, 300));
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_scrolled_300.png' });

await mobile.evaluate(() => window.scrollBy(0, 600));
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_scrolled_900.png' });

// 2. Desktop check
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const desktopErrors = [];
desktop.on('pageerror', err => desktopErrors.push(err.message));
desktop.on('console', msg => {
  if (msg.type() === 'error') desktopErrors.push(msg.text());
});

await desktop.goto('http://sanubari.test/', { waitUntil: 'networkidle' });

// Scroll down desktop
await desktop.evaluate(() => window.scrollBy(0, 200));
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_desktop_scrolled_200.png' });

await desktop.evaluate(() => window.scrollBy(0, 600));
await desktop.waitForTimeout(500);
await desktop.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_desktop_scrolled_800.png' });

console.log('Mobile errors:', mobileErrors);
console.log('Desktop errors:', desktopErrors);

await browser.close();
