# BRAHMA JARVIS

Standalone BRAHMA JARVIS Phase 5 foundation. This directory is intentionally isolated from the legacy Node/MCP business-management runtime.

## Architectural boundary

- FastAPI control plane
- Supabase/PostgreSQL authoritative state
- durable tasks and executions
- Supervisor / Mission / Worker / Critic lifecycle
- policy-controlled MCP capabilities
- provider routing and fallback
- Attention Manager and durable approvals
- immutable audit events
- outbox/inbox idempotency
- native iPad client target
- BRAHMA-Bench acceptance suite

AXIS PRIME is explicitly excluded from the runtime, imports, configuration, migrations, deployment and tests.

## Phase gates

1. 5.8 — real-DB hardening and exactly-once durable reconciliation
2. 5.9 — Attention Manager and durable approvals
3. 5.9-iPad — Mission Centre, reconnect and force-close recovery
4. 5.10 — BRAHMA-Bench reliability and attention-efficiency evaluation

## Source-of-truth rule

The database is authoritative. The iPad cache and realtime transport are delivery mechanisms only. LLM output is untrusted input to policy and execution, never the durable state machine.

## Non-goals

The legacy Proxmox/virtualization subsystem and its Node MCP server are not dependencies of BRAHMA JARVIS.
