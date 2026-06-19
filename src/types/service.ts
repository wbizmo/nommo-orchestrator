export interface RegisterServiceInput {
  name: string;
  nodeId: string;
  host: string;
  port: number;
  protocol?: "http" | "tcp";
  weight?: number;
  metadata?: Record<string, string>;
}

export interface ServiceInstance {
  id: string;
  name: string;
  nodeId: string;
  host: string;
  port: number;
  protocol: "http" | "tcp";
  weight: number;
  metadata: Record<string, string>;
  registeredAt: string;
  updatedAt: string;
}

export interface ServiceDiscoveryResult {
  service: string;
  instances: ServiceInstance[];
}
