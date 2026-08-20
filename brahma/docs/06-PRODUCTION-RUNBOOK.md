# Production Runbook

## Preflight

- verify required environment variables and secret injection;
- apply migrations to a disposable database first;
- run unit/integration/real-DB acceptance;
- verify readiness endpoint;
- verify TLS and authentication;
- verify AXIS PRIME exclusion check.

## Deployment

1. Deploy backend and worker versions as an atomic release.
2. Apply compatible migrations.
3. Start workers.
4. Verify health/readiness.
5. Run authenticated smoke test.
6. Confirm one chat message persists and reloads.
7. Confirm one durable execution can complete.

## Incident handling

### Worker failure
Inspect heartbeat/checkpoint, then allow lease recovery. Do not manually create a second execution.

### Provider failure
Provider Router follows configured fallback policy. Record provider attempt and outcome.

### Database interruption
Stop new consequential reconciliation if required, restore connectivity, retry with the original idempotency key, and verify exactly-once durable transition semantics.

### iPad outage
Server continues safe work. Human-dependent work remains durably paused.

## Rollback

Rollback application code only when the previous version is schema-compatible. Never delete audit history to repair a deployment. Database rollback must follow an explicit migration recovery procedure.

## Observability

Track readiness, worker heartbeats, queue depth, execution failures, attention backlog, provider latency, token/cost telemetry and reconciliation errors.
