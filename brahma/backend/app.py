import os

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from brahma.backend.auth import SupabaseAuthVerifier
from brahma.backend.attention_service import AttentionService
from brahma.backend.postgres import PostgresExecutor

app = FastAPI(title="BRAHMA JARVIS", version="5.9")


class DecisionBody(BaseModel):
    decision: str
    idempotency_key: str


def _services() -> tuple[SupabaseAuthVerifier, AttentionService]:
    auth_enabled = os.getenv("BRAHMA_SUPABASE_AUTH_ENABLED", "false").lower() == "true"
    verifier = SupabaseAuthVerifier(enabled=auth_enabled)
    dsn = os.getenv("BRAHMA_DATABASE_URL")
    if not dsn:
        raise HTTPException(status_code=503, detail="database is not configured")
    try:
        executor = PostgresExecutor(dsn)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    from brahma.backend.db import AttentionRepository
    return verifier, AttentionService(AttentionRepository(executor))


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
) -> dict:
    verifier, service = _services()
    user = verifier.verify(authorization)
    try:
        result = service.decide(
            request_id,
            user.user_id,
            body.decision,
            body.idempotency_key,
        )
        return result if isinstance(result, dict) else {"result": result}
    except (PermissionError, ValueError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
