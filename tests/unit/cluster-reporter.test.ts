import { describe, expect, it } from "vitest";
import { ClusterReporter } from "../../src/core/observability/cluster-reporter.js";
import { EventLog } from "../../src/core/events/event-log.js";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";
import { ServiceRegistry } from "../../src/core/services/service-registry.js";

describe("ClusterReporter", () => {
  it("generates cluster health and service report", () => {
    const nodes = new NodeRegistry();
    const services = new ServiceRegistry(nodes);
    const events = new EventLog();

    nodes.register({
      id: "node-1",
      name: "worker-1",
      host: "10.0.0.1",
      port: 7001
    });

    nodes.register({
      id: "node-2",
      name: "worker-2",
      host: "10.0.0.2",
      port: 7002
    });

    nodes.updateStatus("node-1", "healthy");
    nodes.updateStatus("node-2", "dead");

    services.register({
      name: "vaultbox-api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 4000
    });

    events.record({
      type: "node.registered",
      message: "node-1 registered",
      metadata: {
        nodeId: "node-1"
      }
    });

    const reporter = new ClusterReporter(nodes, services, events);

    const report = reporter.report(new Date("2026-06-19T00:00:00.000Z"));

    expect(report.generatedAt).toBe("2026-06-19T00:00:00.000Z");
    expect(report.nodes.total).toBe(2);
    expect(report.nodes.healthy).toBe(1);
    expect(report.nodes.dead).toBe(1);
    expect(report.services.total).toBe(1);
    expect(report.services.names).toEqual(["vaultbox-api"]);
    expect(report.events.total).toBe(1);
  });
});
