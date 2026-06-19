import { ServiceRegistry } from "../services/service-registry.js";
import type { RouteDecision } from "../../types/routing.js";
import type { ServiceInstance } from "../../types/service.js";

export class Router {
  private readonly cursors =
    new Map<string, number>();

  constructor(
    private readonly services: ServiceRegistry
  ) {}

  route(
    serviceName: string
  ): RouteDecision {
    const discovery =
      this.services.discoverHealthy(
        serviceName
      );

    if (
      discovery.instances.length === 0
    ) {
      return {
        service: serviceName,
        selected: null,
        healthyInstances: 0
      };
    }

    const expanded: ServiceInstance[] =
      [];

    for (const instance of discovery.instances) {
      const weight =
        Math.max(
          1,
          instance.weight
        );

      for (
        let i = 0;
        i < weight;
        i++
      ) {
        expanded.push(
          instance
        );
      }
    }

    const current =
      this.cursors.get(
        serviceName
      ) ?? 0;

    const selected =
      expanded[
        current %
          expanded.length
      ];

    this.cursors.set(
      serviceName,
      current + 1
    );

    return {
      service: serviceName,
      selected,
      healthyInstances:
        discovery.instances.length
    };
  }

  reset(
    serviceName?: string
  ): void {
    if (serviceName) {
      this.cursors.delete(
        serviceName
      );
      return;
    }

    this.cursors.clear();
  }
}
