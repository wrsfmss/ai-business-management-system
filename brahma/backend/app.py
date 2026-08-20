from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from brahma.backend.api.attention import AttentionAPI
from brahma.backend.api.attention_routes import AttentionSubmission, AuthenticatedAttentionRoute

app = FastAPI(title="BRAHMA JARVIS", version="5.9")
attention_route = AuthenticatedAttentionRoute(AttentionAPI())


class DecisionBody(BaseModel):
    decision: str
    idempotency_key: str


@app.get("/readyz")
def readyz() -> dict[str, str]:
    return {"status": "ready"}


@app.post("/api/v1/attention/{request_id}/decision")
def decide_attention(
    request_id: str,
    body: DecisionBody,
    authorization: str | None = Header(default=None),
) -> dict[str, str]:
    # Authentication provider integration is intentionally an explicit boundary:
    # production deployment must replace this with verified Supabase session data.
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="authentication required")
    actor_id = authorization.removeprefix("Bearer ").strip()
    if not actor_id:
        raise HTTPException(status_code=401, detail="invalid authentication")
    try:
        return attention_route.submit(
            actor_id,
            AttentionSubmission(request_id, body.decision, body.idempotency_key),
        )
    except (PermissionError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
