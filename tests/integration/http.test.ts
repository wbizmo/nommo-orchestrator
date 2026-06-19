import { describe, expect, it } from "vitest";
import { buildApp } from "../../src/http/app.js";

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
});
