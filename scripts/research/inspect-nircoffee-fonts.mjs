import { createRequire } from 'node:module';
import { join } from 'node:path';

const local = join(process.env.LOCALAPPDATA ?? '', 'ms-playwright-go', '1.57.0', 'package');
const pw = createRequire(join(local, 'package.json'))(local);
const browser = await pw.chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto('https://nircoffee.id/', { waitUntil: 'networkidle' });

const fontData = await page.evaluate(() => {
    // 1. All font link tags
    const links = Array.from(document.querySelectorAll('link[rel*="font"], link[href*="font"]')).map(l => l.outerHTML);
    
    // 2. All style tags with @font-face or font-family
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.textContent).filter(t => t.includes('@font-face') || t.includes('font-family'));

    // 3. Computed font-family of key elements
    const elements = [
        'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'a', 'button', 'input', 'span', 'nav',
        '.font-serif', '.font-sans', '.font-mono'
    ];
    
    const computed = {};
    for (const sel of elements) {
        const el = document.querySelector(sel);
        if (el) {
            const s = getComputedStyle(el);
            computed[sel] = {
                fontFamily: s.fontFamily,
                fontWeight: s.fontWeight,
                fontStyle: s.fontStyle,
                fontSize: s.fontSize,
                lineHeight: s.lineHeight,
                letterSpacing: s.letterSpacing
            };
        }
    }

    // 4. Scan all unique font-families in the entire DOM
    const allElements = Array.from(document.querySelectorAll('*'));
    const uniqueFonts = new Set();
    const tagFontMap = {};
    for (const el of allElements) {
        const f = getComputedStyle(el).fontFamily;
        if (f) {
            uniqueFonts.add(f);
            const tag = el.tagName.toLowerCase();
            if (!tagFontMap[tag]) tagFontMap[tag] = new Set();
            tagFontMap[tag].add(f);
        }
    }

    const tagFontReport = {};
    for (const [k, v] of Object.entries(tagFontMap)) {
        tagFontReport[k] = Array.from(v);
    }

    return {
        links,
        styles: styles.slice(0, 5),
        computed,
        uniqueFonts: Array.from(uniqueFonts),
        tagFontReport
    };
});

console.log(JSON.stringify(fontData, null, 2));
await browser.close();
