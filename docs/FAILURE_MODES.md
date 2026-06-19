# NOMMO Failure Modes

NOMMO exists to model and manage distributed service failure.

Planned failure modes for v1:

- Worker stops sending heartbeats
- Worker returns after being marked unhealthy
- Service has no healthy instances
- Routing engine must avoid dead nodes
- Cluster state must remain readable during degraded health

Sprint 1 only establishes the foundation required to test these behaviors later.
