import { z } from "zod";

export const storeSchema = z.object({
  id: z.string(),

  name: z
    .string()
    .min(1, { message: "Required" })
    .max(30, { message: "Name should be less than 30 characters" }),
});

export type StoreProps = z.infer<typeof storeSchema>;

export const storeIDSchema = z.object({
  id: z.string(),
});
export const existingStoreSchema = storeSchema.extend(storeIDSchema.shape);

export type ExistingStoreProps = z.infer<typeof existingStoreSchema>;
