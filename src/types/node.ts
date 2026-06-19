export type NodeStatus = "registered" | "healthy" | "unhealthy" | "dead";

export interface RegisterNodeInput {
  id: string;
  name: string;
  host: string;
  port: number;
  region?: string;
  metadata?: Record<string, string>;
}

export interface ClusterNode {
  id: string;
  name: string;
  host: string;
  port: number;
  region: string;
  status: NodeStatus;
  metadata: Record<string, string>;
  registeredAt: string;
  updatedAt: string;
  lastSeenAt: string | null;
  heartbeatCount: number;
}
