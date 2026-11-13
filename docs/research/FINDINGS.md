# Research Findings — nircoffee.id (structure) & sanubariroastery.id (content)

> Produced by one script: `node scripts/research/analyze-sites.mjs` (~8 s, no prompts).
> Raw proof: [`evidence/`](evidence/) · Generated report: [`REPORT.generated.md`](REPORT.generated.md)
> · Screenshots: [`screenshots/`](screenshots/) · Captured 2026-10-22.

## 1. How nircoffee.id works

| Aspect | Observation | Evidence |
| --- | --- | --- |
| Rendering | Client-side SPA (Vite + React). Server returns the same empty `<div id="root">` for **every** path | `evidence/nircoffee/index.html` |
| Proof that HTTP status is meaningless | A random path `/__definitely-not-a-page-…` returns **200** + same shell | `REPORT.generated.md` → Control |
| Routing | React Router; 499 JS chunks (lazy pages + legacy builds) | `evidence/nircoffee/bundle-manifest.json` |
| Backend | Separate REST API `https://api.nircoffee.id/v1/...` (public + customer + payments) | report → API endpoints |
| i18n | i18next, `en` + `id` locale chunks, URL locale prefix (`/en-us/...`, 22 market codes) | `evidence/nircoffee/locales/` |
| Commerce | Cart, checkout, Xendit (ID) + Stripe (international), shipping calc, order tracking | integrations list in report |
| Other | Google Maps (address), GTM/GA, Facebook Pixel, framer-motion animations, floating WhatsApp button | report |

## 2. How many pages — the answer

### Indexable public pages (from `sitemap.xml`): **60**

| Group | Count | URLs |
| --- | --- | --- |
| Home | 1 | `/` |
| Shop listing | 1 | `/shop` |
| Shop tools | 3 | `/shop/byob`, `/shop/calculator`, `/shop/past-releases` |
| **Product detail** | **41** | `/shop/{series}/{type}/{slug}` e.g. `/shop/daily/filter/flores-mbohang-190` |
| Content / marketing | 9 | `/about`, `/sourcing`, `/brewguide`, `/rubasse`, `/fermentation-project`, `/wholesale`, `/events`, `/blog`, `/garage-sale` |
| Legal | 5 | `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/legal/refund`, `/legal/data-requests` |

Cross-check: the public API `GET /v1/public/products` returns **41** released products
(+16 archived) — exactly matching the 41 product URLs in the sitemap.

### Distinct page templates in the JS bundle (incl. non-indexed)

| Area | Templates (route declarations found in bundle) |
| --- | --- |
| Public marketing (≈12) | home, about, sourcing, brewguide, rubasse, fermentation-project, wholesale, wholesale/apply, wholesale/apply/success, events, events/:eventId/register, blog, garage-sale, garage-sale/:code, impact |
| Catalog (≈7) | shop, shop/:series/:type/:slug, shop/past-releases(+/:code), shop/byob, shop/calculator, collection(+/:productCode) |
| Legal (7) | privacy, terms, cookies, refund, data-requests, event-terms, competition-rules |
| Commerce (≈9) | cart, checkout, checkout/success/:code, checkout/failed, checkout/return, find-order, tracking/:id, order/:code, verify/invoice/:token |
| Auth (≈7) | signin, signup, forgot, password-reset, set-password, onboarding, verify-email |
| Customer account (≈10) | account, orders(/:id), addresses, profile, account/privacy, coffee/passport(/:code), coffee/brew (studio, history, kit, onboarding) |

Full list (213 `path:` declarations, mixed UI + API segments): `REPORT.generated.md`.

## 3. Page anatomy (from screenshots)

| Page | Sections observed |
| --- | --- |
| Home | Full-bleed B&W photo hero, eyebrow "COFFEE ROASTERY IN MALANG", serif-mix headline (bold + red italic), 2 CTAs → "01 On the bench" latest 5 products (card: bag image, name, tasting notes, price/unit, red + button) → "02 Together" team photo + copy → … → closing CTA band → 4-column footer (Shop / Community / Contact / Visit us + hours) |
| Shop | Title + subtitle, Past Releases button, search, sort (A→Z), pill filters **Series** (All/Daily/Limited) + **Type** (All/Filter/Espresso), 2 promo cards (Build Your Own Blend, Fermentation Project), grouped grids "Daily Series", "Limited Series" |
| Product | Breadcrumb, large bag image, name, size pills (100/200/500 g), price per unit, qty stepper, Add to Cart; "At a glance": tasting notes, **freshness slider**, spec tiles (Farm, Region, Producer, Process, Altitude, Varietals); **Transparency** accordions: green landed cost, price breakdown (HPP, packaging, …) |
| Sourcing / Brewguide / Wholesale | Full-bleed photo hero, eyebrow breadcrumb, giant headline with red italic word, "SECTION 01 / 0N" counter, scroll cue, then numbered sticky sections |
| Events | Editorial header + sticky info card (date, location, spots, fee, Register CTA) |
| Calculator | Two cards: inputs (category, green cost/kg) → estimated retail prices per size |

**Visual language:** Raleway, light grey `#f5f5f5` backgrounds, near-black `#111827` text,
signature red `#dc2626`/`#e00000`, rounded cards, pill buttons, thin eyebrow labels with
numbering, B&W photography, floating WhatsApp button.

## 4. Product data model (nircoffee public API)

`id, code, name, productType, tagline{en,id}, story{en,id}, reason, tastingNotes, releasedAt,
isReleased, isArchived, freshness, roastLevel, greenBeanProfile{country, region, producer,
farm, varietals, process, altitude, harvestPeriod, type: DAILY|LIMITED},
roastProfileConfig{roastProfile: ESPRESSO|FILTER}, images[], variants[{variantTypeCode,
weightGrams, sku, stockStatus, pricing[]}], options[]` — `evidence/nircoffee/api_v1_public_products.json`.

## 5. sanubariroastery.id (content source)

| Aspect | Value |
| --- | --- |
| Platform | WordPress + WooCommerce (server-rendered) |
| Indexable URLs | 78 (56 products, 9 categories, 13 other) |
| Real pages | Home, Shop, Cart, Checkout, My Account, Wishlist, Konfirmasi Pembayaran, Blog (+ WP defaults "Sample Page", "Hello World") |
| Categories | **Filter Beans** (Classic Process, Experimental Process, CO-Ferment Proses) · **Espresso Beans** (Arabica, Houseblend, Robusta) · Kawi (brand) |
| Products | 56, variable (Kemasan: 15 g … 1 kg), Rp 15.000 – Rp 155.000+ |
| Product description fields | Origin, Varietas, Process, Altitude, Brew Method, Taste Profile (parsed from text) |
| Brand copy | "Close to Every Brew", "Jejak Rasa di Gunung Kawi", Wholesale & B2B, "Sanubari Roastery x Alat Kopi Malang — one stop shopping", hours 09.00–23.00 |
| Contact | WhatsApp `6285121930454`, Maps `https://maps.app.goo.gl/PMuxaEtsbEvC4APy7` |

Normalised data for seeders: [`sanubari-seed.json`](sanubari-seed.json).

## 6. Observed vs. inferred

- **Observed:** sitemap URLs, bundle route strings, API responses, screenshots, WP/Woo REST data.
- **Inferred:** the template grouping in §2 (route strings are mixed UI/API segments and were
  classified by name); exact behaviour of auth/account pages (not visited — out of scope).
- **Not done:** no login, cart or checkout actions were performed on either site.

## 7. Otten Coffee (ottencoffee.co.id) — Mobile Layout & Shape Analysis

> Mobile layout reference captured using Playwright iPhone 14 emulation (390×844 @ 3x).
> Evidence: [`screenshots/otten-mobile/`](screenshots/otten-mobile/) (`full-page.png`, `00-first-view-with-popups-removed.png`, `slice-01` to `slice-09`).
> **Rule:** Adopt Otten's layout structure, visual hierarchy, and component shapes ONLY. Never use Otten's branding, orange/olive colors, or copy. Use Sanubari's palette (`#2E474E` slate-teal).

### Structural Components & Shapes Observed

| Component | Shape & Visual Anatomy | Mapped to Sanubari Mobile Homepage |
| --- | --- | --- |
| **Top Download / Announcement Bar** | Dismissible top strip with app icon, 1-line copy, and small pill action button. | Dismissible announcement bar (e.g. Free shipping / Roastery hours). |
| **Search Header (Sticky)** | Full-width header with an inset `rounded-full` search input box. Magnifying glass on the left, placeholder text, camera & mic iconography on the right. | Sticky search bar with Sanubari logo mark and search input pill (`rounded-full`). |
| **Quick Filter Chips (Pills)** | Horizontally scrollable row of pill-shaped buttons (`rounded-full` or `rounded-lg`). Active state has solid background; inactive state has subtle border. | Category pills (`Semua`, `Filter Beans`, `Espresso Beans`, `Kawi Brand`, `New Arrival`). |
| **Hero Carousel** | Inset card with `rounded-2xl` corners, aspect ratio ≈ 16:9, subtle edge shadows, and bottom-right dot indicator pagination. | Hero slider featuring Sanubari's signature beans and "Jejak Rasa di Gunung Kawi". |
| **Category Icon Badges** | Horizontal scroll of circular badges (`rounded-full`, 56×56px) with clean icons and 2-line category captions underneath. | Sanubari categories: Arabica, Robusta, Houseblend, Classic, Experimental, Co-Ferment, Merchandise. |
| **Highlight / Flash Section** | Split container: Left colored accent card with countdown / spotlight badge; right side horizontal product carousel. | "Fresh Roast Spotlight" with roast date countdown / latest micro-lot release. |
| **Product Card Anatomy** | - Aspect ratio 1:1 square product image with rounded top corners (`rounded-xl`).<br>- Floating discount / tag badge on top-left (`NEW`, `DISCOUNT`).<br>- Floating wishlist heart icon on top-right.<br>- Product title (2-line clamped).<br>- Strikethrough comparison price + bold current price.<br>- Star rating and sold count social proof.<br>- Full-width pill action button `+ Keranjang`. | Standard Sanubari mobile product card used in all horizontal carousels and catalog grids. |
| **Curated Collection Tiles** | 2-column grid of image cards with dark gradient overlay, category title, and subtitle (e.g. "Baru Mau Mulai Ngopi?", "Bundling Sets"). | 2-column entry points for Sanubari: "Filter Starter Pack", "Espresso Barista Choice", "B2B / Wholesale". |
| **Recipe / Brew Guide Carousel** | Editorial guide cards with photo, circular brewer avatar, and brew recipe title. | Sanubari Brew Guides (V60, Aeropress, Espresso, Tubruk) linking to `/brewguide`. |
| **Store / Roastery Location Card** | Card with roastery photo, opening hours badge (`09.00 - 23.00`), location summary, and `Lihat di Maps` outline button. | Sanubari Roastery location card (Malang, East Java) with Google Maps link. |
| **Sticky Bottom Navigation** | Fixed bottom nav bar (height 56-60px) with backdrop blur, subtle top border, and 5 navigation tabs: Home, Kategori (Shop), Panduan Seduh (Brew Guide), Keranjang (Cart + badge count), Kontak / Akun. | Sticky mobile bottom navigation active only on screens < 768px. |

