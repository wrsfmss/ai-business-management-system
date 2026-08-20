import os

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from brahma.backend.api.attention import AttentionAPI
from brahma.backend.api.attention_routes import AttentionSubmission, AuthenticatedAttentionRoute
from brahma.backend.auth import SupabaseAuthVerifier
from brahma.backend.postgres import PostgresExecutor

app = FastAPI(title="BRAHMA JARVIS", version="5.9")


class DecisionBody(BaseModel):
    decision: str
    idempotency_key: str


def _runtime() -> tuple[SupabaseAuthVerifier, AuthenticatedAttentionRoute]:
    auth_enabled = os.getenv("BRAHMA_SUPABASE_AUTH_ENABLED", "false").lower() == "true"
    verifier = SupabaseAuthVerifier(enabled=auth_enabled)
    dsn = os.getenv("BRAHMA_DATABASE_URL")
    if not dsn:
        raise HTTPException(status_code=503, detail="database is not configured")
    try:
        executor = PostgresExecutor(dsn)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    # AttentionAPI's current validation boundary is retained here; the live
    # PostgreSQL RPC is the next application-service integration point.
    return verifier, AuthenticatedAttentionRoute(AttentionAPI())


@app.get("/readyz")
def readyz() -> dict[str, str]:
    if not os.getenv("BRAHMA_DATABASE_URL"):
        raise HTTPException(status_code=503, detail="database is not configured")
    return {"status": "ready"}


@app.post("/api/v1/attention/{request_id}/decision")
def decide_attention(
    request_id: str,
    body: DecisionBody,
    authorization: str | None = Header(default=None),
) -> dict[str, str]:
    verifier, route = _runtime()
    user = verifier.verify(authorization)
    try:
        return route.submit(
            user.user_id,
            AttentionSubmission(request_id, body.decision, body.idempotency_key),
        )
    except (PermissionError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
