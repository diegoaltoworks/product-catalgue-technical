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
        id: z.string(),
      })
    )
    .query(async req => {
      const { id } = req.input;
      const store = await prisma.store.findUnique({ where: { id } });
      return store;
    }),
  all: publicProcedure.query(async req => {
    const stores = await prisma.store.findMany();
    return stores;
  }),

  create: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async req => {
      const { ...data } = req.input;
      const store = await prisma.store.create({ data });
      return store;
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async req => {
      const { id } = req.input;
      const store = await prisma.store.delete({ where: { id } });
      return store;
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async req => {
      const { id, ...data } = req.input;
      const store = await prisma.store.update({ where: { id }, data });
      return store;
    }),
});
