import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { createHealthResponse } from "../core/health.js";
import type { NommoRuntimeConfig } from "../types/nommo.js";

export async function buildApp(config: NommoRuntimeConfig) {
  const app = Fastify({
    logger: config.environment !== "test"
  });

  await app.register(cors);
  await app.register(helmet);

  app.get("/", async () => {
    return {
      name: "NOMMO",
      acronym: "Network-Oriented Management & Monitoring Orchestrator",
      status: "online"
    };
  });

  app.get("/health", async () => {
    return createHealthResponse(config);
  });

  return app;
}
