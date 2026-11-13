#!/usr/bin/env node
/**
 * Site research script — single run, no prompts, no dependencies (Node >= 20).
 *
 *   node scripts/research/analyze-sites.mjs
 *
 * What it does
 *  1. nircoffee.id  (structural/UX reference, Vite + React SPA)
 *     - robots.txt + every sitemap it can find  -> indexable URL inventory
 *     - index.html + every JS chunk reachable from it (recursive)
 *     - extracts router path declarations, internal links, API endpoints,
 *       locales and 3rd-party integrations straight from the shipped bundle
 *  2. sanubariroastery.id  (content reference, WordPress + WooCommerce)
 *     - robots.txt + sitemaps
 *     - WP REST: namespaces, pages, posts
 *     - WooCommerce Store API (public): products + categories
 *     - writes a normalised dummy-data seed file for the Laravel app
 *  3. Writes everything to docs/research/ :
 *     - evidence/<site>/...      raw responses (proof)
 *     - findings.json            machine-readable summary
 *     - REPORT.generated.md      human-readable report with page counts
 *     - sanubari-seed.json       product/category data for seeders
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'docs', 'research');
const EVIDENCE = join(OUT, 'evidence');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SanubariResearchBot/1.0';
const TIMEOUT_MS = 20000;
const MAX_CHUNKS = 600;
const CONCURRENCY = 8;

const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const uniq = (a) => [...new Set(a)].sort();

async function save(rel, data) {
    const file = join(EVIDENCE, rel);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    return file;
}

async function get(url, { json = false } = {}) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            headers: { 'user-agent': UA, accept: json ? 'application/json' : '*/*' },
            signal: ctrl.signal,
            redirect: 'follow',
        });
        const text = await res.text();
        const headers = Object.fromEntries(res.headers.entries());
        let body = text;
        if (json) {
            try { body = JSON.parse(text); } catch { body = null; }
        }
        return { ok: res.ok, status: res.status, url: res.url, headers, text, body };
    } catch (e) {
        return { ok: false, status: 0, url, headers: {}, text: '', body: null, error: String(e?.message ?? e) };
    } finally {
        clearTimeout(t);
    }
}

async function pool(items, fn, n = CONCURRENCY) {
    const out = [];
    let i = 0;
    await Promise.all(Array.from({ length: n }, async () => {
        while (i < items.length) {
            const idx = i++;
            out[idx] = await fn(items[idx], idx);
        }
    }));
    return out;
}

/* ----------------------------- sitemaps ----------------------------- */

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, '&'));

async function crawlSitemaps(base, site, extraCandidates = []) {
    const robots = await get(`${base}/robots.txt`);
    await save(`${site}/robots.txt`, `# status ${robots.status}\n${robots.text}`);
    const fromRobots = [...robots.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
    const queue = uniq([...fromRobots, `${base}/sitemap.xml`, `${base}/sitemap_index.xml`, `${base}/wp-sitemap.xml`, ...extraCandidates]);
    const seen = new Set();
    const sitemaps = [];
    const urls = new Map(); // url -> sitemap
    while (queue.length) {
        const sm = queue.shift();
        if (seen.has(sm) || seen.size > 200) continue;
        seen.add(sm);
        const r = await get(sm);
        const isXml = r.ok && /<(urlset|sitemapindex)/i.test(r.text);
        sitemaps.push({ url: sm, status: r.status, isXml, error: r.error });
        if (!isXml) continue;
        await save(`${site}/sitemaps/${sha(sm)}-${sm.split('/').pop() || 'sitemap'}.xml`, r.text);
        if (/<sitemapindex/i.test(r.text)) queue.push(...locs(r.text));
        else for (const u of locs(r.text)) if (!urls.has(u)) urls.set(u, sm);
    }
    return { robotsStatus: robots.status, robotsSitemaps: fromRobots, sitemaps, urls };
}

function groupUrls(urls, base) {
    const groups = {};
    for (const u of urls) {
        let p;
        try { p = new URL(u).pathname; } catch { continue; }
        const seg = p.split('/').filter(Boolean);
        const key = seg.length === 0 ? '/' : `/${seg[0]}${seg.length > 1 ? '/*' : ''}`;
        (groups[key] ??= []).push(u.replace(base, '') || '/');
    }
    return Object.fromEntries(Object.entries(groups).sort((a, b) => b[1].length - a[1].length));
}

/* ----------------------------- nircoffee ----------------------------- */

async function analyzeNir() {
    const base = 'https://nircoffee.id';
    const site = 'nircoffee';
    log('nircoffee: homepage');
    const home = await get(`${base}/`);
    await save(`${site}/index.html`, home.text);
    await save(`${site}/index.headers.json`, { status: home.status, headers: home.headers });

    log('nircoffee: sitemaps');
    const sm = await crawlSitemaps(base, site);

    // Recursively collect JS chunks
    log('nircoffee: JS bundle graph');
    const assetRe = /(?:["'`(]|^|\/)((?:\/)?assets\/[A-Za-z0-9_.\-]+\.(?:js|css))/g;
    const toAbs = (p) => `${base}/${p.replace(/^\/+/, '')}`;
    const pending = uniq([...home.text.matchAll(assetRe)].map((m) => toAbs(m[1])));
    const fetched = new Map();
    while (pending.length && fetched.size < MAX_CHUNKS) {
        const batch = pending.splice(0, CONCURRENCY * 2).filter((u) => !fetched.has(u));
        const results = await pool(batch, (u) => get(u));
        results.forEach((r, i) => {
            fetched.set(batch[i], r);
            if (!r.ok || !batch[i].endsWith('.js')) return;
            for (const m of r.text.matchAll(/["'`(/]((?:\.\/|\/)?(?:assets\/)?[A-Za-z0-9_\-]+-[A-Za-z0-9_\-]{6,}\.js)["'`)]/g)) {
                const name = m[1].replace(/^\.?\//, '').replace(/^assets\//, '');
                const abs = `${base}/assets/${name}`;
                if (!fetched.has(abs) && !pending.includes(abs)) pending.push(abs);
            }
        });
    }
    const jsFiles = [...fetched.entries()].filter(([u, r]) => u.endsWith('.js') && r.ok);
    const allJs = jsFiles.map(([, r]) => r.text).join('\n;\n');
    const manifest = [...fetched.entries()].map(([u, r]) => ({ url: u, status: r.status, bytes: r.text.length, sha256_16: sha(r.text) }));
    await save(`${site}/bundle-manifest.json`, manifest);

    // Router path declarations: path:"/shop" | path:"shop/:slug"
    const routeDecl = uniq([...allJs.matchAll(/\bpath\s*:\s*["'`]([^"'`\s]{0,120})["'`]/g)].map((m) => m[1]))
        .filter((p) => !/^(https?:|\.|M\d|m\d)/.test(p) && !/[{}<>]/.test(p));
    // Navigation targets: to:"/x", navigate("/x"), href:"/x"
    const navTargets = uniq([
        ...[...allJs.matchAll(/\b(?:to|href|navigate|redirectTo|pathname)\s*[:(]\s*["'`](\/[A-Za-z0-9_\-/:.?=&]*)["'`]/g)].map((m) => m[1]),
    ]).filter((p) => !p.startsWith('/assets') && !p.startsWith('/img') && !p.startsWith('/api'));
    // Template literal routes: `/product/${...}`
    const templRoutes = uniq([...allJs.matchAll(/`(\/[a-z][a-z0-9\-/]*)\/\$\{/g)].map((m) => `${m[1]}/:param`));
    const apiEndpoints = uniq([
        ...[...allJs.matchAll(/["'`](\/api\/[A-Za-z0-9_\-/:.${}]*)["'`]/g)].map((m) => m[1]),
        ...[...allJs.matchAll(/["'`]((?:https?:)?\/\/[a-z0-9.\-]*nircoffee\.id[^"'`\s]*)["'`]/g)].map((m) => m[1]),
    ]);
    const relApi = uniq([...allJs.matchAll(/\.(?:get|post|put|patch|delete)\(\s*[`"']([^`"']{2,120})[`"']/g)].map((m) => m[1]))
        .filter((p) => p.startsWith('/'));
    const locales = uniq([...allJs.matchAll(/["'`]((?:en|id)-[a-z]{2})["'`]/gi)].map((m) => m[1].toLowerCase()));
    const integrations = Object.fromEntries(
        Object.entries({
            xendit: /xendit/i, stripe: /stripe/i, googleMaps: /maps\.googleapis/i, gtag: /googletagmanager|gtag\(/i,
            facebookPixel: /connect\.facebook\.net|fbq\(/i, i18next: /i18next/i, axios: /axios/i, reactRouter: /react-router|useNavigate|createBrowserRouter/i,
            reactQuery: /QueryClient|useQuery/i, zustand: /zustand/i, redux: /createSlice|redux/i, framerMotion: /framer-motion|motion\.div/i,
            swiper: /swiper/i, whatsapp: /wa\.me|api\.whatsapp/i, recaptcha: /recaptcha/i, sentry: /sentry/i,
        }).map(([k, re]) => [k, re.test(allJs + home.text)]),
    );
    // Visible-text hints (page titles via i18n keys)
    const i18nKeys = uniq([...allJs.matchAll(/\bt\(\s*["'`]([a-zA-Z0-9_.\-]{3,80})["'`]/g)].map((m) => m[1]));
    const pageChunks = uniq(jsFiles.map(([u]) => u.split('/').pop().replace(/-[A-Za-z0-9_\-]{6,}\.js$/, '')));

    // Save the locale chunks: they contain the visible copy of every page (section titles, CTAs)
    for (const [u, r] of jsFiles) {
        const name = u.split('/').pop();
        if (/^(en|id)-[A-Za-z0-9_\-]{6,}\.js$/.test(name)) await save(`${site}/locales/${name}`, r.text);
    }

    // Public (anonymous) storefront API — same calls the browser makes; reveals the product data model
    const apiBase = 'https://api.nircoffee.id';
    const publicApi = {};
    for (const p of ['/v1/public/config', '/v1/public/products', '/v1/public/products/archived', '/v1/public/shop/announcements', '/v1/public/storefront/variant-types', '/v1/public/service-channels', '/v1/public/pricing-settings', '/v1/public/business-config']) {
        const r = await get(apiBase + p, { json: true });
        const body = r.body;
        const list = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : Array.isArray(body?.items) ? body.items : Array.isArray(body?.products) ? body.products : null;
        publicApi[p] = { status: r.status, count: list?.length ?? null, sampleKeys: list?.[0] ? Object.keys(list[0]) : body && typeof body === 'object' ? Object.keys(body) : null };
        await save(`${site}/api${p.replace(/\//g, '_')}.json`, body ?? { status: r.status, error: r.error, text: r.text.slice(0, 2000) });
    }

    // Probe candidate routes (SPA returns same shell -> status only proves server fallback)
    const candidates = uniq([...routeDecl.filter((p) => p.startsWith('/') && !p.includes(':') && !p.includes('*')), ...navTargets.filter((p) => !p.includes(':'))]).slice(0, 120);
    log(`nircoffee: probing ${candidates.length} candidate routes`);
    const probes = await pool(candidates, async (p) => {
        const r = await get(base + p);
        return { path: p, status: r.status, sameShell: r.text.includes('<div id="root"></div>') };
    });
    // Control: a path that cannot exist. If it also returns 200 + shell, HTTP status proves nothing
    const ctrl = await get(`${base}/__definitely-not-a-page-${Date.now()}`);
    const control = { status: ctrl.status, sameShell: ctrl.text.includes('<div id="root"></div>') };

    const findings = {
        site: base,
        architecture: {
            type: 'Client-side rendered SPA (Vite + React), empty <div id="root"> served for every route',
            evidence: ['evidence/nircoffee/index.html', 'evidence/nircoffee/bundle-manifest.json'],
            integrations,
            locales,
        },
        sitemap: {
            robotsSitemaps: sm.robotsSitemaps,
            sitemapsTried: sm.sitemaps,
            indexableUrlCount: sm.urls.size,
            groups: groupUrls([...sm.urls.keys()], base),
        },
        bundle: { filesFetched: fetched.size, jsFiles: jsFiles.length, pageChunks },
        routes: { declarations: routeDecl, navigationTargets: navTargets, templateRoutes: templRoutes, probes, control },
        api: { base: apiBase, endpoints: apiEndpoints, httpClientCalls: relApi, publicApi },
        i18nKeySample: i18nKeys.slice(0, 400),
    };
    await save(`${site}/findings.json`, findings);
    return findings;
}

/* ----------------------------- sanubari ----------------------------- */

const strip = (h = '') => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '–').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

async function paged(base, path, site, label, perPage = 100) {
    const items = [];
    let total = null;
    for (let page = 1; page <= 30; page++) {
        const sep = path.includes('?') ? '&' : '?';
        const r = await get(`${base}${path}${sep}per_page=${perPage}&page=${page}`, { json: true });
        if (page === 1) await save(`${site}/${label}.page1.headers.json`, { status: r.status, headers: r.headers, error: r.error });
        if (!r.ok || !Array.isArray(r.body)) break;
        total ??= Number(r.headers['x-wp-total'] ?? NaN);
        items.push(...r.body);
        if (r.body.length < perPage) break;
    }
    await save(`${site}/${label}.json`, items);
    return { total: Number.isFinite(total) ? total : items.length, items };
}

async function analyzeSanubari() {
    const base = 'https://sanubariroastery.id';
    const site = 'sanubari';
    log('sanubari: homepage');
    const home = await get(`${base}/`);
    await save(`${site}/index.html`, home.text);

    log('sanubari: sitemaps');
    const sm = await crawlSitemaps(base, site);

    log('sanubari: WP REST');
    const root = await get(`${base}/wp-json/`, { json: true });
    await save(`${site}/wp-json-root.json`, root.body ? { name: root.body.name, description: root.body.description, namespaces: root.body.namespaces } : { status: root.status, error: root.error });
    const pages = await paged(base, '/wp-json/wp/v2/pages?_fields=id,slug,link,title,parent,status,template', site, 'wp-pages');
    const posts = await paged(base, '/wp-json/wp/v2/posts?_fields=id,slug,link,title,date,excerpt,categories', site, 'wp-posts');

    log('sanubari: WooCommerce Store API');
    const products = await paged(base, '/wp-json/wc/store/v1/products?', site, 'wc-products', 100);
    const cats = await paged(base, '/wp-json/wc/store/v1/products/categories?', site, 'wc-categories', 100);

    const seed = {
        source: base,
        generatedAt: new Date().toISOString(),
        note: 'Reference data only — used to shape dummy seed data for the Sanubari Laravel app.',
        brand: {
            name: 'Sanubari Roastery',
            tagline: 'Close to Every Brew',
            whatsapp: (home.text.match(/wa\.me\/(\d+)/) ?? [])[1] ?? null,
            mapsUrl: (home.text.match(/https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9]+/) ?? [])[0] ?? null,
        },
        categories: cats.items.map((c) => ({ id: c.id, name: strip(c.name), slug: c.slug, parent: c.parent, count: c.count, description: strip(c.description), image: c.image?.src ?? null })),
        products: products.items.map((p) => ({
            id: p.id,
            name: strip(p.name),
            slug: p.slug,
            type: p.type,
            permalink: p.permalink,
            price: p.prices ? Number(p.prices.price) / 10 ** (p.prices.currency_minor_unit ?? 0) : null,
            regularPrice: p.prices ? Number(p.prices.regular_price) / 10 ** (p.prices.currency_minor_unit ?? 0) : null,
            priceRange: p.prices?.price_range ?? null,
            currency: p.prices?.currency_code ?? 'IDR',
            inStock: p.is_in_stock,
            onSale: p.on_sale,
            shortDescription: strip(p.short_description),
            description: strip(p.description),
            categories: (p.categories ?? []).map((c) => c.slug),
            attributes: (p.attributes ?? []).map((a) => ({ name: a.name, terms: (a.terms ?? []).map((t) => t.name) })),
            variations: (p.variations ?? []).map((v) => v.attributes),
            images: (p.images ?? []).map((i) => i.src),
            rating: p.average_rating,
            reviewCount: p.review_count,
        })),
        pages: pages.items.map((p) => ({ id: p.id, slug: p.slug, title: strip(p.title?.rendered), link: p.link, parent: p.parent })),
        posts: posts.items.map((p) => ({ id: p.id, slug: p.slug, title: strip(p.title?.rendered), date: p.date, excerpt: strip(p.excerpt?.rendered) })),
    };
    await mkdir(OUT, { recursive: true });
    await writeFile(join(OUT, 'sanubari-seed.json'), JSON.stringify(seed, null, 2));

    const findings = {
        site: base,
        architecture: {
            type: 'WordPress + WooCommerce (server-rendered theme)',
            namespaces: root.body?.namespaces ?? [],
        },
        sitemap: { robotsSitemaps: sm.robotsSitemaps, sitemapsTried: sm.sitemaps, indexableUrlCount: sm.urls.size, groups: groupUrls([...sm.urls.keys()], base) },
        counts: { pages: pages.total, posts: posts.total, products: products.total, categories: cats.total },
    };
    await save(`${site}/findings.json`, findings);
    return { findings, seed };
}

/* ----------------------------- report ----------------------------- */

function table(rows, headers) {
    return [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

function report(nir, san) {
    const g = (groups) => table(Object.entries(groups).map(([k, v]) => [`\`${k}\``, v.length, v.slice(0, 3).map((x) => `\`${x}\``).join(', ')]), ['Path group', 'URLs', 'Examples']);
    return `# Site Research Report (generated)

> Generated by \`node scripts/research/analyze-sites.mjs\` on ${new Date().toISOString()}.
> Raw proof lives in [\`docs/research/evidence/\`](evidence/). Re-run the script to refresh.

## 1. nircoffee.id — structural reference

**Architecture:** ${nir.architecture.type}
**Locales found in bundle:** ${nir.architecture.locales.join(', ') || 'none'}
**Integrations detected:** ${Object.entries(nir.architecture.integrations).filter(([, v]) => v).map(([k]) => k).join(', ')}

### Page count from sitemap (indexable pages)
**${nir.sitemap.indexableUrlCount} URLs** across ${nir.sitemap.sitemapsTried.filter((s) => s.isXml).length} sitemap file(s).

${g(nir.sitemap.groups)}

### Routes declared in the shipped JS bundle
${nir.bundle.jsFiles} JS files fetched (see \`evidence/nircoffee/bundle-manifest.json\`).

Router \`path:\` declarations (${nir.routes.declarations.length}):
${nir.routes.declarations.map((r) => `- \`${r}\``).join('\n') || '- none found'}

Navigation targets (${nir.routes.navigationTargets.length}):
${nir.routes.navigationTargets.map((r) => `- \`${r}\``).join('\n') || '- none found'}

Template routes: ${nir.routes.templateRoutes.map((r) => `\`${r}\``).join(', ') || 'none'}

Lazy page chunks: ${nir.bundle.pageChunks.map((c) => `\`${c}\``).join(', ')}

### API endpoints referenced
${[...nir.api.endpoints, ...nir.api.httpClientCalls].map((e) => `- \`${e}\``).join('\n') || '- none found'}

### Public storefront API (\`${nir.api.base}\`)
${table(Object.entries(nir.api.publicApi).map(([p, v]) => [`\`${p}\``, v.status, v.count ?? '-', (v.sampleKeys ?? []).slice(0, 14).map((k) => `\`${k}\``).join(' ')]), ['Endpoint', 'Status', 'Items', 'Fields'])}

### Route probe (HTTP status of candidate routes)
> **Control:** a random non-existent path returned **${nir.routes.control.status}** (${nir.routes.control.sameShell ? 'same SPA shell' : 'different body'}).
> So HTTP status cannot prove a page exists — the sitemap + bundle route table are the real evidence.

${table(nir.routes.probes.map((p) => [`\`${p.path}\``, p.status, p.sameShell ? 'SPA shell' : 'other']), ['Path', 'Status', 'Body'])}

## 2. sanubariroastery.id — content reference

**Architecture:** ${san.architecture.type}
**Counts:** ${Object.entries(san.counts).map(([k, v]) => `${k}: **${v}**`).join(' · ')}
**Indexable URLs in sitemap:** ${san.sitemap.indexableUrlCount}

${g(san.sitemap.groups)}

Seed data written to [\`sanubari-seed.json\`](sanubari-seed.json).
`;
}

/* ----------------------------- main ----------------------------- */

const t0 = Date.now();
await mkdir(EVIDENCE, { recursive: true });
const [nir, sanRes] = await Promise.all([
    analyzeNir().catch((e) => ({ error: String(e?.stack ?? e) })),
    analyzeSanubari().catch((e) => ({ error: String(e?.stack ?? e) })),
]);
const findings = { generatedAt: new Date().toISOString(), nircoffee: nir, sanubari: sanRes.findings ?? sanRes };
await writeFile(join(OUT, 'findings.json'), JSON.stringify(findings, null, 2));
if (!nir.error && sanRes.findings) await writeFile(join(OUT, 'REPORT.generated.md'), report(nir, sanRes.findings));
log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
log(`nircoffee: sitemap URLs=${nir.sitemap?.indexableUrlCount ?? 'ERR'} routeDecl=${nir.routes?.declarations?.length ?? 'ERR'} js=${nir.bundle?.jsFiles ?? 'ERR'}`);
log(`sanubari: ${JSON.stringify(sanRes.findings?.counts ?? sanRes.error)}`);
if (nir.error) console.error('nircoffee error:', nir.error);
if (sanRes.error) console.error('sanubari error:', sanRes.error);
