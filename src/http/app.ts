import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { createHealthResponse, createRootResponse } from "../core/health.js";
import type { NommoRuntimeConfig } from "../types/nommo.js";

export async function buildApp(config: NommoRuntimeConfig) {
  const app = Fastify({
    logger: config.environment !== "test"
  });

  const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = new Set(
    configuredOrigins.length > 0
      ? configuredOrigins
      : config.environment === "production"
        ? []
        : ["http://localhost:3000", "http://localhost:5173"]
  );

  await app.register(cors, {
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"), false);
    },
    credentials: false
  });
  await app.register(helmet);

  app.get("/", async () => {
    return createRootResponse();
  });

  app.get("/health", async () => {
    return createHealthResponse(config);
  });

  return app;
}
