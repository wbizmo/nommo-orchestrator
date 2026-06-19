import type { NommoEvent } from "./event.js";

export interface ClusterReport {
  generatedAt: string;
  nodes: {
    total: number;
    registered: number;
    healthy: number;
    unhealthy: number;
    dead: number;
  };
  services: {
    total: number;
    names: string[];
  };
  events: {
    total: number;
    latest: NommoEvent[];
  };
}
