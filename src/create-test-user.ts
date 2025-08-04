import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'anik@gmail.com';
  const password = '123456';
  const role = 'ADMIN'; // Changed from SCHOOL_ADMIN to ADMIN

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    console.log('✅ Test user created:', user);
  } catch (err) {
    console.error('❌ Failed to create user:', err instanceof Error ? err.message : 'Unknown error');
  } finally {
    await prisma.$disconnect();
  }
}

main();
