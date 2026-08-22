# BRAHMA JARVIS Phase 5 — Release Plan

## Purpose

BRAHMA JARVIS is a standalone persistent personal/business agent system with a native iPad command centre. The legacy Node/MCP/Proxmox application is reference material only and is not a runtime dependency. AXIS PRIME is explicitly excluded.

## Release sequence

1. **5.8 Real DB Hardening** — durable task/execution state, transactional reconciliation, idempotency, outbox/inbox, immutable audit, failure injection.
2. **5.9 Attention Manager** — durable approval requests, policy-gated consequential actions, duplicate/stale decision protection.
3. **iPad Mission Centre** — authenticated chat, missions, Needs You, activity, reconnect and force-close recovery.
4. **5.10 BRAHMA-Bench** — end-to-end autonomy/recovery/attention evaluation.

## Definition of Done

- Conversations survive client restart.
- Tasks and executions survive server restart.
- Worker crashes recover from durable checkpoints.
- Provider failures follow approved fallback policy.
- Database interruption cannot produce duplicate state transitions.
- Consequential actions are policy-gated.
- Attention requests survive iPad force-close/reopen.
- Duplicate approvals are idempotent.
- Stale approvals are rejected.
- Important state transitions create immutable audit events.
- iPad reconnect reconciles from authoritative server state.
- Real PostgreSQL/Supabase acceptance tests pass.
- BRAHMA-Bench passes its recovery and human-attention scenarios.
- Automated AXIS PRIME exclusion check passes.

## Architecture

```text
iPad -> FastAPI -> Supervisor -> Policy -> Task/Execution -> Worker -> MCP/Provider
                                             |                         |
                                             +-> Attention             +-> Critic
                                                       \              /
                                                        -> Reconciliation
                                                               |
                                                         PostgreSQL
```

## Non-goals

- Do not copy PersonalJarvis wholesale.
- Do not make iPadOS the autonomous server.
- Do not make an LLM the source of truth.
- Do not allow unrestricted tool execution.
- Do not introduce AXIS PRIME dependencies.
- Do not declare Phase 5 complete until real acceptance tests pass.

## Phase 6

After Phase 5 passes, add capabilities such as GitHub, documents, research, calendar, email and scheduled missions through the same Policy -> Capability -> Execution -> Verification -> Reconciliation -> Audit pipeline. Phase 6 must not replace the Phase 5 durability model.
