import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import * as trpcExpress from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/trpc";
import { expressErrorHandler } from "./lib/errorHandlers";

export const createApp = (): express.Application => {
  // init express server
  const app = express();

  // cors
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json()); // for parsing application/json
  app.use(morgan("dev")); // for pretty logging

  // ROUTES
  app.get("/", (req, res) => {
    res.send("hello, world!");
  });

  //  initialize trpc on express server with playground
  const TRPC_ENDPOINT = "/trpc";
  const TRPC_PLAYGROUND_ENDPOINT = "/trpc-playground";
  app.use(
    TRPC_ENDPOINT,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  expressHandler({
    trpcApiEndpoint: TRPC_ENDPOINT,
    playgroundEndpoint: TRPC_PLAYGROUND_ENDPOINT,
    router: appRouter,
    // uncomment this if you're using superjson
    // request: {
    //   superjson: true,
    // },
  }).then((handler: any) => {
    app.use(TRPC_PLAYGROUND_ENDPOINT, handler);
  });

  // throw errors or catch them and forward them to `next: NextFunction`
  app.use(expressErrorHandler);

  return app;
};
