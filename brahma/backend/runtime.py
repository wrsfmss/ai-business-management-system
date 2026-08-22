from dataclasses import dataclass

from brahma.backend.auth import SupabaseAuthVerifier
from brahma.backend.db import AttentionRepository


@dataclass(frozen=True)
class Runtime:
    auth: SupabaseAuthVerifier
    attention: AttentionRepository


def build_runtime(executor, auth_enabled: bool = False) -> Runtime:
    """Build the server runtime with explicit, injectable dependencies."""
    return Runtime(
        auth=SupabaseAuthVerifier(enabled=auth_enabled),
        attention=AttentionRepository(executor),
    )
