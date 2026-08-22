-- Real PostgreSQL acceptance test script.
-- Run against a disposable database after applying 001_phase5_core.sql and
-- 002_reconciliation.sql. Replace the UUID with an actual test user UUID.

begin;

-- Use a fixed test execution so the test is repeatable in a disposable DB.
insert into brahma_tasks(user_id, objective, status, idempotency_key)
values ('00000000-0000-0000-0000-000000000001', 'BRAHMA real-db reconciliation acceptance', 'running', 'acceptance-task-001')
returning id;

-- The following block is intended to be executed by the harness after reading
-- the task id above and inserting its execution row.
-- Required assertions:
-- 1. First reconciliation returns status=verifying.
-- 2. Repeating the identical idempotency key returns the same result.
-- 3. executions has exactly one transition to verifying.
-- 4. execution_events has exactly one corresponding event.
-- 5. audit_events has exactly one corresponding event.
-- 6. A different idempotency key attempting verifying -> verifying fails.

rollback;
