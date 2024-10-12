import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// prisma.$on("beforeExit", async () => {
//   prisma.$disconnect();
// });

export default prisma;
