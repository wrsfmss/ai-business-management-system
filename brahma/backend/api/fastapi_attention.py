from dataclasses import dataclass

from brahma.backend.api.attention_routes import AttentionSubmission, AuthenticatedAttentionRoute


@dataclass(frozen=True)
class HTTPAttentionResponse:
    status_code: int
    body: dict[str, str]


class FastAPIAttentionAdapter:
    """Adapter specification for the production FastAPI route.

    Authentication middleware must provide actor_id from the verified session.
    The adapter then validates the request and delegates persistence to the
    database-backed reconciliation service. It must never accept actor_id from
    the JSON payload.
    """

    def __init__(self, route: AuthenticatedAttentionRoute | None = None) -> None:
        self.route = route or AuthenticatedAttentionRoute()

    def post(self, actor_id: str, request_id: str, decision: str, idempotency_key: str) -> HTTPAttentionResponse:
        result = self.route.submit(
            actor_id,
            AttentionSubmission(request_id, decision, idempotency_key),
        )
        return HTTPAttentionResponse(200, result)
