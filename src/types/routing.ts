import type { ServiceInstance } from "./service.js";

export interface RouteDecision {
  service: string;
  selected: ServiceInstance | null;
  healthyInstances: number;
}

export interface RoutingCursor {
  service: string;
  index: number;
}
