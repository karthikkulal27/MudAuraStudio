import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } });
  console.log(`Total users: ${users.length}`);
  for (const u of users) {
    console.log(`${u.id} | ${u.email} | ${u.role} | ${u.createdAt.toISOString()}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async()=>{ await prisma.$disconnect(); });
