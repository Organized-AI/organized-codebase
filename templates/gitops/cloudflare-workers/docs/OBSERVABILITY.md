# Observability

Turn on logs and traces for every Worker in `wrangler.jsonc`:

```jsonc
"observability": {
  "enabled": true,
  "logs": { "enabled": true, "head_sampling_rate": 1, "invocation_logs": true },
  "traces": { "enabled": true, "head_sampling_rate": 1 }
}
```

- Write one structured `console.log(JSON.stringify({ evt: "request", path, status, ms, ... }))` per request, never a
  secret, key or email. Workers Logs indexes the JSON fields, so you can filter on them.
- The e2e suite sends `x-dd-e2e: <run id>` on every request and logs it, so one run can be found in Workers Logs,
  traces, and any audit table, and compared with what the suite sent.
- Live: `npx wrangler tail <worker> --format pretty`. Stored: Dashboard → Workers → Observability (Events, Traces), or
  the telemetry API with a token that has Workers Observability: Read.
- If a Worker puts a secret in its URL path (some MCP connectors do), Cloudflare's invocation log records the URL.
  Prefer headers; if you can't, say so in the docs and keep log retention short.
