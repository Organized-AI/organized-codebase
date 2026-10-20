#!/usr/bin/env node
// Every check that needs no Cloudflare account: the same list runs on a laptop and on every pull request.
//   1. wrangler builds the Worker (deploy --dry-run).
//   2. Browser scripts in public/ parse (inline <script> blocks and *.js), when there is a public/ folder.
//   3. deploy/envs/*.json hold only what automation may write.
//   4. No key, token or private email address is committed.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ALLOWED_EMAIL = new RegExp(process.env.CHECK_ALLOWED_EMAIL || "@(example\\.(com|org)|users\\.noreply\\.github\\.com)$");
let failed = 0;
const ok = (n) => console.log(`ok    ${n}`);
const bad = (n, why) => { failed++; console.log(`FAIL  ${n}\n      ${String(why).split("\n").slice(0, 6).join("\n      ")}`); };

try { execFileSync("npx", ["wrangler", "deploy", "--dry-run", "--outdir", join(ROOT, ".wrangler", "check")], { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" }); ok("wrangler deploy --dry-run"); }
catch (e) { bad("wrangler deploy --dry-run", e.stderr || e.stdout || e.message); }

const pub = join(ROOT, "public");
if (existsSync(pub)) for (const f of readdirSync(pub)) {
  const p = join(pub, f);
  if (!statSync(p).isFile()) continue;
  if (f.endsWith(".js")) { try { new Function(readFileSync(p, "utf8").replace(/^\s*export\s+/gm, "").replace(/^\s*import\s[^;]+;?/gm, "")); ok(`parses public/${f}`); } catch (e) { bad(`parses public/${f}`, e.message); } }
  if (f.endsWith(".html")) {
    for (const [, attrs, code] of readFileSync(p, "utf8").matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (/type="(application\/ld\+json|importmap)"/.test(attrs)) continue;
      try { new Function(/type="module"/.test(attrs) ? code.replace(/^\s*import\s[^;]+;?/gm, "").replace(/\bawait\b/g, "") : code); } catch (e) { bad(`parses <script> in public/${f}`, e.message); }
    }
  }
}

const envs = join(ROOT, "deploy", "envs");
if (existsSync(envs)) for (const f of readdirSync(envs).filter((x) => x.endsWith(".json"))) {
  const env = JSON.parse(readFileSync(join(envs, f), "utf8"));
  const extra = Object.keys(env).filter((k) => !["worker", "version_id", "commit", "uploaded_at", "message"].includes(k));
  if (extra.length) bad(`deploy/envs/${f} holds only the version`, `unexpected keys: ${extra.join(", ")}`);
  else if (env.version_id && !/^[0-9a-f-]{36}$/.test(env.version_id)) bad(`deploy/envs/${f} version_id`, env.version_id);
  else ok(`deploy/envs/${f} holds only the version`);
}

const tracked = (() => { try { return execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter(Boolean); } catch { return []; } })();
const leaks = [];
for (const f of tracked) {
  if (/\.(png|jpe?g|gif|webp|woff2?|ico|zip|pdf)$/i.test(f) || f.endsWith("package-lock.json")) continue;
  let s = ""; try { s = readFileSync(join(ROOT, f), "utf8"); } catch { continue; }
  if (/\b(gh[pousr]_[A-Za-z0-9]{30,}|sk-ant-[A-Za-z0-9-]{20,}|sk-[A-Za-z0-9]{40,}|AKIA[0-9A-Z]{16})\b/.test(s)) leaks.push(`${f}: an API token`);
  if (/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(s)) leaks.push(`${f}: a private key`);
  for (const m of s.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g)) if (!ALLOWED_EMAIL.test(m[0]) && !/^(noreply|git)@/.test(m[0])) leaks.push(`${f}: ${m[0]}`);
}
if (leaks.length) bad("no keys, tokens or private emails committed (CHECK_ALLOWED_EMAIL widens the email allowlist)", leaks.slice(0, 10).join("\n"));
else ok(`no keys, tokens or private emails in ${tracked.length} tracked files`);

console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
