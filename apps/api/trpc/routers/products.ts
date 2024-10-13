import { z } from "zod";
import { router, privateProcedure, publicProcedure } from "../trpc";
import prisma from "../../config/prisma";
import { TRPCError } from "@trpc/server";
import * as schema from "../../../web/schema";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "../middleware/prismaErrorHandler";

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

  create: privateProcedure
    .input(
      z.object({
        quantity: z.coerce.number(),
        sku: z.string(),
        description: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(async req => {
      const { ...data } = req.input;
      const valid = schema.productSchema.safeParse(data);
      if (!valid.success) {
        throw new TRPCError({ code: "BAD_REQUEST", message: valid.error.errors[0].message });
      }
      try {
        const product = await prisma.product.create({ data });
        return product;
      } catch (error) {
        handlePrismaError(error, {
          // TODO: (MAYBE)): Enforce unique SKUs?
          P2002: {
            code: "CONFLICT",
            message: "A product with this SKU already exists.",
          },
          P2003: {
            code: "BAD_REQUEST",
            message: "Invalid store ID. The specified store does not exist.",
          },
        });
      }
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async req => {
      const { id } = req.input;
      const product = await prisma.product.delete({ where: { id } });
      return product;
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.coerce.number().optional(),
        sku: z.string().optional(),
        description: z.string().optional(),
        storeId: z.string().optional(),
      })
    )
    .mutation(async req => {
      const { id, ...data } = req.input;
      if (!Object.keys(data).length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No data provided to update" });
      }
      const product = await prisma.product.update({ where: { id }, data });
      return product;
    }),

  search: publicProcedure
    .input(schema.searchInput)
    .output(
      z.object({
        data: schema.productSchema.array(),
        meta: schema.metaSchema,
      })
    )
    .query(async opts => {
      const search = schema.searchProps.parse(opts.input);
      const where = !search.keyword
        ? {}
        : {
            OR: [
              { sku: { contains: search.keyword } },
              { description: { contains: search.keyword } },
            ],
          };
      const [data, rowCount] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          skip: search.offset,
          take: search.limit,
          select: {
            id: true,
            sku: true,
            quantity: true,
            description: true,
            storeId: true,
            store: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        data,
        meta: {
          rowCount,
        },
      };
    }),
});
