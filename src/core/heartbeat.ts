import { NodeRegistry } from "./registry/node-registry.js";
import type { HeartbeatInput, HeartbeatResult } from "../types/heartbeat.js";

export class HeartbeatService {
  constructor(private readonly registry: NodeRegistry) {}

  receive(input: HeartbeatInput): HeartbeatResult | null {
    const updatedNode = this.registry.recordHeartbeat(input.nodeId, input.observedAt);

    if (!updatedNode || !updatedNode.lastSeenAt) {
      return null;
    }

    return {
      nodeId: updatedNode.id,
      accepted: true,
      status: "healthy",
      lastSeenAt: updatedNode.lastSeenAt,
      heartbeatCount: updatedNode.heartbeatCount
    };
  }
}
