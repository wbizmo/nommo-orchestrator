import { describe, expect, it } from "vitest";
import { HeartbeatService } from "../../src/core/heartbeat.js";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";
import { ServiceRegistry } from "../../src/core/services/service-registry.js";
import { WorkerAgent } from "../../src/worker/worker-agent.js";

function setupAgent() {
  const nodes = new NodeRegistry();
  const services = new ServiceRegistry(nodes);
  const heartbeats = new HeartbeatService(nodes);

  const agent = new WorkerAgent(
    {
      node: {
        id: "node-1",
        name: "worker-1",
        host: "10.0.0.1",
        port: 7001,
        region: "local"
      },
      services: [
        {
          name: "syncgrid-api",
          host: "10.0.0.1",
          port: 4000
        },
        {
          name: "vaultbox-api",
          host: "10.0.0.1",
          port: 5000
        }
      ],
      heartbeatIntervalMs: 60_000
    },
    nodes,
    services,
    heartbeats
  );

  return {
    agent,
    nodes,
    services
  };
}

describe("WorkerAgent", () => {
  it("registers its node and services when started", () => {
    const { agent, nodes, services } = setupAgent();

    const snapshot = agent.start();
    agent.stop();

    expect(snapshot.nodeId).toBe("node-1");
    expect(snapshot.running).toBe(true);
    expect(snapshot.registeredServices).toBe(2);
    expect(nodes.findById("node-1")).not.toBeNull();
    expect(services.discover("syncgrid-api").instances).toHaveLength(1);
    expect(services.discover("vaultbox-api").instances).toHaveLength(1);
  });

  it("sends an immediate heartbeat when started", () => {
    const { agent, nodes } = setupAgent();

    agent.start();
    agent.stop();

    const node = nodes.findById("node-1");

    expect(node?.status).toBe("healthy");
    expect(node?.heartbeatCount).toBe(1);
    expect(node?.lastSeenAt).not.toBeNull();
  });

  it("can send manual heartbeats while running", () => {
    const { agent, nodes } = setupAgent();

    agent.start();

    agent.sendHeartbeat(new Date("2026-06-19T00:00:05.000Z"));
    agent.stop();

    const node = nodes.findById("node-1");

    expect(node?.heartbeatCount).toBe(2);
    expect(node?.lastSeenAt).toBe("2026-06-19T00:00:05.000Z");
  });

  it("does not send heartbeat after stopping", () => {
    const { agent, nodes } = setupAgent();

    agent.start();
    agent.stop();

    agent.sendHeartbeat(new Date("2026-06-19T00:00:10.000Z"));

    const node = nodes.findById("node-1");

    expect(node?.heartbeatCount).toBe(1);
  });

  it("returns stable snapshot when started twice", () => {
    const { agent } = setupAgent();

    agent.start();
    const snapshot = agent.start();
    agent.stop();

    expect(snapshot.running).toBe(true);
    expect(snapshot.heartbeatCount).toBe(1);
    expect(snapshot.registeredServices).toBe(2);
  });
});
