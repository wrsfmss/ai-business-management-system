import pytest

from brahma.backend.api.attention_routes import AuthenticatedAttentionRoute, AttentionSubmission


def test_attention_route_requires_authenticated_actor() -> None:
    route = AuthenticatedAttentionRoute()
    with pytest.raises(PermissionError):
        route.submit("", AttentionSubmission("r1", "approve", "k1"))


def test_attention_route_does_not_accept_client_actor_identity() -> None:
    route = AuthenticatedAttentionRoute()
    result = route.submit("server-authenticated-user", AttentionSubmission("r1", "approve", "k1"))
    assert result["actor_id"] == "server-authenticated-user"
