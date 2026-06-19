import type { NommoRuntimeConfig } from "../types/nommo.js";

export function createHealthResponse(config: NommoRuntimeConfig) {
  return {
    status: "ok",
    service: config.serviceName,
    version: config.version,
    environment: config.environment,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  };
}
