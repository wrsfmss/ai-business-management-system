import os
from dataclasses import dataclass


@dataclass(frozen=True)
class DatabaseConfig:
    dsn: str


def load_database_config() -> DatabaseConfig:
    dsn = os.getenv("BRAHMA_DATABASE_URL")
    if not dsn:
        raise RuntimeError("BRAHMA_DATABASE_URL is required")
    return DatabaseConfig(dsn=dsn)


class AttentionRepository:
    """Database adapter boundary for the atomic attention RPC.

    The SQL function is the authority. This adapter deliberately refuses to
    emulate persistence in memory when a database is unavailable.
    """

    def __init__(self, executor) -> None:
        self.executor = executor

    def decide(self, request_id: str, actor_id: str, decision: str, idempotency_key: str):
        return self.executor(
            "select brahma_decide_attention(%s, %s, %s, %s)",
            (request_id, actor_id, decision, idempotency_key),
        )
