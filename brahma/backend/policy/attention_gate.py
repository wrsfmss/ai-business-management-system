from dataclasses import dataclass


@dataclass(frozen=True)
class PolicyDecision:
    capability: str
    requires_attention: bool
    reason: str


class AttentionGate:
    """Pure policy boundary: it decides whether execution must pause.

    It does not execute capabilities and it does not trust model output as
    authorization. The caller persists an AttentionRequest before pausing.
    """

    def evaluate(self, capability: str, consequential: bool) -> PolicyDecision:
        if not capability:
            raise ValueError("capability is required")
        return PolicyDecision(
            capability=capability,
            requires_attention=consequential,
            reason="consequential action requires durable human attention"
            if consequential
            else "policy permits automatic execution",
        )
