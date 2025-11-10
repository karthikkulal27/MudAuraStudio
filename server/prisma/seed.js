import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Handcrafted Clay Vase',
    description: 'Beautiful terracotta vase, handmade by local artisans. Perfect for fresh flowers or dried arrangements.',
    price: 45.99,
    category: 'Vases',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
    ],
    stock: 15,
    featured: true,
  },
  {
    name: 'Rustic Clay Pot Set',
    description: 'Set of 3 rustic clay pots in varying sizes. Ideal for herbs, succulents, or small plants.',
    price: 32.50,
    category: 'Pots',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    ],
    stock: 20,
    featured: true,
  },
  {
    name: 'Artisan Clay Bowl',
    description: 'Hand-thrown ceramic bowl with natural glaze. Microwave and dishwasher safe.',
    price: 28.00,
    category: 'Bowls',
    images: [
      'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&q=80',
    ],
    stock: 12,
    featured: false,
  },
  {
    name: 'Decorative Planter',
    description: 'Modern geometric planter with drainage hole. Perfect for indoor plants.',
    price: 39.99,
    category: 'Planters',
    images: [
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80',
    ],
    stock: 18,
    featured: true,
  },
  {
    name: 'Clay Mug Set',
    description: 'Set of 4 handcrafted mugs with earthy glaze. Each piece is unique.',
    price: 52.00,
    category: 'Mugs',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    ],
    stock: 10,
    featured: false,
  },
  {
    name: 'Terracotta Serving Dish',
    description: 'Large serving dish perfect for family meals. Oven-safe up to 450°F.',
    price: 48.75,
    category: 'Dishes',
    images: [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
    ],
    stock: 8,
    featured: false,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Seed admin user if env provided (or defaults)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
  const ADMIN_NAME = process.env.ADMIN_NAME || 'Super Admin';
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, password: hashed, role: 'ADMIN' },
    create: { email: ADMIN_EMAIL, name: ADMIN_NAME, password: hashed, role: 'ADMIN' },
  });
  console.log(`✅ Admin user ensured: ${ADMIN_EMAIL} / (your password)`);

  // Clear existing products (optional)
  await prisma.product.deleteMany();
  console.log('✅ Cleared existing products');

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);
  // Seed testimonials
  await prisma.testimonial?.deleteMany().catch(() => {});
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Interior Designer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      content:
        "The quality of ClayAura's ceramics is outstanding. Each piece tells a story and brings warmth to any space.",
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Coffee Shop Owner',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      content:
        'We exclusively use ClayAura pour-over coffee makers in our shop. Our customers love the aesthetic and the coffee tastes amazing.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Home Chef',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      content:
        "The dining set I purchased is both beautiful and practical. It's become the centerpiece of my dinner parties.",
      rating: 4,
    },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✅ Created ${testimonials.length} testimonials`);
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
