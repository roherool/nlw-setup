import cors from "@fastify/cors";
import Fastify from "fastify";

import { appRoutes } from "./routes";

const start = async () => {
  const app = Fastify();

  await app.register(cors);
  await app.register(appRoutes);

  await app
    .listen({
      port: 3333,
      host: "0.0.0.0",
    })
    .then((url) => {
      console.log(`HTTP server running on ${url}`);
    });
}

start();
