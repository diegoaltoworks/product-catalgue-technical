import { router } from "./trpc";
import { storesRouter } from "./routers/stores";
import { productsRouter } from "./routers/products";
import { testsRouter } from "./routers/test";

// combined router
export const appRouter = router({
  test: testsRouter,
  stores: storesRouter,
  products: productsRouter,
});

// type definition of trpc API
export type AppRouter = typeof appRouter;
