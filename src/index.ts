import { loadRuntimeConfig } from "./config/runtime.js";
import { buildApp } from "./http/app.js";

const config = loadRuntimeConfig();
const app = await buildApp(config);

await app.listen({
  host: config.host,
  port: config.port
});
