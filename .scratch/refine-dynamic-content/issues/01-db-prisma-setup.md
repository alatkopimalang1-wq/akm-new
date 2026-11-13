# 01: Database Schema and Prisma ORM Setup

**What to build:**
Define the Prisma schema for Products, Categories, HeroSlides, Variants, and AdminUser. Configure MySQL connection pointing to the Hostinger database (`u503256610_alatkopi`) and create an automated seed script that migrates all existing 17 products, categories, and hero banners into the database.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `prisma/schema.prisma` created with Product, Category, HeroSlide, Variant, AdminUser models
- [x] Database migration / push scripts configured
- [x] `prisma/seed.mjs` successfully seeds all existing products and categories from `src/data/products.js`
