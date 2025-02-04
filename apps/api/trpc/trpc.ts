import { initTRPC, inferAsyncReturnType, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

// created for each request
export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  return {
    req,
    res,
  };
};

type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create(); // initialize trpc (must be done once)

// TODO: Add real authentication checks
// Reusable middleware that checks if users are authenticated.
const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  const isLoggedIn = true;
  if (isLoggedIn) {
    return next({
      ctx: {
        ...ctx,
        user: {
          isLoggedIn: isLoggedIn,
        },
      },
    });
  } else {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
export const createCallerFactory = t.createCallerFactory;
