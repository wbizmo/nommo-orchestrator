export interface NommoRuntimeConfig {
  environment: "development" | "test" | "production";
  host: string;
  port: number;
  serviceName: string;
  version: string;
}
