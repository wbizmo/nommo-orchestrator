# NOMMO Testing Strategy

NOMMO uses Vitest for unit, integration, failure simulation, and benchmark-style tests.

The project must prove that orchestration behavior works, not merely that endpoints return responses.

## Test Categories

- Unit tests for pure logic
- Integration tests for HTTP behavior
- Failure simulation tests for unhealthy nodes and recovery
- Benchmark tests for heartbeat and routing performance

## Sprint 1 Tests

Sprint 1 verifies:

- Runtime configuration loading
- Root metadata response
- Health response generation
- Fastify HTTP endpoint behavior
