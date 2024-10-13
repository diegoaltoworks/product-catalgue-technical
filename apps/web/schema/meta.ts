import { z } from "zod";

export const metaSchema = z.object({
  rowCount: z.number().min(0).transform(Math.floor).default(0),

  // todo: add other common search props
  //  updatedAt: z.date().optional(),
  //  createdAt: z.date().optional(),
});

export type MetaProps = z.infer<typeof metaSchema>;
