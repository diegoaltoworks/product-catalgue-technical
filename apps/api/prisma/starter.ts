import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
  const stores = await prisma.store.findMany();
  console.log({ stores });
  if (stores.length) return;
  console.log("Create stores", { stores });
  await prisma.store.create({
    data: { name: "Store A" },
  });

  await prisma.store.create({
    data: { name: "Store B" },
  });

  await prisma.store.create({
    data: { name: "Store C" },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
