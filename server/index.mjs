import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public uploads directory setup
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Upload Endpoint
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  try {
    const files = req.files || [];
    const urls = files.map((file) => `/uploads/${file.filename}`);
    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// ================== PRODUCTS REST API (Refine Compatible) ==================
app.get('/api/products', async (req, res) => {
  try {
    const { _sort, _order, _start, _end, category, q } = req.query;
    const where = {};

    if (category && category !== 'all') {
      where.category = String(category);
    }
    if (q) {
      where.OR = [
        { name: { contains: String(q) } },
        { brand: { contains: String(q) } },
        { description: { contains: String(q) } }
      ];
    }

    const orderBy = {};
    if (_sort) {
      orderBy[String(_sort)] = _order === 'DESC' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const total = await prisma.product.count({ where });
    const take = _start && _end ? Math.max(1, Number(_end) - Number(_start)) : undefined;
    const skip = _start ? Number(_start) : undefined;

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
      include: { variants: true }
    });

    res.header('x-total-count', total.toString());
    res.header('Access-Control-Expose-Headers', 'x-total-count');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: req.params.id }, { slug: req.params.id }]
      },
      include: { variants: true }
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { variants, ...data } = req.body;
    const product = await prisma.product.create({
      data: {
        id: data.id || `akm-prod-${Date.now()}`,
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: data.brand || 'Sanubari',
        category: data.category || 'manual-brew',
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        badge: data.badge || null,
        stock: Number(data.stock || 10),
        images: data.images || [],
        tagline: data.tagline || null,
        description: data.description || null,
        specs: data.specs || null,
        variants: variants && variants.length > 0 ? {
          create: variants.map(v => ({
            label: v.label,
            price: v.price ? Number(v.price) : null,
            inStock: v.inStock !== false
          }))
        } : undefined
      },
      include: { variants: true }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { variants, ...data } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        slug: data.slug,
        brand: data.brand,
        category: data.category,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        badge: data.badge || null,
        stock: Number(data.stock || 10),
        images: data.images || [],
        tagline: data.tagline || null,
        description: data.description || null,
        specs: data.specs || null
      },
      include: { variants: true }
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ================== HERO SLIDES REST API ==================
app.get('/api/hero-slides', async (req, res) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/hero-slides/:id', async (req, res) => {
  try {
    const slide = await prisma.heroSlide.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(slide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ================== CATEGORIES REST API ==================
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { count: 'desc' }
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Alat Kopi Malang API' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`AKM Express REST API running on port ${PORT}`);
  });
}

export default app;
