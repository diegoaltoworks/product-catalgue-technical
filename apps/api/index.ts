import { createApp } from "./app";

import { SIGTERM, uncaughtException, unhandledRejection } from "./lib/errorHandlers";

// register global error handlers
global.process.on("uncaughtException", uncaughtException);
global.process.on("unhandledRejection", unhandledRejection);
global.process.on("SIGTERM", SIGTERM);

const PORT = process.env.PORT || 3002;
const app = createApp();

app.listen(PORT, () => {
  console.log(`[server]: Server is running at PORT ${PORT} at ${`http:localhost:${PORT}`}`);
});
