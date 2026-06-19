import type { ClusterNode, RegisterNodeInput, NodeStatus } from "../../types/node.js";

export class NodeRegistry {
  private readonly nodes = new Map<string, ClusterNode>();

  register(input: RegisterNodeInput): ClusterNode {
    const now = new Date().toISOString();

    const node: ClusterNode = {
      id: input.id,
      name: input.name,
      host: input.host,
      port: input.port,
      region: input.region ?? "default",
      status: "registered",
      metadata: input.metadata ?? {},
      registeredAt: now,
      updatedAt: now,
      lastSeenAt: null
    };

    this.nodes.set(node.id, node);

    return node;
  }

  findById(id: string): ClusterNode | null {
    return this.nodes.get(id) ?? null;
  }

  list(): ClusterNode[] {
    return Array.from(this.nodes.values());
  }

  updateStatus(id: string, status: NodeStatus): ClusterNode | null {
    const node = this.nodes.get(id);

    if (!node) {
      return null;
    }

    const updated: ClusterNode = {
      ...node,
      status,
      updatedAt: new Date().toISOString()
    };

    this.nodes.set(id, updated);

    return updated;
  }

  remove(id: string): boolean {
    return this.nodes.delete(id);
  }

  clear(): void {
    this.nodes.clear();
  }

  size(): number {
    return this.nodes.size;
  }
}
