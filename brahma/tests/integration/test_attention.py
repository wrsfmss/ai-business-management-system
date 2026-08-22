import pytest

from brahma.backend.attention.manager import AttentionDecision, AttentionManager


def test_attention_decision_requires_idempotency_key() -> None:
    manager = AttentionManager()
    with pytest.raises(ValueError):
        manager.validate(AttentionDecision("r1", "u1", "approve", ""))


def test_attention_decision_rejects_unknown_decision() -> None:
    manager = AttentionManager()
    with pytest.raises(ValueError):
        manager.validate(AttentionDecision("r1", "u1", "execute", "k1"))


def test_attention_decision_accepts_approval() -> None:
    manager = AttentionManager()
    manager.validate(AttentionDecision("r1", "u1", "approve", "k1"))
