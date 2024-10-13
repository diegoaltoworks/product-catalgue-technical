import { Request, Response } from "express";

import { appRouter } from "./router";

import { createCallerFactory } from "./trpc";

export function makeCaller(opts = {}) {
  const createCaller = createCallerFactory(appRouter);
  const callerOptions = {
    req: {} as Request,
    res: {} as Response,
    user: {
      isLoggedIn: false,
    },
    ...opts, // overload with additional props if needed
  };

  return createCaller(callerOptions);
}
