# BRAHMA JARVIS Phase 5 acceptance

## Scope

This document is the acceptance contract for the durable attention/reconciliation boundary. AXIS PRIME is explicitly out of scope and must not be imported, configured, migrated, or deployed.

## Runtime path

```text
iPad / API client
  -> FastAPI
  -> verified Supabase JWT
  -> AttentionService
  -> AttentionRepository
  -> PostgreSQL `brahma_decide_attention()`
  -> durable request state + decision + audit + idempotency
```

PostgreSQL/Supabase is authoritative. The client is never authoritative.

## Required environment

```bash
export BRAHMA_DATABASE_URL='postgresql://...'
export BRAHMA_SUPABASE_AUTH_ENABLED='true'
export SUPABASE_URL='https://<project>.supabase.co'
export SUPABASE_JWT_AUDIENCE='authenticated'
```

For legacy HS256 Supabase projects only, `SUPABASE_JWT_SECRET` may be supplied. Prefer Supabase asymmetric signing/JWKS.

## Local acceptance

1. Create a disposable PostgreSQL database.
2. Apply `brahma/migrations/*.sql` in lexical order.
3. Install `brahma/requirements.txt`.
4. Run:

```bash
python -m pytest -q brahma/tests/integration
```

The real-DB suite must prove:

- a pending attention request can be approved;
- the request becomes `approved`;
- exactly one decision row exists;
- exactly one attention audit event exists;
- the same idempotency key returns the same result;
- two concurrent submissions with the same key create one decision and one audit event;
- a second transition using a new key is rejected.

## CI acceptance

`.github/workflows/brahma-real-db-acceptance.yml` provisions PostgreSQL on the GitHub runner, applies all migrations through psycopg, and executes the complete integration suite.

A green CI run is required before claiming Phase 5 real-DB acceptance.

## Production authentication

The API fails closed unless `BRAHMA_SUPABASE_AUTH_ENABLED=true`. JWTs are validated for signature, algorithm, issuer, audience, expiry and subject. Raw Bearer tokens are never interpreted as user IDs.

## iPad compatibility

The BRAHMA API is HTTP/JSON and therefore can be consumed by a native SwiftUI iPad client. The iPad client must store only presentation/session state and must reload authoritative conversation/task/attention state from the backend after restart.

## Completion gates

- [x] Durable Phase 5 core schema
- [x] Atomic execution reconciliation RPC
- [x] Durable attention schema
- [x] Atomic attention decision RPC
- [x] PostgreSQL adapter
- [x] FastAPI approval endpoint
- [x] Supabase JWT verification boundary
- [x] Real-DB integration test suite
- [x] CI workflow
- [ ] Green GitHub Actions real-DB run
- [ ] Disposable-DB failure-injection run
- [ ] Production Supabase deployment smoke test
- [ ] iPad authenticated end-to-end smoke test

Do not mark the final four gates complete without execution evidence.
