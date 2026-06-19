# NOMMO API

NOMMO exposes a controller API for observing and managing distributed service state.

## Current Endpoints

### Root

```http
GET /
```

Returns controller metadata.

### Health

```http
GET /health
```

Returns controller health status.

## Planned Controller API

### Register Node

```http
POST /nodes
```

Registers a worker node with the NOMMO controller.

### List Nodes

```http
GET /nodes
```

Returns known worker nodes.

### Send Heartbeat

```http
POST /heartbeats
```

Accepts a heartbeat from a registered node.

### Register Service

```http
POST /services
```

Registers a service instance on a worker node.

### Discover Service

```http
GET /services/:name/discover
```

Returns healthy service instances for a service.

### Route Service

```http
GET /routes/:service
```

Returns a routing decision for a healthy service instance.

### Cluster Report

```http
GET /cluster/report
```

Returns cluster health, service, and event summary.
