import type { NommoRuntimeConfig } from "../types/nommo.js";

export function loadRuntimeConfig(): NommoRuntimeConfig {
  return {
    environment: (process.env.NODE_ENV as any) || "development",
    host: process.env.HOST || "0.0.0.0",
    port: Number(process.env.PORT || 3000),
    serviceName: "nommo-orchestrator",
    version: "0.1.0"
  };
}
