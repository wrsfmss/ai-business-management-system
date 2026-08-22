from brahma.backend.db import AttentionRepository


class AttentionService:
    """Application service that makes the database RPC authoritative."""

    def __init__(self, repository: AttentionRepository) -> None:
        self.repository = repository

    def decide(self, request_id: str, actor_id: str, decision: str, idempotency_key: str):
        return self.repository.decide(request_id, actor_id, decision, idempotency_key)
