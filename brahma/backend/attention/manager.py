from dataclasses import dataclass


@dataclass(frozen=True)
class AttentionDecision:
    request_id: str
    actor_id: str
    decision: str
    idempotency_key: str


class AttentionManager:
    """Durable human-attention boundary.

    Persistence must enforce one decision per request and idempotency at the
    database transaction boundary. The manager never treats client state as
    authoritative.
    """

    VALID = {"approve", "reject", "defer", "expire", "cancel"}

    def validate(self, decision: AttentionDecision) -> None:
        if decision.decision not in self.VALID:
            raise ValueError(f"Unsupported attention decision: {decision.decision}")
        if not decision.idempotency_key:
            raise ValueError("Attention decisions require an idempotency key")
