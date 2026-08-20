from dataclasses import asdict

from brahma.backend.attention.manager import AttentionDecision, AttentionManager


class AttentionAPI:
    """Transport-neutral application boundary for the iPad Needs You API.

    A production FastAPI adapter should authenticate the actor, load the
    authoritative request from PostgreSQL, and persist the decision in one
    transaction. This class deliberately contains no client-side authority.
    """

    def __init__(self, manager: AttentionManager | None = None) -> None:
        self.manager = manager or AttentionManager()

    def validate_submission(
        self, request_id: str, actor_id: str, decision: str, idempotency_key: str
    ) -> dict[str, str]:
        item = AttentionDecision(request_id, actor_id, decision, idempotency_key)
        self.manager.validate(item)
        return asdict(item)
