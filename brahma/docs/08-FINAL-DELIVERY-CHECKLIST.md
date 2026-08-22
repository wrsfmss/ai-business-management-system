# BRAHMA JARVIS Final Delivery Checklist

This checklist is the final gate from implementation through production. Documentation completion does not equal acceptance.

## A. Repository

- [x] Dedicated BRAHMA branch exists.
- [x] Architecture documented.
- [x] State machines documented.
- [x] Security model documented.
- [x] iPad operating model documented.
- [x] Production runbook documented.
- [x] Phase 6 roadmap documented.
- [x] AXIS PRIME exclusion documented and CI gate present.

## B. Phase 5.8 — Durable execution

- [x] Core durable-state migration defined.
- [x] Execution transition invariants implemented.
- [x] Reconciliation service contract defined.
- [x] Unit transition tests defined.
- [ ] Concrete PostgreSQL reconciliation function/adapter implemented.
- [ ] Outbox/inbox implemented.
- [ ] Worker lease/checkpoint/recovery implemented.
- [ ] Failure-injection tests executed against real PostgreSQL/Supabase.
- [ ] Duplicate retry proven to produce one state transition.
- [ ] Duplicate retry proven to produce one audit event.

## C. Phase 5.9 — Attention

- [ ] Durable Attention Manager implemented.
- [ ] Approval/rejection/defer/expiry transitions implemented.
- [ ] Stale decision protection implemented.
- [ ] Duplicate approval protection implemented.
- [ ] Policy-to-attention integration tested.

## D. iPad

- [ ] Authenticated chat connected to production API.
- [ ] Persistent history verified.
- [ ] Missions view verified.
- [ ] Needs You view verified.
- [ ] Force-close/reopen recovery verified.
- [ ] Reconnect reconciliation verified.

## E. Phase 5.10 — BRAHMA-Bench

- [ ] Autonomy benchmark executed.
- [ ] Recovery benchmark executed.
- [ ] Human-attention benchmark executed.
- [ ] Correctness benchmark executed.
- [ ] Cost/latency telemetry recorded.

## F. Production

- [ ] Secrets externalised.
- [ ] HTTPS verified.
- [ ] Database backups/recovery procedure verified.
- [ ] Health/readiness verified.
- [ ] Worker monitoring verified.
- [ ] Incident runbook exercised.
- [ ] AXIS PRIME exclusion gate green.

## Release rule

Phase 5 may be labelled **PASS** only when every unchecked acceptance item above is completed and the evidence is attached to the release/PR. Until then the release status is **OPEN**.

## Final architecture promise

```text
Policy -> Capability -> Execution -> Verification -> Reconciliation -> Audit
```

Every consequential capability must remain inside this pipeline.
