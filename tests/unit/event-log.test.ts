import { describe, expect, it } from "vitest";
import { EventLog } from "../../src/core/events/event-log.js";

describe("EventLog", () => {
  it("records events with stable ids", () => {
    const events = new EventLog();

    const first = events.record({
      type: "node.registered",
      message: "node registered",
      timestamp: new Date("2026-06-19T00:00:00.000Z"),
      metadata: {
        nodeId: "node-1"
      }
    });

    const second = events.record({
      type: "node.heartbeat",
      message: "heartbeat accepted",
      timestamp: new Date("2026-06-19T00:00:05.000Z"),
      metadata: {
        nodeId: "node-1"
      }
    });

    expect(first.id).toBe("evt_000001");
    expect(second.id).toBe("evt_000002");
    expect(events.count()).toBe(2);
  });

  it("returns latest events by limit", () => {
    const events = new EventLog();

    for (const index of [1, 2, 3]) {
      events.record({
        type: "node.heartbeat",
        message: `heartbeat ${index}`,
        metadata: {
          index
        }
      });
    }

    const latest = events.latest(2);

    expect(latest).toHaveLength(2);
    expect(latest[0]?.message).toBe("heartbeat 2");
    expect(latest[1]?.message).toBe("heartbeat 3");
  });

  it("clears events", () => {
    const events = new EventLog();

    events.record({
      type: "node.registered",
      message: "node registered"
    });

    events.clear();

    expect(events.count()).toBe(0);
    expect(events.list()).toHaveLength(0);
  });
});
