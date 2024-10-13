import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  // reset
  await prisma.store.deleteMany();

  const oldStores = await prisma.store.findMany();
  if (oldStores.length) return;
  console.log("oldStores", { oldStores });

  await prisma.store.create({ data: { id: "KEN", name: "Kensington" } });
  await prisma.store.create({ data: { id: "BAT", name: "Battersea" } });
  await prisma.store.create({ data: { id: "HAM", name: "Hampstead" } });
  await prisma.store.create({ data: { id: "WIM", name: "Wimbledon" } });
  await prisma.store.create({ data: { id: "CHE", name: "Chelsea" } });

  const newStores = await prisma.store.findMany();
  console.log({ newStores });
  if (newStores.length) return;
  console.log("newStores", { newStores });
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
