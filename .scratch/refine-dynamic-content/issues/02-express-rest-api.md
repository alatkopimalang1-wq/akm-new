# 02: Express.js REST API and Image Upload Endpoint

**What to build:**
Create an Express server providing standard RESTful CRUD endpoints compatible with Refine simple-rest provider (`/api/products`, `/api/categories`, `/api/hero-slides`, `/api/orders`), along with a `multer`-based image upload endpoint (`/api/upload`) storing images into `public/uploads/`.

**Blocked by:** 01: Database Schema and Prisma ORM Setup

**Status:** resolved

- [x] Express API routes for products CRUD with filtering and sorting
- [x] Express API routes for categories and hero slides CRUD
- [x] `/api/upload` endpoint handling single/multiple image uploads to `public/uploads/`
- [x] Static middleware serving uploaded files from `/uploads`
