# NOMMO Orchestrator

**NOMMO — Network-Oriented Management & Monitoring Orchestrator**

Distributed service orchestration for resilient systems.

NOMMO is a TypeScript distributed systems control plane that explores service discovery, node health monitoring, failure detection, routing decisions, self-healing recovery, and cluster observability.

The project is designed as a practical distributed-systems learning platform and infrastructure engineering experiment.

---

# Category

Infrastructure Engineering / Distributed Systems / Platform Engineering

---

# Why NOMMO?

NOMMO is named in tribute to the Nommo of Dogon cosmology.

In Dogon tradition, the Nommo are associated with order, communication, transmission of knowledge, and the restoration of balance.

While NOMMO is a software project and not a representation of spiritual belief, the symbolism closely reflects the purpose of an orchestration control plane.

Distributed systems are constantly changing:

* nodes appear
* nodes disappear
* services fail
* services recover
* traffic shifts
* system state evolves

An orchestrator exists to maintain order across that change.

NOMMO watches nodes, receives heartbeats, tracks service health, detects failure, makes routing decisions, and restores healthy state when services recover.

The acronym also describes the system directly.

**NOMMO**

* **Network-Oriented**
* **Management**
* **Monitoring**
* **Orchestrator**

The name serves both as a technical description of the project and as a tribute to one of Africa's rich traditions of knowledge, continuity, and communication.

---

# What NOMMO Does

NOMMO models a lightweight distributed systems control plane.

Worker nodes can:

* register themselves
* register services
* send heartbeats

The controller can:

* track node state
* detect failure
* discover services
* route traffic
* recover failed nodes
* generate cluster reports

---

# Core Architecture

```text
Worker Nodes
     │
     │ Heartbeats
     ▼
+-------------------+
| NOMMO Controller  |
+-------------------+
     │
     ├── Node Registry
     ├── Service Registry
     ├── Failure Detector
     ├── Routing Engine
     ├── Event Log
     └── Cluster Reporter
```

---

# Orchestration Flow

```text
Worker Starts
      ↓
Registers With NOMMO
      ↓
Registers Services
      ↓
Sends Heartbeats
      ↓
Service Discovery
      ↓
Routing Decisions
      ↓
Node Failure
      ↓
Failure Detection
      ↓
Traffic Failover
      ↓
Node Recovery
      ↓
Service Restoration
```

---

# Features

## Controller Foundation

* Fastify server
* Runtime configuration
* Health endpoints
* Typed architecture

## Node Registry

* Node registration
* Node lookup
* Node lifecycle tracking
* Status transitions

## Heartbeats

* Heartbeat ingestion
* Last-seen tracking
* Heartbeat counters
* Automatic health updates

## Service Discovery

* Service registration
* Service lookup
* Healthy-instance filtering

## Failure Detection

* Heartbeat timeout evaluation
* Unhealthy state transitions
* Dead state transitions
* Recovery handling

## Routing Engine

* Round-robin routing
* Healthy-only routing
* Dead-node exclusion

## Worker Agent

* Worker simulator
* Service announcement
* Automated heartbeat generation

## Self-Healing Cluster

* Failure simulation
* Automatic failover
* Node recovery
* Cluster restoration

## Observability

* Event logging
* Cluster reports
* Service inventory
* Health summaries

---

# Example

## Register Worker

```ts
const node = {
  id: "node-1",
  name: "worker-1",
  host: "10.0.0.1",
  port: 7001
};
```

## Register Service

```ts
const service = {
  name: "vaultbox-api",
  nodeId: "node-1",
  host: "10.0.0.1",
  port: 4000
};
```

## Route Traffic

```ts
const decision =
  router.route("vaultbox-api");
```

## Result

```json
{
  "service": "vaultbox-api",
  "selected": {
    "nodeId": "node-1"
  },
  "healthyInstances": 2
}
```

---

# Testing

NOMMO includes:

* Unit Tests
* Integration Tests
* Failure Simulation Tests
* Benchmark Scripts

Run tests:

```bash
npm test
```

Run type checking:

```bash
npm run typecheck
```

Run benchmarks:

```bash
npx tsx benchmarks/heartbeat.bench.ts

npx tsx benchmarks/routing.bench.ts
```

---

# Documentation

```text
docs/
├── API.md
├── ARCHITECTURE.md
├── BENCHMARKS.md
├── DESIGN_DECISIONS.md
├── FAILURE_MODES.md
├── ROADMAP.md
└── TESTING.md
```

---

# Current Scope

NOMMO v1 intentionally focuses on control-plane fundamentals.

Included:

* service discovery
* health monitoring
* routing
* failover
* self-healing simulation
* observability

Not included:

* Kubernetes scheduling
* container orchestration
* Raft consensus
* distributed persistence
* service mesh implementation
* production multi-region clustering

---

# Future Ideas

Potential future work:

* persistent state storage
* weighted routing
* leader election
* distributed event streams
* metrics export
* dashboard UI
* plugin system

---

# Author

Williams Ashibuogwu (wbizmo)

GitHub:

https://github.com/wbizmo

---

# License

Apache License 2.0.
