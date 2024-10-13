import { z } from "zod";

export const searchInput = z.object({
  keyword: z.string().optional(),

  // todo: add other common search props
  //  date: z.date().optional(),
  //  active: z.boolean().optional(),

  page: z.coerce.number().min(0).transform(Math.floor).optional().default(1),

  limit: z.coerce
    .number()
    .min(10, { message: "Must be >= 10" })
    .max(500, { message: "Must be <= 500" })
    .transform(Math.floor)
    .optional()
    .default(10),
});

export type SearchInput = z.infer<typeof searchInput>;

export const searchProps = searchInput
  .extend({
    offset: z.number().optional().default(0),
  })
  .transform((data) => {
    data.offset = (data.page - 1) * data.limit;
    return data;
  });

export type SearchProps = z.infer<typeof searchProps>;
