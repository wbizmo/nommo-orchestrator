import { describe, expect, it } from "vitest";
import { loadRuntimeConfig } from "../../src/config/runtime.js";

describe("runtime", () => {
  it("loads configuration", () => {
    const config = loadRuntimeConfig();

    expect(config.serviceName).toBe("nommo-orchestrator");
    expect(config.version).toBe("0.1.0");
  });
});
