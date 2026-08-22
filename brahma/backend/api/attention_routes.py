from dataclasses import dataclass

from brahma.backend.api.attention import AttentionAPI


@dataclass(frozen=True)
class AttentionSubmission:
    request_id: str
    decision: str
    idempotency_key: str


class AuthenticatedAttentionRoute:
    """Framework-neutral FastAPI route contract.

    The concrete HTTP adapter supplies an authenticated actor and DB-backed
    transaction implementation. Client-provided actor IDs are never trusted.
    """

    def __init__(self, api: AttentionAPI | None = None) -> None:
        self.api = api or AttentionAPI()

    def submit(self, actor_id: str, submission: AttentionSubmission) -> dict[str, str]:
        if not actor_id:
            raise PermissionError("authenticated actor required")
        return self.api.validate_submission(
            submission.request_id,
            actor_id,
            submission.decision,
            submission.idempotency_key,
        )
