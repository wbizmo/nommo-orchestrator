import type { NommoRuntimeConfig } from "../types/nommo.js";

export function createRootResponse() {
  return {
    name: "NOMMO",
    acronym: "Network-Oriented Management & Monitoring Orchestrator",
    tagline: "Distributed service orchestration for resilient systems.",
    category: "Infrastructure Engineering / Distributed Systems / Platform Engineering",
    status: "online",
    endpoints: {
      health: "/health"
    }
  };
}

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
