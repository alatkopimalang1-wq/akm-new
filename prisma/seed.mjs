import { PrismaClient } from '@prisma/client';
import { PRODUCTS, CATEGORIES } from '../src/data/products.js';
import { HERO_SLIDES } from '../src/components/Hero.jsx';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug || cat.id,
        icon: cat.icon || null,
        count: cat.count || 0,
        tagline: cat.tagline || null,
        description: cat.description || null
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.id,
        icon: cat.icon || null,
        count: cat.count || 0,
        tagline: cat.tagline || null,
        description: cat.description || null
      }
    });
  }

  console.log('Seeding products...');
  for (const prod of PRODUCTS) {
    const { variants, ...prodData } = prod;
    const createdProd = await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        name: prodData.name,
        slug: prodData.slug,
        brand: prodData.brand,
        category: prodData.category,
        price: prodData.price,
        originalPrice: prodData.originalPrice || null,
        badge: prodData.badge || null,
        rating: prodData.rating || 5.0,
        reviewsCount: prodData.reviewsCount || 0,
        stock: prodData.stock || 10,
        images: prodData.images || [],
        tagline: prodData.tagline || null,
        description: prodData.description || null,
        specs: prodData.specs || null
      },
      create: {
        id: prodData.id,
        name: prodData.name,
        slug: prodData.slug,
        brand: prodData.brand,
        category: prodData.category,
        price: prodData.price,
        originalPrice: prodData.originalPrice || null,
        badge: prodData.badge || null,
        rating: prodData.rating || 5.0,
        reviewsCount: prodData.reviewsCount || 0,
        stock: prodData.stock || 10,
        images: prodData.images || [],
        tagline: prodData.tagline || null,
        description: prodData.description || null,
        specs: prodData.specs || null
      }
    });

    if (variants && variants.length > 0) {
      await prisma.variant.deleteMany({ where: { productId: createdProd.id } });
      for (const v of variants) {
        await prisma.variant.create({
          data: {
            id: v.id || `${createdProd.id}-${v.label.toLowerCase().replace(/\\s+/g, '-')}`,
            productId: createdProd.id,
            label: v.label,
            price: v.price || null,
            inStock: v.inStock !== false
          }
        });
      }
    }
  }

  console.log('Seeding hero slides...');
  for (let i = 0; i < HERO_SLIDES.length; i++) {
    const slide = HERO_SLIDES[i];
    await prisma.heroSlide.upsert({
      where: { id: `hero-${i + 1}` },
      update: {
        order: i,
        badge: slide.badge,
        title: slide.title,
        subtitle: slide.subtitle,
        desc: slide.desc,
        image: slide.image,
        link: slide.link || '/kategori/all',
        ctaText: slide.ctaText || 'Mulai Belanja',
        isActive: true
      },
      create: {
        id: `hero-${i + 1}`,
        order: i,
        badge: slide.badge,
        title: slide.title,
        subtitle: slide.subtitle,
        desc: slide.desc,
        image: slide.image,
        link: slide.link || '/kategori/all',
        ctaText: slide.ctaText || 'Mulai Belanja',
        isActive: true
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

