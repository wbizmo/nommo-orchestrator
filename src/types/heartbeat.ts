export interface HeartbeatInput {
  nodeId: string;
  observedAt?: Date;
}

export interface HeartbeatResult {
  nodeId: string;
  accepted: boolean;
  status: "healthy";
  lastSeenAt: string;
  heartbeatCount: number;
}
