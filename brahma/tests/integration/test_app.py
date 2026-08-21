from fastapi.testclient import TestClient

from brahma.backend.app import app


def test_readyz_fails_closed_without_database(monkeypatch) -> None:
    monkeypatch.delenv("BRAHMA_DATABASE_URL", raising=False)
    response = TestClient(app).get("/readyz")
    assert response.status_code == 503
    assert response.json()["detail"] == "database is not configured"


def test_attention_endpoint_requires_configured_supabase_auth(monkeypatch) -> None:
    monkeypatch.setenv("BRAHMA_DATABASE_URL", "postgresql://invalid")
    monkeypatch.setenv("BRAHMA_SUPABASE_AUTH_ENABLED", "false")

    response = TestClient(app).post(
        "/api/v1/attention/00000000-0000-0000-0000-000000000001/decision",
        json={"decision": "approve", "idempotency_key": "test-key"},
    )
    assert response.status_code == 503
    assert response.json()["detail"] == "Supabase authentication is not configured"
