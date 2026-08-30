import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "../../src/http/app.js";

afterEach(() => {
  delete process.env.CORS_ALLOWED_ORIGINS;
});

describe("http", () => {
  it("returns health", async () => {
    const app = await buildApp({
      environment: "test",
      host: "127.0.0.1",
      port: 3000,
      serviceName: "nommo-test",
      version: "0.1.0"
    });

    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);

    await app.close();
  });

  it("rejects unconfigured browser origins in production", async () => {
    const app = await buildApp({
      environment: "production",
      host: "127.0.0.1",
      port: 3000,
      serviceName: "nommo-test",
      version: "0.1.0"
    });

    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "https://attacker.example" }
    });

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    await app.close();
  });

  it("allows explicitly configured production origins", async () => {
    process.env.CORS_ALLOWED_ORIGINS = "https://nommo.example";
    const app = await buildApp({
      environment: "production",
      host: "127.0.0.1",
      port: 3000,
      serviceName: "nommo-test",
      version: "0.1.0"
    });

    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "https://nommo.example" }
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("https://nommo.example");
    await app.close();
  });
});
