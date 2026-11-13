import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const req = createRequire(join(local, 'package.json'));
const pw = req(local);

const browser = await pw.chromium.launch({ headless: true });

// Desktop inspection
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

console.log('Page title:', await page.title());

// Find and click search button
const buttons = await page.$$('header button');
console.log('Header buttons count:', buttons.length);

let searchClicked = false;
for (const btn of buttons) {
  const html = await btn.innerHTML();
  if (html.includes('13.793') || html.includes('viewBox="0 0 24 24"')) {
    console.log('Found search button! Clicking...');
    await btn.click();
    searchClicked = true;
    break;
  }
}

await page.waitForTimeout(1500);
console.log('URL after clicking search button:', page.url());
await page.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_search_modal_or_page.png' });

// Check what elements appeared (e.g., input, dialog, popover)
const inputs = await page.$$('input');
console.log('Input fields count:', inputs.length);
for (let i = 0; i < inputs.length; i++) {
  const placeholder = await inputs[i].getAttribute('placeholder');
  const type = await inputs[i].getAttribute('type');
  console.log(`Input ${i}: type=${type}, placeholder=${placeholder}`);
}

// Check dialog or modal
const dialogs = await page.$$('[role="dialog"], [data-state="open"]');
console.log('Dialogs / open popovers count:', dialogs.length);
for (const d of dialogs) {
  console.log('Dialog text snippet:', (await d.innerText()).slice(0, 200));
}

// Now let's test explore page directly
console.log('Navigating to https://artatix.co.id/explore ...');
await page.goto('https://artatix.co.id/explore', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

console.log('Explore URL:', page.url());
const exploreInputs = await page.$$('input');
console.log('Explore inputs count:', exploreInputs.length);
for (let i = 0; i < exploreInputs.length; i++) {
  const placeholder = await exploreInputs[i].getAttribute('placeholder');
  const type = await exploreInputs[i].getAttribute('type');
  console.log(`Explore input ${i}: type=${type}, placeholder=${placeholder}`);
}

// Type into explore search input if present
if (exploreInputs.length > 0) {
  await exploreInputs[0].fill('konser');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_explore_search_typed.png' });
}

// Inspect categories and filters on explore page
const filterButtons = await page.$$('button');
const buttonTexts = [];
for (const b of filterButtons) {
  const t = (await b.innerText()).trim();
  if (t && t.length < 30) buttonTexts.push(t);
}
console.log('Sample button texts:', buttonTexts.slice(0, 25));

// Mobile view of home and search
const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });
await mobilePage.waitForTimeout(1000);
await mobilePage.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_mobile_home_inspected.png' });

// Mobile bottom bar / search
const mobileSearchBtn = await mobilePage.$('header button:has(svg path[d*="13.793"])');
if (mobileSearchBtn) {
  await mobileSearchBtn.click();
  await mobilePage.waitForTimeout(1000);
  console.log('Mobile URL after search button:', mobilePage.url());
  await mobilePage.screenshot({ path: 'C:/Users/didik/.gemini/antigravity-ide/brain/ea3719d1-e641-4829-a530-c7e6332748bc/artatix_mobile_search_clicked.png' });
}

await browser.close();
console.log('Done inspecting Artatix!');
