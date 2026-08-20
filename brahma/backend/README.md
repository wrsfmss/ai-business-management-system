# BRAHMA Backend — Phase 5

This directory is the implementation boundary for the BRAHMA FastAPI control plane.

## Required modules

- `api/` — authenticated HTTP/WebSocket API
- `domain/` — state machines and domain invariants
- `tasks/` — durable task creation and lifecycle
- `executions/` — execution lifecycle and idempotency
- `supervisor/` — mission planning and worker assignment
- `workers/` — checkpoints, leases, heartbeats and recovery
- `policy/` — capability/risk/approval decisions
- `providers/` — model routing and fallback
- `mcp/` — capability gateway
- `attention/` — durable human decisions
- `verification/` — critic/verification
- `reconciliation/` — transactional state transitions
- `audit/` — immutable audit events
- `memory/` — durable memory and retrieval

## Invariants

1. PostgreSQL/Supabase is authoritative.
2. LLM output is untrusted input.
3. Consequential actions require policy approval when configured.
4. Retries use idempotency keys.
5. Important transitions produce immutable audit events.
6. iPad/WebSocket state is never authoritative.
7. AXIS PRIME is not imported, configured, migrated or deployed.

Implementation must be accompanied by real-DB integration tests before Phase 5 can be marked complete.
