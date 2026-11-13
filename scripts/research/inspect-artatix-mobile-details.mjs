import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });

// Mobile 390x844
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });

// 1. Check fixed/sticky bottom nav on Artatix
const bottomElements = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('*'));
  return all
    .filter(el => {
      const style = window.getComputedStyle(el);
      const isFixed = style.position === 'fixed' || style.position === 'sticky';
      const rect = el.getBoundingClientRect();
      return isFixed && rect.bottom >= window.innerHeight - 80 && rect.height > 20 && rect.width > 200;
    })
    .map(el => ({
      tagName: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      text: el.innerText.trim().slice(0, 200),
      html: el.outerHTML.slice(0, 400)
    }));
});

console.log('--- ARTATIX BOTTOM ELEMENTS ---');
console.log(JSON.stringify(bottomElements, null, 2));

// 2. Check slider DOM & Swiper/Carousel setup on Artatix
const sliderStructure = await page.evaluate(() => {
  // Find top banner carousel
  const swiperContainer = document.querySelector('.swiper, [class*="swiper"], [class*="banner"]');
  const banners = Array.from(document.querySelectorAll('img[alt*="banner" i], .swiper-slide, [class*="banner-item"]'));
  return {
    containerClass: swiperContainer?.className,
    containerStyle: swiperContainer?.getAttribute('style'),
    bannerCount: banners.length,
    firstBannerHTML: banners[0]?.outerHTML?.slice(0, 400),
    sliderHTML: swiperContainer?.outerHTML?.slice(0, 800)
  };
});

console.log('--- ARTATIX SLIDER STRUCTURE ---');
console.log(JSON.stringify(sliderStructure, null, 2));

// Screenshot mobile viewport top
await page.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_mobile_hero.png'
});

// Scroll down a bit to see sticky header & bottom nav behavior
await page.evaluate(() => window.scrollBy(0, 600));
await page.waitForTimeout(500);

await page.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_mobile_scrolled.png'
});

// Desktop 1440
const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktopPage.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });

const desktopSlider = await desktopPage.evaluate(() => {
  const container = document.querySelector('.swiper, [class*="swiper"]');
  const slideElements = Array.from(document.querySelectorAll('.swiper-slide'));
  return {
    containerClass: container?.className,
    slideCount: slideElements.length,
    slideWidths: slideElements.slice(0, 3).map(s => ({
      width: s.getBoundingClientRect().width,
      className: s.className,
      style: s.getAttribute('style')
    }))
  };
});

console.log('--- ARTATIX DESKTOP SLIDER ---');
console.log(JSON.stringify(desktopSlider, null, 2));

await desktopPage.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_desktop_hero.png'
});

// Scroll down desktop to check sticky header behavior
await desktopPage.evaluate(() => window.scrollBy(0, 500));
await desktopPage.waitForTimeout(500);

await desktopPage.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_desktop_scrolled.png'
});

await browser.close();
