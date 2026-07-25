# Loop Efficiency Updates — Priority Set

**Applies to:** `loop-cloudflare-architecture.md`, `loop-tracker-design.md`,
`loop-engineering-framework.md`

**Status:** Priority set only. Six additional efficiency points were
identified but are deferred until this set is tested live. See
"Deferred" at the bottom.

---

## // WHY THESE THREE FIRST

Of the nine efficiency points identified when reviewing the Finn-loop
design, these three change the actual shape of the architecture — the
other six are hardening on top of whatever shape you land on. Testing
these first means you're not hardening a design you're about to replace.

---

## // UPDATE 1: Event-Driven Triggering (replaces polling)

**Problem:** `/loop 5min /build` and `/loop 5min /review` each wake up on
a fixed timer and re-scan the tracker regardless of whether anything
changed. Two consequences:

- Up to 5 minutes of dead latency between a PR opening and review starting
- Wasted cycles on every tick when the backlog is empty

**What changes:** Workers Builds already fires a webhook the moment a PR
is opened — that's what `loop-notify` listens for today. Route that same
event to trigger `review` directly instead of letting it wait on its own
timer. Symmetrically, a tracker write (an issue flipping to
`agent-ready`) should wake `build`, instead of `build` polling
`GET /issues?status=agent-ready` on an interval.

**Result:** two always-on pollers become two idle-until-woken processes.
Latency drops from "up to 5 min" to "next tick after the actual event."

**Where this touches the existing docs:**
- `loop-tracker-design.md` — the Loop Tracker Worker's `PATCH /issues/:id`
  endpoint becomes the trigger point; a status change to `agent-ready`
  should emit an event (or directly invoke build) rather than just
  writing the row and waiting for the next poll.
- `loop-cloudflare-architecture.md` — seam 5 (notify webhook) already
  receives the GitHub PR event; it just needs a second consumer (review)
  in addition to Slack/Discord.

---

## // UPDATE 2: Pre-Review Lint Gate (cheap check before expensive one)

**Problem:** Review's job — opening a live preview URL in a browser,
checking the vanity route resolves, GTM fires, storage adapter
reads/writes — is expensive. If build's output has a lint error or a
type error, review still burns a full browser-testing cycle discovering
that the hard way.

**What changes:** Before an issue is labeled `ready-for-review`, run a
cheap static check (lint/typecheck) against the build output. Only
promote to `ready-for-review` — and therefore only trigger a real
browser-testing pass — if the static check passes. Obviously broken
output gets filtered out before it costs a real review cycle.

**Same principle as:** the `bootstrap-qa.sh` loop already built for the
staged bootstrap — verify before advancing, don't trust the self-report.
This is that same pattern applied one level down, inside the build step
itself.

**Where this touches the existing docs:**
- `loop-tracker-design.md` — status enum gets a checkpoint between
  `in-progress` and `ready-for-review`; can be a sub-state or just a gate
  condition on the same transition, either works, worth deciding before
  attendees start hitting it live.

---

## // UPDATE 3: Single Session, Two Roles (replaces two standing sessions)

**Problem:** `/loop 5min /build` and `/loop 5min /review` each need their
own open Claude Code chat session. That's two concurrent agent contexts
running continuously, most of the time idle. This is the largest
standing cost in the current design — bigger than the polling interval
itself.

**What changes:** One session multiplexes both roles: check for
`agent-ready` work → build it → check for `ready-for-review` work →
review it → repeat. Combined with Update 1, this becomes "wake on event,
determine which role the event calls for, run that role."

**Trade-off, stated plainly:** you lose strict parallelism between build
and review. Given the workshop's actual backlog size (a handful of
personalization/ingestion issues per attendee), true parallel build and
review probably isn't buying much today. If a future use case needs
real concurrency, this is the point to revisit — not before.

**Where this touches the existing docs:**
- `loop-engineering-framework.md` — "Attendee starts two parallel timed
  loops" in the Loop Mechanics section becomes "attendee starts one
  session running both roles." The workshop instructions get simpler,
  not more complex, as a side effect.

---

## // TESTING PLAN (before touching the deferred six)

1. Wire Update 1 (event-driven triggering) first — it's the dependency
   Update 3 needs anyway (single session still needs to wake on events
   rather than poll).
2. Add Update 2 (lint gate) as a checkpoint in the tracker status flow.
3. Collapse to Update 3 (single session, two roles) last, once 1 and 2
   are proven stable independently.
4. Run the existing end-to-end smoke test from `loop-tracker-design.md`
   step 6 against the new shape: file one issue, confirm it's picked up
   by event (not by waiting for a timer tick), confirm the lint gate
   blocks a deliberately broken build, confirm one session handles both
   the build and the review side of that single issue.

---

## // DEFERRED (revisit after the above is tested)

These don't change the architecture's shape — they harden it. Re-evaluate
once the priority set is live:

4. Priority/dependency ordering in the tracker (`priority` or
   `depends_on` column) — matters more once attendees file overlapping
   issues.
5. Partial re-testing on review — only re-run the specific acceptance
   criteria that failed, using the existing `verdict` JSON column,
   instead of the full test pass.
6. Webhook idempotency in `loop-notify` — dedupe on GitHub's delivery ID
   header to avoid duplicate Slack/Discord pings on retried deliveries.
7. Merge `loop-tracker` and `loop-notify` into one Worker with two route
   groups, since both are thin and both need D1 access.
8. D1-over-Linear latency framing — already the default per
   `loop-tracker-design.md`, just worth stating explicitly that it also
   cuts an external API round trip on every tracker read/write, not just
   "keeps it in-account."
