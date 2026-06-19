import type { NommoEvent, NommoEventType } from "../../types/event.js";

export interface RecordEventInput {
  type: NommoEventType;
  message: string;
  timestamp?: Date;
  metadata?: Record<string, string | number | boolean | null>;
}

export class EventLog {
  private readonly events: NommoEvent[] = [];
  private counter = 0;

  record(input: RecordEventInput): NommoEvent {
    this.counter += 1;

    const event: NommoEvent = {
      id: `evt_${this.counter.toString().padStart(6, "0")}`,
      type: input.type,
      message: input.message,
      timestamp: (input.timestamp ?? new Date()).toISOString(),
      metadata: input.metadata ?? {}
    };

    this.events.push(event);

    return event;
  }

  list(): NommoEvent[] {
    return [...this.events];
  }

  latest(limit = 10): NommoEvent[] {
    return this.events.slice(-limit);
  }

  count(): number {
    return this.events.length;
  }

  clear(): void {
    this.events.length = 0;
    this.counter = 0;
  }
}
