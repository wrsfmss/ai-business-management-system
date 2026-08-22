# BRAHMA JARVIS Architecture

## Purpose

BRAHMA JARVIS is a standalone persistent personal/business agent with an iPad command centre. The LLM is a reasoning component, not the system of record.

## Layers

1. **Experience** — iPad chat, voice, missions, Needs You, activity.
2. **Control plane** — FastAPI, authentication, Supervisor, Policy, Attention Manager.
3. **Durable execution** — Tasks, Executions, Workers, checkpoints, queue/leases.
4. **Capability plane** — Provider Router and MCP capability gateway.
5. **Verification** — Critic and evidence checks.
6. **Persistence** — PostgreSQL/Supabase, events, audit, memory, outbox/inbox.

## Control flow

```text
User -> API -> Supervisor -> Policy -> Execution -> Worker -> Capability
                                               |                 |
                                               +-> Attention     +-> Provider/MCP
                                                        \       /
                                                         -> Critic
                                                              |
                                                       Reconciliation
                                                              |
                                                        PostgreSQL
```

## Source of truth

PostgreSQL/Supabase is authoritative. WebSocket state, iPad state, model context and caches are not authoritative.

## Safety boundary

LLM output is untrusted input. Consequential actions pass through capability and policy checks. Irreversible/high-risk actions may require durable human approval.

## Recovery

Workers checkpoint durable progress. Retries use idempotency keys. Reconciliation commits state transition and corresponding audit/event records atomically.

## Explicit exclusion

AXIS PRIME is not a BRAHMA runtime dependency, package, configuration, database dependency, deployment service or agent identity.
