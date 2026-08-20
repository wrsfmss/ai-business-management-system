from dataclasses import dataclass

from fastapi import HTTPException


@dataclass(frozen=True)
class AuthenticatedUser:
    user_id: str


class SupabaseAuthVerifier:
    """Authentication boundary.

    Production must validate the Supabase JWT signature, issuer, audience,
    expiry, and subject using the configured Supabase JWKS/project settings.
    This module intentionally fails closed until a real verifier is configured.
    """

    def __init__(self, enabled: bool = False) -> None:
        self.enabled = enabled

    def verify(self, authorization: str | None) -> AuthenticatedUser:
        if not self.enabled:
            raise HTTPException(status_code=503, detail="Supabase authentication is not configured")
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="authentication required")
        token = authorization.removeprefix("Bearer ").strip()
        if not token:
            raise HTTPException(status_code=401, detail="invalid authentication")
        raise HTTPException(status_code=501, detail="JWT verification adapter not installed")
