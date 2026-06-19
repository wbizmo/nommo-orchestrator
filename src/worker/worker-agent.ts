import { HeartbeatService } from "../core/heartbeat.js";
import { NodeRegistry } from "../core/registry/node-registry.js";
import { ServiceRegistry } from "../core/services/service-registry.js";
import type { WorkerAgentOptions, WorkerAgentSnapshot } from "../types/worker.js";

export class WorkerAgent {
  private running = false;
  private heartbeatCount = 0;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly options: WorkerAgentOptions,
    private readonly nodes: NodeRegistry,
    private readonly services: ServiceRegistry,
    private readonly heartbeats: HeartbeatService
  ) {}

  start(): WorkerAgentSnapshot {
    if (this.running) {
      return this.snapshot();
    }

    this.nodes.register(this.options.node);

    for (const service of this.options.services) {
      this.services.register({
        ...service,
        nodeId: this.options.node.id
      });
    }

    this.running = true;
    this.sendHeartbeat();

    this.timer = setInterval(() => {
      this.sendHeartbeat();
    }, this.options.heartbeatIntervalMs);

    return this.snapshot();
  }

  stop(): WorkerAgentSnapshot {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.running = false;

    return this.snapshot();
  }

  sendHeartbeat(observedAt: Date = new Date()): WorkerAgentSnapshot {
    if (!this.running) {
      return this.snapshot();
    }

    const result = this.heartbeats.receive({
      nodeId: this.options.node.id,
      observedAt
    });

    if (result?.accepted) {
      this.heartbeatCount = result.heartbeatCount;
    }

    return this.snapshot();
  }

  snapshot(): WorkerAgentSnapshot {
    return {
      nodeId: this.options.node.id,
      running: this.running,
      heartbeatCount: this.heartbeatCount,
      registeredServices: this.options.services.length
    };
  }
}
