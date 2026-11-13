import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });

// 1. MOBILE TEST (390x844)
console.log('--- TESTING MOBILE VIEW (390x844) ---');
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileErrors = [];
mobile.on('pageerror', err => mobileErrors.push(err.message));
mobile.on('console', msg => {
  if (msg.type() === 'error') mobileErrors.push(msg.text());
});

await mobile.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(500);

// Check overflow on mobile
const mobileOverflow = await mobile.evaluate(() => {
  const elements = Array.from(document.querySelectorAll('*'));
  const viewportWidth = window.innerWidth;
  const overflowing = [];

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.right > viewportWidth + 1 || el.scrollWidth > viewportWidth + 1) {
      overflowing.push({
        tag: el.tagName,
        className: el.className,
        rectRight: rect.right,
        scrollWidth: el.scrollWidth,
        viewportWidth
      });
    }
  }
  return {
    viewportWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    overflowingCount: overflowing.length,
    overflowingSample: overflowing.slice(0, 5)
  };
});

console.log('Mobile overflow metrics:', JSON.stringify(mobileOverflow, null, 2));

// Screenshot mobile top (Hero slider + top header)
await mobile.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_fixed_hero.png'
});

// Scroll mobile down to 400px (Check Laris Manis and floating capsule nav)
await mobile.evaluate(() => window.scrollBy(0, 400));
await mobile.waitForTimeout(400);

await mobile.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_fixed_scrolled_400.png'
});

// Scroll mobile down to 1000px (Check Koleksi Sangrai and floating capsule nav)
await mobile.evaluate(() => window.scrollBy(0, 600));
await mobile.waitForTimeout(400);

await mobile.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_fixed_scrolled_1000.png'
});

// 2. DESKTOP TEST (1440x900)
console.log('--- TESTING DESKTOP VIEW (1440x900) ---');
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const desktopErrors = [];
desktop.on('pageerror', err => desktopErrors.push(err.message));
desktop.on('console', msg => {
  if (msg.type() === 'error') desktopErrors.push(msg.text());
});

await desktop.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
await desktop.waitForTimeout(500);

// Screenshot desktop hero slider
await desktop.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_desktop_fixed_hero.png'
});

// Click next button on desktop slider
const nextBtn = await desktop.$('button[aria-label="Next slide"]');
if (nextBtn) {
  await nextBtn.click();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({
    path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_desktop_fixed_hero_slide2.png'
  });
}

// Scroll desktop down 300px
await desktop.evaluate(() => window.scrollBy(0, 300));
await desktop.waitForTimeout(400);
await desktop.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_desktop_fixed_scrolled_300.png'
});

// Scroll desktop down 800px (Verify no bleed through header)
await desktop.evaluate(() => window.scrollBy(0, 500));
await desktop.waitForTimeout(400);
await desktop.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_desktop_fixed_scrolled_800.png'
});

console.log('Console/Page Errors Mobile:', mobileErrors);
console.log('Console/Page Errors Desktop:', desktopErrors);

await browser.close();
console.log('--- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ---');
