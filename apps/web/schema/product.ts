import { z } from "zod";
import { storeSchema } from "./store";

export const productSchema = z.object({
  id: z.coerce.number().optional(),

  sku: z.string().min(1, { message: "SKU is required" }),
  quantity: z.coerce.number().optional(),

  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(30, { message: "Name should be less than 30 characters" }),

  storeId: z.string().optional(),
  store: storeSchema.optional(),
});

export type ProductProps = z.infer<typeof productSchema>;

export const productIDSchema = z.object({
  id: z.coerce.number(),
});
export const existingProductSchema = productSchema.extend(
  productIDSchema.shape,
);

export type ExistingProductProps = z.infer<typeof existingProductSchema>;
