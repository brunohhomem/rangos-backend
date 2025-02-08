import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({
    data: {
      email: 'bruno@email.com',
      name: 'brunohhomem',
    },
  });

  console.log('✅ Seed realizado com sucesso!');
}

seed();
