import { performance } from "node:perf_hooks";
import { HeartbeatService } from "../src/core/heartbeat.js";
import { NodeRegistry } from "../src/core/registry/node-registry.js";

const registry = new NodeRegistry();
const heartbeat = new HeartbeatService(registry);

registry.register({
  id: "node-1",
  name: "worker-1",
  host: "127.0.0.1",
  port: 7001
});

const iterations = 100000;

const start = performance.now();

for (let i = 0; i < iterations; i++) {
  heartbeat.receive({
    nodeId: "node-1"
  });
}

const end = performance.now();

console.log({
  benchmark: "heartbeat",
  iterations,
  durationMs: Number((end - start).toFixed(2)),
  operationsPerSecond: Math.round(
    iterations / ((end - start) / 1000)
  )
});
