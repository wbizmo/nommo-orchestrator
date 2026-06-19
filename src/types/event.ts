export type NommoEventType =
  | "node.registered"
  | "node.heartbeat"
  | "node.status_changed"
  | "service.registered"
  | "route.selected"
  | "route.unavailable";

export interface NommoEvent {
  id: string;
  type: NommoEventType;
  message: string;
  timestamp: string;
  metadata: Record<string, string | number | boolean | null>;
}
