import { describe, expect, it } from "vitest";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";
import { ServiceRegistry } from "../../src/core/services/service-registry.js";

describe("ServiceRegistry", () => {
  it("registers a service instance on an existing node", () => {
    const nodes = new NodeRegistry();
    const services = new ServiceRegistry(nodes);

    nodes.register({
      id: "node-1",
      name: "worker-1",
      host: "10.0.0.1",
      port: 7001
    });

    const instance = services.register({
      name: "syncgrid-api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 4000
    });

    expect(instance?.id).toBe("syncgrid-api:node-1:4000");
    expect(instance?.protocol).toBe("http");
  });

  it("rejects a service instance for an unknown node", () => {
    const nodes = new NodeRegistry();
    const services = new ServiceRegistry(nodes);

    const instance = services.register({
      name: "syncgrid-api",
      nodeId: "missing-node",
      host: "10.0.0.1",
      port: 4000
    });

    expect(instance).toBeNull();
  });

  it("discovers all registered service instances", () => {
    const nodes = new NodeRegistry();
    const services = new ServiceRegistry(nodes);

    nodes.register({
      id: "node-1",
      name: "worker-1",
      host: "10.0.0.1",
      port: 7001
    });

    nodes.register({
      id: "node-2",
      name: "worker-2",
      host: "10.0.0.2",
      port: 7002
    });

    services.register({
      name: "vaultbox-api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 5000
    });

    services.register({
      name: "vaultbox-api",
      nodeId: "node-2",
      host: "10.0.0.2",
      port: 5000
    });

    const result = services.discover("vaultbox-api");

    expect(result.service).toBe("vaultbox-api");
    expect(result.instances).toHaveLength(2);
  });

  it("discovers only healthy service instances", () => {
    const nodes = new NodeRegistry();
    const services = new ServiceRegistry(nodes);

    nodes.register({
      id: "node-1",
      name: "worker-1",
      host: "10.0.0.1",
      port: 7001
    });

    nodes.register({
      id: "node-2",
      name: "worker-2",
      host: "10.0.0.2",
      port: 7002
    });

    nodes.updateStatus("node-1", "healthy");
    nodes.updateStatus("node-2", "unhealthy");

    services.register({
      name: "cashflowr-api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 4000
    });

    services.register({
      name: "cashflowr-api",
      nodeId: "node-2",
      host: "10.0.0.2",
      port: 4000
    });

    const result = services.discoverHealthy("cashflowr-api");

    expect(result.instances).toHaveLength(1);
    expect(result.instances[0]?.nodeId).toBe("node-1");
  });

  it("replaces duplicate service instance registrations", () => {
    const nodes = new NodeRegistry();
    const services = new ServiceRegistry(nodes);

    nodes.register({
      id: "node-1",
      name: "worker-1",
      host: "10.0.0.1",
      port: 7001
    });

    services.register({
      name: "argus-rpc",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 9000
    });

    services.register({
      name: "argus-rpc",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 9000,
      metadata: {
        version: "replacement"
      }
    });

    const result = services.discover("argus-rpc");

    expect(result.instances).toHaveLength(1);
    expect(result.instances[0]?.metadata.version).toBe("replacement");
  });

  it("removes all service instances attached to a node", () => {
    const nodes = new NodeRegistry();
    const services = new ServiceRegistry(nodes);

    nodes.register({
      id: "node-1",
      name: "worker-1",
      host: "10.0.0.1",
      port: 7001
    });

    services.register({
      name: "syncgrid-api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 4000
    });

    services.register({
      name: "vaultbox-api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 5000
    });

    const removed = services.removeNodeInstances("node-1");

    expect(removed).toBe(2);
    expect(services.discover("syncgrid-api").instances).toHaveLength(0);
    expect(services.discover("vaultbox-api").instances).toHaveLength(0);
  });
});
