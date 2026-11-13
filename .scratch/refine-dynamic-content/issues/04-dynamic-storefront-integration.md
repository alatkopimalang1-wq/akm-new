# 04: Dynamic Storefront Integration

**What to build:**
Connect the public storefront (`App.jsx`, `Hero.jsx`, `CategoryPage.jsx`, and `ProductDetailPage.jsx`) to fetch dynamic products, categories, and hero slides from the Express REST API, with fallback to local defaults to guarantee zero-downtime reliability.

**Blocked by:** 03: Refine.dev Backoffice Interface at /admin

**Status:** resolved

- [x] Homepage hero banner loads active slides from `/api/hero-slides`
- [x] Product catalogs and detail pages fetch live product data from `/api/products`
- [x] Image URLs correctly point to uploaded assets under `/uploads/`
- [x] Offline fallback ensures storefront still renders if server is loading
