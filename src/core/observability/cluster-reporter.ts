import { EventLog } from "../events/event-log.js";
import { NodeRegistry } from "../registry/node-registry.js";
import { ServiceRegistry } from "../services/service-registry.js";
import type { ClusterReport } from "../../types/observability.js";

export class ClusterReporter {
  constructor(
    private readonly nodes: NodeRegistry,
    private readonly services: ServiceRegistry,
    private readonly events: EventLog
  ) {}

  report(now: Date = new Date()): ClusterReport {
    const nodes = this.nodes.list();

    return {
      generatedAt: now.toISOString(),
      nodes: {
        total: nodes.length,
        registered: nodes.filter((node) => node.status === "registered").length,
        healthy: nodes.filter((node) => node.status === "healthy").length,
        unhealthy: nodes.filter((node) => node.status === "unhealthy").length,
        dead: nodes.filter((node) => node.status === "dead").length
      },
      services: {
        total: this.services.listServiceNames().length,
        names: this.services.listServiceNames()
      },
      events: {
        total: this.events.count(),
        latest: this.events.latest(10)
      }
    };
  }
}
