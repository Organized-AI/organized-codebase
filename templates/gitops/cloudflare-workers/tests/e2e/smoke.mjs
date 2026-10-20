#!/usr/bin/env node
// Starter e2e: the Worker answers, and (when wrangler can tail) the request shows up in Workers Logs.
// Replace it with one test per platform your users connect from; see Organized-AI/jev-pi-deal-desk/tests/e2e.
//   DD_BASE=https://<worker>.<subdomain>.workers.dev node tests/e2e/smoke.mjs
import { writeFileSync, mkdirSync } from "node:fs";
const BASE = (process.env.DD_BASE || "__PROD_URL__").replace(/\/$/, "");
const RUN = process.env.DD_RUN_ID || `e2e-${Date.now()}`;
const checks = [];
const check = (name, ok, detail = "") => { checks.push({ name, ok: Boolean(ok), detail: String(detail).slice(0, 200) }); console.log(`${ok ? "ok  " : "FAIL"}  ${name}${detail && !ok ? ": " + detail : ""}`); };

const t0 = Date.now();
const home = await fetch(BASE, { headers: { "x-dd-e2e": RUN } }).catch((e) => ({ status: 0, statusText: e.message }));
check("the Worker answers", home.status >= 200 && home.status < 400, `${home.status} ${home.statusText ?? ""}`);
check("it answers in under 3 s", Date.now() - t0 < 3000, `${Date.now() - t0} ms`);
for (const path of (process.env.DD_HEALTH_PATHS || "/health,/api/health").split(",")) {
  const r = await fetch(BASE + path, { headers: { "x-dd-e2e": RUN } }).catch(() => null);
  if (r && r.status !== 404) { check(`${path} is healthy`, r.ok, r.status); break; }
}
mkdirSync("tests/e2e/reports", { recursive: true });
writeFileSync(`tests/e2e/reports/${RUN}.json`, JSON.stringify({ run_id: RUN, base: BASE, at: new Date().toISOString(), checks }, null, 2));
const failed = checks.filter((c) => !c.ok).length;
console.log(`\n${checks.length - failed}/${checks.length} checks passed · run ${RUN}`);
process.exit(failed ? 1 : 0);
