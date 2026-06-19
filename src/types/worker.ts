import type { RegisterNodeInput } from "./node.js";
import type { RegisterServiceInput } from "./service.js";

export interface WorkerAgentOptions {
  node: RegisterNodeInput;
  services: Omit<RegisterServiceInput, "nodeId">[];
  heartbeatIntervalMs: number;
}

export interface WorkerAgentSnapshot {
  nodeId: string;
  running: boolean;
  heartbeatCount: number;
  registeredServices: number;
}
