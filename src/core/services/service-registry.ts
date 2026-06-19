import { NodeRegistry } from "../registry/node-registry.js";
import type {
  RegisterServiceInput,
  ServiceDiscoveryResult,
  ServiceInstance
} from "../../types/service.js";

export class ServiceRegistry {
  private readonly services = new Map<string, ServiceInstance[]>();

  constructor(private readonly nodes: NodeRegistry) {}

  register(input: RegisterServiceInput): ServiceInstance | null {
    const node = this.nodes.findById(input.nodeId);

    if (!node) {
      return null;
    }

    const now = new Date().toISOString();

    const instance: ServiceInstance = {
      id: `${input.name}:${input.nodeId}:${input.port}`,
      name: input.name,
      nodeId: input.nodeId,
      host: input.host,
      port: input.port,
      protocol: input.protocol ?? "http",
      weight: input.weight ?? 1,
      metadata: input.metadata ?? {},
      registeredAt: now,
      updatedAt: now
    };

    const existing = this.services.get(input.name) ?? [];
    const withoutDuplicate = existing.filter(
      (item) => item.id !== instance.id
    );

    this.services.set(
      input.name,
      [...withoutDuplicate, instance]
    );

    return instance;
  }

  discover(name: string): ServiceDiscoveryResult {
    return {
      service: name,
      instances: this.services.get(name) ?? []
    };
  }

  discoverHealthy(name: string): ServiceDiscoveryResult {
    const instances =
      this.services.get(name) ?? [];

    return {
      service: name,
      instances: instances.filter(
        (instance) => {
          const node =
            this.nodes.findById(
              instance.nodeId
            );

          return (
            node?.status ===
            "healthy"
          );
        }
      )
    };
  }

  listServiceNames(): string[] {
    return Array.from(
      this.services.keys()
    ).sort();
  }

  removeNodeInstances(
    nodeId: string
  ): number {
    let removed = 0;

    for (const [
      name,
      instances
    ] of this.services.entries()) {
      const remaining =
        instances.filter(
          (instance) =>
            instance.nodeId !==
            nodeId
        );

      removed +=
        instances.length -
        remaining.length;

      if (
        remaining.length === 0
      ) {
        this.services.delete(
          name
        );
      } else {
        this.services.set(
          name,
          remaining
        );
      }
    }

    return removed;
  }

  clear(): void {
    this.services.clear();
  }
}
