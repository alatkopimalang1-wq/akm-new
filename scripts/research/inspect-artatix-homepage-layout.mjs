import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });

// Desktop 1440
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const pageStructure = await page.evaluate(() => {
  // Extract all main containers and sections
  const main = document.querySelector('main') || document.body;
  const sections = Array.from(document.querySelectorAll('section, main > div, header, footer')).map((el, i) => {
    const headings = Array.from(el.querySelectorAll('h1, h2, h3, h4')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim()
    }));
    const classes = el.className;
    const isSlider = !!el.querySelector('.swiper, .slick-slider, [class*="carousel"], [class*="slider"]');
    return {
      index: i,
      tag: el.tagName,
      id: el.id,
      className: classes,
      isSlider,
      headings,
      rect: { width: el.offsetWidth, height: el.offsetHeight }
    };
  });

  // Specifically inspect slider/banner
  const sliderEl = document.querySelector('.swiper, .slick-slider, [class*="carousel"], [class*="slider"]');
  let sliderInfo = null;
  if (sliderEl) {
    const slides = Array.from(sliderEl.querySelectorAll('.swiper-slide, [class*="slide"]')).map(s => ({
      text: s.innerText.trim().slice(0, 100),
      img: s.querySelector('img')?.src || null
    }));
    const dots = sliderEl.querySelectorAll('.swiper-pagination-bullet, [class*="dot"], [class*="indicator"]').length;
    const arrows = sliderEl.querySelectorAll('button').length;
    sliderInfo = {
      sliderClass: sliderEl.className,
      slidesCount: slides.length,
      slides: slides.slice(0, 5),
      dots,
      arrows
    };
  }

  // Header menu structure
  const headerLinks = Array.from(document.querySelectorAll('header a, header button')).map(a => ({
    text: a.innerText.trim(),
    href: a.getAttribute('href')
  })).filter(a => a.text.length > 0);

  return { sections, sliderInfo, headerLinks };
});

console.log('--- SLIDER INFO ---');
console.log(JSON.stringify(pageStructure.sliderInfo, null, 2));

console.log('--- HEADER LINKS ---');
console.log(JSON.stringify(pageStructure.headerLinks, null, 2));

console.log('--- SECTIONS & HEADINGS ---');
for (const s of pageStructure.sections) {
  if (s.headings.length > 0 || s.isSlider) {
    console.log(`[${s.tag} #${s.id} .${s.className.slice(0, 50)}] (height: ${s.rect.height})`);
    console.log('  Headings:', s.headings);
    if (s.isSlider) console.log('  -> Contains Slider!');
  }
}

await page.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_desktop_fullpage.png', fullPage: true });

// Mobile 390
const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });
await mobilePage.waitForTimeout(2000);
await mobilePage.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_mobile_fullpage.png', fullPage: true });

await browser.close();
console.log('Done analysis!');
