from brahma.backend.policy.attention_gate import AttentionGate


def test_consequential_capability_requires_attention() -> None:
    decision = AttentionGate().evaluate("send_email", consequential=True)
    assert decision.requires_attention is True


def test_non_consequential_capability_can_run_automatically() -> None:
    decision = AttentionGate().evaluate("search_documents", consequential=False)
    assert decision.requires_attention is False
