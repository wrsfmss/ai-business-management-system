import time

import jwt
import pytest
from fastapi import HTTPException

from brahma.backend.auth import SupabaseAuthVerifier


SECRET = "test-secret-that-is-long-enough-for-hs256"
ISSUER = "https://example.supabase.co/auth/v1"


def _token(**overrides) -> str:
    claims = {
        "sub": "00000000-0000-0000-0000-000000000001",
        "role": "authenticated",
        "aud": "authenticated",
        "iss": ISSUER,
        "iat": int(time.time()),
        "exp": int(time.time()) + 300,
    }
    claims.update(overrides)
    return jwt.encode(claims, SECRET, algorithm="HS256")


def test_supabase_auth_accepts_valid_hs256_token() -> None:
    verifier = SupabaseAuthVerifier(
        enabled=True,
        issuer=ISSUER,
        audience="authenticated",
        jwt_secret=SECRET,
    )
    user = verifier.verify(f"Bearer {_token()}")
    assert user.user_id == "00000000-0000-0000-0000-000000000001"
    assert user.role == "authenticated"


def test_supabase_auth_rejects_bad_signature() -> None:
    verifier = SupabaseAuthVerifier(
        enabled=True,
        issuer=ISSUER,
        audience="authenticated",
        jwt_secret=SECRET,
    )
    bad = jwt.encode(
        {
            "sub": "user",
            "aud": "authenticated",
            "iss": ISSUER,
            "iat": int(time.time()),
            "exp": int(time.time()) + 300,
        },
        "wrong-secret",
        algorithm="HS256",
    )
    with pytest.raises(HTTPException) as exc:
        verifier.verify(f"Bearer {bad}")
    assert exc.value.status_code == 401


def test_supabase_auth_rejects_wrong_audience() -> None:
    verifier = SupabaseAuthVerifier(
        enabled=True,
        issuer=ISSUER,
        audience="authenticated",
        jwt_secret=SECRET,
    )
    with pytest.raises(HTTPException) as exc:
        verifier.verify(f"Bearer {_token(aud='anon')}")
    assert exc.value.status_code == 401


def test_supabase_auth_fails_closed_when_disabled() -> None:
    verifier = SupabaseAuthVerifier(enabled=False)
    with pytest.raises(HTTPException) as exc:
        verifier.verify("Bearer anything")
    assert exc.value.status_code == 503
