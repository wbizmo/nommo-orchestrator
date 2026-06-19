import { ServiceRegistry } from "../services/service-registry.js";
import type { RouteDecision } from "../../types/routing.js";

export class Router {
  private readonly cursors = new Map<string, number>();

  constructor(
    private readonly services: ServiceRegistry
  ) {}

  route(serviceName: string): RouteDecision {
    const discovery =
      this.services.discoverHealthy(serviceName);

    if (discovery.instances.length === 0) {
      return {
        service: serviceName,
        selected: null,
        healthyInstances: 0
      };
    }

    const current =
      this.cursors.get(serviceName) ?? 0;

    const selected =
      discovery.instances[
        current % discovery.instances.length
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

  reset(serviceName?: string): void {
    if (serviceName) {
      this.cursors.delete(serviceName);
      return;
    }

    this.cursors.clear();
  }
}
