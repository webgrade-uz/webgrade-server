import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: process.env.ADMIN_EMAIL || 'admin@webgrade.com' },
  });

  if (existingAdmin) {
    console.log('✓ Admin already exists');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10,
  );

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@webgrade.com',
      password: hashedPassword,
    },
  });

  console.log('✓ Admin created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
