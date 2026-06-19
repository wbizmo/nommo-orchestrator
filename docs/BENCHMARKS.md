# NOMMO Benchmarks

NOMMO includes benchmark scripts for core orchestration operations.

## Heartbeat Benchmark

```bash
npx tsx benchmarks/heartbeat.bench.ts
```

Measures repeated heartbeat ingestion against a registered node.

## Routing Benchmark

```bash
npx tsx benchmarks/routing.bench.ts
```

Measures repeated routing decisions across healthy service instances.

## Purpose

The benchmarks are not meant to claim production-grade performance.

They exist to show that NOMMO’s core control-plane operations can be measured, compared, and improved over time.
