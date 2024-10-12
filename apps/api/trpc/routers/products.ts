import { z } from "zod";
import { router, privateProcedure, publicProcedure } from "../trpc";
import prisma from "../../config/prisma";

export const productsRouter = router({
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
      const product = await prisma.product.findUnique({ where: { id: req.input.id } });
      return product;
    }),
  all: publicProcedure.query(async req => {
    const products = await prisma.product.findMany();
    return products;
  }),
});
