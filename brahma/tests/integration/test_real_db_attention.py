"""Disposable PostgreSQL acceptance test for BRAHMA attention reconciliation.

Run only when BRAHMA_DATABASE_URL points at a disposable test database.
The test intentionally skips rather than pretending an unavailable database is
an acceptance pass.
"""

import os
import uuid

import pytest

from brahma.backend.db import AttentionRepository
from brahma.backend.postgres import PostgresExecutor

pytestmark = pytest.mark.integration


def test_real_db_attention_is_idempotent() -> None:
    dsn = os.getenv("BRAHMA_DATABASE_URL")
    if not dsn:
        pytest.skip("BRAHMA_DATABASE_URL is not configured")

    executor = PostgresExecutor(dsn)
    repository = AttentionRepository(executor)
    request_id = str(uuid.uuid4())
    actor_id = str(uuid.uuid4())
    idempotency_key = str(uuid.uuid4())

    first = repository.decide(request_id, actor_id, "approve", idempotency_key)
    second = repository.decide(request_id, actor_id, "approve", idempotency_key)

    assert first == second
