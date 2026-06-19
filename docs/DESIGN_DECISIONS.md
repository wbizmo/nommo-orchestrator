# NOMMO Design Decisions

## In-Memory Control Plane for v1

NOMMO v1 uses in-memory registries because the goal is to prove orchestration behavior clearly:

* node lifecycle management
* heartbeat tracking
* service discovery
* failure detection
* routing decisions
* self-healing simulation

Persistence can be added later without weakening the core model.

## Explicit Node States

NOMMO uses clear lifecycle states:

* `registered`
* `healthy`
* `unhealthy`
* `dead`

This makes failure transitions easy to test and reason about.

## Heartbeat-Based Failure Detection

The controller treats worker heartbeats as the source of truth for node liveness.

A node becomes unhealthy or dead when its last heartbeat exceeds configured thresholds.

## Healthy-Only Discovery

Service discovery filters out instances attached to unhealthy or dead nodes.

This ensures the routing layer never depends on stale node state.

## Round-Robin Routing

The v1 router uses round-robin selection across healthy instances.

This is simple, deterministic, testable, and suitable for demonstrating failover behavior.

## Worker Agent Simulator

The worker simulator exists to prove NOMMO’s orchestration loop without requiring real servers or containers.

It allows the project to demonstrate:

* registration
* service announcement
* heartbeat loops
* simulated failure
* recovery
