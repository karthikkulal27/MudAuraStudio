import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`❌ No user found with email ${email}`);
  } else {
    console.log(`✅ Found user: ${user.email} role=${user.role} id=${user.id}`);
  }
  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
