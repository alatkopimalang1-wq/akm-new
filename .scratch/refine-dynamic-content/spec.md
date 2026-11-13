# Spec: Refine.dev Backoffice with Express.js, Prisma ORM, and MySQL on Hostinger

## Problem Statement
The current Alat Kopi Malang (AKM) e-commerce storefront serves hardcoded product data, hero slides, categories, and coupons stored in static files (`src/data/products.js`) and temporary client `localStorage`. Store administrators cannot update product prices, add new coffee gear, edit hero promotional banners, or track customer orders from a centralized persistent database across multiple devices.

## Solution
Implement a full-stack, dynamic backoffice system accessible at `/admin` built with Refine.dev, backed by an Express.js REST API with Prisma ORM connected to the live Hostinger MySQL database (`u503256610_alatkopi`). Product catalog and hero slides on the homepage and catalog pages will fetch from the database via REST endpoints, allowing immediate storefront updates whenever modified in the backoffice.

## User Stories
1. As a store manager, I want to access `/admin` with secure credentials so that unauthorized users cannot alter catalog pricing or store banners.
2. As a store manager, I want to view, search, filter, and paginate through all coffee equipment and beans in a tabular backoffice interface.
3. As a store manager, I want to create a new product with multiple image uploads, specifications, price, original price, stock, and variants so that it becomes immediately visible on the storefront.
4. As a store manager, I want to edit existing products and have the changes reflected in real time on the live homepage and category catalog.
5. As a store manager, I want to upload image files directly in the backoffice and have them stored in `public/uploads/` on Hostinger.
6. As a store manager, I want to manage hero slides (title, subtitle, badge, image, CTA links) dynamically from the backoffice.
7. As a storefront customer, I want the homepage hero banner and featured products to load dynamically from the database.
8. As a storefront customer, I want to browse products by category and see real-time pricing and stock counts.
9. As a developer, I want an automated migration seed script to transfer all existing 17 products, categories, and default slides from `src/data/products.js` into the MySQL database upon initial setup.

## Implementation Decisions
- **Database:** Hostinger MySQL (`u503256610_alatkopi`) using Prisma ORM.
- **Backend API:** Lightweight Express.js API embedded or running alongside the Vite application in Node.js, exposing RESTful endpoints:
  - `/api/products` (CRUD)
  - `/api/categories` (CRUD)
  - `/api/hero-slides` (CRUD)
  - `/api/upload` (File upload via multer saving to `public/uploads/`)
  - `/api/auth` (Admin authentication)
- **Admin Panel:** Embedded in the same single-page application at `/admin` using Refine.dev (`@refinedev/core`, `@refinedev/simple-rest`) styled with Tailwind CSS to match the AKM theme.
- **Storage:** Local static assets stored under `public/uploads/` and served statically.
- **Data Seeding:** Automated Prisma seed populating existing products and categories from `src/data/products.js`.

## Testing Decisions
- Test backend REST API endpoints using Vitest / Node test runner for status codes, CRUD operations, and payload validations.
- Test frontend data fetch integration so the homepage gracefully falls back if API connectivity drops.

## Out of Scope
- Direct payment gateway gateway integrations (orders remain processed via WhatsApp and manual bank transfer / QRIS).
- Multi-vendor marketplace capabilities (single tenant Sanubari x AKM only).

## Further Notes
- Hostinger Node.js runtime is version 22, fully compatible with Prisma and Express.js.
