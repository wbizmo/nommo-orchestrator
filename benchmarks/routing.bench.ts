import { performance } from "node:perf_hooks";
import { NodeRegistry } from "../src/core/registry/node-registry.js";
import { ServiceRegistry } from "../src/core/services/service-registry.js";
import { Router } from "../src/core/routing/router.js";

const nodes = new NodeRegistry();
const services = new ServiceRegistry(nodes);

for (let i = 1; i <= 10; i++) {
  nodes.register({
    id: `node-${i}`,
    name: `worker-${i}`,
    host: `10.0.0.${i}`,
    port: 7000 + i
  });

  nodes.updateStatus(
    `node-${i}`,
    "healthy"
  );

  services.register({
    name: "benchmark-api",
    nodeId: `node-${i}`,
    host: `10.0.0.${i}`,
    port: 4000
  });
}

const router =
  new Router(services);

const iterations = 100000;

const start =
  performance.now();

for (let i = 0; i < iterations; i++) {
  router.route(
    "benchmark-api"
  );
}

const end =
  performance.now();

console.log({
  benchmark: "routing",
  iterations,
  durationMs: Number(
    (end - start).toFixed(2)
  ),
  operationsPerSecond:
    Math.round(
      iterations /
      ((end - start) / 1000)
    )
});
