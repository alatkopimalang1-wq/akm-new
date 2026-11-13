# Spec: Alat Kopi Malang (AKM) Laravel 11 + Filament v3 + Inertia React Standalone Architecture

Status: ready-for-agent

## Problem Statement

Alat Kopi Malang (AKM) currently operates as a client-side Single Page Application (SPA) deployed on Hostinger (`alatkopimalang.co.id`). Managing equipment inventory, technical specifications, prices, discounts, showroom media, and promotional banners currently requires manual code editing or reliance on client-side state, which lacks persistence and central management. While the sister project `sanubariroastery.co.id` uses a robust, battle-tested stack combining Laravel 11, Filament v3, and Inertia React, AKM requires its own completely independent installation. Merging with or coupling to Sanubari is unacceptable because coffee equipment merchandising (grinders, espresso machines, brewing gear, showroom display) has different operational requirements, workflows, and catalog data from coffee bean roasting. AKM needs a dedicated, unified Laravel 11 and Filament v3 application backed by its own isolated MySQL database (`u503256610_alatkopi`).

## Solution

Rebuild and transition Alat Kopi Malang into a unified full-stack application built on **Laravel 11, Filament v3, and Inertia.js with React 19 and Tailwind CSS v4**, mirroring the proven architectural elegance of `sanubariroastery.co.id` but operating on a fully isolated standalone instance. 

The application will feature:
1. A **Filament v3 Backoffice** mounted at `/admin`, offering native Eloquent resources for Products (coffee equipment), Categories, Hero Banners, Showroom Items, and Store Settings, with built-in authentication, form validations, media uploads, and permission handling.
2. An **Inertia.js React 19 Storefront** providing seamless server-driven props hydration for the existing AKM aesthetic, instant client navigation, reactive search and filter capabilities, shopping bag management, and WhatsApp concierge checkout.
3. Dedicated **Hostinger MySQL Database** (`u503256610_alatkopi`) utilizing standard Laravel migrations and seeders to migrate all 17 initial equipment items, categories, and media assets.

## User Stories

1. As a store manager, I want to log in securely to `/admin` using Laravel authentication credentials, so that only authorized personnel can modify catalog inventory and store configuration.
2. As a store manager, I want an admin dashboard overview showing active equipment count, low-stock alerts, total categories, and active promotional banners, so that I can immediately monitor store status.
3. As a store manager, I want to view a searchable, paginated Filament table of all coffee gear with thumbnail previews, category badges, stock levels, and pricing, so that catalog browsing is fast and convenient.
4. As a store manager, I want to create a new coffee gear product with title, slug, brand, category, regular price, discount price, stock quantity, technical specifications, and uploaded gallery images, so that newly arrived equipment appears instantly on the storefront.
5. As a store manager, I want to edit product pricing, adjust stock numbers, or update descriptions through Filament form modals or full-page editors, so that inventory changes are immediately reflected in customer views.
6. As a store manager, I want to toggle a product's status between active, draft, and out of stock without deleting the record, so that seasonal or discontinued tools can be hidden gracefully.
7. As a store manager, I want to mark select products as "Featured" or "Flash Sale", so that they automatically populate designated highlight carousels on the homepage.
8. As a store manager, I want to upload high-resolution product photos directly through Filament's file upload field into public storage, so that I do not need manual FTP or file manager operations.
9. As a store manager, I want to manage equipment categories (Manual Brew, Grinders, Espresso, Scales, Kettles, Barista Accessories) with custom slugs and icons, so that customer navigation remains organized.
10. As a store manager, I want to create, edit, reorder, and toggle homepage hero banners (title, subtitle, badge, background image, CTA button link), so that marketing promotions can be run on demand.
11. As a store manager, I want to curate showroom items (displaying photos, titles, and descriptions of AKM's physical experience showroom in Malang), so that visitors understand our physical presence.
12. As a store manager, I want to update site settings (store title, WhatsApp concierge contact number, store address, operating hours, announcement banner text), so that customer communications route to the correct channels.
13. As a storefront customer, I want the homepage to load instantly with server-hydrated product and hero banner data via Inertia.js, so that I experience fast initial page loads with rich SEO metadata.
14. As a storefront customer, I want to browse products by category, filter by price range, and sort by newest or popularity, so that I can easily find the specific coffee equipment I need.
15. As a storefront customer, I want to view individual product detail pages with full image galleries, specifications, stock availability, and related gear recommendations.
16. As a storefront customer, I want to add items to my shopping bag with persistent client state, calculate totals, and view real-time stock limits.
17. As a storefront customer, I want to proceed to checkout via an automated WhatsApp concierge order link or manual bank transfer / QRIS payment instructions.
18. As a storefront customer, I want live search with debounced instant results when typing equipment names or brands, so that I can quickly jump to specific items.
19. As a developer, I want a complete set of Laravel database migrations and seeders that reproduce the initial AKM catalog into the dedicated MySQL database (`u503256610_alatkopi`).
20. As a developer, I want a unified Vite build workflow using `@inertiajs/react` and `@tailwindcss/vite` that compiles all assets into Laravel's public directory for deployment on Hostinger.

## Implementation Decisions

- **Architecture Pattern:** Monolithic Laravel 11 application utilizing Inertia.js v2 for seamless React 19 frontend integration and Filament v3 for the administrative panel.
- **Dedicated Database:**
  - Dedicated MySQL database `u503256610_alatkopi` hosted on Hostinger.
  - Eloquent models: `Product`, `Category`, `ProductImage`, `HeroBanner`, `ShowroomItem`, `Setting`, and `User`.
  - Many-to-many relationship between `Product` and `Category`.
  - One-to-many relationship between `Product` and `ProductImage`.
- **Administrative Backoffice (Filament v3):**
  - Panel Provider mounted at route `/admin` using default auth guards.
  - Resources:
    - `ProductResource`: Form with tabs for General Information, Pricing & Stock, Technical Specs, and Gallery Uploads; Table with search, category filters, and quick stock edit actions.
    - `CategoryResource`: Hierarchical or flat gear category management.
    - `HeroBannerResource`: Media and CTA link editor with drag-and-drop sort order.
    - `ShowroomResource`: Image and narrative showcase editor for physical store photos.
    - `SettingResource` (or custom Settings page): Key-value store for contact numbers, addresses, and announcements.
- **Frontend Presentation Layer:**
  - Inertia.js client mounted on `@inertiajs/react` with React 19.
  - Blade layout template `@inertia` hosting the React root component and asset directives.
  - Page components under `resources/js/Pages/` replicating the existing AKM storefront pages (`Home`, `Shop`, `ProductDetail`, `Showroom`, `About`, `Cart`, `Checkout`).
  - Tailwind CSS v4 styling matching the current dark/warm coffee palette.
- **Asset Storage & Uploads:**
  - Public disk storage symlinked via `php artisan storage:link` to `public/storage/`.
  - Filament configured to store product and banner assets in organized subdirectories (`products/`, `banners/`, `showroom/`).
- **Storefront Fallback & Offline Resilience:**
  - Global Inertia shared props delivering store settings, category tree, and cart counter to every view.

## Testing Decisions

- **Testing Philosophy:**
  - Tests verify observable system behavior at the highest seam: HTTP requests and Inertia responses, and Filament admin panel interactions.
- **Modules Tested:**
  - **Inertia Web Routes:** Test that `GET /`, `GET /shop`, and `GET /product/{slug}` return HTTP 200 with the correct Inertia component and hydrated data payloads.
  - **Filament Admin Access & Auth:** Test that `/admin` redirects unauthenticated users to the login gate, and grants access to authenticated store administrators.
  - **Filament CRUD Actions:** Test that creating and updating products, categories, and banners persists changes to the MySQL database and respects validation rules.
  - **Seed & Migration Verification:** Test that executing migrations and seeders cleanly sets up the database schema and loads the base catalog.
- **Prior Art:**
  - Pest PHP / PHPUnit HTTP feature tests and Filament component testing helpers (`Filament\Testing\TestsForms`, `livewire()`).

## Out of Scope

- Merging databases or sharing Filament resources with `sanubariroastery.co.id` (strictly separated).
- Direct automated payment gateway integration (orders process via WhatsApp order links and manual QRIS transfer).
- Third-party courier API webhooks.

## Further Notes

- The Hostinger Cloud Economy hosting environment supports PHP 8.3, Composer, and Node.js 22, allowing standard Laravel deployment alongside automated Git pulls or deployment scripts.

