// Measure Artatix's header structure (desktop + mobile) for the Sanubari header revision.
import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const pw = createRequire(join(local, 'package.json'))(local);
const out = process.argv[2] || '.';

const browser = await pw.chromium.launch({ headless: true });

for (const [label, viewport] of [['desktop', { width: 1280, height: 800 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport });
    await page.goto('https://artatix.co.id/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const data = await page.evaluate(() => {
        const header = document.querySelector('header') || document.querySelector('nav');
        const pick = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return {
                tag: el.tagName.toLowerCase(),
                text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80),
                box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
                bg: s.backgroundColor,
                color: s.color,
                radius: s.borderRadius,
                font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`,
                pad: s.padding,
                position: s.position,
            };
        };
        // Every visible block-ish row inside the header, plus links/buttons.
        const rows = [...(header?.querySelectorAll('div, nav, ul') ?? [])]
            .filter((el) => {
                const r = el.getBoundingClientRect();
                return r.height > 20 && r.height < 90 && r.width > 120 && el.children.length >= 2;
            })
            .slice(0, 14)
            .map(pick);
        const items = [...(header?.querySelectorAll('a, button') ?? [])]
            .filter((el) => el.getBoundingClientRect().width > 0)
            .map(pick);
        return { header: pick(header), rows, items, scrollY: window.scrollY };
    });

    await page.screenshot({ path: join(out, `artatix-header-${label}.png`), clip: { x: 0, y: 0, width: viewport.width, height: 140 } });

    // Behaviour on scroll: does the header stick, shrink, or hide the top bar?
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(600);
    const scrolled = await page.evaluate(() => {
        const h = document.querySelector('header') || document.querySelector('nav');
        const r = h?.getBoundingClientRect();
        return r ? { top: Math.round(r.top), height: Math.round(r.height), position: getComputedStyle(h).position } : null;
    });
    await page.screenshot({ path: join(out, `artatix-header-${label}-scrolled.png`), clip: { x: 0, y: 0, width: viewport.width, height: 140 } });

    console.log(JSON.stringify({ label, ...data, scrolled }, null, 1));
    await page.close();
}

await browser.close();
