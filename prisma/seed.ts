import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'daniel@example.com' },
    update: {},
    create: {
      name: 'Daniel',
      last_name: 'R',
      email: 'daniel@example.com',
      birth_date: new Date().toLocaleDateString(),
      password: 'senha',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'daniel2@example.com' },
    update: {},
    create: {
      name: 'Daniel2',
      last_name: 'R2',
      email: 'daniel2@example.com',
      birth_date: new Date().toLocaleDateString(),
      password: 'senha',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'daniel3@example.com' },
    update: {},
    create: {
      name: 'Daniel3',
      last_name: 'R3',
      email: 'daniel3@example.com',
      birth_date: new Date().toLocaleDateString(),
      password: 'senha',
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'daniel4@example.com' },
    update: {},
    create: {
      name: 'Daniel4',
      last_name: 'R4',
      email: 'daniel4@example.com',
      birth_date: new Date().toLocaleDateString(),
      password: 'senha',
    },
  });

  const user5 = await prisma.user.upsert({
    where: { email: 'daniel5@example.com' },
    update: {},
    create: {
      name: 'Daniel5',
      last_name: 'R5',
      email: 'daniel5@example.com',
      birth_date: new Date().toLocaleDateString(),
      password: 'senha',
    },
  });

  console.log({ user1, user2, user3, user4, user5 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async (): Promise<any> => {
    await prisma.$disconnect();
  });
