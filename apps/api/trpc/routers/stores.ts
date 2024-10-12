import { z } from "zod";
import { router, privateProcedure, publicProcedure } from "../trpc";
import prisma from "../../config/prisma";

export const storesRouter = router({
  ping: privateProcedure
    .input(
      z.object({
        ping: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (input.ping === "ping") {
        return "pong";
      }
    }),
  hello: publicProcedure.query(async ({ ctx, input }) => {
    return "Hello, world!";
  }),
  one: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async req => {
      const store = await prisma.store.findUnique({ where: { id: req.input.id } });
      return store;
    }),
  all: publicProcedure.query(async req => {
    const stores = await prisma.store.findMany();
    return stores;
  }),
});
