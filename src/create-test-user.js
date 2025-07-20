import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'Test@1234';
  const role = 'SCHOOL_ADMIN'; // Adjust according to your enum

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
    console.error('❌ Failed to create user:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
