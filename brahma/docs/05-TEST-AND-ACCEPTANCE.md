# Test and Acceptance Plan

## Unit

- state transition invariants
- policy decisions
- idempotency semantics
- capability validation
- attention decision validation

## Integration

- PostgreSQL migrations
- transactional reconciliation
- audit/event creation
- worker checkpoint/recovery
- provider routing/fallback
- MCP authorization

## Real DB acceptance

A disposable PostgreSQL/Supabase environment must prove:

1. create one task and execution;
2. interrupt the DB during reconciliation;
3. retry with the same idempotency key;
4. observe one durable state transition;
5. observe one corresponding immutable audit event;
6. repeat the same command and obtain the original result.

## iPad acceptance

- authenticated session;
- unique user message;
- persisted assistant response;
- force-close;
- reopen;
- exact history restoration;
- durable attention request restoration;
- duplicate approval protection.

## BRAHMA-Bench

Measure completion rate, correctness, recovery rate, intervention count, unnecessary interruption rate, decision quality, latency and cost.

## Release rule

A green unit suite does not constitute release acceptance. Phase 5 is PASS only when real-DB, iPad recovery, security and BRAHMA-Bench gates are green.
