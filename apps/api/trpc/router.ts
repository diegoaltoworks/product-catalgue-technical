import { router } from "./trpc";
import { storesRouter } from "./routers/stores";
import { productsRouter } from "./routers/products";

// combined router
export const appRouter = router({
  stores: storesRouter,
  products: productsRouter,
});

// type definition of trpc API
export type AppRouter = typeof appRouter;
