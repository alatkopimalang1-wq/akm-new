import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });

// Desktop 1440
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
await desktop.waitForTimeout(1000);

// Capture full homepage desktop
await desktop.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_artatix_desktop_fullpage.png',
  fullPage: true
});

// Capture hero with slider
await desktop.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_slider_slide1.png'
});

// Click next slider button
const nextBtn = await desktop.$('[data-ui="hero-slider"] button[aria-label="Slide berikutnya"]');
if (nextBtn) {
  await nextBtn.click();
  await desktop.waitForTimeout(600);
  await desktop.screenshot({
    path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_slider_slide2.png'
  });
}

// Hover over first root menu "Katalog Kopi" to open Mega Menu
const navButtons = await desktop.$$('nav button');
if (navButtons.length > 0) {
  await navButtons[0].hover();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({
    path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_megamenu_katalog.png'
  });
}

// Hover over second root menu "Kemitraan & Bisnis"
if (navButtons.length > 1) {
  await navButtons[1].hover();
  await desktop.waitForTimeout(500);
  await desktop.screenshot({
    path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_megamenu_kemitraan.png'
  });
}

// Mobile 390
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://sanubari.test/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(1000);

await mobile.screenshot({
  path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_artatix_mobile_fullpage.png',
  fullPage: true
});

// Mobile drawer menu test
const mobileMenuToggle = await mobile.$('button[aria-label="Menu navigasi"]');
if (mobileMenuToggle) {
  await mobileMenuToggle.click();
  await mobile.waitForTimeout(500);
  await mobile.screenshot({
    path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/sanubari_mobile_drawer_3categories.png'
  });
}

await browser.close();
console.log('Verification screenshots captured successfully!');
