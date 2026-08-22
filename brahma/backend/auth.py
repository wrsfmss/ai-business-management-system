import os
from dataclasses import dataclass

import jwt
from fastapi import HTTPException
from jwt import PyJWKClient


@dataclass(frozen=True)
class AuthenticatedUser:
    user_id: str
    role: str | None = None


class SupabaseAuthVerifier:
    """Verify Supabase access JWTs and fail closed on configuration errors."""

    def __init__(
        self,
        enabled: bool = False,
        *,
        supabase_url: str | None = None,
        issuer: str | None = None,
        audience: str | None = None,
        jwt_secret: str | None = None,
        jwks_client: PyJWKClient | None = None,
    ) -> None:
        self.enabled = enabled
        self.supabase_url = (supabase_url or os.getenv("SUPABASE_URL", "")).rstrip("/")
        self.issuer = issuer or os.getenv(
            "SUPABASE_JWT_ISSUER",
            f"{self.supabase_url}/auth/v1" if self.supabase_url else "",
        )
        self.audience = audience or os.getenv("SUPABASE_JWT_AUDIENCE", "authenticated")
        self.jwt_secret = jwt_secret or os.getenv("SUPABASE_JWT_SECRET")
        self.jwks_client = jwks_client

    def _get_jwks_client(self) -> PyJWKClient:
        if self.jwks_client is not None:
            return self.jwks_client
        if not self.supabase_url:
            raise RuntimeError("SUPABASE_URL is required for JWKS verification")
        return PyJWKClient(f"{self.supabase_url}/auth/v1/.well-known/jwks.json")

    def verify(self, authorization: str | None) -> AuthenticatedUser:
        if not self.enabled:
            raise HTTPException(status_code=503, detail="Supabase authentication is not configured")
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="authentication required")

        token = authorization.removeprefix("Bearer ").strip()
        if not token:
            raise HTTPException(status_code=401, detail="invalid authentication")

        try:
            header = jwt.get_unverified_header(token)
            algorithm = header.get("alg")
            if algorithm in {"RS256", "ES256"}:
                signing_key = self._get_jwks_client().get_signing_key_from_jwt(token).key
                claims = jwt.decode(
                    token,
                    signing_key,
                    algorithms=[algorithm],
                    audience=self.audience,
                    issuer=self.issuer,
                )
            elif algorithm == "HS256" and self.jwt_secret:
                claims = jwt.decode(
                    token,
                    self.jwt_secret,
                    algorithms=["HS256"],
                    audience=self.audience,
                    issuer=self.issuer,
                )
            else:
                raise ValueError("unsupported JWT signing configuration")
        except Exception as exc:
            raise HTTPException(status_code=401, detail="invalid authentication token") from exc

        user_id = claims.get("sub")
        if not isinstance(user_id, str) or not user_id:
            raise HTTPException(status_code=401, detail="authentication token has no subject")

        role = claims.get("role")
        return AuthenticatedUser(user_id=user_id, role=role if isinstance(role, str) else None)
