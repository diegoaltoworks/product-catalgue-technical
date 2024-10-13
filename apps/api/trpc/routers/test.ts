import { z } from "zod";
import { router, privateProcedure, publicProcedure } from "../trpc";

export const testsRouter = router({
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

  error: publicProcedure.query(async ({ ctx, input }) => {
    throw new Error("This is an error");
  }),
});
