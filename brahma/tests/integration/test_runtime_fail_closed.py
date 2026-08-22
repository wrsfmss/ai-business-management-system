import pytest

from brahma.backend.auth import SupabaseAuthVerifier
from brahma.backend.runtime import build_runtime


def test_auth_fails_closed_when_not_configured() -> None:
    verifier = SupabaseAuthVerifier(enabled=False)
    with pytest.raises(Exception) as exc:
        verifier.verify("Bearer anything")
    assert getattr(exc.value, "status_code", None) == 503


def test_runtime_requires_a_real_executor() -> None:
    runtime = build_runtime(lambda query, params: {"query": query, "params": params})
    result = runtime.attention.decide("request", "actor", "approve", "key")
    assert result["query"].startswith("select brahma_decide_attention")
