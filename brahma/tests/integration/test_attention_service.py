from brahma.backend.attention_service import AttentionService
from brahma.backend.db import AttentionRepository


def test_attention_service_delegates_exactly_once() -> None:
    calls = []

    def executor(query, params):
        calls.append((query, params))
        return {"status": "recorded", "decision": params[2]}

    service = AttentionService(AttentionRepository(executor))
    result = service.decide("request-1", "actor-1", "approve", "idem-1")

    assert result == {"status": "recorded", "decision": "approve"}
    assert len(calls) == 1
    query, params = calls[0]
    assert "brahma_decide_attention" in query
    assert params == ("request-1", "actor-1", "approve", "idem-1")
