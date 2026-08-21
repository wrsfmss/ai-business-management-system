"""Disposable PostgreSQL acceptance tests for BRAHMA attention reconciliation."""

import os
import uuid
from concurrent.futures import ThreadPoolExecutor

import psycopg
import pytest

from brahma.backend.db import AttentionRepository
from brahma.backend.postgres import PostgresExecutor

pytestmark = pytest.mark.integration


def _seed_pending_request(dsn: str, actor_id: str) -> tuple[str, str]:
    task_id = str(uuid.uuid4())
    execution_id = str(uuid.uuid4())
    request_id = str(uuid.uuid4())
    task_key = str(uuid.uuid4())
    execution_key = str(uuid.uuid4())
    request_key = str(uuid.uuid4())

    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "insert into brahma_tasks(id, user_id, objective, status, idempotency_key) "
                "values (%s, %s, 'integration acceptance', 'running', %s)",
                (task_id, actor_id, task_key),
            )
            cur.execute(
                "insert into brahma_executions(id, task_id, status, idempotency_key) "
                "values (%s, %s, 'waiting_attention', %s)",
                (execution_id, task_id, execution_key),
            )
            cur.execute(
                "insert into brahma_attention_requests(id, execution_id, status, prompt, idempotency_key) "
                "values (%s, %s, 'pending', 'Approve integration test', %s)",
                (request_id, execution_id, request_key),
            )
        conn.commit()
    return request_id, execution_id


def _repository_decide(dsn: str, request_id: str, actor_id: str, decision: str, key: str):
    return AttentionRepository(PostgresExecutor(dsn)).decide(
        request_id, actor_id, decision, key
    )


def test_real_db_attention_is_idempotent_and_audited() -> None:
    dsn = os.getenv("BRAHMA_DATABASE_URL")
    if not dsn:
        pytest.skip("BRAHMA_DATABASE_URL is not configured")

    actor_id = str(uuid.uuid4())
    request_id, execution_id = _seed_pending_request(dsn, actor_id)
    idempotency_key = str(uuid.uuid4())

    first = _repository_decide(dsn, request_id, actor_id, "approve", idempotency_key)
    second = _repository_decide(dsn, request_id, actor_id, "approve", idempotency_key)

    assert first == second
    assert first["status"] == "recorded"

    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select status from brahma_attention_requests where id = %s",
                (request_id,),
            )
            assert cur.fetchone()[0] == "approved"

            cur.execute(
                "select count(*) from brahma_attention_decisions where attention_request_id = %s",
                (request_id,),
            )
            assert cur.fetchone()[0] == 1

            cur.execute(
                "select count(*) from brahma_audit_events "
                "where execution_id = %s and event_type = 'attention_decision'",
                (execution_id,),
            )
            assert cur.fetchone()[0] == 1


def test_real_db_concurrent_same_idempotency_key_has_one_side_effect() -> None:
    dsn = os.getenv("BRAHMA_DATABASE_URL")
    if not dsn:
        pytest.skip("BRAHMA_DATABASE_URL is not configured")

    actor_id = str(uuid.uuid4())
    request_id, execution_id = _seed_pending_request(dsn, actor_id)
    idempotency_key = str(uuid.uuid4())

    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [
            pool.submit(
                _repository_decide,
                dsn,
                request_id,
                actor_id,
                "approve",
                idempotency_key,
            )
            for _ in range(2)
        ]
        results = [future.result() for future in futures]

    assert results[0] == results[1]

    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select count(*) from brahma_attention_decisions where attention_request_id = %s",
                (request_id,),
            )
            assert cur.fetchone()[0] == 1

            cur.execute(
                "select count(*) from brahma_audit_events "
                "where execution_id = %s and event_type = 'attention_decision'",
                (execution_id,),
            )
            assert cur.fetchone()[0] == 1


def test_real_db_rejects_second_transition_with_new_idempotency_key() -> None:
    dsn = os.getenv("BRAHMA_DATABASE_URL")
    if not dsn:
        pytest.skip("BRAHMA_DATABASE_URL is not configured")

    actor_id = str(uuid.uuid4())
    request_id, _ = _seed_pending_request(dsn, actor_id)
    _repository_decide(dsn, request_id, actor_id, "approve", str(uuid.uuid4()))

    with pytest.raises(Exception, match="no longer pending"):
        _repository_decide(dsn, request_id, actor_id, "reject", str(uuid.uuid4()))
