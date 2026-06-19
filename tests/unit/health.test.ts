import { describe, expect, it } from "vitest";
import { createHealthResponse, createRootResponse } from "../../src/core/health.js";
import type { NommoRuntimeConfig } from "../../src/types/nommo.js";

describe("health responses", () => {
  const config: NommoRuntimeConfig = {
    environment: "test",
    host: "127.0.0.1",
    port: 3000,
    serviceName: "nommo-test",
    version: "0.1.0"
  };

  it("creates a root response describing NOMMO", () => {
    const response = createRootResponse();

    expect(response.name).toBe("NOMMO");
    expect(response.acronym).toBe("Network-Oriented Management & Monitoring Orchestrator");
    expect(response.status).toBe("online");
    expect(response.endpoints.health).toBe("/health");
  });

  it("creates a health response", () => {
    const response = createHealthResponse(config);

    expect(response.status).toBe("ok");
    expect(response.service).toBe("nommo-test");
    expect(response.version).toBe("0.1.0");
    expect(response.environment).toBe("test");
    expect(response.timestamp).toEqual(expect.any(String));
  });
});
