import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import * as trpcExpress from "@trpc/server/adapters/express";
import { expressHandler } from "trpc-playground/handlers/express";
import { appRouter } from "./trpc/router";
import { createContext } from "./trpc/trpc";

// init express server
const app = express();
const port = process.env.PORT || 3002;

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
  app.use(handler);
});

// start the express server
app.listen(port, () => {
  console.log(`[server]: Server is running at PORT ${port} at ${`http:localhost:${port}`}`);
});
